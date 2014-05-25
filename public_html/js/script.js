function mapURL() {
    var portalURL = document.getElementById("portals").value;
    var portalURLs = portalURL.split(/\n/);
    var reg = /(?:http:\/\/www.ingress.com\/intel\?ll=)(?:-)?\d{1,3}(?:.)\d{1,6}(?:,)\d{1,3}(?:.)\d{1,6}(?:&z=)\d{1,2}(?:&pll=)((?:-)?\d{1,3}(?:.)\d{1,6})(?:,)(\d{1,3}(?:.)\d{1,6})/;
    var mapURL = "http://maps.google.com/maps/dir/";
    if (portalURLs.length < 2) {
        window.alert("At least two Intel URL's required.");
    } else {
        for (var i = 0; i < portalURLs.length; i++) {
            var result = reg.exec(portalURLs[i]);
            mapURL = mapURL + RegExp.$1 + "," + RegExp.$2 + "/";
        }
    document.getElementById("map").value = mapURL;
    }
}