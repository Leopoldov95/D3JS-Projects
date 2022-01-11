// psuedo imports
const { scaleLinear, extent, select, axisLeft, axisBottom, format } = d3;
const svg = select("svg");

const width = +svg.attr("width");
const height = +svg.attr("height");

export const renderScatterGraph = (data) => {
  const title = "C02 Emission Per Person vs GDP - 2018";
  const xValue = (d) => d["GDP per capita"];
  const xAxisLabel = "GDP per capita";
  const yValue = (d) => d["Annual CO2 emissions (per capita)"];
  const yAxisLabel = "Annual CO2 emissions (per capita)";
  const circleRadius = 8;

  const margin = { top: 50, right: 20, bottom: 90, left: 200 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const xScale = scaleLinear()
    .domain(extent(data, xValue))
    .range([0, innerWidth])
    .nice();

  const yScale = scaleLinear()
    .domain(extent(data, yValue))
    .range([innerHeight, 0])
    .nice();
  //.padding(0.7);

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  const numTickFormat = (number) => format(".3s")(number);
  const xAxis = axisBottom(xScale).tickSize(-innerHeight).tickPadding(15);
  const yAxis = axisLeft(yScale).tickSize(-innerWidth).tickPadding(10);
  const yAxisG = g.append("g").call(yAxis);
  const tooltip = select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
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

  // for scatter plot, change rect to circle
  g.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cy", (d) => yScale(yValue(d)))
    .attr("cx", (d) => xScale(xValue(d)))
    .attr("fill", "steelblue")
    .attr("opacity", "0.3")
    .attr("r", circleRadius)
    .on("mouseover", function (e, i) {
      select(this)
        .transition()
        .duration("100")
        .attr("r", 12)
        .attr("fill", "slateblue")
        .attr("opacity", "0.5");
      tooltip.transition().duration(100).style("opacity", 1);
      tooltip
        .html(i.Entity)
        .style("left", e.pageX + 10 + "px")
        .style("top", e.pageY - 15 + "px");
    })
    .on("mouseout", function (e, i) {
      select(this)
        .transition()
        .duration("200")
        .attr("r", circleRadius)
        .attr("fill", "steelblue")
        .attr("opacity", "0.3");
      tooltip.transition().duration("200").style("opacity", 0);
    });

  g.append("text").attr("class", "title").attr("y", -10).text(title);
};
