sap.ui.define('redux.test.ReduxBinding', [
  'sap/ui/model/Context',
  'redux/ReduxModel',
  'fixtures/TestReducer'
], function(Context, ReduxModel, TestReducer) {
  describe('Redux Model', function() {
    var oModel;

    beforeEach(function () {
      var oStore = Redux.createStore(TestReducer.reducer);
      oModel = new ReduxModel(oStore, 'fixtures');
      sap.ui.getCore().setModel(oModel);
    });

    it('should throw exception if no store is defined', function () {
      expect(function() {
        new ReduxModel();
      }).toThrow(/Please pass a redux store/);
    });

    it('should throw exception if set property is called', function () {
      expect(function() {
        oModel.setProperty();
      }).toThrow(/Do not use setProperty/);
    });

    it('should query data from the state', function () {
      var oStore = oModel.getStore();
      expect(oModel.getProperty('/test')).toEqual('test1');
      oStore.dispatch({ type: 'TEST1' });
      expect(oModel.getProperty('/test')).toEqual('test2');
    });

    it('should query using selector', function () {
      var oStore = oModel.getStore();
      expect(oModel.getProperty('/selector/TestReducer/selectors/getText')).toEqual('test1');
      oStore.dispatch({ type: 'TEST1' });
      expect(oModel.getProperty('/selector/TestReducer/selectors/getText')).toEqual('test2');
    });

    it('should query using selector and context', function () {
      var oStore = oModel.getStore();
      var oContext = new Context(oModel, '/obj/test');
      expect(oModel.getProperty('/selector/TestReducer/selectors/getObjectById', oContext)).toEqual('foo');
    });
  });
});
