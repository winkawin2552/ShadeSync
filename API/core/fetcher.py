import requests
from PIL import Image
from io import BytesIO

def fetch_satellite_image_arcgis(bbox_str, image_size):
    url = (
        f"https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/"
        f"MapServer/export?bbox={bbox_str}&bboxSR=4326&size={image_size},{image_size}"
        "&format=png&f=image"
    )
    resp = requests.get(url, timeout=30)
    resp.raise_for_status()
    return Image.open(BytesIO(resp.content)).convert("RGB")
