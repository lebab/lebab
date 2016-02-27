import importCommonjs from './import-commonjs';
import exportCommonjs from './export-commonjs';

export default function(ast) {
  importCommonjs(ast);
  exportCommonjs(ast);
}
