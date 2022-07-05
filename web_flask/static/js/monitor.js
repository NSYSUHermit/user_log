// heatmap
anychart.onDocumentReady(function () {
	var data_1 = [];
	dataSet1 = anychart.data.set(data_1);
	// map the data
	var mapping = dataSet1.mapAs({x: 0, value: 1});

	// create a chart
	var chart = anychart.funnel(mapping);

	// go through all points of the end to the beginning
	for (var i = chart.getStat("count") - 1;i > 0; i--){
		// get the point and the point before it
		currentPoint = chart.getPoint(i);
		previousPoint = chart.getPoint(i - 1);

		// calculate the difference of values
		diff = currentPoint.get("value") - previousPoint.get("value");

		// and put it into the data
		currentPoint.set("diff", diff);

		// color the columns depending on the difference
		if (diff > 0) {
			currentPoint.set("fill", "#31C45D");
			currentPoint.set("stroke", {color: anychart.color.darken("#31C45D", 0.05)});
		} else
		{
			currentPoint.set("fill", "#F39232");
			currentPoint.set("stroke", {color: anychart.color.darken("#F39232", 0.05)});
		}
	}

	// display the diff in tooltip
	// the diff wasn't in the original dataset, but we've added it
	var tooltip = chart.tooltip();
	tooltip.format("Change: {%diff}");

    chart.neckHeight(0);
	
    // set the container id
    chart.container("container_chart1");
    // initiate drawing the chart
    chart.draw();
});

anychart.onDocumentReady(function() {
	var data_2 = [];
	dataSet2 = anychart.data.set(data_2);
	// map the data
	var mapping = dataSet2.mapAs({x: 0, value: 1});

	// create a chart
	var chart = anychart.column();

	// create a series and set the data
	var series = chart.column(mapping);
			
    // set the container id
    chart.container("container_chart2");
    // initiate drawing the chart
    chart.draw();
});

//update table
function testBTN(){
	$('#testBTN').click(function() {
	var form_data = new FormData();
	form_data.append('page', $("#pageselect").val());
	$.ajax({
			type: "POST",
			url: $SCRIPT_ROOT + "/page_plot",
			data: form_data,
			success: (data) => {
				var funnel_data = JSON.parse(data.funnel_data)
				test_data = [
					["Projector", 2320],
					["Labeller", 944],
					["Verifier", 473],
					["Predictor", 221]
				];
				dataSet1.data(test_data)
				dataSet2.data(funnel_data)
				$("#this_page_count").text(data.page_count);
			},
			contentType: false,
			processData: false,
			dataType: "json"
		});
	});
} 