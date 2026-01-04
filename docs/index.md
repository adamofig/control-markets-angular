# Control Markets Documentation

Welcome to the official documentation for **Control Markets**, a node-based platform for marketing automation. This documentation is organized into four main categories:

---

## 💡 Concepts
*Understand the high-level architecture and design principles.*

- **[Project Architecture](concepts/architecture.md)**: High-level overview of the tech stack (Angular, Ionic, Firebase).
- **[Cluster Architecture](index.md#cluster-architecture)**: How we orchestrate AI agents using Input, Process, and Output nodes.
- **[Node UI Architecture](concepts/node-architecture-ui.md)**: Details on the Wrapper Node mechanism and the Dual-Layer interface.

---

## 🛠️ How-to Guides
*Practical, step-by-step instructions for common tasks.*

- **[Creating a New Node](how-to/creating-new-node.md)**: The standard process for extending the canvas.
- **[Starting with Ionic](how-to/starting-ionic.md)**: Setup and initial steps for mobile development.

---

## 📚 Reference
*Technical facts, specifications, and API-level details.*

- **[Node Registry Standard](reference/node-details-communication.md)**: The communication pattern between nodes and detail views.
- **[Flow Services Overview](reference/flow-services-overview.md)**: Documentation of the services powering the canvas.
- **[Visual Styling Guide](reference/vflow-styling-guide.md)**: How to style nodes using `ngx-vflow`.
- **[Technical Details](reference/technical-details.md)**: Deep dive into specific implementations.
- **[PWA Summary](reference/pwa-summary.md)**: Deployment and PWA configuration details.

### Node Reference Table
> [!NOTE]
> All nodes follow a dual-layer structure where visual configuration (color, icon, category) is centralized in a `config` object, separate from the `nodeData` business business properties.

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

## 🗺️ Plans & Roadmap
*Design documents and future implementation strategies.*

- **[Flow Serialization](plans/flow-serialization-plan.md)**: Saving and loading graph states.
- **[Job Completion Tracking](plans/flow-job-completion-plan.md)**: Mechanism for detecting finished tasks.
- **[Auth Refactoring](plans/auth-refactoring-plan.md)**: Evolution of our authentication system.

---

## 🎨 Assets
- **[Architecture Diagrams](assets/)**: Visual representations of the system (Excalidraw).

---

## 📝 Contribution Guide
*How to add more documentation:*
1.  **Identify the type**: Is it a Concept, Guide (How-to), Reference fact, or a Future Plan?
2.  **Add the file**: Place it in the appropriate subfolder (`docs/concepts/`, etc.).
3.  **Update Index**: Add a link to the file in this `index.md` under the correct heading.
4.  **Use Relative Links**: Always link using relative paths for portability.
