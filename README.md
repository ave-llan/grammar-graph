Takes a [context-free grammar](https://en.wikipedia.org/wiki/Context-free_grammar) and creates an interactive decision-making graph.

## Example
Input a grammar in object or JSON format:
```js
var grammar = {
        "Sentence": ["NounPhrase VerbPhrase"],
      "NounPhrase": ["the Noun", "the Noun RelativeClause"],
      "VerbPhrase": ["Verb", "Verb NounPhrase"],
  "RelativeClause": ["that VerbPhrase"],
            "Noun": ["dog", "cat", "bird", "squirrel"],
            "Verb": ["befriended", "loved", "ate", "attacked"]
}
```
Using `parseGrammar()` (function to be created soon), automatically generate a `DecisionGraph`.

```js
var decisionGraph = parseGrammar(grammar)

// make a guide from the newly created DecisionGraph, indicating the starting point
var guide = new GuidedDecisionGraph(decisionGraph, 'Sentence')

// get a list of possible first choices for your construction from the grammar
guide.choices()        =>  ['the']

// 'the' is our only choice, so choose it and see what the next choices are
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


## JSON format
Input your grammar as a JSON object in this format:
```js
{
    "RuleName1": ["option1 secondword", "Nonterminal"],
  "Nonterminal": ["RuleName1 terminalOption2"]
}
```
Object properties define rules. Rules are an array of definition choices.
Each array item is a chain of items seperated by spaces. If an item is also an object property, it is a nonterminal. Else, it is a terminal.



## Credit
This module is based on Alex Shkotin's [Graph representation of context-free grammars](http://arxiv.org/pdf/cs/0703015.pdf).