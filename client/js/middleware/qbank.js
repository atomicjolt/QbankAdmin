import Api  from "../libs/api";

export default (store) => (next) => {
  function startApp(action) {
    Api.get("assessment/hierarchies/roots/", "https://qbank-dev.mit.edu/api/v2/", null, null, null, null).then(
      function () {
        console.log("success", arguments);
      },
      function (err) {
        console.log("error", err.url, err.message);
      }
    );
    next(action);
  }
  return startApp;
};
