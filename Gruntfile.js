module.exports = function(grunt) {
    require('jit-grunt')(grunt);

    grunt.initConfig({
        less: {
            development: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: {
                    'public/css/styles.css': 'src/less/styles.less',
                    'public/css/baby.css': 'src/less/baby.less',
                    'public/css/chat.css': 'src/less/chat.less' 
                }
            }
        },
        uglify: {
            my_target: {
                files: {
                  'public/js/chat.js': ['src/js/chat_app.js', 'src/js/chat_ui.js', 'src/js/chat_socketio.js']
                }
            }
        },
        watch: {
            styles: {
                files: ['src/less/*.less', 'src/js/*.js'], // which files to watch
                tasks: ['less','uglify'],
                options: {
                    nospawn: true
                }
            }
        }
      });

    grunt.registerTask('default', ['less', 'uglify', 'watch']);
};