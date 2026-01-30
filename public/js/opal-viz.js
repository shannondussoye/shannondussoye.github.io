var format = d3.timeParse("%Y%m%d %H:%M");
d3.csv("../data/d3-data.csv", function (err, data) {
    data.forEach(function (d) {
        d.size = +d.size;
//            d.datetime = format((d.date + " " + d.time));
        d.lat = +d.lat;
        d.lon = +d.lon;
        d.coordinates = [d.lon, d.lat].join(",");
    });
    // console.log(data)

    mapboxgl.accessToken = 'pk.eyJ1Ijoic2hpbWl6dSIsImEiOiI0cl85c2pNIn0.RefZMaOzNn-IistVe-Zcnw'
    var map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/dark-v8',
        center: [151, -33.85],
        zoom: 8,
    });
    map.addControl(new mapboxgl.Navigation());
    mapDraw(data, map);

})//end of d3.csv

function mapDraw(data, map) {//Draw map

    map.on("load", function () {
        var container = map.getCanvasContainer();
        var svg = d3.select(container).append("svg");
        var circles = svg.selectAll("circle");

        //get distinct dates for loop and filter
        var dates = d3.map(data, function (d) {
            return d.datetime;
        }).keys();

        //sort dates
        dates.sort(function(a,b){
            return new Date(a) - new Date(b);
        });

        //get distinct coordinates
        var dcoord = d3.map(data, function (d) {
            return d.coordinates;
        }).keys();

        //Need to add all locations
        svg.selectAll("circle")
            .data(dcoord)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return project(d).x;
            })
            .attr("cy", function (d) {
                return project(d).y;
            })
            .attr("r", 0)
            .attr("fill", "none")
            .attr("stroke", "#0082a3");

        function transition() {

            var newData = data.filter(function (d) {
                return d.datetime == dates[counter]
            });

            svg.selectAll("circle")
                .data(newData)
                .transition()
                .duration(1000)
                .attr("r", function (d) {
                    return Math.sqrt(d.count);
                })
                .transition()
                .delay(1000)
                .attr("r", 0);

            var tipSVG = d3.select("#time")
                .data(newData)
                .text(function (d) {
                    return d.datetime
                });
            counter += 1;
            if (counter == dates.length) {
                timer.stop()
            }
        }

        var counter = 0;
        var timer = d3.interval(transition, 1500);

        map.on("viewreset", update);
        map.on("move", update);
        update();

        //Functions
        function project(d) {//return lonlat
            var coord = d.split(",");
            return map.project(new mapboxgl.LngLat(+coord[0], +coord[1]));
        }

        function update() {
            svg.selectAll("circle")
                .data(dcoord)
                .attr("cx", function (d) {
                    return project(d).x;
                })
                .attr("cy", function (d) {
                    return project(d).y;
                })
        }
    })
}//map draw function