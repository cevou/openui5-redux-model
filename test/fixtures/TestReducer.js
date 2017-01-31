sap.ui.define([], function() {
  var reducer = function(state, action) {
    if (!state) return {
      test: 'test1',
      list: [
        'foo',
        'bar'
      ],
      obj: {
        test: 0
      }
    };
    if (action.type === 'TEST1') {
      return {
        test: 'test2',
        list: [
          'foo',
          'bar'
        ]
      }
    }
    return state;
  };

  return {
    reducer: reducer,
    selectors: {
      getText: function(oState) {
        return oState.test;
      },
      getObjectById: function(oState, oContext) {
        return oState.list[oContext.getObject()];
      }
    }
  };
});
