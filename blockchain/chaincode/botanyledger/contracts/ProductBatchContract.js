'use strict';

const { Contract } = require('fabric-contract-api');

class ProductBatchContract extends Contract {

  async createProductBatch(ctx, productBatchId, productData) {
    const mspId = ctx.clientIdentity.getMSPID();
    if (mspId !== 'ManufacturerOrgMSP') {
      throw new Error('Only ManufacturerOrg can create product batches');
    }

    const data = JSON.parse(productData);

    // Validate linked herb batches
    for (const herbBatchId of data.linkedHerbBatches) {
      const herbBatchData = await ctx.stub.getState(herbBatchId);
      if (!herbBatchData || herbBatchData.length === 0) {
        throw new Error(`HerbBatch ${herbBatchId} does not exist`);
      }
      const herbBatch = JSON.parse(herbBatchData.toString());

      if (herbBatch.labResult?.result !== 'PASS') {
        throw new Error(`HerbBatch ${herbBatchId} has not passed lab testing`);
      }

      if (new Date(herbBatch.labResult.validUntil) < new Date()) {
        throw new Error(`HerbBatch ${herbBatchId} lab certificate has expired`);
      }

      if (herbBatch.status !== 'MANUFACTURER_APPROVED') {
        throw new Error(`HerbBatch ${herbBatchId} not approved by manufacturer`);
      }

      if (!herbBatch.custodyTransferComplete) {
        throw new Error(`HerbBatch ${herbBatchId} custody transfer incomplete`);
      }
    }

    const productBatch = {
      productBatchId,
      manufacturerId: ctx.clientIdentity.getID(),
      productName: data.productName,
      productType: data.productType,
      linkedHerbBatches: data.linkedHerbBatches,
      manufacturingDate: data.manufacturingDate,
      expiryDate: data.expiryDate,
      quantity: data.quantity,
      qrUrl: `https://botanyledger.com/verify/${productBatchId}`,
      status: 'ACTIVE',
      integrityVerified: true,
      createdAt: new Date().toISOString(),
      docType: 'productBatch'
    };

    await ctx.stub.putState(productBatchId, Buffer.from(JSON.stringify(productBatch)));

    ctx.stub.setEvent('ProductBatchCreated', Buffer.from(JSON.stringify({
      productBatchId,
      linkedCount: data.linkedHerbBatches.length
    })));

    return JSON.stringify(productBatch);
  }

  async getProductBatch(ctx, productBatchId) {
    const data = await ctx.stub.getState(productBatchId);
    if (!data || data.length === 0) {
      throw new Error(`Product batch ${productBatchId} does not exist`);
    }
    return JSON.parse(data.toString());
  }
}

module.exports = ProductBatchContract;
