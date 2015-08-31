/**
 * step-by-step construction of a language from a decision graph
 * @constructor
 *
 * @param {DecisionGraph} dg - a Decision Graph that defines a grammar
 * @param {string} start - the name of a vertex in the decision graph
 */
var GuidedDecisionGraph = function (dg, start) {
  var construction = []

  /**
   * the current construction
   * @returns {string[]} a terminal symbol chain
   */
  this.construction = function () {
    return construction
  }
}

module.exports = GuidedDecisionGraph
