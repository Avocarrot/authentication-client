const Authenticator = require('./utils/authenticator');
const Store = require('./utils/store');
const Client = require('./utils/client');
const Host = require('./utils/host');

let client = new Client("id", "secret");
let host = new Host("https://auth.avocarrot.com", "https://login.avocarrot.com");
let store = new Store("avocarrot");

global.window.AuthenticationClient = new Authenticator(store, client, host);
