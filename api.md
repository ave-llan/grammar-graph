<a name="DecisionGraph"></a>
## DecisionGraph
**Kind**: global class  

* [DecisionGraph](#DecisionGraph)
  * [new DecisionGraph()](#new_DecisionGraph_new)
  * [.addVertexAND(name)](#DecisionGraph+addVertexAND)
  * [.addVertexOR(name)](#DecisionGraph+addVertexOR)
  * [.addEdge(v, w)](#DecisionGraph+addEdge)
  * [.adj(v)](#DecisionGraph+adj) ⇒ <code>Array.&lt;string&gt;</code>
  * [.V()](#DecisionGraph+V) ⇒ <code>number</code>
  * [.isTerminal(v)](#DecisionGraph+isTerminal) ⇒ <code>boolean</code>
  * [.isTypeAND(v)](#DecisionGraph+isTypeAND) ⇒ <code>boolean</code>
  * [.getVertex(v)](#DecisionGraph+getVertex) ⇒ <code>Object</code>

<a name="new_DecisionGraph_new"></a>
### new DecisionGraph()
creates a new DecisionGraph

<a name="DecisionGraph+addVertexAND"></a>
### decisionGraph.addVertexAND(name)
add AND vertex to the graph. When moving through the decision graph, an AND vertex
will require a visit down each of its outgoing edges, in order. .

**Kind**: instance method of <code>[DecisionGraph](#DecisionGraph)</code>  
**See**: [addVertexOR](#DecisionGraph+addVertexOR)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the name of this vertex |

<a name="DecisionGraph+addVertexOR"></a>
### decisionGraph.addVertexOR(name)
add OR vertex to the graph. When moving through the decision graph, an OR vertex
will pick just one of its outgoing vertices.

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
is this a termianl vertex (does it have no outgoing edges?)

**Kind**: instance method of <code>[DecisionGraph](#DecisionGraph)</code>  
**Returns**: <code>boolean</code> - is this a terminal vertex  

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

<a name="DecisionGraph+getVertex"></a>
### decisionGraph.getVertex(v) ⇒ <code>Object</code>
get an object with properties describing the vertex

**Kind**: instance method of <code>[DecisionGraph](#DecisionGraph)</code>  
**Returns**: <code>Object</code> - an object with properties [isTerminal](#DecisionGraph+isTerminal),
[isTypeAND](#DecisionGraph+isTypeAND), and [adj](#DecisionGraph+adj)  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>string</code> | the name of a vertex |

