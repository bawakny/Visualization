	function RadarChart(id, forces, data, options, counter, force_counter,mode) {
	    var cfg = {
	        w: 650, //Width of the circle
	        h: 650, //Height of the circle
	        margin: {
	            top: 20,
	            right: 20,
	            bottom: 20,
	            left: 20
	        }, //The margins of the SVG
	        levels: 3, //How many levels or inner circles should there be drawn
	        maxValue: 0, //What is the value that the biggest circle will represent
	        labelFactor: 1.25, //How much farther than the radius of the outer circle should the labels be placed
	        wrapWidth: 60, //The number of pixels after which a label needs to be given a new line
	        opacityArea: 0.35, //The opacity of the area of the blob
	        dotRadius: 4, //The size of the colored circles of each blog
	        opacityCircles: 0.1, //The opacity of the circles of each blob
	        strokeWidth: 0.5, //The width of the stroke around each blob
	        roundStrokes: false, //If true the area and stroke will follow a round path (cardinal-closed)
	        color: d3.scale.category10() //Color function
	    };
	    var months = [{
	            name: "December"
	        }, {
	            name: "January"
	        }, {
	            name: "February"
	        }, {
	            name: "March"
	        }, {
	            name: "April"
	        }, {
	            name: "May"
	        }, {
	            name: "June"
	        }, {
	            name: "July"
	        }, {
	            name: "August"
	        }, {
	            name: "Septemper"
	        }, {
	            name: "October"
	        }, {
	            name: "November"
	        }

	    ];
	    //Put all of the options into a variable called cfg
	    if ('undefined' !== typeof options) {
	        for (var i in options) {
	            if ('undefined' !== typeof options[i]) {
	                cfg[i] = options[i];
	            }
	        } //for i
	    } //if



	    var maxValue = d3.max(data, function(d) {
	        return d.Temp;
	    });
	    var minValue = d3.min(data, function(d) {
	        return d.Temp;
	    });

	    var human_maxValue = d3.max(forces, function(d) {
	        return d.Human;
	    });
	    var human_minValue = d3.min(forces, function(d) {
	        return d.Human;
	    });

	    var natural_maxValue = d3.max(forces, function(d) {
	        return d.Natural;
	    });
	    var natural_minValue = d3.min(forces, function(d) {
	        return d.Natural;
	    });



	    //If the supplied maxValue is smaller than the actual one, replace by the max in the data

	    //var pathColor = d3.scale.linear()
	    //	.domain([0,counter]).range(["green","red"]);

	    /*var width = d3.scale.linear()
	    .domain([human_minValue,counter]).range([0.001,3]);
	
	    var width = d3.scale.linear()
	    .domain([0,human_maxValue]).range([0.001,3]);
	    */
	    var width = d3.scale.linear()
	        .domain([287, 289]).range([0.0001, 5]);

	    var pathColor = d3.scale.linear()
	        .domain([0, counter])
	        // .interpolate(d3.interpolateRgb)
	        .interpolate(d3.interpolateHsl)
	        //.interpolate(d3.interpolateHcl)
	        .range(['green', 'red']);
	    /*var width = d3.scale.linear()
	    .domain([0,counter]).range([0.01,5]);*/
	    var opcty = d3.scale.linear()
	        .domain([0, counter]).range([1, 0.5]);
	    var allAxis = (months.map(function(i) {
	            return i.name
	        })), //Names of each axis
	        total = allAxis.length, //The number of different axes
	        radius = Math.min(cfg.w / 2, cfg.h / 2), //Radius of the outermost circle
	        Format = d3.format("0.1f"), //Percentage formatting
	        angleSlice = Math.PI * 2 / total; //The width in radians of each "slice"

	    //Scale for the radius
	    var rScale = d3.scale.linear()
	        .range([0, radius])
	        .domain([minValue, maxValue]);

	    /////////////////////////////////////////////////////////
	    //////////// Create the container SVG and g /////////////
	    /////////////////////////////////////////////////////////

	    //Remove whatever chart with the same id/class was present before
	    d3.select(id).select("svg").remove();

	    //Initiate the radar chart SVG
	    var svg = d3.select(id).append("svg")
	        .style("width", "650px")
	        .style("height", "650px")
	        .style("margin-lef", "auto")
	        .style("margin-right", "auto")

	    .attr("class", "radar" + id);
	    //Append a g element		
	    var g = svg.append("g")
	        .attr("transform", "translate(" + 320 + "," + (cfg.h / 2 + cfg.margin.top) + ")");

	    /////////////////////////////////////////////////////////
	    ////////// Glow filter for some extra pizzazz ///////////
	    /////////////////////////////////////////////////////////

	    //Filter for the outside glow
	    var filter = g.append('defs').append('filter').attr('id', 'glow'),
	        feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur'),
	        feMerge = filter.append('feMerge'),
	        feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'coloredBlur'),
	        feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

	    /////////////////////////////////////////////////////////
	    /////////////// Draw the Circular grid //////////////////
	    /////////////////////////////////////////////////////////

	    //Wrapper for the grid & axes
	    var axisGrid = g.append("g").attr("class", "axisWrapper");

	    //Draw the background circles
	    axisGrid.selectAll(".levels")
	        .data(d3.range(1, (cfg.levels + 1)).reverse())
	        .enter()
	        .append("circle")
	        .attr("class", "gridCircle")
	        .attr("r", function(d, i) {
	            return radius / cfg.levels * d;
	        })
	        .style("fill", "#CDCDCD")
	        .style("stroke", "#CDCDCD")
	        .style("fill-opacity", cfg.opacityCircles)
	        .style("filter", "url(#glow)");

	    //Text indicating at what % each level is
	    axisGrid.selectAll(".axisLabel")
	        .data(d3.range(1, (cfg.levels + 1)).reverse())
	        .enter().append("text")
	        .attr("class", "axisLabel")
			.style("fill","white")
	        .attr("x", 1)
	        .attr("y", function(d) {
	            return -d * radius / cfg.levels;
	        })
	        .attr("dy", "0.4em")
	        .style("font-size", "20px")
	        .attr("fill", "black")

	    .text(function(d, i) {
	        return Format(2.5 * d / cfg.levels) - 1;
	    });

	    /////////////////////////////////////////////////////////
	    //////////////////// Draw the axes //////////////////////
	    /////////////////////////////////////////////////////////

	    //Create the straight lines radiating outward from the center
	    var axis = axisGrid.selectAll(".axis")
	        .data(allAxis)
	        .enter()
	        .append("g")
	        .attr("class", "axis");
	    //Append the lines
	    axis.append("line")
	        .attr("x1", 0)
	        .attr("y1", 0)
	        .attr("x2", function(d, i) {
	            return rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2);
	        })
	        .attr("y2", function(d, i) {
	            return rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2);
	        })
	        .attr("class", "line")
	        .style("stroke", "white")
	        .style("stroke-width", "2px");

	    //Append the labels at each axis
	    axis.append("text")
	        .attr("class", "legend")
	        .style("font-size", "11px")
	        .attr("text-anchor", "middle")
	        .attr("dy", "0.35em")
	        .attr("x", function(d, i) {
	            return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2);
	        })
	        .attr("y", function(d, i) {
	            return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2);
	        })
	        .text(function(d) {
	            return d
	        })
	        .call(wrap, cfg.wrapWidth);

	    /////////////////////////////////////////////////////////
	    ///////////// Draw the radar chart blobs ////////////////
	    /////////////////////////////////////////////////////////
	    //The radial line function
	    var radarLine = d3.svg.line.radial()
	        .interpolate("cardinal")
	        .radius(function(d) {
	            return rScale(d.Temp);
	        })
	        .angle(function(d, i) {
	            return (d.Date * 100 % 100) * angleSlice;
	        });
	    //var ss = 	radarLine(data);
	    //console.log(ss);

	    if (cfg.roundStrokes) {
	        radarLine.interpolate("cardinal");
	    }



	    var lineGraph = g;


	    var force = 0;
	    var init = 1;
	    for (i = 1; i <= counter; ++i) {
	        temp = data.slice(init - 1, i);
	        init = i;
	        force = parseInt(data[i].Date) - 1850;
			if (mode == 0 )		force=287.5;
			else if (mode == 1 ) force = forces[force].Human;
			else if (mode == 2 ) force = forces[force].Natural;

	        lineGraph.append("path")
	            .attr("d", radarLine(temp))
	            .attr("stroke", function() {
	                return pathColor(i);
	            })
	            .style("stroke-width", function() {
	                return width(force) + "px";
	            })
	            .attr("fill", "none")
	            .style("filter", "url(#glow)");
	        //.style("opacity" ,  function() {return opcty(i); });


	    }

	    /*
	    //Create a wrapper for the blobs	
	    var blobWrapper = g.selectAll(".radarWrapper")
	    	.data(data)
	    	.enter().append("g")
	    	*/
	    /*	
		var lineGraph = g
                              .append("path")
                           .attr("d", radarLine(data))
                           .attr("stroke",  pathColor(1500))
                           .style("stroke-width", cfg.strokeWidth + "px")
                            .attr("fill", "none")
                              .style("filter" , "url(#glow)");       

	/*	
	//Create the outlines	
	blobWrapper.append("path")
		.attr("class", "radarStroke")
		.attr("d", function(d,i) {console.log(rScale(d.Temp));return radarLine(d); })
		.style("stroke-width", cfg.strokeWidth + "px")
		.style("stroke", function(d,i) { return cfg.color(i); })
		.style("fill", "none")
		.style("filter" , "url(#glow)");	
	*/
	    /////////////////////////////////////////////////////////
	    /////////////////// Helper Function /////////////////////
	    /////////////////////////////////////////////////////////

	    //Taken from http://bl.ocks.org/mbostock/7555321
	    //Wraps SVG text	
	    function wrap(text, width) {
	        text.each(function() {
	            var text = d3.select(this),
	                words = text.text().split(/\s+/).reverse(),
	                word,
	                line = [],
	                lineNumber = 0,
	                lineHeight = 1.4, // ems
	                y = text.attr("y"),
	                x = text.attr("x"),
	                dy = parseFloat(text.attr("dy")),
	                tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

	            while (word = words.pop()) {
	                line.push(word);
	                tspan.text(line.join(" "));
	                if (tspan.node().getComputedTextLength() > width) {
	                    line.pop();
	                    tspan.text(line.join(" "));
	                    line = [word];
	                    tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
	                }
	            }
	        });
	    } //wrap	

	} //RadarChart