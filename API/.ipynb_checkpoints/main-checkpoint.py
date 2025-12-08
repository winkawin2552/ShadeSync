from config import *
from google_map_client import GoogleMapClient
from core.bbox import get_bounding_box_arcgis
from core.fetcher import fetch_satellite_image_arcgis
from core.shadow_unet import load_unet
from core.predict import sliding_window_predict
from core.scorer import calculate_scores
import googlemaps
from api_key_google_map import API_KEY

def main():
    client = GoogleMapClient(API_KEY())

    start = (13.747356274868702, 100.56261622940225)
    end   = (13.743596019228862, 100.56557756585119)

    routes = client.get_routes(start, end)

    bbox_str, bbox_tuple = get_bounding_box_arcgis(routes, ZOOM_IN)

    img = fetch_satellite_image_arcgis(bbox_str, IMAGE_SIZE)

    model = load_unet(UNET_MODEL_PATH)
    mask = sliding_window_predict(img, model)

    decoded_routes = []
    for route in routes:
        decoded_routes.append({
            "polyline": googlemaps.convert.decode_polyline(route["overview_polyline"]["points"]),
            "legs": route["legs"][0]
        })

    scores = calculate_scores(decoded_routes, mask, bbox_tuple, IMAGE_SIZE)

    print("\n--- Results ---")
    for i, r in enumerate(decoded_routes):
        print(f"Route {i+1}:")
        print(len(r['polyline']))
        print(f" - Distance: {r['legs']['distance']['value']}")
        print(f" - Duration: {r['legs']['duration']['value']}")
        print(f" - Shadow Score: {scores[i]:.2f}%")
        print()

if __name__ == "__main__":
    main()
