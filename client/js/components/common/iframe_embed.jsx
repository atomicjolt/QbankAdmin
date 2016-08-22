import React from 'react';

IframeEmbed.propTypes = {
  // Iframe src url 
  url: React.PropTypes.string
};

export default function IframeEmbed(props) {
  return (
    <div className="c-preview-embed">
      <label for="embed">Embed Code</label>
      <textarea id="embed" value={`<iframe src="${props.url}"/>`} readOnly="true" ></textarea>
    </div>
  );
}
