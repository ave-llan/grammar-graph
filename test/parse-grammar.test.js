var test = require('tape')
var parseGrammar = require('../lib/parse-grammar.js')
var DecisionGraph = require('../lib/decision-graph.js')

test('parseGrammar', function (t) {
  var g = {
    Sentence: ['NounPhrase VerbPhrase'],
    NounPhrase: ['the Noun', 'the Noun RelativeClause'],
    VerbPhrase: ['Verb', 'Verb NounPhrase'],
    RelativeClause: ['that VerbPhrase'],
    Noun: ['dog', 'cat', 'bird', 'squirrel'],
    Verb: ['befriended', 'loved', 'ate', 'attacked']
  }

  var dg = parseGrammar(g)

  t.true(dg instanceof DecisionGraph)
  t.true(dg.isVertex('dog'))
  t.true(dg.isVertex('VerbPhrase'))
  t.true(dg.isTerminal('bird'))
  t.true(dg.isVertex('dog'))
  t.true(dg.isTypeAND('Sentence'))
  t.false(dg.isTypeAND('NounPhrase'))

  t.end()
})
