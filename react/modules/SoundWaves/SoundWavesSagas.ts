import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { storage } from 'modules/firebase/firebase.app';
import { getPresentTranscript } from 'modules/transcript/TranscriptReducer';
import { SELECT_TRANSCRIPT } from 'modules/transcript/TranscriptConstants';
import { request } from 'utils/request';
import {
  fetchSoundWavesStart,
  fetchSoundWavesSuccess,
  fetchSoundWavesFail,
} from './SoundWavesActions';

function* fetchSoundWavesSaga() {
  const transcript = yield select(getPresentTranscript);
  if (transcript.gsUrls.waveform) {
    yield put(fetchSoundWavesStart(transcript.id));

    try {
      const waveformUrl = yield call(() =>
        storage.refFromURL(transcript.gsUrls.waveform).getDownloadURL(),
      );

      if (!waveformUrl) {
        yield put(fetchSoundWavesFail());
        return;
      }

      const soundWaves = yield call(async () => {
        const response = await request.get(waveformUrl);

        return response.data;
      });

      if (!soundWaves) {
        fetchSoundWavesFail();
        return;
      }

      yield put(fetchSoundWavesSuccess(soundWaves, transcript.id));
    } catch (error) {
      return;
    }
  }
}

function* soundWavesSagas() {
  yield all([takeLatest(SELECT_TRANSCRIPT, fetchSoundWavesSaga)]);
}

export default soundWavesSagas;
