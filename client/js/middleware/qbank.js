import request from "superagent";

export default (store) => (next) => {
  function startApp(action) {
    request.get("https://4h8n6sg95j.execute-api.us-east-1.amazonaws.com/dev/proxy").then(
      function (response) {
        console.log("success", response.body);
        // store.dispatch({ type: "GET_BANK_HIERARCHY" });
      },
      function (err) {
        console.log("error", err.url, err.message);
      }
    );

    next(action);
  }
  return startApp;
};
