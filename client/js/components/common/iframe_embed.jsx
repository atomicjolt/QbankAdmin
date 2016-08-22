import React from 'react';

export default function IframeEmbed(props) {
  if(props.openIframe){
    return (
      <div className="c-preview-embed">
        <label for="embed">Embed Code</label>
        <textarea id="embed" value={`<iframe src="${props.url}"/>`} readOnly="true" ></textarea>
      </div>
    );
  }
}
