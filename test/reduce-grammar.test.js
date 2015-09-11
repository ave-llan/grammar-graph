var test = require('tape')
var reduceGrammar = require('../lib/reduce-grammar.js')

test('reduceGrammar', function (t) {
  var g = {
    NounPhrase: ['the Noun', 'the Noun RelativeClause'],
    RelativeClause: ['that VerbPhrase'],
    Noun: ['dog', 'cat', 'bird']
  }

  t.deepEqual(g,
    {
      NounPhrase: ['the Noun', 'the Noun RelativeClause'],
      RelativeClause: ['that VerbPhrase'],
      Noun: ['dog', 'cat', 'bird']
    }, 'does not mutate argument')

  t.notEqual(reduceGrammar(g), g)

  t.deepEqual(reduceGrammar(g), {
    NounPhrase: ['_NounPhrase_1', '_NounPhrase_2'],
    _NounPhrase_1: ['the Noun'],
    _NounPhrase_2: ['the Noun RelativeClause'],
    RelativeClause: ['that VerbPhrase'],
    Noun: ['dog', 'cat', 'bird']
  })

  g = {
    Sentence: ['NounPhrase VerbPhrase'],
    NounPhrase: ['the Noun', 'the Noun RelativeClause'],
    VerbPhrase: ['Verb', 'Verb NounPhrase'],
    RelativeClause: ['that VerbPhrase'],
    Noun: ['dog', 'cat', 'bird', 'squirrel'],
    Verb: ['befriended', 'loved', 'ate', 'attacked']
  }

  t.deepEqual(reduceGrammar(g), {
    Sentence: [ 'NounPhrase VerbPhrase' ],
    NounPhrase: [ '_NounPhrase_1', '_NounPhrase_2' ],
    VerbPhrase: [ 'Verb', '_VerbPhrase_1' ],
    RelativeClause: [ 'that VerbPhrase' ],
    Noun: [ 'dog', 'cat', 'bird', 'squirrel' ],
    Verb: [ 'befriended', 'loved', 'ate', 'attacked' ],
    _NounPhrase_1: [ 'the Noun' ],
    _NounPhrase_2: [ 'the Noun RelativeClause' ],
    _VerbPhrase_1: [ 'Verb NounPhrase' ]
  })

  g = {
    NounPhrase: ['the+Noun', 'the+Noun+RelativeClause'],
    RelativeClause: ['that+VerbPhrase'],
    Noun: ['dog', 'cat', 'bird']
  }

  t.deepEqual(reduceGrammar(g, '+'), {
    NounPhrase: ['_NounPhrase_1', '_NounPhrase_2'],
    _NounPhrase_1: ['the+Noun'],
    _NounPhrase_2: ['the+Noun+RelativeClause'],
    RelativeClause: ['that+VerbPhrase'],
    Noun: ['dog', 'cat', 'bird']
  })

  t.end()
})
