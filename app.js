let mapWidth = "50%";
let mapHeight = "600px";

let map = d3.select("#map")
    .attr("width", mapWidth)
    .attr("height", mapHeight)

Promise.all([
    d3.json('https://unpkg.com/world-atlas@1.1.4/world/50m.json')
]).then(([mapData]) => {

    var geoData = topojson.feature(mapData, mapData.objects.countries).features;

    var projection = d3.geoMercator()
        .scale(100)


    var path = d3.geoPath()
        .projection(projection)

    map
        .selectAll(".country")
        .data(geoData)
        .enter()
        .append("path")
        .classed("country", true)
        .attr("d", path)
        .attr("transform", "translate(-100, 35)")
})