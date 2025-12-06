import googlemaps

class GoogleMapClient:
    def __init__(self, api_key):
        self.client = googlemaps.Client(key=api_key)

    def get_routes(self, start, end, mode="walking"):
        return self.client.directions(start, end, mode=mode, alternatives=True)