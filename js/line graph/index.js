// psuedo imports
const {
  scaleLinear,
  scaleTime,
  select,
  extent,
  axisLeft,
  axisBottom,
  format,
  line,
  curveBasis,
} = d3;

const width = 960;
const height = 500;
const svg = select("svg").attr("height", height).attr("width", width);

export const renderLineGraph = (data) => {
  const title = "Historic Population of California";
  const xValue = (d) => d.year;
  const xAxisLabel = "Year";
  const yValue = (d) => d.population;
  const yAxisLabel = "Population";
  const tickNumberFormat = (number) => format(".3s")(number).replace("G", "B");
  const margin = { top: 50, right: 20, bottom: 90, left: 120 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  // X axis scale
  const xScale = scaleTime()
    .domain(extent(data, xValue))
    .range([0, innerWidth]);

  // Y-axis scale
  const yScale = scaleLinear()
    .domain(extent(data, yValue))
    .range([innerHeight, 0])
    .nice();
  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xAxis = axisBottom(xScale).tickSize(-innerHeight).tickPadding(15);
  const yAxis = axisLeft(yScale)
    .tickSize(-innerWidth)
    .tickFormat(tickNumberFormat)
    .tickPadding(10);
  const yAxisG = g.append("g").call(yAxis);
  yAxisG.select(".domain").remove();

  yAxisG
    .append("text")
    .attr("class", "axis-label")
    .attr("y", -93)
    .attr("x", -innerHeight / 2)
    .attr("fill", "black")
    .attr("transform", `rotate(-90)`)
    .attr("text-anchor", "middle")
    .text(yAxisLabel);
  const xAxisG = g
    .append("g")
    .call(xAxis)
    .attr("transform", `translate(0,${innerHeight})`);
  xAxisG.select(".domain").remove();
  xAxisG
    .append("text")
    .attr("class", "axis-label")
    .attr("y", 80)
    .attr("x", innerWidth / 2)
    .attr("fill", "black")
    .text(xAxisLabel);
  const lineGenerator = line()
    .x((d) => xScale(xValue(d)))
    .y((d) => yScale(yValue(d)))
    .curve(curveBasis);
  // the line generator
  g.append("path").attr("class", "line-path").attr("d", lineGenerator(data));

  g.append("text").attr("class", "title").attr("y", -10).text(title);
};
