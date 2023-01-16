const w = 1300;
const h = 600;
const padding = 60;

// CREATE SVG
const svg = d3.select("#holder")
    .append("svg")
    .attr("width", w)
    .attr("height", h)

//GET JSON DATA
d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json", function (data) {

    // X AXIS
    let timeArray = data.monthlyVariance.map(x => new Date(x.year, x.month - 1))

    let minTime = d3.min(timeArray)
    let maxTime = d3.max(timeArray)

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

    // Y AXIS
    let yScale = d3.scaleBand()
        .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
        .range([0 + padding, h - padding])

    let yAxis = d3.axisLeft(yScale)
        .tickFormat(x => {
            let date = new Date(0, x - 1)
            let format = d3.utcFormat('%B');
            return format(date)
        })

    svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis)

})