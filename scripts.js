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

    let minTime = d3.min(timeArray).getFullYear();
    let maxTime = d3.max(timeArray).getFullYear();

    let yearsArray = [];

    for (let x = minTime; x <= maxTime; x++) {
        yearsArray.push(x)
    }

    console.log(yearsArray)

    let xScale = d3.scaleBand()
        .domain(yearsArray)
        .range([0 + padding, w - padding])

    let xAxis = d3.axisBottom(xScale)
        .tickValues(yearsArray.filter(x => x % 10 === 0))

    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", "translate(0," + (h - paddingBottom) + ")")
        .call(xAxis)

    // function to display months
    function translateMonth(x) {
        let date = new Date(0, x)
        let format = d3.utcFormat('%B');
        return format(date)
    }

    // Y AXIS
    let yScale = d3.scaleBand()
        .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
        .range([0 + padding, h - paddingBottom])

    let yAxis = d3.axisLeft(yScale)
        .tickFormat(x => translateMonth(x))

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

    // TOOLTIPS
    tooltip = d3.select("#holder")
        .append("div")
        .attr("class", "tooltip")
        .attr("id", "tooltip")
        .style("opacity", 0)

    // A function that change this tooltip when the user hover a point.
    // Its opacity is set to 1: we can now see it.
    let mouseover = function (d) {
        tooltip
            .style("opacity", 1)
        tooltip
            .html(`${d.year} ${translateMonth(d.month - 1)}</br> ${tempVariation(baseTemp, d.variance)}ºC</br>${Number.parseFloat(d.variance).toFixed(1)}`)
            .style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY - 40) + "px")
            .attr("data-year", `${d.year}`)
        d3.select(this)
            .style("stroke", "black")
            .style("stroke-width", 2)
    }

    let mouseleave = function (d) {
        tooltip.style("opacity", 0)
        d3.select(this)
            .style("stroke", "none")
    }

    // RECTS
    svg.selectAll("rect")
        .data(data.monthlyVariance)
        .enter()
        .append("rect")
        .attr("class", "cell")
        .attr("x", (d) => xScale(d.year))
        .attr("y", (d) => yScale(d.month - 1))
        .attr("data-month", (d) => d.month - 1)
        .attr("data-year", (d) => d.year)
        .attr("data-temp", (d) => baseTemp + d.variance)
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => yScale.bandwidth(d.month - 1))
        .attr("fill", (d) => colorVariation(tempVariation(baseTemp, d.variance)))
        .on("mouseover", mouseover)
        .on("mouseleave", mouseleave)

    // X AXIS FOR COLORS
    let tempArray = [2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8];

    let xColorScale = d3.scaleBand()
        .domain(tempArray)
        .range([0, w / 3])

    let xColorAxis = d3.axisBottom(xColorScale)

    // G FOR LEGEND
    let legend = svg.append("g")
        .attr("id", "legend")
        .attr("transform", `translate(${padding},${h - 25})`)

    legend.append("g")
        .attr("id", "x-color-axis")
        .attr("transform", `translate(${0},${0})`)
        .call(xColorAxis)

    // APPEND RECTS WITH COLORS
    let tempArray2 = [2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7];

    legend.selectAll("rect")
        .data(tempArray2)
        .enter()
        .append("rect")
        .attr("x", (d) => xColorScale(d) + 22)
        .attr("y", -25)
        .attr("width", xColorScale.bandwidth())
        .attr("height", 25)
        .attr("fill", (d) => colorVariation(d))
        .attr("stroke", "black")
        .attr("stroke-width", 1)

})