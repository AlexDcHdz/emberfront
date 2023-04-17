import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Controller.extend({
  authorizedRequest: Ember.inject.service('authorizedRequest'),
  session: Ember.inject.service('session'),
  selectedTerminal: null,
  oldTerminal: {
    currentAmount: 0,
    currentPayedAmount: 0,
    paymentAvailableAmount: 0
  },
  newTerminal: {
    currentAmount: 0,
    currentPayedAmount: 0,
    paymentAvailableAmount: 0,
    salesTerminal: false,
    paymentTerminal: false
  },
  terminals: [],
  profile: function () {
    return this.get('session.data.profile');
  }.property(),
  locationObserver: Ember.observer('oldTerminal.officeLocation', function() {
    var officeLocation = this.get('oldTerminal.officeLocation');
    officeLocation = officeLocation.substring(officeLocation.lastIndexOf('/') + 1);
    this.get('authorizedRequest').ajax(ENV.apiURL + '/booth/office/' + officeLocation)
      .then(data => {
        data.sort((a, b) => {
          return a.terminalName.localeCompare(b.terminalName);
        });
        this.set('terminals', data);
      });
  }),
  lookupBeginnings(text) {
    var beginningSuggestionsUrl = ENV.apiURL + '/search/beginning';
    return jQuery.get(beginningSuggestionsUrl, {s: text});
  },
  uuid() {
    var buf = new Uint32Array(4);
    window.crypto.getRandomValues(buf);
    var idx = -1;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      idx++;
      var r = (buf[idx>>3] >> ((idx%8)*4))&15;
      var v = c === 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  },
  actions: {
    createTerminal() {
      let newTerminal = JSON.parse(JSON.stringify(this.get('newTerminal')));
      newTerminal.stopOffName = newTerminal.stopOffName.value;
      newTerminal.terminalId = this.uuid();
      this.get('authorizedRequest').ajax(ENV.apiURL + '/salesTerminals', {
        method: 'POST',
        data: JSON.stringify(newTerminal),
        contentType: 'application/json; charset=utf-8',
      }).then(() => {
        localforage.setItem('terminalData', {
          id: newTerminal.terminalId
        }, () => {
          this.set('changeTerminalConfiguration', false);
          location.reload();
        });
      });
    },
    selectTerminal() {
      if(this.get('selectedTerminal')) {
        localforage.setItem('terminalData', {
          id: this.get('selectedTerminal')
        }, () => {
          this.set('changeTerminalConfiguration', false);
          location.reload();
        });
      }
    },
    enableTerminalConfiguration() {
      this.set('changeTerminalConfiguration', true);
    }
  }
});
