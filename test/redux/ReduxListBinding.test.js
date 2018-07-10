sap.ui.define('redux.test.ReduxListBinding', [
  'redux/ReduxModel',
  'sap/ui/model/Sorter'
], function(ReduxModel, Sorter) {
  describe('Redux List Binding', function() {
    var oModel;
    var fnReducer;

    beforeEach(function () {
      fnReducer = function (state, action) {
        if (!state) return {
          teamMembers: [
            {firstName: "Andreas", lastName: "Klark", gender: "male"},
            {firstName: "Peter", lastName: "Miller", gender: "male"},
            {firstName: "Gina", lastName: "Rush", gender: "female"},
            {firstName: "Steave", lastName: "Ander", gender: "male"},
            {firstName: "Michael", lastName: "Spring", gender: "male"},
            {firstName: "Marc", lastName: "Green", gender: "male"},
            {firstName: "Frank", lastName: "Wallace", gender: "male"}
          ],
          object: {
            test1: 'test1',
            test2: 'test2'
          }
        };
        if (action.type === 'TEST') {
          return { teamMembers: [] }
        }
        return state;
      };
      var oStore = Redux.createStore(fnReducer);
      oModel = new ReduxModel(oStore);
      sap.ui.getCore().setModel(oModel);
    });

    it('should return the correct data', function () {
      var oBinding = oModel.bindList('/teamMembers');
      expect(oBinding.getPath()).toEqual('/teamMembers');
      expect(oBinding.getModel()).toEqual(oModel);
      expect(oBinding.getLength()).toEqual(7);
      expect(oBinding.isLengthFinal()).toBe(true);
      oBinding.getContexts().forEach(function (oContext, iIndex) {
        expect(oContext.getPath()).toEqual('/teamMembers/' + iIndex);
      });
    });

    it('should not return contexts for wrong path', function() {
      var oBinding = oModel.bindList('/xyz');
      expect(oBinding.getPath()).toEqual('/xyz');
      expect(oBinding.getModel()).toEqual(oModel);
      expect(oBinding.getLength()).toEqual(0);
      expect(oBinding.getContexts().length).toBe(0);
    });

    it('should return the current contexts', function() {
      var oBinding = oModel.bindList('/teamMembers');
      oBinding.getContexts(0, 5);
      var aCurrentContexts = oBinding.getCurrentContexts();
      expect(aCurrentContexts.length).toBe(5);
    });

    it('should return a selection', function () {
      var oBinding = oModel.bindList('/teamMembers');
      var aContexts = oBinding.getContexts(1, 2);
      expect(aContexts.length).toEqual(2);
      expect(aContexts[0].getProperty('firstName')).toEqual('Peter');
      expect(aContexts[1].getProperty('firstName')).toEqual('Gina');
    });

    it('should fire change event', function() {
      var oBinding = oModel.bindList('/teamMembers');
      var oStore = oModel.getStore();
      var fnSpy = expect.createSpy();
      oBinding.attachChange(fnSpy);
      oStore.dispatch({ type: 'TEST' });
      expect(fnSpy).toHaveBeenCalled();
      expect(oBinding.getLength()).toEqual(0);
    });

    it('should update value if forced', function () {
      var oBinding = oModel.bindList('/teamMembers');
      var fnSpy = expect.createSpy();
      var oStore = oModel.getStore();
      oBinding.attachChange(fnSpy);
      oStore.dispatch({ type: 'TEST2' });
      expect(fnSpy).toNotHaveBeenCalled();
      oBinding.checkUpdate(true);
      expect(fnSpy).toHaveBeenCalled();
    });

    it('should sort data', function() {
      var oBinding = oModel.bindList('/teamMembers');
      var oSorter = new Sorter("firstName", false);
      var fnSpy = expect.createSpy();
      oBinding.attachChange(fnSpy);
      oBinding.sort(oSorter);
      expect(fnSpy).toHaveBeenCalled();

      var aContexts = oBinding.getContexts();
      expect(aContexts[0].getProperty("firstName")).toEqual("Andreas");
      expect(aContexts[3].getProperty("firstName")).toEqual("Marc");
      expect(aContexts[6].getProperty("firstName")).toEqual("Steave");

      oSorter = new Sorter("firstName", true);
      oBinding.sort(oSorter);
      aContexts = oBinding.getContexts();
      expect(aContexts[0].getProperty("firstName")).toEqual("Steave");
      expect(aContexts[3].getProperty("firstName")).toEqual("Marc");
      expect(aContexts[6].getProperty("firstName")).toEqual("Andreas");
    });

    it('should suspend and resume', function() {
      var oBinding = oModel.bindList('/teamMembers');
      var fnSpy = expect.createSpy();
      var oStore = oModel.getStore();
      oBinding.attachChange(fnSpy);
      expect(oBinding.getLength()).toEqual(7);
      oBinding.suspend();
      oStore.dispatch({ type: 'TEST' });
      oBinding.checkUpdate();
      expect(fnSpy).toNotHaveBeenCalled();
      expect(oBinding.getLength()).toEqual(7);
      oBinding.resume();
      expect(oBinding.getLength()).toEqual(0);
    });

    it('should return the correct data with object', function () {
      var oBinding = oModel.bindList('/object');
      expect(oBinding.getPath()).toEqual('/object');
      expect(oBinding.getModel()).toEqual(oModel);
      expect(oBinding.getLength()).toEqual(2);
      expect(oBinding.isLengthFinal()).toBe(true);

      const aContexts = oBinding.getContexts();

      expect(aContexts[0].getPath()).toEqual('/object/test1');
      expect(aContexts[1].getPath()).toEqual('/object/test2');
    });
  });
});
