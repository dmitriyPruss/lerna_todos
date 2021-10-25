import produce from 'immer';
import ACTION_TYPES from '../actions/actionTypes';

const initialState = {
  bets: [],
  isFetching: false,
  error: null
};

function betsReducer (state = initialState, action) {
  const { type } = action;

  // REQUEST
  switch (type) {
    case ACTION_TYPES.GET_BETS_REQUEST:
    case ACTION_TYPES.CREATE_BET_REQUEST:
    case ACTION_TYPES.UPDATE_BET_REQUEST:
    case ACTION_TYPES.DELETE_BET_REQUEST: {
      return produce(state, draftState => {
        draftState.error = null;
        draftState.isFetching = true;
      });
    }

    // SUCCESS
    case ACTION_TYPES.GET_BETS_SUCCESS: {
      const { bets } = action;
      return {
        ...state,
        isFetching: false,
        bets: bets
      };
    }

    case ACTION_TYPES.CREATE_BET_SUCCESS: {
      const { newBet } = action;
      const { bets } = state;

      let stopFunc = null;
      bets.forEach(bet => {
        if (bet.team === newBet.team.trim()) {
          stopFunc = true;
        }
      });
      if (stopFunc) {
        return {
          ...state,
          isFetching: false
        };
      }
      const newBets = [...bets, newBet];

      return {
        ...state,
        bets: newBets,
        isFetching: false
      };
    }

    case ACTION_TYPES.UPDATE_BET_SUCCESS: {
      const { bet } = action;
      const { bets } = state;

      const newBets = [...bets];

      newBets.splice(
        newBets.findIndex(newBet => newBet.id === bet.id),
        1,
        bet
      );

      return {
        ...state,
        isFetching: false,
        bets: newBets
      };
    }

    case ACTION_TYPES.DELETE_BET_SUCCESS: {
      const { id } = action;
      const { bets } = state;

      const newBets = [...bets];

      newBets.splice(
        newBets.findIndex(newBet => newBet.id === id),
        1
      );

      return {
        ...state,
        isFetching: false,
        bets: newBets
      };
    }

    // ERROR
    case ACTION_TYPES.GET_BETS_ERROR:
    case ACTION_TYPES.CREATE_BET_ERROR:
    case ACTION_TYPES.UPDATE_BET_ERROR:
    case ACTION_TYPES.DELETE_BET_ERROR: {
      const { error } = action;

      return produce(state, draftState => {
        draftState.error = error;
        draftState.isFetching = false;
      });
    }

    default:
      return state;
  }
}

export default betsReducer;
