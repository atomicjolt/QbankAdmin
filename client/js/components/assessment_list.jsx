import React from 'react';

export default class AssessmentList extends React.Component {

  static propTypes = {
    assessmentClick: React.PropTypes.func,
    banks: React.PropTypes.array,
    expandedBankPaths: React.PropTypes.object
  };

  handleAssessmentClick(id, assessment){
    if(_.isFunction(this.props.assessmentClick)) {
      this.props.assessmentClick(id, assessment);
    }
  }

  hasNoChildrenSelected(bank) {
    for(let b of bank.childNodes) {
      if(this.props.expandedBankPaths.has(b.pathId)) {
        return false;
      }
    }
    return true;
  }

  gatherAssessments(assessmentList, path, bank, force) {
    path = path.concat([bank.displayName.text]);
    if(force || this.props.expandedBankPaths.has(bank.pathId)) {
      if(bank.assessments.length > 0) {
        assessmentList.push(<h2 className="c-admin-list-location" key={`h_${bank.pathId}`}>{path.join(", ")}</h2>);
        assessmentList.push(
          <ul key={`l_${bank.pathId}`}>
            {bank.assessments.map((a) => (
               <li key={a.id} className="c-admin-list-item">
                 <a href="#" onClick={()=>this.handleAssessmentClick(bank.id, a)}>{a.displayName.text}</a>
               </li>
             ))}
          </ul>
        );
      }
      let forceChildren = this.hasNoChildrenSelected(bank);
      bank.childNodes.forEach((b) => this.gatherAssessments(assessmentList, path, b, forceChildren));
    }
  }

  renderAssessmentList(hierarchy) {
    let assessmentList = [];
    _.each(hierarchy, (bank) => {
      this.gatherAssessments(assessmentList, [], bank);
    });
    return assessmentList;
  }

  render(){
    return (
      <ul>
        {this.renderAssessmentList(this.props.banks)}
      </ul>
    );
  }
};
