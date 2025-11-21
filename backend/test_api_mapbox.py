import requests
import polyline

MAPBOX_TOKEN = "pk.eyJ1Ijoid2lua2F3aW4yNTUyIiwiYSI6ImNtaTRpcXh3ZDA1aTAya3B4cWVjbm0yeWwifQ.fhDh-iQmDV19x8B7CDMeNw"

start = (100.563140, 13.748779)  # example Bangkok coord
end   = (100.565779, 13.742998)

transport = 'walking'

url = (
    f"https://api.mapbox.com/directions/v5/mapbox/{transport}/"
    f"{start[0]},{start[1]};{end[0]},{end[1]}"
    f"?geometries=polyline&alternatives=true&steps=true&access_token={MAPBOX_TOKEN}"
)

response = requests.get(url)
data = response.json()

routes = data["routes"]

routes_number = len(routes)

for i in range(routes_number):
    poly = routes[i]["geometry"]  # this is the encoded polyline string

    coords = polyline.decode(poly)  # returns list of (lat, lon)

    print(f"Number of {transport} paths found: {routes_number}")
    print(coords)
