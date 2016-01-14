/**
 * check a grammar for direct self-loops
 * @param {object} grammar - the grammar to check
 * @param {true} returns true if no errors
 * @throws an error if one definition of a nonterminal is exactly the nonterminal itself
 */
function noSelfDefinitions (grammar) {
  var rules = Object.keys(grammar)
  rules.forEach(function (rule) {
    grammar[rule].forEach(function (def) {
      if (def === rule) {
        throw new Error('Nonterminal ' + rule + ' has a definition defining it as itself: ' + grammar[rule])
      }
    })
  })
  return true
}

module.exports = noSelfDefinitions
