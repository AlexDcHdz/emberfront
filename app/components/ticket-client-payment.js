import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Component.extend({
	paymentType: 'creditCard',
	formSelectors: {
		numberInput: 'input[name="number"]',
		expiryInput: 'input[name="expiry"]',
		cvcInput: 'input[name="cvc"]',
		nameInput: 'input[name="first-name"], input[name="last-name"]'
  },
  billingSettlements: [],
  settlements: [],
  coupon: '',
  couponAmount: 0,
  showCoupon: false,
  showPayment: false,
  creditCard: {},
  address: {},
  billingAddress: {},
  billingData: {
    sameAddress: true
  },
	store: {
		place: 'OXXO',
		name: '',
		lastNames: '',
		email: ''
	},
  general: {
    needBill: false
  },
	stores: [
		{
			id: 'OXXO',
			name: 'Oxxo'
		},
		{
			id: 'CASA_LEY',
			name: 'Casa Ley'
		},
		{
			id: 'SEVEN_ELEVEN',
			name: 'Seven Eleven'
		},
		{
			id: 'EXTRA',
			name: 'Extra'
		},
		{
			id: 'ELEKTRA',
			name: 'Elektra'
		},
		{
			id: 'COPPEL',
			name: 'Coppel'
		},
		{
			id: 'PITICO',
			name: 'Pitico'
		},
		{
			id: 'TELECOMM',
			name: 'Telecomm'
		},
		{
			id: 'FARMACIA_ABC',
			name: 'Farmacia ABC'
		},
		{
			id: 'FARMACIA_ESQUIVAR',
			name: 'Farmacia Esquivar'
		},
		{
			id: 'DEL_SOL',
			name: 'Del Sol'
		},
		{
			id: 'WOOLWORTH',
			name: 'Woolworth'
		}
	],
  buildCreditCardData(general, billingAddress, billingData, card, address, sale, passengers) {
    if(billingData.sameAddress) {
      billingAddress = {
        postalCode: address.postalCode,
        address: address.address,
        municipality: address.municipality,
        reference: address.reference,
        settlement: address.settlement,
        state: address.state
      };
    }
    let baseData = this.buildBaseData(general, billingAddress, billingData, sale, passengers);
		let expirationMonth = card.expiration.split("/")[0];
		let expirationYear = card.expiration.split("/")[1];
		card.expirationMonth = parseInt(expirationMonth, 10);
		card.expirationYear = parseInt(expirationYear, 10);
		baseData.creditCard = card;
		baseData.address = address;
    baseData.paymentParts = [
      {
        amount: this.get('missingPayment'),
        change: 0,
        paymentType: 'INTERNET_CREDIT_CARD'
      }
    ];
		return baseData;
	},
  buildStoreData(general, billingAddress, billingData, store, sale, passengers) {
    let baseData = this.buildBaseData(general, billingAddress, billingData, sale, passengers);
		baseData.store = store;
    baseData.paymentParts = [
      {
        amount: this.get('missingPayment'),
        change: 0,
        paymentType: 'INTERNET_STORE'
      }
    ];
		return baseData;
	},
  buildBaseData(general, billingAddress, billingData, sale, passengers) {
		return {
      coupon: this.get('couponData.name'),
      couponAmount: this.get('couponPaymentData.amount'),
			email: general.email,
			passengers: passengers,
      timeZone: 'America/Mexico_City',
			departureTrip: {
				id: sale.departureTrip.get('id')
      },
      needBill: general.needBill,
      billingAddress: billingAddress,
      billingData: billingData,
      returnTrip: {
				id: sale.returnTrip && sale.returnTrip.get('id')
			},
			departureSegment: {
				startingStop: {
					id: sale.departureQuote.origin.id
				},
				endingStop: {
					id: sale.departureQuote.destination.id
				}
			},
			returnSegment: {
				startingStop: {
					id: sale.returnQuote && sale.returnQuote.origin.id
				},
				endingStop: {
					id: sale.returnQuote && sale.returnQuote.destination.id
				}
			}
		};
	},
	actions: {
    postalCodeEntry(data) {
      if(data.length >= 5) {
			  jQuery('.loading').show();
        jQuery.ajax({
          url: ENV.apiURL + '/address/' + data,
          success: (data) => {
            if(data) {
              if(data.municipality) {
                this.set('address.municipality', data.municipality);
              }
              if(data.state) {
                this.set('address.state', data.state);
              }
              if(data.settlements) {
                this.set('settlements', data.settlements);
              }
            }
			      jQuery('.loading').hide();
          }
        });
      }
    },
    billingPostalCodeEntry(data) {
      if(data.length >= 5) {
			  jQuery('.loading').show();
        jQuery.ajax({
          url: ENV.apiURL + '/address/' + data,
          success: (data) => {
            if(data) {
              if(data.municipality) {
                this.set('billingAddress.municipality', data.municipality);
              }
              if(data.state) {
                this.set('billingAddress.state', data.state);
              }
              if(data.settlements) {
                this.set('billingSettlements', data.settlements);
              }
            }
			      jQuery('.loading').hide();
          }
        });
      }
    },
    couponContinue(coupon, couponAmount) {
      let totalPrice = this.get('sale.totalPrice');
      let couponAvailable = this.get('couponData.amount');

      if(couponAmount > couponAvailable) {
        this.set('couponError', 'El monto elegido es mayor al monto disponible en monedero');
        return;
      }

      let missingPayment = totalPrice - couponAmount;

      this.set('couponError', null);
      this.set('couponPaymentData', {
        coupon: coupon,
        amount: couponAmount
      });
      if(couponAmount < totalPrice) {
        this.set('missingPayment', missingPayment);
        this.set('showPayment', true);
      }
    },
    cancelCoupon() {
      this.set('showCoupon', false);
    },
    lookupCoupon(coupon) {
      jQuery.ajax({
        url: ENV.apiURL + '/sale/couponData/number/' + coupon,
        success: (data) => {
          if(data) {
            this.set('couponData', data);
            this.set('couponError', false);
          } else {
            this.set('couponError', 'El monedero es inválido');
          }
        },
        error: (data) => {
          this.set('couponError', 'El monedero es inválido');
        }
      });
    },
		selectPaymentType(paymentType) {
      this.set('billingData.sameAddress', paymentType === 'creditCard');
			this.set('paymentType', paymentType);
		},
    submitVisaPayment() {
      let general = this.get('general');
      let billingAddress = this.get('billingAddress');
      let billingData = this.get('billingData');
			let saleData = this.get('sale');
			let passengers = this.get('passengers');
			jQuery('.loading').show();
			jQuery.ajax({
				url: ENV.apiURL + '/sale/payWithMastercard',
				type: 'POST',
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
        data: JSON.stringify(this.buildBaseData(general, billingAddress, billingData, saleData, passengers))
			}).then((data) => {
        console.log(data);
				jQuery('.loading').hide();
        Checkout.configure({
          merchant: '1079224',
          order: {
            amount: function () {
              return saleData.totalPrice;
            },
            currency: 'MXN',
            description: 'Tickets turismo en omnibus',
            id: data.id
          },
          session: {
            id: data.payment.sessionId
          },
          interaction: {
            merchant: {
              name: 'Turismo en omnibus',
              address: {
                line1: 'Rosalio Bustamante 1004',
                line2: '89160 Tampico'
              }
            }
          }
        });
        Checkout.showPaymentPage();
			});
    },
		submitPaypalPayment() {
      let general = this.get('general');
      let billingAddress = this.get('billingAddress');
      let billingData = this.get('billingData');
			let saleData = this.get('sale');
			let passengers = this.get('passengers');
			jQuery('.loading').show();
			jQuery.ajax({
				url: ENV.apiURL + '/sale/payWithPaypal',
				type: 'POST',
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
        data: JSON.stringify(this.buildBaseData(general, billingAddress, billingData, saleData, passengers))
			}).then((data) => {
				jQuery('.loading').hide();
				location.href = data.payment.approvalUrl;
			});
		},
		submitCreditCardPayment() {
      let general = this.get('general');
      let billingAddress = this.get('billingAddress');
      let billingData = this.get('billingData');
			let cardData = this.get('creditCard');
			let saleData = this.get('sale');
			let passengers = this.get('passengers');
			let address = this.get('address');
      jQuery('#card-form').validator('validate');
      if(!jQuery('#card-form').data('bs.validator').hasErrors()) {
        console.log('Pasajeros', passengers);
        jQuery('.loading').show();
        jQuery.ajax({
          url: ENV.apiURL + '/sale/payWithCreditCard',
          type: 'POST',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          data: JSON.stringify(this.buildCreditCardData(general, billingAddress, billingData, cardData, address, saleData, passengers))
        }).then((data) => {
          jQuery('.loading').hide();
          this.sendAction('finishedSale', data.shortId);
        });
      }
		},
		submitStorePayment() {
      let storeData = this.get('store');
      let billingAddress = this.get('billingAddress');
      let billingData = this.get('billingData');
			let saleData = this.get('sale');
			let passengers = this.get('passengers');
			let general = {
				email: storeData.email,
        needBill: this.get('general.needBill')
			};
			jQuery('.loading').show();
      jQuery('#store-form').validator('validate');
      if(!jQuery('#store-form').data('bs.validator').hasErrors()) {
        jQuery.ajax({
          url: ENV.apiURL + '/sale/payInStore',
          type: 'POST',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          data: JSON.stringify(this.buildStoreData(general, billingAddress, billingData, storeData, saleData, passengers))
        }).then((data) => {
          jQuery('.loading').hide();
          this.sendAction('pendingSale', data.shortId);
        });
      }
		},
    selectStores() {
      this.set('showPayment', true);
      this.set('paymentType', 'store');
      this.set('missingPayment', this.get('sale.totalPrice'));
    },
    selectVisa() {
      this.set('showPayment', true);
      this.set('paymentType', 'visa');
      this.set('missingPayment', this.get('sale.totalPrice'));
    },
    selectWallet() {
      this.set('showCoupon', true);
    },
    returnToConfirmation() {
      this.sendAction('returnPayment');
    },
    returnPayment() {
      this.set('showCoupon', false);
      this.set('showPayment', false);
      window.scrollTo(0, 0);
    }
	},
  didRender() {
    jQuery('#card-form').validator();
    jQuery('#store-form').validator();
  }
});
