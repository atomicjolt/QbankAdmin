import request                          from "superagent";

import { Constants as AppConstants }          from "../actions/app";
import { Constants as AssessmentConstants }   from "../actions/assessment_offered";
import { Constants as BanksConstants }        from "../actions/banks";
import { Constants as ItemsConstants }        from "../actions/items";
import { DONE }                               from "../constants/wrapper";

export default (store) => (next) => {
  function startApp(action) {

    const state = store.getState();
    switch(action.type) {

      case AppConstants.APP_START:
        const qBankHost = action.qBankHost || "";
        request.get(`${state.settings.rootEndpoint}proxy?qBankHost=${qBankHost}`).then(
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
        break;

      case AssessmentConstants.ASSESSMENT_OFFER:
        store.dispatch({
          type:     AssessmentConstants.ASSESSMENT_CLEAR_SNIPPET
        });

        const url = `${state.settings.rootEndpoint}offer`;

        const body = {
          bank_id:       action.bankId,
          assessment_id: action.assessmentId,
          qBankHost: action.qBankHost
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
        break;

      case ItemsConstants.ASSESSMENT_ITEMS:
        const qBankHost = action.qBankHost || "";
        request.get(`${state.settings.rootEndpoint}items?qBankHost=${qBankHost}&bankId=${action.bankId}&assessmentId=${action.assessmentId}`).then(
          function (response) {
            store.dispatch({
              type:     ItemsConstants.ASSESSMENT_ITEMS + DONE,
              payload:  response.body
            });
          },
          function (err) {
            console.log("error", err.url, err.message);
          }
        );
        break;
    }


    next(action);
  }

  return startApp;
};
