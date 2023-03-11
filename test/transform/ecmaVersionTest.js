import createTestHelpers from '../createTestHelpers';
const {expectNoChange} = createTestHelpers([
  'class',
  'template',
  'arrow',
  'let',
  'default-param',
  'arg-spread',
  'obj-method',
  'obj-shorthand',
  'no-strict',
  'commonjs',
  'exponent',
]);

describe('ECMAScript version', () => {
  it('supports optional catch binding in ECMAScript 2019', () => {
    expectNoChange('try { ohNo(); } catch { console.log("error!"); }');
  });

  it('supports optional chaining in ECMAScript 2020', () => {
    expectNoChange('foo?.bar();');
  });

  it('supports numeric separators in ECMAScript 2021', () => {
    expectNoChange('const nr = 10_000_000;');
  });
});
