import { rootReducer } from '../reducers';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';

export default function configureStore() {
  const logger = createLogger();
  return createStore(rootReducer,
                     applyMiddleware(thunkMiddleware, logger));
}
