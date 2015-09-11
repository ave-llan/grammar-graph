Interactively construct a language from a [context-free grammar](https://en.wikipedia.org/wiki/Context-free_grammar). Like a regular expression which generates strings instead of matching them.

## Example

Install the npm module.
```
npm install grammar-graph
```

Require GrammarGraph, input a grammar, and construct a new graph. See [grammar format](https://github.com/jrleszcz/grammar-graph#grammar) for details on how a grammar works.
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
Where did `'_NounPhrase_1'`, `'_NounPhrase_2'`, and `'_VerbPhrase_1'` come from? Look at the definition of `NounPhrase` in the original grammar declaration. Both options contained multiple symbols, and the constructor has automatically created a name for each combination. In the case of `VerbPhrase`, only the second option contained multiple symbols, so only one extra name is needed. The automatic expansion of the original `NounPhrase` and `VerbPhrase` definitions result in the following equivalent definitions:
```js
{
     NounPhrase: ['_NounPhrase_1', '_NounPhrase_2'],
     VerbPhrase: ['Verb', '_VerbPhrase_1'],
  _NounPhrase_1: ['the Noun'],
  _NounPhrase_2: ['the Noun RelativeClause'],
  _VerbPhrase_1: ['Verb NounPhrase']
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
guide.choose('dog')

guide.choices()        =>  ['that', 'befriended', 'loved', 'ate', 'attacked']
guide.choose('ate')

guide.choices()        => ['', 'the']
```

This last set of choices includes the empty string, which indicates this could be a valid end to the construction. Choosing the empty string ends the construction and there are no more choices.
```js
guide.choose('')
guide.choices()        => []
guide.construction()   => ['the', 'dog', 'ate', '' ]
guide.constructs()     => ['the dog ate']
```

At any point, you can move back a step by popping off the last choice.
```js
guide.pop()            => ''
guide.choices()        => ['', 'the']
```

You can optionally provide `guide.choices()` with a number indicating the depth of choices you want. If you request a depth greater than 1, instead of an array of strings, it will return an array of TreeNodes which are each at most nDeep (or less if a path ends in a terminal).

```js
guide.choices(3)        =>
  [ { val: '',
     next: [] },
   { val: 'the',
     next: [ { val: 'squirrel',
              next: [ { val: 'that', next: [] },
                      { val: '',     next: [] } ]
             },
             { val: 'bird',
              next: [ { val: 'that', next: [] },
                      { val: '',     next: [] } ]
             },
             { val: 'cat',
              next: [ { val: 'that', next: [] },
                      { val: '',     next: [] } ]
             },
             { val: 'dog',
              next: [ { val: 'that', next: [] },
                      { val: '',     next: [] } ]
             }
           ]
   }
  ]
```

In addition to a single terminal string, `guide.choose()` can also accept an array of terminal strings.
```js
guide.choose([ 'the', 'squirrel', '' ])
guide.construction()    => ['the', 'dog', 'ate', 'the', 'squirrel', '' ]
```

## Grammar
A context-free grammar is a list of rules.  Here is a grammar with eight rules that builds creatures like this:

`~~(^__^)~~` or `~~(-______-)~~` or `~~(*_*)~~`.

```js
{
  Creature: ['Arm Head Arm'],
      Head: ['( Face )'],
      Face: ['HappyFace', 'ZenFace', 'SleepyFace'],
 HappyFace: ['^ Mouth ^'],
   ZenFace: ['- Mouth -'],
SleepyFace: ['* Mouth *'],
     Mouth: ['_', '_ Mouth'],
       Arm: ['~~']
}
```

#### Rules
A rule simply means to replace a word like `Creature` with its definition. If we are [constructing](https://github.com/jrleszcz/grammar-graph#building-a-creature) a sentence with the Creature grammar and come across the word `Head`, we will replace it with its definition: `( Face )`. Some rules have multiple options, such as a `Face` which can be rewritten as `HappyFace`, `ZenFace`, or `SleepyFace`.

More formally, a grammar is an object consisting of key-value pairs, with each [non-terminal symbol](https://github.com/jrleszcz/grammar-graph#non-terminal-symbols) pointing to an array of one or more [symbol chains](https://github.com/jrleszcz/grammar-graph#symbol-chains) choices for this non-terminal.

#### Symbol Chains
`Arm Head Arm` and `( Face )` are symbol chains. By default, each symbol is seperated by white-space, so both of these symbol chains are made up of three symbols: `Arm, Head, Arm` and `(, Face, )`.

#### Terminal Symbols
If a symbol has no definition in the grammar, it is a terminal. The six terminal symbols in the creature grammar are: `(, ), ^, *, _, ~~`. These are the actual building blocks of the language, and are the only symbols that will make it into a final construction.

#### Non-terminal Symbols
If a symbol has a definition in the grammar, it is non-terminal and can be broken down further. A non-terminal's definition is an array of one or more symbol chains indicating possible choices for this rule.
```
{
  RuleName: ['I am this', 'or this', 'or could be this'],
 RuleName2: ['I mean only one thing']
}
```
#### Recursive definitions
Recursive definitions are what make a grammar interesting and powerful. The creature grammar has only one recursive definition: `Mouth: ['_', '_ Mouth']`. This allows creatures to have mouths of one character if we immediately choose the first option, or up to infinite characters if we always choose the second option.

Do not define a non-terminal to equal only itself.  This will not work: `Mouth: ['Mouth']`.

#### Building a Creature
When constructing from a grammar, you need to indicate a starting point.  In this case it only makes sense to start from `Creature`. Let's break down `Creature` until we are left with only terminal symbols.
```
// construction     // replacement on this step

Creature            // Creature => Arm Head Arm
Arm Head Arm        // Arm      => ~~
~~Head Arm          // Head     => ( Face )
~~(Face) Arm        // Face     => ZenFace
~~(ZenFace) Arm     // Mouth    => _ Mouth
~~(-Mouth-) Arm     // Mouth    => _ Mouth
~~(-_Mouth-) Arm    // Mouth    => _ Mouth
~~(-__Mouth-) Arm   // Mouth    => _
~~(-___-) Arm       // Arm      => ~~
~~(-___-)~~
```

## Docs
[View the api documentation here.](api.md)

## Development

Clone the git repository and install development dependencies:
```
git clone https://github.com/jrleszcz/grammar-graph.git
cd grammar-graph
npm install
```

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