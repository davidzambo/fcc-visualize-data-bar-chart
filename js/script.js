const DATA_URL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json',
    margin = {
        top: 50,
        right: 100,
        bottom: 50,
        left: 100
    },
    request = new XMLHttpRequest(),
    mouse = {};

window.onmousemove = (e) => {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
};


request.open('GET', DATA_URL, true);
request.send();
request.onload = () => {
    const response = JSON.parse(request.responseText);
    generateContent(response);
    window.onresize = () => generateContent(response);
};

const generateContent = (response) => {
    const width = window.innerWidth - margin.left - margin.right,
        height = window.innerHeight - 40 - margin.top - margin.bottom,
        dataSet = response.data,
        minDate = new Date(dataSet[0][0]),
        maxDate = new Date(dataSet[dataSet.length - 1][0]);

    const xScale = d3.scaleTime()
        .domain([minDate, maxDate])
        .range([0, width]);
    const yScale = d3.scaleLinear()
        .domain([d3.max(dataSet, d => d[1]), 0])
        .range([margin.top, height - margin.bottom]);

    d3.select('.container').html('<div id="tooltip" class="hidden">\n' +
        '        <p><strong>Value: </strong><span id="value"></span></p>\n' +
        '        <p><strong>Date: </strong><span id="date"></span></p>\n' +
        '    </div>');

    d3.select('.container')
        .append('h1')
        .text(response.name.split(',')[0]);

    d3.select('.container')
        .append('h4')
        .text(response.source_name);

    const svg = d3.select('.container')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height);

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
            d3.select('#tooltip')
                .style('left', (mouse.x - 66)+"px")
                .style('top', (mouse.y - 120)+"px")
                .select('#date')
                .text(d[0]);

            d3.select("#tooltip").classed('hidden', false);

            d3.select('#value')
                .text("$"+(d3.format(',')(d[1])));
        });


    // genereate X  axis
    const xAxis = d3.axisBottom(xScale);
    svg.append('g')
        .attr('transform', `translate(${margin.left}, ${height - margin.bottom})`)
        .call(xAxis);

    svg.append('text')
        .attr('x', width/2 + margin.left -10)
        .attr('y', height)
        .attr('fill', '#456478')
        .attr('font-size', 18)
        .text(response.column_names[0].toLowerCase());

    // generate Y axis
    const yAxis = d3.axisLeft(yScale);
    svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(yAxis);

    // generate Y axis label
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', 10 - height/2)
        .attr('y', 20 + margin.left)
        .attr('fill', '#456478')
        .attr('font-size', 16)
        .text(response.column_names[1].toLowerCase());

    d3.select('.container')
        .append('footer')
        .html('<a href="https://www.dcmf.hu" target="_blank"><span>codedBy</span><img src="https://www.dcmf.hu/images/dcmf-letters.png" alt="dcmf-logo" /></a>');
}