---
author: Shannon Dussoye
pubDatetime: '2017-09-26T00:00:00Z'
title: Mapping Australia SA4 Polygon using D3.js and Mapbox
postSlug: aus-sa4
featured: false
draft: false
tags:
- D3.js
- Mapbox
description: Creating interactive maps with Australian geographic data
ogImage: /img/australia1.jpg
---

Following my post on the Opal Card visualization (which still needs some improvements), I decided to tackle another mapping project for work. As I mentioned earlier, I prefer using Mapbox because it offers great flexibility in map design. Being relatively new to D3.js, I often learn by experimenting with examples; however, finding specific D3.js and Mapbox integration examples was initially a challenge. I eventually discovered [blockbuilder](http://blockbuilder.org/search), which opened up many more possibilities. Prior to this, most examples I found were either focused on US regions or required converting shapefiles through the `shp2geo` package—a process that felt a bit too steep for my initial foray into Australian geographic data.

Australian shapefiles are available on the [ABS website](https://datapacks.censusdata.abs.gov.au/datapacks/). Reaching the final visualization involved overcoming several technical challenges:

1. **Converting Shapefiles to GeoJSON**  
   **Solution**: [Mapshaper](https://mapshaper.org)

2. **Map Fails to Load via Mapbox API**  
   **Findings**: The Coordinate Reference System (CRS) was missing in the GeoJSON file exported from Mapshaper.  
   **Challenge**: The `shp2geo` package didn't seem to add the CRS attribute correctly, or perhaps I was misconfiguring it.  
   **Solution**: I loaded the shapefile into QGIS and exported it as GeoJSON with the correct CRS.

3. **Slow Rendering for Large Shapefiles**  
   **Solution**: I simplified the shapefile using the *Visvalingam weighted area* algorithm. This makes the polygons smoother by removing non-essential points at acute vertices. I then repeated the QGIS export process with the simplified file.

These optimizations significantly improved loading times without noticeably compromising the detail of the polygons. This map is a fork of Ian Johnson's [block](http://bl.ocks.org/enjalot/c68abcda1a3e4b655541e8cf206a33ab), but with additional custom color coding. Currently, it uses a random number generator for the colors, but the long-term plan is to bind this to actual population data for each SA4 region.

## Interactive SA4 Map

Below is the live interactive map. Hover over regions to see details, and click to zoom in:

<div style="width: 100%; height: 600px; margin: 20px 0; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
  <iframe 
    src="/pages/sa4map.html" 
    width="100%" 
    height="600px" 
    frameborder="0" 
    style="border: none;"
    title="Interactive Australian SA4 Map">
  </iframe>
</div>

*Interactive map showing Australian Statistical Area Level 4 regions with random color coding. Each region displays different values when hovered.*

You can also view the map in [full screen mode](https://shannondussoye.github.io/pages/sa4map.html) for the best experience.

---

## Original Screenshot

For reference, here's the original static screenshot from when this post was first written:

![SA4 Random Number visualization](/img/sa4-capture.png "SA4 Random Number")