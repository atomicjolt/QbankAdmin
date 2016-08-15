import { combineReducers }  from 'redux';

import application        from './application';
import auth               from './auth';
import jwt                from './jwt';
import settings           from './settings';
import banks              from './banks';
import assessment_offered from './assessment_offered';
import items              from './items';

const rootReducer = combineReducers({
  settings,
  jwt,
  application,
  auth,
  banks,
  assessment_offered,
  items
});

export default rootReducer;
