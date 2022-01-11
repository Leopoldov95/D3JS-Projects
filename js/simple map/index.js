const { select, geoPath, max, interpolateBlues, zoom, scaleSequential } = d3;
import { colorLegend } from "./colorLegend.js";
const svg = select(`svg`);

const projection = d3.geoAlbersUsa(); // chooses the setting on how to prject the world map data

const pathGenerator = geoPath().projection(projection); // projects the sleected projection setting

export const renderUSMap = (data) => {
  const width = +svg.attr("width");
  const height = +svg.attr("height");
  const title = "US Population 2019 Census";
  const g = svg.append("g");
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
  colorScale.domain([0, 40000000]).interpolator(interpolateBlues);
  colorLegendG.call(colorLegend, {
    dataScale: colorScale,
    height: 20,
    width,
  });

  g.selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("class", "country")
    //.attr("d", (d) => pathGenerator(d)); // same as below
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
