import request                          from "superagent";

import { Constants as AppConstants }          from "../actions/app";
import { displayError }                       from "../actions/app";
import { Constants as AssessmentConstants }   from "../actions/assessments";
import { clearSnippet }                       from "../actions/assessments";
import { getBankHierarchy }                   from "../actions/banks";
import { DONE }                               from "../constants/wrapper";

export default (store) => (next) => {
  function startApp(action) {
    let qBankHost = "";
    const state = store.getState();

    switch(action.type) {

      case AppConstants.APP_START:
        qBankHost = action.qBankHost || "";
        request.get(`${state.settings.rootEndpoint}proxy?qBankHost=${qBankHost}`).then(
          function (response) {
            let errorMessage = response.body.errorMessage;
            if(errorMessage !== undefined) {
              errorMessage = errorMessage.replace(/^[0-9TZ:.-]+ [0-9a-f-]+ /, "");
              store.dispatch(displayError(errorMessage));
            } else {
              store.dispatch(getBankHierarchy(response.body));
            }
          },
          function (err) {
            store.dispatch(displayError(err));
          }
        );
        break;

      case AssessmentConstants.ASSESSMENT_OFFER:
        store.dispatch(clearSnippet());

        const url = `${state.settings.rootEndpoint}offer`;

        const body = {
          bank_id:        action.bankId,
          assessment_id:  action.assessmentId,
          qBankHost:      action.qBankHost,
          nOfM:           action.nOfM
        };

        request.post(url).send(body).then(
          function (response) {
            store.dispatch({
              type:     AssessmentConstants.ASSESSMENT_OFFER + DONE,
              payload:  response.body
            });
          },
          function (err) {
            store.dispatch(displayError(err));
          }
        );
        break;

      case AssessmentConstants.ASSESSMENT_ITEMS:
        qBankHost = action.qBankHost || "";
        request.get(`${state.settings.rootEndpoint}items?qBankHost=${qBankHost}&bankId=${action.bankId}&assessmentId=${action.assessmentId}`).then(
          function (response) {
            store.dispatch({
              type:     AssessmentConstants.ASSESSMENT_ITEMS + DONE,
              payload:  response.body
            });
          },
          function (err) {
            store.dispatch(displayError(err));
          }
        );
        break;
    }


    next(action);
  }

  return startApp;
};
