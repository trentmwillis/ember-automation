/* global sinon */
import Ember from 'ember';
import { initialize } from 'dummy/instance-initializers/auto-run-component';
import { module, test } from 'qunit';

let application;
let sandbox;

module('Unit | Instance Initializer | auto-run-component', {
  beforeEach() {
    Ember.run(() => {
      application = Ember.Application.create({
        rootElement: '#ember-testing'
      });
      application.deferReadiness();
    });

    sandbox = sinon.sandbox.create();
  },

  afterEach() {
    sandbox.restore();
  }
});

/* initialize */

test('initialize should not re-open Ember.Component more than once', function(assert) {
  // Depending on if the initializer has already ran, we will either expect the
  // reopen method to be called once or not at all.
  let assertMethod = Ember.Component.prototype.addCallback ? 'notCalled' : 'calledOnce';
  let reopenSpy = sandbox.spy(Ember.Component, 'reopen');

  initialize(application);
  initialize(application);

  assert.ok(reopenSpy[assertMethod]);
});

/* Ember.Component.addCallback / Ember.Component.automatedCallbacks */

test('addCallback should add callbacks to automatedCallbacks and run them on "didRender" when not in testing mode', function(assert) {
  assert.expect(6);

  initialize(application);

  let component = Ember.Component.create({});
  let callbackSpy1 = sandbox.spy();
  let callbackSpy2 = sandbox.spy();

  component.addCallback(callbackSpy1);
  assert.deepEqual(component.get('automatedCallbacks'), Ember.A([callbackSpy1]), 'addCallback created an array for automatedCallbacks with the supplied callback');

  component.addCallback(callbackSpy2);
  assert.deepEqual(component.get('automatedCallbacks'), Ember.A([callbackSpy1, callbackSpy2]), 'addCallback appended callback to automatedCallbacks');


  // In order for the callbacks to run, we have to act like we're not in testing
  Ember.testing = false;

  Ember.run(() => component.appendTo('#ember-testing'));
  assert.ok(callbackSpy1.calledOnce, 'first callback run on initial render');
  assert.ok(callbackSpy2.calledOnce, 'second callback run on initial render');

  Ember.run(() => component.trigger('didRender'));
  assert.ok(callbackSpy1.calledTwice, 'first callback run on re-render');
  assert.ok(callbackSpy2.calledTwice, 'second callback run on re-render');

  Ember.run(() => component.destroy());

  // Turn testing mode back on to ensure validity of other tests
  Ember.testing = true;
});

test('addCallback should add callbacks to automatedCallbacks and not run them on "didRender" when in testing mode', function(assert) {
  assert.expect(2);

  initialize(application);

  let component = Ember.Component.create({});
  let callbackSpy = sandbox.spy();

  component.addCallback(callbackSpy);
  assert.deepEqual(component.get('automatedCallbacks'), Ember.A([callbackSpy]), 'addCallback created an array for automatedCallbacks with the supplied callback');

  Ember.run(() => component.appendTo('#ember-testing'));
  assert.ok(callbackSpy.notCalled, 'callback not run on render');

  Ember.run(() => component.destroy());
});

test('addCallback throws an error when trying to add a non-function', function(assert) {
  initialize(application);

  let component = Ember.Component.create({});
  assert.throws(() => component.addCallback('not a function'), /Error: function should be of type function, not of type string/);

  Ember.run(() => component.destroy());
});

test('automatedCallbacks will cause an error when an entry is not a function', function(assert) {
  initialize(application);

  let component = Ember.Component.create({
    automatedCallbacks: Ember.A([ 'not a function' ])
  });

  // In order for the callbacks to run, we have to act like we're not in testing
  Ember.testing = false;

  assert.throws(() => {
    Ember.run(() => component.appendTo('#ember-testing'));
  }, /Error: function should be of type function, not of type string/);

  Ember.run(() => component.destroy());

  // Turn testing mode back on to ensure validity of other tests
  Ember.testing = true;
});

/* Ember.Component.turnCallbacksOff */

test('turnCallbacksOff prevents callbacks from running on didRender', function(assert) {
  assert.expect(2);

  initialize(application);

  let component = Ember.Component.create({ turnCallbacksOff: true });
  let callbackSpy = sandbox.spy();
  component.addCallback(callbackSpy);

  // In order for the callbacks to run, we have to act like we're not in testing
  Ember.testing = false;

  Ember.run(() => component.appendTo('#ember-testing'));
  assert.ok(callbackSpy.notCalled, 'callback not run on render when turnCallbacksOff is true');

  Ember.run(() => {
    component.set('turnCallbacksOff', false);
    component.trigger('didRender');
  });
  assert.ok(callbackSpy.calledOnce, 'callback run on render when turnCallbacksOff is false');

  Ember.run(() => component.destroy());

  // Turn testing mode back on to ensure validity of other tests
  Ember.testing = true;
});
