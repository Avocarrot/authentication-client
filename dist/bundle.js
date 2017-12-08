'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var assert = _interopDefault(require('assert'));

var _default = {
  api: {
    host: '//auth.avocarrot.com'
  },
  login: {
    host: '//login.avocarrot.com'
  },
  store: {
    domain: 'avocarrot'
  }
};

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
}



function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var client = createCommonjsModule(function (module, exports) {
(function(root) {
  /**
   * Constructs a new cross storage client given the url to a hub. By default,
   * an iframe is created within the document body that points to the url. It
   * also accepts an options object, which may include a timeout, frameId, and
   * promise. The timeout, in milliseconds, is applied to each request and
   * defaults to 5000ms. The options object may also include a frameId,
   * identifying an existing frame on which to install its listeners. If the
   * promise key is supplied the constructor for a Promise, that Promise library
   * will be used instead of the default window.Promise.
   *
   * @example
   * var storage = new CrossStorageClient('https://store.example.com/hub.html');
   *
   * @example
   * var storage = new CrossStorageClient('https://store.example.com/hub.html', {
   *   timeout: 5000,
   *   frameId: 'storageFrame'
   * });
   *
   * @constructor
   *
   * @param {string} url    The url to a cross storage hub
   * @param {object} [opts] An optional object containing additional options,
   *                        including timeout, frameId, and promise
   *
   * @property {string}   _id        A UUID v4 id
   * @property {function} _promise   The Promise object to use
   * @property {string}   _frameId   The id of the iFrame pointing to the hub url
   * @property {string}   _origin    The hub's origin
   * @property {object}   _requests  Mapping of request ids to callbacks
   * @property {bool}     _connected Whether or not it has connected
   * @property {bool}     _closed    Whether or not the client has closed
   * @property {int}      _count     Number of requests sent
   * @property {function} _listener  The listener added to the window
   * @property {Window}   _hub       The hub window
   */
  function CrossStorageClient(url, opts) {
    opts = opts || {};

    this._id        = CrossStorageClient._generateUUID();
    this._promise   = opts.promise || Promise;
    this._frameId   = opts.frameId || 'CrossStorageClient-' + this._id;
    this._origin    = CrossStorageClient._getOrigin(url);
    this._requests  = {};
    this._connected = false;
    this._closed    = false;
    this._count     = 0;
    this._timeout   = opts.timeout || 5000;
    this._listener  = null;

    this._installListener();

    var frame;
    if (opts.frameId) {
      frame = document.getElementById(opts.frameId);
    }

    // If using a passed iframe, poll the hub for a ready message
    if (frame) {
      this._poll();
    }

    // Create the frame if not found or specified
    frame = frame || this._createFrame(url);
    this._hub = frame.contentWindow;
  }

  /**
   * The styles to be applied to the generated iFrame. Defines a set of properties
   * that hide the element by positioning it outside of the visible area, and
   * by modifying its display.
   *
   * @member {Object}
   */
  CrossStorageClient.frameStyle = {
    display:  'none',
    position: 'absolute',
    top:      '-999px',
    left:     '-999px'
  };

  /**
   * Returns the origin of an url, with cross browser support. Accommodates
   * the lack of location.origin in IE, as well as the discrepancies in the
   * inclusion of the port when using the default port for a protocol, e.g.
   * 443 over https. Defaults to the origin of window.location if passed a
   * relative path.
   *
   * @param   {string} url The url to a cross storage hub
   * @returns {string} The origin of the url
   */
  CrossStorageClient._getOrigin = function(url) {
    var uri, protocol, origin;

    uri = document.createElement('a');
    uri.href = url;

    if (!uri.host) {
      uri = window.location;
    }

    if (!uri.protocol || uri.protocol === ':') {
      protocol = window.location.protocol;
    } else {
      protocol = uri.protocol;
    }

    origin = protocol + '//' + uri.host;
    origin = origin.replace(/:80$|:443$/, '');

    return origin;
  };

  /**
   * UUID v4 generation, taken from: http://stackoverflow.com/questions/
   * 105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
   *
   * @returns {string} A UUID v4 string
   */
  CrossStorageClient._generateUUID = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16|0, v = c == 'x' ? r : (r&0x3|0x8);

      return v.toString(16);
    });
  };

  /**
   * Returns a promise that is fulfilled when a connection has been established
   * with the cross storage hub. Its use is required to avoid sending any
   * requests prior to initialization being complete.
   *
   * @returns {Promise} A promise that is resolved on connect
   */
  CrossStorageClient.prototype.onConnect = function() {
    var client = this;

    if (this._connected) {
      return this._promise.resolve();
    } else if (this._closed) {
      return this._promise.reject(new Error('CrossStorageClient has closed'));
    }

    // Queue connect requests for client re-use
    if (!this._requests.connect) {
      this._requests.connect = [];
    }

    return new this._promise(function(resolve, reject) {
      var timeout = setTimeout(function() {
        reject(new Error('CrossStorageClient could not connect'));
      }, client._timeout);

      client._requests.connect.push(function(err) {
        clearTimeout(timeout);
        if (err) return reject(err);

        resolve();
      });
    });
  };

  /**
   * Sets a key to the specified value. Returns a promise that is fulfilled on
   * success, or rejected if any errors setting the key occurred, or the request
   * timed out.
   *
   * @param   {string}  key   The key to set
   * @param   {*}       value The value to assign
   * @returns {Promise} A promise that is settled on hub response or timeout
   */
  CrossStorageClient.prototype.set = function(key, value) {
    return this._request('set', {
      key:   key,
      value: value
    });
  };

  /**
   * Accepts one or more keys for which to retrieve their values. Returns a
   * promise that is settled on hub response or timeout. On success, it is
   * fulfilled with the value of the key if only passed a single argument.
   * Otherwise it's resolved with an array of values. On failure, it is rejected
   * with the corresponding error message.
   *
   * @param   {...string} key The key to retrieve
   * @returns {Promise}   A promise that is settled on hub response or timeout
   */
  CrossStorageClient.prototype.get = function(key) {
    var args = Array.prototype.slice.call(arguments);

    return this._request('get', {keys: args});
  };

  /**
   * Accepts one or more keys for deletion. Returns a promise that is settled on
   * hub response or timeout.
   *
   * @param   {...string} key The key to delete
   * @returns {Promise}   A promise that is settled on hub response or timeout
   */
  CrossStorageClient.prototype.del = function() {
    var args = Array.prototype.slice.call(arguments);

    return this._request('del', {keys: args});
  };

  /**
   * Returns a promise that, when resolved, indicates that all localStorage
   * data has been cleared.
   *
   * @returns {Promise} A promise that is settled on hub response or timeout
   */
  CrossStorageClient.prototype.clear = function() {
    return this._request('clear');
  };

  /**
   * Returns a promise that, when resolved, passes an array of all keys
   * currently in storage.
   *
   * @returns {Promise} A promise that is settled on hub response or timeout
   */
  CrossStorageClient.prototype.getKeys = function() {
    return this._request('getKeys');
  };

  /**
   * Deletes the iframe and sets the connected state to false. The client can
   * no longer be used after being invoked.
   */
  CrossStorageClient.prototype.close = function() {
    var frame = document.getElementById(this._frameId);
    if (frame) {
      frame.parentNode.removeChild(frame);
    }

    // Support IE8 with detachEvent
    if (window.removeEventListener) {
      window.removeEventListener('message', this._listener, false);
    } else {
      window.detachEvent('onmessage', this._listener);
    }

    this._connected = false;
    this._closed = true;
  };

  /**
   * Installs the necessary listener for the window message event. When a message
   * is received, the client's _connected status is changed to true, and the
   * onConnect promise is fulfilled. Given a response message, the callback
   * corresponding to its request is invoked. If response.error holds a truthy
   * value, the promise associated with the original request is rejected with
   * the error. Otherwise the promise is fulfilled and passed response.result.
   *
   * @private
   */
  CrossStorageClient.prototype._installListener = function() {
    var client = this;

    this._listener = function(message) {
      var i, origin, error, response;

      // Ignore invalid messages or those after the client has closed
      if (client._closed || !message.data || typeof message.data !== 'string') {
        return;
      }

      // postMessage returns the string "null" as the origin for "file://"
      origin = (message.origin === 'null') ? 'file://' : message.origin;

      // Ignore messages not from the correct origin
      if (origin !== client._origin) return;

      // LocalStorage isn't available in the hub
      if (message.data === 'cross-storage:unavailable') {
        if (!client._closed) client.close();
        if (!client._requests.connect) return;

        error = new Error('Closing client. Could not access localStorage in hub.');
        for (i = 0; i < client._requests.connect.length; i++) {
          client._requests.connect[i](error);
        }

        return;
      }

      // Handle initial connection
      if (message.data.indexOf('cross-storage:') !== -1 && !client._connected) {
        client._connected = true;
        if (!client._requests.connect) return;

        for (i = 0; i < client._requests.connect.length; i++) {
          client._requests.connect[i](error);
        }
        delete client._requests.connect;
      }

      if (message.data === 'cross-storage:ready') return;

      // All other messages
      try {
        response = JSON.parse(message.data);
      } catch(e) {
        return;
      }

      if (!response.id) return;

      if (client._requests[response.id]) {
        client._requests[response.id](response.error, response.result);
      }
    };

    // Support IE8 with attachEvent
    if (window.addEventListener) {
      window.addEventListener('message', this._listener, false);
    } else {
      window.attachEvent('onmessage', this._listener);
    }
  };

  /**
   * Invoked when a frame id was passed to the client, rather than allowing
   * the client to create its own iframe. Polls the hub for a ready event to
   * establish a connected state.
   */
  CrossStorageClient.prototype._poll = function() {
    var client, interval, targetOrigin;

    client = this;

    // postMessage requires that the target origin be set to "*" for "file://"
    targetOrigin = (client._origin === 'file://') ? '*' : client._origin;

    interval = setInterval(function() {
      if (client._connected) return clearInterval(interval);
      if (!client._hub) return;

      client._hub.postMessage('cross-storage:poll', targetOrigin);
    }, 1000);
  };

  /**
   * Creates a new iFrame containing the hub. Applies the necessary styles to
   * hide the element from view, prior to adding it to the document body.
   * Returns the created element.
   *
   * @private
   *
   * @param  {string}            url The url to the hub
   * returns {HTMLIFrameElement} The iFrame element itself
   */
  CrossStorageClient.prototype._createFrame = function(url) {
    var frame, key;

    frame = window.document.createElement('iframe');
    frame.id = this._frameId;

    // Style the iframe
    for (key in CrossStorageClient.frameStyle) {
      if (CrossStorageClient.frameStyle.hasOwnProperty(key)) {
        frame.style[key] = CrossStorageClient.frameStyle[key];
      }
    }

    window.document.body.appendChild(frame);
    frame.src = url;

    return frame;
  };

  /**
   * Sends a message containing the given method and params to the hub. Stores
   * a callback in the _requests object for later invocation on message, or
   * deletion on timeout. Returns a promise that is settled in either instance.
   *
   * @private
   *
   * @param   {string}  method The method to invoke
   * @param   {*}       params The arguments to pass
   * @returns {Promise} A promise that is settled on hub response or timeout
   */
  CrossStorageClient.prototype._request = function(method, params) {
    var req, client;

    if (this._closed) {
      return this._promise.reject(new Error('CrossStorageClient has closed'));
    }

    client = this;
    client._count++;

    req = {
      id:     this._id + ':' + client._count,
      method: 'cross-storage:' + method,
      params: params
    };

    return new this._promise(function(resolve, reject) {
      var timeout, originalToJSON, targetOrigin;

      // Timeout if a response isn't received after 4s
      timeout = setTimeout(function() {
        if (!client._requests[req.id]) return;

        delete client._requests[req.id];
        reject(new Error('Timeout: could not perform ' + req.method));
      }, client._timeout);

      // Add request callback
      client._requests[req.id] = function(err, result) {
        clearTimeout(timeout);
        delete client._requests[req.id];
        if (err) return reject(new Error(err));
        resolve(result);
      };

      // In case we have a broken Array.prototype.toJSON, e.g. because of
      // old versions of prototype
      if (Array.prototype.toJSON) {
        originalToJSON = Array.prototype.toJSON;
        Array.prototype.toJSON = null;
      }

      // postMessage requires that the target origin be set to "*" for "file://"
      targetOrigin = (client._origin === 'file://') ? '*' : client._origin;

      // Send serialized message
      client._hub.postMessage(JSON.stringify(req), targetOrigin);

      // Restore original toJSON
      if (originalToJSON) {
        Array.prototype.toJSON = originalToJSON;
      }
    });
  };

  /**
   * Export for various environments.
   */
  if ('object' !== 'undefined' && module.exports) {
    module.exports = CrossStorageClient;
  } else {
    exports.CrossStorageClient = CrossStorageClient;
  }
}(commonjsGlobal));
});

