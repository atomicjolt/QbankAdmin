import request                          from "superagent";

import { Constants as AppConstants }          from "../actions/app";
import { displayError }                       from "../actions/app";
import { Constants as AssessmentConstants }   from "../actions/assessments";
import { clearSnippet }                       from "../actions/assessments";
import { getBankHierarchy }                   from "../actions/banks";
import { DONE }                               from "../constants/wrapper";


/**
 * Handles a Lambda error, if present, by dispatching an action for it.  Returns
 * true if there was an error, false otherwise.
 */
function errorHandled(store, response) {
  let errorMessage = response.body.errorMessage;
  if(errorMessage === undefined) return false;

  // The error message is sometimes null, if something goes wrong inside the
  // lambda function, so we check if it exists before trying to strip the
  // timestamp
  if(errorMessage) {
    // The message begins with an timestamp and UUID, which we strip off.
    errorMessage = errorMessage.replace(/^[0-9TZ:.-]+ [0-9a-f-]+ /, "");
  } else {
    errorMessage = "Something went wrong inside the lambda function.";
  }

  store.dispatch(displayError(errorMessage));

  return true;
}

export default (store) => (next) => {
  function startApp(action) {
    let qBankHost = "";
    const state = store.getState();

    switch(action.type) {

      case AppConstants.APP_START:
        qBankHost = action.qBankHost || "";
        request.get(`${state.settings.rootEndpoint}proxy?qBankHost=${qBankHost}`).then(
          function (response) {
            if(errorHandled(store, response)) return;
            store.dispatch(getBankHierarchy(response.body));
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
            if(errorHandled(store, response)) return;
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
            if(errorHandled(store, response)) return;
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
