import React     from 'react';
import ReactDOM  from 'react-dom';
import TestUtils from 'react/lib/ReactTestUtils';
import AdminPreview  from './admin_preview';

describe('Admin Preview', () => {
  var props = {
    settings: {
      qBankHost: "qbankhost",
      assessmentPlayerUrl: "http://player.org"
    },
    assessmentOffered: {
      bankId: "bankId",
      id: "offeredId"
    },
    assessmentClicked: {
      displayName:{},
      type: "assessment"
    },
    locales: ['en']
  };
  
  it('overrides qBankHost with localQbankUrl in the iframe code', () => {
    var result = TestUtils.renderIntoDocument(<AdminPreview {...props} />);
    result.setState({openIframe: true});
    let textArea = TestUtils.findRenderedDOMComponentWithClass(result, "c-preview-embed");
    expect(textArea.textContent).toContain("api_url=qbankhost");

    props.settings.localQbankUrl = "localQbankUrl";
    result = TestUtils.renderIntoDocument(<AdminPreview {...props}/>);
    result.setState({openIframe: true});
    textArea = TestUtils.findRenderedDOMComponentWithClass(result, "c-preview-embed");
    expect(textArea.textContent).toContain("api_url=localQbankUrl");
  });
});
