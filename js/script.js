$(document).ready(function() {
	var lat;
	var lon;
	var tempInF;
	var tempInC;

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
		var weatherApiCall = "https://api.darksky.net/forecast/"+weatherApiKey+"/"+lat+","+lon+"?units=si";
		$.ajax({
			url: weatherApiCall,
			type: "GET",
			dataType: "jsonp",
			success: function(weatherData) {
				$(".currentTemp").html(weatherData.currently.temperature);
				$(".weatherCondition").html(weatherData.currently.summary);
				$(".feelsLike").html(weatherData.currently.apparentTemperature + " °C");
				$(".humidity").html(weatherData.currently.humidity * 100);
				$(".windSpeed").html(weatherData.currently.windSpeed);
				
				$(".todaySummary").html(weatherData.hourly.summary);
				$(".tempMin").html(weatherData.daily.data[0].temperatureMin+" °C");
				$(".tempMax").html(weatherData.daily.data[0].temperatureMax+" °C");
  			
  			var skycons = new Skycons({"color": "white"});
  			skycons.set("weatherIcon", weatherData.currently.icon);
  			skycons.play();

  			tempInF = ((weatherData.currently.temperature*9/5) + 32).toFixed(2);
  			tempInC = weatherData.currently.temperature;
  			feelsLikeInC = 	weatherData.currently.apparentTemperature;
  			feelsLikeInF = ((weatherData.currently.apparentTemperature*9/5) + 32).toFixed(2);
			}
		});
	}

	locateYou();

	//UI Tweaks

	$(".convertToggle").on("click", function() {
		$(".toggleIcon").toggleClass("ion-toggle-filled");
		// $(".currentTemp").text(tempInF);
		var tmpNow = $(".currentTemp");
		var unit = $(".unit");
		var feelsLike = $(".feelsLike");

		if (tmpNow.text() == tempInC) {
			tmpNow.text(tempInF);
			unit.text("°F");
			feelsLike.text(feelsLikeInF + " °F")
		} else {
			tmpNow.text(tempInC);
			unit.text("°C");
			feelsLike.text(feelsLikeInC + " °C")
		}
	});

});