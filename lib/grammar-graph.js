var parseGrammar = require('./parse-grammar')
var GuidedDecisionGraph = require('./guided-decision-graph')

/**
 * creates a new GrammarGraph which can generate guides.
 * @constructor
 *
 * @param {object} grammar - an object representing a grammar. See example below.
 * @param {string|RegExp} [seperator=/\s+/] - how tokens will be divided in rules
 * @param {string} [epsilonSymbol=''] - Special terminal symbol
 * that indicates this is an end of a construction. Defaults to the
 * empty string.
 */
var GrammarGraph = function (grammar, seperator, epsilon) {
  var decisionGraph = parseGrammar(grammar, epsilon)

  /**
   * get an array of vertex names in the graph
   * @returns {string[]} the vertex names in this graph
   * @see {@link DecisionGraph#vertices}
   */
  this.vertices = function () {
    return decisionGraph.vertices()
  }

  /**
   * get an array of all the vertices this vertex points to
   * @param {string} v - the name of a vertex
   * @returns {string[]} an ordered list of all the vertices that v points to
   * @see {@link DecisionGraph#adj}
   */
  this.adj = function (v) {
    return decisionGraph.adj(v)
  }

  /**
   * is this a type AND vertex (and not a type OR)?
   * @param {string} v - the name of a vertex
   * @returns {boolean} is this a type AND vertex (and not a type OR)?
   * @see {@link DecisionGraph#isTypeAND}
   */
  this.isTypeAND = function (v) {
    return decisionGraph.isTypeAND(v)
  }

  /**
   * get a new GuidedDecisionGraph using this decision graph
   * @param {string} start - the name of a vertex in the decision graph from which
   * to start the guided expansion
   * @returns {GuidedDecisionGraph} a new guide from the provided start point
   * @see {@link GuidedDecisionGraph} for the methods available on the Guide
   */
  this.guide = function (start) {
    return new GuidedDecisionGraph(decisionGraph, start)
  }
}

module.exports = GrammarGraph
