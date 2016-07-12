"use strict";

import Immutable                           from "immutable";
import _                                   from "lodash";
import { Constants as BanksConstants }   from "../actions/banks";

const initialState = Immutable.fromJS({
  "_links": {
    "self": "https://qbank-dev.mit.edu/touchstone/api/v2/assessment/hierarchies/",
    "assessment.Bank%3A54f9e39833bb7293e9da5b44%40oki-dev.MIT.EDU": "https://qbank-dev.mit.edu/touchstone/api/v2/assessment/hierarchies/assessment.Bank:54f9e39833bb7293e9da5b44@oki-dev.MIT.EDU/"
  },
  "data": {
    "count": 1,
    "next": null,
    "previous": null,
    "results": [
      {
        "displayName": {
          "text": "English, 2014_Fall",
          "languageTypeId": "639-2%3AENG%40ISO",
          "formatTypeId": "TextFormats%3APLAIN%40okapia.net",
          "scriptTypeId": "15924%3ALATN%40ISO"
        },
        "description": {
          "text": "Assessment bank for Differential Equations, 2014_Fall",
          "languageTypeId": "639-2%3AENG%40ISO",
          "formatTypeId": "TextFormats%3APLAIN%40okapia.net",
          "scriptTypeId": "15924%3ALATN%40ISO"
        },
        "recordTypeIds": [],
        "genusTypeId": "GenusType%3ADEFAULT%40dlkit.mit.edu",
        "type": "Bank",
        "id": "assessment.Bank%3A54f9e39833bb7293e9da5b44%40oki-dev.MIT.EDU"
      },
      {
        "displayName": {
          "text": "Science, 2014_Fall",
          "languageTypeId": "639-2%3AENG%40ISO",
          "formatTypeId": "TextFormats%3APLAIN%40okapia.net",
          "scriptTypeId": "15924%3ALATN%40ISO"
        },
        "description": {
          "text": "Assessment bank for Differential Equations, 2014_Fall",
          "languageTypeId": "639-2%3AENG%40ISO",
          "formatTypeId": "TextFormats%3APLAIN%40okapia.net",
          "scriptTypeId": "15924%3ALATN%40ISO"
        },
        "recordTypeIds": [],
        "genusTypeId": "GenusType%3ADEFAULT%40dlkit.mit.edu",
        "type": "Bank",
        "id": "assessment.Bank%3A54f9e39833bb7293e9da5b44%40oki-dev.MIT.EDU"
      },
      {
        "displayName": {
          "text": "Math, 2014_Fall",
          "languageTypeId": "639-2%3AENG%40ISO",
          "formatTypeId": "TextFormats%3APLAIN%40okapia.net",
          "scriptTypeId": "15924%3ALATN%40ISO"
        },
        "description": {
          "text": "Assessment bank for Differential Equations, 2014_Fall",
          "languageTypeId": "639-2%3AENG%40ISO",
          "formatTypeId": "TextFormats%3APLAIN%40okapia.net",
          "scriptTypeId": "15924%3ALATN%40ISO"
        },
        "recordTypeIds": [],
        "genusTypeId": "GenusType%3ADEFAULT%40dlkit.mit.edu",
        "type": "Bank",
        "id": "assessment.Bank%3A54f9e39833bb7293e9da5b44%40oki-dev.MIT.EDU"
      }
    ]
  }
});

export default (state = initialState, action) => {
  switch(action.type){

    default:
      return state;
  }
};
