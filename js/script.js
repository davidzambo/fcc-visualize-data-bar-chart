const DATA_URL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';
const width = 1200;
const heigth = 600;

const request = new XMLHttpRequest();
request.open('GET', DATA_URL, true);
request.send();
request.onload = () => {
  const response = JSON.parse(request.responseText);
  const dataSet = response.data;
  console.log(dataSet);

  const xScale = d3.scaleLinear()
                  .domain([0, dataSet.length])
                  .range([0, 600]);
  const yScale = d3.scaleLinear()
                  .domain([0, d3.max(dataSet, d => d[1])])
                  .range([0, width]);
                  
  const svg = d3.select('.container')
                .append('svg')
                .attr('width', width)
                .attr('height', heigth);

  svg.selectAll('rect')
    .data(dataSet)
    .enter()
    .append('rect')
    .attr('x', (d, i) => { return xScale(5 * i)})
    .attr('y', (d, i) => { return yScale(heigth - d[1])})
    .attr('width', xScale(4))
    .attr('height', (d, i) => { return yScale(d[1]) })
    .attr('fill', 'blue')
    .attr('class', 'bar')
    .append('title');
    // .text( d => `${d[1]}`);

  svg.selectAll('text')
    .data(dataSet)
    .enter()
    .append('text')
    .attr('x', (d, i) => { return xScale(5 * i) })
    .attr('y', (d, i) => { return yScale(heigth - d[1]) });
    // .text( d => `${d[1]}`);
}