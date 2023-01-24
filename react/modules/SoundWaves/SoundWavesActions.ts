import { createAction } from 'typesafe-actions';

const namespace = 'soundWaves';

export const FETCH_SOUND_WAVES_START = `${namespace}/FETCH_SOUND_WAVES_START`;
export const FETCH_SOUND_WAVES_SUCCESS = `${namespace}/FETCH_SOUND_WAVES_SUCCESS`;
export const FETCH_SOUND_WAVES_FAIL = `${namespace}/FETCH_SOUND_WAVES_FAIL`;

export const fetchSoundWavesStart = createAction(
  FETCH_SOUND_WAVES_START,
  action => (transcriptId: string) => action({ transcriptId }),
);

export const fetchSoundWavesSuccess = createAction(
  FETCH_SOUND_WAVES_SUCCESS,
  action => (soundWaves: number[], transcriptId: string) =>
    action({ soundWaves, transcriptId }),
);

export const fetchSoundWavesFail = createAction(
  FETCH_SOUND_WAVES_SUCCESS,
  action => () => action(),
);