var hub = createCommonjsModule(function (module, exports) {
(function(root) {
  var CrossStorageHub = {};

  /**
   * Accepts an array of objects with two keys: origin and allow. The value
   * of origin is expected to be a RegExp, and allow, an array of strings.
   * The cross storage hub is then initialized to accept requests from any of
   * the matching origins, allowing access to the associated lists of methods.
   * Methods may include any of: get, set, del, getKeys and clear. A 'ready'
   * message is sent to the parent window once complete.
   *
   * @example
   * // Subdomain can get, but only root domain can set and del
   * CrossStorageHub.init([
   *   {origin: /\.example.com$/,        allow: ['get']},
   *   {origin: /:(www\.)?example.com$/, allow: ['get', 'set', 'del']}
   * ]);
   *
   * @param {array} permissions An array of objects with origin and allow
   */
  CrossStorageHub.init = function(permissions) {
    var available = true;

    // Return if localStorage is unavailable, or third party
    // access is disabled
    try {
      if (!window.localStorage) available = false;
    } catch (e) {
      available = false;
    }

    if (!available) {
      try {
        return window.parent.postMessage('cross-storage:unavailable', '*');
      } catch (e) {
        return;
      }
    }

    CrossStorageHub._permissions = permissions || [];
    CrossStorageHub._installListener();
    window.parent.postMessage('cross-storage:ready', '*');
  };

  /**
   * Installs the necessary listener for the window message event. Accommodates
   * IE8 and up.
   *
   * @private
   */
  CrossStorageHub._installListener = function() {
    var listener = CrossStorageHub._listener;
    if (window.addEventListener) {
      window.addEventListener('message', listener, false);
    } else {
      window.attachEvent('onmessage', listener);
    }
  };

  /**
   * The message handler for all requests posted to the window. It ignores any
   * messages having an origin that does not match the originally supplied
   * pattern. Given a JSON object with one of get, set, del or getKeys as the
   * method, the function performs the requested action and returns its result.
   *
   * @param {MessageEvent} message A message to be processed
   */
  CrossStorageHub._listener = function(message) {
    var origin, targetOrigin, request, method, error, result, response;

    // postMessage returns the string "null" as the origin for "file://"
    origin = (message.origin === 'null') ? 'file://' : message.origin;

    // Handle polling for a ready message
    if (message.data === 'cross-storage:poll') {
      return window.parent.postMessage('cross-storage:ready', message.origin);
    }

    // Ignore the ready message when viewing the hub directly
    if (message.data === 'cross-storage:ready') return;

    // Check whether message.data is a valid json
    try {
      request = JSON.parse(message.data);
    } catch (err) {
      return;
    }

    // Check whether request.method is a string
    if (!request || typeof request.method !== 'string') {
      return;
    }

    method = request.method.split('cross-storage:')[1];

    if (!method) {
      return;
    } else if (!CrossStorageHub._permitted(origin, method)) {
      error = 'Invalid permissions for ' + method;
    } else {
      try {
        result = CrossStorageHub['_' + method](request.params);
      } catch (err) {
        error = err.message;
      }
    }

    response = JSON.stringify({
      id: request.id,
      error: error,
      result: result
    });

    // postMessage requires that the target origin be set to "*" for "file://"
    targetOrigin = (origin === 'file://') ? '*' : origin;

    window.parent.postMessage(response, targetOrigin);
  };

  /**
   * Returns a boolean indicating whether or not the requested method is
   * permitted for the given origin. The argument passed to method is expected
   * to be one of 'get', 'set', 'del' or 'getKeys'.
   *
   * @param   {string} origin The origin for which to determine permissions
   * @param   {string} method Requested action
   * @returns {bool}   Whether or not the request is permitted
   */
  CrossStorageHub._permitted = function(origin, method) {
    var available, i, entry, match;

    available = ['get', 'set', 'del', 'clear', 'getKeys'];
    if (!CrossStorageHub._inArray(method, available)) {
      return false;
    }

    for (i = 0; i < CrossStorageHub._permissions.length; i++) {
      entry = CrossStorageHub._permissions[i];
      if (!(entry.origin instanceof RegExp) || !(entry.allow instanceof Array)) {
        continue;
      }

      match = entry.origin.test(origin);
      if (match && CrossStorageHub._inArray(method, entry.allow)) {
        return true;
      }
    }

    return false;
  };

  /**
   * Sets a key to the specified value.
   *
   * @param {object} params An object with key and value
   */
  CrossStorageHub._set = function(params) {
    window.localStorage.setItem(params.key, params.value);
  };

  /**
   * Accepts an object with an array of keys for which to retrieve their values.
   * Returns a single value if only one key was supplied, otherwise it returns
   * an array. Any keys not set result in a null element in the resulting array.
   *
   * @param   {object} params An object with an array of keys
   * @returns {*|*[]}  Either a single value, or an array
   */
  CrossStorageHub._get = function(params) {
    var storage, result, i, value;

    storage = window.localStorage;
    result = [];

    for (i = 0; i < params.keys.length; i++) {
      try {
        value = storage.getItem(params.keys[i]);
      } catch (e) {
        value = null;
      }

      result.push(value);
    }

    return (result.length > 1) ? result : result[0];
  };

  /**
   * Deletes all keys specified in the array found at params.keys.
   *
   * @param {object} params An object with an array of keys
   */
  CrossStorageHub._del = function(params) {
    for (var i = 0; i < params.keys.length; i++) {
      window.localStorage.removeItem(params.keys[i]);
    }
  };

  /**
   * Clears localStorage.
   */
  CrossStorageHub._clear = function() {
    window.localStorage.clear();
  };

  /**
   * Returns an array of all keys stored in localStorage.
   *
   * @returns {string[]} The array of keys
   */
  CrossStorageHub._getKeys = function(params) {
    var i, length, keys;

    keys = [];
    length = window.localStorage.length;

    for (i = 0; i < length; i++) {
      keys.push(window.localStorage.key(i));
    }

    return keys;
  };

  /**
   * Returns whether or not a value is present in the array. Consists of an
   * alternative to extending the array prototype for indexOf, since it's
   * unavailable for IE8.
   *
   * @param   {*}    value The value to find
   * @parma   {[]*}  array The array in which to search
   * @returns {bool} Whether or not the value was found
   */
  CrossStorageHub._inArray = function(value, array) {
    for (var i = 0; i < array.length; i++) {
      if (value === array[i]) return true;
    }

    return false;
  };

  /**
   * A cross-browser version of Date.now compatible with IE8 that avoids
   * modifying the Date object.
   *
   * @return {int} The current timestamp in milliseconds
   */
  CrossStorageHub._now = function() {
    if (typeof Date.now === 'function') {
      return Date.now();
    }

    return new Date().getTime();
  };

  /**
   * Export for various environments.
   */
  if ('object' !== 'undefined' && module.exports) {
    module.exports = CrossStorageHub;
  } else {
    exports.CrossStorageHub = CrossStorageHub;
  }
}(commonjsGlobal));
});

var index$2 = {
  CrossStorageClient: client,
  CrossStorageHub:    hub
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();



























var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();













var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var CrossStorageClient = index$2.CrossStorageClient;

/**
 * Wrapper around `CrossStorageClient`
 *
 * @class HubStorageClient
 * @see https://github.com/zendesk/cross-storage
 *
 */

var HubStorageClient = function () {

  /**
   * Initializes HubStorageClient
   *
   * @constructor
   * @param {String} domain - The domain under which all values will be attached
   * @param {Class} CrossStorageClientClass - The CrossStorageClient class to be instantiated (Defaults to CrossStorageClient)
   * @return {HubStorageClient}
   *
   */
  function HubStorageClient(iframeHub) {
    var CrossStorageClientClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : CrossStorageClient;
    classCallCheck(this, HubStorageClient);

    assert(iframeHub, 'Missing `iframeHub`');
    this._iframeHub = iframeHub;
    this._CrossStorageClientClass = CrossStorageClientClass;
    this._instance = undefined;
  }

  /**
   * Wrapper of CrossStorageClient.onConnect();
   * CrossStorageClient injects an iframe in the DOM, so we need
   * to ensure that the insertion happens ONLY when an event is triggered
   *
   * @private
   * @return {Promise}
   */


  createClass(HubStorageClient, [{
    key: 'onConnect',
    value: function onConnect() {
      if (!this._instance) {
        this._instance = new this._CrossStorageClientClass(this._iframeHub);
      }
      return this._instance.onConnect();
    }

    /**
     * Wrapper of CrossStorageClient.get();
     *
     * @param {Arguments} rest
     * @return {Promise}
     */

  }, {
    key: 'get',
    value: function get$$1() {
      var _this = this;

      for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
        rest[_key] = arguments[_key];
      }

      return this.onConnect().then(function () {
        var _instance;

        return (_instance = _this._instance).get.apply(_instance, rest);
      });
    }

    /**
     * Wrapper of CrossStorageClient.set();
     *
     * @param {Arguments} rest
     * @return {Promise}
     */

  }, {
    key: 'set',
    value: function set$$1() {
      var _this2 = this;

      for (var _len2 = arguments.length, rest = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        rest[_key2] = arguments[_key2];
      }

      return this.onConnect().then(function () {
        var _instance2;

        return (_instance2 = _this2._instance).set.apply(_instance2, rest);
      });
    }

    /**
     * Wrapper of CrossStorageClient.del();
     *
     * @param {Arguments} rest
     * @return {Promise}
     */

  }, {
    key: 'del',
    value: function del() {
      var _this3 = this;

      for (var _len3 = arguments.length, rest = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        rest[_key3] = arguments[_key3];
      }

      return this.onConnect().then(function () {
        var _instance3;

        return (_instance3 = _this3._instance).del.apply(_instance3, rest);
      });
    }
  }]);
  return HubStorageClient;
}();

var hubStorageClient = HubStorageClient;

