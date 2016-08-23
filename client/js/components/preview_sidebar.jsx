import React from 'react';

PreviewSidebar.propTypes = {
  // Object representing the assessment that is being previewed
  assessmentClicked: React.PropTypes.object,

  // The 'M' from 'N of M'. The total number of questions available to select from.
  M: React.PropTypes.number,

  // Array of available locales
  locales: React.PropTypes.array,

  // Current 'N of M' selection.
  nOfM: React.PropTypes.number,

  // Function to set the chosen 'N of M' state. Will be called whenever the
  // 'N of M' option is changed.
  setNOfM: React.PropTypes.func,

  // Function to change preview locale. Is called whenever the selected locale
  // is changed.
  onChangeLocale: React.PropTypes.func,

  // Function to make the iframe embed code visible. Will be called when the 'create
  // iframe code' button is clicked.
  displayEmbedCode: React.PropTypes.func
};

export default function PreviewSidebar(props) {

  var assessmentName = props.assessmentClicked.displayName ? props.assessmentClicked.displayName.text : "";

  // If there are no items, render an empty option to clear the select.
  // Else, map over a range of numbers from 1 to items.length + 1,
  // and generate an option for each number.

  var nOfMOptions = <option value=""></option>;
  if(props.M > 0) {
    nOfMOptions = _.map(_.range(1, props.M + 1),
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
        <select value={ props.nOfM || props.M }
                onChange={(e) => props.setNOfM(parseInt(e.target.value))}>
          { nOfMOptions }
        </select> of {props.M}
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
