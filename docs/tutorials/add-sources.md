# Adding Sources

Sources are text-based content modules that provide essential context to your agents. They act as the "knowledge base" for your tasks.

> [!NOTE]
> Currently, sources must be provided manually as text. Automated extraction from the web or other external files is not yet supported.

## Why Use Sources?

Creating a source makes it reusable across different **Flows**. This ensures consistency and saves time. You can manage sources in two ways:
1.  **Creative FlowBoard**: Add them directly while designing your flow.
2.  **Sources Section**: Manage and organize all your knowledge assets in one place.

## Connecting Sources to Tasks

Once a source is added, you typically connect it to a **Task Node**. This provides the technical context or reference material the AI needs to execute the task accurately.

### Best Practices: Finding the Right Balance
While you can connect an unlimited number of sources to a single Task Node, be cautious of **Information Oversaturation**:
*   **Too much data** can lead to LLM hallucinations.
*   **Contradictory sources** will confuse the AI, resulting in poor decision-making.
*   **Efficiency**: Aim for high-quality, relevant context rather than volume.

## The Result
The AI processes the task by synthesizing the connected sources. The output is usually:
*   Drafted content for posts or articles.
*   Input for subsequent nodes (e.g., a video script for a VideoGenNode or an audio script).

Sources are a simple but powerful way to ground your AI's creativity in real data.
