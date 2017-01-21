/**
 * check a grammar for direct self-loops
 * @param {object} grammar - the grammar to check
 * @param {true} returns true if no errors
 * @throws an error if one definition of a nonterminal is exactly the nonterminal itself
 */
function noSelfDefinitions (grammar) {
  for (var token of Object.keys(grammar)) {
    for (var definition of grammar[token]) {
      if (definition === token) {
        throw new Error('Nonterminal ' + token + ' has a definition defining it as itself: ' + grammar[token])
      }
    }
  }
  return true
}

module.exports = noSelfDefinitions
