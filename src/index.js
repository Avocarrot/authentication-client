import Authenticator from './utils/authenticator';
import store from 'store';

global.window.AuthenticationClient = new Authenticator({
  store: store,
  host: "https://auth.avocarrot.com",
  login_page_endpoint: "https://login.avocarrot.com"
});
