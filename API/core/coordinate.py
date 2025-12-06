def latlon_to_pixel_arcgis(lat, lon, bbox, image_width, image_height):
    min_lon, min_lat, max_lon, max_lat = bbox
    x_ratio = (lon - min_lon) / (max_lon - min_lon)
    y_ratio = (max_lat - lat) / (max_lat - min_lat)
    return x_ratio * image_width, y_ratio * image_height