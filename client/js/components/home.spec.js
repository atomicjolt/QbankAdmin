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
      },
      locales: ['en']
    };
    result = TestUtils.renderIntoDocument(<Home {...props}/>);
  });

  it('renders', () => {
    expect(ReactDOM.findDOMNode(result).textContent).toContain("Filter Tree");
  });
});
