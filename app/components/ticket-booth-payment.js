import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Component.extend({
  paymentType: 'cash',
  address: {},
  billingAddress: {},
  billingData: {},
  general: {
    needBill: false,
    payedAmount: 0
  },
  paymentTypes: [
    {id: 'TRANSFER', name: 'Transferencia Bancaria'},
    {id: 'CREDIT_CARD', name: 'Tarjeta de crédito'},
    {id: 'CASH', name: 'Efectivo'},
    {id: 'ACCOUNT', name: 'Monedero electrónico'}
  ],
  parts: [],
  temp: {
    paymentType: 'CASH'
  },
  totalAmount: Ember.computed('parts.[]', function () {
    let payedAmount = this.get('parts').reduce((total, part) => total + parseFloat(part.amount), 0);
    return payedAmount;
  }),
  validAmount: Ember.computed('parts.[]', function () {
    let payedAmount = this.get('parts').reduce((total, part) => total + parseFloat(part.amount), 0);
    console.log(this.get('sale'), payedAmount);
    return !this.get('sale.totalPrice') || (payedAmount >= parseFloat(this.get('sale.totalPrice')));
  }),
  changeAmount: Ember.computed('totalAmount', function () {
    return this.get('totalAmount') - parseFloat(this.get('sale.totalPrice'));
  }),
  showChange: Ember.computed('changeAmount', function () {
    return this.get('changeAmount') > 0;
  }),
  buildBaseData(general, billingAddress, billingData, sale, passengers, parts) {
    var changeAmount = null;
    if(general.paymentType === 'cash') {
      changeAmount = this.get('changeAmount');
    }
    return {
      email: general.email,
      passengers: passengers,
      departureTrip: {
        id: sale && sale.departureTrip && sale.departureTrip.get('id')
      },
      totalPrice: sale && sale.totalPrice,
      paymentParts: parts,
      payedAmount: general.payedAmount,
      changeAmount: changeAmount,
      paymentMethod: general.paymentType,
      needBill: general.needBill,
      billingAddress: billingAddress,
      billingData: billingData,
      returnTrip: {
        id: sale && sale.returnTrip && sale.returnTrip.get('id')
      },
      departureSegment: {
        startingStop: {
          id: sale && sale.departureQuote && sale.departureQuote.origin.id
        },
        endingStop: {
          id: sale && sale.departureQuote && sale.departureQuote.destination.id
        }
      },
      returnSegment: {
        startingStop: {
          id: sale && sale.returnQuote && sale.returnQuote && sale.returnQuote.origin.id
        },
        endingStop: {
          id: sale && sale.returnQuote && sale.returnQuote.destination.id
        }
      }
    };
  },
  actions: {
    addPaymentType(part) {
      this.set('paymentError', '');
      part = {
        amount: part.amount,
        reference: part.reference,
        paymentType: part.paymentType,
        cardNumber: part.cardNumber
      };
      if (!part.amount) {
        this.set('paymentError', 'El monto especificado es invalido');
        return;
      }
      if(part && part.paymentType) {
        if(part.paymentType === 'ACCOUNT') {
          if (!part.cardNumber) {
            this.set('paymentError', 'El número de monedero es inválido');
            return;
          }
          jQuery.ajax({
            url: ENV.apiURL + '/sale/couponData/' + part.cardNumber,
            success: (data) => {
              if (!data) {
                this.set('paymentError', 'El número de monedero es inválido');
                return;
              }
              if (data.name != part.reference) {
                this.set('paymentError', 'La referencia no corresponde con la referencia registrada en el sistema');
                return;
              }
              if(part.amount <= data.amount) {
                this.get('parts').addObject({
                  paymentType: 'ACCOUNT',
                  amount: part.amount,
                  leftover: data.amount - part.amount,
                  reference: data.name
                });
                this.set('temp.amount', null);
                this.set('temp.paymentType', 'CASH');
                this.set('temp.cardNumber', '');
                this.set('temp.reference', '');
              } else {
                this.set('paymentError', 'El total del monedero es de ' + data.amount + ' y no es suficiente para completar este pago');
              }
            },
            error: (data) => {
              this.set('paymentError', 'El número o la referencia del monedero son invalidos');
            }
          });
        } else if(part.amount) {
          this.get('parts').addObject(part);
          this.set('temp.amount', null);
          this.set('temp.paymentType', 'CASH');
          this.set('temp.reference', '');
        }
      }
    },
    deletePart(part) {
      this.get('parts').removeObject(part);
    },
    returnToBus() {
      this.sendAction('returnReceived');
    },
    submitPayment() {
      let general = this.get('general');
      let billingAddress = this.get('billingAddress');
      let billingData = this.get('billingData');
      let saleData = this.get('sale');
      let passengers = this.get('passengers');
      let parts = this.get('parts');
      let payedAmount = parts.reduce((total, part) => total + parseFloat(part.amount), 0);
      general.payedAmount = payedAmount;
      general.paymentType = this.get('paymentType');
      let data = this.buildBaseData(general, billingAddress, billingData, saleData, passengers, parts);
      this.sendAction('paymentReceived', data);
    }
  },
  reset() {
    this.get('parts').clear();
  },
  didInsertElement() {
    this.set('register-as', this);
  }
});
