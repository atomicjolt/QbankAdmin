import request                          from "superagent";

import { Constants as AppConstants }          from "../actions/app";
import { Constants as AssessmentConstants }   from "../actions/assessment_offered";
import { Constants as BanksConstants }        from "../actions/banks";
import { DONE }                               from "../constants/wrapper";

export default (store) => (next) => {
  function startApp(action) {
    if(action.type == AppConstants.APP_START) {
      var qBankHost = action.qBankHost;
      request.get("https://4h8n6sg95j.execute-api.us-east-1.amazonaws.com/dev/proxy?qBankHost=" + qBankHost).then(
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

    if(action.type == AssessmentConstants.ASSESSMENT_OFFER) {
      store.dispatch({
        type:     AssessmentConstants.ASSESSMENT_CLEAR_SNIPPET
      });
      var url = "https://4h8n6sg95j.execute-api.us-east-1.amazonaws.com/dev/offer";
      var body = {
        bank_id:       action.bankId,
        assessment_id: action.assessmentId,
        qbank_server: action.qbank_server
      };
      request.post(url).send(body).then(
        function (response) {
          store.dispatch({
            type:     AssessmentConstants.ASSESSMENT_OFFER + DONE,
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
