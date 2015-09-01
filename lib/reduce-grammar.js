/**
 * reduces the rules of a grammar into a one to one form by assigning a name
 * to all non-terminals. The end result is that each option on a rule with
 * more than one choice will either be a single AND-rule or a single terminal.
 *
 * @param {object} grammar - an object representing a grammar
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
 *    _NounPhrase_1: ['the Noun']
 *    _NounPhrase_2: ['the Noun RelativeClause']
 *   RelativeClause: ['that VerbPhrase'],
 *             Noun: ['dog', 'cat', 'bird']
 * }
 *
 */
var reduceGrammar = function (grammar) {

}

module.exports = reduceGrammar
