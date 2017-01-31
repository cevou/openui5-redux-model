# OpenUI5 Redux Model

[![Travis](https://img.shields.io/travis/cevou/openui5-redux-model.svg?maxAge=2592000?style=flat-square)](https://travis-ci.org/cevou/openui5-redux-model)
[![Coveralls](https://img.shields.io/coveralls/cevou/openui5-redux-model.svg?maxAge=2592000?style=flat-square)](https://coveralls.io/github/cevou/openui5-redux-model)

This repository provides a OpenUI5 library to integrate OpenUI5 with [Redux](http://redux.js.org/). This makes it
possible to write applications with predictable state with SAP OpenUI5.
 
 > Redux is a predictable state container for JavaScript apps.
 > It helps you write applications that behave consistently, run in different
 > environments (client, server, and native), and are easy to test.

## Install

To use this library download it via bower (like all other OpenUI5 packaged libraries).

```
bower install openui5-redux-model
```

Then list the library in the UI5 bootstrap tag.

```javascript
<script id="sap-ui-bootstrap"
  src="resources/sap-ui-core.js"
  data-sap-ui-libs="redux">
</script>
```

Make sure that the library files are server in the right directory. This is dependent on from where you load the
UI5 libraries.

You also need to integrate Redux somewhere in your application. It is **not** included with this library.
You can do this by loading it from a CDN via a `<script>` tag or by including the redux.js file directly somewhere
in your application.

By default Redux is available in a global variable. However, you can also include it via the UI5 module system.
To do that you need to register it with the UI5 core.

```javascript
jQuery.sap.registerModuleShims({
  'app/thirdparty/redux.min': {
    exports: 'Redux'
  }
});
```

## Usage

To use the redux model you first have to instantiate a redux store. You can find more information about what options
are available in the redux documentation. Then you can instantiate the Model and set it for the UI5 Core, your
component, ....

```javascript
var oStore = Redux.createStore(fnReducer);
var oModel = new ReduxModel(oStore);
sap.ui.getCore().setModel(oModel);
```

Now you can bind to the data in the store in your views by simply providing the path in the state (similar to a JSON
model).

```xml
<Button text="{/test}" />
```

To update the data in your view you just dispatch actions via your store and process them using your reducer(s).

## Advanced Usage

It is not a best practice to access data in your store directly because the structure of how your data is stored can
easily change as you develop your application. The better approach is to use selectors with a defined API. This
selectors are simple functions which get the current state passed as an argument and return data based on that.

You can use selectors with the redux model. Just use the special binding syntax in your views.

```$xslt
<Button text="{/selector/TestSelectorObject/selectorFunction}" />
```

All selector binding must start with `/selector`. The second part of the vbinding in the class/object in which the
selector is defined. It will be loaded via the UI5 module system. You can specify a prefix for all bindings as second
argument when you create the ReduxModel.

```javascript
var oStore = Redux.createStore(fnReducer);
var oModel = new ReduxModel(oStore, 'my.test.namespace');
sap.ui.getCore().setModel(oModel);
```

In the above example this would result in a class `my.test.namespace.TestSelectorObject` to be loaded. From this object
the property `selectorFunction` is used. The function will be called with two arguments. The first on in the current 
state and the second one the (optional) context.
