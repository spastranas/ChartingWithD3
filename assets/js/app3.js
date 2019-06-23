// SVG wrapper dimensions are determined by the current width
// and height of the browser window.
var svgWidth = 1200;
var svgHeight = 660;

var margin = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;


// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Import Data
d3.csv("assets/data/data.csv")
  .then(function(wholedataset) {
 // Step 1: Parse Data/Cast as numbers
    // ==============================
    wholedataset.forEach(function(data) {
        wholedataset.poverty = +wholedataset.poverty;
        wholedataset.obesity = +wholedataset.obesity;
        wholedataset.abbr = wholedataset.abbr;
        console.log(wholedataset.poverty);
      });

// Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([20, d3.max(wholedataset, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(wholedataset, d => d.obesity)])
      .range([height, 0]);



 







    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(wholedataset)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "15")
    .attr("fill", "red")
    .attr("opacity", ".5");

    // create text inside circles
    // ====================================
    var textgroup = chartGroup.selectAll("text")
    .data(wholedataset)
    .enter()
    .append("text")
    .classed("states",true)
    .text((d)=>d.abbr)
    .attr("x", d => xLinearScale(d.poverty)-10)
    .attr("y", d => yLinearScale(d.obesity)+5)


;
     

   // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);


  // append axes
  chartGroup.append("g")
  .attr("transform", `translate(0, ${height})`)
  .text("smoke rate")
  .call(bottomAxis);

chartGroup.append("g")
   .text("obesity rates")
   .call(leftAxis);


var tx="Smoke vs Obesity rate "
   var toolTip = d3.tip()
   .attr("class", "tooltip")
   .offset([80, -60])
   .html(function(d) {
     return (`${tx} <br> <center>${d.abbr} <hr>  ${d.smokes} | ${d.obesity}
     `);
   });

 // Step 2: Create the tooltip in chartGroup.
 chartGroup.call(toolTip);

 // Step 3: Create "mouseover" event listener to display tooltip
 circlesGroup.on("mouseover", function(d) {
   toolTip.show(d, this);
 })
 // Step 4: Create "mouseout" event listener to hide tooltip
   .on("mouseout", function(d) {
     toolTip.hide(d);
   });



   svg.append("text")
   .attr("class", "x label")
   .attr("text-anchor", "center")
   .attr("x", width)
   .attr("y", height+3 )
   .text(" Smoke (Rate)");

   svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text(" Obesity (Rate)");



});