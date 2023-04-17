import Ember from 'ember';

export default Ember.Controller.extend({
  init: function () {
    this._super();
    Ember.run.schedule('afterRender',this,() => {
      let infowindows = [];
      let mapCanvas = jQuery('.map-canvas').get(0);
      let map = new google.maps.Map(mapCanvas, {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
      });
		  let bounds = new google.maps.LatLngBounds();
      this.get('model').forEach((office) => {
        if(office.latitude && office.longitude) {
          var infowindow = new google.maps.InfoWindow({
            content: office.name
          });
          infowindows.push(infowindow);
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(office.latitude, office.longitude),
            map: map
          });
          bounds.extend(marker.position);
          marker.addListener('click', function() {
            infowindows.forEach(i => i.close());
            infowindow.open(map, marker);
          });
        }
      });
			map.setCenter(bounds.getCenter());
			map.fitBounds(bounds);
    });
  }
});
