import createTestHelpers from '../createTestHelpers';
const {expectTransform, expectNoChange} = createTestHelpers(['template']);

describe('Template string', () => {
  it('should not convert non-concatenated strings', () => {
    expectNoChange('var result = "test";');
  });

  it('should not convert non-string binary expressions with + operator', () => {
    expectNoChange('var result = 1 + 2;');
    expectNoChange('var result = a + b;');
  });

  it('should not convert only string concatenation', () => {
    expectNoChange('var result = "Hello " + " World!";');
  });

  it('should convert string and one variable concatenation', () => {
    expectTransform(
      'var result = "Firstname: " + firstname;'
    ).toReturn(
      'var result = `Firstname: ${firstname}`;'
    );
  });

  it('should convert string and multiple variables concatenation', () => {
    expectTransform(
      'var result = "Fullname: " + firstname + lastname;'
    ).toReturn(
      'var result = `Fullname: ${firstname}${lastname}`;'
    );
  });

  it('should convert parenthized string concatenations', () => {
    expectTransform(
      '"str1 " + (x + " str2");'
    ).toReturn(
      '`str1 ${x} str2`;'
    );
  });

  it('should convert parenthized string concatenations and other concatenations', () => {
    expectTransform(
      'x + " str1 " + (y + " str2");'
    ).toReturn(
      '`${x} str1 ${y} str2`;'
    );
  });

  it('should convert parenthized non-string concatenations', () => {
    expectTransform(
      '(x + y) + " string " + (a + b);'
    ).toReturn(
      '`${x + y} string ${a + b}`;'
    );
  });

  it('should convert non-parenthized non-string concatenations', () => {
    expectTransform(
      'x + y + " string " + a + b;'
    ).toReturn(
      '`${x + y} string ${a}${b}`;'
    );
  });

  it('should convert string and call expressions', () => {
    expectTransform(
      'var result = "Firstname: " + person.getFirstname() + "Lastname: " + person.getLastname();'
    ).toReturn(
      'var result = `Firstname: ${person.getFirstname()}Lastname: ${person.getLastname()}`;'
    );
  });

  it('should convert string and number literals', () => {
    expectTransform(
      '"foo " + 25 + " bar";'
    ).toReturn(
      '`foo ${25} bar`;'
    );
  });

  it('should convert string and member-expressions', () => {
    expectTransform(
      '"foo " + foo.bar + " bar";'
    ).toReturn(
      '`foo ${foo.bar} bar`;'
    );
  });

  it('should escape ` characters', () => {
    expectTransform(
      'var result = "Firstname: `" + firstname + "`";'
    ).toReturn(
      'var result = `Firstname: \\`${firstname}\\``;'
    );
  });

  it('should leave \\t, \\r, \\n, \\v, \\f, \\b, \\0, \\\\ escaped as is', () => {
    expectTransform('x = "\\t" + y;').toReturn('x = `\\t${y}`;');
    expectTransform('x = "\\r" + y;').toReturn('x = `\\r${y}`;');
    expectTransform('x = "\\n" + y;').toReturn('x = `\\n${y}`;');
    expectTransform('x = "\\v" + y;').toReturn('x = `\\v${y}`;');
    expectTransform('x = "\\f" + y;').toReturn('x = `\\f${y}`;');
    expectTransform('x = "\\b" + y;').toReturn('x = `\\b${y}`;');
    expectTransform('x = "\\0" + y;').toReturn('x = `\\0${y}`;');
    expectTransform('x = "\\\\" + y;').toReturn('x = `\\\\${y}`;');
  });

  it('should leave hex- and unicode-escapes as is', () => {
    expectTransform('x = "\\xA9" + y;').toReturn('x = `\\xA9${y}`;');
    expectTransform('x = "\\u00A9" + y;').toReturn('x = `\\u00A9${y}`;');
  });

  it('should eliminate escaping of quotes', () => {
    expectTransform('x = "\\\'" + y;').toReturn('x = `\'${y}`;');
    expectTransform('x = "\\"" + y;').toReturn('x = `"${y}`;');
  });

  it('should preserve comments', () => {
    expectTransform(
      'var foo =\n' +
      '    // First comment\n' +
      '    "Firstname: " + fname + ' +
      '    // Second comment\n' +
      '    " Middlename: " + mname +' +
      '    // Third comment\n' +
      '    " Lastname: " + lname;'
    ).toReturn(
      'var foo =\n' +
      '    // First comment\n' +
      '    // Second comment\n' +
      '    // Third comment\n' +
      '    `Firstname: ${fname} Middlename: ${mname} Lastname: ${lname}`;'
    );
  });

  it('should transform nested concatenation', () => {
    expectTransform(
      '"" + (() => "a" + 2)'
    ).toReturn(
      '`${() => `a${2}`}`'
    );
  });
});
