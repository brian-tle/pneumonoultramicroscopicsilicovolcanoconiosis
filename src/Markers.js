class Marker{

    constructor(x,y){
		this.lat = x;
		this.lng = y;
		this.default = {lat: parseFloat(x), lng: parseFloat(y)};
		this.marker;

	}
	 //createmarker(x,y) {
		
		// The map, centered at Uluru
	//	var map = new google.maps.Map(document.getElementById('map'), {zoom: 12, center: this.m});
	//	map.setOptions(mapOptions);
		// The marker, positioned at Uluru
	//	var marker = new google.maps.Marker({position: this.m, map: map,animation:google.maps.Animation.DROP});

		
	//}
	get m() {
		return this.mm();
	}
			
	mm() {
		return this.default;
	}

	createMarker(map) {
		this.marker = new google.maps.Marker({position: this.default, map:map});
		this.indicator = new MarkerIndicator(this);
    	this.indicator.init(map);
    	this.indicator.addListeners();
	}
	
	get GetMarker() {
		return this.GetM();
	}

	GetM() {
		return this.marker;
	}
	
}