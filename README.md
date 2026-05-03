<p align="center">
  <img src="https://img.shields.io/badge/🌿-BotaniLedger-2E7D32?style=for-the-badge&labelColor=1B5E20" alt="BotaniLedger" />
</p>

<h1 align="center">🌿 BotaniLedger</h1>

<p align="center">
  <strong>Blockchain-Powered Traceability for the Botanical & AYUSH Supply Chain</strong>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/build-passing-brightgreen.svg?style=flat-square" alt="Build"/></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square" alt="MIT"/></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React 19"/></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js" alt="Node.js"/></a>
  <a href="https://www.hyperledger.org/use/fabric"><img src="https://img.shields.io/badge/Hyperledger-Fabric-36A2EB?style=flat-square" alt="Fabric"/></a>
  <a href="#"><img src="https://img.shields.io/badge/AI-MobileNetV2_CNN-FF6F00?style=flat-square&logo=tensorflow" alt="AI"/></a>
  <a href="#"><img src="https://img.shields.io/badge/IPFS-Pinata-65C2CB?style=flat-square&logo=ipfs" alt="IPFS"/></a>
  <a href="#"><img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb" alt="MongoDB"/></a>
</p>

---

## 📖 Overview

**BotaniLedger** is a production-grade, full-stack supply chain transparency platform purpose-built for India's **₹40,000 Cr+ AYUSH & botanical industry**. It guarantees ingredient authenticity from **farm to pharmacy** by combining:

- 🧠 **Custom CNN AI** — A MobileNetV2-based species classifier trained on Ashwagandha & Tulsi
- ⛓️ **Hyperledger Fabric** — Private permissioned blockchain for immutable batch lifecycle records
- 📦 **IPFS (Pinata)** — Decentralized storage for collection photos & lab certificates
- 🔍 **Anomaly Detection Engine** — Geo-inconsistency, duplicate photo, and rapid-submission fraud detection
- 📱 **Offline-First Architecture** — Zustand + localStorage sync for rural farming zones

> Unlike generic supply chain trackers, BotaniLedger is **domain-specific** to botanical herbs, integrating AI species verification directly into the collection workflow and enforcing AYUSH Ministry governance through a multi-role approval system.

---

## 🏗️ System Architecture (High-Level)

```mermaid
flowchart TD
    %% Block Diagram Routing
    %%{init: {'flowchart': {'curve': 'stepBefore'}}}%%

    subgraph Clients [" "]
        direction LR
        Farmer["100"]
        Lab["101"]
        Mfg["102"]
        Admin["103"]
    end

    Gateway["104"]
    Business["105"]

    subgraph Core [" "]
        direction LR
        AI["106"]
        BC["107"]
        Storage["108"]
    end

    Verify["109"]
    
    subgraph OutputLayer [" "]
        direction LR
        Portal["110"]
        FinalOut["111"]
    end

    %% Connections
    Farmer --> Gateway
    Lab --> Gateway
    Mfg --> Gateway
    Admin --> Gateway

    Gateway --> Business

    Business --> AI
    Business --> BC
    Business --> Storage

    AI --> Verify
    BC --> Verify
    Storage --> Verify

    Verify --> Portal
    Portal --> FinalOut

    %% Styling
    classDef default fill:#f8fafc,stroke:#94a3b8,stroke-width:2px,color:#0f172a,rx:4px,ry:4px;
    classDef gateway fill:#bfdbfe,stroke:#2563eb,stroke-width:2px;
    classDef logic fill:#e2e8f0,stroke:#475569,stroke-width:2px;
    classDef core fill:#bbf7d0,stroke:#16a34a,stroke-width:2px;
    classDef verify fill:#fef08a,stroke:#ca8a04,stroke-width:2px;
    classDef client fill:#ffedd5,stroke:#c2410c,stroke-width:2px;
    classDef delivery fill:#f3e8ff,stroke:#9333ea,stroke-width:2px;

    class Farmer,Lab,Mfg,Admin client;
    class Gateway gateway;
    class Business logic;
    class AI,BC,Storage core;
    class Verify verify;
    class Portal,FinalOut delivery;
```

