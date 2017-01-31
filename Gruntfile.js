module.exports = function(grunt) {
  grunt.initConfig({
    dir: {
      src: 'src',
      dist: 'dist'
    },
    copy: {
      files: {
        expand: true,
        cwd: 'src',
        src: '**/*',
        dest: 'dist'
      }
    },
    openui5_preload: {
      library: {
        options: {
          resources: 'src',
          dest: 'dist'
        },
        libraries: 'redux'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-openui5');

  // Default task
  grunt.registerTask('default', [
    'copy',
    'openui5_preload'
  ]);
};
