'use strict';

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        clean: ['./dist'],
        concat: {
            options: {
                banner: '(function() {\n\'use strict\';\n',
                footer: '\n})();'
            },
            dist: {
                src: [
                    './src/ui-shifter-calendar.module.js',
                    './src/templates/*.js',
                    './src/component/*.js'
                ],
                dest: './dist/ui-shifter-calendar.js'
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
        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    './dist/ui-shifter-calendar.css': './src/ui-shifter-calendar.styles.scss'
                }
            }
        },
        uglify: {
            build: {
                src: ['dist/**/*.js'],
                dest: './dist/ui-shifter-calendar.min.js'
            }
        },
        connect: {
            server: {
                options: {
                    port: 2017,
                    open: true,
                    base: ['showcase', '.']
                }
            }
        },
        watch: {
            options: {
                livereload: true,
                livereloadOnError: false,
                spawn: false
            },
            scripts: {
                files: ['./src/**/*.js', './src/**/*.html', './src/**/*.scss'],
                tasks: ['default']
            }
        }
    });

    // Default task with original/minified js files + compiled scss -> css.
    grunt.registerTask('default', ['clean', 'html2js', 'sass', 'concat', 'uglify']);

    // connect - local development server
    grunt.registerTask('serve', ['connect', 'watch']);

};