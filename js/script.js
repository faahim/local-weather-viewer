$(document).ready(function() {

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			var lati = position.coords.latitude;
			var long = position.coords.longitude;
		});
	}

});