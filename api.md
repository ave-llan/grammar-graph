## Classes
<dl>
<dt><a href="#DecisionGraph">DecisionGraph</a></dt>
<dd></dd>
<dt><a href="#GrammarGraph">GrammarGraph</a></dt>
<dd></dd>
<dt><a href="#GuidedDecisionGraph">GuidedDecisionGraph</a></dt>
<dd></dd>
</dl>
## Functions
<dl>
<dt><a href="#parseGrammar">parseGrammar(grammar, [seperator])</a> ⇒ <code><a href="#DecisionGraph">DecisionGraph</a></code></dt>
<dd><p>parse a grammar given as an object and compile it into a decision graph</p>
</dd>
<dt><a href="#reduceGrammar">reduceGrammar(grammar, [seperator])</a> ⇒ <code>object</code></dt>
<dd><p>reduces the rules of a grammar into a one to one form by assigning a name
to all non-terminals. The end result is that each option on a rule with
more than one choice will either be a single AND-rule or a single terminal.</p>
</dd>
</dl>
<a name="DecisionGraph"></a>
## DecisionGraph
**Kind**: global class  

* [DecisionGraph](#DecisionGraph)
  * [new DecisionGraph([epsilonSymbol])](#new_DecisionGraph_new)
  * [.addVertexAND(name)](#DecisionGraph+addVertexAND)
  * [.addVertexOR(name)](#DecisionGraph+addVertexOR)
  * [.addEdge(v, w)](#DecisionGraph+addEdge)
  * [.adj(v)](#DecisionGraph+adj) ⇒ <code>Array.&lt;string&gt;</code>
  * [.V()](#DecisionGraph+V) ⇒ <code>number</code>
  * [.isTerminal(v)](#DecisionGraph+isTerminal) ⇒ <code>boolean</code>
  * [.isVertex(v)](#DecisionGraph+isVertex) ⇒ <code>boolean</code>
  * [.isTypeAND(v)](#DecisionGraph+isTypeAND) ⇒ <code>boolean</code>
  * [.epsilon()](#DecisionGraph+epsilon) ⇒ <code>string</code>
  * [.vertices()](#DecisionGraph+vertices) ⇒ <code>Array.&lt;string&gt;</code>
  * [.guide(start)](#DecisionGraph+guide)

<a name="new_DecisionGraph_new"></a>
### new DecisionGraph([epsilonSymbol])
creates a new DecisionGraph


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [epsilonSymbol] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | Special terminal symbol that indicates this is an end of a construction. Defaults to the empty string. |

<a name="DecisionGraph+addVertexAND"></a>
### decisionGraph.addVertexAND(name)
add AND vertex to the graph. When moving through the decision graph, an AND vertex
will require a visit down each of its outgoing edges, in the order the edges were
added.

**Kind**: instance method of <code>[DecisionGraph](#DecisionGraph)</code>  
**See**: [addVertexOR](#DecisionGraph+addVertexOR)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the name of this vertex |

<a name="DecisionGraph+addVertexOR"></a>
### decisionGraph.addVertexOR(name)
add OR vertex to the graph. When moving through the decision graph, an OR vertex
chooses just one of its outgoing vertices.

**Kind**: instance method of <code>[DecisionGraph](#DecisionGraph)</code>  
**See**: [addVertexAND](#DecisionGraph+addVertexAND)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the name of this vertex |

<a name="DecisionGraph+addEdge"></a>
### decisionGraph.addEdge(v, w)
add edge v->w to the graph

**Kind**: instance method of <code>[DecisionGraph](#DecisionGraph)</code>  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>string</code> | the name of a vertex this edge points from |
| w | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> | the name of a vertex this edge points to or an array of vertex names. If vertex v is type AND, the order of w will be the exact order required. |

<a name="DecisionGraph+adj"></a>
### decisionGraph.adj(v) ⇒ <code>Array.&lt;string&gt;</code>
get an array of all the vertices this vertex points to

**Kind**: instance method of <code>[DecisionGraph](#DecisionGraph)</code>  
**Returns**: <code>Array.&lt;string&gt;</code> - an ordered list of all the vertices that v points to  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>string</code> | the name of a vertex |

<a name="DecisionGraph+V"></a>
### decisionGraph.V() ⇒ <code>number</code>
get the number of vertices in this graph

**Kind**: instance method of <code>[DecisionGraph](#DecisionGraph)</code>  
**Returns**: <code>number</code> - the number of vertices in this graph  
<a name="DecisionGraph+isTerminal"></a>
### decisionGraph.isTerminal(v) ⇒ <code>boolean</code>
is this a terminal vertex (does it have no outgoing edges?)
Epsilon returns true to indicate the end of a construction.

**Kind**: instance method of <code>[DecisionGraph](#DecisionGraph)</code>  
**Returns**: <code>boolean</code> - is this a terminal vertex  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>string</code> | the name of a vertex |

<a name="DecisionGraph+isVertex"></a>
### decisionGraph.isVertex(v) ⇒ <code>boolean</code>
is this the name of a vertex in the graph?

**Kind**: instance method of <code>[DecisionGraph](#DecisionGraph)</code>  
**Returns**: <code>boolean</code> - is this a vertex in the graph  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>string</code> | the name of a vertex |

<a name="DecisionGraph+isTypeAND"></a>
### decisionGraph.isTypeAND(v) ⇒ <code>boolean</code>
is this a type AND vertex (and not a type OR)?

**Kind**: instance method of <code>[DecisionGraph](#DecisionGraph)</code>  
**Returns**: <code>boolean</code> - is this a type AND vertex (and not a type OR)?  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>string</code> | the name of a vertex |

<a name="DecisionGraph+epsilon"></a>
### decisionGraph.epsilon() ⇒ <code>string</code>
get the string representing epsilon in this graph

**Kind**: instance method of <code>[DecisionGraph](#DecisionGraph)</code>  
**Returns**: <code>string</code> - the string representing epsilon  
<a name="DecisionGraph+vertices"></a>
### decisionGraph.vertices() ⇒ <code>Array.&lt;string&gt;</code>
get an array of vertex names

**Kind**: instance method of <code>[DecisionGraph](#DecisionGraph)</code>  
**Returns**: <code>Array.&lt;string&gt;</code> - the vertex names in this graph  
<a name="DecisionGraph+guide"></a>
### decisionGraph.guide(start)
get a new GuidedDecisionGraph using this decision graph

**Kind**: instance method of <code>[DecisionGraph](#DecisionGraph)</code>  
**See**: [GuidedDecisionGraph](#GuidedDecisionGraph)  

| Param | Type | Description |
| --- | --- | --- |
| start | <code>string</code> | the name of a vertex in the decision graph from which to start the guided expansion |

<a name="GrammarGraph"></a>
## GrammarGraph
**Kind**: global class  

* [GrammarGraph](#GrammarGraph)
  * [new GrammarGraph(grammar, [seperator], [epsilonSymbol])](#new_GrammarGraph_new)
  * [.vertices()](#GrammarGraph+vertices) ⇒ <code>Array.&lt;string&gt;</code>
  * [.guide(start)](#GrammarGraph+guide) ⇒ <code>[GuidedDecisionGraph](#GuidedDecisionGraph)</code>

<a name="new_GrammarGraph_new"></a>
### new GrammarGraph(grammar, [seperator], [epsilonSymbol])
creates a new GrammarGraph which can generate guides.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| grammar | <code>object</code> |  | an object representing a grammar. See example below. |
| [seperator] | <code>string</code> &#124; <code>RegExp</code> | <code>&quot;/\\s+/&quot;</code> | how tokens will be divided in rules |
| [epsilonSymbol] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | Special terminal symbol that indicates this is an end of a construction. Defaults to the empty string. |

<a name="GrammarGraph+vertices"></a>
### grammarGraph.vertices() ⇒ <code>Array.&lt;string&gt;</code>
get an array of vertex names in the graph

**Kind**: instance method of <code>[GrammarGraph](#GrammarGraph)</code>  
**Returns**: <code>Array.&lt;string&gt;</code> - the vertex names in this graph  
**See**: [vertices](#DecisionGraph+vertices)  
<a name="GrammarGraph+guide"></a>
### grammarGraph.guide(start) ⇒ <code>[GuidedDecisionGraph](#GuidedDecisionGraph)</code>
get a new GuidedDecisionGraph using this decision graph

**Kind**: instance method of <code>[GrammarGraph](#GrammarGraph)</code>  
**Returns**: <code>[GuidedDecisionGraph](#GuidedDecisionGraph)</code> - a new guide from the provided start point  
**See**: [GuidedDecisionGraph](#GuidedDecisionGraph) for the methods available on the Guide  

| Param | Type | Description |
| --- | --- | --- |
| start | <code>string</code> | the name of a vertex in the decision graph from which to start the guided expansion |

<a name="GuidedDecisionGraph"></a>
## GuidedDecisionGraph
**Kind**: global class  

* [GuidedDecisionGraph](#GuidedDecisionGraph)
  * [new GuidedDecisionGraph(dg, start)](#new_GuidedDecisionGraph_new)
  * [.construction()](#GuidedDecisionGraph+construction) ⇒ <code>Array.&lt;string&gt;</code>
  * [.isComplete()](#GuidedDecisionGraph+isComplete) ⇒ <code>boolean</code>
  * [.choices()](#GuidedDecisionGraph+choices) ⇒ <code>Array.&lt;string&gt;</code>
  * [.choose(terminal)](#GuidedDecisionGraph+choose)
  * [.fullConstructs()](#GuidedDecisionGraph+fullConstructs) ⇒ <code>Array.&lt;string&gt;</code>
  * [.pop()](#GuidedDecisionGraph+pop) ⇒ <code>string</code>

<a name="new_GuidedDecisionGraph_new"></a>
### new GuidedDecisionGraph(dg, start)
step-by-step construction of a language from a decision graph


| Param | Type | Description |
| --- | --- | --- |
| dg | <code>[DecisionGraph](#DecisionGraph)</code> | a Decision Graph that defines a grammar |
| start | <code>string</code> | the name of a vertex in the decision graph from which to start the guided expansion |

<a name="GuidedDecisionGraph+construction"></a>
### guidedDecisionGraph.construction() ⇒ <code>Array.&lt;string&gt;</code>
the current construction

**Kind**: instance method of <code>[GuidedDecisionGraph](#GuidedDecisionGraph)</code>  
**Returns**: <code>Array.&lt;string&gt;</code> - a terminal symbol chain  
<a name="GuidedDecisionGraph+isComplete"></a>
### guidedDecisionGraph.isComplete() ⇒ <code>boolean</code>
is the current construction a valid, complete construction from the starting
nonterminal? ie, does the construction end in epsilon?

**Kind**: instance method of <code>[GuidedDecisionGraph](#GuidedDecisionGraph)</code>  
**Returns**: <code>boolean</code> - is the construction complete  
<a name="GuidedDecisionGraph+choices"></a>
### guidedDecisionGraph.choices() ⇒ <code>Array.&lt;string&gt;</code>
returns an array of the possible next terminals

**Kind**: instance method of <code>[GuidedDecisionGraph](#GuidedDecisionGraph)</code>  
**Returns**: <code>Array.&lt;string&gt;</code> - a terminal symbol chain  
<a name="GuidedDecisionGraph+choose"></a>
### guidedDecisionGraph.choose(terminal)
adds the given terminal to the construction

**Kind**: instance method of <code>[GuidedDecisionGraph](#GuidedDecisionGraph)</code>  

| Param | Type | Description |
| --- | --- | --- |
| terminal | <code>string</code> | the name of a terminal vertex in the Decision Graph which is in the current set of possible choices. |

<a name="GuidedDecisionGraph+fullConstructs"></a>
### guidedDecisionGraph.fullConstructs() ⇒ <code>Array.&lt;string&gt;</code>
get a sorted array of possible construction strings from the current state,
possibly including nonterminals after the next terminal

**Kind**: instance method of <code>[GuidedDecisionGraph](#GuidedDecisionGraph)</code>  
**Returns**: <code>Array.&lt;string&gt;</code> - a list of possible constructions  
**Example**  
```js
// guide is an in-progress GuidedDecisionGraph
guide.construction()   => ['the', 'dog', 'ate']
guide.choices()        => ['', 'the']
guide.fullConstructs()
 => [ 'the dog ate',
      'the dog ate the Noun'
      'the dog ate the Noun RelativeClause' ]
```
<a name="GuidedDecisionGraph+pop"></a>
### guidedDecisionGraph.pop() ⇒ <code>string</code>
pop the last choice off the construction

**Kind**: instance method of <code>[GuidedDecisionGraph](#GuidedDecisionGraph)</code>  
**Returns**: <code>string</code> - the last element of the construction that was
submitted through [choose](#GuidedDecisionGraph+choose)  
**Throws**:

- throws an error if called when construction is empty

<a name="parseGrammar"></a>
## parseGrammar(grammar, [seperator]) ⇒ <code>[DecisionGraph](#DecisionGraph)</code>
parse a grammar given as an object and compile it into a decision graph

**Kind**: global function  
**Returns**: <code>[DecisionGraph](#DecisionGraph)</code> - the grammar converted into a decision graph  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| grammar | <code>object</code> |  | an object representing a grammar |
| [seperator] | <code>string</code> &#124; <code>RegExp</code> | <code>&quot;/\\s+/&quot;</code> | how tokens will be divided in rules |

<a name="reduceGrammar"></a>
## reduceGrammar(grammar, [seperator]) ⇒ <code>object</code>
reduces the rules of a grammar into a one to one form by assigning a name
to all non-terminals. The end result is that each option on a rule with
more than one choice will either be a single AND-rule or a single terminal.

**Kind**: global function  
**Returns**: <code>object</code> - the modified grammar object with newly created rules
as needed. New rules will be given the name of their parent rule
surrounded by underscores and followed by a number.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| grammar | <code>object</code> |  | an object representing a grammar |
| [seperator] | <code>string</code> &#124; <code>RegExp</code> | <code>&quot;/\\s+/&quot;</code> | how tokens will be divided in rules |

**Example**  
```js
var grammar = {
      NounPhrase: ['the Noun', 'the Noun RelativeClause'],
  RelativeClause: ['that VerbPhrase'],
            Noun: ['dog', 'cat', 'bird']
}

reduceGrammar(grammar)   =>
{
      NounPhrase: ['_NounPhrase_1', '_NounPhrase_2'],
   _NounPhrase_1: ['the Noun'],
   _NounPhrase_2: ['the Noun RelativeClause'],
  RelativeClause: ['that VerbPhrase'],
            Noun: ['dog', 'cat', 'bird']
}
```