var bowser = createCommonjsModule(function (module) {
/*!
 * Bowser - a browser detector
 * https://github.com/ded/bowser
 * MIT License | (c) Dustin Diaz 2015
 */

!function (root, name, definition) {
  if ('object' != 'undefined' && module.exports) module.exports = definition();
  else if (typeof undefined == 'function' && undefined.amd) undefined(name, definition);
  else root[name] = definition();
}(commonjsGlobal, 'bowser', function () {
  /**
    * See useragents.js for examples of navigator.userAgent
    */

  var t = true;

  function detect(ua) {

    function getFirstMatch(regex) {
      var match = ua.match(regex);
      return (match && match.length > 1 && match[1]) || '';
    }

    function getSecondMatch(regex) {
      var match = ua.match(regex);
      return (match && match.length > 1 && match[2]) || '';
    }

    var iosdevice = getFirstMatch(/(ipod|iphone|ipad)/i).toLowerCase()
      , likeAndroid = /like android/i.test(ua)
      , android = !likeAndroid && /android/i.test(ua)
      , nexusMobile = /nexus\s*[0-6]\s*/i.test(ua)
      , nexusTablet = !nexusMobile && /nexus\s*[0-9]+/i.test(ua)
      , chromeos = /CrOS/.test(ua)
      , silk = /silk/i.test(ua)
      , sailfish = /sailfish/i.test(ua)
      , tizen = /tizen/i.test(ua)
      , webos = /(web|hpw)os/i.test(ua)
      , windowsphone = /windows phone/i.test(ua)
      , samsungBrowser = /SamsungBrowser/i.test(ua)
      , windows = !windowsphone && /windows/i.test(ua)
      , mac = !iosdevice && !silk && /macintosh/i.test(ua)
      , linux = !android && !sailfish && !tizen && !webos && /linux/i.test(ua)
      , edgeVersion = getFirstMatch(/edge\/(\d+(\.\d+)?)/i)
      , versionIdentifier = getFirstMatch(/version\/(\d+(\.\d+)?)/i)
      , tablet = /tablet/i.test(ua)
      , mobile = !tablet && /[^-]mobi/i.test(ua)
      , xbox = /xbox/i.test(ua)
      , result;

    if (/opera/i.test(ua)) {
      //  an old Opera
      result = {
        name: 'Opera'
      , opera: t
      , version: versionIdentifier || getFirstMatch(/(?:opera|opr|opios)[\s\/](\d+(\.\d+)?)/i)
      };
    } else if (/opr|opios/i.test(ua)) {
      // a new Opera
      result = {
        name: 'Opera'
        , opera: t
        , version: getFirstMatch(/(?:opr|opios)[\s\/](\d+(\.\d+)?)/i) || versionIdentifier
      };
    }
    else if (/SamsungBrowser/i.test(ua)) {
      result = {
        name: 'Samsung Internet for Android'
        , samsungBrowser: t
        , version: versionIdentifier || getFirstMatch(/(?:SamsungBrowser)[\s\/](\d+(\.\d+)?)/i)
      };
    }
    else if (/coast/i.test(ua)) {
      result = {
        name: 'Opera Coast'
        , coast: t
        , version: versionIdentifier || getFirstMatch(/(?:coast)[\s\/](\d+(\.\d+)?)/i)
      };
    }
    else if (/yabrowser/i.test(ua)) {
      result = {
        name: 'Yandex Browser'
      , yandexbrowser: t
      , version: versionIdentifier || getFirstMatch(/(?:yabrowser)[\s\/](\d+(\.\d+)?)/i)
      };
    }
    else if (/ucbrowser/i.test(ua)) {
      result = {
          name: 'UC Browser'
        , ucbrowser: t
        , version: getFirstMatch(/(?:ucbrowser)[\s\/](\d+(?:\.\d+)+)/i)
      };
    }
    else if (/mxios/i.test(ua)) {
      result = {
        name: 'Maxthon'
        , maxthon: t
        , version: getFirstMatch(/(?:mxios)[\s\/](\d+(?:\.\d+)+)/i)
      };
    }
    else if (/epiphany/i.test(ua)) {
      result = {
        name: 'Epiphany'
        , epiphany: t
        , version: getFirstMatch(/(?:epiphany)[\s\/](\d+(?:\.\d+)+)/i)
      };
    }
    else if (/puffin/i.test(ua)) {
      result = {
        name: 'Puffin'
        , puffin: t
        , version: getFirstMatch(/(?:puffin)[\s\/](\d+(?:\.\d+)?)/i)
      };
    }
    else if (/sleipnir/i.test(ua)) {
      result = {
        name: 'Sleipnir'
        , sleipnir: t
        , version: getFirstMatch(/(?:sleipnir)[\s\/](\d+(?:\.\d+)+)/i)
      };
    }
    else if (/k-meleon/i.test(ua)) {
      result = {
        name: 'K-Meleon'
        , kMeleon: t
        , version: getFirstMatch(/(?:k-meleon)[\s\/](\d+(?:\.\d+)+)/i)
      };
    }
    else if (windowsphone) {
      result = {
        name: 'Windows Phone'
      , windowsphone: t
      };
      if (edgeVersion) {
        result.msedge = t;
        result.version = edgeVersion;
      }
      else {
        result.msie = t;
        result.version = getFirstMatch(/iemobile\/(\d+(\.\d+)?)/i);
      }
    }
    else if (/msie|trident/i.test(ua)) {
      result = {
        name: 'Internet Explorer'
      , msie: t
      , version: getFirstMatch(/(?:msie |rv:)(\d+(\.\d+)?)/i)
      };
    } else if (chromeos) {
      result = {
        name: 'Chrome'
      , chromeos: t
      , chromeBook: t
      , chrome: t
      , version: getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
      };
    } else if (/chrome.+? edge/i.test(ua)) {
      result = {
        name: 'Microsoft Edge'
      , msedge: t
      , version: edgeVersion
      };
    }
    else if (/vivaldi/i.test(ua)) {
      result = {
        name: 'Vivaldi'
        , vivaldi: t
        , version: getFirstMatch(/vivaldi\/(\d+(\.\d+)?)/i) || versionIdentifier
      };
    }
    else if (sailfish) {
      result = {
        name: 'Sailfish'
      , sailfish: t
      , version: getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i)
      };
    }
    else if (/seamonkey\//i.test(ua)) {
      result = {
        name: 'SeaMonkey'
      , seamonkey: t
      , version: getFirstMatch(/seamonkey\/(\d+(\.\d+)?)/i)
      };
    }
    else if (/firefox|iceweasel|fxios/i.test(ua)) {
      result = {
        name: 'Firefox'
      , firefox: t
      , version: getFirstMatch(/(?:firefox|iceweasel|fxios)[ \/](\d+(\.\d+)?)/i)
      };
      if (/\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(ua)) {
        result.firefoxos = t;
      }
    }
    else if (silk) {
      result =  {
        name: 'Amazon Silk'
      , silk: t
      , version : getFirstMatch(/silk\/(\d+(\.\d+)?)/i)
      };
    }
    else if (/phantom/i.test(ua)) {
      result = {
        name: 'PhantomJS'
      , phantom: t
      , version: getFirstMatch(/phantomjs\/(\d+(\.\d+)?)/i)
      };
    }
    else if (/slimerjs/i.test(ua)) {
      result = {
        name: 'SlimerJS'
        , slimer: t
        , version: getFirstMatch(/slimerjs\/(\d+(\.\d+)?)/i)
      };
    }
    else if (/blackberry|\bbb\d+/i.test(ua) || /rim\stablet/i.test(ua)) {
      result = {
        name: 'BlackBerry'
      , blackberry: t
      , version: versionIdentifier || getFirstMatch(/blackberry[\d]+\/(\d+(\.\d+)?)/i)
      };
    }
    else if (webos) {
      result = {
        name: 'WebOS'
      , webos: t
      , version: versionIdentifier || getFirstMatch(/w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i)
      };
      /touchpad\//i.test(ua) && (result.touchpad = t);
    }
    else if (/bada/i.test(ua)) {
      result = {
        name: 'Bada'
      , bada: t
      , version: getFirstMatch(/dolfin\/(\d+(\.\d+)?)/i)
      };
    }
    else if (tizen) {
      result = {
        name: 'Tizen'
      , tizen: t
      , version: getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i) || versionIdentifier
      };
    }
    else if (/qupzilla/i.test(ua)) {
      result = {
        name: 'QupZilla'
        , qupzilla: t
        , version: getFirstMatch(/(?:qupzilla)[\s\/](\d+(?:\.\d+)+)/i) || versionIdentifier
      };
    }
    else if (/chromium/i.test(ua)) {
      result = {
        name: 'Chromium'
        , chromium: t
        , version: getFirstMatch(/(?:chromium)[\s\/](\d+(?:\.\d+)?)/i) || versionIdentifier
      };
    }
    else if (/chrome|crios|crmo/i.test(ua)) {
      result = {
        name: 'Chrome'
        , chrome: t
        , version: getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
      };
    }
    else if (android) {
      result = {
        name: 'Android'
        , version: versionIdentifier
      };
    }
    else if (/safari|applewebkit/i.test(ua)) {
      result = {
        name: 'Safari'
      , safari: t
      };
      if (versionIdentifier) {
        result.version = versionIdentifier;
      }
    }
    else if (iosdevice) {
      result = {
        name : iosdevice == 'iphone' ? 'iPhone' : iosdevice == 'ipad' ? 'iPad' : 'iPod'
      };
      // WTF: version is not part of user agent in web apps
      if (versionIdentifier) {
        result.version = versionIdentifier;
      }
    }
    else if(/googlebot/i.test(ua)) {
      result = {
        name: 'Googlebot'
      , googlebot: t
      , version: getFirstMatch(/googlebot\/(\d+(\.\d+))/i) || versionIdentifier
      };
    }
    else {
      result = {
        name: getFirstMatch(/^(.*)\/(.*) /),
        version: getSecondMatch(/^(.*)\/(.*) /)
     };
   }

    // set webkit or gecko flag for browsers based on these engines
    if (!result.msedge && /(apple)?webkit/i.test(ua)) {
      if (/(apple)?webkit\/537\.36/i.test(ua)) {
        result.name = result.name || "Blink";
        result.blink = t;
      } else {
        result.name = result.name || "Webkit";
        result.webkit = t;
      }
      if (!result.version && versionIdentifier) {
        result.version = versionIdentifier;
      }
    } else if (!result.opera && /gecko\//i.test(ua)) {
      result.name = result.name || "Gecko";
      result.gecko = t;
      result.version = result.version || getFirstMatch(/gecko\/(\d+(\.\d+)?)/i);
    }

    // set OS flags for platforms that have multiple browsers
    if (!result.windowsphone && !result.msedge && (android || result.silk)) {
      result.android = t;
    } else if (!result.windowsphone && !result.msedge && iosdevice) {
      result[iosdevice] = t;
      result.ios = t;
    } else if (mac) {
      result.mac = t;
    } else if (xbox) {
      result.xbox = t;
    } else if (windows) {
      result.windows = t;
    } else if (linux) {
      result.linux = t;
    }

    function getWindowsVersion (s) {
      switch (s) {
        case 'NT': return 'NT'
        case 'XP': return 'XP'
        case 'NT 5.0': return '2000'
        case 'NT 5.1': return 'XP'
        case 'NT 5.2': return '2003'
        case 'NT 6.0': return 'Vista'
        case 'NT 6.1': return '7'
        case 'NT 6.2': return '8'
        case 'NT 6.3': return '8.1'
        case 'NT 10.0': return '10'
        default: return undefined
      }
    }
    
    // OS version extraction
    var osVersion = '';
    if (result.windows) {
      osVersion = getWindowsVersion(getFirstMatch(/Windows ((NT|XP)( \d\d?.\d)?)/i));
    } else if (result.windowsphone) {
      osVersion = getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i);
    } else if (result.mac) {
      osVersion = getFirstMatch(/Mac OS X (\d+([_\.\s]\d+)*)/i);
      osVersion = osVersion.replace(/[_\s]/g, '.');
    } else if (iosdevice) {
      osVersion = getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i);
      osVersion = osVersion.replace(/[_\s]/g, '.');
    } else if (android) {
      osVersion = getFirstMatch(/android[ \/-](\d+(\.\d+)*)/i);
    } else if (result.webos) {
      osVersion = getFirstMatch(/(?:web|hpw)os\/(\d+(\.\d+)*)/i);
    } else if (result.blackberry) {
      osVersion = getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i);
    } else if (result.bada) {
      osVersion = getFirstMatch(/bada\/(\d+(\.\d+)*)/i);
    } else if (result.tizen) {
      osVersion = getFirstMatch(/tizen[\/\s](\d+(\.\d+)*)/i);
    }
    if (osVersion) {
      result.osversion = osVersion;
    }

    // device type extraction
    var osMajorVersion = !result.windows && osVersion.split('.')[0];
    if (
         tablet
      || nexusTablet
      || iosdevice == 'ipad'
      || (android && (osMajorVersion == 3 || (osMajorVersion >= 4 && !mobile)))
      || result.silk
    ) {
      result.tablet = t;
    } else if (
         mobile
      || iosdevice == 'iphone'
      || iosdevice == 'ipod'
      || android
      || nexusMobile
      || result.blackberry
      || result.webos
      || result.bada
    ) {
      result.mobile = t;
    }

    // Graded Browser Support
    // http://developer.yahoo.com/yui/articles/gbs
    if (result.msedge ||
        (result.msie && result.version >= 10) ||
        (result.yandexbrowser && result.version >= 15) ||
		    (result.vivaldi && result.version >= 1.0) ||
        (result.chrome && result.version >= 20) ||
        (result.samsungBrowser && result.version >= 4) ||
        (result.firefox && result.version >= 20.0) ||
        (result.safari && result.version >= 6) ||
        (result.opera && result.version >= 10.0) ||
        (result.ios && result.osversion && result.osversion.split(".")[0] >= 6) ||
        (result.blackberry && result.version >= 10.1)
        || (result.chromium && result.version >= 20)
        ) {
      result.a = t;
    }
    else if ((result.msie && result.version < 10) ||
        (result.chrome && result.version < 20) ||
        (result.firefox && result.version < 20.0) ||
        (result.safari && result.version < 6) ||
        (result.opera && result.version < 10.0) ||
        (result.ios && result.osversion && result.osversion.split(".")[0] < 6)
        || (result.chromium && result.version < 20)
        ) {
      result.c = t;
    } else result.x = t;

    return result
  }

  var bowser = detect(typeof navigator !== 'undefined' ? navigator.userAgent || '' : '');

  bowser.test = function (browserList) {
    for (var i = 0; i < browserList.length; ++i) {
      var browserItem = browserList[i];
      if (typeof browserItem=== 'string') {
        if (browserItem in bowser) {
          return true;
        }
      }
    }
    return false;
  };

  /**
   * Get version precisions count
   *
   * @example
   *   getVersionPrecision("1.10.3") // 3
   *
   * @param  {string} version
   * @return {number}
   */
  function getVersionPrecision(version) {
    return version.split(".").length;
  }

  /**
   * Array::map polyfill
   *
   * @param  {Array} arr
   * @param  {Function} iterator
   * @return {Array}
   */
  function map(arr, iterator) {
    var result = [], i;
    if (Array.prototype.map) {
      return Array.prototype.map.call(arr, iterator);
    }
    for (i = 0; i < arr.length; i++) {
      result.push(iterator(arr[i]));
    }
    return result;
  }

  /**
   * Calculate browser version weight
   *
   * @example
   *   compareVersions(['1.10.2.1',  '1.8.2.1.90'])    // 1
   *   compareVersions(['1.010.2.1', '1.09.2.1.90']);  // 1
   *   compareVersions(['1.10.2.1',  '1.10.2.1']);     // 0
   *   compareVersions(['1.10.2.1',  '1.0800.2']);     // -1
   *
   * @param  {Array<String>} versions versions to compare
   * @return {Number} comparison result
   */
  function compareVersions(versions) {
    // 1) get common precision for both versions, for example for "10.0" and "9" it should be 2
    var precision = Math.max(getVersionPrecision(versions[0]), getVersionPrecision(versions[1]));
    var chunks = map(versions, function (version) {
      var delta = precision - getVersionPrecision(version);

      // 2) "9" -> "9.0" (for precision = 2)
      version = version + new Array(delta + 1).join(".0");

      // 3) "9.0" -> ["000000000"", "000000009"]
      return map(version.split("."), function (chunk) {
        return new Array(20 - chunk.length).join("0") + chunk;
      }).reverse();
    });

    // iterate in reverse order by reversed chunks array
    while (--precision >= 0) {
      // 4) compare: "000000009" > "000000010" = false (but "9" > "10" = true)
      if (chunks[0][precision] > chunks[1][precision]) {
        return 1;
      }
      else if (chunks[0][precision] === chunks[1][precision]) {
        if (precision === 0) {
          // all version chunks are same
          return 0;
        }
      }
      else {
        return -1;
      }
    }
  }

  /**
   * Check if browser is unsupported
   *
   * @example
   *   bowser.isUnsupportedBrowser({
   *     msie: "10",
   *     firefox: "23",
   *     chrome: "29",
   *     safari: "5.1",
   *     opera: "16",
   *     phantom: "534"
   *   });
   *
   * @param  {Object}  minVersions map of minimal version to browser
   * @param  {Boolean} [strictMode = false] flag to return false if browser wasn't found in map
   * @param  {String}  [ua] user agent string
   * @return {Boolean}
   */
  function isUnsupportedBrowser(minVersions, strictMode, ua) {
    var _bowser = bowser;

    // make strictMode param optional with ua param usage
    if (typeof strictMode === 'string') {
      ua = strictMode;
      strictMode = void(0);
    }

    if (strictMode === void(0)) {
      strictMode = false;
    }
    if (ua) {
      _bowser = detect(ua);
    }

    var version = "" + _bowser.version;
    for (var browser in minVersions) {
      if (minVersions.hasOwnProperty(browser)) {
        if (_bowser[browser]) {
          if (typeof minVersions[browser] !== 'string') {
            throw new Error('Browser version in the minVersion map should be a string: ' + browser + ': ' + String(minVersions));
          }

          // browser version and min supported version.
          return compareVersions([version, minVersions[browser]]) < 0;
        }
      }
    }

    return strictMode; // not found
  }

  /**
   * Check if browser is supported
   *
   * @param  {Object} minVersions map of minimal version to browser
   * @param  {Boolean} [strictMode = false] flag to return false if browser wasn't found in map
   * @param  {String}  [ua] user agent string
   * @return {Boolean}
   */
  function check(minVersions, strictMode, ua) {
    return !isUnsupportedBrowser(minVersions, strictMode, ua);
  }

  bowser.isUnsupportedBrowser = isUnsupportedBrowser;
  bowser.compareVersions = compareVersions;
  bowser.check = check;

  /*
   * Set our detect method to the main bowser object so we can
   * reuse it to test other user agents.
   * This is needed to implement future tests.
   */
  bowser._detect = detect;

  return bowser
});
});

/**
 * @namespace Utils
 */
/**
 * Generates a random string
 *
 * @memberof Utils
 * @param {Number} radix - The radix to use. Defaults to `18`
 * @return {String}
 *
 */
function generateRandomString() {
  return Math.random().toString(18).slice(2);
}

var generateRandomString_1 = generateRandomString;

/**
 * Generates a random UUID
 *
 * @memberof Utils
 * @return {String}
 *
 */
function generateRandomUUID() {
  var base = '' + generateRandomString() + generateRandomString();
  return base.substring(0, 8) + '-' + base.substring(9, 13) + '-' + base.substring(14, 18) + '-' + base.substring(19, 23) + '-' + base.substring(24, 36);
}

var generateRandomUUID_1 = generateRandomUUID;

/**
 * Strips Bearer from Authorization header
 *
 * @memberof Utils
 * @param {String} header - The Authorization header to strip
 * @return {String}
 *
 */
function stripBearer(header) {
  return ('' + header).replace('Bearer', '').trim();
}

var stripBearer_1 = stripBearer;

/**
 * Returns error message for `errorCode`
 *
 * @private
 * @memberof Utils
 * @param {String} body - The `body` response to parse
 * @param {String} body.error - The error code to use for mapping
 * @param {String} body.error_description - The optional error description to show
 * @return {String}
 *
 */
var extractErrorMessage = function extractErrorMessage(body) {
  switch (body.error) {
    case 'validation_failed':
      return 'Validation failed: ' + body.error_description;
    case 'not_found':
      return 'Not found';
    case 'forbidden_resource':
      return 'Forbidden resource';
    case 'access_denied':
      return 'The resource owner or authorization server denied the request';
    case 'unsupported_grant_type':
      return 'The authorization grant type is not supported';
    case 'invalid_grant':
      return 'Invalid credentials';
    case 'unauthorized_request':
      return 'Unauthorized request';
    case 'unauthorized_client':
      return 'The authenticated client is not authorized';
    case 'invalid_token':
      return 'The access token provided is expired, revoked, malformed, or invalid';
    case 'invalid_scope':
      return 'The requested scope is invalid, unknown, or malformed';
    case 'invalid_client':
      return 'Client authentication failed';
    case 'invalid_request':
      return 'The request is missing a required parameter';
    default:
      return 'Unexpected error';
  }
};

var extractErrorMessage_1 = extractErrorMessage;

/**
 * Transforms errors to JSONAPI format
 * @memberof Utils
 * @param {String} body - The body of the response
 * @params {String} status - Response http status
 * @return {Object} JSONAPI formatted error object
 */
var transformError = function transformError(body) {
  var status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;

  if (body.meta) {
    return {
      meta: {
        httpStatus: parseInt(status, 10),
        logref: body.meta.logref || 'unknown_error',
        message: body.meta.message || 'Unexpected error'
      }
    };
  }
  return {
    meta: {
      httpStatus: parseInt(status, 10),
      logref: body.error || 'unknown_error',
      message: extractErrorMessage(body)
    }
  };
};

var transformError_1 = transformError;

/**
 * Validates a password pair agains the following rules:
 * - Password cannot contain spaces
 * - Password must contain both numbers and characters
 * - Password must be at least 8 characters long
 *
 * @memberof Utils
 * @param {String} password - The `password` to validate
 * @return {Object} Contains `isValid {Boolean}` and `message {String}`
 *
 */
