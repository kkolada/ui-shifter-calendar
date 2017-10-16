'use strict';

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        clean: ['./dist'],
        concat: {
            dist: {
                src: [
                    './src/ui-shifter-calendar.module.js',
                    './src/templates/*.js',
                    './src/component/*.js'
                ],
                dest: './dist/uiShifterCalendar.js'
            }
        },
        html2js: {
            app: {
                options: {
                    base: './',
                    useStrict: true,
                    quoteChar: '\'',
                    htmlmin: {
                        collapseBooleanAttributes: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: true,
                        removeComments: true,
                        removeEmptyAttributes: true,
                        removeRedundantAttributes: true,
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributes: true
                    }
                },
                src: ['./src/templates/{,*/}*.html'],
                dest: './src/templates/ui-shifter-calendar.templates.js',
                module: 'UI.Shifter.Calendar'
            }
        },
        uglify: {
            build: {
                src: ['dist/**/*.js'],
                dest: 'ui-shifter-calendar.min.js'
            }
        },
        connect: {
            server: {
                options: {
                    port: 2017,
                    open: true,
                    debug: true,
                    keepalive: true,
                    hostname: '*',
                    base: ['showcase', '.']
                }
            }
        }
    });

    // Default task.
    grunt.registerTask('default', ['clean', 'html2js', 'concat']);

    // uglify
    grunt.registerTask('minify', ['uglify']);

    //connect - local server
    grunt.registerTask('serve', ['connect']);

};