import { SET_SETTINGS, UPDATE_SETTINGS } from '../types';

const initialState = {
  openaiApiKey: '',
  openaiApiUrl: '',
  openaiModel: 'gpt-4',
  whisperModel: 'whisper-1',
  language: 'zh-CN',
  theme: 'light',
  autoSave: true
};

const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SETTINGS:
      return {
        ...state,
        ...action.payload
      };
    case UPDATE_SETTINGS:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};

export default settingsReducer;
