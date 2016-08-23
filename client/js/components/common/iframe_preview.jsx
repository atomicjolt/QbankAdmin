import React from 'react';


IframePreview.propTypes = {
  // Iframe src url
  url: React.PropTypes.string
};

export default function IframePreview(props) {
  return (
    <div className="c-preview-questions">
      <div className="c-preview-scroll">
        <div>
          <iframe id="openassessments_container" src={props.url}/>
        </div>
      </div>
    </div>
  );
}
