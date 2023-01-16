const w = 1300;
const h = 600;
const padding = 40;

// CREATE SVG
const svg = d3.select("#holder")
    .append("svg")
    .attr("width", w)
    .attr("height", h)

//GET JSON DATA
d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json", function (data) {

    // X AXIS
    let yearsArray = data.monthlyVariance.map(x => new Date(x.year, x.month - 1))

    let minTime = d3.min(yearsArray)
    let maxTime = d3.max(yearsArray)

    let xScale = d3.scaleTime()
        .domain([minTime, maxTime])
        .range([0 + padding, w - padding])

    let xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.timeFormat("%Y"))
        .ticks(26)

    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis)

})