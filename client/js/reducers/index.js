import { combineReducers }  from 'redux';

import application  from './application';
import auth         from './auth';
import jwt          from './jwt';
import settings     from './settings';

const rootReducer = combineReducers({
  settings,
  jwt,
  application,
  auth
});

export default rootReducer;
