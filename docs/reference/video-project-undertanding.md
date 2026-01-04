# Video Project Understanding

The video generation process in this platform is designed to be modular and flow-based, allowing for automated content creation from various sources.

## Core Concepts

There are multiple ways to approach the video generation process:

1.  **Stand-alone Components**: Using specific sections and components dedicated to video editing.
2.  **Flow-based Nodes**: Using the Creative Flowboard with specialized nodes that reuse core components to generate video assets.

The foundational step is building the correct `IVideoProjectGenerator` object, which contains all the metadata, sources, and dialogs needed to synthesize the final video.

## Data Structures

The following interfaces define the structure of a video project:

```typescript
export interface IDialog {
  content: string;      // The text content to be synthesized
  audio: CloudStorage;  // Reference to the generated audio file
  voice: string;        // The voice ID used for synthesis
  transcription: any;   // Whisper-compatible transcription data
  captions: any;        // Timing data for on-screen captions
}

export interface IVideoProjectGenerator extends AuditDate {
  _id?: string;
  id: string;
  name?: string;
  description?: string;
  type?: string;
  sources?: SourceWithReference[];
  dialogs?: IDialog[];
  agent?: Partial<AgentCardWithReference>;
  task?: Partial<ILlmTask>;
  compositionPlan?: ICompositionPlan;
}
```

## Video Script Generation Node

The **Video Script Node** is the primary engine for turning raw information into a structured script. In the Creative Flowboard, this node can be connected to multiple input nodes (like Lead data, Asset info, or external text sources).

### How it Works (Details Modal)

The `VideoScriptGenDetailsComponent` provides the interface to generate and manage the script:

#### 1. Input Aggregation
When the details modal is opened, it automatically detects all connected input nodes. It pulls the `content` or `nodeData` from these inputs to build a rich context for the AI.

#### 2. AI Script Generation
By clicking the **Generate Script** button, the system:
*   Aggregates all input node data.
*   Combines it with any custom prompt provided by the user.
*   Calls the `LlmService` with a request for a guaranteed JSON response.
*   The AI is instructed to return an array of `IDialog` objects.

#### 3. Automatic Form Population
The response from the LLM is parsed and used to clear and then re-populate the `dialogs` form array. This allows the user to immediately see the generated lines, edit them, or proceed to voice synthesis.

### Next Steps in the Flow
Once the dialogs are generated:
*   **Voice Synthesis**: Each dialog line can be sent to TTS services to generate the `audio` file.
*   **Composition**: The dialogs and associated media are used to build the `ICompositionPlan` for final video rendering.


