from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import random
import io
import time
from PIL import Image

app = FastAPI(title="BotaniLedger AI Verification Service", version="2.0.0")

class VerificationResult(BaseModel):
    speciesMatch: bool
    confidence: float
    matchedSpecies: str
    purityScore: float
    qualityGrade: str
    moistureLevel: float
    modelVersion: str
    processedAt: float
    metadata: dict

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": time.time(), "service": "botaniledger-ai"}

@app.post("/verify-species", response_model=VerificationResult)
async def verify_species(species: str = Form(...), photo: UploadFile = File(...)):
    try:
        # Read image to verify it's a real file
        start_time = time.time()
        contents = await photo.read()
        img = Image.open(io.BytesIO(contents))
        img_rgb = img.convert('RGB')
        
        # Heuristic: Organic Color Detection
        # Botanical samples (Ashwagandha, Tulsi, etc.) usually have Green, Brown, or Earthy tones.
        width, height = img.size
        samples = 150 # Increased sample size for better "accuracy"
        organic_pixels = 0
        
        for _ in range(samples):
            x = random.randint(0, width - 1)
            y = random.randint(0, height - 1)
            r, g, b = img_rgb.getpixel((x, y))
            
            # Check for "Greenish" (High G)
            is_green = g > r + 10 and g > b + 10
            # Check for "Earthy/Brown" (High R/G, low B)
            is_brown = r > b + 30 and g > b + 10 and abs(r - g) < 60
            
            if is_green or is_brown:
                organic_pixels += 1

        # Calculate metrics
        organic_score = organic_pixels / samples
        
        # Real AI simulation logic:
        # If lower than threshold, it doesn't look like an herb
        if organic_score < 0.12: 
            return {
                "speciesMatch": False,
                "confidence": round(random.uniform(10.0, 45.0), 2),
                "matchedSpecies": "synthetic_or_unknown",
                "purityScore": 0.0,
                "qualityGrade": "Reject",
                "moistureLevel": 0.0,
                "modelVersion": "botaniledger-v2-organic-detect",
                "processedAt": time.time(),
                "metadata": {"organic_score": organic_score, "dims": f"{width}x{height}", "reason": "Low organic texture detected"}
            }

        # Simulate Species-Specific confidence
        species_confidence_base = {
            "Ashwagandha": 95.5,
            "Tulsi": 98.2,
            "Brahmi": 94.0,
            "Neem": 97.8
        }
        
        base_conf = species_confidence_base.get(species, 90.0)
        confidence = round(base_conf + random.uniform(-2.0, 1.5), 2)
        
        # Purity and Quality simulation
        purity = round(organic_score * 100 + random.uniform(-5, 5), 2)
        purity = max(0, min(100, purity))
        
        moisture = round(random.uniform(8.0, 15.0), 2) # Typical herb moisture %
        
        if purity > 90:
            quality = "A+"
        elif purity > 80:
            quality = "B"
        else:
            quality = "C"

        return {
            "speciesMatch": True,
            "confidence": confidence,
            "matchedSpecies": species,
            "purityScore": purity,
            "qualityGrade": quality,
            "moistureLevel": moisture,
            "modelVersion": "botaniledger-v2-organic-detect",
            "processedAt": time.time(),
            "metadata": {
                "organic_score": organic_score, 
                "dims": f"{width}x{height}",
                "latency_ms": round((time.time() - start_time) * 1000, 2)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image file: {str(e)}")

@app.post("/analyze-quality")
async def analyze_quality(batch_id: str = Form(...), photo: UploadFile = File(...)):
    # Simulating a more deep-dive analysis for the Lab/Manufacturer
    try:
        start_time = time.time()
        contents = await photo.read()
        # In a real app, this would use a different model (e.g. counting contaminates or color uniformity)
        purity_score = round(random.uniform(85.0, 99.9), 2)
        return {
            "batchId": batch_id,
            "purityReport": {
                "visualPurity": purity_score,
                "stemsPercentage": round(random.uniform(1.0, 5.0), 2),
                "foreignMatter": round(random.uniform(0.1, 0.8), 2)
            },
            "status": "Verified" if purity_score > 90 else "Review Required",
            "processedAt": time.time()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Processing error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
