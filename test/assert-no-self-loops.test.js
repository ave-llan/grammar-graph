var test = require('tape')
var assertNoSelfLoops = require('../lib/assert-no-self-loops.js')
var reduceGrammar = require('../lib/reduce-grammar.js')

test('assertNoSelfLoops', function (t) {
  var g = {
    Sentence       : ['NounPhrase VerbPhrase'],
    NounPhrase     : ['the Noun', 'the Noun RelativeClause'],
    VerbPhrase     : ['Verb', 'Verb NounPhrase'],
    RelativeClause : ['that VerbPhrase'],
    Noun           : ['dog', 'cat', 'bird', 'squirrel'],
    Verb           : ['befriended', 'loved', 'ate', 'attacked']
  }
  var grammar = reduceGrammar(g)

  t.true(assertNoSelfLoops(grammar))

  var g2 = {
    grammar: ['something else', 'grammar', 'another thing']
  }

  t.throws(function () {
    assertNoSelfLoops(g2)
  })

  var g3 = {
    grammar : ['something else', '2342', 'another thing'],
    lottery : ['winner', 'loser', 'lottery winner']
  }

  t.true(assertNoSelfLoops(g3))

  g3.paper = ['water', 'scissors', 'paper', 'rock']

  t.throws(function () {
    assertNoSelfLoops(g3)
  })

  t.end()
})
