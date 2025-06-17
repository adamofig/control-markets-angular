# Plan for Graph Serialization & Deserialization in FlowsComponent

**Objective:** Create two functions, `saveFlow` and `loadFlow`, within `src/app/pages/flows/flows.component.ts`.

- `saveFlow`: Will convert the current graph state (nodes and edges), including Angular `signal` values and component types, into a plain JavaScript object suitable for storage in MongoDB.
- `loadFlow`: Will take a plain JavaScript object (as retrieved from MongoDB) and reconstruct the graph state, re-initializing signals and component types.

**1. Define Node Type Mapping and Helper Functions:**

These will manage the conversion between component constructors and string identifiers. They can be defined within `flows.component.ts` or a separate utility file.

- **Node Component Imports (ensure these are correct and present in `flows.component.ts`):**

  ```typescript
  import { AgentNodeComponent } from './agent-node/agent-node.component';
  import { DistributionChanelNodeComponent } from './distribution-chanel-node/distribution-chanel-node.component';
  import { OutcomeNodeComponent } from './outcome-node/outcome-node.component';
  import { TaskNodeComponent } from './task-node/task-node.component';
  import { CircularNodeComponent } from './circular-node.component'; // Added
  ```

- **`NODE_TYPE_MAP` Constant:**

  ```typescript
  const NODE_TYPE_MAP = {
    AgentNodeComponent: AgentNodeComponent,
    DistributionChanelNodeComponent: DistributionChanelNodeComponent,
    OutcomeNodeComponent: OutcomeNodeComponent,
    TaskNodeComponent: TaskNodeComponent,
    CircularNodeComponent: CircularNodeComponent, // Added
    default: 'default', // Special case for the string type
  };
  ```

- **`getNodeTypeString(type: any): string` Function:**

  ```typescript
  function getNodeTypeString(type: any): string {
    if (typeof type === 'string') {
      // Handles 'default'
      return type;
    }
    for (const key in NODE_TYPE_MAP) {
      if (NODE_TYPE_MAP[key as keyof typeof NODE_TYPE_MAP] === type) {
        return key;
      }
    }
    console.error('Unknown node type during serialization:', type);
    throw new Error(`Unknown node type: ${type?.name || type}`);
  }
  ```

- **`getNodeComponentFromString(typeString: string): any` Function:**
  ```typescript
  function getNodeComponentFromString(typeString: string): any {
    if (typeString === 'default') {
      return 'default';
    }
    const component = NODE_TYPE_MAP[typeString as keyof typeof NODE_TYPE_MAP];
    if (!component) {
      console.error('Unknown node type string during deserialization:', typeString);
      throw new Error(`Unknown node type string: ${typeString}`);
    }
    return component;
  }
  ```

**2. Implement `saveFlow()` Method:**

This method will be added to the `FlowsComponent` class.

```typescript
public saveFlow(): { nodes: any[], edges: any[] } {
  const serializableNodes = this.nodes.map(node => {
    const plainPoint = node.point(); // Unwrap signal for point

    // Handle 'text' property: it's a signal directly on 'default' nodes,
    // and a plain string within 'data' for other custom component nodes.
    let serializableText;
    if (node.type === 'default' && node.text && typeof node.text === 'function') {
      serializableText = node.text(); // Unwrap signal for text on default node
    }

    const serializableNode: any = {
      id: node.id,
      point: plainPoint,
      type: getNodeTypeString(node.type),
      data: { ...node.data }, // Data is already plain as per confirmation
    };

    if (serializableText !== undefined) {
      serializableNode.text = serializableText;
    }

    return serializableNode;
  });

  // Edges are already plain objects as per confirmation
  const serializableEdges = this.edges.map(edge => ({ ...edge }));

  console.log('Saving flow:', { nodes: serializableNodes, edges: serializableEdges });
  return {
    nodes: serializableNodes,
    edges: serializableEdges
  };
}
```

**3. Implement `loadFlow()` Method:**

This method will also be added to the `FlowsComponent` class.

```typescript
public loadFlow(savedFlowData: { nodes: any[], edges: any[] }): void {
  if (!savedFlowData || !savedFlowData.nodes || !savedFlowData.edges) {
    console.error('Invalid data provided to loadFlow:', savedFlowData);
    return;
  }

  this.nodes = savedFlowData.nodes.map((plainNode: any) => {
    const nodeType = getNodeComponentFromString(plainNode.type);

    const dynamicNode: DynamicNode = { // Assuming DynamicNode is the correct type from ngx-vflow
      id: plainNode.id,
      point: signal(plainNode.point), // Re-wrap point in signal
      type: nodeType,
      data: { ...plainNode.data } // Data is plain
    };

    // Re-wrap text in signal if it was a default node
    if (nodeType === 'default' && plainNode.text !== undefined) {
      dynamicNode.text = signal(plainNode.text);
    }

    return dynamicNode;
  });

  this.edges = savedFlowData.edges.map((edge: any) => ({ ...edge })); // Edges are plain

  // Optional: Force VFlow to re-render if needed, though Angular's change detection
  // with signals should handle updates to `this.nodes` and `this.edges`.
  console.log('Flow loaded:', this.nodes, this.edges);
}
```

**Mermaid Diagram of the Process:**

```mermaid
graph TD
    subgraph FlowsComponent
        direction LR
        A[Original Graph State <br> this.nodes (with signals, component types) <br> this.edges]
    end

    subgraph Serialization Process
        direction LR
        B[saveFlow() method]
        C["For each node: <br> - node.point() -> plain coords <br> - node.text() -> plain text (if default type) <br> - getNodeTypeString(node.type) -> string ID"]
        D[Plain JS Nodes Array]
        E[Plain JS Edges Array (direct copy)]
    end

    subgraph Storage
        direction TB
        F[MongoDB Compatible Object <br> { nodes: [...], edges: [...] }]
        G[Store in MongoDB]
    end

    subgraph Retrieval
        direction TB
        H[Retrieve from MongoDB]
        I[Plain JS Object <br> { nodes: [...], edges: [...] }]
    end

    subgraph Deserialization Process
        direction LR
        J[loadFlow(data) method]
        K["For each plainNode: <br> - signal(plainNode.point) <br> - signal(plainNode.text) (if default type) <br> - getNodeComponentFromString(plainNode.type) -> Component Type"]
        L[Rehydrated this.nodes (with signals, component types)]
        M[Rehydrated this.edges (direct copy)]
    end

    A --> B;
    B --> C;
    C --> D;
    B --> E;
    D --> F;
    E --> F;

    G --> H;
    H --> I;
    I --> J;
    J --> K;
    K --> L;
    J --> M;
    L --> A;
    M --> A;
```
