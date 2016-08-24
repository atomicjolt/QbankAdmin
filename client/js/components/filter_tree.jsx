import React from 'react';

import Spinner from './common/spinner';

export default class FilterTree extends React.Component {
  constructor(){
    super();
    this.state = {
      expandedBankPaths: new Set()
    };
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

  updateBankPaths(expandedBankPaths){
    this.setState({expandedBankPaths});
    if(_.isFunction(this.props.updateBankPaths)){
      this.props.updateBankPaths(expandedBankPaths);
    }
  }

  onExpandBank(bank, value) {
    let expandedBankPaths = new Set(this.state.expandedBankPaths);

    if(value) {
      expandedBankPaths.add(bank.pathId);
    } else {
      this.resetExpansion(bank, expandedBankPaths);
    }

    this.updateBankPaths(expandedBankPaths);
    this.props.closeAssessmentView();
  }

  renderChildren(children) {
    if(_.isUndefined(children)) { return; }
    return (
      <ul className="c-filter__dropdown">
        {children.map((child) => this.renderItem(child))}
      </ul>
    );
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

  renderBankHierarchy(hierarchy) {
    if(hierarchy === null) {
      return <div className="loader"><Spinner /></div>;
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

  render(){
    return (
      <ul className="c-filter-scroll">
        {this.renderBankHierarchy(this.props.banks)}
      </ul>
    );
  }
}