---

## 🔄 Complete Workflow Block Diagram

```mermaid
flowchart TD
    %% Phase 0: Setup
    subgraph Setup ["🛡️ Registration & Governance"]
        Reg["Stakeholder<br/>Registration"] --> Gate["AYUSH Admin<br/>Approval"]
        Gate -- Reject --> Disabled["Account<br/>Disabled"]
        Gate -- Approve --> Access["System Access"]
    end

    %% Phase 1: Farmer
    subgraph Farmer_Phase ["🧑‍🌾 Phase 1: Farmer Collection"]
        direction TB
        Collection["1. Record Collection<br/>(5 Photos, GPS, Qty)"]
        AI_Check["2. AI Verification<br/>(MobileNet + CNN)"]
        AI_Fail["Reject<br/>(< 85% Confidence)"]
        IPFS_Upload["3. Upload to IPFS<br/>(Deduplication Hash)"]
        Anomaly["4. Anomaly Detection<br/>(Geo, Time, Rapid)"]
        BC_Pending["5. Anchor to Blockchain<br/>(Status: PENDING)"]
        Dispatch["6. Dispatch Batch<br/>(Status: IN_TRANSIT)"]

        Collection --> AI_Check
        AI_Check -- Fail --> AI_Fail
        AI_Check -- Pass --> IPFS_Upload
        IPFS_Upload --> Anomaly
        Anomaly --> BC_Pending
        BC_Pending --> Dispatch
    end

    %% Phase 2: Lab
    subgraph Lab_Phase ["🧪 Phase 2: Lab Testing"]
        direction TB
        ReceiveSample["7. Receive Sample"]
        TestSample["8. Comprehensive Test<br/>(Metals, Microbio)"]
        UploadCert["9. Upload Cert to IPFS"]
        BC_Passed["10. Anchor Results<br/>(Status: LAB_PASSED)"]

        ReceiveSample --> TestSample
        TestSample --> UploadCert
        UploadCert --> BC_Passed
    end

    %% Phase 3: Manufacturer
    subgraph Mfg_Phase ["🏭 Phase 3: Manufacturing"]
        direction TB
        Arrival["11. Verify Arrival Photos"]
        Sim_Score["12. Photo Similarity"]
        Sim_Fail["Reject<br/>(Adulteration)"]
        Build["13. Build Product Batch"]
        Gen_QR["14. Generate HMAC QR"]
        
        Arrival --> Sim_Score
        Sim_Score -- "< 70% (Red)" --> Sim_Fail
        Sim_Score -- "≥ 70% (Green/Yellow)" --> Build
        Build --> Gen_QR
    end

    %% Phase 4: Consumer
    subgraph Consumer_Phase ["🛒 Consumer Verification"]
        Scan["15. Scan QR Code"]
        Portal["16. Public Verify Portal<br/>(Full Provenance)"]
        Scan --> Portal
    end

    %% Cross-phase connections
    Access --> Collection
    BC_Pending -.-> ReceiveSample
    BC_Passed -.-> Dispatch
    Dispatch -.-> Arrival
    Gen_QR -.-> Scan

    %% Styling
    classDef role fill:#f1f5f9,stroke:#475569,stroke-width:2px;
    classDef farmer fill:#dcfce7,stroke:#166534,stroke-width:2px;
    classDef lab fill:#dbeafe,stroke:#1e3a8a,stroke-width:2px;
    classDef mfg fill:#fef3c7,stroke:#b45309,stroke-width:2px;
    classDef consumer fill:#f3e8ff,stroke:#6b21a8,stroke-width:2px;
    classDef check fill:#ffedd5,stroke:#c2410c,stroke-width:2px;
    classDef db fill:#ecfccb,stroke:#4d7c0f,stroke-width:2px;
    classDef bc fill:#fce7f3,stroke:#be185d,stroke-width:2px;

    class Reg,Gate,Disabled,Access role;
    class Collection,Dispatch farmer;
    class ReceiveSample,TestSample lab;
    class Arrival,Build mfg;
    class Scan,Portal consumer;
    class AI_Check,Anomaly,Sim_Score,Gen_QR check;
    class IPFS_Upload,UploadCert db;
    class BC_Pending,BC_Passed bc;
```

