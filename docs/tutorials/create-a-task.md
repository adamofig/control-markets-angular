# How to Create a Task

Before building your automation flows, it is essential to understand the three core concepts that drive every interaction in Control Markets: **Tasks**, **Agents**, and **Sources**.

---

## 1. What is a Task?

A **Task** is more than just a simple message to ChatGPT. Think of it as a **saved, reusable instruction set** that you can orchestrate within a larger workflow. Instead of typing the same request repeatedly, you define it once as a Task.

### Crafting a Great Task (Prompt Engineering)

To get high-quality results from AI, your Task should follow these three basic principles:

#### 🎯 Concise Instructions
Clearly state what you want to achieve. Avoid ambiguity. Use direct verbs (e.g., "Summarize this article," "Generate 5 social media captions").

#### 📝 Markdown Formatting
Always instruct the AI to use Markdown. It ensures the output is structured and readable. Specifically:
- Use **tables** for data comparison.
- Use **headings** for hierarchy.
- Use **quotes** for excerpts or important highlights.

#### 💡 Provide Examples (Few-Shot)
This is the most powerful way to guide the AI. Including a "Sample Output" in your prompt is more effective than any long explanation. Show the AI exactly what "done" looks like.

---

## 2. The Role of the Persona (Agent)

An **Agent** is effectively the "person" assigned to perform the Task. 

- **Personality**: Does your writer sound like a corporate executive or a creative Gen-Z influencer?
- **Expertise**: Is the task being handled by a SEO specialist or a legal advisor?

By connecting an Agent to a Task, the AI stops feeling like a generic chatbot and starts delivering content with a consistent brand voice and professional depth.

---

## 3. The Power of Sources (Context)

Even with clear instructions, AI can become repetitive if it lacks fresh data. This is where **Sources** come in.

**Sources** provide the "inspiration" or "data" the Task needs to work with.
- **Static Sources**: Documents, PDFs, or fixed assets.
- **Dynamic Sources**: Connected nodes on the canvas that pass data in real-time.

By varying the Sources daily, you ensure your Task generates unique, context-aware content every time it runs.

---

## 🚀 Quick Step-by-Step

1.  **Drop a Task Node**: Drag a `TaskNode` onto the canvas from the side menu.
2.  **Double-Click to Configure**: Open the detail view and switch to the **Form** tab.
3.  **Define the Logic**: Enter your name, prompt, and select the output format.
4.  **Connect Agents & Sources**: Join the `left` or `top` handles of your Task to the corresponding input nodes.
5.  **Run & Verify**: Click the "Run" button on the actions toolbar to see your result in the **Details** tab.