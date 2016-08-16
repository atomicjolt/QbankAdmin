"use strict";

import _            from 'lodash';
import React        from 'react';
import { connect }  from 'react-redux';

import { startApp }                       from '../actions/app';
import { offerAssessment, clearSnippet }  from '../actions/assessment_offered';
import assets                             from '../libs/assets';


const select = (state) => (state);

class Home extends React.Component {

  constructor(){
    super();
    this.state = {
      assessmentClicked: {},
      openIframe: false,
      isOpen: false,
      expandedBanks: new Set(),
      assessments: {}
    };
    Object.freeze(this.state);
  }

  componentWillMount() {
    let p = this.props;
    if(p.auth.authenticated && !p.application.started) {
      p.startApp(p.auth.auth_token, this.props.settings.qBankHost);
    }
  }

  onMessage(message) {
    let data = JSON.parse(message.data);
    switch(data.open_assessments_msg){
      case 'open_assessments_resize':
        let iframe = document.getElementById('openassessments_container');
        let height = data.payload.height;
        iframe.style.height = height + "px";
        break;
    }
  }

  componentDidUpdate() {
    let iframe = document.getElementById('openassessments_container');

    if(!iframe){ return; }

    window.addEventListener("message", this.onMessage, false);
    iframe.contentWindow.postMessage({
      'open_assessments_msg': 'open_assessments_size_request',
      'payload': {}
    }, '*');
  }

