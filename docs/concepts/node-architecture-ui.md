# Node UI Architecture & Interaction

Control Markets features a **Dual-Layer Interface** that separates high-level flow orchestration from detailed data configuration.

---

## Anatomy of a Node

A Node is an Angular component wrapped by the **App Flow Node Component**, which is compatible with the `ngx-vflow` library used to render nodes on the canvas.

While you can create custom nodes and UIs from scratch, it is highly recommended to use the **Wrapper Node** to ensure consistency across the system. This **guarantees** a unified UI experience and simplifies development.

## Node State Structure

A Node in NGX VFlow is a `ComponentDynamicNode`, which holds its position and data. In Control Markets, we extend this into `DynamicNodeWithData` (found in `BaseFlowNode`) ensuring a consistent structure across all specialized nodes:

1.  **`config`**: Centralized canvas-level metadata (Category, Component ID, Color, Icon, Label). This is the "Identity" of the node on the canvas.
2.  **`nodeData`**: The business-level data used by the specialized component (e.g., an Agent's prompt, an Asset's URL).

This separation ensures that canvas logic (like rendering borders or toolbars) stays decoupled from the business logic of each node.

Next is an example about the config properties of the node. 

```typescript
// INodeConfig structure
{
  component: NodeCompTypeStr.AudioNodeComponent,
  category: NodeCategory.INPUT,
  color: '#10b981', // green-500
  icon: 'pi pi-volume-up',
  label: 'Audio'
}
```

## UI Considerations & Compatibility

`ngx-vflow` is an experimental architecture that uses `foreignObject` to render nodes within the SVG canvas. However, `foreignObject` support in **Safari** (default on iPad and iPhone) can be limited. 

To ensure full compatibility across all devices, including mobile, we avoid relying on highly modern or non-standard CSS features that might break in Safari. Our UI remains simple yet effective by using a stable wrapper layer.

For more details, see the [VFlow Styling Guide](../reference/vflow-styling-guide.md).

All nodes are wrapped in a UI that features two distinct visual indicators:
1.  **Node Type (Identity)**: A colored border identifying the component type (e.g., Green for Inputs, Amber for Processes, Blue for Outputs). This is managed by the `FlowNodeRegisterService`.
2.  **Node Status (Execution)**: A secondary indicator (color or animation) showing the current state: `default` (white), `pending` (yellow), `in_progress` (blue), `completed` (green), or `failed` (red).

### Distinction: Node vs. Component vs. Category

It is important to understand these three concepts to avoid confusion:

- **Node Type**: The class/identifier that the Flow engine expects for rendering.
- **Node Component**: The actual Angular component. When using the wrapper, the component is decoupled from the node type.
- **Node Category**: The functional purpose of the node (Input, Process, Output).

By using the **Wrapper Node**, you automatically inherit the standard UI layer. If you choose not to use the wrapper (as seen in some legacy components awaiting refactoring), you must manually implement the UI layer and state indicators.

## 📦 The Wrapper Node Mechanism

The `WrapperNodeComponent` acts as a standardized shell that implements `BaseFlowNode`. It decouples the canvas-level integration (handles, toolbars, status-based styling) from the specific node content.

### How it Works
The wrapper uses Angular's `ViewContainerRef` to dynamically render the actual node component at runtime.

1.  **Dynamic Projection**: It contains a `<div #container></div>` where the dynamic component is injected.
2.  **Type Registry**: It uses `FlowNodeRegisterService` to resolve the `config.component` string identifier into a concrete Angular component class.
3.  **Visual Metadata**: The wrapper applies `config.color`, `config.icon`, and `config.label` dynamically to the card and its toolbars.
4.  **Automatic Input Binding**: Once the component is created, the wrapper automatically maps data from `nodeData` to the component's public properties.

```typescript
// From WrapperNodeComponent.ts
private loadComponent(): void {
  const nodeData = this.node()?.data?.nodeData;
  const componentStr = this.node()?.data?.config?.component;
  
  if (componentStr) {
    const ComponentType = this.flowNodeRegisterService.getNodeType(componentStr);
    if (ComponentType) {
      this.componentRef = this.container.createComponent(ComponentType);
      
      if (nodeData) {
        // Auto-bind keys from nodeData to component inputs
        Object.keys(nodeData).forEach(inputName => {
          if (inputName in this.componentRef.instance) {
             this.componentRef.instance[inputName] = nodeData[inputName];
          }
        });
      }
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
