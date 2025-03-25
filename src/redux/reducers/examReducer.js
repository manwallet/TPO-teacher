import {
  FETCH_EXAMS_REQUEST,
  FETCH_EXAMS_SUCCESS,
  FETCH_EXAMS_FAILURE,
  SET_CURRENT_EXAM,
  SET_EXAM_ANSWER,
  SUBMIT_EXAM_REQUEST,
  SUBMIT_EXAM_SUCCESS,
  SUBMIT_EXAM_FAILURE,
  FETCH_READING_SUCCESS,
  FETCH_LISTENING_SUCCESS,
  FETCH_SPEAKING_SUCCESS,
  FETCH_WRITING_SUCCESS,
  SET_AUDIO_PLAYING,
  SAVE_RECORDING,
  SAVE_ESSAY,
  ANALYZE_ESSAY_SUCCESS,
  ANALYZE_SPEAKING_SUCCESS
} from '../types';

const initialState = {
  exams: [],
  currentExam: null,
  currentSection: null,
  answers: {},
  recordings: {},
  essays: {},
  analyses: {},
  loading: false,
  error: null,
  audioPlaying: false,
  submitting: false
};

const examReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_EXAMS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_EXAMS_SUCCESS:
      return {
        ...state,
        loading: false,
        exams: action.payload,
        error: null
      };
    case FETCH_EXAMS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case SET_CURRENT_EXAM:
      return {
        ...state,
        currentExam: action.payload.exam,
        currentSection: action.payload.section || state.currentSection
      };
    case SET_EXAM_ANSWER:
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.questionId]: action.payload.answer
        }
      };
    case SUBMIT_EXAM_REQUEST:
      return {
        ...state,
        submitting: true
      };
    case SUBMIT_EXAM_SUCCESS:
      return {
        ...state,
        submitting: false,
        // Reset answers for the submitted exam
        answers: Object.keys(state.answers).reduce((acc, key) => {
          if (!key.startsWith(action.payload.examId)) {
            acc[key] = state.answers[key];
          }
          return acc;
        }, {})
      };
    case SUBMIT_EXAM_FAILURE:
      return {
        ...state,
        submitting: false,
        error: action.payload
      };
    case FETCH_READING_SUCCESS:
    case FETCH_LISTENING_SUCCESS:
    case FETCH_SPEAKING_SUCCESS:
    case FETCH_WRITING_SUCCESS:
      return {
        ...state,
        loading: false,
        currentSection: {
          ...action.payload
        }
      };
    case SET_AUDIO_PLAYING:
      return {
        ...state,
        audioPlaying: action.payload
      };
    case SAVE_RECORDING:
      return {
        ...state,
        recordings: {
          ...state.recordings,
          [action.payload.questionId]: action.payload.recording
        }
      };
    case SAVE_ESSAY:
      return {
        ...state,
        essays: {
          ...state.essays,
          [action.payload.questionId]: action.payload.essay
        }
      };
    case ANALYZE_ESSAY_SUCCESS:
    case ANALYZE_SPEAKING_SUCCESS:
      return {
        ...state,
        analyses: {
          ...state.analyses,
          [action.payload.questionId]: action.payload.analysis
        }
      };
    default:
      return state;
  }
};

export default examReducer;
