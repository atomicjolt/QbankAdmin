import request                          from "superagent";

import { DONE }                         from "../constants/wrapper";
import { Constants as BanksConstants }  from "../actions/banks";
import { Constants as AssessmentConstants }   from "../actions/assessment_offered";

export default (store) => (next) => {
  function startApp(action) {
    console.log("middleware startApp function");
    if(action.type == "APP_START") {
      console.log("middleware APP_START type");
      request.get("https://4h8n6sg95j.execute-api.us-east-1.amazonaws.com/dev/proxy").then(
        function (response) {
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

    if(action.type == "ASSESSMENT_OFFERED") {
      console.log("middleware ASSESSMENT_OFFERED type");
      var url = "https://4h8n6sg95j.execute-api.us-east-1.amazonaws.com/dev/offer";
      var body = {
        bank_id: action.bankId,
        assessment_id: action.assessmentId
      };
      console.log("In middleware making assessmentOfferedId request...");
      request.post(url).send(body).then(
        function (response) {
          console("received good response");
          store.dispatch({
            type:     AssessmentConstants.ASSESSMENT_OFFERED + DONE,
            payload: response.body
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
