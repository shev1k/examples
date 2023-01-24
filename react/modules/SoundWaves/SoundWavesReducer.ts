import * as R from 'ramda';
import { FETCH_SOUND_WAVES_SUCCESS } from './SoundWavesActions';

const STATE_KEY = 'soundWaves';

interface IState {
  [transcriptId: string]: number[];
}

const initialState: IState = {};

export default (state: IState = initialState, action: any) => {
  switch (action.type) {
    case FETCH_SOUND_WAVES_SUCCESS:
      const { soundWaves, transcriptId } = action.payload;
      return R.assoc(transcriptId, soundWaves, state);

    default:
      return state;
  }
};

export const getSoundWaves = (
  state: Record<string, any>,
  transcriptId: string,
) => state[STATE_KEY][transcriptId] || [];
