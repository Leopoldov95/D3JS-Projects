export const colorLegend = (selection, props) => {
  const { height, width, dataScale } = props;

  const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, width]);
  const maxVal = dataScale.domain()[1];
  const bars = selection.selectAll(".bars").data([null]);
  bars
    .data(d3.range(width), function (d) {
      return d;
    })
    .enter()
    .append("rect")
    .attr("class", "bars")
    .attr("x", function (d, i) {
      return i;
    })
    .attr("y", 0)
    .attr("height", height)
    .attr("width", 1)
    .style("fill", function (d, i) {
      return colorScale(d);
    });
  selection.append("text").text("0");
  selection
    .append("text")
    .attr("transform", `translate(${width - 80},-5)`)
    .text(`${maxVal}`);
};
