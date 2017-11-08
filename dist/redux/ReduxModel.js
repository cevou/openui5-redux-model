sap.ui.define([
  'sap/ui/model/ClientModel',
  'sap/ui/model/BindingMode',
  'sap/ui/model/Context',
  './ReduxPropertyBinding',
  './ReduxListBinding'
], function (ClientModel, BindingMode, Context, ReduxPropertyBinding, ReduxListBinding) {
  'use strict';

  var ReduxModel = ClientModel.extend('redux.ReduxModel', {
    constructor: function constructor(oStore, oSelectors) {
      ClientModel.call(this);

      if (!oStore) {
        throw new Error('Please pass a redux store instance to the redux model.');
      }
      var that = this;

      this.oStore = oStore;
      this.oSelectors = oSelectors  || {};
      this.sDefaultBindingMode = BindingMode.OneWay;
      this.mSupportedBindingModes = { OneWay: true, TwoWay: false, OneTime: false };

      oStore.subscribe(function () {
        that.checkUpdate();
      });
    }
  });

  ReduxModel.prototype.bindProperty = function (sPath, oContext, mParameters) {
    return new ReduxPropertyBinding(this, sPath, oContext, mParameters);
  };

  ReduxModel.prototype.bindList = function (sPath, oContext, aSorters, aFilters, mParameters) {
    return new ReduxListBinding(this, sPath, oContext, aSorters, aFilters, mParameters);
  };

  ReduxModel.prototype.setProperty = function () {
    throw new Error('Do not use setProperty on the redux model. Use actions to update the state');
  };

  ReduxModel.prototype.getProperty = function (sPath, oContext) {
    return this._getObject(sPath, oContext);
  };

  ReduxModel.prototype.getStore = function () {
    return this.oStore;
  };

  ReduxModel.prototype._getObject = function (sPath, oContext) {
    var oNode = null;
    if (oContext instanceof Context) {
      oNode = this._getObject(oContext.getPath());
    } else if (oContext) {
      oNode = oContext;
    }
    if (!sPath) {
      return oNode;
    }

    var oState = this.oStore.getState();
    var iIndex = 0;
    var aParts = sPath.split('/');
    if (!aParts[0]) {
      // absolute path starting with slash
      if (aParts[1] === 'selector') {
        oNode = this.oSelectors[aParts[2]](this.oStore.getState(), oContext);
        iIndex = 3;
      } else {
        oNode = oState[aParts[1]];
        iIndex = 2;
      }
    }
    while (oNode && aParts[iIndex]) {
      var sPart = aParts[iIndex];
      var oTmpNode = oNode[sPart];
      if (typeof oTmpNode === 'function') {
        oNode = oTmpNode(this.oStore.getState(), oContext);
      } else {
        oNode = oTmpNode;
      }
      iIndex += 1;
    }
    return oNode;
  };

  return ReduxModel;
});
