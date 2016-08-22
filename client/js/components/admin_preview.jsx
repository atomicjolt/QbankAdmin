import React from 'react';

import IframeEmbed             from './common/iframe_embed';
import IframePreview           from './common/iframe_preview';
import PreviewSidebar          from './preview_sidebar';

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
              {iframePreview}
            </div>
          </div>
        </div>
      );
  }
};
