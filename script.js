let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"

d3.json(url)
    .then(data => callback(data))
    .catch(err => console.log(err));

const callback = (data) => {

let values = data.data

let heightScale
let xScale
let xAxisScale
let yAxisScale

let width = 1000;
let height = 400;
let padding = 40

//section and heading
let section = d3.select('body').append('section');

let heading = section.append('heading');
  heading
        .append('h1')
        .attr('id', 'title')
        .text('United States GDP');
    heading
        .append('h3')
        .attr('id', 'description')
        .html('1947 - 2015');

//create tip
let tip = d3
    .tip()
    .attr('class', 'd3-tip')
    .attr('id', 'tooltip')
    .html(d => {
        return d;
    })
    .direction('e')
    .offset([0, 5]);

//create svg
let svg = section
    .append('svg')
    .attr('width', width + padding * 2)
    .attr('height', height + padding * 2)
    .call(tip)

    svg.attr('width', width)
    svg.attr('height', height)

    heightScale = d3.scaleLinear()
                    .domain([0, d3.max(values, (item) => {
                        return item[1]
                    })])
                    .range([0, height - (2 * padding)])

    xScale = d3.scaleLinear()
                    .domain([0, values.length - 1])
                    .range([padding, width - padding])

    let datesArray = values.map((item) => {
        return new Date(item[0])
    })

    xAxisScale = d3.scaleTime()
                    .domain([d3.min(datesArray), d3.max(datesArray)])
                    .range([padding, width - padding])

    yAxisScale = d3.scaleLinear()
                    .domain([0, d3.max(values, (item) => {
                        return item[1]
                    })])
                    .range([height - padding, padding])

    svg.selectAll('rect')
        .data(values)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('width', (width - (2 * padding)) / values.length)
        .attr('data-date', (item) => {
            return item[0]
        })
        .attr('data-gdp', (item) => {
            return item[1]
        })
        .attr('height', (item) => {
            return heightScale(item[1])
        })
        .attr('x', (item, index) => {
            return xScale(index)
        })
        .attr('y', (item) => {
            return (height - padding) - heightScale(item[1])
        })
        .on('mouseover', function(event, d) {
            let str =
                `<span class='date'> 
                    DATE: ${d[0]} 
                </span>
                <br />
                <span class='gdp'>
                   GDP: ${d[1]} 
                </span>`
            tip.attr('data-date', d[0]);
            tip.show(str, this);
          })
          .on('mouseout', tip.hide);

    let xAxis = d3.axisBottom(xAxisScale)
    let yAxis = d3.axisLeft(yAxisScale)


    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, ' + (height - padding) + ')')

    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', 0)')
}
