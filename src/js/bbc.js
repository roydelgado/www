$(function() {
    'use strict';

    var $results = $('.results')
      , $form = $('.album-editor')
      , $formCover = $form.find('#cover')
      , $formArtist = $form.find('#artist')
      , $formTitle = $form.find('#title')
      , $formLabel = $form.find('#label')
      , $formPlaylist = $form.find('#playlist')
      , playlist
      , limit = 10
      , artistId
      , imgRegex = /\.(jpe?g|png|gif|bmp)$/i
      , httpRegex = /(http:\/\/|https:\/\/)/i
      , playlistJSON = $.ajax('http://www.json-generator.com/api/json/get/cuMdczItsO').done(function(json) {
            playlist = json.playlist.a;
            _renderData();
        });
      // , playlistJSON = $.ajax({
      //       type: 'GET',
      //       url: 'http://www.bbc.co.uk/radio1/playlist.json',
      //       // beforeSend: function (request)
      //       // {
      //       //     request.setRequestHeader("Access-Control-Allow-Origin", "*");
      //       // },
      //       dataType: "json"
      //   });

    function _renderData(){
        var el = '<table class="albums"><tr><th>Cover Image</th><th>Artist</th><th>Title</th><th>Label</th><th>playlist</th><th>Options</th></tr>'
          , album;
        //console.log(playlist);
        for (var i = 0; i < limit ; i++) {
            //console.log('inside', i)
            album = playlist[i];
            el += '<tr>'
                + '<td>';
            if (album['image']) {
                el += '<img class="albums__cover" src="'+album['image']+'" />';
            }
            el += '</td>'
                + '<td>' + album['artist'] + '</td>'
                + '<td>'+ album['title'] + '</td>'
                + '<td>' ;
            if (album['label']) {
                el += album['label'] ;
            }
            el += '</td>'
                + '<td>'+ album['playlist'] + '</td>'
                + '<td><a href="#" class="album__edit" data-aid="' + album['artist_id']
                + '" data-id="' + i + '" >Edit</a></td>'
                + '</tr>';
        }

        el += '</table>'
        //console.log(el)

        $results.html(el)
    }

    function _showForm(id) {
        //console.log(id)
        var albumData = playlist[id];
        console.log(albumData.playlist)
        $formCover.val(albumData.image);
        $formArtist.val(albumData.artist);
        $formTitle.val(albumData.title);
        $formLabel.val(albumData.label);
        $formPlaylist.val(albumData.playlist);
        $form.show();
    }

    function _sendData(data) {

    }

    function _validateForm() {
       if ($formCover.val() !== '')  {
            if (!$formCover.val().match(imgRegex)) {
                alert('invalid image specified');
                return false;
            }
            if (!$formCover.val().match(httpRegex)) {
                alert ('inavlid url');
                return false;
            }
       }

       if (!$formArtist.val()) {
            alert('artist name not specified');
            return false;
       }

       if (!$formTitle.val()) {
            alert('album title not specified');
            return false;
       }

       if ($formPlaylist.val() === '')  {
            alert('can not have an empty playlist');
            return false;
       }

       if (!$formPlaylist.val().match(httpRegex)) {
                alert ('inavlid url');
                return false;
        }

       return true;

    }

    $('body').on('click', 'a.album__edit', function(e) {
        e.preventDefault();
        artistId = $(this).data('aid');
        _showForm($(this).data('id'));
    })

    $('.album-editor').on('submit', function(e) {
        e.preventDefault();
        if (_validateForm()) {
            var data = {
                image: $formCover.val(),
                artist: $formArtist.val(),
                title: $formTitle.val(),
                label: $formLabel.val(),
                playlist: $formCover.val()
            };
            console.log('data to send', data);
            $.ajax({
                url: 'http://www.bbc.co.uk/radio1/artist/id/' + artistId  ,
                type: "POST",
                data: JSON.stringify(data),
                contentType: "application/json",
                complete: function(data, status) {
                    if (status === 'error') {
                        alert('please try again later');
                        console.log(data);
                    }
                }
            });
        }

    })

    $('#editor-close').on('click', function(e) {
        e.preventDefault();
        $form.hide();
    });



});