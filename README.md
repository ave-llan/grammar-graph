Interactively construct a language from a [context-free grammar](https://en.wikipedia.org/wiki/Context-free_grammar). The grammar is converted into a decision-making graph, and a Guide keeps track of all possible states that the non-deterministic grammar might be in during constructionp.

## Example
```js
var grammar = {
        Sentence: ['NounPhrase VerbPhrase'],
      NounPhrase: ['the Noun', 'the Noun RelativeClause'],
      VerbPhrase: ['Verb', 'Verb NounPhrase'],
  RelativeClause: ['that VerbPhrase'],
            Noun: ['dog', 'cat', 'bird', 'squirrel'],
            Verb: ['befriended', 'loved', 'ate', 'attacked']
}

var dg = new DecisionGraph(grammar)

// make a guide from the newly created DecisionGraph, indicating the starting point
var guide = dg.guide('Sentence')

// the guide expands all non-terminals to give choices for the first terminal
guide.choices()        =>  ['the']

// 'the' is the only choice at the start of this grammar
guide.choose('the')
guide.choices()        =>  ['dog', 'cat', 'squirrel', 'bird']
guide.choose('squirrel')
guide.choices()        =>  ['that', 'befriended', 'loved', 'ate', 'attacked']
guide.choose('ate')

// at any point, you can check the current construction
guide.construction()   => ['the', 'squirrel', 'ate']

// the next set of choices includes the empty string, which indicates this could be
// a valid end to a construction.
guide.choices()        => ['', 'the']

// choosing the empty string means the construction is finished
guide.choose('')
guide.choices()        => []

// pop off the previous choice to move back a step
guide.pop()
guide.choices()        => ['', 'the']

// get an array of possible construction strings from the current state,
// possibly including nonterminals which have not been expanded yet.
guide.fullConstructs() => [ 'the dog ate',
                            'the dog ate the Noun',
                            'the dog ate the Noun RelativeClause' ]
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