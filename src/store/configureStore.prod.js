import { rootReducer } from '../reducers';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';

export default function configureStore() {
  return createStore(rootReducer,
                     applyMiddleware(thunkMiddleware));
}
