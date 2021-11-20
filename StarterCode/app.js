function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
        console.log(sampleNames);

      sampleNames.forEach(function(sample)  {
          console.log(sample);
      });
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
    //   var firstSample = sampleNames[0];
    //   buildCharts(firstSample);
    //   buildMetadata(firstSample);
    });
  }
  
  // Initialize the dashboard
  init();
  

  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    barChart(newSample);
    demographicTable(newSample);

  }

  //Demographics Panel
  
  function demographicTable(sample) {
  //Obtain the data from samples.json file
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        console.log(metadata)
    //Match the selected sample from drop down menu with samples.json metadata set of values
        var metadataSample = metadata.filter(metaSample => metaSample.id == sample);
        console.log(metadataSample);

        var metadataID = metadataSample[0];
        console.log(metadataID);
        // Select the demographic info results div tag id

        var panelBody = d3.select("#sample-metadata");

        //Clear the results each time a new id is selected
        panelBody.html("");

        // Display the key and values of selected ID and other details

        Object.entries(metadataID).forEach(([key, value]) => {
            panelBody.append("h5").text(`${key}: ${value}`);
        });

  });

}; 


// Code for creating the bar chart

function barChart (sample) {
//Obtain the data from samples.json file
d3.json("samples.json").then((data) => {
    var samples = data.samples;
    console.log(samples)

    //Match the selected sample from drop down menu with samples.json metadata set of values
    var metadataSample = samples.filter(sampleData => sampleData.id == sample);
    console.log(metadataSample);

    var metadataID = metadataSample[0];
    console.log(metadataID);

    // Create variables for the three labels in the samples dataset - otu_ids, otu_labels and sample_values
    var indIDs = metadataID.id;
    var otuIDs = metadataID.otu_ids;
    var otuValues = metadataID.sample_values.slice(0,10).reverse();
    var otuLabels = metadataID.otu_labels.slice(0,10).reverse();
    var BCvalues = metadataID.sample_values
    var BClabels = metadataID.otu_labels

    // Set the y axis values
    var yaxis = otuIDs.map(otuSample => "OTU " + otuSample).slice(0,10).reverse();
    console.log(yaxis);

    // Create the trace for the bar chart
    var trace1 = {
        x: otuValues,
        y: yaxis,
        type: "bar",
        orientation: "h",
        text: otuLabels
    };

    var data = [trace1];

    var layout = {
        title: `Top Ten Belly Button Bacteria found in ${indIDs}`
    };

    // Plot the bar chart
    Plotly.newPlot("bar",data,layout);

    var trace2 = {
        x: indIDs,
        y: BCvalues,
        mode: "markers",
        marker: {
            size: BCvalues,
            color: otuIDs,
            colorscale: "earth"
        }
    };

    var data2 = [trace2];

    var BClayout = {
        title: `Belly Button Bacteria found in ${indIDs}`,
        xaxis: {title:"OTU ID"},
        automargin: true,
        hovermode: "closest"
    };

    Plotly.newPlot("bubble", data2, BClayout)
});
};

