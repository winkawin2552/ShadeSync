import ee
ee.Initialize(project='shadesync-477715')
print(ee.String('Hello from the Earth Engine servers!').getInfo())