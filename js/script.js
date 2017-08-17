$(document).ready(function() {
	var lat;
	var lon;

	function locateYou() {

		var ipApiCall = "https://ipapi.co/json";
		$.getJSON(ipApiCall, function(ipData){
			lat = ipData.latitude;
			lon = ipData.longitude;
			console.log(lat+" "+lon+"ip");
			yourAddress();
			getWearher();
		});

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function (position) {
				lat = position.coords.latitude;
				lon = position.coords.longitude;
				console.log(lat+" "+lon+"geo");
				yourAddress();
				getWearher();
			});
		}
	}

	function yourAddress() {
		var googleApiCall = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lon;
		$.getJSON(googleApiCall, function(locationName){
			$(".locName").html(locationName.results[2].formatted_address);
			console.log(locationName.results[2].formatted_address);
		});
	}

	function getWearher() {
		var weatherApiKey = "a3219d4e2772db6e34c6491e62144b27";
		var weatherApiCall = "https://api.darksky.net/forecast/"+weatherApiKey+"/"+lat+","+lon;
		$.ajax({
			url: weatherApiCall,
			type: "GET",
			dataType: "jsonp",
			success: function(weatherData) {
				$(".currentTemp").html(weatherData.currently.temperature);
				$(".weatherCondition").html(weatherData.currently.summary);
				$(".feelsLike").html(weatherData.currently.apparentTemperature);
				$(".humidity").html(weatherData.currently.humidity);
				$(".windSpeed").html(weatherData.currently.windSpeed);
  			
  			var skycons = new Skycons({"color": "white"});
  			skycons.set("weatherIcon", weatherData.currently.icon);
  			skycons.play();	
			}
		});
	}

	locateYou();

});