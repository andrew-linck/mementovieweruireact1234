import React from "react";
import ReactDOM from "react-dom";
import PageContainerWithData from "./PageContainerWithData";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
// import withReduxEnhancer from "./addon-redux/enhancer";
import thunk from "redux-thunk";
import reducers from "./reducers";

const createMiddlewareEnhancer = () => {
  const middleware = [];

  middleware.push(thunk);

  return applyMiddleware(...middleware);
};
const createEnhancers = () => {
  const enhancers = [];

  // Middleware enhancer
  enhancers.push(createMiddlewareEnhancer());

  // Enhancers in non-production environments
  // if (process.env.NODE_ENV !== "production") {
  // enhancers.push(withReduxEnhancer);
  // if (!!window.__REDUX_DEVTOOLS_EXTENSION__) {
  //   enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__());
  // }
  // }

  return compose(...enhancers);
};

const store = createStore(reducers, createEnhancers());

ReactDOM.render(
  <Provider store={store}>
    <PageContainerWithData />
  </Provider>,
  document.getElementById("root")
);
