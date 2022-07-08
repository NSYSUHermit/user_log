// PREV CHART
anychart.onDocumentReady(function() {
	var data_prev = [];
	dataSet_prev = anychart.data.set(data_prev);
	var mapping = dataSet_prev.mapAs({x: 0, value: 1});
	var chart = anychart.column();
	var series = chart.column(mapping);
    chart.container("container_chart_prev");
    chart.draw();
});

// NEXT CHART
anychart.onDocumentReady(function() {
	var data_next = [];
	dataSet_next = anychart.data.set(data_next);
	var mapping = dataSet_next.mapAs({x: 0, value: 1});
	var chart = anychart.column();
	var series = chart.column(mapping);
    chart.container("container_chart_next");
    chart.draw();
});

// Funnel chart
anychart.onDocumentReady(function () {
	var data_funnel = [];
	dataSet_funnel = anychart.data.set(data_funnel);
	var mapping = dataSet_funnel.mapAs({x: 0, value: 1});
	var chart = anychart.funnel(mapping);
    chart.container("container_chart_funnel");
    chart.draw();
});

// Components Tree chart
anychart.onDocumentReady(function () {
	var data_component = [];
	dataSet_component = anychart.data.set(data_component);
	var mapping = dataSet_component.mapAs({x: 0, value: 1});
	var chart = anychart.pie(mapping);
	chart.container("container_pie_components");
	chart.draw();
});

//update table
function chart_btn(){
	$('#chart_btn').click(function() {
	var form_data = new FormData();
	form_data.append('page', $("#pageselect").val());
	$.ajax({
			type: "POST",
			url: $SCRIPT_ROOT + "/page_plot",
			data: form_data,
			success: (data) => {
				var next_data = JSON.parse(data.next_data)
				var prev_data = JSON.parse(data.prev_data)
				var components_data = JSON.parse(data.components_data)

				test_data = [
					["Projector", 2320],
					["Labeller", 944],
					["Verifier", 473],
					["Predictor", 221]
				];

				dataSet_funnel.data(test_data)
				dataSet_component.data(components_data)
				dataSet_prev.data(prev_data)
				dataSet_next.data(next_data)
				$("#this_page_count").text(data.page_count);
			},
			contentType: false,
			processData: false,
			dataType: "json"
		});
	});
} 