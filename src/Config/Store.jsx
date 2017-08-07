import {createStore,combineReducers,applyMiddleware} from 'redux';
import reducer from '../Reducer/Index';
import thunk from 'redux-thunk';

//创建一个Redux store来存放应用中所有的state，应用中应有且只有一个store。  
var store=createStore(
	combineReducers(reducer);
	applyMiddleware(thunk)
);
export default store;