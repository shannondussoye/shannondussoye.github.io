mapboxgl.accessToken = 'pk.eyJ1Ijoic2hhbm5vbmR1c3NveWUiLCJhIjoiY2oxbmhuM2F6MDBqYjMybWhkbTd6MjdxbyJ9.eJ3subj-fGRIz5ujR0xz8A';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [151.05, -33.86],
    zoom: 9.8,
    pitch: 15
});

const parseTime = d3.timeParse("%Y%m%d %H:%M");
const formatTime = d3.timeFormat("%H:%M");
const formatFullTime = d3.timeFormat("%a, %H:%M");

d3.csv("../data/d3-data.csv").then(rawData => {
    // Process data: filter out zero counts and group by time
    const data = rawData.map(d => ({
        loc: d.loc,
        lat: +d.lat,
        lon: +d.lon,
        datetime: d.datetime,
        count: +d.count
    }));

    const dates = Array.from(new Set(data.map(d => d.datetime))).sort();
    const stationMap = d3.group(data, d => d.datetime);

    map.on('load', () => {
        const container = map.getCanvasContainer();
        const svg = d3.select(container).append("svg");
        const defs = svg.append("defs");

        // Glow filter
        const filter = defs.append("filter")
            .attr("id", "glow")
            .attr("x", "-50%")
            .attr("y", "-50%")
            .attr("width", "200%")
            .attr("height", "200%");

        filter.append("feGaussianBlur")
            .attr("stdDeviation", "3.5")
            .attr("result", "coloredBlur");

        const feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode").attr("in", "coloredBlur");
        feMerge.append("feMergeNode").attr("in", "SourceGraphic");

        const colorScale = d3.scaleSequential()
            .domain([0, 500])
            .interpolator(d3.interpolateRgbBasis(["#6366f1", "#0ea5e9", "#22d3ee", "#ffffff"]));


        let index = 0;

        function update() {
            const currentTime = dates[index];
            if (!currentTime) return;

            const intervalData = stationMap.get(currentTime).filter(d => d.count > 0);

            // Update UI
            const dateObj = parseTime(currentTime);
            d3.select("#time-display").text(formatTime(dateObj));

            const totalTaps = d3.sum(intervalData, d => d.count);
            d3.select("#total-taps").text(totalTaps.toLocaleString());

            if (intervalData.length > 0) {
                const peak = intervalData.reduce((prev, current) => (prev.count > current.count) ? prev : current);
                d3.select("#peak-station").text(peak.loc.replace(" Station", ""));
            }

            // Update Map Elements
            const circles = svg.selectAll(".station-pulse")
                .data(intervalData, d => d.loc);

            circles.exit()
                .transition().duration(500)
                .attr("r", 0)
                .attr("opacity", 0)
                .remove();

            const enter = circles.enter()
                .append("circle")
                .attr("class", "station-pulse")
                .attr("filter", "url(#glow)")
                .attr("opacity", 0)
                .attr("r", 0);

            enter.merge(circles)
                .attr("cx", d => map.project([d.lon, d.lat]).x)
                .attr("cy", d => map.project([d.lon, d.lat]).y)
                .transition().duration(1000)
                .attr("r", 8)
                .attr("fill", d => colorScale(d.count))
                .attr("opacity", 0.85);

            index = (index + 1) % dates.length;
            setTimeout(update, 1000);
        }

        function reposition() {
            svg.selectAll(".station-pulse")
                .attr("cx", d => map.project([d.lon, d.lat]).x)
                .attr("cy", d => map.project([d.lon, d.lat]).y);
        }

        map.on("viewreset", reposition);
        map.on("move", reposition);
        map.on("moveend", reposition);

        update();
    });
});