import Ember from 'ember';

export default Ember.Component.extend({
	init() {
		this._super();
		var icons = [
		  'blue-dot.png',
		  'brown-dot.png',
		  'green-dot.png',
		  'grey-dot.png',
		  'blue-dot2.png',
		  'light-green-dot.png',
		  'orange-dot.png',
		  'weird-blue3-dot.png',
		  'orange-yellow-dot.png',
		  'pink-dot.png',
		  'poo-dot.png',
		  'purple-dot.png',
		  'lemon-dot.png',
		  'red-dot.png',
		  'strong-green-dot.png',
		  'violet-dot.png',
		  'yellow-dot.png',
		  'white-dot.png',
		  'mexican-pink-dot.png',
		  'weird-blue-dot.png'
		];
		var iconIdx = 0;
		this.get('trip').then((trip) => {
			trip.stops.forEach((stop) => {
				Ember.set(stop, 'icon', '/images/maps/' + icons[iconIdx++]);
				if(iconIdx >= icons.length) {
					iconIdx = 0;
				}
			});
		});
	},
	didInsertElement: function () {
		let ctx = this.$();
		let mapCanvas = jQuery('.map-canvas', ctx).get(0);
		let map = new google.maps.Map(mapCanvas, {
			zoom: 8
		});
		let bounds = new google.maps.LatLngBounds();
		this.get('trip').then(function (trip) {
			let positions = trip.stops.map((stop) => {
				var marker = new google.maps.Marker({
					position: new google.maps.LatLng(stop.location.lat, stop.location.lon),
					icon: stop.icon,
					map: map
				});
				bounds.extend(marker.position);
				return marker.position;
			});
			let polyline = new google.maps.Polyline({
				path: positions,
				geodesic: true,
				strokeColor: '#FF0000',
				strokeOpacity: 1.0,
				strokeWeight: 2
			});
			map.setCenter(bounds.getCenter());
			map.fitBounds(bounds);
			polyline.setMap(map);
			window.scrollTo(0, 0);
		});
	}
});
