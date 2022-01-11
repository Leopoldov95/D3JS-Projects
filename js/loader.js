const { csv, json } = d3;
// geopath converts data path to svg path
const { feature } = topojson;
import { renderGraph } from "./bar chart/index.js";
import { renderLineGraph } from "./line graph/index.js";
import { renderScatterGraph } from "./scatter Plot/index.js";
import { renderTreeChart } from "./tree chart/index.js";
import { renderUSMap } from "./simple map/index.js";
export const renderBarGraphData = () => {
  // parses csv file into js array
  csv("/js/bar chart/state_population.csv").then((data) => {
    data.forEach((d) => {
      d.population = +d.population;
    });
    renderGraph(data); // creates a rectangle for each element in the dat array
  });
};

export const renderLineGraphData = () => {
  csv("/js/line graph/CAPOP.csv").then((data) => {
    data.forEach((d) => {
      d.population = +d.population * 1000;
      d.year = new Date(d.year);
    });
    renderLineGraph(data);
  });
};

export const renderScatterGraphData = () => {
  csv("/js/scatter Plot/co2-emissions-vs-gdp.csv").then((data) => {
    let filteredData;
    // want to gran the data from a specific year
    filteredData = data.filter((d) => d.Year === "2018");
    filteredData = filteredData.filter((d) => d["GDP per capita"].length > 1);
    filteredData = filteredData.filter((d) => d.Entity !== "Qatar");
    filteredData = filteredData.filter((d) => d.Code !== "");
    // This commments code onlye served to check the data integrity
    /* let noGDPCounter = 0;
    
    console.log(noGDPCounter); */
    // BIG data set
    // need to filter by year
    filteredData.forEach((d) => {
      d["GDP per capita"] = +d["GDP per capita"];
      d["Annual CO2 emissions (per capita)"] =
        +d["Annual CO2 emissions (per capita)"];
    });

    renderScatterGraph(filteredData);
  });
};

export const renderTreeGraphData = () => {
  json("/js/tree chart/us_states.json").then((data) => {
    renderTreeChart(data);
  });
};

export const renderSimpleMapData = () => {
  const year = "2019";
  // create population map
  Promise.all([
    json("https://cdn.jsdelivr.net/npm/us-atlas@3.0.0/states-10m.json"),
    csv("/js/simple map/us_pop.csv"),
  ]).then(([topoJSONdata, popData]) => {
    popData.forEach((d) => {
      d[year] = +d[year].replace(/[, ]+/g, "");
    });
    const rowByName = popData.reduce((accumulator, d) => {
      accumulator[d["Geographic Area"]] = d;
      return accumulator;
    }, {});
    const states = feature(topoJSONdata, topoJSONdata.objects.states);
    states.features.forEach((d) => {
      Object.assign(d.properties, rowByName[d.properties.name]);
      //console.log(d.properties.name);
    });
    console.log(states);
    renderUSMap(states);
  });
};
