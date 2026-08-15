import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { fetchQuizData, loadQuizSession, saveQuizSession } from '../lib/welcheparteiApi';

const STORAGE_KEY = 'welchepartei-v1';

const TOTAL_VALUES_STEPS = 8;

const initialState = {
  data: null,          // { parties, issues, positions }
  loading: true,
  error: null,
  step: 0,             // 0=landing, 1=pre-party, 2-9=values, 10-24=blind questions, 25=gegencheck, 26=atlas
  valuesAnswers: {},   // cardId → 'a'|'b'
  blindAnswers: {},    // questionKey → 0|1|2
  weights: {},         // questionKey → 0|1|2|3
  preQuizParty: '',    // party id selected before quiz
  postQuizParty: '',   // party id selected after seeing results
};

function loadLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      return {
        step: saved.step || 0,
        valuesAnswers: saved.valuesAnswers || {},
        blindAnswers: saved.blindAnswers || {},
        weights: saved.weights || {},
        preQuizParty: saved.preQuizParty || '',
        postQuizParty: saved.postQuizParty || '',
      };
    }
  } catch { /* ignore */ }
  return {};
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_DATA_OK':
      return { ...state, data: action.payload, loading: false };
    case 'LOAD_DATA_ERR':
      return { ...state, error: action.payload, loading: false };
    case 'RESTORE_LOCAL':
      return { ...state, ...action.payload };
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_VALUES_ANSWER':
      return { ...state, valuesAnswers: { ...state.valuesAnswers, [action.cardId]: action.choice } };
    case 'SET_BLIND_ANSWER':
      return { ...state, blindAnswers: { ...state.blindAnswers, [action.questionKey]: action.slot } };
    case 'SET_WEIGHT':
      return { ...state, weights: { ...state.weights, [action.questionKey]: action.weight } };
    case 'SET_PRE_QUIZ_PARTY':
      return { ...state, preQuizParty: action.party };
    case 'SET_POST_QUIZ_PARTY':
      return { ...state, postQuizParty: action.party };
    case 'RESET':
      return { ...initialState, data: state.data, loading: false };
    default:
      return state;
  }
}

const WelcheParteiContext = createContext(null);

export function WelcheParteiProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: 'RESTORE_LOCAL', payload: loadLocal() });

    fetchQuizData()
      .then((data) => dispatch({ type: 'LOAD_DATA_OK', payload: data }))
      .catch((err) => dispatch({ type: 'LOAD_DATA_ERR', payload: err.message }));
  }, []);

  // Persist to localStorage whenever answers change
  useEffect(() => {
    if (state.loading) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        step: state.step,
        valuesAnswers: state.valuesAnswers,
        blindAnswers: state.blindAnswers,
        weights: state.weights,
        preQuizParty: state.preQuizParty,
        postQuizParty: state.postQuizParty,
      }));
    } catch { /* ignore */ }
  }, [state.step, state.valuesAnswers, state.blindAnswers, state.weights, state.preQuizParty, state.postQuizParty, state.loading]);

  const totalBlindSteps = state.data ? state.data.issues.length : 15;
  const totalSteps = 1 + 1 + TOTAL_VALUES_STEPS + totalBlindSteps + 2; // landing + pre-party + values + blind + gegencheck + atlas

  const setStep = useCallback((s) => dispatch({ type: 'SET_STEP', payload: s }), []);
  const nextStep = useCallback(() => dispatch({ type: 'SET_STEP', payload: Math.min(state.step + 1, totalSteps - 1) }), [state.step, totalSteps]);
  const prevStep = useCallback(() => dispatch({ type: 'SET_STEP', payload: Math.max(state.step - 1, 0) }), [state.step]);

  const setValuesAnswer = useCallback((cardId, choice) => {
    dispatch({ type: 'SET_VALUES_ANSWER', cardId, choice });
  }, []);

  const setBlindAnswer = useCallback((questionKey, slot) => {
    dispatch({ type: 'SET_BLIND_ANSWER', questionKey, slot });
  }, []);

  const setWeight = useCallback((questionKey, weight) => {
    dispatch({ type: 'SET_WEIGHT', questionKey, weight });
  }, []);

  const setPreQuizParty = useCallback((party) => {
    dispatch({ type: 'SET_PRE_QUIZ_PARTY', party });
  }, []);

  const setPostQuizParty = useCallback((party) => {
    dispatch({ type: 'SET_POST_QUIZ_PARTY', party });
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: 'RESET' });
  }, []);

  const persistSession = useCallback(() => {
    saveQuizSession({
      answers: state.blindAnswers,
      weights: state.weights,
      values_answers: state.valuesAnswers,
      pre_quiz_party: state.preQuizParty,
      post_quiz_party: state.postQuizParty,
    }).catch(() => { /* best-effort */ });
  }, [state.blindAnswers, state.weights, state.valuesAnswers, state.preQuizParty, state.postQuizParty]);

  const value = useMemo(() => ({
    ...state,
    TOTAL_VALUES_STEPS,
    totalBlindSteps,
    totalSteps,
    setStep,
    nextStep,
    prevStep,
    setValuesAnswer,
    setBlindAnswer,
    setWeight,
    setPreQuizParty,
    setPostQuizParty,
    reset,
    persistSession,
  }), [state, totalBlindSteps, totalSteps, setStep, nextStep, prevStep, setValuesAnswer, setBlindAnswer, setWeight, setPreQuizParty, setPostQuizParty, reset, persistSession]);

  return (
    <WelcheParteiContext.Provider value={value}>
      {children}
    </WelcheParteiContext.Provider>
  );
}

export function useWelchePartei() {
  const ctx = useContext(WelcheParteiContext);
  if (!ctx) throw new Error('useWelchePartei must be used within WelcheParteiProvider');
  return ctx;
}
