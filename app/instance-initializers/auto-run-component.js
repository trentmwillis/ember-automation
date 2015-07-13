/**
 * Variable to ensure that the initializer is only ran once. Though in this
 * particular case, running more than once shouldn't cause side-effects.
 * @private
 * @type {Boolean}
 */
let _hasRan = false;

/**
 * Checks if an object is a function; if it is not, an error is thrown.
 * @private
 * @param {Object} func
 * @return {Void}
 */
function _isFunction(func) {
  let type = typeof func;

  if (type !== 'function') {
    throw new Error('Error: function should be of type function, not of type ' + type);
  }
}

/**
 * Attempts to run a callback function with a given context. If the callback is
 * not a function, an error is thrown.
 * @private
 * @param {Object} context
 * @param {Function} callback
 * @return {Void}
 */
function _attemptCallback(context, callback) {
  _isFunction(callback);

  callback.call(context);
}

export function initialize(application) {
  if (_hasRan) { return; }

  Ember.Component.reopen({
    /**
     * Stops the callbacks from running automatically during render.
     * @public
     * @type {Boolean}
     */
    turnCallbacksOff: false,

    /**
     * An array of functions to execute automatically whenever didRender occurs,
     * except during testing or when turned off.
     * @public
     * @type {Array}
     */
    automatedCallbacks: undefined,

    /**
     * Adds a callback to the {@link automatedCallbacks} array. If no callbacks
     * are currently defined, it also creates the array.
     * @public
     * @param {Function} callback
     * @return {Void}
     */
    addCallback(callback) {
      _isFunction(callback);

      let callbacks = this.get('automatedCallbacks');

      if (!callbacks) {
        this.set('automatedCallbacks', Ember.A([callback]));
      } else {
        callbacks.pushObject(callback);
      }
    },

    /**
     * Runs any defined callbacks on the component during didRender, unless they
     * have been disabled via {@link turnCallbacksOff} or are running in testing
     * mode.
     * @private
     * @return {Void}
     */
    _runCallbacks: Ember.on('didRender', function() {
      if (this.get('turnCallbacksOff') || Ember.testing) { return; }

      let callbacks = this.get('automatedCallbacks');

      for (let i = 0, l = callbacks.length; i < l; i++) {
        _attemptCallback(this, callbacks[i]);
      }
    })
  });

  _hasRan = true;
}

export default {
  name: 'auto-run-component',
  initialize
};
