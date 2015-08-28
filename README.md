Takes a context-free grammar in JSON format and creates an interactive decision-making graph.

## JSON format
Input your grammar in a JSON object in the format:
```js
{
    "RuleName1": ["option1 secondword", "Nonterminal"],
  "Nonterminal": ["RuleName1 terminalOption2"]
}
```
Object properties define rules. Rules are an array of definition choices.
Each array item is a chain of items seperated by spaces. If an item is also an object property, it is a nonterminal. Else, it is a terminal.

Here is an example:
```js
{
        "Sentence": ["NounPhrase VerbPhrase"],
      "NounPhrase": ["the Noun", "the Noun RelativeClause"],
      "VerbPhrase": ["Verb", "Verb NounPhrase"],
  "RelativeClause": ["that VerbPhrase"],
            "Noun": ["dog", "cat", "bird", "squirrel"],
            "Verb": ["befriended", "loved", "ate", "attacked"]
}
```
Starting with `Sentence` this example might generate:
```
the cat befriended the squirrel
the cat ate the bird that attacked the squirrel
the squirrel loved the dog that befriended the cat that ate the bird
```


## Credit
This module is based on Alex Shkotin's [Graph representation of context-free grammars](http://arxiv.org/pdf/cs/0703015.pdf).