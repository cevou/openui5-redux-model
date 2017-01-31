sap.ui.define('redux.test.ReduxListBinding', [
  'redux/ReduxModel'
], function(ReduxModel) {
  describe('Redux Property Binding', function() {
    var oModel;
    var fnReducer;

    beforeEach(function () {
      fnReducer = function (state, action) {
        if (!state) return {
          test: 'test'
        };
        if (action.type === 'TEST') {
          return { test: 'test2' }
        } else if (action.type === 'TEST2') {
          return { test: 'test' }
        }
        return state;
      };
      var oStore = Redux.createStore(fnReducer);
      oModel = new ReduxModel(oStore);
      sap.ui.getCore().setModel(oModel);
    });

    it('should not not update and fire change if suspended', function() {
      var oBinding = oModel.bindProperty('/test');
      var fnSpy = expect.createSpy();
      var oStore = oModel.getStore();
      oBinding.attachChange(fnSpy);
      oBinding.suspend();
      oStore.dispatch({ type: 'TEST' });

      expect(oBinding.getValue()).toEqual('test');
      expect(fnSpy).toNotHaveBeenCalled();
      oBinding.resume();

      expect(oBinding.getValue()).toEqual('test2');
      expect(fnSpy).toHaveBeenCalled();
    });

    it('should update value if forced', function () {
      var oBinding = oModel.bindProperty('/test');
      var fnSpy = expect.createSpy();
      var oStore = oModel.getStore();
      oBinding.attachChange(fnSpy);
      oStore.dispatch({ type: 'TEST2' });
      expect(fnSpy).toNotHaveBeenCalled();
      oBinding.checkUpdate(true);
      expect(fnSpy).toHaveBeenCalled();
    });

    it('should throw exception if setValue is called', function () {
      var oBinding = oModel.bindProperty('/test');
      expect(function() {
        oBinding.setValue('test');
      }).toThrow(/Do not use setValue/);
    });

    it('should throw exception if setExternalValue is called', function () {
      var oBinding = oModel.bindProperty('/test');
      expect(function() {
        oBinding.setExternalValue('test');
      }).toThrow(/Do not use setExternalValue/);
    });
  });
});
