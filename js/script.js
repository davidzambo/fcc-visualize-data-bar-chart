const DATA_URL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';
const width = 900;
const height = 450;
const padding = 50;

const request = new XMLHttpRequest();
request.open('GET', DATA_URL, true);
request.send();
request.onload = () => {
  const response = JSON.parse(request.responseText);
  const dataSet = response.data;
  const minDate = new Date(dataSet[0][0]);
  const maxDate = new Date(dataSet[dataSet.length -1][0]);
  console.log(response);
  console.log(dataSet);

  const xScale = d3.scaleTime()
                  .domain([minDate, maxDate])
                  .range([padding, width - 2 * padding]);
  const yScale = d3.scaleLinear()
                  .domain([d3.max(dataSet, d => d[1]), 0])
                  .range([padding, height - padding]);
                  
  const svg = d3.select('.container')
                .append('svg')
                .attr('width', width)
                .attr('height', height);

  svg.selectAll('rect')
    .data(dataSet)
    .enter()
    .append('rect')
    .attr('x', (d, i) => { return xScale(new Date(d[0]) )})
    .attr('y', (d, i) => { return yScale(d[1])})
    .attr('width', ((width - 2 * padding) / dataSet.length + 1 + 'px'))
    .attr('height', (d, i) => { return height - padding - yScale(d[1]) })
    .attr('fill', 'blue')
    .attr('class', 'bar')
    .append('title')
    .text( d => `Date: ${d[0]} \nValue: ${d[1]} USD`);

  svg.selectAll('text')
    .data(dataSet)
    .enter() 
    .append('text')
    .attr('x', (d, i) => { return xScale(5 * i) })
    .attr('y', (d, i) => { return yScale(height - d[1]) })
    .attr('class', 'infobox')
    .text(d => `Date: ${d[0]} \nValue: ${d[1]} USD`);

    
  // genereate X  axis
  const xAxis = d3.axisBottom(xScale);
  svg.append('g')
    .attr('transform', `translate(0, ${height - padding})`)
    .call(xAxis);

  // generate X axis label
  svg.append('text')
      .attr('x', 20)
      .attr('y', height - padding / 2)
      .attr('fill', '#FF3333')
      .attr('font-size', 14)
      .text(<tspan>response.description+</tspan>);

  // generate Y axis
  const yAxis = d3.axisLeft(yScale);
  svg.append('g')
    .attr('transform', `translate(${padding}, 0)`)
    .call(yAxis);

  // generate Y axis label
  svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', 0 - 4.5 * padding)
      .attr('y', 1.5 * padding)
      .attr('fill', '#FF3333')
      .attr('font-size', 14)
      .text(response.name.split(',')[0]);

}