import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import { apiMiddleware } from 'redux-api-middleware';
import Reducers from './reducers';

// const createStoreWithMiddleware = applyMiddleware(apiMiddleware, thunk)(createStore);;//中间件
const store = createStore(Reducers);//创建仓库


store.subscribe(function(){
    console.log(store.getState(), 'subscribe');
})
export default store