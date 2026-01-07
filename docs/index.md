# Control Markets Knowledge Base

Welcome to the documentation for **Control Markets**. This index is organized to help you navigate between technical details and business concepts.

---

## 💡 Concepts
*Business-related knowledge and high-level platform goals.*

- **Understanding the Platform**: [English](concepts/understanding-the-platform.md) | [Español](concepts/understanding-the-platform_es.md) 
- **[Control Market Success](concepts/control-market-success.md)**: Strategies for dominating a market using personas.

---

## 🎓 Tutorials
*Step-by-step instructions for final users.*

- **My First Task**: [English](tutorials/create-a-task.md) | [Español](tutorials/create-a-task_es.md)
- **Adding Sources**: [English](tutorials/add-sources.md) | [Español](tutorials/add-sources_es.md)
- **Inspiration Sources**: [English](tutorials/how-to-get-inspiration-with-sources.md) | [Español](tutorials/how-to-get-inspiration-with-sources_es.md)
- **Specialized Agent**: [English](tutorials/first-persona-agent.md) | [Español](tutorials/first-persona-agent_es.md)

---

## 💻 Technical Guides
*Knowledge for developers on how to extend or setup the platform.*

- **[Creating a New Node](technical-guides/node-creating-new-node.md)**: Standard process for extending the canvas.
- **[Starting with Ionic](technical-guides/starting-ionic.md)**: Setup and initial steps for mobile development.

---

## ⚙️ Technical Reference
*Architecture, patterns, and deep-dive technical specifications.*

### 🏗️ Architecture & Core
- **[Project Architecture](technical-reference/architecture.md)**: High-level tech stack and system overview.
- **[Node UI Architecture](technical-reference/node-architecture-ui.md)**: The Dual-Layer interface mechanism.
- **[Flow Services Overview](technical-reference/flow-services-overview.md)**: The engine powering the canvas.
- **[Frontend Event Sync](technical-reference/frontend-event-sync.md)**: Real-time Firebase synchronization.
- **[Node Registry Standard](technical-reference/node-details-communication.md)**: Communication patterns between layers.

### 🧩 Components
- **[Wrapper Node](technical-reference/wrapper-node-component.md)**: The shell for all canvas nodes.

### 🛠️ Development & Details
- **[Project Structure](technical-reference/project-structure.md)**: Navigation of the codebase.
- **[Documentation System](technical-reference/docs-system.md)**: How this documentation is built and served.
- **[Technical Deep Dive](technical-reference/technical-details.md)**: Implementation details of complex components.
- **[PWA & Deployment](technical-reference/pwa-summary.md)**: Configuration for web and mobile deployment.
- **[Visual Styling Guide](technical-reference/vflow-styling-guide.md)**: Customizing node appearance.
- **[Video Project Understanding](technical-reference/video-project-undertanding.md)**: Insights into the video generation logic.

---

## 🗺️ Plans & Roadmap
*Future implementation strategies and design documents.*

- **[Flow Serialization](plans/flow-serialization-plan.md)**: Saving and loading graph states.
- **[Job Completion Tracking](plans/flow-job-completion-plan.md)**: Detecting finished tasks.
- **[Auth Refactoring](plans/auth-refactoring-plan.md)**: Evolution of our authentication system.

---

## 📊 Node Reference Table

| Node Type | Category | Color | Description |
| :--- | :--- | :--- | :--- |
| `AgentNode` | Process | Green | Persona-based AI agent that executes tasks. |
| `TaskNode` | Process | Amber | Specific LLM-driven instruction or action. |
| `AssetsNode` | Input | Green | Container for static assets (Images, Documents). |
| `VideoGenNode` | Process | Amber | Automates video generation from connected assets. |
| `OutcomeNode` | Output | Blue | Final result or data capture point. |
| `LeadNode` | Output/Input | Pink | Management of marketing leads. |
| `DistributionChanel` | Output | Violet | Publishes content to social networks or platforms. |

> [!TIP]
> **Interactivity Tip**: Single-click any node to reveal the **Action Toolbar**. You can now **Duplicate** nodes for faster workflow creation or open the **Execution Details** icon to debug failed jobs via the new modal.

---

## 📝 Contribution Guide
*How to add more documentation:*
1.  **Select the Folder**: 
    - `concepts/`: For business theory and user overviews.
    - `tutorials/`: For user-facing step-by-step instructions.
    - `technical-guides/`: For developer instructions.
    - `technical-reference/`: For technical specs and architecture.
    - `plans/`: For design docs and future work.
2.  **Use Relative Links**: Always link using relative paths for portability.
3.  **Update Index**: Add your new file to this `index.md` under the correct section.
