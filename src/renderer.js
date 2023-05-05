//select the HTML elements
const fileDialog = document.getElementById("fileInput");
const panelNames = document.getElementById("panelNames");
const panelQuery = document.getElementById("panelQuery");
const queryText = document.getElementById("queryText");
const fileNameLabel = document.getElementById("fileName");

//store the panel/query data for use later on
var rowList = [];
var panelList = [];
var queryList = [];

/*
Change event for the file dialog browser
1. Parse the file and populate panels/query into the properties
2. Update Panel Dropdown
*/
fileDialog.addEventListener('change', () => {

 const fileName = fileDialog.files[0].path;
 fileNameLabel.innerHTML = fileName;

 console.log("Parsing data...");
  // Load the Grafana JSON file
  fetch(fileName)
    .then(response => response.json())
    .then(data => {
      console.log("Data loaded successfully");
      
      const json = JSON.stringify(data.panels[2]);      
      console.log(`data : ${json}`);
      
      // Use a filter function to find the non-row panels
      const non_row_panels = data.panels.filter(panel => panel.type !== 'alertlist');
      var counterRow = 1;

      non_row_panels.forEach(row => {

        if(row.type == "row"){
          var row_name = row.title;
          console.log(`Row name: ${row_name}`);
          rowList.push({ value: counterRow, text: row_name });

          row["panels"].forEach(panel => {
            var counterPanel = 1;
            var panel_name = panel.title;
            console.log(`Panel name: ${panel_name}`);
            panelList.push({ value: counterPanel, text: panel_name });
            
            panel["targets"].forEach(query =>{
              query_name = query["refId"];
              query_text = query["expr"];
              queryList.push({value: query_name, row: row_name, panel: counterPanel, text: query_text });
            });
            counterPanel++;
          });
        }
        else{
          const panel_name = row.title;
          console.log(`Panel name: ${panel_name}`);
          panelList.push({ value: counterPanel, text: panel_name });

          row["targets"].forEach(query =>{
            query_name = query["refId"];
            query_text = query["expr"];
            queryList.push({value: query_name, panel: counterPanel, text: query_text });
          });
        }
        counterRow++;
                            
      });

      // Update the listbox and query field
      panelList.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.text = option.text;
        panelNames.options.add(optionElement);
      });
      
    });
})

/*
Change event for the Panel Dropdown
1. Based on the selected panel, find all the queries/alerts
2. populate the query listbox and alert data
*/
panelNames.addEventListener('change', event => {
  // Handle the change event
  const selectedOption = event.target.value;
  console.log(`Selected option: ${selectedOption}`);

  var selectedPanelValues = queryList.filter(obj => obj.panel == selectedOption);

  // Update the listbox and query field
  selectedPanelValues.forEach(option => {
    const optionElement = document.createElement('option');
    console.log(`Selected 1: ${option.value}`);
    console.log(`Selected 2: ${option.text}`);
    optionElement.value = option.value;
    optionElement.text = option.value;
    panelQuery.options.add(optionElement);
  });
});

/*
Change event for the Query Listbox
1. Based on the selected query, populate the text area
*/
panelQuery.addEventListener('change', event => {
  // Handle the change event
  const selectedOption = event.target.value;
  console.log(`Selected val: ${selectedOption}`);

  var selectedPanelValues = queryList.filter(obj => obj.value == selectedOption);
  console.log(`Selected q: ${selectedPanelValues}`);

  // Update the listbox and query field
  selectedPanelValues.forEach(option => {
    queryText.value = option.text;
  });
  
});