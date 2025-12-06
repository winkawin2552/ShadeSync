from .coordinate import latlon_to_pixel_arcgis

def calculate_scores(directions, shadow_mask, bbox, image_size):
    scores = []

    for route in directions:
        points = route["polyline"]
        total, shaded = 0, 0

        for p in points:
            x, y = latlon_to_pixel_arcgis(p["lat"], p["lng"], bbox, image_size, image_size)
            ix, iy = int(x), int(y)

            if 0 <= ix < image_size and 0 <= iy < image_size:
                total += 1
                if shadow_mask[iy, ix] > 0:
                    shaded += 1

        scores.append((shaded / total) * 100 if total else 0)

    return scores
