"use strict";

import React        from 'react';
import { connect }  from 'react-redux';

import { startApp }  from '../actions/app';
import assets        from '../libs/assets';


@connect((state) => (state), {startApp}, null, {withRef: true})
class Home extends React.Component {

  constructor(){
    super();
    this.state = {
      gradeChecked: {},
    };
  }

  componentWillMount() {
    let p = this.props;
    if(p.auth.authenticated && !p.application.started) {
      p.startApp(p.auth.auth_token);
    }
  }

  activity(children){
    return _.map(children, (child)=>{
      return (<ul className="c-filter__dropdown">
                <li className="c-filter__item">
                  <label className="c-checkbox--nested"><input type="checkbox"/><div>{child.title}</div></label>
                </li>
              </ul>);
    });
  }

  lesson(children){
    return _.map(children, (child)=>{
      return (<ul className="c-filter__dropdown">
                <li className="c-filter__item  c-filter__item--dropdown">
                  <label className="c-checkbox--nested"><input type="checkbox"/><div>{child.title}</div></label>
                  {this.activity(child.children)}
                </li>
              </ul>);
    });
  }

  unit(children){
    return _.map(children, (child)=>{
      return (<ul className="c-filter__dropdown">
                <li className="c-filter__item  c-filter__item--dropdown">
                  <label className="c-checkbox--nested"><input type="checkbox"/><div>{child.title}</div></label>
                  {this.lesson(child.children)}
                </li>
              </ul>);
    });
  }

  mainTopic(children){
    return _.map(children, (child)=>{
      return (<ul className="c-filter__dropdown">
              <li className="c-filter__item  c-filter__item--dropdown">
                <ul className="c-filter__dropdown">
                  <li className="c-filter__item  c-filter__item--dropdown">
                    <label className="c-checkbox--nested"><input type="checkbox"/><div>{child.title}</div></label>
                    {this.unit(child.children)}
                  </li>
                </ul>
              </li>
            </ul>);;
    });
  }

  gradeLevel(hierarchy){
    return _.map(hierarchy.Bank, (grade)=>{
      return (
          <li className="c-filter__item  c-filter__item--dropdown">
            <label className="c-checkbox--nested">
              <input type="checkbox"/>
                <div>
                  {grade.title}
                </div>
            </label>
            {this.mainTopic(grade.children)}
          </li>);
    });
  }

  // toggleFilter(grade){
  //   var gradeChecked = this.state.gradeChecked; // is a hash of what is checked.

  //   var standard = _.filter(this.props.topicStandards, (ts)=>{ return ts.name == `${priority.name}`; })[0];

  //   if(metaData[standard.id]){
  //     _.unset(metaData, standard.id);
  //   } else {
  //     metaData[standard.id] = standard.name;
  //   }
  //   this.setState({ metaData: metaData });
  // }

  render() {

    const img = assets("./images/atomicjolt.jpg");
    var hierarchy = this.props.banks.toJS();

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
          <li className="c-admin-list-item">
            <a href="">Assessment 1</a>
          </li>
          <li className="c-admin-list-item">
            <a href="">Assessment 2</a>
          </li>
          <li className="c-admin-list-item">
            <a href="">Assessment 3</a>
          </li>
        </ul>
      </div>
    </div>
    </div>);
  }
}
export { Home as default };

