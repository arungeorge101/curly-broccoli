//select the HTML elements
const rowname = document.getElementById("rowname");
const fileDialog = document.getElementById("fileInput");
const panelNames = document.getElementById("panelNames");
const panelQuery = document.getElementById("panelQuery");
const queryText = document.getElementById("queryText");
const fileNameLabel = document.getElementById("fileName");
const alertTagText = document.getElementById("alertTagText");
const alertConditionText = document.getElementById("alertConditionText");
const alertMsgText = document.getElementById("alertMsgText");

//store the panel/query data for use later on
var rowList = [];
var panelList = [];
var queryList = [];
var alertList = [];

//selected values
var selectedRow;
var selectedPanel;
var selectedQuery;

/*
Change event for the file dialog browser
1. Parse the file and populate panels/query into the properties
2. Update Panel Dropdown
*/
fileDialog.addEventListener('change', () => {

  const fileName = fileDialog.files[0].path;
  fileNameLabel.innerHTML = fileName;

  console.log("Parsing data...");

  //clearing the lists
  rowList = [];
  panelList = [];
  queryList = [];

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

        if (row.type == "row") {
          var counterPanel = 1;
          var row_name = row.title;
          console.log(`Row name: ${row_name}`);
          console.log(`COunter row: ${counterRow}`);
          rowList.push({ value: counterRow, text: row_name });

          row["panels"].forEach(panel => {
            var counterQuery = 1;
            var counterAlert = 1;

            var panel_name = panel.title;
            console.log(`Panel name: ${panel_name}`);
            panelList.push({ value: counterPanel, row: counterRow, text: panel_name });

            panel["targets"].forEach(query => {
              query_name = query["refId"];
              query_text = query["expr"];
              queryList.push({ value: counterQuery, row: counterRow, panel: counterPanel, queryName: query_name, text: query_text });
              counterQuery++;
            });

            
            var alert = panel["alert"];
            var alertTag = "";
            var alertCond = "";
            var alertMsg = "";
            if(alert == undefined){
              alert = "No Alert Defined";
              alertTag = "No Alert Defined";
              alertCond = "No Alert Defined";
              alertMsg = "No Alert Defined";
            }
            else{
              alertTag = panel["alert"]["alertRuleTags"];
              alertTag = JSON.stringify(alertTag);
              console.log(`alert tag: ${alertTag}`);
              
              alertCond = panel["alert"]["conditions"];
              alertCond = JSON.stringify(alertCond);
              console.log(`alert condition: ${alertCond}`);

              alertMsg = panel["alert"]["message"];
              alertMsg = JSON.stringify(alertMsg);
              console.log(`alert message: ${alertMsg}`);
            }
            
            alertList.push({value: counterAlert, row: counterRow, panel: counterPanel, alertTag: alertTag, alertCond: alertCond, alertMsg: alertMsg});
            counterPanel++;
            counterAlert++;
          });
        }
        counterRow++;
      });

      rowname.options.length = 1;
      // Update the row and query field
      rowList.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.text = option.text;
        rowname.options.add(optionElement);
      });

    });
})

/*
Change event for the Rown Dropdown
1. Based on the selected panel, find all the panels
2. populate the panel listbox 
*/
rowname.addEventListener('change', event => {
  // Handle the change event
  selectedRow = event.target.value;
  console.log(`Selected Row: ${selectedRow}`);

  var selectedPanelValues = panelList.filter(obj => obj.row == selectedRow);

  panelNames.options.length = 1;
  // Update the listbox and query field
  selectedPanelValues.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option.value;
    optionElement.text = option.text;
    panelNames.options.add(optionElement);
  });
});

/*
Change event for the Panel Dropdown
1. Based on the selected panel, find all the queries/alerts
2. populate the query listbox and alert data
*/
panelNames.addEventListener('change', event => {
  // Handle the change event
  selectedPanel = event.target.value;
  console.log(`Selected Row: ${selectedRow}`);
  console.log(`Selected panel: ${selectedPanel}`);

  var selectedPanelValues = queryList.filter(obj => (obj.panel == selectedPanel && obj.row == selectedRow));

  panelQuery.options.length = 0;
  // Update the listbox and query field
  selectedPanelValues.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option.value;
    optionElement.text = option.queryName;
    panelQuery.options.add(optionElement);
  });

  selectedPanelValues = alertList.filter(obj => (obj.panel == selectedPanel && obj.row == selectedRow));
  // Update the listbox and query field
  selectedPanelValues.forEach(option => {
    alertTagText.value = option.alertTag;
    alertConditionText.value = option.alertCond;
    alertMsgText.value = option.alertMsg;
  });
});

/*
Change event for the Query Listbox
1. Based on the selected query, populate the text area
*/
panelQuery.addEventListener('change', event => {
  // Handle the change event
  selectedQuery = event.target.value;
  console.log(`Selected query: ${selectedQuery}`);

  var selectedPanelValues = queryList.filter(obj => (obj.panel == selectedPanel && obj.row == selectedRow && obj.value == selectedQuery));

  // Update the listbox and query field
  selectedPanelValues.forEach(option => {
    queryText.value = option.text;
  });

});