var validatePassword = function validatePassword(password) {
  var containsSpaces = /\s/i.test(password);
  var containsNumber = /\d/i.test(password);
  var containsCharacters = /[a-z]/i.test(password);
  if (containsSpaces) {
    return {
      message: 'Password cannot contain spaces',
      isValid: false
    };
  }
  if (!containsNumber || !containsCharacters) {
    return {
      message: 'Password must contain both numbers and characters',
      isValid: false
    };
  }
  if (password.length < 8) {
    return {
      message: 'Password must be at least 8 characters long',
      isValid: false
    };
  }
  return {
    isValid: true
  };
};

var validatePassword_1 = validatePassword;

/**
 * Extracts loginToken from URL
 *
 * @memberof Utils
 * @return {String} url - The URL to
 *
 */
var extractLoginTokenFromURL$1 = function extractLoginTokenFromURL(url) {
  try {
    var params = decodeURIComponent(url).split('?')[1].split('&');
    return params.find(function (param) {
      return String(param).includes('loginToken');
    }).replace('loginToken=', '');
  } catch (err) {
    return '';
  }
};

var extractLoginTokenFromURL_1 = extractLoginTokenFromURL$1;

/**
 * Returns browser name
 *
 * @memberof Utils
 * @return {String} name - The browser name
 *
 */
var retrieveBrowserName$1 = function retrieveBrowserName() {
  var lookupMap = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : bowser;
  return lookupMap.name;
};

var retrieveBrowserName_1 = retrieveBrowserName$1;

/* istanbul ignore next */

/**
 * Wrapper around window.location.assign()
 *
 * @memberof Utils
 * @param {String} url - The url to redirect to
 * @return {Void}
 *
 */
var redirectToURL = function redirectToURL(url) {
  window.location.assign(url);
};

var redirectToURL_1 = redirectToURL;

/* istanbul ignore next */

/**
 * Wrapper around window.location.href
 *
 * @memberof Utils
 * @return {String}
 *
 */
var retrieveURL$1 = function retrieveURL() {
  return window.location.href;
};

var retrieveURL_1 = retrieveURL$1;

var index$4 = {
  generateRandomString: generateRandomString_1,
  generateRandomUUID: generateRandomUUID_1,
  stripBearer: stripBearer_1,
  extractErrorMessage: extractErrorMessage_1,
  transformError: transformError_1,
  validatePassword: validatePassword_1,
  extractLoginTokenFromURL: extractLoginTokenFromURL_1,
  retrieveBrowserName: retrieveBrowserName_1,
  redirectToURL: redirectToURL_1,
  retrieveURL: retrieveURL_1
};

var retrieveBrowserName = index$4.retrieveBrowserName;
var extractLoginTokenFromURL = index$4.extractLoginTokenFromURL;
var retrieveURL = index$4.retrieveURL;

/**
 * Determines if browser supports cross storage
 * @ignore
 */
var supportsCrossStorage = retrieveBrowserName() !== 'Safari';

/**
 * @class Store
 */

var Store = function () {

  /**
   * Initializes Store
   *
   * @constructor
   * @param {String} domain - The domain under which all values will be attached
   * @param {String} iframeHub - The iframe URL where all the values will be attached
   * @param {Object} iframeHub - The iframe URL where all the values will be attached
   * @param {Class} StorageClientClass - The CrossStorageClient Class to be instantiated
   * @param {Boolean} isCrossStorageAvailable - Flaf that determines if cross storage canb be used or not
   * @param {Function} retrieveURLFn - The function that returns the current URL
   * @return {Store}
   *
   */
  function Store(domain, iframeHub) {
    var HubStorageClientClass = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : hubStorageClient;
    var isCrossStorageAvailable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : supportsCrossStorage;
    var retrieveURLFn = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : retrieveURL;
    classCallCheck(this, Store);

    assert(domain, 'Missing `domain`');
    assert(iframeHub, 'Missing `iframeHub`');
    this._domain = domain;
    this._iframeHub = iframeHub;
    this._hubStorage = new HubStorageClientClass(iframeHub);
    this._isCrossStorageAvailable = isCrossStorageAvailable;
    this._retrieveURLFn = retrieveURLFn;
  }

  /**
   * Normalizes key based on domain
   *
   * @private
   * @param {String} key - The key to use
   * @return {String} The normalized key
   *
   */


  createClass(Store, [{
    key: '_normalizeKey',
    value: function _normalizeKey(key) {
      return this._domain + '_' + key;
    }

    /**
     * Detrmines if Store supports cross storage
     *
     * @return {Boolean} value
     *
     */

  }, {
    key: 'supportsCrossStorage',
    value: function supportsCrossStorage() {
      return this._isCrossStorageAvailable;
    }

    /**
     * Retieves token
     *
     * @return {Promise}
     *
     */

  }, {
    key: 'retriveToken',
    value: function retriveToken() {
      if (this._isCrossStorageAvailable) {
        return this.get('access_token');
      }
      return Promise.resolve(extractLoginTokenFromURL(this._retrieveURLFn()));
    }

    /**
     * Sets value for a key
     *
     * @param {String} key - The key to use
     * @param {String} value - The value to set
     *
     */

  }, {
    key: 'set',
    value: function set$$1(key, value) {
      return this._hubStorage.set(this._normalizeKey(key), value);
    }

    /**
     * Returns value for a stored key
     *
     * @param {String} key - The key to use
     * @return {String}
     *
     */

  }, {
    key: 'get',
    value: function get$$1(key) {
      return this._hubStorage.get(this._normalizeKey(key));
    }

    /**
     * Removes one or multiple value pair if they exists
     *
     * @param {String|Array} keys - The key(s) to use
     *
     */

  }, {
    key: 'remove',
    value: function remove() {
      var _this = this,
          _hubStorage;

      for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
        keys[_key] = arguments[_key];
      }

      var normalizedKeys = keys.map(function (key) {
        return _this._normalizeKey(key);
      });
      return (_hubStorage = this._hubStorage).del.apply(_hubStorage, toConsumableArray(normalizedKeys));
    }
  }]);
  return Store;
}();

var store = Store;

var utils = createCommonjsModule(function (module, exports) {
'use strict';

var has = Object.prototype.hasOwnProperty;

var hexTable = (function () {
    var array = [];
    for (var i = 0; i < 256; ++i) {
        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
    }

    return array;
}());

exports.arrayToObject = function (source, options) {
    var obj = options && options.plainObjects ? Object.create(null) : {};
    for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== 'undefined') {
            obj[i] = source[i];
        }
    }

    return obj;
};

exports.merge = function (target, source, options) {
    if (!source) {
        return target;
    }

    if (typeof source !== 'object') {
        if (Array.isArray(target)) {
            target.push(source);
        } else if (typeof target === 'object') {
            target[source] = true;
        } else {
            return [target, source];
        }

        return target;
    }

    if (typeof target !== 'object') {
        return [target].concat(source);
    }

    var mergeTarget = target;
    if (Array.isArray(target) && !Array.isArray(source)) {
        mergeTarget = exports.arrayToObject(target, options);
    }

    if (Array.isArray(target) && Array.isArray(source)) {
        source.forEach(function (item, i) {
            if (has.call(target, i)) {
                if (target[i] && typeof target[i] === 'object') {
                    target[i] = exports.merge(target[i], item, options);
                } else {
                    target.push(item);
                }
            } else {
                target[i] = item;
            }
        });
        return target;
    }

    return Object.keys(source).reduce(function (acc, key) {
        var value = source[key];

        if (Object.prototype.hasOwnProperty.call(acc, key)) {
            acc[key] = exports.merge(acc[key], value, options);
        } else {
            acc[key] = value;
        }
        return acc;
    }, mergeTarget);
};

exports.decode = function (str) {
    try {
        return decodeURIComponent(str.replace(/\+/g, ' '));
    } catch (e) {
        return str;
    }
};

exports.encode = function (str) {
    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }

    var string = typeof str === 'string' ? str : String(str);

    var out = '';
    for (var i = 0; i < string.length; ++i) {
        var c = string.charCodeAt(i);

        if (
            c === 0x2D || // -
            c === 0x2E || // .
            c === 0x5F || // _
            c === 0x7E || // ~
            (c >= 0x30 && c <= 0x39) || // 0-9
            (c >= 0x41 && c <= 0x5A) || // a-z
            (c >= 0x61 && c <= 0x7A) // A-Z
        ) {
            out += string.charAt(i);
            continue;
        }

        if (c < 0x80) {
            out = out + hexTable[c];
            continue;
        }

        if (c < 0x800) {
            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        if (c < 0xD800 || c >= 0xE000) {
            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        i += 1;
        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
        out += hexTable[0xF0 | (c >> 18)] + hexTable[0x80 | ((c >> 12) & 0x3F)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)];
    }

    return out;
};

exports.compact = function (obj, references) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    var refs = references || [];
    var lookup = refs.indexOf(obj);
    if (lookup !== -1) {
        return refs[lookup];
    }

    refs.push(obj);

    if (Array.isArray(obj)) {
        var compacted = [];

        for (var i = 0; i < obj.length; ++i) {
            if (obj[i] && typeof obj[i] === 'object') {
                compacted.push(exports.compact(obj[i], refs));
            } else if (typeof obj[i] !== 'undefined') {
                compacted.push(obj[i]);
            }
        }

        return compacted;
    }

    var keys = Object.keys(obj);
    keys.forEach(function (key) {
        obj[key] = exports.compact(obj[key], refs);
    });

    return obj;
};

exports.isRegExp = function (obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

exports.isBuffer = function (obj) {
    if (obj === null || typeof obj === 'undefined') {
        return false;
    }

    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};
});

var replace = String.prototype.replace;
var percentTwenties = /%20/g;

var formats = {
    'default': 'RFC3986',
    formatters: {
        RFC1738: function (value) {
            return replace.call(value, percentTwenties, '+');
        },
        RFC3986: function (value) {
            return value;
        }
    },
    RFC1738: 'RFC1738',
    RFC3986: 'RFC3986'
};

var arrayPrefixGenerators = {
    brackets: function brackets(prefix) {
        return prefix + '[]';
    },
    indices: function indices(prefix, key) {
        return prefix + '[' + key + ']';
    },
    repeat: function repeat(prefix) {
        return prefix;
    }
};

var toISO = Date.prototype.toISOString;

var defaults$1 = {
    delimiter: '&',
    encode: true,
    encoder: utils.encode,
    serializeDate: function serializeDate(date) {
        return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
};

var stringify = function stringify(object, prefix, generateArrayPrefix, strictNullHandling, skipNulls, encoder, filter, sort, allowDots, serializeDate, formatter) {
    var obj = object;
    if (typeof filter === 'function') {
        obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
        obj = serializeDate(obj);
    } else if (obj === null) {
        if (strictNullHandling) {
            return encoder ? encoder(prefix) : prefix;
        }

        obj = '';
    }

    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || utils.isBuffer(obj)) {
        if (encoder) {
            return [formatter(encoder(prefix)) + '=' + formatter(encoder(obj))];
        }
        return [formatter(prefix) + '=' + formatter(String(obj))];
    }

    var values = [];

    if (typeof obj === 'undefined') {
        return values;
    }

    var objKeys;
    if (Array.isArray(filter)) {
        objKeys = filter;
    } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (skipNulls && obj[key] === null) {
            continue;
        }

        if (Array.isArray(obj)) {
            values = values.concat(stringify(
                obj[key],
                generateArrayPrefix(prefix, key),
                generateArrayPrefix,
                strictNullHandling,
                skipNulls,
                encoder,
                filter,
                sort,
                allowDots,
                serializeDate,
                formatter
            ));
        } else {
            values = values.concat(stringify(
                obj[key],
                prefix + (allowDots ? '.' + key : '[' + key + ']'),
                generateArrayPrefix,
                strictNullHandling,
                skipNulls,
                encoder,
                filter,
                sort,
                allowDots,
                serializeDate,
                formatter
            ));
        }
    }

    return values;
};

var stringify_1 = function (object, opts) {
    var obj = object;
    var options = opts || {};
    var delimiter = typeof options.delimiter === 'undefined' ? defaults$1.delimiter : options.delimiter;
    var strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults$1.strictNullHandling;
    var skipNulls = typeof options.skipNulls === 'boolean' ? options.skipNulls : defaults$1.skipNulls;
    var encode = typeof options.encode === 'boolean' ? options.encode : defaults$1.encode;
    var encoder = encode ? (typeof options.encoder === 'function' ? options.encoder : defaults$1.encoder) : null;
    var sort = typeof options.sort === 'function' ? options.sort : null;
    var allowDots = typeof options.allowDots === 'undefined' ? false : options.allowDots;
    var serializeDate = typeof options.serializeDate === 'function' ? options.serializeDate : defaults$1.serializeDate;
    if (typeof options.format === 'undefined') {
        options.format = formats.default;
    } else if (!Object.prototype.hasOwnProperty.call(formats.formatters, options.format)) {
        throw new TypeError('Unknown format option provided.');
    }
    var formatter = formats.formatters[options.format];
    var objKeys;
    var filter;

    if (options.encoder !== null && options.encoder !== undefined && typeof options.encoder !== 'function') {
        throw new TypeError('Encoder has to be a function.');
    }

    if (typeof options.filter === 'function') {
        filter = options.filter;
        obj = filter('', obj);
    } else if (Array.isArray(options.filter)) {
        filter = options.filter;
        objKeys = filter;
    }

    var keys = [];

    if (typeof obj !== 'object' || obj === null) {
        return '';
    }

    var arrayFormat;
    if (options.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = options.arrayFormat;
    } else if ('indices' in options) {
        arrayFormat = options.indices ? 'indices' : 'repeat';
    } else {
        arrayFormat = 'indices';
    }

    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

    if (!objKeys) {
        objKeys = Object.keys(obj);
    }

    if (sort) {
        objKeys.sort(sort);
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (skipNulls && obj[key] === null) {
            continue;
        }

        keys = keys.concat(stringify(
            obj[key],
            key,
            generateArrayPrefix,
            strictNullHandling,
            skipNulls,
            encoder,
            filter,
            sort,
            allowDots,
            serializeDate,
            formatter
        ));
    }

    return keys.join(delimiter);
};

var has = Object.prototype.hasOwnProperty;

var defaults$2 = {
    allowDots: false,
    allowPrototypes: false,
    arrayLimit: 20,
    decoder: utils.decode,
    delimiter: '&',
    depth: 5,
    parameterLimit: 1000,
    plainObjects: false,
    strictNullHandling: false
};

var parseValues = function parseValues(str, options) {
    var obj = {};
    var parts = str.split(options.delimiter, options.parameterLimit === Infinity ? undefined : options.parameterLimit);

    for (var i = 0; i < parts.length; ++i) {
        var part = parts[i];
        var pos = part.indexOf(']=') === -1 ? part.indexOf('=') : part.indexOf(']=') + 1;

        var key, val;
        if (pos === -1) {
            key = options.decoder(part);
            val = options.strictNullHandling ? null : '';
        } else {
            key = options.decoder(part.slice(0, pos));
            val = options.decoder(part.slice(pos + 1));
        }
        if (has.call(obj, key)) {
            obj[key] = [].concat(obj[key]).concat(val);
        } else {
            obj[key] = val;
        }
    }

    return obj;
};

