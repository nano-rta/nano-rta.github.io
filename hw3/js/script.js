let searchBtn = document.querySelector("#searchBtn");
searchBtn.addEventListener("click", searchQuakes);

function isFormValid() {
  let startDate = document.querySelector("#startDate").value;
  let endDate = document.querySelector("#endDate").value;
  let minMag = document.querySelector("#minMag").value;
  let validationFdbk = document.querySelector("#validationFdbk");
  validationFdbk.innerHTML = "";
  if (startDate == "") {
    validationFdbk.innerHTML = "Pick a start date.";
    return false;
  }
  if (endDate == "") {
    validationFdbk.innerHTML = "Pick an end date.";
    return false;
  }
  if (startDate > endDate) {
    validationFdbk.innerHTML = "The start date must be before the end date.";
    return false;
  }
  if (minMag == "") {
    validationFdbk.innerHTML = "Type a smallest magnitude.";
    return false;
  }
  if (minMag < 0 || minMag > 10) {
    validationFdbk.innerHTML = "The smallest magnitude must be from 0 to 10.";
    return false;
  }
  return true;
}

function searchQuakes() {
  if (!isFormValid()) {
    return;
  }
  let startDate = document.querySelector("#startDate").value;
  let endDate = document.querySelector("#endDate").value;
  let minMag = document.querySelector("#minMag").value;
  let url = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=" + startDate + "&endtime=" + endDate + "&minmagnitude=" + minMag + "&limit=50";
  fetchData(url);
}

async function fetchData(url) {
  try {
    let response = await fetch(url);
    let data = await response.json();
    displayQuakes(data);
  } catch (error) {
    document.querySelector("#results").innerHTML = "Something went wrong. Try again.";
  }
}

function displayQuakes(data) {
  let results = document.querySelector("#results");
  let quakes = data.features;
  if (quakes.length == 0) {
    results.innerHTML = "No earthquakes found. Try other dates.";
    return;
  }
  let html = "<h2>Found " + quakes.length + " earthquakes</h2>";
  if (quakes.length == 50) {
    html = "<h2>Found 50 earthquakes (showing the first 50)</h2>";
  }
  for (let i = 0; i < quakes.length; i++) {
    let place = quakes[i].properties.place;
    let mag = quakes[i].properties.mag;
    let time = new Date(quakes[i].properties.time).toLocaleString();
    html += "<div class='quake'><h3>" + place + "</h3><p>Magnitude: " + mag + "</p><p>Time: " + time + "</p></div>";
  }
  results.innerHTML = html;
}
