import React from 'react';

export default function PreviewSidebar(props) {

  var assessmentName = props.assessmentClicked.displayName ? props.assessmentClicked.displayName.text : "";

  // If there are no items, render an empty option to clear the select.
  // Else, map over a range of numbers from 1 to items.length + 1,
  // and generate an option for each number.

  var nOfMOptions = <option value=""></option>;
  if(!_.isEmpty(props.items)) {
    nOfMOptions = _.map(_.range(1, props.items.length + 1),
      (index) => {
        return <option key={index} value={index}>{index}</option>;
      }
    );
  }

  var localeOptions = props.locales.map((l) => (
    <option key={l[0]} value={l[0]}>{l[1]}</option>
  ));

  return (
    <div className="c-preview-sidebar">
      <h2>{assessmentName}</h2>
      <p>Date Created: <span>02/09/2016</span></p>
      <p>Type: <span>{props.assessmentClicked.type}</span></p>
      <p>Student must answer
        <select value={ props.nOfM || props.items.length }
                onChange={(e) => props.setNOfM(parseInt(e.target.value))}>
          { nOfMOptions }
        </select> of {props.items.length}
      </p>

      <p>Preview the UI in
        <select onChange={(e) => props.onChangeLocale(e)}>
          {localeOptions}
        </select>
      </p>
      <a
        style={{"marginTop":"135px"}}
        href="#"
        onClick={props.displayEmbedCode}
        className="c-btn  c-btn--previous  c-btn--previous--small">
        <span>Create Iframe Code</span>
      </a>
    </div>
  );
};
