export default (store) => (next) => {
  function startApp(action) {
    next(action);
  }
  return startApp;
};
