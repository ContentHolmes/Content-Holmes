module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jsdoc : {
        dist : {
            src: ['./src/js/','README.md'],
            jsdoc: './node_modules/.bin/jsdoc',
            options: {
                destination: 'docs',
                configure: 'jsdoc.json',
                template: './node_modules/ink-docstrap/template',
                recurse: true
            }
        }
    }
  });

  grunt.loadNpmTasks('grunt-jsdoc');

};