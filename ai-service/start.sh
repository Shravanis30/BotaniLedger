#!/bin/bash

# BotaniLedger AI Service Startup Script

echo "🌿 Starting BotaniLedger AI Verification Service..."

# Check if venv exists, if not create it
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate venv
source venv/bin/activate

# Install requirements
echo "📥 Installing/Updating dependencies..."
pip install -r requirements.txt

# Run the service
echo "🚀 Launching FastAPI server on http://localhost:8000"
python main.py
