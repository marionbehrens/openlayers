var margin = {
    top: 24,
    right: 15,
    bottom: 20,
    left: 30
  },
  width = 400 - margin.left - margin.right,
  height = 220 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse; 
// formatDate = d3.time.format("%m.%y"); // %d.%m.%Y %H:%M

var x = d3.time.scale()
  .range([0, width]);

var y = d3.scale.linear()
  .range([height, 0]);

var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom")
  .ticks(4)
  .tickFormat(d3.time.format("%d.%m.%y"));

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left");

var line = d3.svg.line()
  .x(function(d) {
    return x(d.date);
  })
  .y(function(d) {
    return y(d.value);
  });

function createChart(feature) {
  
  var svg = d3.select("#feature-chart")
    .append("div")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.json('data.json', function(error, data) {
    if (error) throw error;
    data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.value = +d.value;
    });
    x.domain(d3.extent(data, function(d) {
      return d.date;
    }));
    y.domain(d3.extent(data, function(d) {
      return d.value;
    }));
    svg.append("text")
       .attr("x", (width / 2))             
       .attr("y", 0 - (margin.top / 2))
       .attr("text-anchor", "middle")  
       .style("font-size", "16px") 
       .text(feature.getProperties()['name']);
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Value");
    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);
  });
}
