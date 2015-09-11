var clone = require('./utils/clone.js')

/**
 * reduces the rules of a grammar into a one to one form by assigning a name
 * to all non-terminals. The end result is that each option on a rule with
 * more than one choice will either be a single AND-rule or a single terminal.
 *
 * @param {object} grammar - an object representing a grammar
 * @param {string|RegExp} [seperator=/\s+/] - how tokens will be divided in rules
 * @returns {object} the modified grammar object with newly created rules
 * as needed. New rules will be given the name of their parent rule
 * surrounded by underscores and followed by a number.
 *
 * @example
 * var grammar = {
 *       NounPhrase: ['the Noun', 'the Noun RelativeClause'],
 *   RelativeClause: ['that VerbPhrase'],
 *             Noun: ['dog', 'cat', 'bird']
 * }
 *
 * reduceGrammar(grammar)   =>
 * {
 *       NounPhrase: ['_NounPhrase_1', '_NounPhrase_2'],
 *    _NounPhrase_1: ['the Noun'],
 *    _NounPhrase_2: ['the Noun RelativeClause'],
 *   RelativeClause: ['that VerbPhrase'],
 *             Noun: ['dog', 'cat', 'bird']
 * }
 *
 */
var reduceGrammar = function (grammar, seperator) {
  grammar = clone(grammar) // clone to avoid mutating the argument
  seperator = (seperator === undefined) ? /\s+/
                                          : seperator
  var rules = Object.keys(grammar)
  rules.forEach(function (rule) {
    if (grammar[rule].length > 1) {
      var id = 1
      grammar[rule].forEach(function (definition, i) {
        var tokens = definition.split(seperator)
        // create a new rule if length greater than 1
        if (tokens.length > 1) {
          var ruleName = '_' + rule + '_' + id
          grammar[ruleName] = [definition]
          grammar[rule][i] = ruleName
          id++
        }
      })
    }
  })
  return grammar
}

module.exports = reduceGrammar
