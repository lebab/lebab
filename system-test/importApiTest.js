import {testTransformApi} from './testTransformApi';
import lebab, {transform} from '../index.js';

describe('ES6 default import API', () => {
  testTransformApi(lebab.transform);
});

describe('ES6 named import API', () => {
  testTransformApi(transform);
});
