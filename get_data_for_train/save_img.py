import geemap

m = geemap.Map(center=[13.742909,100.565756], zoom=19, basemap='Esri.WorldImagery')

# after the map displays, run:
m.to_image(filename='/bangkok_view.jpg', monitor=1)
