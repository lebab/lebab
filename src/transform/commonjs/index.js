import importCommonjs from './importCommonjs';
import exportCommonjs from './exportCommonjs';

export default function(ast, logger) {
  importCommonjs(ast, logger);
  exportCommonjs(ast, logger);
}
