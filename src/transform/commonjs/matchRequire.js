import isString from '../../utils/isString';
import {matches, extract} from 'f-matches';

const isIdentifier = matches({
  type: 'Identifier'
});

// matches Property with Identifier key and value (possibly shorthand)
const isSimpleProperty = matches({
  type: 'Property',
  key: isIdentifier,
  computed: false,
  value: isIdentifier
});

// matches: {a, b: myB, c, ...}
const isObjectPattern = matches({
  type: 'ObjectPattern',
  properties: (props) => props.every(isSimpleProperty)
});

// matches: require(<source>)
const matchRequireCall = matches({
  type: 'CallExpression',
  callee: {
    type: 'Identifier',
    name: 'require'
  },
  arguments: extract('sources', (args) => {
    return args.length === 1 && isString(args[0]);
  })
});

/**
 * Matches: <id> = require(<source>);
 */
export const matchRequire = matches({
  type: 'VariableDeclarator',
  id: extract('id', id => isIdentifier(id) || isObjectPattern(id)),
  init: matchRequireCall
});

/**
 * Matches: <id> = require(<source>).<property>;
 */
export const matchRequireWithProperty = matches({
  type: 'VariableDeclarator',
  id: extract('id', isIdentifier),
  init: {
    type: 'MemberExpression',
    computed: false,
    object: matchRequireCall,
    property: extract('property', {
      type: 'Identifier'
    })
  }
});
