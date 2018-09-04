module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'openui5'],
    browsers: ['Chrome'],
    openui5: {
      path: 'node_modules/@openui5/sap.ui.core/src/sap-ui-core.js',
      useMockServer: false
    },
    files: [
      'node_modules/expect/umd/expect.js',
      'node_modules/redux/dist/redux.js',
      'test/redux/*.test.js',
      { pattern: 'src/**/*', watched: true, included: false, served: true },
      { pattern: 'test/fixtures/*', watched: true, included: false, served: true },
      { pattern: 'node_modules/@openui5/sap.ui.core/src/**/*', watched: false, included: false, served: true }
    ],
    preprocessors: {
      'src/**/*.js': ['coverage']
    },
    reporters: ['progress', 'coverage'],
    client: {
      openui5: {
        config: {
          libs: 'redux',
          theme: 'base',
          resourceroots: {
            redux: './base/src/redux',
            fixtures: './base/test/fixtures'
          }
        }
      }
    },
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/'
    }
  });
};