var parseObject = function parseObject(chain, val, options) {
    if (!chain.length) {
        return val;
    }

    var root = chain.shift();

    var obj;
    if (root === '[]') {
        obj = [];
        obj = obj.concat(parseObject(chain, val, options));
    } else {
        obj = options.plainObjects ? Object.create(null) : {};
        var cleanRoot = root[0] === '[' && root[root.length - 1] === ']' ? root.slice(1, root.length - 1) : root;
        var index = parseInt(cleanRoot, 10);
        if (
            !isNaN(index) &&
            root !== cleanRoot &&
            String(index) === cleanRoot &&
            index >= 0 &&
            (options.parseArrays && index <= options.arrayLimit)
        ) {
            obj = [];
            obj[index] = parseObject(chain, val, options);
        } else {
            obj[cleanRoot] = parseObject(chain, val, options);
        }
    }

    return obj;
};

var parseKeys = function parseKeys(givenKey, val, options) {
    if (!givenKey) {
        return;
    }

    // Transform dot notation to bracket notation
    var key = options.allowDots ? givenKey.replace(/\.([^\.\[]+)/g, '[$1]') : givenKey;

    // The regex chunks

    var parent = /^([^\[\]]*)/;
    var child = /(\[[^\[\]]*\])/g;

    // Get the parent

    var segment = parent.exec(key);

    // Stash the parent if it exists

    var keys = [];
    if (segment[1]) {
        // If we aren't using plain objects, optionally prefix keys
        // that would overwrite object prototype properties
        if (!options.plainObjects && has.call(Object.prototype, segment[1])) {
            if (!options.allowPrototypes) {
                return;
            }
        }

        keys.push(segment[1]);
    }

    // Loop through children appending to the array until we hit depth

    var i = 0;
    while ((segment = child.exec(key)) !== null && i < options.depth) {
        i += 1;
        if (!options.plainObjects && has.call(Object.prototype, segment[1].replace(/\[|\]/g, ''))) {
            if (!options.allowPrototypes) {
                continue;
            }
        }
        keys.push(segment[1]);
    }

    // If there's a remainder, just add whatever is left

    if (segment) {
        keys.push('[' + key.slice(segment.index) + ']');
    }

    return parseObject(keys, val, options);
};

var parse = function (str, opts) {
    var options = opts || {};

    if (options.decoder !== null && options.decoder !== undefined && typeof options.decoder !== 'function') {
        throw new TypeError('Decoder has to be a function.');
    }

    options.delimiter = typeof options.delimiter === 'string' || utils.isRegExp(options.delimiter) ? options.delimiter : defaults$2.delimiter;
    options.depth = typeof options.depth === 'number' ? options.depth : defaults$2.depth;
    options.arrayLimit = typeof options.arrayLimit === 'number' ? options.arrayLimit : defaults$2.arrayLimit;
    options.parseArrays = options.parseArrays !== false;
    options.decoder = typeof options.decoder === 'function' ? options.decoder : defaults$2.decoder;
    options.allowDots = typeof options.allowDots === 'boolean' ? options.allowDots : defaults$2.allowDots;
    options.plainObjects = typeof options.plainObjects === 'boolean' ? options.plainObjects : defaults$2.plainObjects;
    options.allowPrototypes = typeof options.allowPrototypes === 'boolean' ? options.allowPrototypes : defaults$2.allowPrototypes;
    options.parameterLimit = typeof options.parameterLimit === 'number' ? options.parameterLimit : defaults$2.parameterLimit;
    options.strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults$2.strictNullHandling;

    if (str === '' || str === null || typeof str === 'undefined') {
        return options.plainObjects ? Object.create(null) : {};
    }

    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
    var obj = options.plainObjects ? Object.create(null) : {};

    // Iterate over the keys and setup the new object

    var keys = Object.keys(tempObj);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options);
        obj = utils.merge(obj, newObj, options);
    }

    return utils.compact(obj);
};

var index$6 = {
    formats: formats,
    parse: parse,
    stringify: stringify_1
};

/**
 * @class Client
 */

var Client = function () {

  /**
   * Initializes Client
   *
   * @constructor
   * @param {String} id - The Client id
   * @param {String} secret - The Client secret
   * @return {Client}
   *
   */
  function Client(id, secret) {
    classCallCheck(this, Client);

    assert(id, 'Missing `id`');
    assert(secret, 'Missing `secret`');
    this._id = id;
    this._secret = secret;
  }

  /**
   * Returns Client id
   *
   * @return {String}
   *
   */


  createClass(Client, [{
    key: 'id',
    get: function get$$1() {
      return this._id;
    }

    /**
     * Returns Client secret
     *
     * @return {String}
     *
     */

  }, {
    key: 'secret',
    get: function get$$1() {
      return this._secret;
    }
  }]);
  return Client;
}();

var client$2 = Client;

/**
 * @class Production API
 */
var ProductionAPI$1 = function () {

  /**
   * Initializes ProductionAPI
   *
   * @constructor
   * @param {String} endpoint - The host endpoint
   * @param {Object} fetchFn - The function to use for fetching the data - Defaults to window.fetch
   * @return {ProductionAPI}
   */
  function ProductionAPI(endpoint) {
    var fetchFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
      var _window;

      return (_window = window).fetch.apply(_window, arguments);
    };
    classCallCheck(this, ProductionAPI);

    this._endpoint = endpoint;
    this._fetchFn = fetchFn;
  }

  /**
   *
   * Propagates invoke call to _fetchFn
   * @param {String} resource - The resource to fetch from
   * @param {Object} payload - The payload to pass
   * @return {Promise}
   *
   */


  createClass(ProductionAPI, [{
    key: "invoke",
    value: function invoke(resource, payload) {
      var status = 0;
      return this._fetchFn(this._endpoint + "/" + resource, payload).then(function (res) {
        status = res.status;
        if (status !== 204) {
          return res.json();
        }
        return Promise.resolve({});
      }).then(function (body) {
        return { body: body, status: status };
      });
    }
  }]);
  return ProductionAPI;
}();

var production = ProductionAPI$1;

var stripBearer$1 = index$4.stripBearer;

/**
 * Generates an HTTP response object
 *
 * @private
 * @return {Object}
 *
 */
var response = function response() {
  var status = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 200;
  var body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return Promise.resolve({
    status: status,
    body: body
  });
};

/**
 * @class Sandbox API
 */

var SandboxAPI$1 = function () {
  createClass(SandboxAPI, null, [{
    key: 'resources',


    /**
     * Maps API resources to response objects
     *
     * @private
     *
     */
    get: function get$$1() {
      return {
        /**
         * Maps `/users` resource
         *
         * @private
         *
         */
        users: {
          GET: function GET(database, id, body, headers) {
            var token = stripBearer$1(headers.Authorization);
            if (!database.hasUserWithToken(token)) {
              return response(404, { error: 'not_found' });
            }
            return response(200, database.getUserWithToken(token));
          },
          POST: function POST(database, id, body) {
            var _JSON$parse = JSON.parse(body),
                email = _JSON$parse.email,
                password = _JSON$parse.password,
                first_name = _JSON$parse.first_name,
                last_name = _JSON$parse.last_name;

            if (database.hasUserWithData(email, password)) {
              return response(400, { error: 'validation_failed' });
            }
            var newUser = database.addUser(email, password, first_name, last_name);
            return response(201, newUser);
          },
          PATCH: function PATCH(database, id, body, headers) {
            var token = stripBearer$1(headers.Authorization);

            var _JSON$parse2 = JSON.parse(body),
                first_name = _JSON$parse2.first_name,
                last_name = _JSON$parse2.last_name;

            if (database.getUserWithToken(token) !== database.getUserWithId(id)) {
              return response(400, { error: 'invalid_grant' });
            }
            var patchedUser = database.updateUser(id, first_name, last_name);
            return response(200, patchedUser);
          }
        },
        /**
         * Maps `/token` resource
         *
         * @see https://tools.ietf.org/html/rfc6749
         * @private
         *
         */
        token: {
          POST: function POST(database, id, body) {
            var decodedBody = index$6.parse(body);
            var grant_type = decodedBody.grant_type,
                username = decodedBody.username,
                password = decodedBody.password,
                refresh_token = decodedBody.refresh_token;

            if (grant_type === 'password') {
              if (!database.hasUserWithData(username, password)) {
                return response(404, { error: 'not_found' });
              }
              var user = database.getUserWithData(username, password);
              return response(200, database.getTokenFor(user.id));
            }
            /* istanbul ignore if */
            if (grant_type === 'refresh_token') {
              if (!database.hasTokenWithRefresh(refresh_token)) {
                return response(400, { error: 'invalid_token' });
              }
              var refreshedToken = database.updateToken(refresh_token);
              return response(200, refreshedToken);
            }
            return response(404, { error: 'unexpected_error' });
          }
        },
        /**
         * Maps `/passwords` resource
         *
         * @private
         *
         */
        passwords: {
          POST: function POST(database, id, body) {
            var _JSON$parse3 = JSON.parse(body),
                email = _JSON$parse3.email;

            if (!database.hasUserWithEmail(email)) {
              return response(404, { error: 'not_found' });
            }
            return response();
          },
          PUT: function PUT(database, id) {
            if (!database.hasPasswordResetToken(id)) {
              return response(404, { error: 'not_found' });
            }
            return response();
          }
        },
        /**
         * Maps `/confirmations` resource
         *
         * @private
         *
         */
        confirmations: {
          GET: function GET(database, id) {
            var c = database.getConfirmationById(id);
            return c ? response(200, c) : response(404, { error: 'not_found' });
          },
          PUT: function PUT(database, id) {
            return database.getConfirmationById(id) ? response(204) : response(404, { error: 'not_found' });
          },
          POST: function POST(database, id, body) {
            var _JSON$parse4 = JSON.parse(body),
                email = _JSON$parse4.email;

            return database.hasUserWithEmail(email) ? response(201) : response(404, { error: 'not_found' });
          }
        }
      };
    }

    /**
     * Initializes SandboxAPI
     *
     * @constructor
     * @param {SandboxDatabase} database - The database to use for storing sesssion changes
     * @return {SandboxAPI}
     *
     */

  }]);

  function SandboxAPI(database) {
    classCallCheck(this, SandboxAPI);

    this._database = database;
  }

  /**
   * Stubs API calls
   *
   * @param {String} resource - The resource to fetch from
   * @param {Object} payload - The paylod to propagate
   *
   * @return {Promise}
   */


  createClass(SandboxAPI, [{
    key: 'invoke',
    value: function invoke(resource, payload) {
      var _resource$split = resource.split('/'),
          _resource$split2 = slicedToArray(_resource$split, 2),
          route = _resource$split2[0],
          id = _resource$split2[1];

      var method = payload.method,
          body = payload.body,
          headers = payload.headers;

      return SandboxAPI.resources[route][method](this._database, id, body, headers);
    }
  }]);
  return SandboxAPI;
}();

var sandbox = SandboxAPI$1;

var Production = production;
var Sandbox = sandbox;

var index$8 = {
	Production: Production,
	Sandbox: Sandbox
};

var ProductionAPI = index$8.Production;
var SandboxAPI = index$8.Sandbox;
var transformError$1 = index$4.transformError;

/**
 * @class Consumer
 */

var Consumer = function () {

  /**
   * Initializes Consumer
   *
   * @constructor
   * @param {Client} client - The Client instance to use
   * @param {API.Production|API.Sandbox} api - The api to use for fetching data
   * @return {Consumer}
   *
   */
  function Consumer(client, api) {
    classCallCheck(this, Consumer);

    assert(client instanceof client$2, '`client` should be instance of Client');
    assert(api instanceof ProductionAPI || api instanceof SandboxAPI, '`api` should be instance of API.Production or API.Sandbox');
    this._client = client;
    this._api = api;
  }

  /**
   * Returns data from API
   *
   * @private
   * @param {String} resource - The resource to fetch from
   * @param {Object} payload - The payload to pass
   * @return {Promise}
   *
   */


  createClass(Consumer, [{
    key: '_request',
    value: function _request(resource, payload) {
      return this._api.invoke(resource, payload).then(function (res) {
        var status = res.status,
            body = res.body;

        if (parseInt(status, 10) >= 400) {
          throw transformError$1(body, status);
        }
        return body;
      });
    }

    /**
     * Retrieves token from a username-password combination
     *
     * @param {String} username - The username to use
     * @param {String} password - The password to use
     * @return {Promise}
     *
     */

  }, {
    key: 'retrieveToken',
    value: function retrieveToken(username, password) {
      var grant_type = 'password';
      return this._request('token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: this._formEncode({
          username: username,
          password: password,
          grant_type: grant_type,
          client_id: this._client.id,
          client_secret: this._client.secret
        })
      });
    }

    /**
     * Returns a renewed token
     *
     * @param {String} refreshToken - The refresh token to use
     * @return {Promise}
     *
     */

  }, {
    key: 'refreshToken',
    value: function refreshToken(_refreshToken) {
      var grant_type = 'refresh_token';
      return this._request('token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: this._formEncode({
          refresh_token: _refreshToken,
          grant_type: grant_type,
          client_id: this._client.id,
          client_secret: this._client.secret
        })
      });
    }

    /**
     * Returns a url encoded string
     *
     * @param {Object} obj - Object to stringify
     * @return {String}
     *
     */

  }, {
    key: '_formEncode',
    value: function _formEncode(obj) {
      return index$6.stringify(obj);
    }

    /**
     * Returns a json encoded string
     *
     * @param {Object} obj - Object to stringify
     * @return {String}
     *
     */

  }, {
    key: '_jsonEncode',
    value: function _jsonEncode(obj) {
      return JSON.stringify(obj);
    }

    /**
     * Creates a new User
     *
     * @param {String} email - The email to use
     * @param {String} password - The password to use
     * @param {String} firstName - The first name to use
     * @param {String} lastName - The last name to use
     * @return {Promise}
     *
     */

  }, {
    key: 'createUser',
    value: function createUser(email, password, firstName, lastName) {
      return this._request('users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: this._jsonEncode({
          email: email,
          password: password,
          first_name: firstName,
          last_name: lastName
        })
      });
    }

    /**
     * Retrives a User
     *
     * @param {String} token - The `Bearer` token
     * @return {Promise}
     *
     */

  }, {
    key: 'retrieveUser',
    value: function retrieveUser(token) {
      return this._request('users/me', {
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        method: 'GET'
      });
    }

    /**
     * Updates a User
     *
     * @param {String} userId - The User id
     * @param {String} token - The `Bearer` token
     * @param {String} options.firstName - The first ame to use
     * @param {String} options.lastName - The last name to use
     * @return {Promise}
     *
     */

  }, {
    key: 'updateUser',
    value: function updateUser(userId, token, options) {
      return this._request('users/' + userId, {
        method: 'PATCH',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: this._jsonEncode({
          first_name: options.firstName,
          last_name: options.lastName,
          last_login: options.lastLogin
        })
      });
    }

    /**
     * Requests for a password reset
     *
     * @param {String} email - The email to forward the reset token to
     * @return {Promise}
     *
     */

  }, {
    key: 'requestPasswordReset',
    value: function requestPasswordReset(email) {
      return this._request('passwords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: this._jsonEncode({
          email: email
        })
      });
    }

    /**
     * Resets password
     *
     * @param {String} token - The reset token to use
     * @param {String} password - The new password
     * @return {Promise}
     *
     */

  }, {
    key: 'resetPassword',
    value: function resetPassword(token, password) {
      return this._request('passwords/' + token, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: this._jsonEncode({
          password: password
        })
      });
    }

    /**
     * Fetches a confirmation token
     * @param {String} token - The token uuid
     * @return {Promise}
     */

  }, {
    key: 'getConfirmationToken',
    value: function getConfirmationToken(token) {
      return this._request('confirmations/' + token, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    /**
     * Updates user confirmation
     * @param {String} token - The token uuid
     * @return {Promise}
     */

  }, {
    key: 'updateConfirmation',
    value: function updateConfirmation(token) {
      return this._request('confirmations/' + token, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    /**
     * Creates new user confirmation (Resend Confirmation Email)
     * @param {String} email - User email
     * @return {Promise}
     */

  }, {
    key: 'createConfirmation',
    value: function createConfirmation(email) {
      return this._request('confirmations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
      });
    }
  }]);
  return Consumer;
}();

