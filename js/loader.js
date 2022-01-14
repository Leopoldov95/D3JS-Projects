const { csv, json } = d3;
// geopath converts data path to svg path
const { feature } = topojson;
import { renderGraph } from "./bar chart/index.js";
import { renderLineGraph } from "./line graph/index.js";
import { renderScatterGraph } from "./scatter Plot/index.js";
import { renderTreeChart } from "./tree chart/index.js";
import { renderUSMap } from "./simple map/index.js";
import { renderCovidMap } from "./covid map/index.js";
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

export const rendercovidMapData = () => {
  Promise.all([
    json("https://unpkg.com/visionscarto-world-atlas@0.0.4/world/50m.json"),
    csv("/js/covid map/time_series_covid19_confirmed_global_iso3_regions.csv"),
    csv("/js/covid map/iso_3_codes.csv"),
  ]).then(([topoJSONdata, covidCSV, isoCSV]) => {
    // huge data set, want data only for 2021
    // create new array with covide data that contains iso id and ONLY data for 2020
    let filteredCovidData = [];
    covidCSV.forEach((d) => {
      let newObj = {};
      newObj.dates = {};
      newObj["ISO 3166-1 Alpha 3-Codes"] = d["ISO 3166-1 Alpha 3-Codes"];
      Object.keys(d).forEach((key) => {
        // need better method to detect year
        if (new Date(key).getFullYear() === 2021) {
          newObj.dates[key] = d[key];
          newObj["Country/Region"] = d["Country/Region"];
        }
      });
      filteredCovidData.push(newObj);
    });

    const findIsoId = (id) => {
      for (let d of isoCSV) {
        if (d["Alpha-3 code"] === id) {
          return d["Numeric code"];
        }
      }
    };
    // attaching iso id info to covid dataset
    filteredCovidData.forEach((d) => {
      d.iso_id = findIsoId(d["ISO 3166-1 Alpha 3-Codes"]);
    });

    // concerts object rows into the iso id name/code
    const rowById = filteredCovidData.reduce((accumulator, d) => {
      accumulator[d["iso_id"]] = d;
      return accumulator;
    }, {});

    const countries = feature(topoJSONdata, topoJSONdata.objects.countries);
    countries.features.forEach((d) => {
      Object.assign(d.properties, rowById[+d.id]); // parse into number
    });

    const featuresWithCovidData = countries.features.filter(
      (d) => Object.keys(d.properties).length > 0
    );
    renderCovidMap({ features: countries.features, featuresWithCovidData });
  });
};
