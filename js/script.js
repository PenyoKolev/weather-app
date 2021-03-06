$(document).ready(function () {

    $.getJSON("https://ipapi.co/jsonp/?callback=?", function (data) {
        $("#lat").val(data.latitude);
        $("#lng").val(data.longitude);
    });

    var lat = $("#lat").val();
    var lng = $("#lng").val();
    var unit = "metric";
    var selectDay = $("#daySelect").val();
    var spinner = $("#loader");
    var address;
    var idVar;
    var day;
    var today;
    var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    function loadWeather() {
        spinner.show();
        $.get("http://api.openweathermap.org/data/2.5/forecast/daily", {
            APPID: "a824ef2e2591bd239228beab33789010",
            lat: lat,
            lon: lng,
            units: unit,
            cnt: "5"
        }).done(function (data) {
            data.list.forEach(function (el, i) {
                today = new Date().getDay();
                if (i === 0) {
                    day = "Today";
                } else if (today + i < 7) {
                    day = daysOfWeek[today + i];
                } else {
                    day = daysOfWeek[today + i - 7];
                }
                var appendStr = '';
                var appendStrLeft = " ";
                var appendStrRight = ' ';
                var appendStrCenter = ' ';
                idVar = "#day" + i;
                var maxTemp = Math.round(data.list[i].temp.max);
                var minTemp = Math.round(data.list[i].temp.min);
                var iconUrl = "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png";
                appendStr += ("<h2>" + day + "</h2>");
                appendStr += ("<h3>" + maxTemp + "&deg/" + minTemp + "&deg</h3>");
                appendStr += ("<img src='" + iconUrl + "' alt='Icon'>");
                appendStr += ("<p><strong>" + data.list[i].weather[0].main + ":</strong> " + data.list[i].weather[0].description + "</p>");
                appendStr += ("<p><strong>Humidity: </strong>" + data.list[i].humidity + "</p>");
                appendStr += ("<p><strong>Wind: </strong>" + data.list[i].speed + " " + fromDegToDir(data.list[0].deg) + "</p>");
                appendStr += ("<p><strong>Pressure: </strong>" + data.list[i].pressure + "</p>");

                $(idVar).html(appendStr);

                appendStrLeft += ("<h3>High: " + Math.round(data.list[0].temp.max) + "&deg</h3>");
                appendStrLeft += ("<h3>Low: " + Math.round(data.list[0].temp.min) + "&deg</h3>");
                appendStrRight += ("<h3><strong>" + data.list[0].weather[0].main + ":</strong> " + data.list[0].weather[0].description + "</h3>");
                appendStrRight += ("<img src='http://openweathermap.org/img/w/" + data.list[0].weather[0].icon + ".png' alt='Icon'>");
                appendStrCenter += ("<p><strong>Humidity: </strong>" + data.list[0].humidity + "</p>");
                appendStrCenter += ("<p><strong>Wind: </strong>" + data.list[0].speed + "</p>");
                appendStrCenter += ("<p><strong>Direction: </strong>" + fromDegToDir(data.list[0].deg) + "</p>");
                appendStrCenter += ("<p><strong>Pressure: </strong>" + data.list[0].pressure + "</p>");
                $("#todayLeft").html(appendStrLeft);
                $("#todayCenter").html(appendStrCenter);
                $("#todayRight").html(appendStrRight);
                spinner.hide();
            });
            $("#currentCity").html(data.city.name);
        });
    }

    $("#daySelect").click(function () {
        if (selectDay === "today") {
            selectDay = "fiveDay";
            $(".weatherBox").removeClass("active");
            $(".todayBox").addClass("active");
            $("#daySelect").html("5 Day");

        } else {
            selectDay = "today";
            $(".weatherBox").removeClass("active five");
            $(".fiveDayBox").addClass("active five");
            $("#daySelect").html("Today");

        }
    });

    $("#unit").click(function () {
        if (unit === "metric") {
            unit = "imperial";
            $("#unit").html("&deg;C");
        } else {
            unit = "metric";
            $("#unit").html("&deg;F");
        }
        loadWeather();
    });

    $("#searchBtn").click(function () {
        address = $("#search").val();
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            address: address
        }, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                lat = results[0].geometry.location.lat();
                lng = results[0].geometry.location.lng();
                loadWeather();
                updateInputs();
            } else {
                alert("Please enter a valid location");
            }
        });
    });

    $("#locSubmit").click(function () {
        var x = lat;
        var y = lng;
        if ($("#lat").val() < -90 || $("#lat").val() > 90) {
            alert("Latitudes should be between -90 and 90 degrees");
        } else if ($("#lng").val() < -180 || $("#lng").val() > 180) {
            alert("Longitude should be between -180 and 180 degrees");
        } else {
            lat = $("#lat").val();
            lng = $("#lng").val();
            loadWeather();
        }
        lat = x;
        lng = y;
    });

    function fromDegToDir(deg) {
        var val = Math.floor((deg / 22.5) + 0.5);
        var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
        return arr[(val % 16)];
    };

    function updateInputs() {
        $("#lat").val(lat.toFixed(6));
        $("#lng").val(lng.toFixed(6));
    }
    loadWeather();
});