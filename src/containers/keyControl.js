import merge from 'lodash.merge';

import { loopOptions } from '../util/constants';
import { play, pause, mute, volume, loop, fullScreen } from '../actions/jPlayerActions';
import { connectWithId } from '../util/index';
import KeyControl from '../components/keyControl';

const mapStateToProps = ({ jPlayers }, id) => ({
  paused: jPlayers[id].paused,
  mediaSettings: jPlayers[id].mediaSettings,
  audioFullScreen: jPlayers[id].audioFullScreen,
  fullScreen: jPlayers[id].fullScreen,
  muted: jPlayers[id].muted,
  volume: jPlayers[id].volume,
  loop: jPlayers[id].loop,
  keyBindings: jPlayers[id].keyBindings,
  focus: jPlayers[id].focus,
});

const mergeProps = (stateProps, { dispatch }, { id }) => ({
  focus: stateProps.focus,
  keyBindings: merge({}, {
    play: {
      key: 80, // p
      fn: () => (stateProps.paused ? dispatch(play(id)) :
                                      dispatch(pause(id))),
    },
    fullScreen: {
      key: 70, // f
      fn: () => {
        if ((stateProps.mediaSettings.available && stateProps.mediaSettings.video)
            || stateProps.audioFullScreen) {
          dispatch(fullScreen(!stateProps.fullScreen, id));
        }
      },
    },
    mute: {
      key: 77, // m
      fn: () => dispatch(mute(!stateProps.muted, id)),
    },
    volumeUp: {
      key: 190, // .
      fn: () => {
        dispatch(volume(stateProps.volume + 0.1, id));
      },
    },
    volumeDown: {
      key: 188, // ,
      fn: () => dispatch(volume(stateProps.volume - 0.1, id)),
    },
    loop: {
      key: 76, // l
      fn: () => (stateProps.loop === loopOptions.LOOP ?
                  dispatch(loop(loopOptions.OFF, id)) :
                  dispatch(loop(loopOptions.LOOP, id))),
    },
  }, stateProps.keyBindings),
});

export default connectWithId(mapStateToProps, null, mergeProps)(KeyControl);