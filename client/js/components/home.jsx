"use strict";

import React        from 'react';
import { connect }  from 'react-redux';
import { startApp }  from '../actions/app';
import assets        from '../libs/assets';
import _             from 'lodash';

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
      p.startApp(p.auth.auth_token);
    }
  }

  checkItem(bank, value){
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

  renderItem(bank){
    let itemClass = "c-filter__item";
    if(!_.isUndefined(bank.childNodes)){
      itemClass = itemClass + " c-filter__item--dropdown";
    }
    let renderedChildren;
    if(this.state.itemChecked[bank.id]){
      renderedChildren = this.renderChildren(bank.childNodes);
    }
    return(<li key={bank.id} className={itemClass}>
              <label className="c-checkbox--nested"><input type="checkbox" onChange={ (e) => this.checkItem(bank, e.target.checked) }/><div>{bank.displayName ? bank.displayName.text : "DUMMY"}</div></label>
              {renderedChildren}
            </li>);
  }

  renderChildren(children){
    if(_.isUndefined(children)){ return; }
    return _.map(children, (child)=>{
      return (<ul key={child.id} className="c-filter__dropdown">
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

  renderAssessments(bank, force){
    console.log("renderAssessments", bank, force);
    let itemChecked = this.state.itemChecked;
    let assessmentItems = [];
    if(force || itemChecked[bank.id]) {
      assessmentItems.push(
        _.map(bank.assessments, (a) => (
          <li key={a.id} className="c-admin-list-item">
            <a href="">{a.displayName.text}</a>
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

  render() {

    var item = this.state.itemChecked;
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
        <div className="c-breadcrumb">
          <span>8th Grade</span>
          <a href="">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
                <path d="M29.17 16l-5.17 5.17-5.17-5.17-2.83 2.83 5.17 5.17-5.17 5.17 2.83 2.83 5.17-5.17 5.17 5.17 2.83-2.83-5.17-5.17 5.17-5.17-2.83-2.83zm-5.17-12c-11.05 0-20 8.95-20 20s8.95 20 20 20 20-8.95 20-20-8.95-20-20-20zm0 36c-8.82 0-16-7.18-16-16s7.18-16 16-16 16 7.18 16 16-7.18 16-16 16z"/>
            </svg>
          </a>
        </div>
        <div className="c-breadcrumb">
          <span>Math</span>
          <a href="">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
                <path d="M29.17 16l-5.17 5.17-5.17-5.17-2.83 2.83 5.17 5.17-5.17 5.17 2.83 2.83 5.17-5.17 5.17 5.17 2.83-2.83-5.17-5.17 5.17-5.17-2.83-2.83zm-5.17-12c-11.05 0-20 8.95-20 20s8.95 20 20 20 20-8.95 20-20-8.95-20-20-20zm0 36c-8.82 0-16-7.18-16-16s7.18-16 16-16 16 7.18 16 16-7.18 16-16 16z"/>
            </svg>
          </a>
        </div>
        <div className="c-breadcrumb">
          <span>Geometry</span>
          <a href="">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
                <path d="M29.17 16l-5.17 5.17-5.17-5.17-2.83 2.83 5.17 5.17-5.17 5.17 2.83 2.83 5.17-5.17 5.17 5.17 2.83-2.83-5.17-5.17 5.17-5.17-2.83-2.83zm-5.17-12c-11.05 0-20 8.95-20 20s8.95 20 20 20 20-8.95 20-20-8.95-20-20-20zm0 36c-8.82 0-16-7.18-16-16s7.18-16 16-16 16 7.18 16 16-7.18 16-16 16z"/>
            </svg>
          </a>
        </div>
        <div className="c-breadcrumb">
          <span>Unit 1</span>
          <a href="">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
                <path d="M29.17 16l-5.17 5.17-5.17-5.17-2.83 2.83 5.17 5.17-5.17 5.17 2.83 2.83 5.17-5.17 5.17 5.17 2.83-2.83-5.17-5.17 5.17-5.17-2.83-2.83zm-5.17-12c-11.05 0-20 8.95-20 20s8.95 20 20 20 20-8.95 20-20-8.95-20-20-20zm0 36c-8.82 0-16-7.18-16-16s7.18-16 16-16 16 7.18 16 16-7.18 16-16 16z"/>
            </svg>
          </a>
        </div>
        <div className="c-breadcrumb">
          <span>Lesson 1</span>
          <a href="">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
                <path d="M29.17 16l-5.17 5.17-5.17-5.17-2.83 2.83 5.17 5.17-5.17 5.17 2.83 2.83 5.17-5.17 5.17 5.17 2.83-2.83-5.17-5.17 5.17-5.17-2.83-2.83zm-5.17-12c-11.05 0-20 8.95-20 20s8.95 20 20 20 20-8.95 20-20-8.95-20-20-20zm0 36c-8.82 0-16-7.18-16-16s7.18-16 16-16 16 7.18 16 16-7.18 16-16 16z"/>
            </svg>
          </a>
        </div>
      </div>
      <div className="c-admin-content__main  c-admin-content__main--scroll">
        <ul>
          {this.filteredAssessments(hierarchy)}
        </ul>
      </div>
    </div>
    </div>);
  }
}

export default connect(select, { startApp })(Home);