var consumer = Consumer;

var validatePassword$1 = index$4.validatePassword;

/**
 * @class User
 */

var User = function () {

  /**
   * Initializes User
   *
   * @constructor
   * @param {Store} store - The Store instance to use
   * @param {Consumer} consumer - The Consumer instance to use
   * @return {User}
   *
   */
  function User(store$$1, consumer$$1) {
    classCallCheck(this, User);

    assert(store$$1 instanceof store, '`store` should be instance of Store');
    assert(consumer$$1 instanceof consumer, '`consumer` should be instance of Consumer');
    this._store = store$$1;
    this._consumer = consumer$$1;
    this._roles = [];
    this._bearer = undefined;
    this._id = undefined;
    this._publisherId = undefined;
    this._firstName = undefined;
    this._lastName = undefined;
    this._email = undefined;
    this._isDirty = false;
  }

  /**
   * Returns User id
   *
   * @return {String} [read-only] id
   *
   */


  createClass(User, [{
    key: 'syncWithStore',


    /**
     * Syncs User data from Store
     * - Currently on bearer is synced to Store
     * - Store priority proceeds dirty data
     *
     * @return {Promise}
     *
     */
    value: function syncWithStore() {
      var _this = this;

      var bearer = void 0;
      return this._store.retriveToken().then(function (accessToken) {
        // Cache bearer
        bearer = accessToken;
        return _this._consumer.retrieveUser(accessToken);
      }).then(function (data) {
        _this._id = data.id;
        _this._publisherId = data.publisher_id;
        _this._email = data.email;
        _this._firstName = data.first_name;
        _this._lastName = data.last_name;
        _this._roles = data.roles;
        _this._bearer = bearer;
        _this._isDirty = false;
        return Promise.resolve({
          data: data,
          message: 'Synced User model with Store'
        });
      });
    }

    /**
     * Updates User data
     *
     * @return {Promise}
     *
     */

  }, {
    key: 'save',
    value: function save() {
      var _this2 = this;

      if (!this._id) {
        return Promise.reject(new Error('Cannot save a non-existent User'));
      }
      if (!this._isDirty) {
        return Promise.resolve({
          message: 'No User model changes to sync'
        });
      }
      return this._consumer.updateUser(this._id, this._bearer, {
        firstName: this._firstName,
        lastName: this._lastName,
        lastLogin: this._lastLogin
      }).then(function () {
        _this2._isDirty = false;
        return Promise.resolve({
          message: 'Updated User model'
        });
      });
    }

    /**
     * Creates a new User
     *
     * @param {String} email - The email to set
     * @param {String} password - The password to set
     * @param {String} firstName - The first name to set
     * @param {String} lastName - The last name to set
     * @return {Promise}
     *
     */

  }, {
    key: 'create',
    value: function create(email, password, firstName, lastName) {
      var _this3 = this;

      assert(email, 'Missing `email`');
      assert(password, 'Missing `password`');

      var _validatePassword = validatePassword$1(password),
          isValid = _validatePassword.isValid,
          message = _validatePassword.message;

      if (!isValid) {
        return Promise.reject(new Error(message));
      }
      return this._consumer.createUser(email, password, firstName, lastName).then(function (data) {
        _this3._id = data.id;
        _this3._publisherId = data.publisher_id;
        _this3._firstName = data.first_name;
        _this3._lastName = data.last_name;
        _this3._roles = data.roles;
        _this3._email = data.email;
        _this3._isDirty = false;
        return {
          data: data,
          message: 'Created User'
        };
      });
    }

    /**
     * Retrieves authentication tokens for a username-password combination
     *
     * @param {String} username - The username to use
     * @param {String} password - The password to use
     * @return {Promise}
     *
     */

  }, {
    key: 'authenticate',
    value: function authenticate(username, password) {
      var _this4 = this;

      assert(username, 'Missing `username`');
      assert(password, 'Missing `password`');
      var bearer = void 0;
      return this._consumer.retrieveToken(username, password).then(function (res) {
        var access_token = res.access_token,
            refresh_token = res.refresh_token;
        // Cache bearer

        bearer = access_token;
        // Store tokens
        return _this4._store.set('access_token', access_token).then(function () {
          return _this4._store.set('refresh_token', refresh_token);
        }).then(function () {
          return _this4._consumer.retrieveUser(access_token);
        });
        // Retrieve user data
      }).then(function (data) {
        _this4._bearer = bearer;
        _this4._id = data.id;
        _this4._publisherId = data.publisher_id;
        _this4._email = data.email;
        _this4._firstName = data.first_name;
        _this4._roles = data.roles;
        _this4._lastName = data.last_name;
        _this4._lastLogin = data.last_login;
        _this4._isDirty = false;
        return Promise.resolve({
          data: data,
          message: 'Authenticated User'
        });
      });
    }

    /**
     * Retrieves user for an access token.
     * Fallbacks to token refresh if refreshToken is defined
     *
     * @param {String} accessToken - The access token to use
     * @param {String} refreshToken - The refresh token to use (Optional)
     * @return {Promise}
     *
     */

  }, {
    key: 'authenticateWithToken',
    value: function authenticateWithToken(accessToken, refreshToken) {
      var _this5 = this;

      assert(accessToken, 'Missing `accessToken`');
      // Store access token
      this._store.set('access_token', accessToken);
      // Store refresh token (or clear if undefined)
      if (refreshToken) {
        this._store.set('refresh_token', refreshToken);
      } else {
        this._store.remove('refresh_token');
      }
      return this._consumer.retrieveUser(accessToken).catch(function (err) {
        if (!refreshToken || err.name !== 'invalid_token') {
          return Promise.reject(err);
        }
        // Try to refresh the tokens if the error is of `invalid_token`
        return _this5._consumer.refreshToken(refreshToken).then(function (newTokens) {
          // Store new tokens
          _this5._store.set('access_token', newTokens.access_token);
          _this5._store.set('refresh_token', newTokens.refresh_token);
          // Retrieve user with new token
          return _this5._consumer.retrieveUser(newTokens.access_token);
        });
      }).then(function (data) {
        _this5._bearer = accessToken;
        _this5._id = data.id;
        _this5._publisherId = data.publisher_id;
        _this5._email = data.email;
        _this5._firstName = data.first_name;
        _this5._lastName = data.last_name;
        _this5._roles = data.roles;
        _this5._isDirty = false;
        return Promise.resolve({
          data: data,
          message: 'Authenticated User'
        });
      });
    }

    /**
     * Flushes stored tokens for User (logout)
     *
     * @return {Promise}
     *
     */

  }, {
    key: 'flush',
    value: function flush() {
      this._bearer = undefined;
      this._id = undefined;
      this._publisherId = undefined;
      this._firstName = undefined;
      this._lastName = undefined;
      this._email = undefined;
      this._roles = [];
      this._isDirty = false;
      return this._store.remove('access_token', 'refresh_token').then(function () {
        return Promise.resolve({
          message: 'Flushed User data'
        });
      });
    }
  }, {
    key: 'id',
    get: function get$$1() {
      return this._id;
    }

    /**
     * Returns User publisherId
     *
     * @return {String} [read-only] publisherId
     *
     */

  }, {
    key: 'publisherId',
    get: function get$$1() {
      return this._publisherId;
    }

    /**
     * Returns User email
     *
     * @return {String} [read-only] email
     *
     */

  }, {
    key: 'email',
    get: function get$$1() {
      return this._email;
    }

    /**
     * Returns User bearer token
     *
     * @return {String} [read-write] bearer token
     *
     */

  }, {
    key: 'bearer',
    get: function get$$1() {
      return this._bearer;
    }

    /**
     * Returns User roles
     *
     * @return {Array} [read-only] roles
     *
     */

  }, {
    key: 'roles',
    get: function get$$1() {
      return this._roles;
    }

    /**
     * Returns User first Name
     *
     * @return {String} [read-write] first Name
     *
     */

  }, {
    key: 'firstName',
    get: function get$$1() {
      return this._firstName;
    },
    set: function set$$1(newFirstName) {
      if (newFirstName) {
        this._isDirty = true;
        this._firstName = newFirstName;
      }
    }

    /**
     * Returns User last name
     *
     * @return {String} [read-write] last name
     *
     */

  }, {
    key: 'lastName',
    get: function get$$1() {
      return this._lastName;
    },
    set: function set$$1(newLastName) {
      if (newLastName) {
        this._isDirty = true;
        this._lastName = newLastName;
      }
    }
  }, {
    key: 'lastLogin',
    get: function get$$1() {
      return this._lastLogin;
    },
    set: function set$$1(newLastLogin) {
      if (newLastLogin) {
        this._isDirty = true;
        this._lastLogin = newLastLogin;
      }
    }
  }]);
  return User;
}();

var user = User;

var retrieveURL$2 = index$4.retrieveURL;
var redirectToURL$1 = index$4.redirectToURL;

/**
 * @class Session
 */

var Session = function () {

  /**
   * Initializes User
   *
   * @constructor
   * @param {User} consumer - The User instance to use
   * @param {String} loginHost - The login app host
   * @param {String} redirectFn - The function the forces URL redirection - Defaults to `window.location.replace`
   * @param {String} pageURL - The current page URL - Defaults to `window.href`
   * @return {User}
   *
   */
  function Session(user$$1, loginHost) {
    var redirectFn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : redirectToURL$1;
    var pageURL = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : retrieveURL$2;
    classCallCheck(this, Session);

    assert(user$$1 instanceof user, '`user` should be instance of User');
    assert(loginHost, '`loginHost` is not defined');
    this._user = user$$1;
    this._loginHost = loginHost;
    this._redirectFn = redirectFn;
    this._pageURL = pageURL;
  }

  /**
   * Determines if session is valid (User is authenticated)
   *
   * @return {Boolean}
   *
   */


  createClass(Session, [{
    key: 'initialize',


    /**
     * Initializes session for user (if defined) in Store
     * Note: This should be the FIRST call before attempting any other session operations
     *
     * @return {Promise}
     *
     */
    value: function initialize() {
      return this._user.syncWithStore();
    }

    /**
     * Invalidates Session
     *
     * @return {Void}
     *
     */

  }, {
    key: 'invalidate',
    value: function invalidate() {
      // Redirect to login host with a return URL
      return this._redirectFn(this._loginHost + '/logout');
    }

    /**
     * Validates Session
     * - Extracts current URL from window.location
     * - Redirects to `loginHost` with encoded URL
     *
     * @return {Void}
     *
     */

  }, {
    key: 'validate',
    value: function validate() {
      var redirectUrl = encodeURIComponent(this._pageURL());
      return this._redirectFn(this._loginHost + '/login?redirectUrl=' + redirectUrl);
    }
  }, {
    key: 'isValid',
    get: function get$$1() {
      return typeof this._user.bearer !== 'undefined';
    }
  }]);
  return Session;
}();

var session = Session;

var validatePassword$2 = index$4.validatePassword;

/**
 * @class Authenticator
 */

var Authenticator = function () {

  /**
   * Initializes Authenticator
   *
   * @constructor
   * @param {Store} store - The Store instance to use
   * @return {Authenticator}
   *
   */
  function Authenticator(consumer$$1) {
    classCallCheck(this, Authenticator);

    assert(consumer$$1 instanceof consumer, '`consumer` should be instance of Consumer');
    this._consumer = consumer$$1;
  }

  /**
   * Asks for a password reset
   *
   * @param {String} email - The email to reset the password for
   * @return {Promise}
   *
   */


  createClass(Authenticator, [{
    key: 'requestPasswordReset',
    value: function requestPasswordReset(email) {
      assert(email, 'Missing `email`');
      return this._consumer.requestPasswordReset(email).then(function () {
        return Promise.resolve({ message: 'A reset link has been sent to your email' });
      });
    }

    /**
     * Sets a new password
     *
     * @param {String} token - The reset token provided via email
     * @param {String} password - The new password
     * @return {Promise}
     *
     */

  }, {
    key: 'resetPassword',
    value: function resetPassword(token, password) {
      assert(token, 'Missing `token`');
      assert(password, 'Missing `password`');

      var _validatePassword = validatePassword$2(password),
          isValid = _validatePassword.isValid,
          message = _validatePassword.message;

      if (!isValid) {
        return Promise.reject(new Error(message));
      }
      return this._consumer.resetPassword(token, password).then(function () {
        return Promise.resolve({ message: 'Your password has been reset' });
      });
    }
  }]);
  return Authenticator;
}();

var authenticator = Authenticator;

var Confirmation = function () {
  function Confirmation(consumer$$1) {
    classCallCheck(this, Confirmation);

    assert(consumer$$1 instanceof consumer, '`consumer` should be instance of Consumer');
    this._consumer = consumer$$1;
  }

  createClass(Confirmation, [{
    key: 'get',
    value: function get$$1(token) {
      assert(token, 'Missing `token`');
      return this._consumer.getConfirmationToken(token);
    }
  }, {
    key: 'confirm',
    value: function confirm(token) {
      assert(token, 'Missing `token`');
      return this._consumer.updateConfirmation(token);
    }
  }, {
    key: 'resend',
    value: function resend(email) {
      assert(email, 'Missing `email`');
      return this._consumer.createConfirmation(email);
    }
  }]);
  return Confirmation;
}();

var confirmation = Confirmation;

