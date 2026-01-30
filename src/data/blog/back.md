---
author: Shannon Dussoye
pubDatetime: '2018-07-17T00:00:00Z'
title: Overcoming the D3.js Embedding Challenge
postSlug: back
featured: false
draft: false
tags:
- D3.js
description: Overcoming the challenge of embedding D3.js visualizations in blog posts
ogImage: /img/2018.png
---

It’s been quite some time since my last blog post! One of my biggest hurdles was finding a seamless way to embed D3.js visualizations directly into my articles. While I didn't invent a new method myself, I stumbled upon an excellent [post](http://dan-cole.com/2017/d3js-example/) by Dan Coleman that provided a straightforward and effective solution. I put it to the test, and it worked perfectly!

With this technical blocker out of the way, I’m excited to dive back into more complex visualizations and data projects. Let’s see where this takes me.


<style>

div.example {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.box {
  font: 10px sans-serif;
}

.box line,
.box rect,
.box circle {
  fill: #fff;
  stroke: #000;
  stroke-width: 1.5px;
}

.box .center {
  stroke-dasharray: 3,3;
}

.box .outlier {
  fill: none;
  stroke: #ccc;
}

</style>
<script src="https://d3js.org/d3.v3.min.js"></script>
<script src="https://bl.ocks.org/mbostock/raw/4061502/0a200ddf998aa75dfdb1ff32e16b680a15e5cb01/box.js"></script>
<script>

var margin = {top: 10, right: 50, bottom: 20, left: 50},
    width = 120 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var min = Infinity,
    max = -Infinity;

var chart = d3.box()
    .whiskers(iqr(1.5))
    .width(width)
    .height(height);

d3.csv("/data/morley.csv", function(error, csv) {
  var data = [];

  csv.forEach(function(x) {
    var e = Math.floor(x.Expt - 1),
        r = Math.floor(x.Run - 1),
        s = Math.floor(x.Speed),
        d = data[e];
    if (!d) d = data[e] = [s];
    else d.push(s);
    if (s > max) max = s;
    if (s < min) min = s;
  });

  chart.domain([min, max]);

  var svg = d3.select("div#example").selectAll("svg")
      .data(data)
    .enter().append("svg")
      .attr("class", "box")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.bottom + margin.top)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(chart);

  setInterval(function() {
    svg.datum(randomize).call(chart.duration(1000));
  }, 2000);
});

function randomize(d) {
  if (!d.randomizer) d.randomizer = randomizer(d);
  return d.map(d.randomizer);
}

function randomizer(d) {
  var k = d3.max(d) * .02;
  return function(d) {
    return Math.max(min, Math.min(max, d + k * (Math.random() - .5)));
  };
}

// Returns a function to compute the interquartile range.
function iqr(k) {
  return function(d, i) {
    var q1 = d.quartiles[0],
        q3 = d.quartiles[2],
        iqr = (q3 - q1) * k,
        i = -1,
        j = d.length;
    while (d[++i] < q1 - iqr);
    while (d[--j] > q3 + iqr);
    return [i, j];
  };
}

</script>

<div id="example"></div>

<p align="center">
    <img src="/img/unlocked.jpg" alt="Unlocked padlock representing the removal of D3 embedding blocker">
</p>
