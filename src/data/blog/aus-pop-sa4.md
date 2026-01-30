---
author: Shannon Dussoye
pubDatetime: '2017-10-29T00:00:00Z'
title: Australia SA4 Population Size
postSlug: aus-pop-sa4
featured: false
draft: false
tags:
- D3.js
description: Binding population data to SA4 geographical boundaries using R and D3.js
ogImage: /img/australia2.jpeg
---

The earlier post [Mapping Australia SA4 Polygons using D3.js and Mapbox](https://shannondussoye.github.io/2017-09-26-Aus-SA4/) was my first Australian SA4 map using D3.js and Mapbox. That post primarily focused on the initial challenges and navigating the tools. The visualization used a random number generator to create the color scale, primarily to demonstrate how data binding would function in the final version. Finally, the wait is over! Eureka!

The process of binding data to the map was clear; however, I needed to find an efficient workflow. While working on another project, I found myself opening two files—GeoJSON and CSV—and looping through them in the browser to match SA4 codes. This felt inefficient for data that remained constant. I realized I could offload this work from the browser by pre-processing the data in R. 

My plan was simple: read the GeoJSON and CSV files, append the population data from the 2011 census, and save the result. After researching a few techniques, I achieved this using the following R code:

```R
library(geojsonio)
library(sp)
library(rgdal)
library(rgeos)
library(dplyr)
setwd("Github/Census 2011/geojson manipulation/")
map = readOGR("2011sa4.geojson", "OGRGeoJSON")
data <- read.csv("/home/shannon/Documents/ABS/2011/data/2011_BCP_SA4_for_AUST_short-header/2011 Census BCP Statistical Areas Level 4 for AUST/AUST/2011Census_B01_AUST_SA4_short.csv") %>%
  select(region_id,Tot_P_P,Tot_P_M,Tot_P_F)
joined <- merge(map, data, by.x="SA4_CODE", by.y="region_id")
geojson_write(joined, file = "sa4population.geojson")
```

Using this processed data, I replaced the random color scale with actual population sizes and added breakdowns for both male and female populations directly into interactive tooltips. This is the first iteration, and I plan to update it as I find more interesting insights.

<div class="map-container" style="position: relative; width: 100%; height: 600px; margin: 2rem 0; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
    <iframe src="/pages/sa4population.html" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" title="Interactive Australian SA4 Population Map"></iframe>
</div>

The live map is accessible [here](/pages/sa4population.html).


