import googlemaps
from googlemaps import convert
import numpy as np
import math
import torch
import torch.nn as nn
from torchvision import transforms
from PIL import Image
import cv2
import requests
from io import BytesIO
import matplotlib.pyplot as plt
from api_key_google_map import API_KEY

# ==========================================
# 1. CONFIGURATION
# ==========================================
# ⚠️ REPLACE WITH YOUR ACTUAL API KEY

# Path to your trained model
UNet_model_path = "/home/winkawin2552/Code/ShadeSync/models/shadesync_unet_model.pth"

# Map Settings
ZOOM_LEVEL = 19   # High zoom for walking paths detail
TILE_SIZE = 256   # Size of image chunks for U-Net

# ==========================================
# 2. MATH & GEOMETRY HELPERS (UPDATED FOR ARCGIS)
# ==========================================

# Configuration ให้ตรงกับตอนเทรน
ZOOM_IN = 0.0030  # ค่าเดียวกับที่คุณใช้เทรน
IMAGE_SIZE = 2048 # ค่าเดียวกับที่คุณใช้เทรน

def latlon_to_pixel_arcgis(lat, lon, bbox, image_width, image_height):
    """
    แปลง Lat/Lon เป็น Pixel โดยใช้ตรรกะ Linear (แบบเดียวกับ ArcGIS Export)
    """
    min_lon, min_lat, max_lon, max_lat = bbox
    
    # คำนวณสัดส่วน (0.0 ถึง 1.0)
    x_ratio = (lon - min_lon) / (max_lon - min_lon)
    y_ratio = (max_lat - lat) / (max_lat - min_lat) # Y กลับหัว (Latitude ยิ่งมากยิ่งอยู่บน)
    
    # แปลงเป็น Pixel
    x = x_ratio * image_width
    y = y_ratio * image_height
    
    return x, y

def get_bounding_box_arcgis(directions_result, buffer_ratio=1.5):
    """
    หาจุดกึ่งกลางของเส้นทาง แล้วสร้าง BBox แบบ Square ขนาดคงที่ (ตาม ZOOM_IN)
    เพื่อให้ Resolution ของภาพเท่ากับตอนเทรนเป๊ะๆ
    """
    all_lats, all_lngs = [], []
    for route in directions_result:
        polyline = route["overview_polyline"]["points"]
        points = googlemaps.convert.decode_polyline(polyline)
        all_lats.extend([p["lat"] for p in points])
        all_lngs.extend([p["lng"] for p in points])
    
    # หาจุดกึ่งกลางของเส้นทางทั้งหมด
    center_lat = (max(all_lats) + min(all_lats)) / 2
    center_lon = (max(all_lngs) + min(all_lngs)) / 2
    
    # สร้าง BBox โดยใช้ ZOOM_IN แบบเดียวกับตอนเทรน
    # (อาจจะขยาย ZOOM_IN นิดหน่อยถ้าเส้นทางยาวมาก แต่เพื่อความแม่นยำของ AI ควรใช้ Scale เดิม)
    # ถ้าเส้นทางยาวกว่ากรอบภาพ เราอาจต้องตัดหลายภาพ (Tiling) 
    # แต่เบื้องต้นใช้กรอบเดียวที่ครอบคลุมก่อน
    
    # เช็คว่าเส้นทางยาวเกินกรอบภาพไหม
    route_width = max(all_lngs) - min(all_lngs)
    route_height = max(all_lats) - min(all_lats)
    
    current_zoom = ZOOM_IN
    # ถ้าเส้นทางยาวเกินกรอบภาพ ให้ขยายกรอบ (Scale เปลี่ยน AI อาจแม่นยำลดลงเล็กน้อย)
    # หรือทางที่ดีคือใช้ Logic เดิมแต่ยอมให้ภาพใหญ่ขึ้น
    if route_width > (current_zoom * 2) or route_height > (current_zoom * 2):
        print("Warning: Route is larger than training image size. Extending view...")
        current_zoom = max(route_width, route_height) / 1.8
        
    bbox_str = f"{center_lon - current_zoom},{center_lat - current_zoom},{center_lon + current_zoom},{center_lat + current_zoom}"
    bbox_tuple = (center_lon - current_zoom, center_lat - current_zoom, center_lon + current_zoom, center_lat + current_zoom)
    
    return bbox_str, bbox_tuple

def fetch_satellite_image_arcgis(bbox_str):
    """
    ดึงภาพจาก ArcGIS Server (แหล่งเดียวกับ Training Data)
    """
    url = (
        f"https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?"
        f"bbox={bbox_str}&bboxSR=4326&size={IMAGE_SIZE},{IMAGE_SIZE}&format=png&f=image"
    )
    
    print(f"Fetching ArcGIS Image...")
    try:
        # เพิ่ม Timeout 30s เหมือนตอนเทรน
        response = requests.get(url, timeout=30) 
        response.raise_for_status()
        image = Image.open(BytesIO(response.content)).convert("RGB")
        return image
    except Exception as e:
        print(f"Error fetching ArcGIS map: {e}")
        return None
    
import segmentation_models_pytorch as smp
from torchvision import transforms as T

# ==========================================
# 3. AI MODEL HANDLING
# ==========================================

