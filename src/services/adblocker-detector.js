const adblockDetect = require('adblock-detect');

/**
 * @class AdblockerDetector
 */
class AdblockerDetector {

  /**
   * Initializes AdblockerDetector
   * @see https://github.com/sitexw/BlockAdBlock
   *
   * @constructor
   * @param {Object} detector - The detector object to use. Default `blockAdBlock`
   * @return AdblockerDetector
   *
   */
  constructor(detector = adblockDetect) {
    this._detector = detector;
  }

  /**
   * Detects if an adblocker is enabled / disabled in the current browser session
   *
   * @param {Function} cb - The callback function to fire after detection
   * @return {Void}
   */
  detect(cb) {
    return this._detector(cb);
  }

}

module.exports = AdblockerDetector;
