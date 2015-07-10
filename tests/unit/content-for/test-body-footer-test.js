/* global automation */
import Ember from 'ember';
import { module, test, skip } from 'qunit';
import sinon from 'sinon';
import startApp from '../../helpers/start-app';

let sandbox;

module('Unit | test-body-footer', {
  beforeEach: function() {
    sandbox = sinon.sandbox.create();
  },

  afterEach: function() {
    sandbox.restore();
  }
});

/* automation.on / automation.off */

test('on and off turn the automation on and off respectively (master test)', function(assert) {
  assert.expect(12);

  let onSpy = sandbox.spy();
  let renderSpy = sandbox.spy();
  let offSpy = sandbox.spy();

  automation.onAutomation(onSpy);
  automation.afterRender(renderSpy);
  automation.offAutomation(offSpy);

  automation.on();

  assert.ok(onSpy.calledOnce, 'on callback was called when turning automation on');
  assert.ok(renderSpy.notCalled, 'render callback was NOT called when turning automation on');
  assert.ok(offSpy.notCalled, 'off callback was NOT called when turning automation on');

  let application = startApp();
  visit('/');

  andThen(() => {
    assert.ok(onSpy.calledOnce, 'on callback was NOT called again on render');
    assert.ok(renderSpy.calledOnce, 'render callback was called on render');
    assert.ok(offSpy.notCalled, 'off callback was NOT called on render');
  });

  visit('/test');

  andThen(() => {
    assert.ok(onSpy.calledOnce, 'on callback was NOT called again on re-render');
    assert.ok(renderSpy.calledTwice, 'render callback was called on re-render');
    assert.ok(offSpy.notCalled, 'off callback was NOT called on re-render');

    automation.off();
  });

  visit('/');

  andThen(() => {
    assert.ok(onSpy.calledOnce, 'on callback was NOT called again when turning automation off');
    assert.ok(renderSpy.calledTwice, 'render callback was NOT called again when turning automation off');
    assert.ok(offSpy.calledOnce, 'off callback was called when turning automation off');

    Ember.run(application, 'destroy');
  });
});

/* automation.afterRender */

test('afterRender registers a callback function to be run after rendering', function(assert) {
  let spy = sandbox.spy();

  automation.afterRender(spy);

  // To test that it was registered, we turn automation on and start up the app
  automation.on();
  let application = startApp();
  visit('/');

  andThen(() => {
    assert.ok(spy.calledOnce, 'callback was called on app render');
    automation.off();
    Ember.run(application, 'destroy');
  });
});

test('afterRender registers multiple callback functions to be run after rendering', function(assert) {
  assert.expect(2);

  let spy1 = sandbox.spy();
  let spy2 = sandbox.spy();

  automation.afterRender(spy1);
  automation.afterRender(spy2);

  // To test that it was registered, we turn automation on and start up the app
  automation.on();
  let application = startApp();
  visit('/');

  andThen(() => {
    assert.ok(spy1.calledOnce, 'first callback was called on app render');
    assert.ok(spy2.calledOnce, 'first callback was called on app render');
    automation.off();
    Ember.run(application, 'destroy');
  });
});

test('afterRender throws an error if callback is not a function', function(assert) {
  assert.throws(() => automation.afterRender('error'), /Error: callback needs to be of type function, not of type string/);
});

/* automation.onAutomation */

test('onAutomation registers a callback function to be run when automation is turned on', function(assert) {
  let spy = sandbox.spy();

  automation.onAutomation(spy);
  automation.on();

  assert.ok(spy.calledOnce, 'callback run on "on"');

  automation.off();
});

test('onAutomation registers multiple callback functions to be run when automation is turned on', function(assert) {
  assert.expect(2);

  let spy1 = sandbox.spy();
  let spy2 = sandbox.spy();

  automation.onAutomation(spy1);
  automation.onAutomation(spy2);
  automation.on();

  assert.ok(spy1.calledOnce, 'first callback run on "on"');
  assert.ok(spy2.calledOnce, 'second callback run on "on"');

  automation.off();
});

test('onAutomation throws an error if callback is not a function', function(assert) {
  assert.throws(() => automation.onAutomation('error'), /Error: callback needs to be of type function, not of type string/);
});

/* automation.offAutomation */

test('offAutomation registers a callback function to be run when automation is turned off', function(assert) {
  let spy = sandbox.spy();

  automation.offAutomation(spy);
  automation.off();

  assert.ok(spy.calledOnce, 'callback run on "off"');
});

test('offAutomation registers multiple callback functions to be run when automation is turned off', function(assert) {
  assert.expect(2);

  let spy1 = sandbox.spy();
  let spy2 = sandbox.spy();

  automation.offAutomation(spy1);
  automation.offAutomation(spy2);
  automation.off();

  assert.ok(spy1.calledOnce, 'first callback run on "off"');
  assert.ok(spy2.calledOnce, 'second callback run on "off"');
});

test('offAutomation throws an error if callback is not a function', function(assert) {
  assert.throws(() => automation.offAutomation('error'), /Error: callback needs to be of type function, not of type string/);
});

/* QUnit.moduleStart */

skip('QUnit.moduleStart turns automation on during acceptance tests');

skip('QUnit.moduleStart turns automation off during non-acceptance tests');

/* QUnit.done */

skip('QUnit.done turns automation off');
