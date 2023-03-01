import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import TrackPlayer, {
  useTrackPlayerEvents,
  usePlaybackState,
  useProgress,
  Event,
  State
} from 'react-native-track-player';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FaStar } from 'react-icons/fa';
import { setupPlayer, addTracks } from './trackPlayerServices';
import RNFS from 'react-native-fs'



function Playlist() {
  const [queue, setQueue] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(0);

  async function loadPlaylist() {
    const queue = await TrackPlayer.getQueue();
    setQueue(queue);
  }

  const searchForSongs = async () => {
    const getSong = async (filePath) => {
      try {
        const songData = await RNFS.readFile(filePath, 'base64');
        return songData;
      } catch (err) {
        console.error(err);
      }
    };
    // const rootPath = RNFS.ExternalStorageDirectoryPath;
    // const fileExtension = '.mp3';
    // const songs = [];
    // const check_repeated = [];
    // const path = rootPath + '/Music';
    // const contents = await RNFS.readDir(path);
    // const songList = [];
    // for (let i = 0; i < contents.length; i++) {
    //   const content = contents[i];
    //   console.log(content.name);
    //   const song = {
    //     id: i,
    //     url: 'file://' + content.path,
    //     title: content.name,
    //     artist: content.artist,
    //     artwork: '',
    //   };
    //   songList.push(song);
    // }
    // console.log(songList);
    // setSongs(songList);
    // TrackPlayer.add(songList);
  };

  useEffect(() => {
    searchForSongs();
    loadPlaylist();
  }, []);

  useTrackPlayerEvents([Event.PlaybackTrackChanged], (event) => {
    if (event.state == State.nextTrack) {
      TrackPlayer.getCurrentTrack().then((index) => setCurrentTrack(index));
    }
  });

  function PlaylistItem({ index, title, isCurrent }) {

    function handleItemPress() {
      TrackPlayer.skip(index);
    }

    return (
      <TouchableOpacity onPress={handleItemPress}>
        <Text
          style={{
            ...styles.playlistItem,
            ...{ backgroundColor: isCurrent ? '#666' : 'transparent' }
          }}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }
  async function handleShuffle() {
    let queue = await TrackPlayer.getQueue();
    await TrackPlayer.reset();
    queue.sort(() => Math.random() - 0.5);
    await TrackPlayer.add(queue);

    loadPlaylist()
  }

  return (
    <View>
      <View style={styles.playlist}>
        <FlatList
          data={queue}
          renderItem={({ item, index }) => <PlaylistItem
            index={index}
            title={item.title}
            isCurrent={currentTrack == index} />
          }
        />
      </View>
      <Controls onShuffle={handleShuffle} />
    </View>
  );


  // return (
  //   <View>
  //     <View style={styles.playlist}>
  //       <FlatList
  //         data={queue}
  //         renderItem={({ item, index }) => <PlaylistItem
  //           index={index}
  //           title={item.title}
  //           isCurrent={currentTrack == index} />
  //         }
  //       />
  //     </View>
  //     <Controls />
  //   </View>
  // );
}

function Controls({ onShuffle }) {
  const playerState = usePlaybackState();

  async function handlePlayPress() {
    if (await TrackPlayer.getState() == State.Playing) {
      TrackPlayer.pause();
    }
    else {
      TrackPlayer.play();
    }
  }

  return (
    <View style={{
      flexDirection: 'row',
      flexWrap: 'wrap', alignItems: 'center'
    }}>
      {/* <FaStar /> */}
      <Icon.Button
        name="arrow-left"
        size={28}
        backgroundColor="transparent"
        onPress={() => TrackPlayer.skipToPrevious()} />
      <Icon.Button
        name={playerState == State.Playing ? 'pause' : 'play'}
        size={28}
        backgroundColor="transparent"
        onPress={handlePlayPress} />
      <Icon.Button
        name="arrow-right"
        size={28}
        backgroundColor="transparent"
        onPress={() => TrackPlayer.skipToNext()}
      />
      <Icon.Button
        name="random"
        size={28}
        backgroundColor="transparent"
        onPress={onShuffle} />
    </View>
  );
}



function Header() {
  const [info, setInfo] = useState({});
  useEffect(() => {
    setTrackInfo();
  }, []);

  useTrackPlayerEvents([Event.PlaybackTrackChanged], (event) => {
    if (event.state == State.nextTrack) {
      setTrackInfo();
    }
  });

  async function setTrackInfo() {
    const track = await TrackPlayer.getCurrentTrack();
    const info = await TrackPlayer.getTrack(track);
    setInfo(info);
  }

  return (
    <View>
      <Text style={styles.songTitle}>{info.title}</Text>
      <Text style={styles.artistName}>{info.artist}</Text>
    </View>
  );
}

function TrackProgress() {
  const { position, duration } = useProgress(200);

  function format(seconds) {
    let mins = (parseInt(seconds / 60)).toString().padStart(2, '0');
    let secs = (Math.trunc(seconds) % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  return (
    <View>
      <Text style={styles.trackProgress}>
        {format(position)} / {format(duration)}
      </Text>
    </View>
  );
}


function App() {

  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    async function setup() {
      let isSetup = await setupPlayer();

      const queue = await TrackPlayer.getQueue();
      if (isSetup && queue.length <= 0) {
        await addTracks();
      }

      setIsPlayerReady(isSetup);
    }

    setup();
  }, []);

  if (!isPlayerReady) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#bbb" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <TrackProgress />
      <Playlist />
      {/* <Button title="Play" color="#777" onPress={() => TrackPlayer.play()} /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#112'
  },
  songTitle: {
    fontSize: 32,
    marginTop: 50,
    color: '#ccc'
  },
  artistName: {
    fontSize: 24,
    color: '#888'
  },
  playlist: {
    marginTop: 40,
    marginBottom: 40
  },
  playlistItem: {
    fontSize: 16,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 4
  },
  trackProgress: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 24,
    color: '#eee'
  },
});

export default App;