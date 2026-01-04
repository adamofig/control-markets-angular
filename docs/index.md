# Control Markets Documentation

Welcome to the official documentation for **Control Markets**, a node-based platform designed for automating marketing and sales tasks using a **Cluster Architecture** of AI agents.

## 🚀 Overview

Control Markets provides a visual, canvas-based dashboard where you can orchestrate complex workflows by connecting different types of nodes. Unlike simple chatbots, these agents can embody specific personas, psychological profiles, and communication patterns.

### Cluster Architecture

The system operates on a cluster architecture where nodes are categorized into three primary types:

1.  **Inputs**: Data sources, files, or triggers that feed into the flow.
2.  **Process**: Nodes that transform or operate on data (e.g., AI agents, video generators).
3.  **Outputs**: The result of the flow (e.g., generated assets, distribution channels).

```mermaid
graph LR
    Input[Input Node] --> Process[Process Node]
    Process --> Output[Output Node]
    
    subgraph "Example Workflow"
        Assets[Assets Node] --> VideoGen[Video Gen Node]
        VideoGen --> Dist[Distribution Channel]
    end
```

---

## 🏗️ Core Documentation

Explore the technical and structural details of the system:

*   **[Project Architecture](file:///Users/adamo/Documents/GitHub/control-markets-angular/docs/architecture.md)**: High-level overview of the tech stack (Angular, Ionic, Firebase) and project structure.
*   **[Flow Serialization Plan](file:///Users/adamo/Documents/GitHub/control-markets-angular/docs/flow-serialization-plan.md)**: Details on how canvas graphs are saved and loaded from the database.
*   **[Job Completion Flow](file:///Users/adamo/Documents/GitHub/control-markets-angular/docs/flow-job-completion-plan.md)**: Technical plan for tracking execution state of flows.
*   **[Technical Details](file:///Users/adamo/Documents/GitHub/control-markets-angular/docs/technical_details.md)**: Deep dive into specific implementations.
*   **[Node UI Architecture](file:///Users/adamo/Documents/GitHub/control-markets-angular/docs/node-architecture-ui.md)**: Explanation of the dual-layer interface, the **Wrapper Node mechanism**, and the **Dynamic UI Registry**.
*   **[Flow Services Overview](file:///Users/adamo/Documents/GitHub/control-markets-angular/docs/flow-services-overview.md)**: Detailed guide to the services powering the flow canvas.

---

## 🎨 Node Registry & Visual Styling

To maintain visual clarity across complex flows, the system uses a centralized **Node Registry** ([FlowNodeRegisterService](file:///Users/adamo/Documents/GitHub/control-markets-angular/src/app/pages/flows/services/flow-node-register.service.ts)). This registry defines the look and feel of every node type:

*   **Custom Colors**: Each node type (Agent, Task, Asset, etc.) has a unique border color.
*   **Icons & Labels**: Standardized icons and user-friendly labels are mapped to technical component names.
*   **Canvas & Menu Synchronization**: The same colors and icons used on the canvas nodes are automatically applied to the "Add Node" menus (SpeedDial and Popovers).

This ensures that as the system grows, adding a new node type only requires a single configuration entry to update the entire UI.

---

## 🧩 Node Reference

The system supports various specialized nodes (defined in [flows.model.ts](file:///Users/adamo/Documents/GitHub/control-markets-angular/src/app/pages/flows/models/flows.model.ts)):

| Node Type | Category | Color | Description |
| :--- | :--- | :--- | :--- |
| `AgentNode` | Process | Green | Persona-based AI agent that executes tasks. |
| `TaskNode` | Process | Amber | Specific LLM-driven instruction or action. |
| `AssetsNode` | Input | Green | Container for static assets (Images, Documents). |
| `VideoGenNode` | Process | Amber | Automates video generation from connected assets. |
| `OutcomeNode` | Output | Blue | Final result or data capture point. |
| `LeadNode` | Output/Input | Pink | Management of marketing leads. |
| `DistributionChanel` | Output | Violet | Publishes content to social networks or platforms. |

---

## 🛠️ Developer Guides

*   **[Creating a New Node](file:///Users/adamo/Documents/GitHub/control-markets-angular/docs/creating-new-node.md)**: Step-by-step guide to extending the canvas with custom nodes.
*   **[Starting Ionic](file:///Users/adamo/Documents/GitHub/control-markets-angular/docs/starting-ionic.md)**: Quick start for Ionic and Angular standalone components.

---

## 🗺️ Roadmap & Planning

*   **[Auth Refactoring](file:///Users/adamo/Documents/GitHub/control-markets-angular/docs/auth-refactoring-plan.md)**: Ongoing plan for improving authentication mechanisms.
*   **[PWA Summary](file:///Users/adamo/Documents/GitHub/control-markets-angular/docs/PWA_SUMMARY.md)**: Strategies for Progressive Web App deployment.
