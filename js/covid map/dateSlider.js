const { select } = d3;
export const dateSlider = (selection, props) => {
  const { minDate, maxDate, value, type, onSlideChange } = props;

  function getDaysArray(start, end) {
    for (
      var arr = [], dt = new Date(start);
      dt <= end;
      dt.setDate(dt.getDate() + 1)
    ) {
      arr.push(new Date(dt));
    }
    return arr;
  }
  const daylist = getDaysArray(new Date(minDate), new Date(maxDate));
  const slider = selection.select(".date-slider");
  slider
    .attr("type", type)
    .attr("min", 0)
    .attr("max", `${daylist.length - 1}`)
    .attr("value", value)
    .text("slider text");
  selection.select(".slider-start").text(
    new Date(minDate).toLocaleString("en-US", {
      year: "2-digit",
      month: "numeric",
      day: "numeric",
    })
  );
  selection.select(".slider-end").text(
    new Date(maxDate).toLocaleString("en-US", {
      year: "2-digit",
      month: "numeric",
      day: "numeric",
    })
  );
  slider.on("input", function (d) {
    var value = d3.select(this).property("value");
    onSlideChange(
      daylist[value].toLocaleString("en-US", {
        year: "2-digit",
        month: "numeric",
        day: "numeric",
      })
    ); // converts to YYYY-MM-DD Format
  });
  //slider.exit().remove();
  // to get this to work we need to append the new date to the html element
  //console.log(d3.select(".date-slider")._groups[0][0].value);
};
