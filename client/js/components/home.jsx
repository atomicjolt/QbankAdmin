"use strict";

import _            from 'lodash';
import React        from 'react';
import { connect }  from 'react-redux';

import { startApp }                       from '../actions/app';
import * as AssessmentActions             from '../actions/assessments';
import assets                             from '../libs/assets';
import IframeEmbed                        from './common/iframe_embed';
import IframePreview                      from './common/iframe_preview';


const select = (state) => (state);


export class Home extends React.Component {

  constructor(){
    super();
    this.state = {
      assessmentClicked: {},
      openIframe: false,
      isOpen: false,
      expandedBankPaths: new Set(),
      assessments: {},
      currentBankId: null,
      nOfM: null
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
    // The react dev tools send a javascript object as a message. The player
    // sends a string. This handles that.
    let data = message.data;
    if(typeof message.data === "string") {
      data = JSON.parse(data);
    }

    switch(data.open_assessments_msg) {
      case 'open_assessments_resize':
        let iframe = document.getElementById('openassessments_container');
        if(iframe) {
          let height = data.payload.height;
          iframe.style.height = height + "px";
        }
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

  onExpandBank(bank, value) {
    let expandedBankPaths = new Set(this.state.expandedBankPaths);

    if(value) {
      expandedBankPaths.add(bank.pathId);
    } else {
      this.resetExpansion(bank, expandedBankPaths);
    }

    this.setState({expandedBankPaths});
    this.closeAssessmentView();
  }

  /**
   * Clears the hierarchy selection for the given bank and all of its
   * descendants.
   */
  resetExpansion(bank, pathSet) {
    pathSet.delete(bank.pathId);
    bank.childNodes.forEach((bc) => {
      this.resetExpansion(bc, pathSet);
    });
  }

  renderItem(bank) {
    let itemClass = "c-filter__item";
    if(bank.childNodes.length == 0){
      itemClass = itemClass + " c-filter__item--dropdown";
    }
    let expanded = this.state.expandedBankPaths.has(bank.pathId);
    let renderedChildren;
    if(expanded) {
      renderedChildren = this.renderChildren(bank.childNodes);
    }

    return (
      <li key={bank.id} className={itemClass}>
        <label className="c-checkbox--nested">
          <input type="checkbox"
                 checked={expanded}
                 onChange={(e) => this.onExpandBank(bank, e.target.checked)}/>
          <div>{bank.displayName.text}</div>
        </label>
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
    if(hierarchy === null) {
      return <div className="loader">{this.spinner()}</div>;
    } else if(_.isEmpty(hierarchy)) {
      return <p className="c-admin-error">
        No banks exist in QBank. Please upload some data first.
      </p>;
    }
    return (
      <ul className="c-filter-scroll">
        {hierarchy.map((child) => this.renderItem(child))}
      </ul>
    );
  }

  renderAssessmentList(hierarchy) {
    let assessmentList = [];
    _.each(hierarchy, (bank) => {
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

  closeAssessmentView() {
    this.props.clearItems();
    this.props.clearAssessmentOffered();
    this.setState({
      isOpen: false,
      openIframe: false,
      assessmentClicked: {},
      currentBankId: null,
      nOfM: null
    });
  }

  offerAssessment(bankId, assessment){
    this.setState({
      isOpen: true,
      assessmentClicked: assessment,
      currentBankId: bankId
    });

    var qBankHost = this.props.settings.qBankHost;
    this.props.offerAssessment(bankId, assessment.id, qBankHost);
    this.props.getItems(bankId, assessment.id, qBankHost);
  }

  setNOfM(n) {
    // If n of m is null, we default it to -1 in the lambda function
    let nOfM = n;
    if(n === this.props.items.length) {
      nOfM = null;
    }

    this.setState({ nOfM });

    this.props.offerAssessment(
      this.state.currentBankId,
      this.state.assessmentClicked.id,
      this.props.settings.qBankHost,
      nOfM
    );
  }

  hasNoChildrenSelected(bank) {
    for(let b of bank.childNodes) {
      if(this.state.expandedBankPaths.has(b.pathId)) {
        return false;
      }
    }
    return true;
  }

  gatherAssessments(assessmentList, path, bank, force) {
    path = path.concat([bank.displayName.text]);
    if(force || this.state.expandedBankPaths.has(bank.pathId)) {
      if(bank.assessments.length > 0) {
        assessmentList.push(<h2 className="c-admin-list-location" key={`h_${bank.pathId}`}>{path.join(", ")}</h2>);
        assessmentList.push(
          <ul key={`l_${bank.pathId}`}>
            {bank.assessments.map((a) => (
               <li key={a.id} className="c-admin-list-item">
                 <a href="#" onClick={()=>{this.offerAssessment(bank.id, a);}}>{a.displayName.text}</a>
               </li>
             ))}
          </ul>
        );
      }
      let forceChildren = this.hasNoChildrenSelected(bank);
      bank.childNodes.forEach((b) => this.gatherAssessments(assessmentList, path, b, forceChildren));
    }
  }

  iframeUrl(playerUrl){
    let assessOffered = this.props.assessment_offered;
    if(!_.isEmpty(assessOffered)){
      let qBankHost = this.props.settings.qBankHost ? this.props.settings.qBankHost : "https://qbank-clix-dev.mit.edu";
      let localQbankUrl = this.props.settings.localQbankUrl;

      let url = `${playerUrl}/?unlock_next=ON_CORRECT` +
          `&api_url=${localQbankUrl || qBankHost}/api/v1` +
          `&bank=${assessOffered.bankId}&assessment_offered_id=${assessOffered.id}#/assessment`;
      return url;
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

  adminPreview(){
    var assessmentName = this.state.assessmentClicked.displayName ? this.state.assessmentClicked.displayName.text : "";

    let nOfMOptions;

    // If there are no items, render an empty option to clear the select.
    // Else, map over a range of numbers from 1 to items.length + 1,
    // and generate an option for each number.
    if(_.isEmpty(this.props.items)) {
      nOfMOptions = <option value=""></option>;
    } else {
      nOfMOptions = _.map(_.range(1, this.props.items.length + 1),
        (index) => {
          return <option key={index} value={index}>{index}</option>;
        }
      );
    }

    var localUrl = this.props.settings.localPlayerUrl;
    var playerUrl = this.props.settings.assessmentPlayerUrl;

    if(this.state.openIframe) {
      var iframeEmbed = IframeEmbed({
        openIframe:this.state.openIframe,
        url:this.iframeUrl(localUrl || playerUrl)
      });
    }

    if(!_.isEmpty(this.props.assessment_offered)) {
      var iframePreview = IframePreview({
        url: this.iframeUrl(playerUrl)
      });
    }

    return (
      <div className="o-admin-content">
        <div className="c-admin-content__header">
          <a href="#" onClick={()=>{ this.closeAssessmentView(); }} className="c-btn  c-btn--previous  c-btn--previous--small">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
              <path d="M14.83 16.42l9.17 9.17 9.17-9.17 2.83 2.83-12 12-12-12z"/>
            </svg>
            <span>Back To Assessment List</span>
          </a>
        </div>
        <div className="c-admin-content__main c-admin-content__main--preview">
          {iframeEmbed}
          <div className="c-preview-sidebar">
            <h2>{assessmentName}</h2>
            <p>Date Created: <span>02/09/2016</span></p>
            <p>Type: <span>{this.state.assessmentClicked.type}</span></p>
            <p>Student must answer
              <select value={ this.state.nOfM || this.props.items.length }
                  onChange={(e) => { this.setNOfM(parseInt(e.target.value)); }}
              >
                { nOfMOptions }
              </select> of {this.props.items.length}
            </p>
            <a style={{"marginTop":"135px"}} href="#" onClick={()=>{this.setState({openIframe: true});}} className="c-btn  c-btn--previous  c-btn--previous--small">
              <span>Create Iframe Code</span>
            </a>
          </div>
          <div className="c-preview-questions">
            <div className="c-preview-scroll">
              {iframePreview}
            </div>
          </div>
        </div>
      </div>);
  }

  render() {
    const hierarchy = this.props.banks;
    let error = this.props.application.error;
    let side;
    let content;

    if(error !== undefined) {
      side = null;
      content = <p className="c-admin-error">{error}</p>;
    } else {
      side = (
        <ul className="c-filter-scroll">
          {this.renderBankHierarchy(hierarchy)}
        </ul>
      );
      content = (
        <ul>
          {this.renderAssessmentList(hierarchy)}
        </ul>
      );
    }

    return (
      <div style={{"height": "100%"}}>
        <div className="o-admin-container">
          <div className="o-sidebar">
            <div className="c-sidebar__header">
              <img src="" alt="" />
            </div>
            <div className="c-sidebar__filters">
              <p className="c-filters__title">Filter Tree</p>
              {side}
            </div>
          </div>
          <div className="o-admin-content">
            <div className="c-admin-content__main  c-admin-content__main--scroll">
              {content}
            </div>
          </div>
        </div>
        <div className={this.slidingClasses()}>
          <div className="o-sidebar o-sidebar--preview"></div>
          {this.adminPreview()}
        </div>
      </div>
    );
  }

}

export default connect(select, { startApp, ...AssessmentActions })(Home);
