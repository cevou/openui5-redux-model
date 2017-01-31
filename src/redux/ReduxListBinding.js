sap.ui.define(['sap/ui/model/ClientListBinding', 'sap/ui/model/ChangeReason'], function (ClientListBinding, ChangeReason) {
  'use strict';

  var ReduxListBinding = ClientListBinding.extend('redux.ReduxListBinding');

  ReduxListBinding.prototype.getContexts = function (iStartIndex, iLength) {
    this.iLastStartIndex = iStartIndex;
    this.iLastLength = iLength;

    if (!iStartIndex) {
      iStartIndex = 0;
    }
    if (!iLength) {
      iLength = Math.min(this.iLength, this.oModel.iSizeLimit);
    }
    return this._getContexts(iStartIndex, iLength);
  };

  ReduxListBinding.prototype.getCurrentContexts = function() {
    return this.getContexts(this.iLastStartIndex, this.iLastLength);
  };

  ReduxListBinding.prototype.update = function () {
    var oList = this.oModel._getObject(this.sPath, this.oContext);
    if (oList) {
      if (jQuery.isArray(oList)) {
        this.oList = oList.slice(0);
      } else {
        throw new Error('A list binding must be represented by an array.');
      }
      this.updateIndices();
      this.applyFilter();
      this.applySort();
      this.iLength = this._getLength();
    } else {
      this.oList = [];
      this.aIndices = [];
      this.iLength = 0;
    }
  };

  ReduxListBinding.prototype.checkUpdate = function (bForceUpdate) {
    if (this.bSuspended && !this.bIgnoreSuspend && !bForceUpdate) {
      return;
    }

    var oList = this.oModel._getObject(this.sPath, this.oContext);
    if (!jQuery.sap.equal(this.oList, oList) || bForceUpdate) {
      this.update();
      this._fireChange({ reason: ChangeReason.Change });
    }
  };

  return ReduxListBinding;
});
