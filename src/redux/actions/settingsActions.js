import { SET_SETTINGS, UPDATE_SETTINGS } from '../types';

// Set all settings at once (usually from Electron store)
export const setSettings = (settings) => {
  return {
    type: SET_SETTINGS,
    payload: settings
  };
};

// Update specific settings
export const updateSettings = (settings) => async (dispatch) => {
  try {
    // If Electron is available, save settings to Electron store
    if (window.electron) {
      await window.electron.saveSettings(settings);
    }
    
    dispatch({
      type: UPDATE_SETTINGS,
      payload: settings
    });
    
    return true;
  } catch (error) {
    console.error('保存设置时出错:', error);
    return false;
  }
};
