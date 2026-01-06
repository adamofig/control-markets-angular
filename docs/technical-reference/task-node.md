# Task Node Reference

The **Task Node** is a core `PROCESS` component in Control Markets. It represents an atomic unit of AI execution, where a defined instruction (Prompt) is processed by an AI Model (Agent) using various inputs (Sources, Nodes).

## Technical Overview

-   **Node Type**: `TaskNode`
-   **Category**: `PROCESS`
-   **Color**: Amber (`#f59e0b`)
-   **Data Model**: [`ILlmTask`](file:///Users/adamo/Documents/GitHub/control-markets-angular/src/app/pages/tasks/models/tasks-models.ts)

## Component Dual-Layer

### 1. Canvas Layer ([TaskNodeComponent](file:///Users/adamo/Documents/GitHub/control-markets-angular/src/app/pages/flows/nodes/task-node/task-node.ts))
The visual representation on the orchestration canvas.
-   **Handles**: 
    -   `left`/`top`: Input connections from Agents, Sources, or other Tasks.
    -   `right`: Output connection to other Process nodes or Output nodes.
-   **Status Indicator**: Reflects the `taskExecutionState` (Pending, In Progress, Completed, Failed).
-   **Actions Toolbar**:
    -   **Run**: Manually trigger the node execution.
    -   **Endpoint**: Access the direct API endpoint for this task.
    -   **Webhook**: Get a URL to trigger this task from external services (e.g., Make.com, Zapier).
-   **Conversation Mode**: Allows real-time interaction with the task state via `TaskConversationComponent`.

### 2. Configuration Layer ([TaskNodeDetailsComponent](file:///Users/adamo/Documents/GitHub/control-markets-angular/src/app/pages/flows/nodes/task-node/task-details/task-node-details.ts))
A floating dialog for deep inspection and editing.
-   **Details View**: Uses `TaskDetailsComponent` to show a preview of the task definition and its execution results in Markdown.
-   **Form View**: Uses `TaskFormComponent` for full configuration (Prompt editing, Model selection, Source attachment).

## State and Data Flow

A Task Node's behavior is defined by its `nodeData`:

-   **Identity**: Name, description, and a visual icon/image.
-   **Core Logic**: The `prompt` (instructions for the LLM).
-   **Execution Context**: 
    -   **Agents**: Associated persona cards that define the "voice" and "style" of the execution.
    -   **Sources**: Static or dynamic data used as reference for the prompt.
    -   **Model**: Configuration of the LLM provider and quality level.
-   **Output Format**: Defines how the result should be structured (Markdown, JSON, Table, etc.).

## Connectivity Rules

-   **Inputs**: Accepts connections from `INPUT` nodes (Assets, Sources) and other `PROCESS` nodes.
-   **Execution**: When run, the node collects data from all incoming edges and compiles them into a single context for the LLM prompt.
