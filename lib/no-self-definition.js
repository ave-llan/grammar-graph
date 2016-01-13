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
