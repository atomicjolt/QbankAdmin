import keyData   from "../qbank/keys";
import {create}  from "../qbank/QBankFetcher";

const signer = create({
  SecretKey: keyData.privateKey,
  AccessKeyId: keyData.publicKey,
  Email: "me@example.edu",
  Host: "qbank-clix-dev.mit.edu"
});

export default (store) => (next) => {
  function startApp(action) {
    signer({method: "get", path: "/api/v1/assessment/hierarchies/roots/"}).then(
      function () {
        console.log("success", arguments);
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
