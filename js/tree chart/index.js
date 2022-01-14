const { select, tree, hierarchy, linkHorizontal, zoom } = d3;
const width = 960;
const height = 500;
const svg = select("svg").attr("height", height).attr("width", width);
const margin = { top: 0, left: 100, right: 100, bottom: 0 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

export const renderTreeChart = (data) => {
  // tree layout
  const treeLayout = tree().size([innerHeight, innerWidth]);
  const zoomG = svg.attr("width", width).attr("height", height).append("g");
  const g = zoomG
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  svg.call(
    zoom().on("zoom", ({ transform }) => {
      zoomG.attr("transform", transform);
    })
  );

  const root = hierarchy(data);
  const links = treeLayout(root).links();
  // creates a horizontal tree graph
  const linkPathGenerator = linkHorizontal()
    .x((d) => d.y)
    .y((d) => d.x);

  g.selectAll("path")
    .data(links)
    .enter()
    .append("path")
    .attr("class", "tree-path")
    .attr("d", linkPathGenerator);
  // Text Labels for our nodes
  g.selectAll("text")
    .data(root.descendants())
    .enter()
    .append("text")
    .attr("class", "tree-text")
    .attr("x", (d) => d.y)
    .attr("y", (d) => d.x)
    .attr("dy", "0.32em")
    .attr("text-anchor", (d) => (d.children ? "middle" : "start")) // if not a leaf node set to middle, else set it to start
    .attr("font-size", (d) => 3.25 - d.depth + "em") // a value for depth is applied to every node each tie it is passd down the hierarchy
    .text((d) => d.data.data.id);
  //.text((d) => d.data.data.id);
};