var index$10 = createCommonjsModule(function (module) {
(function(root, factory) {

    /* istanbul ignore next */
    if (typeof undefined === 'function' && undefined.amd) {
        undefined([], factory);
    } else if ('object' === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.adblockDetect = factory();
    }

}(commonjsGlobal, function() {

    function adblockDetect(callback, options) {

        options = merge(adblockDetect.defaults, options || {});

        var testNode = createNode(options.testNodeClasses, options.testNodeStyle);
        var runsCounter = 0;
        var adblockDetected = false;

        var testInterval = setInterval(function() {

            runsCounter++;
            adblockDetected = isNodeBlocked(testNode);

            if (adblockDetected || runsCounter === options.testRuns) {
                clearInterval(testInterval);
                testNode.parentNode && testNode.parentNode.removeChild(testNode);
                callback(adblockDetected);
            }

        }, options.testInterval);

    }

    function createNode(testNodeClasses, testNodeStyle) {

        var document = window.document;
        var testNode = document.createElement('div');

        testNode.innerHTML = '&nbsp;';
        testNode.setAttribute('class', testNodeClasses);
        testNode.setAttribute('style', testNodeStyle);

        document.body.appendChild(testNode);

        return testNode;

    }

    function isNodeBlocked(testNode) {

        return testNode.offsetHeight === 0 ||
            !document.body.contains(testNode) ||
            testNode.style.display === 'none' ||
            testNode.style.visibility === 'hidden'
        ;

    }

    function merge(defaults, options) {

        var obj = {};

        for (var key in defaults) {
            obj[key] = defaults[key];
            options.hasOwnProperty(key) && (obj[key] = options[key]);
        }

        return obj;

    }

    adblockDetect.defaults = {
        testNodeClasses: 'pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links',
        testNodeStyle: 'height: 10px !important; font-size: 20px; color: transparent; position: absolute; bottom: 0; left: -10000px;',
        testInterval: 51,
        testRuns: 4
    };

    return adblockDetect;

}));
});

/**
 * @class AdblockerDetector
 */

var AdblockerDetector = function () {

  /**
   * Initializes AdblockerDetector
   * @see https://github.com/sitexw/BlockAdBlock
   *
   * @constructor
   * @param {Object} detector - The detector object to use. Default `blockAdBlock`
   * @return AdblockerDetector
   *
   */
  function AdblockerDetector() {
    var detector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : index$10;
    classCallCheck(this, AdblockerDetector);

    this._detector = detector;
  }

  /**
   * Detects if an adblocker is enabled / disabled in the current browser session
   *
   * @param {Function} cb - The callback function to fire after detection
   * @return {Void}
   */


  createClass(AdblockerDetector, [{
    key: 'detect',
    value: function detect(cb) {
      return this._detector(cb);
    }
  }]);
  return AdblockerDetector;
}();

var adblockerDetector = AdblockerDetector;

var redirectToURL$2 = index$4.redirectToURL;
var extractLoginTokenFromURL$2 = index$4.extractLoginTokenFromURL;
var retrieveURL$3 = index$4.retrieveURL;

/**
 * @class Redirector
 */

var Redirector = function () {

  /**
   * Initializes Redirector
   *
   * @constructor
   * @param {Store} store - The Store instance to use
   * @param {Function} redirectFn - The redirect function to use. Defaults to `Utils.redirectToURL`
   * @return {Redirector}
   *
   */
  function Redirector(store$$1, user$$1) {
    var redirectFn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : redirectToURL$2;
    var retrieveURLFn = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : retrieveURL$3;
    classCallCheck(this, Redirector);

    assert(store$$1 instanceof store, '`store` should be instance of Store');
    assert(user$$1 instanceof user, '`store` should be instance of Store');
    this._store = store$$1;
    this._user = user$$1;
    this._redirectFn = redirectFn;
    this._retrieveURLFn = retrieveURLFn;
  }

  /**
     * Redirects to  for a password reset
     *  - Adds loginToken param to query if browser does not support cross storage support
     *
     * @param {String} targetUrl - The URL to redirect to
     * @param {String} loginToken - The login token to use (optional)
     *
     */


  createClass(Redirector, [{
    key: 'authenticatedRedirect',
    value: function authenticatedRedirect(targetUrl, loginToken) {
      if (this._store.supportsCrossStorage()) {
        return this._redirectFn(targetUrl);
      }
      var postfix = ~targetUrl.indexOf('?') ? '&' : '?';
      var token = loginToken || extractLoginTokenFromURL$2(this._retrieveURLFn()) || this._user.bearer;
      return this._redirectFn('' + targetUrl + postfix + 'loginToken=' + token);
    }
  }]);
  return Redirector;
}();

var redirector = Redirector;

var generateRandomString$1 = index$4.generateRandomString;
var generateRandomUUID$1 = index$4.generateRandomUUID;

/**
 * @class SandboxDatabase
 */

var SandboxDatabase = function () {

  /**
   * Initializes SandboxAPI
   *
   * @constructor
   * @param {JSON} users - The initial user fixtures
   * @param {JSON} tokens - The initial token fixtures
   * @param {JSON} passwords - The initial passwords fixtures
   * @param {JSON} confirmations - The initial confirmation fixtures
   * @return SandboxDatabase
   *
   */
  function SandboxDatabase(users, tokens, passwords, confirmations) {
    classCallCheck(this, SandboxDatabase);

    this._users = [].concat(toConsumableArray(users));
    this._tokens = [].concat(toConsumableArray(tokens));
    this._passwords = [].concat(toConsumableArray(passwords));
    this._confirmations = [].concat(toConsumableArray(confirmations));
  }

  /**
   * Returns users
   *
   * @return {Array}
   *
   */


  createClass(SandboxDatabase, [{
    key: '_extractUser',


    /**
     * Extracts `public` user data
     *
     * @private
     * @return {Object}
     *
    */
    value: function _extractUser(data) {
      return {
        id: data.id,
        publisher_id: data.publisher_id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email
      };
    }

    /**
     * Extracts `public` token data
     *
     * @private
     * @return {Object}
     *
    */

  }, {
    key: '_extractToken',
    value: function _extractToken(data) {
      return {
        access_token: data.access_token,
        refresh_token: data.refresh_token
      };
    }

    /**
     * Determines if database has a specific token based on refresh_token
     *
     * @param {String} refreshToken - The refresh token to lookup
     * @return {Boolean}
     *
     */

  }, {
    key: 'hasTokenWithRefresh',
    value: function hasTokenWithRefresh(refreshToken) {
      return !!~this._tokens.findIndex(function (token) {
        return token.refresh_token === refreshToken;
      });
    }

    /**
     * Determines if database has a specific user based on data
     *
     * @param {String} email - The email to lookup
     * @param {String} password - The password to lookup
     * @return {Boolean}
     *
     */

  }, {
    key: 'hasUserWithData',
    value: function hasUserWithData(email, password) {
      return !!~this._users.findIndex(function (user) {
        return user.email === email && user.password === password;
      });
    }

    /**
     * Determines if database has a specific user based on token
     *
     * @param {String} accessToken - The token to lookup
     * @return {Boolean}
     *
     */

  }, {
    key: 'hasUserWithToken',
    value: function hasUserWithToken(accessToken) {
      return !!~this._tokens.findIndex(function (token) {
        return token.access_token === accessToken;
      });
    }

    /**
     * Returns token for a user
     *
     * @param {String} userId - The user id to lookup
     * @return {Object}
     *
     */

  }, {
    key: 'getTokenFor',
    value: function getTokenFor(userId) {
      return this._tokens.find(function (token) {
        return token.user_id === userId;
      });
    }

    /**
     * Determines if database has a specific user based on email
     *
     * @param {String} email - The email to lookup
     * @return {Boolean}
     *
     */

  }, {
    key: 'hasUserWithEmail',
    value: function hasUserWithEmail(email) {
      return !!~this._users.findIndex(function (user) {
        return user.email === email;
      });
    }

    /**
     * Determines if database has a specific password reset token
     *
     * @param {String} token - The token to lookup
     * @return {Boolean}
     *
     */

  }, {
    key: 'hasPasswordResetToken',
    value: function hasPasswordResetToken(token) {
      return !!~this._passwords.findIndex(function (record) {
        return record.token === token;
      });
    }

    /**
     * Returns user from fixtures based on data
     *
     * @param {String} email - The target user email
     * @param {String} password - The target user password
     * @return {Boolean}
     *
     */

  }, {
    key: 'getUserWithData',
    value: function getUserWithData(email, password) {
      return this._extractUser(this._users.find(function (user) {
        return user.email === email && user.password === password;
      }));
    }

    /**
     *
     * Returns user from fixtures based on `id`
     * @param {String} id - The user id to lookup
     * @return {Object} The found user data
     *
     */

  }, {
    key: 'getUserWithId',
    value: function getUserWithId(id) {
      return this._extractUser(this._users.find(function (user) {
        return user.id === id;
      }));
    }

    /**
     * Returns user from fixtures based on token
     *
     * @param {String} accessToken - The token to lookup
     * @return {Object} The found `access_token` and `refresh_token`
     *
     */

  }, {
    key: 'getUserWithToken',
    value: function getUserWithToken(accessToken) {
      var userId = this._tokens.find(function (token) {
        return token.access_token === accessToken;
      }).user_id;
      return this.getUserWithId(userId);
    }

    /**
     * Returns confirmation from fixtures based on token uuid
     *
     * @param {String} id - The token id
     * @return {Object} confirmation
     *
     */

  }, {
    key: 'getConfirmationById',
    value: function getConfirmationById(id) {
      return this._confirmations.find(function (conf) {
        return conf.uuid === id;
      });
    }

    /**
     * Adds user to fixtures
     *
     * @param {String} email - The email to set
     * @param {String} password - The password to set
     * @param {String} firstName - The firstName to set - Optional
     * @param {String} lastName - The lastName to set - Optional
     * @return {Object} The user data merged into an object
     *
     */

  }, {
    key: 'addUser',
    value: function addUser(email, password, firstName, lastName) {
      var userId = generateRandomUUID$1();
      var publisherId = generateRandomUUID$1();
      var accessToken = generateRandomString$1();
      var refreshToken = generateRandomString$1();
      var newToken = {
        user_id: userId,
        access_token: accessToken,
        refresh_token: refreshToken
      };
      var newUser = {
        id: userId,
        publisher_id: publisherId,
        email: email,
        password: password,
        first_name: firstName,
        last_name: lastName
      };
      // Store new records
      this._tokens.push(newToken);
      this._users.push(newUser);
      // Return public user data
      return this._extractUser(newUser);
    }

    /**
     * Updates user
     *
     * @param {String} id - The user id to lookup
     * @param {String} firstName - The firstName to update
     * @param {String} lastName - The lastName to update
     * @return {Object} The user data merged into an object
     *
     */

  }, {
    key: 'updateUser',
    value: function updateUser(id, firstName, lastName) {
      var user = this._users.find(function (record) {
        return record.id === id;
      });
      if (typeof firstName !== 'undefined') {
        user.first_name = firstName;
      }
      if (typeof lastName !== 'undefined') {
        user.last_name = lastName;
      }
      // Return public user data
      return this._extractUser(user);
    }

    /**
     * Updates token
     *
     * @param {String} refreshToken - The refreshToken to use
     * @return {Object} The found `access_token` and `refresh_token`
     *
     */

  }, {
    key: 'updateToken',
    value: function updateToken(refreshToken) {
      var token = this._tokens.find(function (record) {
        return record.refresh_token === refreshToken;
      });
      token.access_token = generateRandomString$1();
      token.refresh_token = generateRandomString$1();
      // Return public user data
      return this._extractToken(token);
    }
  }, {
    key: 'users',
    get: function get$$1() {
      return this._users;
    }

    /**
     * Returns tokens
     *
     * @return {Array}
     *
     */

  }, {
    key: 'tokens',
    get: function get$$1() {
      return this._tokens;
    }
  }]);
  return SandboxDatabase;
}();

var sandbox$2 = SandboxDatabase;

var users = [{
  "id": "44d2c8e0-762b-4fa5-8571-097c81c3130d",
  "publisher_id": "55f5c8e0-762b-4fa5-8571-197c8183130a",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@mail.com",
  "password": "qwerty123",
  "roles": ["developer"]
}];

var users$1 = Object.freeze({
	default: users
});

var tokens = [{
  "user_id": "44d2c8e0-762b-4fa5-8571-097c81c3130d",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "access_token": "rkdkJHVBdCjLIIjsIK4NalauxPP8uo5hY8tTN7"
}];

var tokens$1 = Object.freeze({
	default: tokens
});

var passwords = [{
  "user_id": "44d2c8e0-762b-4fa5-8571-097c81c3130d",
  "token": "yJhbGcieOiJIUzI1NiIsIJ9nR5cCI6IkpXVC"
}];

var passwords$1 = Object.freeze({
	default: passwords
});

var confirmations = [{
  "uuid": "653a6d48-c38c-4414-8cd4-acea0a3d7804",
  "user_id": "44d2c8e0-762b-4fa5-8571-097c81c3130d"
}];

var confirmations$1 = Object.freeze({
	default: confirmations
});

