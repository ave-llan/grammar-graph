var reduceGrammar = require('./reduce-grammar.js')
var DecisionGraph = require('./decision-graph.js')
var assertNoSelfLoops = require('./assert-no-self-loops.js')

/**
 * parse a grammar given as an object and compile it into a decision graph
 *
 * @param {object} grammar - an object representing a grammar
 * @param {string|RegExp} [seperator=/\s+/] - how tokens will be divided in rules
 * @returns {DecisionGraph} the grammar converted into a decision graph
 *
 */
var parseGrammar = function (grammar, seperator) {
  seperator = (seperator === undefined) ? /\s+/
                                          : seperator
  // make sure the rules are in a one-to-one relationship
  grammar = reduceGrammar(grammar, seperator)
  assertNoSelfLoops(grammar)

  var dg = new DecisionGraph()

  // add all nontermintal vertices
  var rules = Object.keys(grammar)
  rules.forEach(function (rule) {
    if (grammar[rule].length > 1) {
      dg.addVertexOR(rule)
    } else {
      dg.addVertexAND(rule)
    }
  })
  // add all edges as well as terminal vertices as they are encountered
  rules.forEach(function (rule) {
    grammar[rule].forEach(function (definition) {
      var tokens = definition.split(seperator)
      tokens.forEach(function (token) {
        if (!(token in grammar)) {
          dg.addVertexAND(token)
        }
      })
      dg.addEdge(rule, tokens)
    })
  })
  return dg
}

module.exports = parseGrammar
