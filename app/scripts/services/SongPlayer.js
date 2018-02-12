(function(){
  function SongPlayer($rootScope, Fixtures) {
    var SongPlayer = {};

    /**
     * @desc currentAlbum holds the current (or selected) album object
     * @type {Object}
     */

    var currentAlbum = Fixtures.getAlbum();

    /**
     * @desc Buzz object audio file
     * @type {Object}
     */
    var currentBuzzObject = null;

    /**
    * @function stopSong
    * @desc Stops current Buzz object and set playing propery to null
    * @param {Object} song
    */
    var stopSong = function (song) {
      currentBuzzObject.stop();
      SongPlayer.currentSong.playing = null;
    };


    /**
    * @function setSong
    * @desc Stops currently playing song and loads new audio file as currentBuzzObject
    * @param {Object} song
    */
    var setSong = function(song) {
      if (currentBuzzObject) {
        stopSong(song);
      }

      currentBuzzObject = new buzz.sound(song.audioUrl, {
        formats: ['mp3'],
        preload: true
      });

      currentBuzzObject.bind('timeupdate', function() {
        $rootScope.$apply(function() {
          SongPlayer.currentTime= currentBuzzObject.getTime();
        });
      });


      SongPlayer.currentSong = song;
    };

    /**
    * @function playSong
    * @desc Plays current Buzz object and set "playing" propery of song to "true"
    * @param {Object} song
    */
    var playSong = function(song) {
      currentBuzzObject.play();
      if (song) {
        song.playing = true;
      };
    };

    /**
    * @function getSongIndex
    * @desc Gets the index inside the album for a given song
    * @param {Object} song
    */
    var getSongIndex = function(song) {
      return currentAlbum.songs.indexOf(song);
    };

    /**
     * @desc acitve Song audio file object from list of songs
     * @type {Object}
     */
    SongPlayer.currentSong = null;

    /**
    * @desc Current playback time (in seconds) of currently playing song
    * @type {Number}
    */
    SongPlayer.currentTime = null;

    SongPlayer.play = function(song) {


      song = song || SongPlayer.currentSong;
      if (SongPlayer.currentSong !== song) {
        setSong(song);
        playSong (song);
      } else if (SongPlayer.currentSong === song) {
        if (!currentBuzzObject) { return; }
        if (currentBuzzObject.isPaused()) {
          playSong(song);
        }
      }
    };

    SongPlayer.pause = function(song) {
      song = song || SongPlayer.currentSong;
      currentBuzzObject.pause();
      song.playing = false;
    };

    /**
    * @function .previous
    * @desc Method: gets the index for prevous song
    * @param {Object} song
    */
    SongPlayer.previous = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex--;

      if (currentSongIndex < 0) {
        stopSong(song);
      } else {
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong();
      };
    };

    /**
    * @function .next
    * @desc Method: start playing next song
    * @param {Object} song
    */
    SongPlayer.next = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex++;

      if (currentSongIndex >= currentAlbum.songs.length) {
        stopSong(song);
      } else {
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong();
      };

    };

    /**
    * @function setCurrentTime
    * @desc Set current time (in seconds) of currently playing songs
    * @param {Number} time
    */
    SongPlayer.setCurrentTime = function(time) {
      if (currentBuzzObject) {
        currentBuzzObject.setTime(time);
      }
    };

    /**
     * @desc attribute to hold value of the volume
     * @type {Number (0-100)}
     */
    SongPlayer.volume = 80;


    /**
    * @function setVolume
    * @desc method to update the volume on change, from Buzz library
    * @type
    */
    SongPlayer.setVolume = function(value) {
      if (currentBuzzObject) {
        SongPlayer.volume = value;
        currentBuzzObject.setVolume(value);
      }
    };

    return SongPlayer;
  }

  angular
    .module('blocJams')
    .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();
