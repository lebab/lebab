import createTestHelpers from '../createTestHelpers';
const {expectTransform, expectNoChange} = createTestHelpers(['destruct-param']);

describe('Destruct function param', () => {
  it('should transform when only props are accessed', () => {
    expectTransform(
      'function fn(cfg) {\n' +
      '  console.log(cfg.foo, cfg.bar);\n' +
      '}'
    ).toReturn(
      'function fn({foo, bar}) {\n' +
      '  console.log(foo, bar);\n' +
      '}'
    );
  });

  it('should transform when the same prop accessed multiple times', () => {
    expectTransform(
      'function fn(cfg) {\n' +
      '  console.log(cfg.foo, cfg.bar, cfg.foo);\n' +
      '}'
    ).toReturn(
      'function fn({foo, bar}) {\n' +
      '  console.log(foo, bar, foo);\n' +
      '}'
    );
  });

  it('should not transform when re-defined as variable', () => {
    expectNoChange(
      'function fn(cfg) {\n' +
      '  var cfg;\n' +
      '  console.log(cfg.foo, cfg.bar);\n' +
      '}'
    );
  });

  it('should not transform when is used without props-access', () => {
    expectNoChange(
      'function fn(cfg) {\n' +
      '  console.log(cfg, cfg.foo, cfg.bar);\n' +
      '}'
    );
  });

  it('should not transform computed props-access', () => {
    expectNoChange(
      'function fn(cfg) {\n' +
      '  console.log(cfg, cfg["foo-hoo"], cfg["bar-haa"]);\n' +
      '}'
    );
  });

  it('should not transform when props are assigned', () => {
    expectNoChange(
      'function fn(cfg) {\n' +
      '  cfg.foo = 1;\n' +
      '  console.log(cfg.foo, cfg.bar);\n' +
      '}'
    );
  });

  it('should not transform when props are updated', () => {
    expectNoChange(
      'function fn(cfg) {\n' +
      '  cfg.foo++;\n' +
      '  console.log(cfg.foo, cfg.bar);\n' +
      '}'
    );
  });

  it('should not transform when props are methods', () => {
    expectNoChange(
      'function fn(cfg) {\n' +
      '  console.log(cfg.foo(), cfg.bar);\n' +
      '}'
    );
  });

  it('should not transform when props are keywords', () => {
    expectNoChange(
      'function fn(cfg) {\n' +
      '  console.log(cfg.let, cfg.for);\n' +
      '}'
    );
  });

  it('should not transform when param with name of prop already exists', () => {
    expectNoChange(
      'function fn(cfg, bar) {\n' +
      '  console.log(cfg.foo, cfg.bar);\n' +
      '}'
    );
  });

  it('should not transform when variable with name of prop already exists', () => {
    expectNoChange(
      'function fn(cfg) {\n' +
      '  var foo = 10;\n' +
      '  console.log(cfg.foo, cfg.bar);\n' +
      '}'
    );
  });

  it('should not transform when import with name of prop already exists', () => {
    expectNoChange(
      'import foo from "./myFooModule";\n' +
      'function fn(cfg) {\n' +
      '  console.log(cfg.foo, cfg.bar);\n' +
      '}'
    );
  });

  it('should not transform when shadowing a global variable', () => {
    expectNoChange(
      'function fn(cfg) {\n' +
      '  console.log(cfg.window);\n' +
      '  window.open("_blank");\n' +
      '}'
    );
  });

  it('should not transform when shadowing a global variable in separate fuction', () => {
    expectNoChange(
      'function fn(cfg) {\n' +
      '  function fn1() {\n' +
      '    console.log(cfg.window);\n' +
      '  }\n' +
      '  function fn2() {\n' +
      '    window.open("_blank");\n' +
      '  }\n' +
      '}'
    );
  });

  it('should not transform already destructed param', () => {
    expectNoChange(
      'function fn({cfg, cfg2}) {\n' +
      '  console.log(cfg.foo, cfg.bar);\n' +
      '}'
    );
  });

  it.skip('should not transform second param when this results in conflict', () => {
    expectTransform(
      'function fn(a, b) {\n' +
      '  console.log(a.foo, b.foo);\n' +
      '}'
    ).toReturn(
      'function fn({foo}, b) {\n' +
      '  console.log(foo, b.foo);\n' +
      '}'
    );
  });

  it.skip('should not perform second transform when it results in conflict', () => {
    expectTransform(
      'function fn(a) {\n' +
      '  console.log(a.foo);\n' +
      '  function fn(b) {\n' +
      '    console.log(a.foo, b.foo);\n' +
      '  }\n' +
      '}'
    ).toReturn(
      'function fn({foo}) {\n' +
      '  console.log(foo);\n' +
      '  function fn(b) {\n' +
      '    console.log(foo, b.foo);\n' +
      '  }\n' +
      '}'
    );
  });

  it('should transform when MAX_PROPS props', () => {
    expectTransform(
      'function fn(cfg) {\n' +
      '  console.log(cfg.p1, cfg.p2, cfg.p3, cfg.p4);\n' +
      '}'
    ).toReturn(
      'function fn({p1, p2, p3, p4}) {\n' +
      '  console.log(p1, p2, p3, p4);\n' +
      '}'
    );
  });

  it('should not transform more than MAX_PROPS props', () => {
    expectNoChange(
      'function fn(cfg) {\n' +
      '  console.log(cfg.p1, cfg.p2, cfg.p3, cfg.p4, cfg.p5);\n' +
      '}'
    ).withWarnings([
      {line: 1, msg: '5 different props found, will not transform more than 4', type: 'destruct-param'}
    ]);
  });
});
