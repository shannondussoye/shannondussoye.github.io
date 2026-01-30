---
author: Shannon Dussoye
pubDatetime: '2017-11-09T00:00:00Z'
title: Mapping Australia SA4 Population using Mapbox
postSlug: maptime-with-mapbox
featured: false
draft: false
tags:
- Mapbox
description: Creating interactive population maps using vanilla JavaScript and Mapbox, moving away from D3.js.
ogImage: /img/australia3.jpg
---

After publishing my previous post, [Australia SA4 Population Size](https://shannondussoye.github.io/2017-10-29-Aus-pop-sa4/), which used D3.js and Mapbox, I began exploring ways to add more granular Statistical Areas as drill-down levels. This led me to rethink my reliance on D3.js for this specific project.

While D3.js is incredibly powerful for complex visualizations, I realized that for this population map, Mapbox and vanilla JavaScript were more than sufficient. I began exploring the Mapbox GL JS documentation and was inspired by the *New York Times* [Virginia Governor Election](https://www.nytimes.com/elections/results/virginia-governor-election-gillespie-northam) visualization.

Using the same GeoJSON file as before, I loaded the data directly into Mapbox and translated the original D3.js functions into native JavaScript. One major change was moving the data display from a static sidebar to dynamic tooltips—a design choice inspired by the NYT's clean interaction model.

<p align="center"> 
    <img src="/img/Maptime.png" alt="Screenshot of Australia SA4 Population Map using Mapbox">
</p>

The core logic remains similar to the previous iteration, but the user interface feels much lighter and more responsive. You can view the live map [here](https://shannondussoye.github.io/pages/mapbox.html).


