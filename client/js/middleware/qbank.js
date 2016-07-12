export default (store) => (next) => {
  function startApp(action) {

    // store.dispatch({ type: "GET_BANK_HIERARCHY" });

    next(action);
  }
  return startApp;
};
