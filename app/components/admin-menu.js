import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),
  selectedGps: function () {
    return location.pathname == '/location-map';
  }.property(),
  selectedTicketCheck: function () {
    return location.pathname == '/scan-ticket';
  }.property(),
  selectedPayReserved: function () {
    return location.pathname == '/pay-reserved';
  }.property(),
  selectedTicketSales: function () {
    return location.pathname == '/ticket-dashboard';
  }.property(),
  selectedJoinedPayments: function () {
    return location.pathname == '/joined-payments';
  }.property(),
  selectedBaggageSend: function () {
    return location.pathname == '/ticket-baggage';
  }.property(),
  selectedTicketSearch: function () {
    return location.pathname == '/ticket-dashboard-search';
  }.property(),
  selectedPackageSearch: function () {
    return location.pathname == '/package-dashboard-search';
  }.property(),
  selectedBoardingLists: function () {
    return location.pathname == '/tripList';
  }.property(),
  selectedTripGuide: function () {
    return location.pathname == '/admin-trip-guide';
  }.property(),
  selectedBuyCard: function () {
    return location.pathname == '/ticket-dashboard-coupon';
  }.property(),
  selectedCancelTrip: function () {
    return location.pathname == '/ticket-dashboard-cancel';
  }.property(),
  selectedAdminConfig: function () {
    return location.pathname == '/admin-dashboard';
  }.property(),
  selectedReports: function () {
    return location.pathname == '/admin-dashboard-reports';
  }.property(),
  selectedPayments: function () {
    return location.pathname == '/admin-payments';
  }.property(),
  selectedPaymentSearch: function() {
    return location.pathname == '/payment-search';
  }.property(),
  selectedLoans: function () {
    return location.pathname == '/admin-loans';
  }.property(),
  selectedWeeklyLoans: function () {
    return location.pathname == '/admin-weekly-loans';
  }.property(),
  selectedTripSearch: function () {
    return location.pathname == '/admin-trip-search';
  }.property(),
  selectedRecordStop: function () {
    return location.pathname == '/stop-checker';
  }.property(),
  selectedPaymentDetail: function () {
    return location.pathname == '/paymentDetail';
  }.property(),
  selectedBoothDetail: function () {
    return location.pathname == '/boothDetail';
  }.property(),
  selectedBoothAdmin: function () {
    return location.pathname == '/booth-list';
  }.property(),
  enableBoothConfig: function () {
    return $.inArray('configure-id', this.get('session.data.profile.permissions')) >= 0;
  }.property(),
  enableAdminConfig: function () {
    return $.inArray('manage-catalog-id', this.get('session.data.profile.permissions')) >= 0;
  }.property(),
  enableReports: function () {
    return $.inArray('manage-catalog-id', this.get('session.data.profile.permissions')) >= 0;
  }.property(),
  enablePayments: function () {
    return $.inArray('payments-id', this.get('session.data.profile.permissions')) >= 0;
  }.property(),
  enableLoans: function () {
    return $.inArray('debt-id', this.get('session.data.profile.permissions')) >= 0;
  }.property(),
  enableWeeklyPayments: function () {
    return $.inArray('weekly-payment-id', this.get('session.data.profile.permissions')) >= 0;
  }.property(),
  enableTripSearch: function () {
    return $.inArray('sale-id', this.get('session.data.profile.permissions')) >= 0;
  }.property(),
  enableRecordStop: function () {
    return $.inArray('record-stop', this.get('session.data.profile.permissions')) >= 0;
  }.property(),
  enableBoothAdmin: function () {
    return $.inArray('view-sale-booths-id', this.get('session.data.profile.permissions')) >= 0;
  }.property(),
  enablePaymentAdmin: function () {
    return $.inArray('view-payment-booths-id', this.get('session.data.profile.permissions')) >= 0;
  }.property(),
  roles: function () {
    return this.get('session.data.profile');
  }.property(),
  enableTicketSales: function () {
    return $.inArray('sale-id', this.get('session.data.profile.permissions')) >= 0;
  }.property(),
  enableBaggageSend: function () {
    return $.inArray('baggage-sale-id', this.get('session.data.profile.permissions')) >= 0;
  }.property(),
  enableTicketSearch: function () {
    return $.inArray('sale-id', this.get('session.data.profile.permissions')) >= 0;
  }.property(),
  enableBoardingList: function () {
    return $.inArray('print-boarding-list-id', this.get('session.data.profile.permissions')) >= 0;
  }.property(),
  enableTripGuide: function () {
    return $.inArray('generate-boarding-guide-id', this.get('session.data.profile.permissions')) >= 0;
  }.property(),
  enableBuyCard: function () {
    return $.inArray('buy-electronic-card-id', this.get('session.data.profile.permissions')) >= 0;
  }.property(),
  enableCancelTrip: function () {
    console.log(this.get('session.data.profile.permissions'));
    return $.inArray(' cancel-ticket-id', this.get('session.data.profile.permissions')) >= 0;
  }.property(),
  enableGps: function () {
    return $.inArray('view-gps', this.get('session.data.profile.permissions')) >= 0;
  }.property()
});
