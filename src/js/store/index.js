import {createStore, bindActionCreators, applyMiddleware} from 'redux';
//import logger from 'redux-logger';
//import devToolsEnhancer from 'remote-redux-devtools';
import dungeonReducer from '../reducers';


//store
//const middleWare = applyMiddleware(logger);

const store = createStore(dungeonReducer/*, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()*/);
export default store;
