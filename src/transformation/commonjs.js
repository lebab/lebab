import importCommonjs from './import-commonjs.js';
import exportCommonjs from './export-commonjs.js';

export default function(ast) {
  importCommonjs(ast);
  exportCommonjs(ast);
}
