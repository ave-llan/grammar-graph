Interactively construct a language from a [context-free grammar](https://en.wikipedia.org/wiki/Context-free_grammar). Like a regular expression which generates strings instead of matching them.

## Example & Walk-through

Install the npm module.
```
npm install grammar-graph
```

Require GrammarGraph, input a grammar, and construct a new graph. See [grammar format](https://github.com/jrleszcz/grammar-graph#grammar-format) below for details on inputting a grammar.
```js
var GrammarGraph = require('grammar-graph')

var grammar = {
        Sentence: ['NounPhrase VerbPhrase'],
      NounPhrase: ['the Noun', 'the Noun RelativeClause'],
      VerbPhrase: ['Verb', 'Verb NounPhrase'],
  RelativeClause: ['that VerbPhrase'],
            Noun: ['dog', 'cat', 'bird', 'squirrel'],
            Verb: ['befriended', 'loved', 'ate', 'attacked']
}

var graph = new GrammarGraph(grammar)
```


Check out the vertices in your graph.  The constructor creates a vertex for every terminal and non-terminal symbol in the grammar.
```js
graph.vertices()       =>
[ 'Sentence', 'NounPhrase', 'VerbPhrase', 'RelativeClause', 'Noun',
  'Verb',  '_NounPhrase_1', '_NounPhrase_2', '_VerbPhrase_1', 'that',
  'dog', 'cat', 'bird', 'squirrel', 'befriended', 'loved', 'ate',
  'attacked', 'the' ]
```
Where did `'_NounPhrase_1', '_NounPhrase_2', '_VerbPhrase_1'` come from? Look at the definition of `NounPhrase` in the original grammar declaration. Both options contained multiple symbols, and the constructor has automatically created a name for each one. So `NounPhrase: ['the Noun', 'the Noun RelativeClause']` is expanded to:
```js
{
      NounPhrase: ['_NounPhrase_1', '_NounPhrase_2'],
   _NounPhrase_1: ['the Noun'],
   _NounPhrase_2: ['the Noun RelativeClause'],
}
```


Let's create a new guide for constructing sentences from the langauge. Just indicate a starting point in the grammar, in this case `'Sentence'`.
```js
var guide = graph.guide('Sentence')
```

The guide gives choices for the next terminal in your construction. Behind the scenes, it is doing a breadth-first search for terminals from the current position. In our grammar, the only possible first terminal is `'the'`:
```js
guide.choices()        =>  ['the']
```

You can also check the full construct at any point in time. In this case, we will see that even though `'the'` is the only possible first terminal, there are actually two possible paths for the construction.
```js
guide.constructs()     =>
[ 'the Noun RelativeClause VerbPhrase', 'the Noun VerbPhrase' ]
```
To get to this point, the Guide has expanded `'Sentence'` => `'NounPhrase VerbPhrase'` => `'the Noun RelativeClause VerbPhrase' OR 'the Noun VerbPhrase'`. It stops at this point because it has reached terminal symbol `'the'` in both possible paths.


`'the'` is the only choice, so let's choose it. We can then check our construction and possible constructs.
```js
guide.choose('the')
guide.construction()   =>  ['the']
guide.constructs()     =>
[ 'the bird RelativeClause VerbPhrase',
  'the bird VerbPhrase',
  'the cat RelativeClause VerbPhrase',
  'the cat VerbPhrase',
  'the dog RelativeClause VerbPhrase',
  'the dog VerbPhrase',
  'the squirrel RelativeClause VerbPhrase',
  'the squirrel VerbPhrase' ]
guide.choices()        =>  ['squirrel', 'bird', 'cat', 'dog' ]
```


Let's continue the construction.
```js
guide.choices()        =>  ['dog', 'cat', 'squirrel', 'bird']
guide.choose('squirrel')

guide.choices()        =>  ['that', 'befriended', 'loved', 'ate', 'attacked']
guide.choose('ate')

guide.choices()        => ['', 'the']
```

This last set of choices includes the empty string, which indicates this could be a valid end to the construction. Choosing the empty string ends the construction and there are no more choices.
```js
guide.choose('')
guide.choices()        => []
guide.construction()   => ['the', 'squirrel', 'ate', '' ]
guide.constructs()     => ['the squirrel ate']
```

At any point, you can move back a step by popping off the last choice.
```js
guide.pop()            => ''
guide.choices()        => ['', 'the']
guide.pop()            => 'ate'
guide.choices()        => ['that', 'befriended', 'loved', 'ate', 'attacked']
```

## Grammar format
Input your grammar as an object in this format:
```js
{
    "RuleName1": ["option1 secondword", "Nonterminal"],
  "Nonterminal": ["RuleName1 terminalOption2"]
}
```
Object properties define rules. Rules are an array of definition choices.
Each array item is a chain of items seperated by spaces. If an item is also an object property, it is a nonterminal. Else, it is a terminal.


## Docs
[View the api documentation here.](api.md)

## Development

To run eslint and tape tests:
```
npm test
```

To generate api documentation for [api.md](api.md):
```
npm run docs
```

## Credit
This module is based on Alex Shkotin's [Graph representation of context-free grammars](http://arxiv.org/pdf/cs/0703015.pdf).