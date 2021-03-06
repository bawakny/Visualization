function ColorBar(id, counter) {


    var pathColor = d3.scale.linear()
        .domain([0, counter])
        // .interpolate(d3.interpolateRgb)
        .interpolate(d3.interpolateHsl)
        //.interpolate(d3.interpolateHcl)
        .range(['green', 'red']);

d3.select(id).selectAll("svg").remove();

    for (i = 0; i < counter; i++) {
		if (i == parseInt(counter/2)){
			
			
		var svg = d3.select(id).append("svg")
            .attr("class", 'colors')
			.attr("id", 'color'+i)
            .style("width", 100 / counter + '%')
            .style("height", '100%')
            .style("margin", '0px')
            .style("padding", '0px')
            .style('background', "black");	
			
		}
     else{
		
var svg = d3.select(id).append("svg")
            .attr("class", 'colors')
			.attr("id", 'color'+i)
            .style("width", 100 / counter + '%')
            .style("height", '100%')
            .style("margin", '0px')
            .style("padding", '0px')
            .style('background', function() {
                return pathColor(i);
            });		
		 
	 }   



    }



};