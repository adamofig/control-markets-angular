# Creating a New Node Type

This guide explains how to add a completely new node type to the Control Markets flow canvas. Follow these steps to ensure architectural consistency and proper state management.

---

## 🚀 The Fastest Way: Use the `EmptyNode` Template
If you want to create a new node quickly, the best way is to copy the existing `EmptyNode` template. This node is already configured with:
- `BaseFlowNode` integration
- Toolbar support
- Double-click to open Dynamic Dialog
- Default styling

### 1. Copy the Template Folder
Copy the folder `src/app/pages/flows/nodes/empty-node` and rename it to your new node name (e.g., `my-custom-node`).

### 2. Rename Files and Classes
Go through the files in your new folder and rename:
- `EmptyNodeComponent` -> `MyCustomNodeComponent`
- `EmptyDetailsComponent` -> `MyCustomDetailsComponent`
- File names (e.g., `empty-node.ts` -> `my-custom-node.ts`)

### 3. Proceed to Step 1 & 2
Even when using the template, you still need to define your data model and register the identity as described below.

---

## 🏗️ Step 1: Data Modeling
Every node usually has specific data. Define an interface for it.

**File**: [nodes.model.ts](file:///Users/adamo/Documents/GitHub/control-markets-angular/src/app/pages/flows/models/nodes.model.ts)

```typescript
export interface IMyCustomNodeData {
  id: string;
  name: string;
  myField: string;
}
```

---

## 🛠️ Step 2: Register Identity
Register the string identifier in the global model.

**File**: [flows.model.ts](file:///Users/adamo/Documents/GitHub/control-markets-angular/src/app/pages/flows/models/flows.model.ts)

```typescript
export enum NodeTypeStr {
  // ... existing nodes
  MyCustomNodeComponent = 'MyCustomNodeComponent',
}
```

---

## 🎨 Step 3: Create the Node Component

There are two ways to implement a node's UI on the canvas:

### Option A: The Wrapper-Based Approach (Recommended)
This is the preferred method. You create a regular Angular component that focuses ONLY on your node's logic and display. The system wraps it in a `WrapperNodeComponent` which provides the canvas integration (handles, toolbars, status borders).

1.  **Create your content component**:
    ```typescript
    @Component({
      selector: 'app-my-custom-content',
      template: `<div>{{ myDataField }}</div>`,
      standalone: true
    })
    export class MyCustomContentComponent {
      @Input() myDataField: string = '';
    }
    ```
2.  **Register it**: Add it to the `FlowNodeRegisterService`.
3.  **Automatic Binding**: The `WrapperNodeComponent` will automatically instantiate your component and bind `nodeData` fields to your `@Input()`s.

> [!TIP]
> Use this approach to ensure your node is immediately compatible with all devices (including Safari) and maintains the system's "Dual-Layer" look and feel.

### Option B: The Manual Approach (Custom UI)
Use this only if you need a non-standard UI or custom handle placements. Your component **must** extend `BaseFlowNode`.

**File**: `src/app/pages/flows/nodes/my-custom-node/my-custom-node.ts`

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { BaseFlowNode } from '../base-flow-node';
import { IMyCustomNodeData } from '../../models/nodes.model';
import { ComponentDynamicNode } from 'ngx-vflow';

export interface CustomMyNode extends ComponentDynamicNode {
  nodeData: IMyCustomNodeData;
}

@Component({
  selector: 'app-my-custom-node',
  templateUrl: './my-custom-node.html',
  styleUrl: './my-custom-node.scss',
  standalone: true,
  imports: [CommonModule, Vflow, BaseNodeToolbarComponent, ActionsToolbarComponent]
})
export class MyCustomNodeComponent extends BaseFlowNode<CustomMyNode> implements OnInit {
    override ngOnInit(): void {
        super.ngOnInit();
        this.nodeCategory = 'process'; // Choose: 'input', 'process', or 'output'
    }
}
```

---

## 🔍 Step 4: Details Modal Pattern
Most nodes need a configuration dialog for the **Popup Layer**.

1.  Create `MyCustomDetailsComponent`.
2.  Use `DialogService` in the node component to open it.

```typescript
openModal(): void {
  this.dialogService.open(MyCustomDetailsComponent, {
    header: 'Configure Node',
    data: this.node(), // Pass the whole node
    width: '500px'
  });
}
```

---

## ⚡ Step 5: Service Registration
1.  **Registry**: Add to [flow-node-register.service.ts](file:///Users/adamo/Documents/GitHub/control-markets-angular/src/app/pages/flows/services/flow-node-register.service.ts).
    - If using the **Wrapper approach**, register your content component here.
2.  **Creation**: Add `addMyCustomNode()` to [flow-signal-node-state.service.ts](file:///Users/adamo/Documents/GitHub/control-markets-angular/src/app/pages/flows/services/flow-signal-node-state.service.ts).
    - If using the **Wrapper approach**, ensure the `component` property of the new node matches your registered string.
3.  **UI**: Add to the toolbar in [flow-canva.ts](file:///Users/adamo/Documents/GitHub/control-markets-angular/src/app/pages/flows/flow-workspace/flow-canva.ts).

---

## ✅ Summary Checklist
- [x] Defined Data Interface in `nodes.model.ts`.
- [x] Added to `NodeTypeStr` enum.
- [x] Created Component (Content or Full Node).
- [x] Implemented Details Modal for configuration.
- [x] Registered in `FlowNodeRegisterService`.
- [x] Added creation logic in `FlowSignalNodeStateService`.
- [x] Added to Canvas Toolbar menu items.
