import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('searchResults');
  this.route('validatePaypal');
  this.route('viewTickets');
  this.route('view-ticket-detail', { path: '/viewTickets/:id' });
  this.route('pendingPayment', { path: '/pendingPayment/:shortId' });
  this.route('finishedPayment', { path: '/finishedPayment/:shortId' });
  this.route('ticket-dashboard');
  this.route('admin-dashboard');
  this.route('ticket-dashboard-search');
  this.route('ticket-dashboard-cancel');
  this.route('ticket-dashboard-coupon');
  this.route('admin-dashboard-reports');
  this.route('admin-trip-guide');
  this.route('admin-payments');
  this.route('admin-loans');
  this.route('admin-weekly-payments');
  this.route('admin-trip-search');
  this.route('ticket-baggage');
  this.route('stop-checker');
  this.route('location-map');
  this.route('payments-list');
  this.route('booth-list');
  this.route('scan-ticket');
  this.route('tripList');
  this.route('ticket-check-coupon');
  this.route('boothDetail');
  this.route('paymentDetail');
  this.route('payment-search');
  this.route('package-dashboard-search');
  this.route('edit-payment', { path: '/editPayment/:id' } );
  this.route('joined-payments');
  this.route('pay-reserved');
  this.route('salePoints');
  this.route('contact');
  this.route('about');
  this.route('bulk-scan');
  this.route('trip-dashboard-list', { path: '/tripDashboard' });
  this.route('trip-dashboard', { path: '/tripDashboard/:id' } );
});

export default Router;
