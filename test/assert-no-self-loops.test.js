var test = require('tape')
var assertNoSelfLoops = require('../lib/assert-no-self-loops.js')
var reduceGrammar = require('../lib/reduce-grammar.js')

test('assertNoSelfLoops', function (t) {
  var g = {
    Sentence: ['NounPhrase VerbPhrase'],
    NounPhrase: ['the Noun', 'the Noun RelativeClause'],
    VerbPhrase: ['Verb', 'Verb NounPhrase'],
    RelativeClause: ['that VerbPhrase'],
    Noun: ['dog', 'cat', 'bird', 'squirrel'],
    Verb: ['befriended', 'loved', 'ate', 'attacked']
  }
  var grammar = reduceGrammar(g)

  t.true(assertNoSelfLoops(grammar))

  t.end()
})
