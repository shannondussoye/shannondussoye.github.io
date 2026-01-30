mapboxgl.accessToken = 'pk.eyJ1Ijoic2hhbm5vbmR1c3NveWUiLCJhIjoiY2oxbmhuM2F6MDBqYjMybWhkbTd6MjdxbyJ9.eJ3subj-fGRIz5ujR0xz8A';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v8',
    center: [132, -28],
    zoom: 3.5
});

var COLORS = ['#F7FBFF', '#DEEBF7', '#C6DBEF', '#9ECAE1', '#6BAED6', '#4292C6', '#2171B5', '#08519C', '#08306B'],
    BREAKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    FILTERUSE;

map.on('load', function () {
    var url = "../data/electorate.json"

    //load json
    d3.json(url, function (err, topo) {
        var electoral_states = topojson.feature(topo, topo.objects.COM_ELB_2010_region)
        for (var j = 0; j < electoral_states.features.length; j++) {
            electoral_states.features[j].properties.avg_score = d3.format(".2f")(d3.randomUniform(1, 10)());
        }
        console.log(electoral_states);
        map.addSource('electoral_states', {
            'type': 'geojson',
            'data': electoral_states
        });
        map.addLayer({
            'id': 'electoral_states-hover',
            'type': 'fill',
            'source': 'electoral_states',
            'layout': {},
            'paint': {
                'fill-outline-color': '#FFF',
                'fill-color': '#111',
                'fill-opacity': 0.8
            },
            "filter": ["==", "SORTNAME", ""]

        });
        var qldBounds = [
            [130.000942, -9.2],
            [153.0, -29.5]
        ];
        var color2 = electoral_states.features;
        map.addLayer({
            'id': 'electoral_states',
            'type': 'fill',
            'source': 'electoral_states',
            'layout': {},
            'paint': {
                'fill-outline-color': '#FFF',
                "fill-color": {
                    property: 'avg_score',
                    stops: [
                        [BREAKS[0], COLORS[0]],
                        [BREAKS[1], COLORS[1]],
                        [BREAKS[2], COLORS[2]],
                        [BREAKS[3], COLORS[3]],
                        [BREAKS[4], COLORS[4]],
                        [BREAKS[5], COLORS[5]],
                        [BREAKS[6], COLORS[6]],
                        [BREAKS[7], COLORS[7]],
                        [BREAKS[8], COLORS[8]]
                    ]
                },
                'fill-opacity': 0.9
            }
        });
        map.on("mousemove", function (e) {
            var features = map.queryRenderedFeatures(e.point, {
                layers: ["electoral_states"]
            });
            if (features.length) {
                map.setFilter("electoral_states-hover", ["==", "SORTNAME", features[0].properties.SORTNAME]);
                d3.select("#barelec")
                    .text("Electorate: " + features[0].properties.SORTNAME)                         ;
                d3.select("#barrand").text("Random Number: " + features[0].properties.avg_score)
                    .attr("dy","2em")
            } else {
                map.setFilter("electoral_states-hover", ["==", "SORTNAME", ""])
            }
        });

    }) //json
})