  gatherBreadcrumbs(breadcrumbs, banks) {
    banks.forEach((b) => {
      if(this.state.expandedBanks.has(b.id)) {
        breadcrumbs.push(
          <div className="c-breadcrumb" key={b.id}>
            <span>{b.displayName.text}</span>
            <a href="#" onClick={() => { this.onExpandBank(b, false); }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
                <path d="M29.17 16l-5.17 5.17-5.17-5.17-2.83 2.83 5.17 5.17-5.17 5.17 2.83 2.83 5.17-5.17 5.17 5.17 2.83-2.83-5.17-5.17 5.17-5.17-2.83-2.83zm-5.17-12c-11.05 0-20 8.95-20 20s8.95 20 20 20 20-8.95 20-20-8.95-20-20-20zm0 36c-8.82 0-16-7.18-16-16s7.18-16 16-16 16 7.18 16 16-7.18 16-16 16z"/>
              </svg>
            </a>
          </div>
        );
      }
      this.gatherBreadcrumbs(breadcrumbs, b.childNodes);
    });
  }

  renderBreadcrumbs(hierarchy) {
    let breadcrumbs = [];
    this.gatherBreadcrumbs(breadcrumbs, hierarchy);
    return breadcrumbs;
  }

  onExpandBank(bank, value) {
    let expandedBanks = new Set(this.state.expandedBanks);

    if(value) {
      expandedBanks.add(bank.id);
    } else {
      this.resetExpansion(bank, expandedBanks);
    }

    this.setState({expandedBanks});
  }

  /**
   * Clears the hierarchy selection for the given bank and all of its
   * descendants.
   */
  resetExpansion(bank, set) {
    set.delete(bank.id);
    bank.childNodes.forEach((bc) => {
      this.resetExpansion(bc, set);
    });
  }

  renderItem(bank) {
    let itemClass = "c-filter__item";
    if(bank.childNodes.length == 0){
      itemClass = itemClass + " c-filter__item--dropdown";
    }
    let expanded = this.state.expandedBanks.has(bank.id);
    let renderedChildren;
    if(expanded) {
      renderedChildren = this.renderChildren(bank.childNodes);
    }
    // TODO: Clean up the markup.
    return (
      <li key={bank.id} className={itemClass}>
        <input type="checkbox"
               checked={expanded}
               onChange={(e) => this.onExpandBank(bank, e.target.checked)}/>
        <span>{bank.displayName.text}</span>
        {renderedChildren}
      </li>
    );
  }

  renderChildren(children) {
    if(_.isUndefined(children)) { return; }
    return (
      <ul className="c-filter__dropdown">
        {children.map((child) => this.renderItem(child))}
      </ul>
    );
  }

  renderBankHierarchy(hierarchy) {
    if(_.isEmpty(hierarchy)) {
      return <div className="loader">{this.spinner()}</div>;
    }
    return (
      <ul className="c-filter-scroll">
        {hierarchy.map((child) => this.renderItem(child))}
      </ul>
    );
  }

  renderAssessmentList(hierarchy) {
    let assessmentList = [];
    hierarchy.forEach((bank) => {
      this.gatherAssessments(assessmentList, [], bank);
    });
    return assessmentList;
  }

  spinner(){
    return (
      <div className="c-assessment-loading">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 92 92">
          <path d="M46.1,82.3H41.9l-3.1-.3-3.8-.8-2.1-.7L31.7,80l-1.1-.5A35.7,35.7,0,0,1,21,73.7,37.8,37.8,0,0,1,7.6,49.1l-.2-2V41A32.7,32.7,0,0,1,8,36.8l.4-2.1c.1-.7.4-1.4.6-2a40.3,40.3,0,0,1,8.7-15,41,41,0,0,1,14.5-10l2.1-.8,2.1-.6a34.1,34.1,0,0,1,4.3-1L41.9,5h1.1l2.2-.2h6.3l2.2.3,2.1.4,2,.4,2,.6,2,.6,1.9.7,1.8.8a42.5,42.5,0,0,1,12.2,8.7,41.3,41.3,0,0,1,7.5,10.5l.7,1.3.5,1.3,1,2.4c.5,1.6.9,3.1,1.3,4.4l.7,3.7c.2,1.1.2,2,.3,2.8L90,46a7.5,7.5,0,1,1-15,1.2q0-.3,0-.6V44.5a17.6,17.6,0,0,0,0-1.8l-.2-2.5c-.2-.9-.4-1.9-.6-3.1l-.5-1.7-.3-.9-.4-.9a28.1,28.1,0,0,0-4.5-7.7,30.3,30.3,0,0,0-8.2-7l-1.3-.7-1.3-.7-1.4-.6-1.4-.5-1.5-.5-1.5-.4-1.4-.3-.7-.2h-.9l-1.9-.2H42a25,25,0,0,0-3.4.5l-1.7.3-1.7.5a32.8,32.8,0,0,0-12.2,6.9,33.5,33.5,0,0,0-8.2,11.8c-.2.6-.5,1.1-.7,1.7l-.5,1.7a27.4,27.4,0,0,0-.8,3.4l-.2.8v1l-.2,1.9v3.5a33.9,33.9,0,0,0,3.1,13.2A34.9,34.9,0,0,0,22.5,72a33.8,33.8,0,0,0,8.6,6.3l1,.6,1.1.4,2,.8,3.7,1.1,3,.6,2.3.3Z"/>
        </svg>
      </div>);
  }

  offerAssessment(bankId, assessment){
    this.setState({ isOpen: true,
                    assessmentClicked: assessment });
    var qBankHost = this.props.settings.qBankHost;
    this.props.offerAssessment(bankId, assessment.id, qBankHost);
  }

  gatherAssessments(assessmentList, path, bank) {
    path = path.concat([bank.displayName.text]);
    if(this.state.expandedBanks.has(bank.id)) {
      if(bank.assessments.length > 0) {
        assessmentList.push(<h1>{path.join(", ")}</h1>);
        bank.assessments.forEach((a) => {
          assessmentList.push(
            <li className="c-admin-list-item">
              <a href="#" onClick={()=>{this.offerAssessment(bank.id, a);}}>{a.displayName.text}</a>
            </li>
          );
        });
      }
    }
    bank.childNodes.forEach((b) => this.gatherAssessments(assessmentList, path, b));
  }

  iframeRender(){
    let assessOffered = this.props.assessment_offered;
    if(!_.isEmpty(assessOffered)){
      let qBankHost = this.props.settings.qBankHost ? this.props.settings.qBankHost : "https://qbank-clix-dev.mit.edu";
      let playerHost = this.props.settings.assessmentPlayerUrl; //This will need to be the instance deployed, not localhost.
      let url = encodeURI(`${playerHost}/?unlock_next=ON_CORRECT&api_url=${qBankHost}/api/v1&bank=${assessOffered.bankId}&assessment_offered_id=${assessOffered.id}#/assessment`);

      return (
        <div>
          <iframe id="openassessments_container" src={url}/>
        </div>
      );
    } else {
      return "";
    }
  }

  iframe(){
    let assessOffered = this.props.assessment_offered;
    if(!_.isEmpty(assessOffered)){
      let qBankHost = this.props.settings.qBankHost ? this.props.settings.qBankHost : "https://qbank-clix-dev.mit.edu";
      let hostedPlayer = this.props.settings.assessmentPlayerUrl;
      let localPlayerUrl = this.props.settings.localPlayerUrl;

      // localPlayerUrl should take precedence over the hosted player
      let url = `${localPlayerUrl || hostedPlayer}/?unlock_next=ON_CORRECT&api_url=${qBankHost}/api/v1&bank=${assessOffered.bankId}&assessment_offered_id=${assessOffered.id}#/assessment`;
      return `<iframe src="${url}"/>`;
    } else {
      return "";
    }
  }

  slidingClasses(){
    if(this.state.isOpen){
      return "o-admin-container  o-admin-container--preview is-open";
    }
    return "o-admin-container  o-admin-container--preview";
  }

  iframeCode(){
    if(this.state.openIframe){
      return (
        <div className="c-preview-embed">
          <label for="embed">Embed Code</label>
          <textarea id="embed" value={this.iframe()} readOnly="true" ></textarea>
        </div>
      );
    }
    return null;
  }

  adminPreview(){
    var assessmentName = this.state.assessmentClicked.displayName ? this.state.assessmentClicked.displayName.text : "";
    return (
      <div className="o-admin-content">
        <div className="c-admin-content__header">
          <a href="#" onClick={()=>{this.setState({isOpen: false, openIframe: false});}} className="c-btn  c-btn--previous  c-btn--previous--small">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
              <path d="M14.83 16.42l9.17 9.17 9.17-9.17 2.83 2.83-12 12-12-12z"/>
            </svg>
            <span>Back To Assessment List</span>
          </a>
        </div>
        <div className="c-admin-content__main c-admin-content__main--preview">
          {this.iframeCode()}
          <div className="c-preview-sidebar">
            <h2>{assessmentName}</h2>
            <p>Date Created: <span>02/09/2016</span></p>
            <p>Type: <span>{this.state.assessmentClicked.type}</span></p>
            <a style={{"marginTop":"135px"}} href="#" onClick={()=>{this.setState({openIframe: true});}} className="c-btn  c-btn--previous  c-btn--previous--small">
              <span>Create Iframe Code</span>
            </a>
          </div>
          <div className="c-preview-questions">
            <div class="c-preview-scroll">
              {this.iframeRender()}
            </div>
          </div>
        </div>
      </div>);
  }

  render() {
    const hierarchy = this.props.banks;

    return (
      <div style={{"height": "100%"}}>
        <div className="o-admin-container">
          <div className="o-sidebar">
            <div className="c-sidebar__header">
              <img src="" alt="" />
            </div>
            <div className="c-sidebar__filters">
              <p className="c-filters__title">Filter Tree</p>
              {this.renderBankHierarchy(hierarchy)}
            </div>
          </div>
          <div className="o-admin-content">
            <div className="c-admin-content__header">
              {this.renderBreadcrumbs(hierarchy)}
            </div>
            <div className="c-admin-content__main  c-admin-content__main--scroll">
              <ul>
                {this.renderAssessmentList(hierarchy)}
              </ul>
            </div>
          </div>
        </div>
        <div className={this.slidingClasses()}>
          <div class="o-sidebar o-sidebar--preview"></div>
          {this.adminPreview()}
        </div>
      </div>);
  }

}

export default connect(select, { startApp, offerAssessment, clearSnippet })(Home);
