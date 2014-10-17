/*global module:false*/
module.exports = function(grunt) {

  var geminiSettings = grunt.file.readJSON('gemini.json');

  // Project configuration.
  grunt.initConfig({
    // Metadata
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
    '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
    '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
    ' Licensed MIT */\n',

    // Task configuration.
    requirejs: {
      compile: {
        options: {
          appDir: "src/",
          dir: 'dist/',
          baseUrl: './',
          mainConfigFile: 'src/js/script.js',
          urlArgs: "bust=t" + Date.now(),
          removeCombined: true,
          optimizeCss: 'none',
          skipDirOptimize: true,
          preserveLicenseComments: false,
          modules: [
            {
              name: 'js/script',
              include: ['requireLib']
            }
          ]
        }
      }
    },
    clean: {
      // Delete unnecessary build modules
      build: [
        'dist/bower_components',
        'dist/sass'
      ]
    },
    compass: {
      options: {
        sassDir: 'src/sass',
        cssDir: 'dist/css'
      },
      dist: {
        options: {
          environment: 'production',
          outputStyle: 'compressed'
        }
      },
      sourcemap: {
        options: {
          outputStyle: 'expanded',
          sourcemap: true
        }
      },
      dev: {
        options: {
          outputStyle: 'expanded',
          watch: true,
          poll: true
        }
      }
    },
    webfont: {
      icons: {
        src: geminiSettings.icons.map(function(path){
          return 'src/' + path;
        }),
        dest: 'dist/fonts',
        destCss: 'src/sass/icons',
        options: {
          engine: 'node',
          syntax: 'bootstrap',
          stylesheet: 'scss',
          font: 'icons',
          styles: 'font',
          relativeFontPath: '../fonts',
          templateOptions: {
            classPrefix: 'icon--'
          }
        }
      }
    },
    favicons: {
      options: {
        appleTouchBackgroundColor: "#fff",
        firefox: true
      },
      icons: {
        src: 'src/img/favicon.png',
        dest: 'dist/img/icons'
      },
    },
    preprocess : {
      dev : {
        src : './index.template.html',
        dest : './index.html',
        options: {
          context : {
            DEVELOPMENT: true
          }
        }
      },
      prod : {
        src : './index.template.html',
        dest : './index.html',
        options: {
          context : {
            PRODUCTION: true
          }
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-webfont');
  grunt.loadNpmTasks('grunt-favicons');
  grunt.loadNpmTasks('grunt-preprocess');

  // Default task.
  grunt.registerTask('default', ['webfont', 'preprocess:dev', 'compass:dev']);

  // Package the JS for distrubution
  grunt.registerTask('build', ['requirejs', 'webfont', 'favicons', 'compass:dist', 'clean:build', 'preprocess:prod']);

};
