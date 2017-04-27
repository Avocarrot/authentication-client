const test = require('tape');
const AdblockerDetector = require('../../../src/services/adblocker-detector');
const sinon = require('sinon');

const sandbox = sinon.sandbox.create();

/**
 * AdblockerDetector.detect(cb)
 */

test('AdblockerDetector.detect(cv) should', (t) => {
  t.test('return true if adblocker is detected', (assert) => {
    assert.plan(1);
    const detector = cb => cb(true);
    const adblockerDetector = new AdblockerDetector(detector);
    adblockerDetector.detect(isEnabled => assert.equals(isEnabled, true));
    sandbox.restore();
  });

  t.test('return false if adblocker is not detected', (assert) => {
    assert.plan(1);
    const detector = cb => cb(false);
    const adblockerDetector = new AdblockerDetector(detector);
    adblockerDetector.detect(isEnabled => assert.equals(isEnabled, false));
    sandbox.restore();
  });
});
