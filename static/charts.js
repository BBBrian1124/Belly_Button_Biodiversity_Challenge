function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// DELIVERABLE 1 BAR CHART
// 1. Create the buildCharts function.
function buildCharts(sample) {
  // sample is the test subject's ID # which we can view in the console 
  console.log(sample)

  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleArray = data.samples
    // this loads in the samples array from the samples.json file which we can view in the console 
    console.log(sampleArray)
  
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleArrayFiltered = sampleArray.filter(sampleObj => sampleObj.id == sample);
    // this creates an array with just our filtered/specified test subject but it only has one index which we can view in the console
    console.log(sampleArrayFiltered)
  
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = sampleArrayFiltered[0]
    // we will call the first index since the array only has one index as we can see in the console
    console.log(firstSample)

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    // we can see that the firstSample has these objects within it so we can use dot notatation to extract it
    var otu_ids = firstSample.otu_ids
    var otu_labels = firstSample.otu_labels
    var sample_values = firstSample.sample_values
    // we now see that each of these objects are within their own array 
    //console.log(otu_ids, otu_labels, sample_values)

    // 7. Create the yticks for the bar chart.
    // we can start to create the values for the bar chart 
    // since we want the top 10 values, we will use .slice to obtain index 0-9 inclusive 
    // using .reverse() ensures the sorting is from highest to low for the chart
    // we can use .map to add the "OTU" in front of the ID
    var top10_id  = otu_ids.slice(0,10).reverse()
    var top10_id_chart = top10_id.map(x => "OTU" + x)
    var top10_values = sample_values.slice(0,10).reverse()
    // we can see that they corrspond to the top 10 so we will pass them to the chart below
    console.log(top10_id, top10_values)

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: top10_values,
      y: top10_id_chart,
      type: 'bar',
      orientation: 'h'
    }];
  // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);


    // DELIVERABLE 2 BUBBLE CHART 
    // Use Plotly to plot the data with the layout. 
    // https://plotly.com/javascript/bubble-charts/#hover-text-on-bubble-charts
    // Create the trace for the bubble chart.
    var bubbleData = [{
       // pass the x and y values, along with text to display when hovering over the bubbles
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      // set the chart to show markers, and the colour to be the id value and size to be sample_value
      mode: "markers",
      marker: {
        color: otu_ids,
        size: sample_values
      }
    }];

    // Create the layout for the bubble chart.
    // https://plotly.com/python-api-reference/generated/plotly.graph_objects.Layout.html
    // set margins to fit the chart data and the hovermode which allows text to be displayed when hovering 
    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      margin: { t: 25 },
      xaxis: { title: "OTU Id's" },
      hovermode: "closest",
      type: 'bubble'
      };

    // D2: 3. Use Plotly to plot the data with the layout.
    Plotly.plot("bubble", bubbleData, bubbleLayout);

    // DELIVERABLE 3 GAUGE CHART 
    //https://plotly.com/javascript/gauge-charts/
    // 4. Create the trace for the gauge chart.
    
    // first we need to obtain the frequency (wfreq) to pass to our chart
    // it is stored in an array so we will get the array it is stored in corresponding with the sample chosen
    var wfreqArray = data.metadata.filter(sampleObj => sampleObj.id == sample)
    // we can check and see that it is stored in another array which only has 0th index
    console.log(wfreqArray)
    // we will extract the wfreq object from the 0th index of the array to be able to pass to the chart
    var wfreq = wfreqArray[0].wfreq
    console.log(wfreq)

    // create the chart data
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wfreq,
        title: {text: `Belly Button Washing Frequency`},
        type: "indicator",
        // set the mode, and range of the gauge, along with the bar colour and colour of each inverval
        mode: "gauge+number",
        gauge: { axis: { range: [null, 10] },  
        bar: {color: "black"},
                 steps: [
                  {range: [0, 2], color: "red"},
                  {range: [2, 4], color: "orange"},
                  {range: [4, 6], color: "yellow"},
                  {range: [6, 8], color: "darkgreen"},
                  {range: [8, 10], color: "green"},
                ]}            
        }
      ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 700, 
      height: 600, 
      margin: { t: 20, b: 40, l:100, r:100 } 
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
});
}
