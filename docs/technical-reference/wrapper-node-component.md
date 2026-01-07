# Wrapper Node Component

The `WrapperNodeComponent` is the standardized shell for all nodes rendered on the Control Markets flow canvas. It acts as a bridge between the `ngx-vflow` canvas layer and specialized business logic components.

---

## 🎯 Core Purpose

The Wrapper Node solves three main architecture challenges:
1.  **Uniformity**: Ensures every node has the same visual frame, handles, and toolbars.
2.  **Decoupling**: Business components (like "Asset Upload") don't need to know about canvas handles or SVG rendering.
3.  **Cross-Device Compatibility**: Handles the complexity of `foreignObject` rendering for Safari and mobile devices.

---

## 🏗️ Architecture & Inheritance

The component extends `BaseFlowNode<WrapperNode>`, inheriting:
- **`node` Signal**: Access to the underlying canvas node data.
- **`config` Computed**: Access to UI metadata (color, icon, label).
- **`dialogService`**: Standardized way to open modals.
- **`flowSignalNodeStateService`**: Centralized state management.

---

## 🔄 Loading Mechanism

When a node is created on the canvas, the `WrapperNodeComponent`:
1.  Resolves the target logic component using `FlowNodeRegisterService` via `config.component`.
2.  Dynamically instantiates it using Angular's `ViewContainerRef`.
3.  **Automatic Data Injection**: It maps properties from `nodeData` to the component's `@Input()` properties.

```typescript
// From wrapper-node.component.ts
const inputs = nodeData['inputs'] || nodeData;
Object.keys(inputs).forEach(inputName => {
  if (inputName in this.componentRef.instance) {
    this.componentRef.instance[inputName] = inputs[inputName];
  }
});
```

---

## 🖱️ Communication & Modals

The wrapper centralizes interaction patterns through two main methods:

### 1. `openDetails()` (Configuration Popup)
- Triggered by: Double-click on the node.
- Action: Resolves the `detailsComponent` from the registry and opens it in a `DynamicDialog`.
- Sync: Returns the updated form data and triggers a global state update via `flowSignalNodeStateService.updateNodeData`.

### 2. Execution Actions
- **Toolbar Integration**: Hosts the `ActionsToolbarComponent` which emits execution events (Run Node, Run Endpoint).
- **Service Orchestration**: Forwards actions to `FlowOrchestrationService` (e.g., `runNode(flowId, nodeId)`).

---

## 💡 Key Benefits for Developers

- **Write Pure Components**: When creating a new node, you only need to build a regular Angular component with `@Input()` fields.
- **Auto-State Persistence**: Changes made in the double-click modal are automatically saved to the flow without writing custom service calls in the details view.
- **Standardized UI**: Every node automatically gets the same high-quality "glow," selection state, and action buttons.

---

## 🎨 UI & Status Indicators

The component implements a **Double Border** design to provide clear feedback:

1.  **Theme Border (Outer)**: The outermost ring (on `.node-container`) uses the node's theme `color` defined in the registry.
2.  **Status Border (Inner)**: The inner frame (on `.node-card`) changes color and animate based on the `currentStatus()`:
    - **Default/Pending**: White/Yellow glow.
    - **In Progress**: Blue pulsing glow.
    - **Completed**: Green static/glowing border.
    - **Failed**: Red pulsing glow.

This is powered by the `status-animation` mixin in `_mixins.scss`, which automatically syncs the `border-color` with the `box-shadow` animation.

---

### Related Documentation
- [Node-Details Communication Standard](./node-details-communication.md)
- [Node UI Architecture & Interaction](./node-architecture-ui.md)
- [Creating a New Node Type](../technical-guides/node-creating-new-node.md)
