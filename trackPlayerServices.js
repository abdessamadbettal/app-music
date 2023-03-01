import TrackPlayer, {
    AppKilledPlaybackBehavior,
    Capability,
    RepeatMode,
    Event
  } from 'react-native-track-player';
  import RNFS from 'react-native-fs'


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

    // get music from my mobile
    const path = `${RNFS.ExternalStorageDirectoryPath}/Mp33`;
    const files = await RNFS.readDir(path);
    console.log("files",files);
    const musicList = files.map((item) => {
      return {
        id: item.name,
        url: item.path,
        title: item.name,
        artist: 'unknown',
        duration: 60,
      }
    });
    console.log("musicList",musicList);
    await TrackPlayer.add(musicList);

    await TrackPlayer.setRepeatMode(RepeatMode.Queue); // is use for repeat the music
  }
  
  export async function playbackService() {
    // TODO: Attach remote event handlers
  }