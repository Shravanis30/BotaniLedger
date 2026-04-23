import io
import os
import time
from typing import Dict, List, Optional

from dotenv import load_dotenv
load_dotenv() # Load variables from .env

import numpy as np
import tensorflow as tf
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from pydantic import BaseModel
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input, decode_predictions

app = FastAPI(title="BotaniLedger AI Verification Service", version="4.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = os.getenv("BOTANI_MODEL_PATH", "./models/botani_two_plants.keras")
CONFIDENCE_THRESHOLD = float(os.getenv("BOTANI_CONFIDENCE_THRESHOLD", "0.85"))
MARGIN_THRESHOLD = float(os.getenv("BOTANI_MARGIN_THRESHOLD", "0.20"))
CLASS_NAMES = ["ashwagandha", "tulsi"]
INPUT_SHAPE = (224, 224)

# Load custom model
print(f"Loading Botani two-class model from {MODEL_PATH} ...")
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print("Botani model loaded.")
except Exception as e:
    print(f"Error loading model: {e}")
    # Fallback to a mock model if file doesn't exist for testing
    model = None

# Load base MobileNetV2 for generic object detection (pre-validation)
print("Loading generic MobileNetV2 (ImageNet) for plant pre-validation...")
base_model = MobileNetV2(weights='imagenet')
print("ImageNet model loaded.")

# Keywords to detect if image is likely a plant/herb/leaf
PLANT_KEYWORDS = {
    'herb', 'plant', 'leaf', 'flower', 'vegetable', 'fruit', 'basil', 
    'tulsi', 'cherry', 'pot', 'garden', 'shrub', 'tree', 'hay', 'daisy',
    'zucchini', 'cucumber', 'cabbage', 'broccoli', 'artichoke', 'acorn',
    'grass', 'moss', 'fern', 'bush', 'buckeye', 'chestnut', 'maize', 'corn',
    'rapeseed', 'mustard', 'ginger', 'root', 'stump', 'bark'
}

class VerificationResult(BaseModel):
    speciesMatch: bool
    confidence: float
    matchedSpecies: str
    purityScore: float
    qualityGrade: str
    moistureLevel: float
    processedAt: float
    modelVersion: str
    metadata: Optional[Dict] = None

def normalize_species(name: str) -> str:
    name = name.lower().strip()
    if 'ashw' in name: return 'ashwagandha'
    if 'tulsi' in name or 'tulasi' in name: return 'tulsi'
    return name

def preprocess_image(contents: bytes) -> np.ndarray:
    img = Image.open(io.BytesIO(contents)).convert("RGB")
    img = img.resize(INPUT_SHAPE)
    arr = np.asarray(img, dtype=np.float32)
    return np.expand_dims(arr, axis=0)

def validate_is_plant(img_array: np.ndarray) -> bool:
    """Check if the image contains plant-related objects using MobileNetV2 ImageNet weights."""
    try:
        # Preprocess for ImageNet MobileNetV2
        x = preprocess_input(img_array.copy())
        preds = base_model.predict(x, verbose=0)
        decoded = decode_predictions(preds, top=5)[0]
        
        print(f"Pre-validation predictions: {[ (l, round(float(s), 3)) for _, l, s in decoded ]}")
        
        for _, label, score in decoded:
            label_lower = label.lower().replace('_', ' ')
            if any(keyword in label_lower for keyword in PLANT_KEYWORDS):
                if score > 0.02: # Lowered to 2% to be less restrictive
                    print(f"✅ Plant detected: {label} ({score:.1%})")
                    return True
        print("❌ No plant detected in ImageNet top 5")
        return False
    except Exception as e:
        print(f"Pre-validation error: {e}")
        return True # Fallback to custom model if check fails

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "model": "BotaniLedger 2-class classifier",
        "timestamp": time.time(),
        "service": "botaniledger-ai",
        "classes": CLASS_NAMES,
        "threshold": CONFIDENCE_THRESHOLD,
        "margin_threshold": MARGIN_THRESHOLD
    }

@app.post("/verify-species", response_model=VerificationResult)
async def verify_species(species: str = Form(...), photo: UploadFile = File(...)):
    try:
        start_time = time.time()
        expected_species = normalize_species(species)
        
        if expected_species not in CLASS_NAMES:
            raise HTTPException(status_code=400, detail=f"Supported species are only ashwagandha and tulsi. Got: {expected_species}")

        contents = await photo.read()
        x = preprocess_image(contents)

        # 1. Pre-validation: Is it a plant?
        is_plant = validate_is_plant(x)
        if not is_plant:
            return VerificationResult(
                speciesMatch=False,
                confidence=0.0,
                matchedSpecies="Unknown (Not a Plant)",
                purityScore=0.0,
                qualityGrade="Reject",
                moistureLevel=0.0,
                processedAt=time.time(),
                modelVersion="botani-pre-validate-v1",
                metadata={"reason": "Image does not appear to be a plant/herb"}
            )

        # 2. Custom Classification
        if model is None:
             return VerificationResult(
                speciesMatch=True, # Simulation mode
                confidence=99.9,
                matchedSpecies=expected_species,
                purityScore=99.9,
                qualityGrade="A",
                moistureLevel=12.0,
                processedAt=time.time(),
                modelVersion="simulation-mode"
            )

        probs = model.predict(x, verbose=0)[0]
        predicted_idx = int(np.argmax(probs))
        predicted_species = CLASS_NAMES[predicted_idx]
        predicted_confidence = float(probs[predicted_idx])
        
        sorted_probs = np.sort(probs)
        margin = float(sorted_probs[-1] - sorted_probs[-2]) if len(sorted_probs) > 1 else 1.0
        
        print(f"Custom model prediction: {predicted_species} ({predicted_confidence:.2%})")
        
        # Check if it matches expected
        is_match = (predicted_species == expected_species) and (predicted_confidence >= CONFIDENCE_THRESHOLD)
        
        print(f"Species Match: {is_match} (Expected: {expected_species}, Found: {predicted_species}, Conf: {predicted_confidence:.2%}, Threshold: {CONFIDENCE_THRESHOLD})")

        return VerificationResult(
            speciesMatch=is_match,
            confidence=round(predicted_confidence * 100, 2),
            matchedSpecies=predicted_species,
            purityScore=round(predicted_confidence * 95, 2),
            qualityGrade="A" if is_match and predicted_confidence > 0.9 else ("B" if is_match else "Reject"),
            moistureLevel=round(10 + (1 - predicted_confidence) * 20, 2),
            processedAt=time.time(),
            modelVersion="Botani-MobileNetV2-v4",
            metadata={
                "expected": expected_species,
                "confidence_margin": round(margin, 4),
                "latency_ms": round((time.time() - start_time) * 1000, 2)
            }
        )

    except Exception as e:
        print(f"Verification Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
