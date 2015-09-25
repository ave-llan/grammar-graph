var parseGrammar = require('./parse-grammar')
var GuidedDecisionGraph = require('./guided-decision-graph')

/**
 * @typedef {string} SymbolChain - a string of one or more symbol names seperated by whitespace or
 * another user defined seperator (see: seperator param for {@link GrammarGraph})
 *
 * @see a SymbolChain is used as definitions in {@link Grammar}
 *
 * @example
 * 'dog'                        // just a single symbol, the word 'dog'
 * 'the Noun RelativeClause'    // three symbols
 */

/**
 * a user defined context-free grammar formatted as an object consisting of key-value pairs,
 * with each [non-terminal symbol](https://github.com/jrleszcz/grammar-graph#non-terminal-symbols)
 * pointing to an array of one or more [symbol chains](https://github.com/jrleszcz/grammar-graph#symbol-chains)
 * choices for this non-terminal.
 *
 * @typedef {Object} Grammar
 * @property {SymbolChain[]} symbol - each element of the array is a possible definition
 *    for this symbol.
 * @example
 * var grammar = {
 *       Sentence: ['NounPhrase VerbPhrase'],                 // only one definition of 'Sentence'
 *     NounPhrase: ['the Noun', 'the Noun RelativeClause'],   // two possible definitions of 'NounPhrase'
 *     VerbPhrase: ['Verb', 'Verb NounPhrase'],
 * RelativeClause: ['that VerbPhrase'],
 *           Noun: ['dog', 'cat', 'bird', 'squirrel'],        // four possible definitions of 'Noun'
 *           Verb: ['befriended', 'loved', 'ate', 'attacked']
 * }
 * // non-terminals: Sentence, NounPhrase, VerbPhrase, RelativeClause, Noun, Verb
 * //     terminals: the, that, dog, cat, bird, squirrel, befriended, loved, ate, attacked
 */

/**
 * creates a new GrammarGraph which can generate guides.
 * @constructor
 *
 * @param {Grammar} grammar - an object representing a grammar.
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
  this.createGuide = function (start) {
    return new GuidedDecisionGraph(decisionGraph, start)
  }

  /**
   * Returns a recognizer function that indicates whether a given text
   * is a valid string in the language.
   * @param {string} start - the name of a vertex in the decision graph
   * from which to start the recognizer test
   * @returns {Recognizer} a new recognizer function
   */
  this.getRecognizer = function (start) {

  }
}

module.exports = GrammarGraph
