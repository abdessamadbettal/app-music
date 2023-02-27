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
  Event,
  State
} from 'react-native-track-player';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FaStar } from 'react-icons/fa';
import { setupPlayer, addTracks } from './trackPlayerServices';



function Playlist() {
  const [queue, setQueue] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(0);

  async function loadPlaylist() {
    const queue = await TrackPlayer.getQueue();
    setQueue(queue);
  }

  useEffect(() => {
    loadPlaylist();
  }, []);

  useTrackPlayerEvents([Event.PlaybackTrackChanged], (event) => {
    if(event.state == State.nextTrack) {
      TrackPlayer.getCurrentTrack().then((index) => setCurrentTrack(index));
    }
  });

  function PlaylistItem({index, title, isCurrent}) {

    function handleItemPress() {
      TrackPlayer.skip(index);
    }

    return (
      <TouchableOpacity onPress={handleItemPress}>
        <Text
          style={{...styles.playlistItem,
            ...{backgroundColor: isCurrent ? '#666' : 'transparent'}}}>
        {title}
        </Text>
      </TouchableOpacity>
    );
  }

  return(
    <View>
      <View style={styles.playlist}>
        <FlatList
          data={queue}
          renderItem={({item, index}) => <PlaylistItem
                                            index={index}
                                            title={item.title}
                                            isCurrent={currentTrack == index }/>
          }
        />
      </View>
      <Controls/>
    </View>
  );
}

function Controls({ onShuffle }) {
  const playerState = usePlaybackState();

  async function handlePlayPress() {
    if(await TrackPlayer.getState() == State.Playing) {
      TrackPlayer.pause();
    }
    else {
      TrackPlayer.play();
    }
  }

  return(
    <View style={{flexDirection: 'row',
      flexWrap: 'wrap', alignItems: 'center'}}>
        {/* <FaStar /> */}
        <Icon.Button
          name="arrow-left"
          size={28}
          backgroundColor="transparent"
          onPress={() => TrackPlayer.skipToPrevious()}/>
        <Icon.Button
          name={playerState == State.Playing ? 'pause' : 'play'}
          size={28}
          backgroundColor="transparent"
          onPress={handlePlayPress}/>
        <Icon.Button
          name="arrow-right"
          size={28}
          backgroundColor="transparent"
          onPress={() => TrackPlayer.skipToNext()}
          />
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
      <Playlist/>
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




// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

// import React from 'react';
// import type {PropsWithChildren} from 'react';
// import {
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   useColorScheme,
//   View,
// } from 'react-native';

// import {
//   Colors,
//   DebugInstructions,
//   Header,
//   LearnMoreLinks,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

// type SectionProps = PropsWithChildren<{
//   title: string;
// }>;

// function Section({children, title}: SectionProps): JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// }

// function App(): JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';

//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };

//   return (
//     <SafeAreaView style={backgroundStyle}>
//       <StatusBar
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//         backgroundColor={backgroundStyle.backgroundColor}
//       />
//       <ScrollView
//         contentInsetAdjustmentBehavior="automatic"
//         style={backgroundStyle}>
//         <Header />
//         <View
//           style={{
//             backgroundColor: isDarkMode ? Colors.black : Colors.white,
//           }}>
//           <Section title="Step One">
//             ddd <Text style={styles.highlight}>App.tsx</Text> to hhhhhh this
//             screen and then come back to see your edits.
//           </Section>
//           <Section title="See Your Changes">
//             <ReloadInstructions />
//           </Section>
//           <Section title="Debug">
//             <DebugInstructions />
//           </Section>
//           <Section title="Learn More">
//             Read the docs to discover what to do next:
//           </Section>
//           <LearnMoreLinks />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

// export default App;