# ⚠️ IMPORTANT: You must define the class structure of your U-Net here 
# so PyTorch knows how to load the weights.
# Example standard U-Net structure (Simplify this if your model is different)
# class UNet(nn.Module):
#     def __init__(self):
#         super(UNet, self).__init__()
#         # ... Define your layers here ...
#         # If you don't have the class definition handy, 
#         # you might need to import it from your training script.
#         pass

def predict_shadow_mask(full_image, model_path):
    """
    Sliding-window prediction using your trained U-Net model (.pth)
    """
    print("Loading AI Model (real U-Net)...")
    
    device = torch.device("cpu")

    # --- 1. Recreate your model ---
    model = smp.Unet(
        encoder_name="resnet34",
        encoder_weights=None,  # you have your own weights
        in_channels=3,
        classes=1
    )
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.to(device)
    model.eval()

    # --- 2. Prep full image ---
    img_np = np.array(full_image)
    H, W, _ = img_np.shape
    mask_full = np.zeros((H, W), dtype=np.float32)

    # Preprocess transform (same as training)
    transform = T.Compose([
        T.Resize((256, 256)),
        T.ToTensor(),
        T.Normalize(mean=[0.485, 0.456, 0.406], 
                    std=[0.229, 0.224, 0.225])
    ])

    tile = 256  # model input size

    print(f"Running U-Net on {W}x{H} image...")

    # --- 3. Sliding window inference ---
    for y in range(0, H, tile):
        for x in range(0, W, tile):

            patch = img_np[y:y+tile, x:x+tile]
            ph, pw, _ = patch.shape

            # pad edge images
            if ph < tile or pw < tile:
                padded = np.zeros((tile, tile, 3), dtype=np.uint8)
                padded[:ph, :pw] = patch
                patch = padded

            # convert to tensor
            input_tensor = transform(Image.fromarray(patch)).unsqueeze(0).to(device)

            # inference
            with torch.no_grad():
                pred = model(input_tensor)
                pred = torch.sigmoid(pred)
                pred = pred.squeeze().cpu().numpy()

            # crop padding before placing into mask
            mask_full[y:y+ph, x:x+pw] = pred[:ph, :pw]

    # convert into 0/1
    final_mask = (mask_full > 0.5).astype(np.uint8)

    return final_mask

# ==========================================
# 4. SCORING & VISUALIZATION
# ==========================================
def calculate_scores_arcgis(directions, shadow_mask, bbox_tuple, image_size):
    results = []
    h, w = shadow_mask.shape
    for i, route in enumerate(directions):
        points = googlemaps.convert.decode_polyline(route["overview_polyline"]["points"])
        total = 0
        shaded = 0
        for p in points:
            x, y = latlon_to_pixel_arcgis(p['lat'], p['lng'], bbox_tuple, image_size, image_size)
            ix, iy = int(x), int(y)
            if 0 <= ix < w and 0 <= iy < h:
                total += 1
                if shadow_mask[iy, ix] > 0:
                    shaded += 1
        score = (shaded/total*100) if total>0 else 0
        results.append(score)
    return results

# ==========================================
# 5. MAIN EXECUTION (UPDATED WITH SCORES)
# ==========================================

# 1. Setup Client
gmaps = googlemaps.Client(key=API_KEY())

# พิกัดตัวอย่าง (สยามพารากอน -> เซ็นทรัลเวิลด์)
start = (13.747356274868702, 100.56261622940225)
end   = (13.738742381037982, 100.56358982084812)

#Set up data that will eb returned
routes_info = [] # {poly_line, distance, time, shadow_score} 

print("1. Fetching Routes...")
directions_result = gmaps.directions(start, end, mode="walking", alternatives=True)

# 2. Get BBox (ArcGIS Style)
bbox_str, bbox_tuple = get_bounding_box_arcgis(directions_result)

# 3. Get Image (ArcGIS Source)
print("2. Fetching Satellite Image (ArcGIS)...")
sat_image = fetch_satellite_image_arcgis(bbox_str)

if sat_image:
    # 4. Run AI
    print("3. Analyzing Shadows...")
    shadow_mask = predict_shadow_mask(sat_image, UNet_model_path)

    # 5. Calculate Shadow Scores
    print("4. Calculating Shadow Scores...")
    route_scores = calculate_scores_arcgis(
        directions=directions_result,
        shadow_mask=shadow_mask,
        bbox_tuple=bbox_tuple,
        image_size=IMAGE_SIZE
    )

    # Show score in terminal
    for i, score in enumerate(route_scores):
        print(f"Route {i+1} Shadow Score = {score:.2f}%")
        
    # Add all data in the routes info
    for i, route in enumerate(directions_result):
        leg = route["legs"][0]
        dict_info = {}
        dict_info["poly_line"] = googlemaps.convert.decode_polyline(route["overview_polyline"]["points"])
        dict_info["distance"] = distance_m = leg["distance"]["value"] # meter
        dict_info["time"] = duration_s = leg["duration"]["value"]  # sec
        dict_info["shadow_score"] = route_scores[i]
        routes_info.append(dict_info)
        
    print("---------------------------------")
    for i in range(len(routes_info)):
        print(f"Route {i+1}")
        print(f"""
        Poly Line: {routes_info[i]["poly_line"][0], len(routes_info[i]["poly_line"])}
        Distance: {routes_info[i]["distance"] / 1000} km
        time: {routes_info[i]["time"] //60} min {routes_info[i]["time"] %60} sec
        Shadow Score: {routes_info[i]["shadow_score"]} %
        """)