# 🌿 BotaniLedger

> **Immutable Traceability for the Botanical Supply Chain**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/Shravanis30/BotaniLedger)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Framework: React](https://img.shields.io/badge/Framework-React_19-blue.svg)](https://react.dev/)
[![Backend: Node.js](https://img.shields.io/badge/Backend-Node.js-green.svg)](https://nodejs.org/)
[![Blockchain: Hyperledger](https://img.shields.io/badge/Blockchain-Hyperledger_Fabric-36A2EB.svg)](https://www.hyperledger.org/use/fabric)

BotaniLedger is a state-of-the-art supply chain transparency platform designed for the botanical and AYUSH industry. By leveraging **Hyperledger Fabric Blockchain**, **AI-driven Species Verification**, and **IPFS**, BotaniLedger ensures that every botanical ingredient is authentic, high-quality, and ethically sourced from farm to pharmacy.

---

## 🚀 Key Features

### 👤 Stakeholder Ecosystem
- **Farmers**: AI-verified collection logging with offline-first synchronization.
- **Testing Labs**: Issuance of digital quality certificates anchored to the ledger.
- **Manufacturers**: Real-time batch verification, product building, and consumer QR generation.
- **Regulators**: Full audit trails, anomaly detection, and supply chain health analytics.
- **AYUSH Admin**: Centralized stakeholder approval and network governance.

### 🛡️ Core Technologies
- **AI Verification**: Integration with Google Cloud Vision for real-time botanical species identification.
- **Blockchain Core**: Immutable records powered by Hyperledger Fabric to prevent data tampering.
- **Decentralized Storage**: Large assets and certificates stored on IPFS via Pinata.
- **QR Authentication**: End-to-end traceability accessible via secure QR codes for batch verification.
- **Offline Sync**: Zustand-powered local state management for reliable operations in low-connectivity farming zones.

---

## 🛠️ Tech Stack

**Frontend**
- React 19 (Vite)
- Tailwind CSS (Premium UI/UX)
- Framer Motion (Micro-animations)
- Lucide React (Iconography)
- TanStack Query (Data Fetching)
- Zustand (State Management)

**Backend**
- Node.js & Express
- MongoDB (Stakeholder Metadata)
- Redis (Caching & Rate Limiting)
- JWT (Secure Authentication)
- Multer (File Processing)

**Infrastructure & Services**
- Hyperledger Fabric (Private Blockchain)
- Google Cloud Vision API (Species AI)
- Pinata / IPFS (Decentralized Storage)
- Firebase Admin (Notifications)
- Nodemailer (Secure Alerts)

---

## 🏗️ Architecture: How It Works

1.  **Registration & Approval**: Every stakeholder (Farmer, Lab, Manufacturer) registers and must be vetted and activated by the AYUSH Ministry Admin.
2.  **Collection & AI Verification**: Farmers capture images of botanical collections. The system uses Google Cloud Vision to verify the species against metadata.
3.  **Quality Certification**: Labs perform tests and upload certificates. The system anchors the record hash to the Hyperledger blockchain.

> [!TIP]
> For a detailed technical breakdown of the system data flow and security, see our [Architecture Guide](docs/ARCHITECTURE.md).

---

## 💻 Setup Instructions

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (Local or Atlas)
- **Redis** server
- **Hyperledger Fabric** Environment (Optional for local dev, mock used if unavailable)
- **Google Cloud** API Key (Vision API)

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Shravanis30/BotaniLedger.git
    cd BotaniLedger
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory based on `.env.example`:
    ```bash
    cp .env.example .env
    ```
    *Fill in your MongoDB URI, Redis URL, JWT Secrets, Pinata Keys, and GCloud Credentials.*

4.  **Run Development Servers**

    **Backend:**
    ```bash
    npm run backend
    ```

    **Frontend:**
    ```bash
    npm run dev
    ```

    **AI Verification Service:**
    ```bash
    cd ai-service
    # Create and activate virtual environment
    python3 -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    # Install dependencies
    pip install -r requirements.txt
    # Run server
    python main.py
    ```

---

## 📁 Project Structure

```text
BotaniLedger/
├── src/
│   ├── components/      # Reusable UI components
│   ├── lib/             # API clients, store (Zustand), and utilities
│   ├── pages/           # Role-based dashboards (Admin, Farmer, Lab, etc.)
│   ├── services/        # Frontend logic services
│   └── App.jsx          # Route definitions & entry
├── blockchain/          # Chaincode and Fabric configuration
├── ai-service/          # Python/Node scripts for botanical verification
├── server.js            # Express server entry point
└── public/              # Static assets and site manifest
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚀 Deployment Guide

### Backend (Render)
1. **Create Web Service**: Connect your GitHub repository to [Render](https://render.com).
2. **Environment Variables**: Add all variables from `.env` to the Render Dashboard.
   - Set `NODE_ENV=production`
   - Set `PORT=5080` (or leave default and Render will provide one)
   - Set `CORS_ORIGIN=https://your-frontend.vercel.app`
3. **Build & Start**:
   - Build Command: `npm install`
   - Start Command: `npm start`

### Frontend (Vercel)
1. **Connect Repo**: Import your project into [Vercel](https://vercel.com).
2. **Framework**: Select **Vite** as the framework preset.
3. **Overriding Settings**:
   - Output Directory: `dist`
4. **Environment Variables**:
   - Add `VITE_API_URL=https://your-backend-url.onrender.com/api/v1`
5. **Route Handling**: Vercel automatically uses the included `vercel.json` to handle SPA routing.

### AI Service (Render / PythonAnywhere)
1. **Create Web Service**: Select the `ai-service` directory (or use a separate repo).
2. **Environment**: Python 3.10+.
3. **Commands**:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. **Integration**: Update the `AI_SERVICE_URL` in your **Backend (Render)** environment variables to point to this new AI service URL.

### Blockchain (Kaleido)
The project is pre-configured for **Hyperledger Fabric** on Kaleido.
1. **Login to Kaleido**: Use your existing credentials (found in `.env`).
2. **Upload Chaincode**:
   - Navigate to **Chaincode** > **Deploy New**.
   - Upload the `botaniledger.zip` located in `blockchain/chaincode/botanyledger/`.
3. **Instantiate**: Deploy the chaincode to your channel (default is `default-channel`).
4. **App Credentials**: Ensure `FABRIC_AUTH` in your backend env vars matches the App Creds generated in the Kaleido dashboard.

---

### Alternative Deployment Options
- **Railway**: Great for full-stack apps with easy database setup.
- **DigitalOcean App Platform**: Robust PaaS for production scaling.
- **AWS Amplify / App Runner**: Scalable enterprise-grade deployment.
- **Docker**: The project includes a `Dockerfile` for containerized environments.

---

Developed with ❤️ for the **Botanical Transparency Initiative**.
