const w = 1300;
const h = 600;
const padding = 70;
const paddingBottom = 100;

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
        .attr("transform", "translate(0," + (h - paddingBottom) + ")")
        .call(xAxis)

    // Y AXIS
    let yScale = d3.scaleBand()
        .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
        .range([0 + padding, h - paddingBottom])

    let yAxis = d3.axisLeft(yScale)
        .tickFormat(x => {
            let date = new Date(0, x)
            let format = d3.utcFormat('%B');
            return format(date)
        })

    svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis)

    // COLOR PALETE FOR TEMP

    let tempPalete = ["blue", "#1984c5", "#22a7f0", "#63bff0", "#a7d5ed", "#e2e2e2", "#e1a692", "#de6e56", "#e14b31", "#c23728", "red"];
    let baseTemp = data.baseTemperature

    // FUNCTION TO ROUND THE TEMP
    function tempVariation(baseTemp, x) {
        let variation = baseTemp + x;

        return Number.parseFloat(variation).toFixed(1)
    }

    function colorVariation(temp) {
        if (temp < 2.8) {
            return tempPalete[0]
        } else if (temp >= 2.8 && temp < 3.9) {
            return tempPalete[1]
        } else if (temp >= 3.9 && temp < 5.0) {
            return tempPalete[2]
        } else if (temp >= 5.0 && temp < 6.1) {
            return tempPalete[3]
        } else if (temp >= 6.1 && temp < 7.2) {
            return tempPalete[4]
        } else if (temp >= 7.2 && temp < 8.3) {
            return tempPalete[5]
        } else if (temp >= 8.3 && temp < 9.5) {
            return tempPalete[6]
        } else if (temp >= 9.5 && temp < 10.6) {
            return tempPalete[7]
        } else if (temp >= 10.6 && temp < 11.7) {
            return tempPalete[8]
        } else if (temp >= 11.7 && temp < 12.8) {
            return tempPalete[9]
        } else {
            return tempPalete[10]
        }
    }

    // RECTS
    svg.selectAll("rect")
        .data(data.monthlyVariance)
        .enter()
        .append("rect")
        .attr("class", "cell")
        .attr("x", (d) => xScale(new Date(d.year, 0)))
        .attr("y", (d) => yScale(d.month - 1))
        .attr("data-month", (d) => d.month - 1)
        .attr("data-year", (d) => d.year)
        .attr("data-temp", (d) => baseTemp + d.variance)
        .attr("width", `${w / (2015 - 1753)}`)
        .attr("height", (d) => yScale.bandwidth(d.month - 1))
        .attr("fill", (d) => colorVariation(tempVariation(baseTemp, d.variance)))

    // X AXIS FOR COLORS
    let tempArray = [2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8];

    let xColorScale = d3.scaleBand()
        .domain(tempArray)
        .range([0 + padding, w / 3])

    let xColorAxis = d3.axisBottom(xColorScale)

    svg.append("g")
        .attr("id", "x-color-axis")
        .attr("transform", "translate(0," + (h - paddingBottom + 70) + ")")
        .call(xColorAxis)

    // Y AXIS FOR COLORS
    let yColorScale = d3.scaleBand()
        .domain([0, 1])
        .range([520, h - paddingBottom + 70])

    let yColorAxis = d3.axisLeft(yColorScale)

    svg.append("g")
        .attr("id", "y-color-axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yColorAxis)

    // APPEND COLORS FOR THE LEGEND
    for (let x = 0; x < tempArray.length - 1; x++) {
        svg.append("rect")
            .attr("x", `${xColorScale(tempArray[x]) + 18}`)
            .attr("y", `${yColorScale(1)}`)
            .attr("width", xColorScale.bandwidth(tempArray[x]))
            .attr("height", yColorScale.bandwidth(0))
            .attr("fill", tempPalete[x + 1])
            .attr("stroke", "black")
    }

})