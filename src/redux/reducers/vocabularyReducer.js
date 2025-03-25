import {
  FETCH_VOCABULARY_REQUEST,
  FETCH_VOCABULARY_SUCCESS,
  FETCH_VOCABULARY_FAILURE,
  ADD_VOCABULARY,
  REMOVE_VOCABULARY,
  UPDATE_VOCABULARY,
  MARK_VOCABULARY_LEARNED
} from '../types';

const initialState = {
  vocabularies: [],
  loading: false,
  error: null
};

const vocabularyReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_VOCABULARY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_VOCABULARY_SUCCESS:
      return {
        ...state,
        loading: false,
        vocabularies: action.payload,
        error: null
      };
    case FETCH_VOCABULARY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case ADD_VOCABULARY:
      return {
        ...state,
        vocabularies: [...state.vocabularies, action.payload]
      };
    case REMOVE_VOCABULARY:
      return {
        ...state,
        vocabularies: state.vocabularies.filter(
          vocab => vocab.id !== action.payload
        )
      };
    case UPDATE_VOCABULARY:
      return {
        ...state,
        vocabularies: state.vocabularies.map(vocab =>
          vocab.id === action.payload.id ? action.payload : vocab
        )
      };
    case MARK_VOCABULARY_LEARNED:
      return {
        ...state,
        vocabularies: state.vocabularies.map(vocab =>
          vocab.id === action.payload
            ? { ...vocab, learned: !vocab.learned }
            : vocab
        )
      };
    default:
      return state;
  }
};

export default vocabularyReducer;
