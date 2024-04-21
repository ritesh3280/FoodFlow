var map;
var directionsService;
var directionsRenderer;
var pendingDeliveries = [
  { pickup: "4136 Stadium Dr, College Park, MD 20740", dropoff: "3854 Stadium Dr, College Park, MD 20742" }
];

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {lat: 38.9869, lng: -76.9426}
  });
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  // Display pending deliveries when the page loads
  displayPendingDeliveries();
}

function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

function displayPendingDeliveries() {
  var pendingList = document.getElementById("pendingList");
  pendingList.innerHTML = ""; // Clear existing list
  
  pendingDeliveries.forEach(function(delivery, index) {
    var li = document.createElement("li");
    li.textContent = "Pickup: " + delivery.pickup + ", Dropoff: " + delivery.dropoff;
    var startBtn = document.createElement("button");
    startBtn.textContent = "Start";
    startBtn.addEventListener("click", function() {
      startDelivery(index);
    });
    li.appendChild(startBtn);
    pendingList.appendChild(li);
  });
}

function startDelivery(index) {
  var pickup = pendingDeliveries[index].pickup;
  var dropoff = pendingDeliveries[index].dropoff;

  // Calculate and display route from pickup to drop-off
  calculateAndDisplayRoute(pickup, dropoff); 

  // Show button to open directions in Google Maps
  var navigationButton = document.createElement("button");
  navigationButton.textContent = "Start Navigation";
  navigationButton.addEventListener("click", function() {
    openGoogleMapsDirections(pickup);
  });
  document.body.appendChild(navigationButton);
}

function calculateAndDisplayRoute(origin, destination) {
  var request = {
    origin: origin,
    destination: destination,
    travelMode: google.maps.TravelMode.DRIVING
  };

  directionsService.route(request, function(result, status) {
    if (status == 'OK') {
      directionsRenderer.setDirections(result);
    } else {
      console.error('Directions request failed with status:', status);
      console.error('Request details:', request);
      alert('Directions request failed due to ' + status);
    }
  });
}

function openGoogleMapsDirections(destination) {
  var url = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(destination);
  window.open(url, "_blank");
  
}
