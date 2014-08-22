//Extract Coordinates from user input
function coordFind() {
    var portalURL = document.getElementById("portals").value;
    var portalURLs = portalURL.split(/\n/);
    var reg = /(?:http(?:s{0,1}):\/\/www.ingress.com\/intel\?ll=)(?:-{0,1})?\d{1,3}(?:.)\d{1,6}(?:,)(?:-{0,1})\d{0,3}(?:(?:.)\d{1,6}){0,1}(?:&z=)\d{1,2}(?:&pll=)((?:-{0,1})?\d{1,3}(?:.{0,1})\d{1,6})(?:,)((?:-{0,1})\d{1,3}(?:.)\d{1,6})$/;
    waypts = [];
    for (var i = 0; i < portalURLs.length; i++) {
        //Only process lines with data
        if (!(portalURLs[i] == '')) {

            //Check url valid
            if (!(reg.test(portalURLs[i]))) {

                //Report invalid input to user
                errorMsg();
                errorMap();
                throw new Error("invalid");
            }

            reg.exec(portalURLs[i]);

            //Add to waypoint array
            var coords = new google.maps.LatLng(RegExp.$1, RegExp.$2);
            waypts.push({
                location: coords,
                stopover: true
            });

            //Center map on new portal
            map.setCenter(coords);
            map.setZoom(15);

            //Report valid input to user
            successMsg();
        }
    }
    
    //Revert to invalid if input blank
    if (portalURL === '') {
        errorMsg();
        errorMap();
    }
}

//Report invalid input to user
function errorMsg() {
    document.getElementById("portalValid").className = "glyphicon glyphicon-remove";
    document.getElementById("validDiv").className = "form-group has-error";
    document.getElementById("mapBtn").className = "btn btn-default btn-block";
    document.getElementById("mapBtn").disabled = "disabled";
    document.getElementById("map").value = "";
}

//Report valid input to user
function successMsg() {
    document.getElementById("portalValid").className = "glyphicon glyphicon-ok";
    document.getElementById("validDiv").className = "form-group has-success";
    document.getElementById("mapBtn").className = "btn btn-success btn-block";
    document.getElementById("mapBtn").disabled = "";
}

//Enable external map link
function successMap() {
    document.getElementById("mapLink").className = "btn btn-success";
    document.getElementById("mapLink").disabled = "";
}

//Disable external map link
function errorMap() {
    document.getElementById("mapLink").disabled = "disabled";
    document.getElementById("mapLink").className = "btn btn-default";
}

//Open route URL
function openMap() {
    var map = document.getElementById("map").value;
    if (map) {
        var win = window.open(map, '_blank');
        if(win){
            //Browser has allowed it to be opened
            win.focus();
        }else{
            //Broswer has blocked it
            alert('Please allow popups for this site.');
        }
    }
}

//Swap chevron when viewing instructions
function dropSwap() {
    var dropper = document.getElementById("manual-drop");
    if (dropper.className == "fa fa-chevron-down") {
        dropper.className = "fa fa-chevron-up";
    } else {
        dropper.className = "fa fa-chevron-down"
    }
}

//Map initialisation
var map; //Global map object
var waypts = []; //Global waypoints array
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

function initialize() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    var mapOptions = {
        zoom: 2,
        center: new google.maps.LatLng(0, 0)
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    directionsDisplay.setMap(map);
}

//Calculate Route
function calcRoute() {
    //Refresh waypoints
    coordFind();

    //Define start and end points
    var start = waypts[0].location;
    var end = waypts[waypts.length - 1].location;

    //Remove Start and End from waypoints array
    waypts.splice(0, 1);
    waypts.splice((waypts.length - 1), 1);

    //Assign auto-optimise boolean variable
    var optimal = document.getElementById("optimal").checked;
    //Develop route request to send to Google
    var request = {
        origin: start,
        destination: end,
        waypoints: waypts,
        optimizeWaypoints: optimal,
        travelMode: google.maps.TravelMode.DRIVING
    };

    //Attain route from Google and update map
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            var optOrder = response.routes[0].waypoint_order;

            //Generate map URL
            var mapURL = "http://maps.google.com/maps/dir/" + start.toUrlValue() + "/";

            if ((optimal) && (optOrder.length > 0)) {
                for (var i = 0; i < optOrder.length; i++) {
                    var waypt = waypts[optOrder[i]].location;
                    waypt = waypt.toUrlValue();
                    mapURL = mapURL + waypt + "/";
                }
                mapURL += end.toUrlValue() + "/";
                document.getElementById("map").value = mapURL;
                successMap();
            } else {
                for (var i = 0; i < waypts.length; i++) {
                    var waypt = waypts[i].location;
                    waypt = waypt.toUrlValue();
                    mapURL = mapURL + waypt + "/";
                }
                mapURL = mapURL + end.toUrlValue() + "/";
                document.getElementById("map").value = mapURL;
                successMap();
            }
        }
    });
}

//Load map
google.maps.event.addDomListener(window, 'load', initialize);
