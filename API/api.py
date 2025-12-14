# uvicorn api:app --reload
# ngrok http 5173
# ngrok http --domain=helen-unfuelled-charlee.ngrok-free.dev 5173
import os
from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Tuple

from config import *
from google_map_client import GoogleMapClient
from core.bbox import get_bounding_box_arcgis
from core.fetcher import fetch_satellite_image_arcgis
from core.shadow_unet import load_unet
from core.predict import sliding_window_predict
from core.scorer import calculate_scores

import googlemaps
from api_key_google_map import API_KEY


# -----------------------------
# FastAPI initialization
# -----------------------------
app = FastAPI(title="ShadeSync API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # อนุญาตทุก origin ชั่วคราว
    allow_credentials=True,
    allow_methods=["*"],  # อนุญาตทุก method
    allow_headers=["*"],  # อนุญาตทุก header
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UNET_MODEL_PATH = os.path.join(BASE_DIR, "models", "shadesync_unet_model.pth")
# -----------------------------
# Request body model
# -----------------------------
class RouteRequest(BaseModel):
    start: Tuple[float, float]
    end: Tuple[float, float]


# -----------------------------
# Load model once (improve speed)
# -----------------------------
print("Loading UNet model...")
MODEL = load_unet(UNET_MODEL_PATH)

# -----------------------------
# Main API Endpoint
# -----------------------------
@app.post("/route/shadow-score")
def compute_shadow_score(req: RouteRequest):
    """
    Input:
    {
        "start": [lat, lng],
        "end": [lat, lng]
    }
    """
    client = GoogleMapClient(API_KEY())

    # 1) Get Google Maps routes
    routes = client.get_routes(req.start, req.end)

    # 2) Generate bounding box
    bbox_str, bbox_tuple = get_bounding_box_arcgis(routes, ZOOM_IN)

    # 3) Fetch satellite image
    img = fetch_satellite_image_arcgis(bbox_str, IMAGE_SIZE)
    if img is None:
        return {"error": "Failed to fetch satellite imagery"}

    # 4) Shadow prediction
    mask = sliding_window_predict(img, MODEL)

    # 5) Decode routes
    decoded_routes = []
    for route in routes:
        decoded_routes.append({
            "polyline": googlemaps.convert.decode_polyline(route["overview_polyline"]["points"]),
            "legs": route["legs"][0]
        })

    # 6) Calculate shadow scores
    scores = calculate_scores(decoded_routes, mask, bbox_tuple, IMAGE_SIZE)

    # 7) Build JSON response
    output = []
    for i, r in enumerate(decoded_routes):
        legs = r["legs"]
        output.append({
            "route_id": i + 1,
            "distance_m": legs["distance"]["value"],
            "distance_text": legs["distance"]["text"],
            "duration_s": legs["duration"]["value"],
            "duration_text": legs["duration"]["text"],
            "shadow_score": round(scores[i], 2),
            "polyline": r["polyline"]
        })

    return {
        "start": req.start,
        "end": req.end,
        "num_routes": len(output),
        "routes": output
    }
