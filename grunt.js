/*global module:false*/

var _ = require('underscore');
var path = require('path');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    watch: {
      files: '<config:slides.files>',
      tasks: 'slides'
    },
    slides: {
      files: 'slides/**/*.html'
    }
  });
  
  // Smash The Slides Together
  grunt.registerMultiTask('slides', 'Smash the slides together.', function() {
    var slides = grunt.file.expandFiles(this.file.src);
    
    var html = _.chain(slides)
      .sortBy(function(slide) {
        return parseInt(path.basename(slide).replace(path.extname(slide), ''), 10);
      })
      .reduce(function(previousValue, currentValue) {
        var contents = grunt.file.read(currentValue, 'utf8');
        grunt.log.write(currentValue + ' added to presentation. \n');
        return previousValue + contents;
      }, '').value();
    
    html = grunt.template.process(grunt.file.read('templates/container.html'), {
      markup: html
    });
    
    grunt.file.write('index.html', html);
  });

  // Default task.
  grunt.registerTask('default', 'slides');

};
