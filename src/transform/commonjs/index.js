import importCommonjs from './import-commonjs';
import exportCommonjs from './export-commonjs';

export default function(ast, logger) {
  importCommonjs(ast, logger);
  exportCommonjs(ast, logger);
}
