const mouse = {};

window.onmousemove = (e) => {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
};

const DATA_URL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';
const margin = {
        top: 50,
        right: 100,
        bottom: 50,
        left: 100
    },
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;

const request = new XMLHttpRequest();
request.open('GET', DATA_URL, true);
request.send();
request.onload = () => {
    const response = JSON.parse(request.responseText);
    const dataSet = response.data;
    const minDate = new Date(dataSet[0][0]);
    const maxDate = new Date(dataSet[dataSet.length - 1][0]);

    const xScale = d3.scaleTime()
        .domain([minDate, maxDate])
        .range([0, width]);
    const yScale = d3.scaleLinear()
        .domain([d3.max(dataSet, d => d[1]), 0])
        .range([margin.top, height - margin.bottom]);

    const svg = d3.select('.container')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    svg.selectAll('rect')
        .data(dataSet)
        .enter()
        .append('rect')
        .attr('x', (d, i) => {
            return margin.left + xScale(new Date(d[0]))
        })
        .attr('y', (d, i) => {
            return yScale(d[1])
        })
        .attr('width', ((width) / dataSet.length + 1 + 'px'))
        .attr('height', (d, i) => {
            return height - margin.bottom - yScale(d[1])
        })
        .attr('class', 'bar')
        .on('mouseover', function(d){
            console.log(d);
            d3.select('#tooltip')
                .style('left', (mouse.x - 67)+"px")
                .style('top', (mouse.y - 100)+"px")
                .select('#date')
                .text(d[0]);

            d3.select('#value')
                .text("$"+d[1]);
                // .append('foreignObject')
                // .attr('width', '200px')
                // .attr('height', '200px')
                // .attr('x', 100)
                // .attr('y', 100)
                // .append('xhtml:div')
                // .attr('class', 'tooltip')
                // .text('yo');
        });
        // .append('xhtml:div')
        // .attr('xmlns', 'http://www.w3.org/1999/xhtml')
        // .append('p')
        // .html((d) => `<strong>Date: </strong>${d[0]}, <strong>Value: </strong>${d[1]}`);


    // genereate X  axis
    const xAxis = d3.axisBottom(xScale);
    svg.append('g')
        .attr('transform', `translate(${margin.left}, ${height - margin.bottom})`)
        .call(xAxis);

    // generate X axis label
    svg.append('text')
        .attr('x', 200)
        .attr('y', height - 20)
        .attr('fill', '#333')
        .attr('font-size', 14)
        .text(`${response.description}`);

    // generate Y axis
    const yAxis = d3.axisLeft(yScale);
    svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(yAxis);

    // generate Y axis label
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', 0 - margin.left * 2.5)
        .attr('y', 20 + margin.left)
        .attr('fill', '#FF3333')
        .attr('font-size', 14)
        .text(response.name.split(',')[0]);
}