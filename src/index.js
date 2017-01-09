import Authenticator from './utils/authenticator';
import Store from 'store';
import Client from './utils/Client';
import Host from './utils/host';

const client = new Client("id", "secret");
const host = new Host("https://auth.avocarrot.com", "https://login.avocarrot.com");

global.window.AuthenticationClient = new Authenticator(Store, client, host);
