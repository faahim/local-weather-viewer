$(document).ready(function() {

	//Variables for working with Location, Temprature and Times
	var lat;
	var lon;
	var tempInF;
	var tempInC;
	var timeFormatted;

	//Quotes depending on the weather
	var weatherQuotes ={
		rain: "\"The best thing one can do when it's raining is to let it rain.\" -Henry Wadsworth Longfellow",
		clearDay: "\"Wherever you go, no matter what the weather, always bring your own sunshine.\" -Anthony J. D'Angelo",
		clearNight: "\"The sky grew darker, painted blue on blue, one stroke at a time, into deeper and deeper shades of night.\" -Haruki Murakami",
		snow: "\"So comes snow after fire, and even dragons have their ending!\" -J. R. R. Tolkien",
		sleet: "\"Then come the wild weather, come sleet or come snow, we will stand by each other, however it blow.\" -Simon Dach",
		wind: "\"Kites rise highest against the wind - not with it.\" -Winston Churchill",
		fog: "\"It is not the clear-sighted who rule the world. Great achievements are accomplished in a blessed, warm fog.\" -Joseph Conrad",
		cloudy: "\"Happiness is like a cloud, if you stare at it long enough, it evaporates.\" -Sarah McLachlan",
		partlyCloudy: "\"Try to be a rainbow in someone's cloud.\" -Maya Angelou",
		default: "\"The storm starts, when the drops start dropping When the drops stop dropping then the storm starts stopping.\"― Dr. Seuss "
	};

	function locateYou() {
		//Try to get users location using their IP adress automattically.
		//It's not very precise but It's a way to get users location even if
		//their browser doesn't support Geolocation or if they refuse to share it.
		var ipApiCall = "https://ipapi.co/json";
		$.getJSON(ipApiCall, function(ipData){
			lat = ipData.latitude;
			lon = ipData.longitude;
			//console.log(lat+" "+lon+"ip"); (For Debugginh)
			yourAddress();
			getWeather();
		});

		//Try to get location from users browser (device).
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function (position) {
				lat = position.coords.latitude;
				lon = position.coords.longitude;
				// console.log(lat+" "+lon+"geo"); (For Debugging)
				yourAddress();
				getWeather();
			});
		}
	}

	//After collecting the Latiture and Longitute, Getting their formatted address from Google Maps.
	function yourAddress() {
		var googleApiCall = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lon+"&key=AIzaSyCzBRBeDmF68IzWhJfnRp04BGxqMych358";
		console.log(googleApiCall);
		$.getJSON(googleApiCall, function(locationName){
			$(".locName").html(locationName.results[2].formatted_address);
			// console.log(locationName.results[2].formatted_address); (For checking the precision)
		});
	}

	function getWeather() {
		//Looking up the weather from Darkskies using users latitude and longitude.
		//Please don't use this API key. Get your own from DarkSkies.
		var weatherApiKey = "a3219d4e2772db6e34c6491e62144b27";
		var weatherApiCall = "https://api.darksky.net/forecast/"+weatherApiKey+"/"+lat+","+lon+"?units=si";
		$.ajax({
			url: weatherApiCall,
			type: "GET",
			dataType: "jsonp",
			success: function(weatherData) {
				//Fetching all the infor from the JSON file and plugging it into UI
				$(".currentTemp").html(weatherData.currently.temperature);
				$(".weatherCondition").html(weatherData.currently.summary);
				$(".feelsLike").html(weatherData.currently.apparentTemperature + " °C");
				$(".humidity").html((weatherData.currently.humidity * 100).toFixed(0));
				$(".windSpeed").html((weatherData.currently.windSpeed/0.6213).toFixed(2));
				
				$(".todaySummary").html(weatherData.hourly.summary);
				$(".tempMin").html(weatherData.daily.data[0].temperatureMin+" °C");
				$(".tempMax").html(weatherData.daily.data[0].temperatureMax+" °C");

				$(".cloudCover").text((weatherData.currently.cloudCover*100).toFixed(2)+" %");
				$(".dewPoint").text(weatherData.currently.dewPoint + " °F");
  			
  			//Converting UNIX time
  			unixToTime(weatherData.daily.data[0].sunriseTime);
  			var sunriseTimeFormatted = timeFormatted+" AM";
  			$(".sunriseTime").text(sunriseTimeFormatted);

  			unixToTime(weatherData.daily.data[0].sunsetTime);
  			var sunsetTimeFormatted = timeFormatted+" PM";
  			$(".sunsetTime").text(sunsetTimeFormatted);

  			//Loading weekly Data in UI
  			$(".weekDaysSummary").text(weatherData.daily.summary);
  			var skycons = new Skycons({"color": "white"});

  			for (i=1; i<7; i++) {
  				$(".weekDayTempMax"+i).text(weatherData.daily.data[i].temperatureMax);
  				$(".weekDayTempMin"+i).text(weatherData.daily.data[i].temperatureMin);
  				$(".weekDaySunrise"+i).text(unixToTime(weatherData.daily.data[i].sunriseTime));
  				$(".weekDaySunset"+i).text(unixToTime(weatherData.daily.data[i].sunsetTime));
  				$(".weekDayName"+i).text(unixToWeekday(weatherData.daily.data[i].time));
  				$(".weekDaySummary"+i).text(weatherData.daily.data[i].summary);
  				$(".weekDayWind"+i).text((weatherData.daily.data[i].windSpeed/0.6213).toFixed(2));
  				$(".weekDayHumid"+i).text((weatherData.daily.data[i].humidity*100).toFixed(0));
  				$(".weekDayCloud"+i).text((weatherData.daily.data[i].cloudCover*100).toFixed(0));
  				skycons.set("weatherIcon"+i, weatherData.daily.data[i].icon);
  			}

  			//Skycon Icons
  			skycons.set("weatherIcon", weatherData.currently.icon);
  			skycons.set("expectIcon", weatherData.hourly.icon);
  			skycons.play();

  			//Coverting data between Celcius and Farenheight
  			tempInF = ((weatherData.currently.temperature*9/5) + 32).toFixed(2);
  			tempInC = weatherData.currently.temperature;
  			feelsLikeInC = 	weatherData.currently.apparentTemperature;
  			feelsLikeInF = ((weatherData.currently.apparentTemperature*9/5) + 32).toFixed(2);

  			//Load Quotes
  			var selectQuote = weatherData.currently.icon;
  			var loadQuote = $(".quote");

  			switch (weatherData.currently.icon) {
  				case "clear-day":
  					$(".quote").text(weatherQuotes.clearDay);
  					break;
  				case "clear-night":
  					$(".quote").text(weatherQuotes.clearNight);
  					break;
  				case "rain":
  					$(".quote").text(weatherQuotes.rain);
  					break;
  				case "snow":
  					$(".quote").text(weatherQuotes.snow);
  					break;
  				case "sleet":
  					$(".quote").text(weatherQuotes.sleet);
  					break;
  				case "clear-night":
  					$(".quote").text(weatherQuotes.clearNight);
  					break;
  				case "wind":
  					$(".quote").text(weatherQuotes.wind);
  					break;
  				case "fog":
  					$(".quote").text(weatherQuotes.fog);
  					break;
  				case "cloudy":
  					$(".quote").text(weatherQuotes.cloudy);
  					break;
  				case "partlyCloudy":
  					$(".quote").text(weatherQuotes.partlyCloudy);
  					break;
  				default:
  					$(".quote").text(weatherQuotes.default);
  			}
			}
		});
	}

	//Calling the function to locate user and fetch the data
	locateYou();

	//Function for converting UNIX time to Local Time
	function unixToTime(unix) {
		unix *= 1000;
		var toTime = new Date(unix);
		var hour = ((toTime.getHours() % 12 || 12 ) < 10 ? '0' : '') + (toTime.getHours() % 12 || 12);
  	var minute = (toTime.getMinutes() < 10 ? '0' : '') + toTime.getMinutes();
  	timeFormatted = hour+":"+minute;
  	return timeFormatted;
	}

	function unixToWeekday(unix) {
		unix *= 1000;
		var toWeekday = new Date(unix);
		var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
		var weekday = days[toWeekday.getDay()];
		return weekday;
	}

	//UI Tweaks
	$(".convertToggle").on("click", function() {
		$(".toggleIcon").toggleClass("ion-toggle-filled");
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


	//Smooth Scrool to Weekly Forecast section
	$(".goToWeek").on("click", function() {
		$('html, body').animate({
	    scrollTop: $("#weeklyForecast").offset().top
		}, 1000);
	});


	//Google location Search
	function initialize() { 
    var input = document.getElementById('locSearchBox');
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', function () {
      var place = autocomplete.getPlace();
      lat = place.geometry.location.lat();
      lon = place.geometry.location.lng();
      $(".locName").html(place.formatted_address);
      //Calling the getWeather function to fetch data for Searched location
      getWeather();
    	});
	}
	google.maps.event.addDomListener(window, 'load', initialize);
});