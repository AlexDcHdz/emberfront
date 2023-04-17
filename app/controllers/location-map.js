import Ember from 'ember';

export default Ember.Controller.extend({
  map: null,
  bounds: null,
  init() {
    Ember.run.later(this, function () {
		  let mapCanvas = jQuery('.map-canvas').get(0);
		  this.map = new google.maps.Map(mapCanvas, {
			  zoom: 8
		  });
		  this.bounds = new google.maps.LatLngBounds();
      this.loadData();
    }, 1000);
  },
  loadData() {
    let infowindows = [];
    let locations = this.get('model');
    let positions = locations.map((location) => {
      var infowindow = new google.maps.InfoWindow({
        content: location.bus.busNumber + ' ' + location.location,
      });
      infowindows.push(infowindow);
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(location.latitude, location.longitude),
        map: this.map
      });
      this.bounds.extend(marker.position);
      marker.addListener('click', function() {
        infowindows.forEach(i => i.close());
        infowindow.open(this.map, marker);
      });
      return marker.position;
    });
    this.map.setCenter(this.bounds.getCenter());
    this.map.fitBounds(this.bounds);
    console.log(locations);
    // Ember.run.later(this, 'loadData', 30000);
  },
});
