import { combineReducers }  from 'redux';

import application  from './application';
import auth         from './auth';
import jwt          from './jwt';
import messages     from './messages';
import settings     from './settings';

const rootReducer = combineReducers({
  settings,
  jwt,
  application,
  messages,
  auth
});

export default rootReducer;
