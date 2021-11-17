function createCharts(nameId) {

    // Retrieve the data from the json file
    d3.json("samples.json").then((data) => {
      
      // Filter and convert to string
      var samplesData = data.samples.filter(d => d.id.toString() === nameId)[0]
      console.log(samplesData)
  
      // Save data for bar graph and bubble chart to variables
      var otuIds = samplesData.otu_ids;
      var otuLabels = samplesData.otu_labels;
      var sampleValues = samplesData.sample_values;
  
      // console.log(otuIds)
      // console.log(otuLabels)
      // console.log(sampleValues)
  
      // Bar graph only needs top 10 data and reverse order to plot largest value at top
      var otuIdsBar = otuIds.slice(0,10).reverse();
      var otuLabelsBar = otuLabels.slice(0,10);
      var sampleValuesBar = sampleValues.slice(0,10).reverse();
      // Create a new array with text OTU added before ID number
      var otuIdsBar = otuIdsBar.map(d => "OTU " + d);
  
      // console.log(otuIdsBar)
      // console.log(otuLabelsBar)
      // console.log(sampleValuesBar)
  
      // Create bar chart trace
      var trace1 = {
        type: 'bar',
        text: 'otuLabelsBar',
        x: sampleValuesBar,
        y: otuIdsBar,
        orientation: 'h'
      };
  
      // Create the data array for the bar plot
      var data1 = [trace1]
      
      // Plot the bar chart
      Plotly.newPlot('bar', data1);
  
      // Create the bubble chart trace
      var trace2 = {
        x: otuIds,
        y: sampleValues,
        text: 'otuLabelsBar',
        mode: 'markers',
        marker: {
          color: otuIds,
          // opacity: [1, 0.8, 0.6, 0.4],
          size: sampleValues
        }
      };
      
      // Create the data array for the bubble chart
      var data2 = [trace2];
      
      var layout = {
        xaxis: {title: 'OTU ID'},
        showlegend: false,
        height: 500,
        width: 1200
      };
      // Plot the bubble chart
      Plotly.newPlot('bubble', data2, layout);
  
  
    });
  }
  
  // Create a function to retrieve the demographic information
  function createDemoInfo(nameId) {
  
    // Retrieve the data from the json file
    d3.json("samples.json").then((data)=> {
        
        // Create a variable to hold the metadata
        var metadata = data.metadata;
        // console.log(metadata)
  
        // Create a variable to hold the metadata filtered by nameId
        var metadataId = metadata.filter(d => d.id.toString() === nameId)[0];
  
        // Create a variable for metadata and select by div nameId in html
        var demoInfo = d3.select("#sample-metadata");
        
        // Clear existing metadata prior to retrieving new metadata
        demoInfo.html("");
  
        // Append the new metadata 
        Object.entries(metadataId).forEach((key) => {   
                demoInfo.append("h6").text(key[0] + ": " + key[1] + "\n");    
        });
    });
  }
  
  // Function called by DOM changes
  function optionChanged(nameId) {
    // Create new plots and retrieve new demogrphic information when a new name ID is selected
    createCharts(nameId);
    createDemoInfo(nameId);
  }
  
  // Create the initiate function
  function init() {
    // Create a variable for drop down menu by selecting by element ID
    var dropDown = d3.select("#selDataset");
  
    // Use the list of name ID's to populate the selection options
    d3.json("samples.json").then((data) => {
      data.names.forEach(function(name) {
        dropDown
          .append("option")
          .text(name)
          .property("value");
      });
  
      // Use the first name ID from the list to create the initial plots and demographic info
      var firstNameId = data.names[0];
      // console.log(firstNameId)
      createCharts(firstNameId);
      createDemoInfo(firstNameId);
    });
  }
  // Initialize the interactive dashboard
  init();
  
  
  
  
  
  