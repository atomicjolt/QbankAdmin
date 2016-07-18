import request from "superagent";
import { Constants as BanksConstants }   from "../actions/banks";

export default (store) => (next) => {
  function startApp(action) {
    if(action.type == "APP_START"){
      request.get("https://4h8n6sg95j.execute-api.us-east-1.amazonaws.com/dev/proxy").then(
      function (response) {
        console.log("success", response.body);
        // store.dispatch({ type: "GET_BANK_HIERARCHY" });
        store.dispatch({
          type:     BanksConstants.GET_BANK_HIERARCHY,
          payload:  response.body
        });
      },
      function (err) {
        console.log("error", err.url, err.message);
      }
    );
    }

    next(action);
  }
  return startApp;
};
