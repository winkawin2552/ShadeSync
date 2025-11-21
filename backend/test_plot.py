import requests
import folium
import polyline
import random

# ============================
# 1. Mapbox Token
# ============================
MAPBOX_TOKEN = "pk.eyJ1Ijoid2lua2F3aW4yNTUyIiwiYSI6ImNtaTRpcXh3ZDA1aTAya3B4cWVjbm0yeWwifQ.fhDh-iQmDV19x8B7CDMeNw"

# ============================
# 2. Coordinates (lon, lat)
# ============================
start = (100.567140, 13.748779)  # example Bangkok coord
end   = (100.565779, 13.742998)

# Mapbox URL (multiple walking alternatives)
url = (
    f"https://api.mapbox.com/directions/v5/mapbox/walking/"
    f"{start[0]},{start[1]};{end[0]},{end[1]}"
    f"?geometries=polyline&alternatives=true&steps=true&access_token={MAPBOX_TOKEN}"
)

# Request data
response = requests.get(url)
data = response.json()

routes = data["routes"]

print(f"Number of walking paths found: {len(routes)}")

# ============================
# 3. Create Map Center
# ============================
center_lat = (start[1] + end[1]) / 2
center_lon = (start[0] + end[0]) / 2

m = folium.Map(location=[center_lat, center_lon], zoom_start=16)

# Add start and end markers
folium.Marker([start[1], start[0]], popup="Start", icon=folium.Icon(color="green")).add_to(m)
folium.Marker([end[1], end[0]], popup="End", icon=folium.Icon(color="red")).add_to(m)

# ============================
# 4. Draw all walking routes
# ============================
colors = ["blue", "purple", "orange", "black", "red"]

for i, route in enumerate(routes):

    # Decode route polyline → list of (lat, lon)
    coords = polyline.decode(route["geometry"])

    # Pick a color for each alternative path
    color = colors[i % len(colors)]

    # Add path to map
    folium.PolyLine(
        coords,
        weight=5,
        opacity=0.8,
        color=color,
        tooltip=f"Route {i+1}: {route['distance']:.1f} m, {route['duration']:.1f} sec"
    ).add_to(m)

# Save map
m.save("route_map_multiple.html")

print("Saved: route_map_multiple.html")
