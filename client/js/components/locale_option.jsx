"use strict";

import _          from "lodash";
import React      from "react";

import {startApp}              from "../actions/app";
import * as AssessmentActions  from "../actions/assessments";
import assets                  from "../libs/assets";


export default class LocaleOption extends React.Component {

  static propTypes = {
    availableLocales: React.PropTypes.array.isRequired
    /* settings          : React.PropTypes.object,
     * question          : React.PropTypes.object.isRequired,
     * response          : React.PropTypes.array.isRequired,
     * currentItemIndex  : React.PropTypes.number.isRequired,
     * questionCount     : React.PropTypes.number.isRequired,
     * questionResult   : React.PropTypes.object.isRequired,
     * selectAnswer      : React.PropTypes.func.isRequired,
     * localizedStrings: React.PropTypes.object.isRequired*/
  };

  constructor() {
    super();
    this.state = {
      /* assessmentClicked: {},
       * openIframe: false,
       * isOpen: false,
       * expandedBankPaths: new Set(),
       * assessments: {},
       * currentBankId: null,
       * nOfM: null*/
    };
    Object.freeze(this.state);
  }

  componentWillMount() {
  }

  componentDidUpdate() {
  }

  render() {
    const availableLocales = this.props.availableLocales;
    let options = availableLocales.map((locale) => (
      <option value={locale[0]}>{locale[1]}</option>
    ));

    return (
      <p>Present the UI in
        <select>
          {options}
        </select>
      </p>
    );
  }
}
