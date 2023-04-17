import FB from 'ember-cli-facebook-js-sdk/fb';

export function initialize() {
  return FB.init({
    appId: '181496698867701',
    version: 'v2.5',
    xfbml: true
  });
}

export default {
  name: 'fb',
  initialize
};
