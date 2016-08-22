import React from 'react';

export default function IframePreview(props) {
  if(!_.isEmpty(props.assessment_offered)){
    return (
      <div>
        <iframe id="openassessments_container" src={props.url}/>
      </div>
    );
  }
}
