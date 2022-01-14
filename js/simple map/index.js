const { select, geoPath, max, interpolateBlues, zoom, scaleSequential } = d3;
import { colorLegend } from "./colorLegend.js";

const width = 960;
const height = 500;
const margin = { top: 0, left: 0, right: 100, bottom: 0 };
const innerWidth = width - margin.left - margin.right;
const svg = select("svg").attr("height", height).attr("width", innerWidth);

const projection = d3.geoAlbersUsa();

const pathGenerator = geoPath().projection(projection);

export const renderUSMap = (data) => {
  const title = "US Population 2019 Census";
  const g = svg.append("g").attr("transform", "scale(0.9)");

  // group container for colorScale
  const colorLegendG = svg
    .append("g")
    .attr("transform", `translate(0,${height - 20})`);

  svg.call(
    zoom().on("zoom", ({ transform }) => {
      g.attr("transform", transform);
    })
  );
  const colorScale = scaleSequential();

  const colorValue = (d) => d.properties["2019"];

  // defining the color scale
  colorScale
    .domain(d3.extent(data.features, colorValue))
    .interpolator(interpolateBlues);
  colorLegendG.call(colorLegend, {
    dataScale: colorScale,
    height: 20,
    width: innerWidth,
  });

  g.selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("class", "country")
    .attr("d", pathGenerator)
    .attr("fill", (d) => colorScale(colorValue(d)))
    .append("title")
    .text((d) => d.properties.name + ": " + colorValue(d));
  g.append("text")
    .attr("x", width / 2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .attr("class", "map-title")
    .text(title);
};
