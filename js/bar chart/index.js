// psuedo imports
const { max, scaleLinear, scaleBand, select, axisLeft, axisBottom, format } =
  d3; // calculates the maximum value of a data set
//const scaleLinear = d3.scaleLinear;

const width = 960;
const height = 500;

const svg = select("svg")
  //.attr("class", "bar-chart")
  .attr("height", height)
  .attr("width", width);
export const renderGraph = (data) => {
  const yValue = (d) => d.population; // can use this to replace the repeated function
  const xValue = (d) => d.state;
  const title = "Top 10 Most Populated States 2020";
  const margin = { top: 50, right: 60, bottom: 70, left: 100 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const tickNumberFormat = (number) => format(".3s")(number).replace("G", "B");
  // will hold the chart
  const chart = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  // population y scale
  const yScale = scaleLinear()
    .domain([0, max(data, yValue)])
    .range([innerHeight, 0]);
  // state names x scale
  const xScale = scaleBand()
    .domain(data.map(xValue))
    .range([0, innerWidth])
    .padding(0.1);

  // to makeit neater, first create a group element for the y axis
  const yAxis = axisLeft(yScale).tickSize(-width).tickFormat(tickNumberFormat);
  const xAxis = axisBottom(xScale);
  /*   const yAxis = axisLeft(yScale)
  .tickSize(-innerWidth)
  .tickFormat(tickNumberFormat)
  .tickPadding(10);
const yAxisG = g.append("g").call(yAxis); */
  // append yScale to chart
  const yAxisG = chart.append("g").call(yAxis);
  //yAxisG.select(".domain").remove();
  // append xScale to chart
  // the transformation is needed in order to make sure that the chart has the axis in the righ domentsions
  const xAxisG = chart
    .append("g")
    .call(xAxis)
    .attr("transform", `translate(0,${innerHeight})`);

  // creating the bars
  chart
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d) => xScale(xValue(d)))
    .attr("y", (d) => yScale(yValue(d)))
    .attr("height", (d) => innerHeight - yScale(yValue(d)))
    .attr("width", xScale.bandwidth())
    .attr("class", "bar-chart-rect");
  // creates text labels
  yAxisG
    .append("text")
    .attr("class", "axis-label")
    .attr("y", -60)
    // .attr("x", -(innerHeight / 2) - 60)
    .attr("x", -innerHeight / 2)
    .attr("fill", "black")
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .text("Population");
  xAxisG
    .append("text")
    .attr("class", "axis-label")
    .attr("x", innerWidth / 2)
    .attr("y", 60)
    .attr("text-anchor", "middle")
    .text("States");
  chart
    .append("text")
    .attr("x", innerWidth / 2)
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .text(title);
};
