import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import withReduxEnhancer from './lib/addon-redux/enhancer';
import reducers from './reducers';

const createMiddlewareEnhancer = () => {
  const middleware = [];

  middleware.push(thunk);

  return applyMiddleware(...middleware);
};

const createEnhancers = () => {
  const enhancers = [];

  // Middleware enhancer
  enhancers.push(createMiddlewareEnhancer())

  // Enhancers in non-production environments
  if (process.env.NODE_ENV !== 'production') {
    enhancers.push(withReduxEnhancer)
    if (!!window.__REDUX_DEVTOOLS_EXTENSION__) {
      enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__())
    }
  }

  return compose(...enhancers)
};

const store = createStore(reducers, createEnhancers());

// Until the rest of the app is modernized, the store will need to be
// accessable from a global.
// Useful for debugging.
window.store = store;

export default store;
