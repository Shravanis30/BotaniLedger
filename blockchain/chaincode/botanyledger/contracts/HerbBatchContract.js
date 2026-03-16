'use strict';

const { Contract } = require('fabric-contract-api');

class HerbBatchContract extends Contract {

  async initLedger(ctx) {
    console.log('BotaniLedger HerbBatch chaincode initialized');
  }

  // Register new herb batch from farmer
  async registerBatch(ctx, batchId, batchData) {
    const mspId = ctx.clientIdentity.getMSPID();
    if (mspId !== 'FarmerOrgMSP') {
      throw new Error('Only FarmerOrg members can register batches');
    }

    const exists = await this.batchExists(ctx, batchId);
    if (exists) {
      throw new Error(`Batch ${batchId} already exists`);
    }

    const data = JSON.parse(batchData);
    const batch = {
      batchId,
      farmerId: ctx.clientIdentity.getID(),
      herbSpecies: data.herbSpecies,
      quantity: data.quantity,
      collectionDate: data.collectionDate,
      location: data.location,
      photos: {
        ipfsFolderCid: data.ipfsFolderCid,
        photoCids: data.photoCids
      },
      aiVerification: {
        speciesMatch: data.aiConfidence >= 85,
        confidence: data.aiConfidence,
        timestamp: new Date().toISOString()
      },
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      docType: 'herbBatch'
    };

    await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(batch)));

    ctx.stub.setEvent('BatchRegistered', Buffer.from(JSON.stringify({
      batchId,
      farmerId: batch.farmerId,
      herbSpecies: data.herbSpecies,
      timestamp: batch.createdAt
    })));

    return JSON.stringify(batch);
  }

  async startLabTesting(ctx, batchId) {
    const mspId = ctx.clientIdentity.getMSPID();
    if (mspId !== 'LabOrgMSP') {
      throw new Error('Only LabOrg members can start testing');
    }

    const batch = await this.getBatch(ctx, batchId);
    if (batch.status !== 'PENDING') {
      throw new Error(`Cannot start testing. Batch status is ${batch.status}`);
    }

    batch.status = 'LAB_TESTING';
    batch.labId = ctx.clientIdentity.getID();
    batch.labTestingStartedAt = new Date().toISOString();
    batch.updatedAt = new Date().toISOString();

    await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(batch)));

    return JSON.stringify(batch);
  }

  async recordLabResult(ctx, batchId, result, reportCid, reportData) {
    const mspId = ctx.clientIdentity.getMSPID();
    if (mspId !== 'LabOrgMSP') {
      throw new Error('Only LabOrg members can record lab results');
    }

    const batch = await this.getBatch(ctx, batchId);
    if (batch.status !== 'LAB_TESTING') {
      throw new Error(`Cannot record result. Batch status is ${batch.status}`);
    }

    if (!['PASS', 'FAIL'].includes(result)) {
      throw new Error('Result must be PASS or FAIL');
    }

    batch.status = result === 'PASS' ? 'LAB_PASSED' : 'LAB_FAILED';
    batch.labResult = {
      result,
      reportCid,
      reportSummary: JSON.parse(reportData),
      certifiedBy: ctx.clientIdentity.getID(),
      certifiedAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
    };
    batch.updatedAt = new Date().toISOString();

    await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(batch)));

    ctx.stub.setEvent('LabResultRecorded', Buffer.from(JSON.stringify({
      batchId,
      result,
      certifiedAt: batch.labResult.certifiedAt
    })));

    return JSON.stringify(batch);
  }

  async dispatchBatch(ctx, batchId, dispatchData) {
    const mspId = ctx.clientIdentity.getMSPID();
    if (mspId !== 'FarmerOrgMSP') {
      throw new Error('Only FarmerOrg members can dispatch batches');
    }

    const batch = await this.getBatch(ctx, batchId);
    if (batch.status !== 'LAB_PASSED') {
      throw new Error(`Cannot dispatch. Batch must be LAB_PASSED. Current status: ${batch.status}`);
    }

    const data = JSON.parse(dispatchData);
    batch.dispatch = {
      dispatchedBy: ctx.clientIdentity.getID(),
      dispatchedAt: new Date().toISOString(),
      estimatedArrival: data.estimatedArrival,
      transportMode: data.transportMode,
      farmerSignature: ctx.clientIdentity.getID()
    };
    batch.status = 'IN_TRANSIT';
    batch.updatedAt = new Date().toISOString();

    await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(batch)));
    return JSON.stringify(batch);
  }

  async confirmReceipt(ctx, batchId, receiptData) {
    const mspId = ctx.clientIdentity.getMSPID();
    if (mspId !== 'ManufacturerOrgMSP') {
      throw new Error('Only ManufacturerOrg members can confirm receipt');
    }

    const batch = await this.getBatch(ctx, batchId);
    if (batch.status !== 'IN_TRANSIT') {
      throw new Error(`Cannot confirm receipt. Batch status is ${batch.status}`);
    }

    const data = JSON.parse(receiptData);
    batch.receipt = {
      receivedBy: ctx.clientIdentity.getID(),
      receivedAt: new Date().toISOString(),
      condition: data.condition,
      manufacturerSignature: ctx.clientIdentity.getID()
    };

    if (!batch.dispatch?.farmerSignature) {
      throw new Error('Missing farmer dispatch signature');
    }

    batch.status = 'RECEIVED';
    batch.custodyTransferComplete = true;
    batch.updatedAt = new Date().toISOString();

    await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(batch)));

    ctx.stub.setEvent('CustodyTransferComplete', Buffer.from(JSON.stringify({ batchId })));

    return JSON.stringify(batch);
  }

  async recordSimilarityResult(ctx, batchId, similarityData) {
    const mspId = ctx.clientIdentity.getMSPID();
    if (mspId !== 'ManufacturerOrgMSP') {
      throw new Error('Only ManufacturerOrg members can record similarity');
    }

    const batch = await this.getBatch(ctx, batchId);
    if (batch.status !== 'RECEIVED') {
      throw new Error(`Cannot record similarity. Status is ${batch.status}`);
    }

    const data = JSON.parse(similarityData);
    const score = parseFloat(data.overallScore);

    let zone, status;
    if (score >= 90) {
      zone = 'GREEN';
      status = 'MANUFACTURER_APPROVED';
    } else if (score >= 70) {
      zone = 'YELLOW';
      status = 'PENDING_QC_REVIEW';
    } else {
      zone = 'RED';
      status = 'MANUFACTURER_REJECTED';
    }

    batch.similarityVerification = {
      overallScore: score,
      zone,
      photoScores: data.photoScores,
      verifiedBy: ctx.clientIdentity.getID(),
      verifiedAt: new Date().toISOString(),
      arrivalPhotoCids: data.arrivalPhotoCids
    };

    batch.status = status;
    batch.updatedAt = new Date().toISOString();

    await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(batch)));

    if (zone === 'RED') {
      ctx.stub.setEvent('AdulterationDetected', Buffer.from(JSON.stringify({ batchId, score, zone })));
    }

    return JSON.stringify(batch);
  }

  async recallBatch(ctx, batchId, recallReason) {
    const mspId = ctx.clientIdentity.getMSPID();
    if (!['ManufacturerOrgMSP', 'LabOrgMSP'].includes(mspId)) {
      throw new Error('Unauthorized to recall batches');
    }

    const batch = await this.getBatch(ctx, batchId);
    batch.status = 'RECALLED';
    batch.recallInfo = {
      recalledBy: ctx.clientIdentity.getID(),
      recalledAt: new Date().toISOString(),
      reason: recallReason
    };
    batch.updatedAt = new Date().toISOString();

    await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(batch)));

    ctx.stub.setEvent('BatchRecalled', Buffer.from(JSON.stringify({
      batchId,
      reason: recallReason,
      timestamp: batch.recallInfo.recalledAt
    })));

    return JSON.stringify(batch);
  }

  async getBatch(ctx, batchId) {
    const data = await ctx.stub.getState(batchId);
    if (!data || data.length === 0) {
      throw new Error(`Batch ${batchId} does not exist`);
    }
    return JSON.parse(data.toString());
  }

  async batchExists(ctx, batchId) {
    const data = await ctx.stub.getState(batchId);
    return data && data.length > 0;
  }
}

module.exports = HerbBatchContract;
