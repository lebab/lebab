import {testTransformApi} from './testTransformApi';
const lebab = require('../index.js');

describe('ES5 commonjs API', () => {
  testTransformApi(lebab.transform);
});
