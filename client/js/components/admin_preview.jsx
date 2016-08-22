import React from 'react';

import IframeEmbed             from './common/iframe_embed';
import IframePreview           from './common/iframe_preview';

class PreviewSidebar extends React.Component {


  render(){
    var assessmentName = this.props.assessmentClicked.displayName ? this.props.assessmentClicked.displayName.text : "";

    // If there are no items, render an empty option to clear the select.
    // Else, map over a range of numbers from 1 to items.length + 1,
    // and generate an option for each number.

    var nOfMOptions = <option value=""></option>;
    if(!_.isEmpty(this.props.items)) {
      nOfMOptions = _.map(_.range(1, this.props.items.length + 1),
        (index) => {
          return <option key={index} value={index}>{index}</option>;
        }
      );
    }

    var localeOptions = this.props.locales.map((l) => (
      <option key={l[0]} value={l[0]}>{l[1]}</option>
    ));

    return (
      <div className="c-preview-sidebar">
        <h2>{assessmentName}</h2>
        <p>Date Created: <span>02/09/2016</span></p>
        <p>Type: <span>{this.props.assessmentClicked.type}</span></p>
        <p>Student must answer
          <select value={ this.props.nOfM || this.props.items.length }
                  onChange={(e) => this.props.setNOfM(parseInt(e.target.value))}>
            { nOfMOptions }
          </select> of {this.props.items.length}
        </p>

        <p>Preview the UI in
          <select onChange={(e) => this.props.onChangeLocale(e)}>
            {localeOptions}
          </select>
        </p>
        <a
          style={{"marginTop":"135px"}}
          href="#"
          onClick={this.props.displayEmbedCode}
          className="c-btn  c-btn--previous  c-btn--previous--small">
          <span>Create Iframe Code</span>
        </a>
    </div>
  );
  }
};

export default class AdminPreview extends React.Component {

  constructor() {
    super();
    this.state = {
      openIframe: false
    };
  }

  iframeUrl(playerUrl, assessmentOffered){
    if(!_.isEmpty(assessmentOffered)){
      let qBankHost = this.props.settings.qBankHost ? this.props.settings.qBankHost : "https://qbank-clix-dev.mit.edu";
      let localQbankUrl = this.props.settings.localQbankUrl;

      let url = `${playerUrl}/?unlock_next=ON_CORRECT` +
          `&api_url=${localQbankUrl || qBankHost}/api/v1` +
          `&bank=${assessmentOffered.bankId}&assessment_offered_id=${assessmentOffered.id}#/assessment`;
      return url;
    } else {
      return "";
    }
  }

  displayEmbedCode(){
    this.setState({openIframe:true});
  }

  render() {

    var assessmentName = this.props.assessmentClicked.displayName ? this.props.assessmentClicked.displayName.text : "";


    var localUrl = this.props.settings.localPlayerUrl;
    var playerUrl = this.props.settings.assessmentPlayerUrl;
    var assessmentOffered = this.props.assessmentOffered;

    if(this.state.openIframe) {
      var iframeEmbed = IframeEmbed({
        openIframe:this.props.openIframe,
        url:this.iframeUrl(localUrl || playerUrl, assessmentOffered)
      });
    }

    if(!_.isEmpty(this.props.assessmentOffered)) {
      var iframePreview = IframePreview({
        url: this.iframeUrl(playerUrl, assessmentOffered)
      });
    }

    return (
      <div className={`o-admin-container  o-admin-container--preview ${this.props.isOpen ? "is-open" : ""}`}>
        <div className="o-sidebar o-sidebar--preview"></div>
          <div className="o-admin-content">
            <div className="c-admin-content__header">
              <a href="#" onClick={()=>{ this.props.closeAssessmentView();}} className="c-btn  c-btn--previous  c-btn--previous--small">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
                  <path d="M14.83 16.42l9.17 9.17 9.17-9.17 2.83 2.83-12 12-12-12z"/>
                </svg>
                <span>Back To Assessment List</span>
              </a>
            </div>
            <div className="c-admin-content__main c-admin-content__main--preview">
              {iframeEmbed}
              <PreviewSidebar {...this.props}
                 displayEmbedCode={() => this.displayEmbedCode()} />
              <div className="c-preview-questions">
                <div className="c-preview-scroll">
                  {iframePreview}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
  }
};
