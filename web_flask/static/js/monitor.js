anychart.onDocumentReady(function () {
	var data_1 = [];
	dataSet1 = anychart.data.set(data_1);
	// map the data
	var mapping = dataSet1.mapAs({x: 0, value: 1});
	// create a chart
	var chart = anychart.funnel(mapping);

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

anychart.onDocumentReady(function() {
	var data_3 = [];
	
	dataSet3 = anychart.data.set(data_3);
	// map the data
	var mapping = dataSet3.mapAs({x: 0, value: 1});

	// create a chart
	var chart = anychart.column();

	// create a series and set the data
	var series = chart.column(mapping);
	
    // set the container id
    chart.container("container_chart3");

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
				var next_data = JSON.parse(data.next_data)
				next_data["fill"] = "#FF0000"
				var prev_data = JSON.parse(data.prev_data)
				test_data = [
					["Projector", 2320],
					["Labeller", 944],
					["Verifier", 473],
					["Predictor", 221]
				];
				dataSet1.data(test_data)
				dataSet2.data(next_data)
				dataSet3.data(prev_data)
				$("#this_page_count").text(data.page_count);
			},
			contentType: false,
			processData: false,
			dataType: "json"
		});
	});
} 