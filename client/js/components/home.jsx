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
      itemChecked: {},
      assessments: {}
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


  offerAssessment(bankId, assessmentId){
    this.setState({fetchingOffered: true});
    var qBankHost = this.props.settings.qBankHost;
    this.props.offerAssessment(bankId, assessmentId, qBankHost);
  }

  renderAssessments(bank, force){
    let itemChecked = this.state.itemChecked;
    let assessmentItems = [];
    if(force || itemChecked[bank.id]) {
      assessmentItems.push(
        _.map(bank.assessments, (a) => (
          <li key={a.id} className="c-admin-list-item">
            <a href="#" onClick={()=>{this.offerAssessment(bank.id, a.id);}}>{a.displayName.text}</a>
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

  iframe(){
    let assessOffered = this.props.assessment_offered;
    if(!_.isEmpty(assessOffered)){
      let qBankHost = this.props.settings.qBankHost ? this.props.settings.qBankHost : "https://qbank-clix-dev.mit.edu";
      let playerHost = "http://localhost:8080"; //This will need to be the instance deployed, not localhost.
      let url = encodeURI(`${playerHost}/?unlock_next=ON_CORRECT&api_url=${qBankHost}/api/v1&bank=${assessOffered.bankId}&assessment_offered_id=${assessOffered.id}#/assessment`);
      return `<iframe src="${url}"/>`;
    }
    return "";
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

  render() {

    var hierarchy = this.props.banks;
    const img = assets("./images/atomicjolt.jpg");

    if(!this.props.auth.authenticated) {
      return (
        <div>
          <div class="main">
            <h2>Providers</h2>
            <div class="providers">
              <a href="https://4h8n6sg95j.execute-api.us-east-1.amazonaws.com/dev/authentication/signin/google" id="google">Sign In With Google</a>
            </div>
          </div>
        </div>
      );
    }

    return (
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
        <div className="c-preview-embed">
          <label for="embed">Embed Code</label>
          <textarea id="embed" value ={this.iframe()} readOnly="true"></textarea>
        </div>
      </div>
    </div>
    </div>);
  }
}

export default connect(select, { startApp, offerAssessment, clearSnippet })(Home);