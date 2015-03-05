"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/**
 * @abstract BaseSyntax
 */

var BaseSyntax =

/**
 * The constructor of BaseSyntax
 *
 * @param {String} type
 */
function BaseSyntax(type) {
  _classCallCheck(this, BaseSyntax);

  this.type = type;
};

module.exports = BaseSyntax;