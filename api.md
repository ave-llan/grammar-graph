## Classes
<dl>
<dt><a href="#GrammarGraph">GrammarGraph</a></dt>
<dd></dd>
<dt><a href="#GuidedDecisionGraph">GuidedDecisionGraph</a></dt>
<dd></dd>
<dt><a href="#TreeNode">TreeNode</a></dt>
<dd></dd>
</dl>
<a name="GrammarGraph"></a>
## GrammarGraph
**Kind**: global class  

* [GrammarGraph](#GrammarGraph)
  * [new GrammarGraph(grammar, [seperator], [epsilonSymbol])](#new_GrammarGraph_new)
  * [.vertices()](#GrammarGraph+vertices) ⇒ <code>Array.&lt;string&gt;</code>
  * [.adj(v)](#GrammarGraph+adj) ⇒ <code>Array.&lt;string&gt;</code>
  * [.isTypeAND(v)](#GrammarGraph+isTypeAND) ⇒ <code>boolean</code>
  * [.createGuide(start)](#GrammarGraph+createGuide) ⇒ <code>[GuidedDecisionGraph](#GuidedDecisionGraph)</code>

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
**See**: [DecisionGraph#vertices](DecisionGraph#vertices)  
<a name="GrammarGraph+adj"></a>
### grammarGraph.adj(v) ⇒ <code>Array.&lt;string&gt;</code>
get an array of all the vertices this vertex points to

**Kind**: instance method of <code>[GrammarGraph](#GrammarGraph)</code>  
**Returns**: <code>Array.&lt;string&gt;</code> - an ordered list of all the vertices that v points to  
**See**: [DecisionGraph#adj](DecisionGraph#adj)  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>string</code> | the name of a vertex |

<a name="GrammarGraph+isTypeAND"></a>
### grammarGraph.isTypeAND(v) ⇒ <code>boolean</code>
is this a type AND vertex (and not a type OR)?

**Kind**: instance method of <code>[GrammarGraph](#GrammarGraph)</code>  
**Returns**: <code>boolean</code> - is this a type AND vertex (and not a type OR)?  
**See**: [DecisionGraph#isTypeAND](DecisionGraph#isTypeAND)  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>string</code> | the name of a vertex |

<a name="GrammarGraph+createGuide"></a>
### grammarGraph.createGuide(start) ⇒ <code>[GuidedDecisionGraph](#GuidedDecisionGraph)</code>
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
  * [.choose(terminal)](#GuidedDecisionGraph+choose)
  * [.constructs()](#GuidedDecisionGraph+constructs) ⇒ <code>Array.&lt;string&gt;</code>
  * [.pop()](#GuidedDecisionGraph+pop) ⇒ <code>string</code>
  * [.choices([nDeep])](#GuidedDecisionGraph+choices) ⇒ <code>Array.&lt;string&gt;</code> &#124; <code>[Array.&lt;TreeNode&gt;](#TreeNode)</code>

<a name="new_GuidedDecisionGraph_new"></a>
### new GuidedDecisionGraph(dg, start)
step-by-step construction of a language from a decision graph


| Param | Type | Description |
| --- | --- | --- |
| dg | <code>DecisionGraph</code> | a Decision Graph that defines a grammar |
| start | <code>string</code> | the name of a vertex in the decision graph from which to start the guided expansion |

<a name="GuidedDecisionGraph+construction"></a>
### guidedDecisionGraph.construction() ⇒ <code>Array.&lt;string&gt;</code>
the current construction

**Kind**: instance method of <code>[GuidedDecisionGraph](#GuidedDecisionGraph)</code>  
**Returns**: <code>Array.&lt;string&gt;</code> - a terminal symbol chain  
<a name="GuidedDecisionGraph+isComplete"></a>
### guidedDecisionGraph.isComplete() ⇒ <code>boolean</code>
is the current construction a valid, complete construction from the starting
nonterminal? ie, could the construction be haulted at this point?

**Kind**: instance method of <code>[GuidedDecisionGraph](#GuidedDecisionGraph)</code>  
**Returns**: <code>boolean</code> - is the construction complete  
<a name="GuidedDecisionGraph+choose"></a>
### guidedDecisionGraph.choose(terminal)
adds the given terminal to the construction

**Kind**: instance method of <code>[GuidedDecisionGraph](#GuidedDecisionGraph)</code>  

| Param | Type | Description |
| --- | --- | --- |
| terminal | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> | the name of a terminal vertex in the Decision Graph which is in the current set of possible choices. Or a valid sequence of terminal symbols as an array. |

<a name="GuidedDecisionGraph+constructs"></a>
### guidedDecisionGraph.constructs() ⇒ <code>Array.&lt;string&gt;</code>
get a sorted array of possible construction strings from the current state,
possibly including nonterminals after the next terminal

**Kind**: instance method of <code>[GuidedDecisionGraph](#GuidedDecisionGraph)</code>  
**Returns**: <code>Array.&lt;string&gt;</code> - a list of possible constructions  
**Example**  
```js
// guide is an in-progress GuidedDecisionGraph
guide.construction()   => ['the', 'dog', 'ate']
guide.choices()        => ['', 'the']
guide.constructs()
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

<a name="GuidedDecisionGraph+choices"></a>
### guidedDecisionGraph.choices([nDeep]) ⇒ <code>Array.&lt;string&gt;</code> &#124; <code>[Array.&lt;TreeNode&gt;](#TreeNode)</code>
returns all possible next terminals, or an array of possible
terminal chains

**Kind**: instance method of <code>[GuidedDecisionGraph](#GuidedDecisionGraph)</code>  
**Returns**: <code>Array.&lt;string&gt;</code> &#124; <code>[Array.&lt;TreeNode&gt;](#TreeNode)</code> - if nDeep=1, an array of terminal symbols (strings),
else an array of [TreeNodes](#TreeNode)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [nDeep] | <code>number</code> | <code>1</code> | will search for nDeep possible choices |

**Example**  
```js
// guide is an in-progress GuidedDecisionGraph
guide.construction()   => ['the', 'dog', 'ate']
guide.choices()        => ['', 'the']
guide.choices(3)       =>
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
<a name="TreeNode"></a>
## TreeNode
**Kind**: global class  
**See**: TreeNodes are returned from [GuidedDecisionGraph.choices](#GuidedDecisionGraph+choices)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| val | <code>string</code> | a terminal string |
| next | <code>[Array.&lt;TreeNode&gt;](#TreeNode)</code> | a list of TreeNodes this node links to |

<a name="new_TreeNode_new"></a>
### new TreeNode(val)
Tree nodes to return decision trees


| Param | Type | Description |
| --- | --- | --- |
| val | <code>string</code> | a terminal string |