### 📝 Workflow Description (Step-by-Step)

**Step 1 — Stakeholder Registration & Approval:**
Every participant (Farmer, Lab, Manufacturer, Regulator) registers on the platform with their organization details and license number. Accounts enter a `pending` state and remain inactive until the **AYUSH Ministry Admin** manually reviews and approves them. This ensures only verified, real-world entities participate in the supply chain — preventing ghost accounts and unauthorized access.

**Step 2 — Farmer Records a Herb Collection:**
Farmers in the field capture **5 standardized photos** (macro, texture, bulk, packaging, context) of their botanical harvest along with GPS coordinates, species name, quantity, and collection date. If the farmer is in a low-connectivity rural area, the data is stored locally using the **offline-first Zustand store** and synced automatically when internet is available.

**Step 3 — AI Species Verification (Two-Stage):**
The uploaded photo passes through a **two-stage AI pipeline**. First, a pre-trained **MobileNetV2 (ImageNet)** model checks whether the image is actually a plant (filtering out non-botanical uploads). If it passes, the image is sent to a **custom-trained CNN** (Ashwagandha vs Tulsi classifier) running on a FastAPI microservice. The system returns a confidence score, purity rating, quality grade (A/B/Reject), and moisture estimate. Only batches with **≥85% confidence** proceed.

**Step 4 — IPFS Upload & Image Deduplication:**
All 5 photos are uploaded as a folder to **IPFS via Pinata**, generating a unique Content Identifier (CID). Before upload, each image is hashed with **SHA-256** and checked against the database to prevent reuse of previously submitted photos across different batches — a key anti-fraud measure.

**Step 5 — Anomaly Detection:**
The system automatically scans for suspicious patterns: (a) **Duplicate IPFS CIDs** — same photos reused by different farmers, (b) **Geo-inconsistency** — two batches from the same farmer registered 100km+ apart within 4 hours, (c) **Rapid submission** — more than 10 batches/hour from one farmer. Flagged anomalies are surfaced to the Admin dashboard with severity levels (MEDIUM / HIGH / CRITICAL).

**Step 6 — Blockchain Anchoring:**
The batch record (hash, timestamp, farmer ID, AI results, IPFS CID) is committed to the **Hyperledger Fabric** ledger via chaincode. The batch enters `PENDING` status. The blockchain ensures this record is **immutable** — no single party can alter it retroactively.

**Step 7 — Lab Testing & Certification:**
A certified lab receives the physical sample linked to the Batch ID. They perform comprehensive testing: **heavy metals** (lead, mercury, arsenic, cadmium), **pesticide residues**, **microbiology** (E. coli, Salmonella), **physicochemical properties** (ash content, extractive values, moisture), and **active ingredient** concentration. Results are uploaded as an encrypted PDF to **IPFS**, and the CID is anchored to the blockchain. The batch moves to `LAB_PASSED` or `LAB_FAILED`.

**Step 8 — Farmer Dispatches to Manufacturer:**
Once lab-certified, the farmer dispatches the batch. The chaincode records transport mode, estimated arrival, and a digital farmer signature. The batch status changes to `IN_TRANSIT`.

**Step 9 — Manufacturer Verifies Arrivals:**
When the batch arrives, the manufacturer takes new photos and the system runs a **photo similarity check** comparing arrival photos against the original collection photos. Scores are categorized: **≥90% = GREEN** (auto-approved), **70–89% = YELLOW** (pending QC review), **<70% = RED** (rejected — potential adulteration, triggers `AdulterationDetected` blockchain event).

**Step 10 — Product Building & QR Generation:**
The manufacturer links one or more approved herb batches into a final **Product Batch** (tablet, capsule, oil, powder, etc.). The system performs **integrity checks** — verifying all linked batches are lab-passed, similarity-approved, and custody-transferred. An **HMAC-signed QR code** is generated containing a cryptographic signature that prevents URL tampering.

