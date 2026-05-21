// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title BotaniLedger
 * @dev Consolidated smart contract for tracing Botanical & AYUSH Supply Chain
 */
contract BotaniLedger {
    // --- Roles ---
    bytes32 public constant FARMER_ROLE = keccak256("FARMER_ROLE");
    bytes32 public constant LAB_ROLE = keccak256("LAB_ROLE");
    bytes32 public constant MANUFACTURER_ROLE = keccak256("MANUFACTURER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    mapping(bytes32 => mapping(address => bool)) private _roles;

    // --- Enums ---
    enum BatchStatus {
        PENDING,                 // 0
        LAB_TESTING,             // 1
        LAB_PASSED,              // 2
        LAB_FAILED,              // 3
        IN_TRANSIT,              // 4
        RECEIVED,                // 5
        PENDING_QC_REVIEW,       // 6
        MANUFACTURER_APPROVED,   // 7
        MANUFACTURER_REJECTED,   // 8
        RECALLED                 // 9
    }

    // --- Structs ---
    struct AIVerification {
        bool speciesMatch;
        uint256 confidence; // e.g. 85 for 85%
        uint256 timestamp;
    }

    struct LabResult {
        bool passed;
        string reportCid;
        string reportSummary;
        address certifiedBy;
        uint256 certifiedAt;
        uint256 validUntil;
    }

    struct DispatchInfo {
        address dispatchedBy;
        uint256 dispatchedAt;
        string estimatedArrival;
        string transportMode;
    }

    struct ReceiptInfo {
        address receivedBy;
        uint256 receivedAt;
        string condition;
    }

    struct SimilarityVerification {
        uint256 overallScore; // e.g. 95 for 95%
        string zone; // "GREEN", "YELLOW", "RED"
        address verifiedBy;
        uint256 verifiedAt;
        string arrivalPhotoCids;
    }

    struct HerbBatch {
        string batchId;
        address farmerId;
        string herbSpecies;
        uint256 quantity;
        string collectionDate;
        string location;
        string ipfsFolderCid;
        string photoCids;
        AIVerification aiVerification;
        BatchStatus status;
        LabResult labResult;
        DispatchInfo dispatchInfo;
        ReceiptInfo receiptInfo;
        bool custodyTransferComplete;
        SimilarityVerification similarityVerification;
        string recallReason;
        uint256 createdAt;
        uint256 updatedAt;
    }

    struct ProductBatch {
        string productBatchId;
        address manufacturerId;
        string productName;
        string productType;
        string[] linkedHerbBatches;
        string manufacturingDate;
        string expiryDate;
        uint256 quantity;
        string qrUrl;
        bool integrityVerified;
        bool isActive;
        uint256 createdAt;
    }

    // --- State Variables ---
    mapping(string => HerbBatch) private herbBatches;
    mapping(string => ProductBatch) private productBatches;
    
    // Quick existence checks
    mapping(string => bool) public herbBatchExists;
    mapping(string => bool) public productBatchExists;

    // --- Events ---
    event RoleGranted(bytes32 indexed role, address indexed account);
    event RoleRevoked(bytes32 indexed role, address indexed account);
    event BatchRegistered(string indexed batchId, address indexed farmerId, string herbSpecies);
    event LabResultRecorded(string indexed batchId, bool passed);
    event CustodyTransferComplete(string indexed batchId);
    event AdulterationDetected(string indexed batchId, uint256 score, string zone);
    event BatchRecalled(string indexed batchId, string reason);
    event ProductBatchCreated(string indexed productBatchId, uint256 linkedCount);

    // --- Modifiers ---
    modifier onlyRole(bytes32 role) {
        require(_roles[role][msg.sender], "BotaniLedger: Unauthorized account");
        _;
    }

    constructor() {
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    // --- Role Management ---
    function grantRole(bytes32 role, address account) public onlyRole(ADMIN_ROLE) {
        _grantRole(role, account);
    }

    function revokeRole(bytes32 role, address account) public onlyRole(ADMIN_ROLE) {
        _roles[role][account] = false;
        emit RoleRevoked(role, account);
    }

    function _grantRole(bytes32 role, address account) internal {
        _roles[role][account] = true;
        emit RoleGranted(role, account);
    }

    // --- Herb Batch Functions ---

    function registerBatch(
        string memory batchId,
        string memory herbSpecies,
        uint256 quantity,
        string memory collectionDate,
        string memory location,
        string memory ipfsFolderCid,
        string memory photoCids,
        bool speciesMatch,
        uint256 aiConfidence
    ) public onlyRole(FARMER_ROLE) {
        require(!herbBatchExists[batchId], "Batch already exists");

        HerbBatch storage batch = herbBatches[batchId];
        batch.batchId = batchId;
        batch.farmerId = msg.sender;
        batch.herbSpecies = herbSpecies;
        batch.quantity = quantity;
        batch.collectionDate = collectionDate;
        batch.location = location;
        batch.ipfsFolderCid = ipfsFolderCid;
        batch.photoCids = photoCids;
        
        batch.aiVerification = AIVerification({
            speciesMatch: speciesMatch,
            confidence: aiConfidence,
            timestamp: block.timestamp
        });

        batch.status = BatchStatus.PENDING;
        batch.createdAt = block.timestamp;
        batch.updatedAt = block.timestamp;
        
        herbBatchExists[batchId] = true;

        emit BatchRegistered(batchId, msg.sender, herbSpecies);
    }

    function startLabTesting(string memory batchId) public onlyRole(LAB_ROLE) {
        require(herbBatchExists[batchId], "Batch does not exist");
        HerbBatch storage batch = herbBatches[batchId];
        require(batch.status == BatchStatus.PENDING, "Batch not in PENDING state");

        batch.status = BatchStatus.LAB_TESTING;
        batch.updatedAt = block.timestamp;
    }

    function recordLabResult(
        string memory batchId,
        bool passed,
        string memory reportCid,
        string memory reportSummary
    ) public onlyRole(LAB_ROLE) {
        require(herbBatchExists[batchId], "Batch does not exist");
        HerbBatch storage batch = herbBatches[batchId];
        require(batch.status == BatchStatus.LAB_TESTING, "Batch not in LAB_TESTING state");

        batch.status = passed ? BatchStatus.LAB_PASSED : BatchStatus.LAB_FAILED;
        batch.labResult = LabResult({
            passed: passed,
            reportCid: reportCid,
            reportSummary: reportSummary,
            certifiedBy: msg.sender,
            certifiedAt: block.timestamp,
            validUntil: block.timestamp + (90 days)
        });
        batch.updatedAt = block.timestamp;

        emit LabResultRecorded(batchId, passed);
    }

    function dispatchBatch(
        string memory batchId,
        string memory estimatedArrival,
        string memory transportMode
    ) public onlyRole(FARMER_ROLE) {
        require(herbBatchExists[batchId], "Batch does not exist");
        HerbBatch storage batch = herbBatches[batchId];
        require(batch.status == BatchStatus.LAB_PASSED, "Batch must be LAB_PASSED");
        require(batch.farmerId == msg.sender, "Only the original farmer can dispatch");

        batch.dispatchInfo = DispatchInfo({
            dispatchedBy: msg.sender,
            dispatchedAt: block.timestamp,
            estimatedArrival: estimatedArrival,
            transportMode: transportMode
        });
        batch.status = BatchStatus.IN_TRANSIT;
        batch.updatedAt = block.timestamp;
    }

    function confirmReceipt(
        string memory batchId,
        string memory condition
    ) public onlyRole(MANUFACTURER_ROLE) {
        require(herbBatchExists[batchId], "Batch does not exist");
        HerbBatch storage batch = herbBatches[batchId];
        require(batch.status == BatchStatus.IN_TRANSIT, "Batch must be IN_TRANSIT");

        batch.receiptInfo = ReceiptInfo({
            receivedBy: msg.sender,
            receivedAt: block.timestamp,
            condition: condition
        });
        
        batch.status = BatchStatus.RECEIVED;
        batch.custodyTransferComplete = true;
        batch.updatedAt = block.timestamp;

        emit CustodyTransferComplete(batchId);
    }

    function recordSimilarityResult(
        string memory batchId,
        uint256 overallScore,
        string memory zone,
        string memory arrivalPhotoCids
    ) public onlyRole(MANUFACTURER_ROLE) {
        require(herbBatchExists[batchId], "Batch does not exist");
        HerbBatch storage batch = herbBatches[batchId];
        require(batch.status == BatchStatus.RECEIVED, "Batch must be RECEIVED");

        batch.similarityVerification = SimilarityVerification({
            overallScore: overallScore,
            zone: zone,
            verifiedBy: msg.sender,
            verifiedAt: block.timestamp,
            arrivalPhotoCids: arrivalPhotoCids
        });

        if (overallScore >= 90) {
            batch.status = BatchStatus.MANUFACTURER_APPROVED;
        } else if (overallScore >= 70) {
            batch.status = BatchStatus.PENDING_QC_REVIEW;
        } else {
            batch.status = BatchStatus.MANUFACTURER_REJECTED;
            emit AdulterationDetected(batchId, overallScore, zone);
        }
        
        batch.updatedAt = block.timestamp;
    }

    function recallBatch(string memory batchId, string memory reason) public {
        require(_roles[MANUFACTURER_ROLE][msg.sender] || _roles[LAB_ROLE][msg.sender], "Unauthorized to recall");
        require(herbBatchExists[batchId], "Batch does not exist");
        
        HerbBatch storage batch = herbBatches[batchId];
        batch.status = BatchStatus.RECALLED;
        batch.recallReason = reason;
        batch.updatedAt = block.timestamp;

        emit BatchRecalled(batchId, reason);
    }

    function getHerbBatch(string memory batchId) public view returns (HerbBatch memory) {
        require(herbBatchExists[batchId], "Batch does not exist");
        return herbBatches[batchId];
    }

    // --- Product Batch Functions ---

    function createProductBatch(
        string memory productBatchId,
        string memory productName,
        string memory productType,
        string[] memory linkedHerbBatches,
        string memory manufacturingDate,
        string memory expiryDate,
        uint256 quantity,
        string memory qrUrl
    ) public onlyRole(MANUFACTURER_ROLE) {
        require(!productBatchExists[productBatchId], "Product batch already exists");
        require(linkedHerbBatches.length > 0, "Must link at least one herb batch");

        // Validate linked herb batches
        for (uint i = 0; i < linkedHerbBatches.length; i++) {
            string memory herbId = linkedHerbBatches[i];
            require(herbBatchExists[herbId], "Linked HerbBatch does not exist");
            HerbBatch storage hBatch = herbBatches[herbId];
            
            require(hBatch.labResult.passed, "Linked batch failed lab testing");
            require(hBatch.labResult.validUntil >= block.timestamp, "Lab certificate expired");
            require(hBatch.status == BatchStatus.MANUFACTURER_APPROVED, "Batch not approved by manufacturer");
            require(hBatch.custodyTransferComplete, "Custody transfer incomplete");
        }

        ProductBatch storage pBatch = productBatches[productBatchId];
        pBatch.productBatchId = productBatchId;
        pBatch.manufacturerId = msg.sender;
        pBatch.productName = productName;
        pBatch.productType = productType;
        pBatch.linkedHerbBatches = linkedHerbBatches;
        pBatch.manufacturingDate = manufacturingDate;
        pBatch.expiryDate = expiryDate;
        pBatch.quantity = quantity;
        pBatch.qrUrl = qrUrl;
        pBatch.integrityVerified = true;
        pBatch.isActive = true;
        pBatch.createdAt = block.timestamp;

        productBatchExists[productBatchId] = true;

        emit ProductBatchCreated(productBatchId, linkedHerbBatches.length);
    }

    function getProductBatch(string memory productBatchId) public view returns (ProductBatch memory) {
        require(productBatchExists[productBatchId], "Product batch does not exist");
        return productBatches[productBatchId];
    }
}
