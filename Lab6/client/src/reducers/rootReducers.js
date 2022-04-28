import { combineReducers } from 'redux';
import trainerReducer from './trainerReducer'

const rootReducer = combineReducers({
    trainerReducer : trainerReducer
});

export default rootReducer;