import googlemaps

def get_bounding_box_arcgis(directions_result, zoom_in):
    all_lats, all_lngs = [], []

    for route in directions_result:
        points = googlemaps.convert.decode_polyline(route["overview_polyline"]["points"])
        all_lats.extend([p["lat"] for p in points])
        all_lngs.extend([p["lng"] for p in points])

    center_lat = (max(all_lats) + min(all_lats)) / 2
    center_lon = (max(all_lngs) + min(all_lngs)) / 2
    bbox = (
        center_lon - zoom_in, center_lat - zoom_in,
        center_lon + zoom_in, center_lat + zoom_in
    )
    bbox_str = f"{bbox[0]},{bbox[1]},{bbox[2]},{bbox[3]}"
    return bbox_str, bbox
