//Convert portal URLs to Route URL
function mapURL() {
    var portalURL = document.getElementById("portals").value;
    var portalURLs = portalURL.split(/\n/);
    var reg = /(?:http(?:s{0,1}):\/\/www.ingress.com\/intel\?ll=)(?:-{0,1})?\d{1,3}(?:.)\d{1,6}(?:,)(?:-{0,1})\d{0,3}(?:(?:.)\d{1,6}){0,1}(?:&z=)\d{1,2}(?:&pll=)((?:-{0,1})?\d{1,3}(?:.{0,1})\d{1,6})(?:,)((?:-{0,1})\d{1,3}(?:.)\d{1,6})$/;
    var mapURL = "http://maps.google.com/maps/dir/";
    for (var i = 0; i < portalURLs.length; i++) {
        //Only process lines with data
        if (!(portalURLs[i] == '')) {

            //Check url valid
            if (!(reg.test(portalURLs[i]))) {

                //Report invalid input to user
                errorMsg();
                throw new Error("invalid");
            }

            reg.exec(portalURLs[i]);
            mapURL = mapURL + RegExp.$1 + "," + RegExp.$2 + "/";

            //Report valid input to user
            successMsg();
            document.getElementById("map").value = mapURL;
        }
    }
    
    //Revert to invalid if input blank
    if (portalURL === '') {
        errorMsg();
    }
}

//Report invalid input to user
function errorMsg() {
    document.getElementById("portalValid").className = "glyphicon glyphicon-remove";
    document.getElementById("validDiv").className = "form-group has-error";
    document.getElementById("mapBtn").className = "btn btn-default";
    document.getElementById("mapBtn").disabled = "disabled";
    document.getElementById("map").value = "";
}

//Report valid input to user
function successMsg() {
    document.getElementById("portalValid").className = "glyphicon glyphicon-ok";
    document.getElementById("validDiv").className = "form-group has-success";
    document.getElementById("mapBtn").className = "btn btn-success";
    document.getElementById("mapBtn").disabled = "";
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