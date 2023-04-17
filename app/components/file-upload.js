import EmberUploader from 'ember-uploader';
import ENV from '../config/environment';

export default EmberUploader.FileField.extend({
  filesDidChange: function(files) {
    const uploader = EmberUploader.Uploader.create({
      url: ENV.apiURL + this.get('url')
    });
    if (!Ember.isEmpty(files)) {
      uploader.upload(files[0], this.get('extra'));
    }

    uploader.on('didUpload', e => {
      this.sendAction('uploadFinished', e);
    });

  }
});
