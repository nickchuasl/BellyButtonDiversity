function init() {
    // Grab a reference to the dropdown select element
    var dropdownMenu = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
        console.log(sampleNames);

      sampleNames.forEach(function(sample)  {
          console.log(sample);
      });
  
      sampleNames.forEach((sample) => {
        dropdownMenu
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Default display on screen before user even selects anything
      var firstID = sampleNames[0];
      createCharts(firstID);
      demographicTable(firstID);
    });
  }
  
  // Run the dashboard
  init();
  
  // Capture user selection and run function
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    createCharts(newSample);
    demographicTable(newSample);

  }

  // Display Demographics Panel
  
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


// Create the three charts

function createCharts (sample) {
//Obtain the data from samples.json file
d3.json("samples.json").then((data) => {
    
    // To access the samples data
    var samples = data.samples;
    console.log(samples)

    // Prep for using washing frequency data in metadata in the gauge chart
    var gaugeMetadata = data.metadata;
    console.log(gaugeMetadata);

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

    // Create the bubble chart
    var trace2 = {
        x: indIDs,
        y: BCvalues,
        text: BClabels,
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


//Match the selected sample from drop down menu with samples.json metadata set of values
    var gaugeMetadataSample = gaugeMetadata.filter(metaSample => metaSample.id == sample);
    console.log(gaugeMetadataSample);

    var gaugeMetadatawfreq = gaugeMetadataSample[0];
    console.log(gaugeMetadatawfreq);

    var washingFreq = gaugeMetadatawfreq.wfreq;

    // Create the gauge chart
    var data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washingFreq,
        title: { text: "<b> Belly Button Washing Frequency </b> <br></br> Scrubs Per Week" },
        type: "indicator",
        mode: "gauge+number",

        gauge: {
          axis: { range: [null, 10] },
          steps: [
            { range: [0, 2], color: "pink" },
            { range: [2, 4], color: "red" },
            { range: [4, 6], color: "orange" },
            { range: [6, 8], color: "lightgreen" },
            { range: [8, 10], color: "green" },
          ],
        }
      }
    ];

    var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
    Plotly.newPlot('gauge', data, layout);
});



};
