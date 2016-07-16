import { combineReducers }  from 'redux';

import application  from './application';
import auth         from './auth';
import jwt          from './jwt';
import settings     from './settings';
import banks        from './banks';

const rootReducer = combineReducers({
  settings,
  jwt,
  application,
  auth,
  banks
});

export default rootReducer;
