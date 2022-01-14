// IMPORTS
import {
  renderBarGraphData,
  renderLineGraphData,
  renderScatterGraphData,
  renderTreeGraphData,
  renderSimpleMapData,
  rendercovidMapData,
} from "./loader.js";

// DOM Selector
const allNavBtns = document.querySelectorAll(".btn-nav");
const container = document.querySelector("#d3-container");
const sliderContainer = document.querySelector(".slider-container");
// STATE
// Add event listener to each navigation btn
// Need to hide slider if COVID map is NOT selected
const handleSLiderVisibilty = (action) => {
  if (action) {
    !sliderContainer.classList.contains("slider-visible") &&
      sliderContainer.classList.add("slider-visible");
  } else {
    sliderContainer.classList.contains("slider-visible") &&
      sliderContainer.classList.remove("slider-visible");
  }
};
allNavBtns.forEach((element) => {
  element.addEventListener("click", (e) => {
    // when clicking on a new nav item, will need to clear the current html in the container
    container.innerHTML = "";
    console.log(e.target.id);
    switch (e.target.id) {
      case "bar-chart":
        renderBarGraphData();
        handleSLiderVisibilty(false);
        break;
      case "line-chart":
        renderLineGraphData();
        handleSLiderVisibilty(false);
        break;
      case "scatter-plot":
        renderScatterGraphData();
        handleSLiderVisibilty(false);
        break;
      case "tree-data":
        renderTreeGraphData();
        handleSLiderVisibilty(false);
        break;
      case "map-graph":
        renderSimpleMapData();
        handleSLiderVisibilty(false);
        break;
      case "interactive":
        rendercovidMapData();
        handleSLiderVisibilty(true);
        break;
    }
  });
});

renderBarGraphData();
