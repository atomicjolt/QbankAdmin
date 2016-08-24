import React from 'react';

import Spinner from './common/spinner';

export default class FilterTree extends React.Component {

  static propTypes = {

    // Set representing the selected banks
    expandedBankPaths: React.PropTypes.instanceOf(Set).isRequired,

    // Array of qbank question banks
    banks: React.PropTypes.array,

    // Function called when a filter tree item is clicked
    itemClicked: React.PropTypes.func.isRequired,
  };

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

  itemClicked(expandedBankPaths){
    if(_.isFunction(this.props.itemClicked)){
      this.props.itemClicked(expandedBankPaths);
    }
  }

  onExpandBank(bank, value) {
    let expandedBankPaths = new Set(this.props.expandedBankPaths);

    if(value) {
      expandedBankPaths.add(bank.pathId);
    } else {
      this.resetExpansion(bank, expandedBankPaths);
    }

    this.itemClicked(expandedBankPaths);
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
    let expanded = this.props.expandedBankPaths.has(bank.pathId);
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
