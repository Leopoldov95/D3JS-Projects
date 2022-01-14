const {
  select,
  geoPath,
  geoCentroid,
  geoNaturalEarth1,
  zoom,
  format,
  scaleSqrt,
  max,
} = d3;

import { sizeLegend } from "./sizeLegend.js";
import { dateSlider } from "./dateSlider.js";

const sliderContainer = select(".slider-container");

const projection = geoNaturalEarth1(); // chooses the setting on how to prject the world map data
const pathGenerator = geoPath().projection(projection); // projects the sleected projection setting

export const renderCovidMap = (loadedData) => {
  const width = 960;
  const height = 550;
  let svg;
  let g;
  svg = select("svg").attr("height", height).attr("width", width);
  g = svg.append("g").attr("transform", "translate(0, 40)");
  // STATE
  let data = loadedData;
  let inputDate = "7/1/21";

  // function to change date
  const onSlideChange = (selectedDate) => {
    inputDate = selectedDate;
    console.log(inputDate);
    // hack...
    document.querySelector("svg").innerHTML = "";
    svg = select("svg").attr("height", height).attr("width", width);
    g = svg.append("g").attr("transform", "translate(0, 40)");
    render();
  };

  // Main render
  const render = () => {
    svg
      .append("text")
      .text(`COVID Interactive Map 2021 Data - ${inputDate}`)
      .attr("x", width / 2)
      .attr("text-anchor", "middle")
      .attr("y", 20);

    let date = inputDate ? inputDate : "7/1/21";
    const radiusValue = (d) =>
      d.properties && d.properties.dates ? +d.properties.dates[date] : 0;

    g.append("path")
      .attr("class", "sphere")
      .attr("fill", "#ececec")
      .attr("d", pathGenerator({ type: "Sphere" }));

    svg.call(
      zoom().on("zoom", ({ transform }) => {
        g.attr("transform", transform);
      })
    );

    const populationFormat = format(",");

    const sizeScale = scaleSqrt()
      .domain([0, max(data.features, radiusValue)])
      .range([0, 40]);

    g.selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
      .attr("class", "country-covid")
      //.attr("d", (d) => pathGenerator(d)); // same as below
      .attr("d", pathGenerator) // need this to
      //.attr("fill", "steelblue")
      .attr("fill", (d) =>
        Object.keys(d.properties).length > 0 ? "#cbcbcb" : "#ff000052"
      )
      .append("title")
      // this line modifies the tooltip tp show the country name and population on moseover
      .text((d) =>
        radiusValue(d) === 0
          ? "No COVID Data"
          : [
              d.properties["Country/Region"],
              populationFormat(radiusValue(d)),
            ].join(": ")
      );

    // this logic allows us to only use the geoCentroid method once per country
    data.featuresWithCovidData.forEach((d) => {
      // mutate the d object
      d.properties.projected = projection(geoCentroid(d));
    });

    g.selectAll("circle")
      .data(data.featuresWithCovidData)
      .enter()
      .append("circle")
      .attr("class", "country-circle")
      .attr("cx", (d) => d.properties.projected[0]) // index 0 is x coordinate
      .attr("cy", (d) => d.properties.projected[1]) // index 1 is x coordinate
      .attr("r", (d) => sizeScale(radiusValue(d)));

    g.append("g")
      .attr("transform", `translate(50,200)`)
      .call(sizeLegend, {
        sizeScale,
        spacing: 45,
        textOffset: 10,
        numTicks: 5,
        tickFormat: populationFormat,
      })
      .append("text")
      .attr("class", "legend-title")
      .text(`COVID Cases`)
      .attr("y", -50)
      .attr("x", -40);

    sliderContainer.call(dateSlider, {
      minDate: "2021-01-02",
      maxDate: "2022-01-01",
      value: 181,
      type: "range",
      onSlideChange,
    });
  };

  // use d.name for title
  // use d.iso_n3 for id
  render();
};
