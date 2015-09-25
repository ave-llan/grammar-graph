var test = require('tape')
var Recognizer = require('../lib/recognizer.js')
var DecisionGraph = require('../lib/decision-graph.js')

test('Recognizer', function (t) {
  // set up decision graph
  var dg = new DecisionGraph()

  var ANDs = ['Sentence', '_NounPhrase_1', '_NounPhrase_2', '_VerbPhrase_1',
              'RelativeClause', 'the', 'that', 'dog', 'cat', 'bird', 'squirrel',
              'befriended', 'loved', 'ate', 'attacked']
  var ORs = ['NounPhrase', 'VerbPhrase', 'Noun', 'Verb']

  ANDs.forEach(function (andVertex) {
    dg.addVertexAND(andVertex)
  })

  ORs.forEach(function (orVertex) {
    dg.addVertexOR(orVertex)
  })

  dg.addEdge('Sentence', ['NounPhrase', 'VerbPhrase'])
  dg.addEdge('NounPhrase', ['_NounPhrase_1', '_NounPhrase_2'])
  dg.addEdge('VerbPhrase', ['Verb', '_VerbPhrase_1'])
  dg.addEdge('_NounPhrase_1', ['the', 'Noun'])
  dg.addEdge('_NounPhrase_2', ['the', 'Noun', 'RelativeClause'])
  dg.addEdge('_VerbPhrase_1', ['Verb', 'NounPhrase'])
  dg.addEdge('RelativeClause', ['that', 'VerbPhrase'])
  dg.addEdge('Noun', ['dog', 'cat', 'squirrel', 'bird'])
  dg.addEdge('Verb', ['befriended', 'loved', 'ate', 'attacked'])

  var recognizer = new Recognizer(dg, 'Sentence')
  t.true(recognizer instanceof Recognizer)

  t.true(recognizer.isValid(''))
  t.false(recognizer.isComplete(''))

  t.true(recognizer.isValid('the'))
  t.false(recognizer.isComplete('the'))

  t.true(recognizer.isValid('the dog'))
  t.false(recognizer.isComplete('the dog'))

  t.true(recognizer.isValid('the dog ate'))
  t.true(recognizer.isComplete('the dog ate'))

  t.false(recognizer.isValid('the dog ate the cat that is my friend'))
  t.false(recognizer.isComplete('the dog ate the cat that is my friend'))

  t.true(recognizer.isValid('the dog ate the cat that attacked the bird'))
  t.true(recognizer.isComplete('the dog ate the cat that attacked the bird'))
  t.end()
})
