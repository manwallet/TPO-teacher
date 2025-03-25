import {
  FETCH_PROGRESS_REQUEST,
  FETCH_PROGRESS_SUCCESS,
  FETCH_PROGRESS_FAILURE,
  UPDATE_PROGRESS
} from '../types';

const initialState = {
  progress: {
    reading: {
      completed: 0,
      total: 0,
      score: 0
    },
    listening: {
      completed: 0,
      total: 0,
      score: 0
    },
    speaking: {
      completed: 0,
      total: 0,
      score: 0
    },
    writing: {
      completed: 0,
      total: 0,
      score: 0
    },
    vocabulary: {
      learned: 0,
      total: 0
    }
  },
  history: [],
  loading: false,
  error: null
};

const progressReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PROGRESS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_PROGRESS_SUCCESS:
      return {
        ...state,
        loading: false,
        progress: action.payload.progress,
        history: action.payload.history,
        error: null
      };
    case FETCH_PROGRESS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case UPDATE_PROGRESS:
      return {
        ...state,
        progress: {
          ...state.progress,
          [action.payload.section]: {
            ...state.progress[action.payload.section],
            ...action.payload.data
          }
        },
        history: action.payload.historyEntry 
          ? [...state.history, action.payload.historyEntry]
          : state.history
      };
    default:
      return state;
  }
};

export default progressReducer;