var es6Promise = createCommonjsModule(function (module, exports) {
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   4.0.5
 */

(function (global, factory) {
    module.exports = factory();
}(commonjsGlobal, (function () { 'use strict';

function objectOrFunction(x) {
  return typeof x === 'function' || typeof x === 'object' && x !== null;
}

function isFunction(x) {
  return typeof x === 'function';
}

var _isArray = undefined;
if (!Array.isArray) {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
} else {
  _isArray = Array.isArray;
}

var isArray = _isArray;

var len = 0;
var vertxNext = undefined;
var customSchedulerFn = undefined;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && ({}).toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var r = commonjsRequire;
    var vertx = r('vertx');
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = undefined;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && typeof commonjsRequire === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var _arguments = arguments;

  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;

  if (_state) {
    (function () {
      var callback = _arguments[_state - 1];
      asap(function () {
        return invokeCallback(_state, child, callback, parent._result);
      });
    })();
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  _resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(16);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

var GET_THEN_ERROR = new ErrorObject();

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function getThen(promise) {
  try {
    return promise.then;
  } catch (error) {
    GET_THEN_ERROR.error = error;
    return GET_THEN_ERROR;
  }
}

function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
  try {
    then.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        _resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      _reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      _reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    _reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return _resolve(promise, value);
    }, function (reason) {
      return _reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$) {
  if (maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$ === GET_THEN_ERROR) {
      _reject(promise, GET_THEN_ERROR.error);
    } else if (then$$ === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$)) {
      handleForeignThenable(promise, maybeThenable, then$$);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function _resolve(promise, value) {
  if (promise === value) {
    _reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    handleMaybeThenable(promise, value, getThen(value));
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function _reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;

  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = undefined,
      callback = undefined,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function ErrorObject() {
  this.error = null;
}

var TRY_CATCH_ERROR = new ErrorObject();

function tryCatch(callback, detail) {
  try {
    return callback(detail);
  } catch (e) {
    TRY_CATCH_ERROR.error = e;
    return TRY_CATCH_ERROR;
  }
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = undefined,
      error = undefined,
      succeeded = undefined,
      failed = undefined;

  if (hasCallback) {
    value = tryCatch(callback, detail);

    if (value === TRY_CATCH_ERROR) {
      failed = true;
      error = value.error;
      value = null;
    } else {
      succeeded = true;
    }

    if (promise === value) {
      _reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
    succeeded = true;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
      _resolve(promise, value);
    } else if (failed) {
      _reject(promise, error);
    } else if (settled === FULFILLED) {
      fulfill(promise, value);
    } else if (settled === REJECTED) {
      _reject(promise, value);
    }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      _resolve(promise, value);
    }, function rejectPromise(reason) {
      _reject(promise, reason);
    });
  } catch (e) {
    _reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function Enumerator(Constructor, input) {
  this._instanceConstructor = Constructor;
  this.promise = new Constructor(noop);

  if (!this.promise[PROMISE_ID]) {
    makePromise(this.promise);
  }

  if (isArray(input)) {
    this._input = input;
    this.length = input.length;
    this._remaining = input.length;

    this._result = new Array(this.length);

    if (this.length === 0) {
      fulfill(this.promise, this._result);
    } else {
      this.length = this.length || 0;
      this._enumerate();
      if (this._remaining === 0) {
        fulfill(this.promise, this._result);
      }
    }
  } else {
    _reject(this.promise, validationError());
  }
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
}

Enumerator.prototype._enumerate = function () {
  var length = this.length;
  var _input = this._input;

  for (var i = 0; this._state === PENDING && i < length; i++) {
    this._eachEntry(_input[i], i);
  }
};

Enumerator.prototype._eachEntry = function (entry, i) {
  var c = this._instanceConstructor;
  var resolve$$ = c.resolve;

  if (resolve$$ === resolve) {
    var _then = getThen(entry);

    if (_then === then && entry._state !== PENDING) {
      this._settledAt(entry._state, i, entry._result);
    } else if (typeof _then !== 'function') {
      this._remaining--;
      this._result[i] = entry;
    } else if (c === Promise) {
      var promise = new c(noop);
      handleMaybeThenable(promise, entry, _then);
      this._willSettleAt(promise, i);
    } else {
      this._willSettleAt(new c(function (resolve$$) {
        return resolve$$(entry);
      }), i);
    }
  } else {
    this._willSettleAt(resolve$$(entry), i);
  }
};

Enumerator.prototype._settledAt = function (state, i, value) {
  var promise = this.promise;

  if (promise._state === PENDING) {
    this._remaining--;

    if (state === REJECTED) {
      _reject(promise, value);
    } else {
      this._result[i] = value;
    }
  }

  if (this._remaining === 0) {
    fulfill(promise, this._result);
  }
};

Enumerator.prototype._willSettleAt = function (promise, i) {
  var enumerator = this;

  subscribe(promise, undefined, function (value) {
    return enumerator._settledAt(FULFILLED, i, value);
  }, function (reason) {
    return enumerator._settledAt(REJECTED, i, reason);
  });
};

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all(entries) {
  return new Enumerator(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  _reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {function} resolver
  Useful for tooling.
  @constructor
*/
function Promise(resolver) {
  this[PROMISE_ID] = nextId();
  this._result = this._state = undefined;
  this._subscribers = [];

  if (noop !== resolver) {
    typeof resolver !== 'function' && needsResolver();
    this instanceof Promise ? initializePromise(this, resolver) : needsNew();
  }
}

Promise.all = all;
Promise.race = race;
Promise.resolve = resolve;
Promise.reject = reject;
Promise._setScheduler = setScheduler;
Promise._setAsap = setAsap;
Promise._asap = asap;

Promise.prototype = {
  constructor: Promise,

  /**
    The primary way of interacting with a promise is through its `then` method,
    which registers callbacks to receive either a promise's eventual value or the
    reason why the promise cannot be fulfilled.
  
    ```js
    findUser().then(function(user){
      // user is available
    }, function(reason){
      // user is unavailable, and you are given the reason why
    });
    ```
  
    Chaining
    --------
  
    The return value of `then` is itself a promise.  This second, 'downstream'
    promise is resolved with the return value of the first promise's fulfillment
    or rejection handler, or rejected if the handler throws an exception.
  
    ```js
    findUser().then(function (user) {
      return user.name;
    }, function (reason) {
      return 'default name';
    }).then(function (userName) {
      // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
      // will be `'default name'`
    });
  
    findUser().then(function (user) {
      throw new Error('Found user, but still unhappy');
    }, function (reason) {
      throw new Error('`findUser` rejected and we're unhappy');
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
      // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
    });
    ```
    If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
  
    ```js
    findUser().then(function (user) {
      throw new PedagogicalException('Upstream error');
    }).then(function (value) {
      // never reached
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // The `PedgagocialException` is propagated all the way down to here
    });
    ```
  
    Assimilation
    ------------
  
    Sometimes the value you want to propagate to a downstream promise can only be
    retrieved asynchronously. This can be achieved by returning a promise in the
    fulfillment or rejection handler. The downstream promise will then be pending
    until the returned promise is settled. This is called *assimilation*.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // The user's comments are now available
    });
    ```
  
    If the assimliated promise rejects, then the downstream promise will also reject.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // If `findCommentsByAuthor` fulfills, we'll have the value here
    }, function (reason) {
      // If `findCommentsByAuthor` rejects, we'll have the reason here
    });
    ```
  
    Simple Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let result;
  
    try {
      result = findResult();
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
    findResult(function(result, err){
      if (err) {
        // failure
      } else {
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findResult().then(function(result){
      // success
    }, function(reason){
      // failure
    });
    ```
  
    Advanced Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let author, books;
  
    try {
      author = findAuthor();
      books  = findBooksByAuthor(author);
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
  
    function foundBooks(books) {
  
    }
  
    function failure(reason) {
  
    }
  
    findAuthor(function(author, err){
      if (err) {
        failure(err);
        // failure
      } else {
        try {
          findBoooksByAuthor(author, function(books, err) {
            if (err) {
              failure(err);
            } else {
              try {
                foundBooks(books);
              } catch(reason) {
                failure(reason);
              }
            }
          });
        } catch(error) {
          failure(err);
        }
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findAuthor().
      then(findBooksByAuthor).
      then(function(books){
        // found books
    }).catch(function(reason){
      // something went wrong
    });
    ```
  
    @method then
    @param {Function} onFulfilled
    @param {Function} onRejected
    Useful for tooling.
    @return {Promise}
  */
  then: then,

  /**
    `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
    as the catch block of a try/catch statement.
  
    ```js
    function findAuthor(){
      throw new Error('couldn't find that author');
    }
  
    // synchronous
    try {
      findAuthor();
    } catch(reason) {
      // something went wrong
    }
  
    // async with promises
    findAuthor().catch(function(reason){
      // something went wrong
    });
    ```
  
    @method catch
    @param {Function} onRejection
    Useful for tooling.
    @return {Promise}
  */
  'catch': function _catch(onRejection) {
    return this.then(null, onRejection);
  }
};

function polyfill() {
    var local = undefined;

    if (typeof commonjsGlobal !== 'undefined') {
        local = commonjsGlobal;
    } else if (typeof self !== 'undefined') {
        local = self;
    } else {
        try {
            local = Function('return this')();
        } catch (e) {
            throw new Error('polyfill failed because global object is unavailable in this environment');
        }
    }

    var P = local.Promise;

    if (P) {
        var promiseToString = null;
        try {
            promiseToString = Object.prototype.toString.call(P.resolve());
        } catch (e) {
            // silently ignored
        }

        if (promiseToString === '[object Promise]' && !P.cast) {
            return;
        }
    }

    local.Promise = Promise;
}

// Strange compat..
Promise.polyfill = polyfill;
Promise.Promise = Promise;

return Promise;

})));

});

(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob();
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  };

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ];

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    };

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    };
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value);
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift();
        return {done: value === undefined, value: value}
      }
    };

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      };
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value);
      }, this);
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1]);
      }, this);
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var oldValue = this.map[name];
    this.map[name] = oldValue ? oldValue+','+value : value;
  };

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)];
  };

  Headers.prototype.get = function(name) {
    name = normalizeName(name);
    return this.has(name) ? this.map[name] : null
  };

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  };

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value);
  };

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this);
      }
    }
  };

  Headers.prototype.keys = function() {
    var items = [];
    this.forEach(function(value, name) { items.push(name); });
    return iteratorFor(items)
  };

  Headers.prototype.values = function() {
    var items = [];
    this.forEach(function(value) { items.push(value); });
    return iteratorFor(items)
  };

  Headers.prototype.entries = function() {
    var items = [];
    this.forEach(function(value, name) { items.push([name, value]); });
    return iteratorFor(items)
  };

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true;
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result);
      };
      reader.onerror = function() {
        reject(reader.error);
      };
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsArrayBuffer(blob);
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsText(blob);
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf);
    var chars = new Array(view.length);

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i]);
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength);
      view.set(new Uint8Array(buf));
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false;

    this._initBody = function(body) {
      this._bodyInit = body;
      if (!body) {
        this._bodyText = '';
      } else if (typeof body === 'string') {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString();
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer);
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer]);
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body);
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8');
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type);
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
      }
    };

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this);
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      };

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      };
    }

    this.text = function() {
      var rejected = consumed(this);
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    };

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      };
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    };

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {};
    var body = options.body;

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      if (!body && input._bodyInit != null) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    } else {
      this.url = String(input);
    }

    this.credentials = options.credentials || this.credentials || 'omit';
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || 'GET');
    this.mode = options.mode || this.mode || null;
    this.referrer = null;

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body);
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  };

  function decode(body) {
    var form = new FormData();
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=');
        var name = split.shift().replace(/\+/g, ' ');
        var value = split.join('=').replace(/\+/g, ' ');
        form.append(decodeURIComponent(name), decodeURIComponent(value));
      }
    });
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers();
    rawHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':');
      var key = parts.shift().trim();
      if (key) {
        var value = parts.join(':').trim();
        headers.append(key, value);
      }
    });
    return headers
  }

  Body.call(Request.prototype);

  function Response(bodyInit, options) {
    if (!options) {
      options = {};
    }

    this.type = 'default';
    this.status = 'status' in options ? options.status : 200;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = 'statusText' in options ? options.statusText : 'OK';
    this.headers = new Headers(options.headers);
    this.url = options.url || '';
    this._initBody(bodyInit);
  }

  Body.call(Response.prototype);

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  };

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''});
    response.type = 'error';
    return response
  };

  var redirectStatuses = [301, 302, 303, 307, 308];

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  };

  self.Headers = Headers;
  self.Request = Request;
  self.Response = Response;

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init);
      var xhr = new XMLHttpRequest();

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        };
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options));
      };

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'));
      };

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'));
      };

      xhr.open(request.method, request.url, true);

      if (request.credentials === 'include') {
        xhr.withCredentials = true;
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob';
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value);
      });

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
    })
  };
  self.fetch.polyfill = true;
})(typeof self !== 'undefined' ? self : undefined);

var UserFixtures = ( users$1 && users ) || users$1;

var TokenFixtures = ( tokens$1 && tokens ) || tokens$1;

var PasswordFixtures = ( passwords$1 && passwords ) || passwords$1;

var ConfirmationFixtures = ( confirmations$1 && confirmations ) || confirmations$1;

/**
 * CrossStorageHub
 * @see https://github.com/zendesk/cross-storage
 */
var CrossStorageHub = index$2.CrossStorageHub;

/**
 * Global polyfill for {Promise}
 */
es6Promise.polyfill();

/**
 * Global polyfill for {fetch}
 */

/**
 * @namespace AuthenticationClient
 */
var AuthenticationClient = function immediate() {
  /**
   * Environment ENUM
   *
   * @enum
   * return {Object}
   *
   */
  var ENV = Object.freeze({
    Production: Symbol('Production'),
    Sandbox: Symbol('Sandbox')
  });

  /**
   * Cached instances
   *
   * @private
   * @return {Map}
   *
   */
  var instances = new Map();

  /**
   * Returns an API instaces for an ENV setup
   *
   * @private
   * @throws {Error}
   * @param {ENV} environment - The environment to set - Defaults to `Production`
   * @return {SandboxAPI|ProductionAPI}
   *
   */
  function getAPIFor(environment) {
    var host = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _default.api.host;

    if (environment === ENV.Production) {
      return new index$8.Production(host);
    }
    if (environment === ENV.Sandbox) {
      return new index$8.Sandbox(new sandbox$2(UserFixtures, TokenFixtures, PasswordFixtures, ConfirmationFixtures));
    }
    throw new Error('Invalid `environment` passed');
  }

  /**
   * Generates an AuthenticationClient instance
   *
   * @private
   * @param {String} clientId - The client id to set
   * @param {String} clientSecret - The client secret
   * @param {ENV} environment - The environment to set
   * @param {String} loginHost - The login host URL
   * @param {String} apiHost - The API host
   * @param {Store} store - The Store instance
   * @return {Authenticator}
   *
   */
  function generateInstance(clientId, clientSecret) {
    var environment = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ENV.Production;
    var loginHost = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _default.login.host;
    var apiHost = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _default.api.host;
    var storeDomain = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _default.store.domain;

    var store$$1 = new store(storeDomain, loginHost + '/hub');
    var api = getAPIFor(environment, apiHost);
    var client = new client$2(clientId, clientSecret);
    var consumer$$1 = new consumer(client, api);
    var user$$1 = new user(store$$1, consumer$$1);
    var session$$1 = new session(user$$1, loginHost);
    var authenticator$$1 = new authenticator(consumer$$1);
    var redirector$$1 = new redirector(store$$1, user$$1);
    var adblockerDetector$$1 = new adblockerDetector();
    var confirmation$$1 = new confirmation(consumer$$1);
    return {
      user: user$$1,
      session: session$$1,
      authenticator: authenticator$$1,
      redirector: redirector$$1,
      adblockerDetector: adblockerDetector$$1,
      confirmation: confirmation$$1
    };
  }

  return {
    /**
     * Environment enum
     *
     * @enum
     * @memberof AuthenticationClient
     *
     */
    Environment: ENV,

    /**
     * Initializes CrossStorageHub
     *
     * @enum
     * @memberof AuthenticationClient
     *
     */
    initStorage: function initStorage(options) {
      return CrossStorageHub.init(options);
    },


    /**
     * Creates an Authenticator instance for a clientId, clientSecret combination
     *
     * @function getInstanceFor
     * @memberof AuthenticationClient
     * @param {Object} params
     * @param {String} params.clientId - The Client id
     * @param {String} params.clientSecret - The Client secret
     * @param {String} params.loginHost - The login host URL
     * @param {String} params.apiHost - The API host
     * @param {Store} params.store - The Store instance
     * @param {ENV} params.environment - The environment to set
     * @return {Authenticator}
     *
     */
    getInstanceFor: function getInstanceFor(_ref) {
      var clientId = _ref.clientId,
          clientSecret = _ref.clientSecret,
          environment = _ref.environment,
          loginHost = _ref.loginHost,
          apiHost = _ref.apiHost;

      var key = clientId + '-' + clientSecret;
      // Return cached instance
      if (instances.has(key)) {
        return instances.get(key);
      }
      // Generate & cache new instance
      var instance = generateInstance(clientId, clientSecret, environment, loginHost, apiHost);
      instances.set(key, instance);
      return instance;
    },


    /**
     * Flushes cached instances
     *
     * @function reset
     * @memberof AuthenticationClient
     *
     */
    reset: function reset() {
      instances.clear();
    }
  };
}();

var index = AuthenticationClient;

module.exports = index;
