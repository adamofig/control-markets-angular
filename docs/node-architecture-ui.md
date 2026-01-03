# Node UI Architecture & Interaction

Control Markets features a **Dual-Layer Interface** that separates high-level flow orchestration from detailed data configuration.

---

## Understanding the anatomy of a node. 

A Node is an Angular component that is wrapped by  App Flow Node Component that is Compatible with  `ngx-vflow` library to render the node in the canvas.

You can create your own custom node and UI, however to be consistent with the system is better to use the wrapper and instructions. 
This garanteed you have the same UI experience as the rest of the system.

## Understanding UI. 

ngx-flow is a project experimenting new architecture, using foreignObject to render the node in the canvas. but compatible with Safari is very poor, 
Safari is used by default in Ipad and Iphone, and for me is important compatibility with all devices. that means i can't use modern css features. and this
UI is simple but effective. check the guide. Styling Custom Nodes in ngx-vflow 

All componets are wrapped in UI that have 2 borders. with colors. 
1) shows the node type or component type, should be unique color for node component.
2) shows the node status, this are usually 4, iddle, pending, error, success.

### Distintion between node and component and Category. 

Its very important understand this concept, becouse can lead to confussion. 

Node Type: This is the Class that Flow expects in order to render.  
Node Component: This is the Angular Component, may be the same as node type, but will not is you are using the wrapper.
Node Category: This is the category of the node purpuse only input, process, output. 

Example, if you want to follow rules, then use the wrapper as your node type, that add the UI layer to your angular. 
if not, that is the case of some components until i reafactor, you are in charge of the UI layer.

## 📦 The Wrapper Node Mechanism

The `WrapperNodeComponent` acts as a standardized shell that implements `BaseFlowNode`. It decouples the canvas-level integration (handles, toolbars, status-based styling) from the specific node content.

### How it Works
The wrapper uses Angular's `ViewContainerRef` to dynamically render the actual node component at runtime.

1.  **Dynamic Projection**: It contains a `<div #container></div>` where the dynamic component is injected.
2.  **Type Registry**: It uses `FlowNodeRegisterService` to resolve a string identifier (e.g., `'AgentNodeComponent'`) into a concrete Angular component class.
3.  **Automatic Input Binding**: Once the component is created, the wrapper automatically maps data from the node's state (`nodeData`) to the component's public properties.

```typescript
// From WrapperNodeComponent.ts
private loadComponent(): void {
  const nodeData = this.node()?.data?.nodeData;
  const component = (this.node() as any)?.component;
  
  if (nodeData && component) {
    const ComponentType = this.flowNodeRegisterService.getNodeType(component);
    if (ComponentType) {
      this.componentRef = this.container.createComponent(ComponentType);
      
      // Auto-bind keys from nodeData to component inputs
      Object.keys(nodeData).forEach(inputName => {
        this.componentRef.instance[inputName] = nodeData[inputName];
      });
    }
  }
}
```

### Benefits
- **Consistency**: All nodes inherit the same standard UI (borders, status indicators) and interaction patterns (double-click, toolbars).
- **Efficiency**: Developers only need to worry about the "Content" component, while the `WrapperNodeComponent` handles the "Canvas" complexities.
- **Safari Compatibility**: By housing the complexity in a stable wrapper, we ensure the simplified UI remains compatible with Safari (iPad/iPhone) as discussed above.


## 🏗️ The Two UI Layers

The system manages two distinct visual layers, each with its own drag-and-drop context:

### 1. The Canvas Layer (Orchestration)
- **Framework**: `ngx-vflow`
- **Purpose**: Visualization of the agent cluster, connecting nodes, and managing the overall workflow logic.
- **Interaction**: This layer handles panning, zooming, and node positioning. Nodes here are "lite" cards that show status and high-level identity.

### 2. The Popup Layer (Configuration)
- **Framework**: PrimeNG `DynamicDialog`
- **Purpose**: Deep configuration and inspection of node-specific data (e.g., viewing an asset, editing agent prompt, checking job logs).
- **Interaction**: These windows float **above** the canvas. They are independent and draggable within the entire viewport, allowing you to move them aside while still looking at the canvas structure.

---

## 🖱️ Interaction Pattern: Double-Click to Detail

The primary way to transition between these layers is the **Double-Click** pattern.

### Example: Assets Node
When you work with an `AssetsNode`, the interaction flows as follows:

1.  **Single Click**: Selects the node on the canvas for orchestration tasks (like deleting or connecting).
    - *File*: [assets-node.component.html](file:///Users/adamo/Documents/GitHub/control-markets-angular/src/app/pages/flows/nodes/assets-node/assets-node.component.html)
    - *Code*: `(click)="selectNode()"`
2.  **Double Click**: Opens the detailed configuration view as a popup.
    - *File*: [assets-node.component.html](file:///Users/adamo/Documents/GitHub/control-markets-angular/src/app/pages/flows/nodes/assets-node/assets-node.component.html)
    - *Code*: `(dblclick)="openModal()"`

### The Details View
Once opened, the `AssetDetailsComponent` is rendered in a PrimeNG dialog with `draggable: true` and a high `baseZIndex`.

```typescript
// From AssetsNodeComponent.ts
this.dialogService.open(AssetDetailsComponent, {
  header: 'Asset Details',
  draggable: true, // Enables the 2nd drag-and-drop layer
  baseZIndex: 10000, // Floats above the canvas
  data: { ...nodeData },
});
```

- **Canvas Fragment**: [assets-node.component.html](file:///Users/adamo/Documents/GitHub/control-markets-angular/src/app/pages/flows/nodes/assets-node/assets-node.component.html)
- **Detail View**: [asset-details.html](file:///Users/adamo/Documents/GitHub/control-markets-angular/src/app/pages/flows/nodes/assets-node/asset-details/asset-details.html)

---

## 💡 Why This Architecture?

1.  **Context Preservation**: You can zoom out of the canvas to see the whole flow while keeping a specific agent's prompt editor open right next to it.
2.  **Focus Separation**: The canvas remains clean and performant, only rendering detailed UI components on demand.
3.  **Extended Workspace**: Provides a "multi-window" feel within the browser, mirroring professional creative suites.
