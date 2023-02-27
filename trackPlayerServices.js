import TrackPlayer, {
    AppKilledPlaybackBehavior,
    Capability,
    RepeatMode,
    Event
  } from 'react-native-track-player';
  
  export async function setupPlayer() {
    let isSetup = false;
    try {
      await TrackPlayer.getCurrentTrack();
      isSetup = true;
    }
    catch {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        android: {
          appKilledPlaybackBehavior:
            AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        },
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.SeekTo,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
        ],
        progressUpdateEventInterval: 2,
      });
  
      isSetup = true;
    }
    finally {
      return isSetup;
    }
  }
  
  export async function addTracks() {
    await TrackPlayer.add([
      {
        id: '1',
        url: require('./assets/baraka.mp3'),
        title: 'Fluidity',
        artist: 'tobylane',
        duration: 60,
      },
      {
        id: '2',
        url: require('./assets/salam.mp3'),
        title: 'Modern Chillout',
        artist: 'penguinmusic',
        duration: 66,
      },
      {
        id: '3',
        url: require('./assets/orhan.mp3'),
        title: 'Powerful Beat',
        artist: 'penguinmusic',
        duration: 73,
      }
    ]);
    await TrackPlayer.setRepeatMode(RepeatMode.Queue);
  }
  
  export async function playbackService() {
    // TODO: Attach remote event handlers
  }