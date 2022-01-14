export const sizeLegend = (selection, props) => {
  const { sizeScale, spacing, textOffset, numTicks, tickFormat } = props;
  const ticks = sizeScale
    .ticks(numTicks)
    .filter((d) => d !== 0)
    .reverse();
  // parent groupd element
  const groups = selection.selectAll("g").data(ticks);
  const groupsEnter = groups.enter().append("g").attr("class", "tick");
  groupsEnter
    .merge(groups)
    .attr("transform", (d, i) => `translate(0,${i * spacing})`);
  /* .transition()
        .duration(1000); */

  groups.exit().remove();

  //const circles = groups.select("circle");
  groupsEnter
    .append("circle")
    .attr("r", 0)
    .merge(groups.select("circle")) // this helps us combine enter() and update, enter only valueds that are to be updated here
    .attr("r", sizeScale);

  groupsEnter
    .append("text")
    .merge(groups.select("text")) // this helps us combine enter() and update, enter only valueds that are to be updated here
    .text(tickFormat)
    .attr("dy", "0.32em")
    .attr("x", (d) => sizeScale(d) + textOffset);
};
