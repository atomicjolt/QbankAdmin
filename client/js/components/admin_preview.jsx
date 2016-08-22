import React from 'react';

import IframeEmbed             from './common/iframe_embed';
import IframePreview           from './common/iframe_preview';
import PreviewSidebar          from './preview_sidebar';

export default class AdminPreview extends React.Component {

  static propTypes = {

    // Whether or not preview component should be displayed. In order for the sliding
    // animation to work, it needs to be rendered even when it should not be displayed.
    isOpen: React.PropTypes.bool,

    // Object representing the assessment that is being previewed
    assessmentClicked: React.PropTypes.object,

    // Object containing admin settings. I.E. keys localQbankUrl, assessmentPlayerUrl, localPlayerUrl
    settings: React.PropTypes.object,

    // Array of available locales
    locales: React.PropTypes.array,

    // Current 'N of M' selection.
    nOfM: React.PropTypes.number,

    // The 'M' from 'N of M'. The total number of questions available to select from.
    M: React.PropTypes.number,

    // Object containing information about the assessment being previewed. Should
    // contain keys 'bankId' and 'id'.
    assessmentOffered: React.PropTypes.object,

    // Function to close assessment preview. Is called whenever 'Back to Assessment
    // List' button is clicked.
    closeAssessmentView: React.PropTypes.function,

    // Function to set the chosen 'N of M' state. Will be called whenever the
    // 'N of M' option is changed.
    setNOfM: React.PropTypes.function,

    // Function to change preview locale. Is called whenever the selected locale
    // is changed.
    onChangeLocale: React.PropTypes.function,
  };

  constructor() {
    super();
    this.state = {
      openIframe: false
    };
  }

  iframeUrl(playerUrl, qbankUrl, assessmentOffered){
    if(!_.isEmpty(assessmentOffered)){
      return `${playerUrl}/?unlock_next=ON_CORRECT&api_url=${qbankUrl}
      /api/v1&bank=${assessmentOffered.bankId}&assessment_offered_id=
      ${assessmentOffered.id}#/assessment`;
    } else {
      return "";
    }
  }

  displayEmbedCode(){
    this.setState({openIframe:true});
  }

  render() {
    var qBankUrl = this.props.settings.qBankHost ? this.props.settings.qBankHost : "https://qbank-clix-dev.mit.edu";
    var localQbankUrl = this.props.settings.localQbankUrl;
    var playerUrl = this.props.settings.assessmentPlayerUrl;
    var localPlayerUrl = this.props.settings.localPlayerUrl;
    var assessmentOffered = this.props.assessmentOffered;

    if(this.state.openIframe) {
      var iframeEmbed = IframeEmbed({
        openIframe:this.props.openIframe,
        url:this.iframeUrl(
          localPlayerUrl || playerUrl,
          localQbankUrl || qBankUrl,
          assessmentOffered
        )
      });
    }

    if(!_.isEmpty(this.props.assessmentOffered)) {
      var iframePreview = IframePreview({
        url: this.iframeUrl(playerUrl, qBankUrl, assessmentOffered)
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
