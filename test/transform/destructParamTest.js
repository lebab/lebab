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

  it('should not transform already destructed param', () => {
    expectNoChange(
      'function fn({cfg, cfg2}) {\n' +
      '  console.log(cfg.foo, cfg.bar);\n' +
      '}'
    );
  });
});
