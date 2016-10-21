angular.module('omniMood')
  .directive('killerqueen', function() {
    return {
      restrict: 'E',
      scope: {

      },
      link: timeelse
    };

    function timeelse(scope, element, attr) {
      var timeSVG = d3.select(element[0]).append("svg")
        .attr("id", "svg_map"),
        width = window.innerWidth * .70,
        height = window.innerHeight * .70,
        outlineDefault = "#eeeeee",
        outlineHighlight = "#1221ee",
        fillDefault = "#000000",
        moodMin = -10,
        moodMid = 0,
        moodMax = 10,
        countryArrayIndex = 0;
      var timeScale = d3.scaleLinear()
        .domain([-10, 0, 10])
        .range(["red", "yellow", "green"]);

      var g = timeSVG
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("id", "map-container");

      g
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "steelblue");

      d3.json("../json/countries_no_show_antarctica.json", function(error, world) {
        var countries = topojson.feature(world, world.objects.countries).features;
        var projection = d3.geoMercator()
          .scale((height + 50) / (1.55 * Math.PI))
          .translate([width / 2, height / 1.5]);

        var path = d3.geoPath()
          .projection(projection);

        g.selectAll(".country")
          .data(countries)
          .enter().insert("path", ".graticule")
          .attr("id", function(d) {
            return "dd" + (d.properties.iso_n3 / 1);
          })
          .attr("d", path)
          .attr("stroke", outlineDefault)
        .append("svg:title")
        .text(function(d) {
          return d.properties.name;
        });
      });

      d3.json('http://localhost:3000/api/timeline', function(error, timeData) {
          var countries = timeData.countries;
          var timeSelect = document.getElementById("timeRange");
          var textSelect = document.getElementById("timeDisplay");
          d3.select(timeSelect).
            on('change', function(stuff){
              var timePlace = document.getElementById("timeRange").value;
              textSelect.innerHTML = timeData.times[timePlace];
              for(var country in countries){
                d3.select("path#dd" + country)
                    .style("fill", "white")
                    .attr("stroke", "black")
                    .attr("stroke-width", 1)
                    .transition()
                    .duration(2000)
                    .attr("stroke","#eeeeee")
                    .attr("stroke-width", 1)
                    .style("fill", timeScale(countries[country][timePlace] * 10));
            }
          });
      });
    }

    function backToMap () {
      d3.select("g#countryInfo-wrapper")
        .remove();
      d3.select("g#map-container")
        .attr("visibility", "visible");
    }
  });