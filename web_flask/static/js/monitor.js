// heatmap
anychart.onDocumentReady(function () {
    // create data
    var data = [
      {x: " ", y: " ", heat: "Wait a sec...", custom_field: "Wait a sec..."},
    ];
	dataSet1 = anychart.data.set(data);
	// create a chart and set the data
	var mapping = dataSet1.mapAs();
	var chart = anychart.heatMap(mapping);
    
    // enable HTML for labels
    chart.labels().useHtml(true);
    // configure labels
    chart.labels().format(function() {
      var heat = (this.heat);
      return heat ;
    });

    // create and configure a color scale.
    var customColorScale = anychart.scales.ordinalColor();
    customColorScale.ranges([
      {less: 9},
      {from: 10, to: 20},
      {greater: 21}
    ]);
    customColorScale.colors(["lightgray", "#00ccff", "#ffcc00"]);

    // set the color scale as the color scale of the chart
    chart.colorScale(customColorScale);

    // enable legend
    chart.legend(true);	
	
    // configure tooltips
    chart.tooltip().format(function() {
      var heat = (this.heat);
      if (heat < 1)
        return this.y + ": Low (" + heat + " times)\n\n" +
                        this.getData("custom_field");
      if (heat < 20)
        return this.y + ": Medium (" + heat + " times)\n\n" +
                        this.getData("custom_field");
      if (heat == 9999)
        return this.y + ":" +
                        this.getData("custom_field");
      if (heat >= 20)
        return this.y + ": High (" + heat + " times)\n\n" +
                        this.getData("custom_field");
    });
    // set the chart title
    chart.title("Heat Map");
    // set the container id
    chart.container("container_chart1");
    // initiate drawing the chart
    chart.draw();
});

anychart.onDocumentReady(function() {
	// create data for the first series
	var data_2 = [
	];
	
	dataSet2 = anychart.data.set(data_2);
	// create a chart and set the data
	var mapping = dataSet2.mapAs();
	var chart = anychart.marker();
	// set data for each series
	series = chart.marker(mapping);
	// set the size of markers
	series.normal().size(10);
	series.hovered().size(15);
	series.selected().size(15);
	
	chart.yScale().minimum(0);
	chart.yScale().maximum(1);
	chart.xScale().minimum(0);
	chart.xScale().maximum(1);
	
	chart.yAxis().enabled(false);
	chart.xAxis().enabled(false);

	// set series labels text template
	var seriesLabels = chart.getSeries(0).labels().enabled(true);
	seriesLabels.fontSize(18);
	seriesLabels.fontFamily("Menlo");
	seriesLabels.fontColor("#915957")
	seriesLabels.format("{%id}");
	// background
	chart.background().fill({
		src: "https://i.ibb.co/rfNCLnt/instore.jpg",
		mode: "fit"
	});
	// configure tooltips
    chart.tooltip().format(function() {
		return this.getData("id") +" "+ this.getData("bhv") +" "+ this.getData("pdt");
    });
	chart.yAxis().orientation("bottom");
	chart.xAxis().orientation("right");
	chart.yScale().inverted(true);

	// set the chart title
    chart.title("Customer Location");
	// set the container id
	chart.container("container_chart2");
	// initiate drawing the chart
	chart.draw();
});

