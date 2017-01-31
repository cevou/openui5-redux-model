sap.ui.define(['sap/ui/model/ClientPropertyBinding', 'sap/ui/model/ChangeReason'], function (ClientPropertyBinding, ChangeReason) {
  'use strict';

  var ReduxPropertyBinding = ClientPropertyBinding.extend('redux.ReduxPropertyBinding');

  ReduxPropertyBinding.prototype.checkUpdate = function (bForceUpdate) {
    if (this.bSuspended && !bForceUpdate) {
      return;
    }

    var oValue = this._getValue();
    // optimize for not firing the events when unneeded
    if (!jQuery.sap.equal(oValue, this.oValue) || bForceUpdate) {
      this.oValue = oValue;
      this._fireChange({ reason: ChangeReason.Change });
    }
  };

  ReduxPropertyBinding.prototype.setValue = function () {
    throw new Error('Do not use setValue on a ReduxBinding. Use actions to update the state');
  };

  ReduxPropertyBinding.prototype.setExternalValue = function () {
    throw new Error('Do not use setExternalValue on a ReduxBinding. Use actions to update the state');
  };

  return ReduxPropertyBinding;
});
