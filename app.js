let mapWidth = "50%";
let mapHeight = "600px";

let map = d3.select("#map")
    .attr("width", mapWidth)
    .attr("height", mapHeight)

Promise.all([
    d3.json('https://unpkg.com/world-atlas@1.1.4/world/50m.json'),
    d3.csv('./data/all_data.csv')
]).then(([mapData, climateData]) => {

    var geoData = topojson.feature(mapData, mapData.objects.countries).features;

    let minYear = d3.min(climateData, d => d.Year);
    let maxYear = d3.max(climateData, d => d.Year);

    let year = minYear

    let input = d3.select("#range")
        .property("min", minYear)
        .property("max", maxYear)
        .property("value", minYear)

    input.on("input", () => {
        let year = d3.event.target.value;
        updateMap(geoData, climateData, year)
    })

    drawMap(geoData, climateData, minYear)

})

function drawMap(geoData, climateData, year) {
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

    updateMap(geoData, climateData, year)
}

function updateMap(geoData, climateData, year) {

    console.log(year)
    console.log(geoData)
    console.log(climateData)

    geoData.forEach(d => {
        var countries = climateData.filter(row => row["Country Code"] === d.id);
        var name = '';
        if (countries.length > 0) name = countries[0].Country;
        d.properties = countries.find(c => c.Year === year) || { country: name };
    });

    var colorScale = d3.scaleLinear()
        .domain([0, d3.max(geoData, d => d.properties.Emissions)])
        .range(["yellow", "red"])

    d3.selectAll(".country")
        .transition()
        .duration(750)
        .ease(d3.easeBackIn)
        .attr("fill", d => {
            var data = d.properties.Emissions;
            return data ? colorScale(data) : "#ccc"
        })

}