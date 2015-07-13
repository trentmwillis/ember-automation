# Ember Automation

[![Build Status](https://travis-ci.org/trentmwillis/ember-automation.svg?branch=master)](https://travis-ci.org/trentmwillis/ember-automation)

This addon provides hooks to help automate testing and development in Ember-CLI
workflows.

## Testing

In testing, automation is given for checking state changes by running callbacks
at the end of every render in your acceptance tests. This helps ensure every
state of your user flows is valid.

### Testing: API

The API for Ember Automation lives under the global `automation` object during
your tests. It provides some hooks and methods for adding functionality and
controlling when that functionality runs.

#### `afterRender`

The `afterRender` function provides a hook for adding additional functionality
to the automation framework. It accepts a callback function as the parameter
which will run after every render during acceptance tests.

```javascript
automation.afterRender(function accessibilityCheck() { ... });
```

#### `onAutomation`

The `onAutomation` function provides a hook for adding functionality at the
start of each test module or whenever you turn the automation on. This could
include things such as stubbing out methods or adjust the test container
visuals.

```javascript
automation.onAutomation(function adjustContainer() { ... });
```

#### `offAutomation`

The `offAutomation` function provides a hook for adding functionality at the end
of each test module or whenever you turn the automation off. This could
include things such as destroying mocks or resetting the test container visuals.

```javascript
automation.offAutomation(function destroyMocks() { ... });
```

Note: _these callbacks also run at the end of all tests to ensure everything is
reset to it's original state._

#### `on`

The `on` function allows you to manually turn the automation on. This can be
used to enable automation during unit tests or in conjunction with `off` to
control which tests inside a module actually have automation.

```javascript
automation.on();
```

#### `off`

The `off` function allows you to manually turn the automation off. This can be
used to disable automation during acceptance tests or in conjunction with `on`
to control which tests inside a module actually have automation.

```javascript
automation.off();
```

## Development

_Note: Only supported for Ember 1.13 and up._

In development, automation is given for whenever the visual state of one of your
components updates, a.k.a. during `didRender`. This allows automating tasks
such as checking DOM makeup or recording state changes while actively working
on a part of your application.

Note: _the code for these features will not ship to production or in project's
using an older version of Ember._

### Development: API

#### `automatedCallbacks`

The `automatedCallbacks` property is an `Array` of functions to be run on
`didRender`:

```javascript
Ember.Component.extend({
  automatedCallbacks: [
    function checkTranslation() {
      // Ensure language is correct
    },
    function checkAccessibility() {
      // Ensure component is accessible
    }
  ]
});
```

An error will be thrown if something other than a `Function` is listed as an
entry in the array.

#### `addCallback`

The `addCallback` method is used to easily add additional callbacks to the
`automatedCallbacks` array:

```
let SubComponent = BaseComponent.extend({
  extendCallbacks: Ember.on('init', function() {
    this.addCallback(this.get('specificComponentAudit'));
  });
});
```

The primary use case for this is when you need to extend or dynamically add
callbacks to a component. Otherwise, it is usually better to simply defined the
`automatedCallbacks` array.

#### `turnCallbacksOff`

The `turnCallbacksOff` property provides an easy boolean switch for turning off
the automated callbacks. Since this is Ember, you can even use a computed
property to conditionally choose whether to use them or not:

```javascript
Ember.Component.extend({
  turnCallbacksOff: Ember.computed.alias('isEnglishUI');
});
```

### Development: Extending All Components

Chances are, if you are adding a callback for auto-run, then you probably want
it to apply to all your components. This is easily accomplished using an
initializer:

```javascript
export function initialize(application) {
  Ember.Component.reopen({
    automatedCallbacks: [callback, ...]
  });
}
```

However, there is a "gotcha" involved with this: this code will ship with your
application. That is probably undesirable, as it should only apply to your
development cycles. Therefore, to avoid this it is highly recommend to filter
out any initializers during your build pipeline, like has been [done for this
addon](https://github.com/trentmwillis/ember-automation/blob/master/index.js).