**Step 11 — Consumer Verification:**
End consumers scan the QR code on the product, which opens a **public verification portal**. The portal displays the complete provenance chain: farmer details, collection location, AI verification results, lab test reports, manufacturer info, and blockchain transaction IDs — providing full **farm-to-pharmacy transparency** without requiring login.

---

## ⭐ Features

### 🧠 AI-Powered Species Verification (Unique)
- **Two-stage pipeline**: ImageNet MobileNetV2 pre-validates if image is a plant, then custom CNN classifies Ashwagandha vs Tulsi
- Confidence threshold: **85%** with margin analysis
- Purity scoring, quality grading (A/B/Reject), moisture estimation
- FastAPI microservice with TensorFlow backend

### ⛓️ Hyperledger Fabric Blockchain
- **2 Smart Contracts**: `HerbBatchContract` (8 functions) + `ProductBatchContract` (2 functions)
- MSP-based access control (FarmerOrg, LabOrg, ManufacturerOrg)
- Chaincode events: `BatchRegistered`, `LabResultRecorded`, `CustodyTransferComplete`, `AdulterationDetected`, `BatchRecalled`
- Kaleido-hosted with gRPC + TLS + Basic Auth

### 🛡️ Multi-Layer Anomaly Detection (Unique)
| Check | Severity | Trigger |
|-------|----------|---------|
| Duplicate IPFS CID | HIGH | Same photos reused across batches |
| Geo-Inconsistency | CRITICAL | 100km+ apart within 4 hours |
| Rapid Submissions | MEDIUM | >10 batches/hour from same farmer |
| Expired Certificate | HIGH | Lab cert past validity |

### 🔐 Trust Scoring Engine (Unique)
Weighted stakeholder reputation: **Lab Pass Rate (40%) + AI Similarity (35%) + On-Time Handover (25%)**

### 📦 Decentralized Storage (IPFS)
- Multi-gateway fallback (Pinata → Cloudflare → dweb.link → ipfs.io)
- Folder-level CID for batch photo collections
- SHA-256 image deduplication before upload

### 📴 Offline-First for Rural Areas
- Zustand + localStorage persistence
- Queue-based sync with retry logic
- Auto-detect connectivity via browser events

### 👥 5-Role RBAC System
| Role | Capabilities |
|------|-------------|
| **Farmer** | Record collection, AI verify, dispatch, sync offline |
| **Lab** | Test batches, issue certificates, upload to IPFS |
| **Manufacturer** | Verify arrivals, similarity check, build products, generate QR |
| **AYUSH Admin** | Approve stakeholders, anomaly alerts, batch explorer, farmer registry |
| **Regulator** | Audit trails, trend analytics, anomaly reports |

### 🔔 Multi-Channel Notifications
- Firebase Cloud Messaging (push)
- Nodemailer SMTP (email alerts)

### 📊 QR-Based Consumer Verification
- HMAC-signed URLs prevent tampering
- Public portal shows full provenance chain

---

## 🏗️ Batch Lifecycle States

```mermaid
stateDiagram-v2
    [*] --> PENDING
    PENDING --> LAB_TESTING
    LAB_TESTING --> LAB_PASSED
    LAB_TESTING --> LAB_FAILED
    LAB_PASSED --> IN_TRANSIT
    IN_TRANSIT --> RECEIVED
    RECEIVED --> PENDING_QC_REVIEW
    PENDING_QC_REVIEW --> MANUFACTURER_APPROVED
    PENDING_QC_REVIEW --> MANUFACTURER_REJECTED
    MANUFACTURER_APPROVED --> QR_GENERATED
    QR_GENERATED --> RECALLED : (if needed)
```

---

## 📁 Project Structure

