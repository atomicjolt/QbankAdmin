import React     from 'react';
import ReactDOM  from 'react-dom';
import TestUtils from 'react/lib/ReactTestUtils';
import { Home }  from './home';

describe('home', () => {
  var props, result;
  beforeEach(() => {
    props = {
      auth: {
        authenticated: true
      },
      application: {
        started: true
      },
      banks: [],
      items: [],
      settings: {
        qBankHost: "qbankhost"
      },
      assessment_offered: {
        bankId: "bankId",
        id: "offeredId"
      }
    };
    result = TestUtils.renderIntoDocument(<Home {...props}/>);
  });

  it('renders', () => {
    expect(ReactDOM.findDOMNode(result).textContent).toContain("Filter Tree");
  });

  it('overrides qBankHost with localQbankUrl in the iframe code', () => {
    result.setState({openIframe: true});
    let textArea = TestUtils.findRenderedDOMComponentWithClass(result, "c-preview-embed");
    expect(textArea.textContent).toContain("api_url=qbankhost");

    props.settings.localQbankUrl = "localQbankUrl";
    result = TestUtils.renderIntoDocument(<Home {...props}/>);
    result.setState({openIframe: true});
    textArea = TestUtils.findRenderedDOMComponentWithClass(result, "c-preview-embed");
    expect(textArea.textContent).toContain("api_url=localQbankUrl");
  });
});
