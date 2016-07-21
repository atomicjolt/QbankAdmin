import request                          from "superagent";
import { DONE }                         from "../constants/wrapper";
import { Constants as BanksConstants }  from "../actions/banks";
// import { Constants as AssessmentConstants }   from "../actions/assessment_offered";

export default (store) => (next) => {
  function startApp(action) {
    console.log("middleware startApp function");
    if(action.type == "APP_START"){
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

    // if(action.type == "ASSESSMENT_OFFERED"){
    //   console.log("middleware ASSESSMENT_OFFERED type");
    //   var url = "https://localhost:8091/api/v1/assessment/banks/assessment.Bank%3A577d49564a4045154ead4dd4%40ODL.MIT.EDU/assessments/assessment.Assessment%3A577d49584a4045154ead4f17%40ODL.MIT.EDU/assessmentsoffered";
    //   var body = {
    //     name: "Assessment Offered",
    //     description: "For Testing Purposes"
    //   };
    //   console.log("In middleware making assessmentOfferedId request...");
    //   request.post(url).send(body).then(
    //     function (response) {
    //       debugger;
    //       store.dispatch({
    //         type:     AssessmentConstants.ASSESSMENT_OFFERED + DONE,
    //          //payload: response.body
    //         payload:  {
    //           "reviewOptions": {
    //             "whetherCorrect": {
    //               "afterAttempt": true,
    //               "duringAttempt": true,
    //               "beforeDeadline": true,
    //               "afterDeadline": true
    //             },
    //             "solution": {
    //               "afterAttempt": true,
    //               "duringAttempt": false,
    //               "beforeDeadline": true,
    //               "afterDeadline": true
    //             }
    //           },
    //           "itemsShuffled": null,
    //           "description": {
    //             "text": "DUMMY DATA DESCRIPTION",
    //             "languageTypeId": "639-2%3AENG%40ISO",
    //             "formatTypeId": "TextFormats%3APLAIN%40okapia.net",
    //             "scriptTypeId": "15924%3ALATN%40ISO"
    //           },
    //           "itemsSequential": null,
    //           "bankId": "assessment.Bank%3A577d49564a4045154ead4dd4%40ODL.MIT.EDU",
    //           "scoreSystemId": "",
    //           "maxAttempts": null,
    //           "deadline": null,
    //           "startTime": null,
    //           "duration": null,
    //           "displayName": {
    //             "text": "FAKE TITLE",
    //             "languageTypeId": "639-2%3AENG%40ISO",
    //             "formatTypeId": "TextFormats%3APLAIN%40okapia.net",
    //             "scriptTypeId": "15924%3ALATN%40ISO"
    //           },
    //           "id": "assessment.AssessmentOffered%3A578ea73ecdfc5c5151c454ea%40ODL.MIT.EDU",
    //           "gradeSystemId": "",
    //           "recordTypeIds": [
    //             "assessment-offered-record-type%3Areview-options%40MOODLE.ORG"
    //           ],
    //           "assessmentId": "assessment.Assessment%3A577d49584a4045154ead4f17%40ODL.MIT.EDU",
    //           "levelId": "",
    //           "assignedBankIds": [
    //             "assessment.Bank%3A577d49564a4045154ead4dd4%40ODL.MIT.EDU"
    //           ],
    //           "genusTypeId": "GenusType%3ADEFAULT%40DLKIT.MIT.EDU",
    //           "type": "AssessmentOffered"
    //         }
    //       });
    //     },
    //     function (err) {
    //       debugger;
    //       console.log("error", err.url, err.message);
    //     }
    //   );

      // request
      //   .post(url)
      //   .send(body)
      //   .end(function(err, res){
      //     if(!err){
      //       store.dispatch({
      //         type: AssessmentConstants.ASSESSMENT_OFFERED + DONE,
      //         //payload: response.body
      //         payload:  {
      //         "reviewOptions": {
      //           "whetherCorrect": {
      //             "afterAttempt": true,
      //             "duringAttempt": true,
      //             "beforeDeadline": true,
      //             "afterDeadline": true
      //           },
      //           "solution": {
      //             "afterAttempt": true,
      //             "duringAttempt": false,
      //             "beforeDeadline": true,
      //             "afterDeadline": true
      //           }
      //         },
      //         "itemsShuffled": null,
      //         "description": {
      //           "text": "DUMMY DATA DESCRIPTION",
      //           "languageTypeId": "639-2%3AENG%40ISO",
      //           "formatTypeId": "TextFormats%3APLAIN%40okapia.net",
      //           "scriptTypeId": "15924%3ALATN%40ISO"
      //         },
      //         "itemsSequential": null,
      //         "bankId": "assessment.Bank%3A577d49564a4045154ead4dd4%40ODL.MIT.EDU",
      //         "scoreSystemId": "",
      //         "maxAttempts": null,
      //         "deadline": null,
      //         "startTime": null,
      //         "duration": null,
      //         "displayName": {
      //           "text": "FAKE TITLE",
      //           "languageTypeId": "639-2%3AENG%40ISO",
      //           "formatTypeId": "TextFormats%3APLAIN%40okapia.net",
      //           "scriptTypeId": "15924%3ALATN%40ISO"
      //         },
      //         "id": "assessment.AssessmentOffered%3A578ea73ecdfc5c5151c454ea%40ODL.MIT.EDU",
      //         "gradeSystemId": "",
      //         "recordTypeIds": [
      //           "assessment-offered-record-type%3Areview-options%40MOODLE.ORG"
      //         ],
      //         "assessmentId": "assessment.Assessment%3A577d49584a4045154ead4f17%40ODL.MIT.EDU",
      //         "levelId": "",
      //         "assignedBankIds": [
      //           "assessment.Bank%3A577d49564a4045154ead4dd4%40ODL.MIT.EDU"
      //         ],
      //         "genusTypeId": "GenusType%3ADEFAULT%40DLKIT.MIT.EDU",
      //         "type": "AssessmentOffered"
      //         }
      //       });
      //     }else{
      //       console.log("error", err.url, err.message);
      //     }
      //     debugger;
      //   });

    //}
    next(action);
  }
  return startApp;
};
