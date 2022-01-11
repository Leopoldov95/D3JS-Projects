// IMPORTS
import {
  renderBarGraphData,
  renderLineGraphData,
  renderScatterGraphData,
  renderTreeGraphData,
  renderSimpleMapData,
} from "./loader.js";

// DOM Selector
const allNavBtns = document.querySelectorAll(".btn-nav");
const container = document.querySelector("#d3-container");
// STATE
// Add event listener to each navigation btn
allNavBtns.forEach((element) => {
  element.addEventListener("click", (e) => {
    // when clicking on a new nav item, will need to clear the current html in the container
    container.innerHTML = "";
    console.log(e.target.id);
    switch (e.target.id) {
      case "bar-chart":
        renderBarGraphData();
        break;
      case "line-chart":
        renderLineGraphData();
        break;
      case "scatter-plot":
        renderScatterGraphData();
        break;
      case "tree-data":
        renderTreeGraphData();
        break;
      case "map-graph":
        renderSimpleMapData();
        break;
    }
  });
});

renderBarGraphData();
