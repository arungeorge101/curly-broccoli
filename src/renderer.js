const fileDialog = document.getElementById("fileInput");
const panelNames = document.getElementById("panelNames");

const panelList = [];
const queryList = [];

fileDialog.addEventListener('change', () => {

 const fileName = fileDialog.files[0].path;
 console.log("Parsing data...");
  // Load the Grafana JSON file
  fetch(fileName)
    .then(response => response.json())
    .then(data => {
      console.log("Data loaded successfully");
      // Use a filter function to find the non-row panels
      const non_row_panels = data.panels.filter(panel => panel.type !== 'row' && panel.type !== 'alertlist');
      var counterPanel = 1;

      non_row_panels.forEach(panel => {
        const panel_name = panel.title;
        console.debug(`Panel name: ${panel_name}`);
        panelList.push({ value: counter, text: panel_name });
        counterPanel++;
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

panelNames.addEventListener('change', event => {
  // Handle the change event
  const selectedOption = event.target.value;
  console.log(`Selected option: ${selectedOption}`);
});