```
BotaniLedger/
├── 📄 server.js                    # Express entry point
├── 📄 package.json                 # Dependencies & scripts
├── 📄 vite.config.mjs              # Vite bundler config
├── 📄 vercel.json                  # SPA routing for Vercel
│
├── 📂 src/
│   ├── 📄 App.jsx                  # Route definitions (30+ routes)
│   ├── 📄 main.jsx                 # React DOM entry
│   ├── 📄 app.js                   # Express app setup + middleware
│   │
│   ├── 📂 config/                  # Environment configs
│   │   ├── database.js             # MongoDB connection
│   │   ├── redis.js                # Redis client
│   │   ├── fabric.js               # Hyperledger Fabric config
│   │   ├── ipfs.js                 # Pinata/IPFS config
│   │   └── environment.js          # Env variable validation
│   │
│   ├── 📂 models/                  # Mongoose schemas (8 models)
│   │   ├── User.js                 # 5 roles, bcrypt, fabric identity
│   │   ├── HerbCollection.js       # Batch with 11 status states
│   │   ├── LabReport.js            # Full phytochemical testing
│   │   ├── ProductBatch.js         # Linked batches + QR + recall
│   │   ├── AnomalyAlert.js         # Fraud detection alerts
│   │   ├── AuditLog.js             # Admin action logging
│   │   ├── ImageAsset.js           # SHA-256 dedup tracking
│   │   └── SyncQueue.js            # Offline sync queue
│   │
│   ├── 📂 controllers/            # Route handlers (7 controllers)
│   │   ├── auth.controller.js      # Login/Register/Refresh
│   │   ├── farmer.controller.js    # Collection + dispatch
│   │   ├── lab.controller.js       # Testing + certification
│   │   ├── manufacturer.controller.js  # Verify + build + QR
│   │   ├── admin.controller.js     # Approvals + governance
│   │   ├── regulator.controller.js # Audit + analytics
│   │   └── verify.controller.js    # Public QR verification
│   │
│   ├── 📂 services/               # Business logic (10 services)
│   │   ├── fabric.service.js       # Blockchain transactions
│   │   ├── ai.service.js           # CNN species verification
│   │   ├── ipfs.service.js         # Pinata upload + retrieval
│   │   ├── anomaly.service.js      # Fraud detection engine
│   │   ├── trust.service.js        # Reputation scoring
│   │   ├── qr.service.js           # HMAC-signed QR generation
│   │   ├── image-dedup.service.js  # SHA-256 duplicate detection
│   │   ├── notification.service.js # Firebase + Email alerts
│   │   ├── sync.service.js         # Offline queue processor
│   │   └── admin.init.js           # Default admin seeding
│   │
│   ├── 📂 middleware/              # Express middleware (6)
│   │   ├── auth.middleware.js      # JWT verification
│   │   ├── rbac.middleware.js      # Role-based access control
│   │   ├── audit.middleware.js     # Action logging
│   │   ├── rateLimit.middleware.js # DDoS protection
│   │   ├── upload.middleware.js    # Multer file handling
│   │   └── validate.middleware.js  # Schema validation
│   │
│   ├── 📂 routes/                  # API routes (7 routers)
│   │   ├── auth.routes.js
│   │   ├── farmer.routes.js
│   │   ├── lab.routes.js
│   │   ├── manufacturer.routes.js
│   │   ├── admin.routes.js
│   │   ├── regulator.routes.js
│   │   └── verify.routes.js
│   │
│   ├── 📂 pages/                   # React pages (22 pages)
│   │   ├── 📂 landing/            # Public landing page
│   │   ├── 📂 auth/               # Login, Register, AwaitingApproval
│   │   ├── 📂 farmer/             # Dashboard, Record, Batches, Sync
│   │   ├── 📂 lab/                # Dashboard, Test, Certificates, Analytics
│   │   ├── 📂 manufacturer/       # Dashboard, Verify, Build, QR, Production
│   │   ├── 📂 admin/              # Dashboard, Approvals, Batches, Farmers, Alerts
│   │   ├── 📂 regulator/          # Portal, Audit, Trends, Reports
│   │   ├── 📂 verify/             # Public QR verification portal
│   │   └── 📂 shared/             # Settings page
│   │
│   ├── 📂 components/shared/      # Reusable UI components (8)
│   │   ├── Header.jsx, Sidebar.jsx, Modal.jsx, UI.jsx
│   │   └── FarmerLayout, LabLayout, AdminLayout, ManufacturerLayout
│   │
│   ├── 📂 lib/                     # Frontend utilities
│   │   ├── api.js                  # Axios client + interceptors
│   │   ├── store.js                # Zustand auth store
│   │   └── offlineStore.js         # Offline-first persistence
│   │
│   └── 📂 utils/                   # Backend utilities
│       ├── crypto.util.js          # HMAC generation
│       ├── geo.util.js             # Haversine distance
│       ├── logger.util.js          # Winston logger
│       └── response.util.js        # Standardized API responses
│
├── 📂 ai-service/                  # Python AI microservice
│   ├── main.py                     # FastAPI + MobileNetV2 + Custom CNN
│   ├── train_two_plants.py         # Model training script
│   ├── requirements.txt            # TensorFlow, FastAPI, Pillow
│   ├── Dockerfile                  # Container config
│   └── start.sh                    # Production startup
│
├── 📂 blockchain/
│   ├── 📂 chaincode/botanyledger/
│   │   ├── contracts/
│   │   │   ├── HerbBatchContract.js    # 8 functions
│   │   │   └── ProductBatchContract.js # 2 functions
│   │   ├── index.js                    # Contract entry
│   │   └── package.json
│   └── 📂 network/                     # Fabric network configs
│
├── 📂 docker/
│   ├── Dockerfile                  # Node.js container
│   ├── docker-compose.prod.yml     # Production orchestration
│   └── 📂 nginx/                   # Reverse proxy config
│
├── 📂 scripts/                     # DevOps scripts
│   ├── deploy-chaincode.sh
│   ├── network-up.sh
│   └── network-down.sh
│
└── 📂 docs/
    └── ARCHITECTURE.md             # Technical architecture guide
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 + Vite 8 | SPA with HMR |
| **Styling** | TailwindCSS 3 | Utility-first responsive design |
| **Animation** | Framer Motion | Micro-interactions & transitions |
| **State** | Zustand 5 | Global auth + offline persistence |
| **Data Fetching** | TanStack Query 5 | Cache, refetch, optimistic updates |
| **Forms** | React Hook Form + Zod | Validated form handling |
| **Charts** | Recharts 3 | Analytics dashboards |
| **Icons** | Lucide React | Modern iconography |
| **Backend** | Node.js + Express 4 | REST API server |
| **Database** | MongoDB + Mongoose 8 | Document store for metadata |
| **Cache** | Redis (ioredis) | Rate limiting + token caching |
| **Auth** | JWT (Access + Refresh) | Stateless authentication |
| **Blockchain** | Hyperledger Fabric | Immutable supply chain records |
| **AI Engine** | TensorFlow + FastAPI | MobileNetV2 species classifier |
| **Storage** | IPFS via Pinata | Decentralized photo/cert storage |
| **Notifications** | Firebase Admin + Nodemailer | Push + email alerts |
| **QR Codes** | qrcode + qrcode.react | HMAC-signed verification codes |
| **Monitoring** | Winston + Prometheus | Logging + metrics |
| **Security** | Helmet + bcrypt + HMAC | Headers, hashing, signatures |
| **Deploy** | Vercel + Render + Docker | Frontend + Backend + Containers |

---

## 🎯 What Makes BotaniLedger Unique

| Feature | BotaniLedger | Generic Supply Chain Apps |
|---------|-------------|--------------------------|
| **Domain-Specific AI** | Custom CNN trained on botanical herbs | No AI or generic image recognition |
| **Two-Stage Verification** | ImageNet pre-filter + Custom classifier | Single model or manual check |
| **Anomaly Detection** | Geo + Photo + Frequency analysis | No fraud detection |
| **Trust Scoring** | Weighted reputation per stakeholder | No reputation system |
| **AYUSH Governance** | Ministry-level admin approval workflow | Self-registration |
| **Offline-First** | Zustand + localStorage for rural areas | Requires constant internet |
| **Image Deduplication** | SHA-256 hash prevents photo reuse | No dedup |
| **Private Blockchain** | Hyperledger Fabric (permissioned) | Public chain or no blockchain |
| **Multi-Gateway IPFS** | 4 fallback gateways for retrieval | Single gateway or centralized |
| **Similarity Scoring** | Photo comparison at manufacturer arrival | No arrival verification |
| **HMAC-Signed QR** | Cryptographically signed verification URLs | Simple QR codes |
| **Batch Recall** | Blockchain event + full trace | No recall mechanism |

---

## 💻 Setup Instructions

### Prerequisites
- **Node.js** v18+
- **MongoDB** (local or Atlas)
- **Redis** server
- **Python** 3.10+ (for AI service)
- **Hyperledger Fabric** environment (optional — uses simulation mode if unavailable)

### Installation

```bash
# 1. Clone
git clone https://github.com/Shravanis30/BotaniLedger.git
cd BotaniLedger

