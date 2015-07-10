# Ember Automation

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

**`afterRender`**

The `afterRender` function provides a hook for adding additional functionality
to the automation framework. It accepts a callback function as the parameter
which will run after every render during acceptance tests.

```javascript
automation.afterRender(function accessibilityCheck() { ... });
```

**`onAutomation`**

The `onAutomation` function provides a hook for adding functionality at the
start of each test module or whenever you turn the automation on. This could
include things such as stubbing out methods or adjust the test container
visuals.

```javascript
automation.onAutomation(function adjustContainer() { ... });
```

**`offAutomation`**

The `offAutomation` function provides a hook for adding functionality at the end
of each test module or whenever you turn the automation off. This could
include things such as destroying mocks or resetting the test container visuals.

```javascript
automation.offAutomation(function destroyMocks() { ... });
```

Note: these callbacks also run at the end of all tests to ensure everything is
reset to it's original state.

**`on`**

The `on` function allows you to manually turn the automation on. This can be
used to enable automation during unit tests or in conjunction with `off` to
control which tests inside a module actually have automation.

**`off`**

The `off` function allows you to manually turn the automation off. This can be
used to disable automation during acceptance tests or in conjunction with `on`
to control which tests inside a module actually have automation.
