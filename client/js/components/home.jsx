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

  checkItem(child, e){
    let itemChecked = this.state.itemChecked;
    itemChecked[child.id] = e.target.checked;
    this.setState({itemChecked});
  }

  renderItem(child){
    let itemClass = "c-filter__item";
    if(!_.isUndefined(child.children)){
      itemClass = itemClass + " c-filter__item--dropdown";
    }
    let renderedChildren;
    if(this.state.itemChecked[child.id]){
      renderedChildren = this.renderChildren(child.children);
    }
    return(<li key={child.id} className={itemClass}>
              <label className="c-checkbox--nested"><input type="checkbox" onChange={ (e) => this.checkItem(child, e) }/><div>{child.title}</div></label>
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
  // localhost:8091/api/v1/assessment/banks/
  // assessment.Bank%3A577d49564a4045154ead4dd4%40ODL.MIT.EDU/assessments/
  // assessment.Assessment%3A577d49584a4045154ead4f17%40ODL.MIT.EDU/assessmentsoffered

  allAssessments(hierarchy, assessment){

    _.forEach(hierarchy, (bank)=>{
      if(bank.assessments.length >= 1){
        assessment.push(bank.assessments);
      }
      if(bank.children && bank.children.length >= 1){
        this.allAssessments(bank.children, assessment);
      }
    });

    return _.flatten(assessment);
  }


  filteredAssessments(assessments){
    var items = this.state.itemChecked;
    var assessKeys = [];
    var bank = this.props.banks.toJS();

    _.forEach(items, (value, key)=>{
      if(value == true){
        assessKeys.push(key);
      }
    });
    //  return _.map(assessKeys, (keyItem)=>{
    //   return (
    //     <li key={keyItem} className="c-admin-list-item">
    //       <a href="">{keyItem}</a>
    //     </li>);
    // });
    return _.map(assessments, (keyItem)=>{
      var value = _.values(keyItem);
      return (
        <li key={value} className="c-admin-list-item">
          <a href="">{value}</a>
        </li>);
    });
  }

  render() {
    var hierarchy = this.props.banks.toJS();
    var assessment = [];

    var assessments = this.allAssessments(hierarchy, assessment);
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
          {this.filteredAssessments(assessments)}
        </ul>
      </div>
    </div>
    </div>);
  }
}

export default connect(select, { startApp })(Home);
