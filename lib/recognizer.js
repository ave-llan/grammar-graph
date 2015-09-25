var GuidedDecisionGraph = require('./guided-decision-graph.js')

/**
 * create a Recognizer that can test if text is a valid sentence in a grammar
 * @constructor
 *
 * @param {DecisionGraph} dg - a Decision Graph that defines a grammar
 * @param {string} start - the name of a vertex in the decision graph from which
 * to start the test
 * @param {string|RegExp} [seperator=/\s+/] - how tokens will be divided in
 * given text
 */
var Recognizer = function (dg, start, seperator) {
  seperator = seperator || /\s+/

  /*
   * tries to add all tokens and return true if successful, else false
   *
   * @param {GuidedDecisionGraph} gdg - the guide to add tokens to
   * @param {string[]} tokens - an array of strings to be tested as
   * a terminal chain in the grammar
   *
   * @returns {boolean} were all tokens succesfully added to the gdg?
   */
  var addedTokens = function (gdg, tokens) {
    for (var i = 0; i < tokens.length; i++) {
      if (gdg.choices().indexOf(tokens[i]) === -1) {
        return false            // next token cannot be added to guide
      }
      gdg.choose(tokens[i])
    }
    return true                 // all tokens were added to guide
  }

  /**
   * is the text a valid in progress sentence in the grammar? Will return true
   * even if the text is not complete.
   * @param {string} text - the text to check
   * @returns {boolean} is the text valid?
   */
  this.isValid = function (text) {
    // by definition, an empty string is considered a valid start
    if (text.length === 0) {
      return true
    }
    var gdg = new GuidedDecisionGraph(dg, start)
    return addedTokens(gdg, text.split(seperator))
  }

  /**
   * is the text a valid and complete text in the grammar? Will return true
   * only if the text is complete.
   * @param {string} text - the text to check
   * @returns {boolean} is the text valid and complete?
   */
  this.isComplete = function (text) {
    var gdg = new GuidedDecisionGraph(dg, start)
    if (!addedTokens(gdg, text.split(seperator))) {
      return false          // guide is not valid, so no need to check completeness
    }
    return gdg.isComplete() // is this a complete construction?
  }
}

module.exports = Recognizer
