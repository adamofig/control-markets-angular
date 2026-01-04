
### Video Generation 

There are multiple ways to disting about the video generation process.

1. It can have its own component and section, 
2. It start with some node that reuse some of the components in order to generate the video. 


First important step is to have the right Object in order to get data to build the video. 

Having this second step will be to pass this object into a Video Editor App, but is out of the scope of this document. 

## Generate Script  

for now this is the latest model. 


export interface IDialog {
  content: string;
  audio: CloudStorage;
  voice: string;
  transcription: any; // TODO: Define transcription type whisper
  captions: any; // TODO: Define captions type whisper
}

export interface IVideoProjectGenerator extends AuditDate {
  _id?: string;
  id: string;
  name?: string;
  description?: string;
  type?: string;
  sources?: SourceWithReference[];
  dialogs?: IDialog[];
  // Having one is temporary in the future probably will migrate to array.
  agent?: Partial<AgentCardWithReference>;
  task?: Partial<ILlmTask>;
  compositionPlan?: ICompositionPlan;
}

in order to create a video we need to synthesie the voice to be the narration. 
is just calling our ai services. but someone need to create the dialogs to be synthesised.  and let the AI create the dialogs. 

### Video Script Node.
For the Creative FlowBoard this is the node that can be connected to inputs and generate the video script. 