//update table
function testBTN(){
	$('#testBTN').click(function() {
	var form_data = new FormData();
	form_data.append('time', $("#timeinterval").val());
	$.ajax({
			type: "POST",
			url: $SCRIPT_ROOT + "/monitor_plot",
			data: form_data,
			success: (data) => {
				var df_list = data.df_list
				var map_df = JSON.parse(data.map_df)
				var location_df = JSON.parse(data.location_df)
				dataSet1.data(map_df)
				dataSet2.data(location_df)
				$("#row td").animate({'line-height':0},500).hide(1);
				// document.getElementById("df_table1").innerHTML = df
				var index = 0;
				var id_list = JSON.parse(data.id_list);
				var bhv_list = JSON.parse(data.bhv_list);
				var pdt_list = JSON.parse(data.pdt_list);
				var time_list = JSON.parse(data.time_list);
				var name_list = JSON.parse(data.name_list);
				var score_list = JSON.parse(data.score_list);
				var htm = '';
				var htm1 = '';
				for(index = 0; index < id_list.length; index++) {
				    htm +='<tr class="table-warning" style="color:white;" id="row">';
						htm+='<td>'+id_list[index]+'</td>';
						htm+='<td>'+bhv_list[index]+'</td>';
						htm+='<td>'+pdt_list[index]+'</td>';
						var date = new Date(time_list[index]);
						Y = date.getUTCFullYear() + '-';
						M = (date.getUTCMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
						D = date.getDate() + ' ';
						h = date.getUTCHours() + ':';
						m = date.getUTCMinutes() + ':';
						s = date.getUTCSeconds(); 
						htm+='<td>'+Y+M+D+h+m+s+'</td>';
				    htm+='</tr>';
				}
				$("table#store_table").find("tr:gt(1)").remove();
				$("table#store_table tbody").append(htm);
				
				for(index = 0; index < name_list.length; index++) {
				    htm1 +='<tr class="table-warning" style="color:white;" id="row">';
						htm1+='<td>'+[index]+'</td>';
						htm1+='<td>'+name_list[index]+'</td>';
						htm1+='<td>'+score_list[index]+'</td>';
				    htm1+='</tr>';
				}
				$("table#product_table").find("tr:gt(1)").remove();
				$("table#product_table tbody").append(htm1);
			},
			contentType: false,
			processData: false,
			dataType: "json"
		});
	setInterval(function(){
		var form_data = new FormData();
		form_data.append('time', $("#timeinterval").val());
		$.ajax({
				type: "POST",
				url: $SCRIPT_ROOT + "/monitor_plot",
				data: form_data,
				success: (data) => {
					var df_list = data.df_list
					var map_df = JSON.parse(data.map_df)
					var location_df = JSON.parse(data.location_df)
					dataSet1.data(map_df)
					dataSet2.data(location_df)
					$("#row td").animate({'line-height':0},500).hide(1);	
					
					var index = 0;
					var id_list = JSON.parse(data.id_list);
					var bhv_list = JSON.parse(data.bhv_list);
					var pdt_list = JSON.parse(data.pdt_list);
					var time_list = JSON.parse(data.time_list);
					var name_list = JSON.parse(data.name_list);
					var score_list = JSON.parse(data.score_list);
					var htm = '';
					var htm1 = '';
					for(index = 0; index < id_list.length; index++) {
						htm +='<tr class="table-warning" style="color:white;" id="row">';
							htm+='<td>'+id_list[index]+'</td>';
							htm+='<td>'+bhv_list[index]+'</td>';
							htm+='<td>'+pdt_list[index]+'</td>';
							var date = new Date(time_list[index]);
							Y = date.getUTCFullYear() + '-';
							M = (date.getUTCMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
							D = date.getDate() + ' ';
							h = date.getUTCHours() + ':';
							m = date.getUTCMinutes() + ':';
							s = date.getUTCSeconds(); 
							htm+='<td>'+Y+M+D+h+m+s+'</td>';
						htm+='</tr>';
					}
					$("table#store_table").find("tr:gt(1)").remove();
					$("table#store_table tbody").append(htm);
					
					for(index = 0; index < name_list.length; index++) {
						htm1 +='<tr class="table-warning" style="color:white;" id="row">';
							htm1+='<td>'+[index]+'</td>';
							htm1+='<td>'+name_list[index]+'</td>';
							htm1+='<td>'+score_list[index]+'</td>';
						htm1+='</tr>';
					}
					$("table#product_table").find("tr:gt(1)").remove();
					$("table#product_table tbody").append(htm1);
				},
				contentType: false,
				processData: false,
				dataType: "json"
			});
	 	}, 5000);
	});
} 