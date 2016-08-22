import React from 'react';


IframePreview.propTypes = {
  // Iframe src url 
  url: React.PropTypes.string
};

export default function IframePreview(props) {
  return (
    <div>
      <iframe id="openassessments_container" src={props.url}/>
    </div>
  );
}