# 2. Install dependencies
npm install

# 3. Environment setup
cp .env.example .env
# Fill in MongoDB URI, Redis URL, JWT secrets, Pinata keys, etc.

# 4. Run Backend
npm run backend        # Express on port 5000

# 5. Run Frontend
npm run dev            # Vite on port 5173

# 6. Run AI Service
cd ai-service
python -m venv venv
venv\Scripts\activate  # Windows (use source venv/bin/activate on Linux)
pip install -r requirements.txt
python main.py         # FastAPI on port 8000
```

---

## 🚀 Deployment

| Service | Platform | Config |
|---------|----------|--------|
| **Frontend** | Vercel | Auto-detect Vite, uses `vercel.json` for SPA routing |
| **Backend** | Render | `npm install` → `npm start` (server.js) |
| **AI Service** | Render / PythonAnywhere | `uvicorn main:app --host 0.0.0.0` |
| **Blockchain** | Kaleido | Upload `botaniledger.zip` chaincode |
| **Database** | MongoDB Atlas | Cloud-hosted cluster |
| **Cache** | Redis Cloud | Managed Redis instance |

---

## 🔑 Environment Variables

| Category | Variables |
|----------|----------|
| **Server** | `NODE_ENV`, `PORT`, `CORS_ORIGIN` |
| **Database** | `MONGODB_URI`, `REDIS_URL` |
| **Auth** | `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` |
| **IPFS** | `PINATA_JWT`, `PINATA_API_KEY`, `PINATA_API_SECRET` |
| **Blockchain** | `FABRIC_CHANNEL`, `FABRIC_CHAINCODE`, `FABRIC_AUTH`, `FABRIC_PEER_*` |
| **AI** | `AI_SERVICE_URL`, `BOTANI_CONFIDENCE_THRESHOLD` |
| **Notifications** | `FIREBASE_*`, `SMTP_*` |
| **QR** | `QR_BASE_URL`, `QR_SECRET` |
| **Monitoring** | `PROMETHEUS_PORT`, `SENTRY_DSN` |

---

## 📄 API Endpoints

| Route Group | Base Path | Auth | Endpoints |
|-------------|-----------|------|-----------|
| Authentication | `/api/v1/auth` | Public | Login, Register, Refresh |
| Farmer | `/api/v1/farmer` | Farmer | Record, Batches, Dispatch, Sync |
| Lab | `/api/v1/lab` | Lab | Start Test, Submit Results, Certificates |
| Manufacturer | `/api/v1/manufacturer` | Manufacturer | Verify, Build Product, QR, Production |
| Admin | `/api/v1/admin` | Admin | Approvals, Users, Alerts, Batches |
| Regulator | `/api/v1/regulator` | Regulator | Audit, Trends, Reports |
| Verify | `/api/v1/verify` | Public | QR-based batch verification |

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---


---

<p align="center">
  Developed with ❤️ for the <strong>Botanical Transparency Initiative</strong><br/>
  
</p>
