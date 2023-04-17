import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Component.extend({
	seats: ['SEAT', 'SEAT_AND_TV', 'EXTRA_SEAT'],
	currentFloor: 0,
  edition: true,
  showName: false,
  booth: false,
  init() {
    var freeCount = 0;
    let frontTakeover = 15;
    let backTakeover = 10;
    let totalTakeover = frontTakeover + backTakeover;
		this._super();
		if(!this.get('trip')) {
			return;
    }
    let partiallyReserved = [];
    let booth = this.get('booth');
		this.get('passengers').forEach((passenger, idx) => {
			passenger.idx = idx;
    });
    let tripProcess = (trip) => {
      trip.positions.forEach((floor) => {
				floor.forEach((row) => {
					row.filter((position) => position).forEach((position) =>{
						if(!position.icon) {
							var icon = this.translateIcon(position.type) + '-unselected';
              Ember.set(position, 'showNumber', this.showNumber(position.type));
							if(position.reserved) {
                if(booth) {
                  if(position.status === 'OCCUPIED') {
                    icon = this.translateIcon(position.type) + '-occupied';
                  } else {
                    icon = this.translateIcon(position.type) + '-partially-reserved';
                  }
                  partiallyReserved.push(position.name);
                  Ember.set(position, 'showData', 'show-data');
                } else {
								  icon = this.translateIcon(position.type) + '-reserved';
                }
              } else if(this.get('seats').indexOf(position.type) >= 0) {
                freeCount++;
              }
							Ember.set(position, 'widthClass', 'bus-width-' + position.width);
							Ember.set(position, 'heightClass', 'bus-height-' + position.width);
							Ember.set(position, 'icon', icon);
						}
					});
				});
      });
      this.set('partiallyReserved', partiallyReserved);
      if(freeCount - totalTakeover >= 5 && !booth) {
        this.takeover(trip, frontTakeover, backTakeover);
      }
    };
    if(this.get('trip').then) {
      this.get('trip').then(tripProcess);
    } else {
      tripProcess(this.get('trip'));
    }
		if(this.get('edition')) {
			Ember.set(this.get('passengers').get(0), 'selected', true);
			this.set('currentPassenger', (this.get('passengers').get(0)));
		}
  },
  didInsertElement() {
    if(this.get('partiallyReserved')) {
      this.get('partiallyReserved').forEach(reservation => {
        jQuery.ajax({
          url: ENV.apiURL + '/search/trip/' + this.get('trip.id') + '/' + reservation,
          success: (data) => {
            var html = '<strong>Pasajes usados</strong><br/>';
            data.forEach((trip) => {
              html += trip.startingStop + ' - ' + trip.endingStop + '<br />';
            });
            jQuery('#position-data-' + reservation).html(html);
            setTimeout(function () {
              jQuery('.show-data').darkTooltip({});
            }, 400);
          }
        });
      });
    }
  },
  takeover(trip, frontTakeover, backTakeover) {
    var possibilities = [];

    trip.positions.forEach(floor => {
      floor.forEach(row => {
        row.forEach(position => {
          if(position && !position.reserved && this.get('seats').indexOf(position.type) >= 0) {
            possibilities.push(position);
          }
        });
      });
    });

    possibilities.sort((a, b) => {
      return parseInt(a.name, 10) - parseInt(b.name, 10);
    });

    let half = possibilities.length / 2;
    if(half < frontTakeover) {
      half = frontTakeover;
    }

    let frontPossibilities = possibilities.slice(0, half);
    let backPossibilities = possibilities.slice(half);

    let frontPositions = this.fisherYates(frontPossibilities, frontTakeover);
    let backPositions = this.fisherYates(backPossibilities, backTakeover);

    frontPositions.forEach(pos => {
      var icon = this.translateIcon(pos.type) + '-reserved';
      Ember.set(pos, 'icon', icon);
    });
    backPositions.forEach(pos => {
      var icon = this.translateIcon(pos.type) + '-reserved';
      Ember.set(pos, 'icon', icon);
    });
  },
  fisherYates(myArray,nb_picks) {
    for (var i = myArray.length-1; i > 1  ; i--)
    {
      var r = Math.floor(Math.random()*i);
      var t = myArray[i];
      myArray[i] = myArray[r];
      myArray[r] = t;

    }

    return myArray.slice(0,nb_picks);
  },
	showNumber(positionType) {
		let icons = {
			'DOOR': false,
			'SEAT': true,
			'SEAT_AND_TV': true,
			'BATHROOM': false,
			'TV': false,
			'BED': false,
			'TRUNK': false,
			'VIRTUAL': false,
			'BORDER_RIGHT': false,
			'BORDER_LEFT': false,
			'WHEEL': false,
			'EXTRA_SEAT': true,
			'COFFEE': false,
			'EMPTY': false
		};
		return icons[positionType];
	},
	translateIcon(positionType) {
		let icons = {
			'DOOR': 'pue',
			'SEAT': 'a',
			'SEAT_AND_TV': 'atv',
			'BATHROOM': 'wc',
			'TV': 'tv',
			'BED': 'cam',
			'TRUNK': 'ca',
			'VIRTUAL': 'vi',
			'BORDER_RIGHT': 'br',
			'BORDER_LEFT': 'bl',
			'WHEEL': 'vol',
			'EXTRA_SEAT': 'peri',
			'COFFEE': 'caf',
			'EMPTY': 'emp'
		};
		return icons[positionType];
	},
  actions: {
    passengerClicked(passenger) {
      if(passenger.passengerType === 'INFANT') {
        return;
      }
      this.get('passengers').forEach(p => {
        Ember.set(p, 'selected', false);
      });
      this.set('currentPassenger', passenger);
      Ember.set(passenger, 'selected', true);
    },
    positionClicked(position) {
      let currentPassenger = this.get('currentPassenger');
      let mode = this.get('mode');
      let selected = position.icon.indexOf('-unselected') < 0;
      let seatName = Ember.get(currentPassenger, mode + 'Seat');
      if(seatName) {
        this.get('trip.positions').forEach(rows => {
          rows.forEach(row => {
            row.forEach(seat => {
              if(seat && seatName === seat.name) {
                let icon = this.translateIcon(seat.type) + '-unselected';
                Ember.set(seat, 'icon', icon);
              }
            });
          });
        });
      }
      if(currentPassenger && this.get('seats').indexOf(position.type) >= 0 && this.get('edition') && !selected) {
        let icon = this.translateIcon(position.type) + '-selected';
				Ember.set(currentPassenger, mode + 'Seat', position.name);
				Ember.set(position, 'icon', icon);
				Ember.set(currentPassenger, 'selected', false);
				if(currentPassenger.idx + 1 < this.get('passengers').length && this.get('passengers').get(currentPassenger.idx + 1).passengerType !== 'INFANT') {
					this.set('currentPassenger', this.get('passengers').get(currentPassenger.idx + 1));
					this.set('currentPassenger.selected', true);
				} else {
					this.set('currentPassenger', null);
					this.set('currentFloor', 0);
        }
        let allSelected = this.get('passengers').every(passenger => {
          return passenger[mode + 'Seat'] != null || passenger.passengerType === 'INFANT';
        });
        if(allSelected) {
          this.sendAction('allSelected', this.get('trip'), this.get('quote'));
        }
      }
		},
		changeFloor(floor) {
			this.set('currentFloor', floor);
		}
	}
});
