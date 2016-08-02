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
      itemChecked: {},
      assessments: {},
      fetchingOffered: false
    };
  }

  componentWillMount() {
    let p = this.props;
    if(p.auth.authenticated && !p.application.started) {
      p.startApp(p.auth.auth_token, this.props.settings.qBankHost);
    }
  }

  checkItem(bank, value){
    this.props.clearSnippet();
    this.setState({fetchingOffered: false});
    let map = {[bank.id]: value};
    if(!value){
      this.resetHierarchy(bank, map);
    }
    let itemChecked = Object.assign({}, this.state.itemChecked, map);
    this.setState({itemChecked});
  }

  resetHierarchy(bank, map){
    map[bank.id] = false;
    _.forEach(bank.childNodes, (bc)=>{
      this.resetHierarchy(bc, map);
    });
  }

  isCheckedBreadcrumbs(bankId){
    var checked = _.compact(_.map(this.state.itemChecked, (val, key)=>{if(val === true){return key;}}));
    return _.includes(checked, bankId);
  }

  renderItem(bank){
    let itemClass = "c-filter__item";
    if(bank.childNodes.length == 0){
      itemClass = itemClass + " c-filter__item--dropdown";
    }
    let renderedChildren;
    if(this.state.itemChecked[bank.id]){
      renderedChildren = this.renderChildren(bank.childNodes);
    }
    return (
      <li key={bank.id} className={itemClass}>
        <label className="c-checkbox--nested">
          <input type="checkbox" checked={this.isCheckedBreadcrumbs(bank.id)} onChange={ (e) => this.checkItem(bank, e.target.checked) }/>
          <div>{bank.displayName.text}</div>
        </label>
        {renderedChildren}
      </li>
    );
  }

  renderChildren(children){
    if(_.isUndefined(children)){ return; }
    return _.map(children, (child)=>{
      return (
        <ul key={child.id} className="c-filter__dropdown">
          {this.renderItem(child)}
        </ul>);
    });
  }

  gradeLevel(hierarchy){
    if(_.isEmpty(hierarchy)){
      return <div className="loader">{this.spinner()}</div>;
    }
    return _.map(hierarchy, (child)=>{
      return this.renderItem(child);
    });
  }

  filteredAssessments(hierarchy){
    return _.flatten(_.map(hierarchy, (bank)=>{
      return this.renderAssessments(bank);
    }));
  }

  noChildChecked(bank, itemChecked){
    for (var i in bank.childNodes){
      if(itemChecked[bank.childNodes[i].id]){
        return false;
      }
    }
    return true;
  }


  offerAssessment(bankId, assessment){
    this.setState({fetchingOffered: true,
                   isOpen: true,
                   assessmentClicked: assessment });
    var qBankHost = this.props.settings.qBankHost;
    this.props.offerAssessment(bankId, assessment.id, qBankHost);
  }

  renderAssessments(bank, force){
    let itemChecked = this.state.itemChecked;
    let assessmentItems = [];
    if(force || itemChecked[bank.id]) {
      assessmentItems.push(
        _.map(bank.assessments, (a) => (
          <li key={a.id} className="c-admin-list-item">
            <a href="#" onClick={()=>{this.offerAssessment(bank.id, a);}}>{a.displayName.text}</a>
          </li>
        ))
      );
      let forceChildren = this.noChildChecked(bank, itemChecked);
      for(let i in bank.childNodes) {
        let bc = bank.childNodes[i];
        Array.prototype.push.apply(assessmentItems, this.renderAssessments(bc, forceChildren));
      }
    }
    return assessmentItems;
  }

  iframeSpinner(){
    if(_.isEmpty(this.props.assessment_offered) && this.state.fetchingOffered == true) {
      //The default height was 40rem but in this instance I only want the size of 5rem
      return <div className="c-assessment-loading" style={{"height": "5rem"}}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 92 92">
          <path d="M46.1,82.3H41.9l-3.1-.3-3.8-.8-2.1-.7L31.7,80l-1.1-.5A35.7,35.7,0,0,1,21,73.7,37.8,37.8,0,0,1,7.6,49.1l-.2-2V41A32.7,32.7,0,0,1,8,36.8l.4-2.1c.1-.7.4-1.4.6-2a40.3,40.3,0,0,1,8.7-15,41,41,0,0,1,14.5-10l2.1-.8,2.1-.6a34.1,34.1,0,0,1,4.3-1L41.9,5h1.1l2.2-.2h6.3l2.2.3,2.1.4,2,.4,2,.6,2,.6,1.9.7,1.8.8a42.5,42.5,0,0,1,12.2,8.7,41.3,41.3,0,0,1,7.5,10.5l.7,1.3.5,1.3,1,2.4c.5,1.6.9,3.1,1.3,4.4l.7,3.7c.2,1.1.2,2,.3,2.8L90,46a7.5,7.5,0,1,1-15,1.2q0-.3,0-.6V44.5a17.6,17.6,0,0,0,0-1.8l-.2-2.5c-.2-.9-.4-1.9-.6-3.1l-.5-1.7-.3-.9-.4-.9a28.1,28.1,0,0,0-4.5-7.7,30.3,30.3,0,0,0-8.2-7l-1.3-.7-1.3-.7-1.4-.6-1.4-.5-1.5-.5-1.5-.4-1.4-.3-.7-.2h-.9l-1.9-.2H42a25,25,0,0,0-3.4.5l-1.7.3-1.7.5a32.8,32.8,0,0,0-12.2,6.9,33.5,33.5,0,0,0-8.2,11.8c-.2.6-.5,1.1-.7,1.7l-.5,1.7a27.4,27.4,0,0,0-.8,3.4l-.2.8v1l-.2,1.9v3.5a33.9,33.9,0,0,0,3.1,13.2A34.9,34.9,0,0,0,22.5,72a33.8,33.8,0,0,0,8.6,6.3l1,.6,1.1.4,2,.8,3.7,1.1,3,.6,2.3.3Z"/>
        </svg>
      </div>;
    }
  }

  iframe(){
    let assessOffered = this.props.assessment_offered;
    if(!_.isEmpty(assessOffered)){
      let qBankHost = this.props.settings.qBankHost ? this.props.settings.qBankHost : "https://qbank-clix-dev.mit.edu";
      let playerHost = this.props.settings.assessmentPlayerUrl; //This will need to be the instance deployed, not localhost.
      let url = encodeURI(`${playerHost}/?unlock_next=ON_CORRECT&api_url=${qBankHost}/api/v1&bank=${assessOffered.bankId}&assessment_offered_id=${assessOffered.id}#/assessment`);
      return `<iframe src="${url}"/>`;
    } else {
      return "";
    }
  }

  breadcrumbs(hierarchy){
    var checked = _.compact(_.map(this.state.itemChecked, (val, key)=>{if(val === true){return key;}}));
    return _.map(hierarchy, (bank)=>{
      if(_.includes(checked, bank.id)){
        return [(
          <div className="c-breadcrumb" key={bank.id}>
            <span>{bank.displayName.text}</span>
            <a href="#" onClick={()=>{this.checkItem(bank, false);}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
                  <path d="M29.17 16l-5.17 5.17-5.17-5.17-2.83 2.83 5.17 5.17-5.17 5.17 2.83 2.83 5.17-5.17 5.17 5.17 2.83-2.83-5.17-5.17 5.17-5.17-2.83-2.83zm-5.17-12c-11.05 0-20 8.95-20 20s8.95 20 20 20 20-8.95 20-20-8.95-20-20-20zm0 36c-8.82 0-16-7.18-16-16s7.18-16 16-16 16 7.18 16 16-7.18 16-16 16z"/>
              </svg>
            </a>
          </div>
        ), this.breadcrumbs(bank.childNodes)];
      }
    });
  }

  spinner(){
    return (
      <div className="c-assessment-loading">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 92 92">
          <path d="M46.1,82.3H41.9l-3.1-.3-3.8-.8-2.1-.7L31.7,80l-1.1-.5A35.7,35.7,0,0,1,21,73.7,37.8,37.8,0,0,1,7.6,49.1l-.2-2V41A32.7,32.7,0,0,1,8,36.8l.4-2.1c.1-.7.4-1.4.6-2a40.3,40.3,0,0,1,8.7-15,41,41,0,0,1,14.5-10l2.1-.8,2.1-.6a34.1,34.1,0,0,1,4.3-1L41.9,5h1.1l2.2-.2h6.3l2.2.3,2.1.4,2,.4,2,.6,2,.6,1.9.7,1.8.8a42.5,42.5,0,0,1,12.2,8.7,41.3,41.3,0,0,1,7.5,10.5l.7,1.3.5,1.3,1,2.4c.5,1.6.9,3.1,1.3,4.4l.7,3.7c.2,1.1.2,2,.3,2.8L90,46a7.5,7.5,0,1,1-15,1.2q0-.3,0-.6V44.5a17.6,17.6,0,0,0,0-1.8l-.2-2.5c-.2-.9-.4-1.9-.6-3.1l-.5-1.7-.3-.9-.4-.9a28.1,28.1,0,0,0-4.5-7.7,30.3,30.3,0,0,0-8.2-7l-1.3-.7-1.3-.7-1.4-.6-1.4-.5-1.5-.5-1.5-.4-1.4-.3-.7-.2h-.9l-1.9-.2H42a25,25,0,0,0-3.4.5l-1.7.3-1.7.5a32.8,32.8,0,0,0-12.2,6.9,33.5,33.5,0,0,0-8.2,11.8c-.2.6-.5,1.1-.7,1.7l-.5,1.7a27.4,27.4,0,0,0-.8,3.4l-.2.8v1l-.2,1.9v3.5a33.9,33.9,0,0,0,3.1,13.2A34.9,34.9,0,0,0,22.5,72a33.8,33.8,0,0,0,8.6,6.3l1,.6,1.1.4,2,.8,3.7,1.1,3,.6,2.3.3Z"/>
        </svg>
      </div>);
  }
  iframeCode(){
    if(this.state.openIframe){
      return (
      <div className="c-preview-embed">
        <div>{this.iframeSpinner()}</div>
        <label for="embed">Embed Code</label>
        <textarea id="embed" value={this.iframe()} readOnly="true" ></textarea>
      </div>
      );
    }
    return null;
  }

  adminPreview(){
    var assessmentName = this.state.assessmentClicked.displayName ? this.state.assessmentClicked.displayName.text : "";
    return (<div className="o-admin-content">
    <div className="c-admin-content__header">
      <a href="#" onClick={()=>{this.setState({isOpen: false, openIframe: false});}} className="c-btn  c-btn--previous  c-btn--previous--small">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
          <path d="M14.83 16.42l9.17 9.17 9.17-9.17 2.83 2.83-12 12-12-12z"/>
        </svg>
        <span>back</span>
      </a>
    </div>
    <div className="c-admin-content__main c-admin-content__main--preview">
      {this.iframeCode()}
      <div className="c-preview-sidebar">
        <h2>{assessmentName}</h2>
        <p>Date Created: <span>02/09/2016</span></p>
        <p>Type: <span>{this.state.assessmentClicked.type}</span></p>
        <a href="#" onClick={()=>{this.setState({openIframe: true});}} className="c-btn  c-btn--previous  c-btn--previous--small">
        <span>Create Iframe Code</span>
      </a>
      </div>
      <div className="c-preview-questions">
        <div class="c-preview-scroll">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/KAMeI4uHAFE" frameborder="0" allowfullscreen></iframe>
        </div>
      </div>
    </div>
  </div>);
  }

  slidingClasses(){
    if(this.state.isOpen){
      return "o-admin-container  o-admin-container--preview is-open";
    }
    return "o-admin-container  o-admin-container--preview";
  }

  render() {

    const hierarchy = this.props.banks;
    const img = assets("./images/atomicjolt.jpg");

    return (
  <div style={{"height": "100%"}}>
    <div className="o-admin-container">
      <div className="o-sidebar">
        <div className="c-sidebar__header">
          <img src="" alt="" />
        </div>
        <div className="c-sidebar__filters">
          <p className="c-filters__title">Filter Tree</p>
          <ul className="c-filter-scroll">
            {this.gradeLevel(hierarchy)}
          </ul>
        </div>
      </div>
      <div className="o-admin-content">
        <div className="c-admin-content__header">
          {this.breadcrumbs(hierarchy)}
        </div>
        <div className="c-admin-content__main  c-admin-content__main--scroll">
          <ul>
            {this.filteredAssessments(hierarchy)}
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