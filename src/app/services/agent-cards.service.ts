import { Injectable, inject } from '@angular/core';
import { AudioSpeed, ChatRole, ConversationMessagesDTO, IAgentCard, IConversationSettings } from '@dataclouder/ngx-agent-cards';
import { UserService } from '../dc-user-module/user.service';
import { Endpoints } from '../core/enums';
import { ChatUserSettings, FiltersConfig, IFilterQueryResponse } from '@dataclouder/ngx-core';
import { IUser } from '@dataclouder/ngx-users';
import { HttpCoreService } from '@dataclouder/ngx-core';

export type AudioGenerated = { blobUrl: string; transcription: any };
export type TTSRequest = { text: string; voice: string; generateTranscription: boolean; speedRate: number; speed?: string; ssml?: string };

@Injectable({
  providedIn: 'root',
})
export class AgentCardService {
  private httpService = inject(HttpCoreService);

  getAllConversationCards(): Promise<IAgentCard[]> {
    return this.getAllAgentCards();
  }
  partialUpdateAgentCard(partialAgentCard: IAgentCard): Promise<IAgentCard> {
    throw new Error('Method not implemented.');
  }

  completeAgentCard(idCard: string): Promise<any> {
    alert('Please implement this method');
    throw new Error('Method not implemented.');
  }
  generateMainImage(idCard: string): Promise<any> {
    alert('Please implement this method');
    throw new Error('Method not implemented.');
  }

  private userService = inject(UserService);

  public async callInstruction(text: string): Promise<any> {
    if (!text) {
      throw new Error('Text is required');
    }
    text = `Fix grammar and spelling errors in the following text: '${text}'`;
    return await this.httpService.post(`${Endpoints.AgentCard.Chat}`, { text });
  }

  public async findFilteredAgentCards(paginator: FiltersConfig) {
    const response = await this.httpService.post(`${Endpoints.AgentCard.ConversationQuery}`, paginator);
    return response;
  }

  public async findAgentCardByTitle(title: string): Promise<IAgentCard> {
    const filters: FiltersConfig = { filters: { title } };
    const response = await this.httpService.post<IFilterQueryResponse<IAgentCard>>(`${Endpoints.AgentCard.ConversationQuery}`, filters);
    return response.rows[0];
  }

  async filterConversationCards(filters: FiltersConfig): Promise<any> {
    return await this.httpService.post(`${Endpoints.AgentCard.ConversationQuery}`, filters);
  }

  public async getAudioTranscriptions(audioBlob: Blob, metadata: any = null): Promise<any> {
    return await this.httpService.uploadFile(`${Endpoints.Whisper.TranscribeBytes}`, audioBlob, metadata);

    // return await this.httpService.uploadAudioFile(`${Endpoints.AgentCard.Whisper}`, audioBlob, metadata, 'python');
  }

  public async findAgentCards(paginator: FiltersConfig) {
    const response = await this.httpService.post(`${Endpoints.AgentCard.ConversationQuery}`, paginator);
    return response;
  }

  public async getListModels(provider: string): Promise<any> {
    const data = await this.httpService.get(`${Endpoints.AgentCard.ListModels}?provider=${provider}`);
    return data;
  }

  async translateConversation(currentLang: string, targetLang: string, idCard: string): Promise<ChatUserSettings> {
    const response = await this.httpService.post(`${Endpoints.AgentCard.TranslateConversation}`, { currentLang, targetLang, idCard });

    return response;
  }

  async saveConversationUserChatSettings(conversation: ChatUserSettings): Promise<ChatUserSettings> {
    console.log('saveConversationUserChatSettings', conversation);
    const data = await this.userService.saveUser({ conversationSettings: conversation });
    this.userService.user.set({ ...(this.userService.user() as IUser), conversationSettings: conversation });
    return Promise.resolve(conversation);
  }

  getConversationUserChatSettings(): Promise<ChatUserSettings> {
    if (this.userService.user()?.conversationSettings) {
      return Promise.resolve(this.userService.user()?.conversationSettings as ChatUserSettings);
    } else {
      return Promise.resolve({
        realTime: false,
        repeatRecording: false,
        fixGrammar: false,
        superHearing: false,
        voice: 'en-US',
        autoTranslate: false,
        synthVoice: false,
        highlightWords: false,
        speedRate: 1,
        modelName: '',
        provider: '',
        speed: AudioSpeed.Regular,
        userMessageTask: false,
        assistantMessageTask: false,
      } as ChatUserSettings);
    }
  }

  getConversationPromptSettings(): Promise<ConversationMessagesDTO> {
    throw new Error('Method not implemented.');
  }

  public async getTextAudioFile(tts: TTSRequest): Promise<AudioGenerated> {
    const httpReq: any = await this.httpService.post(`${Endpoints.Vertex.tts}`, tts);
    const audioData: any = { blobUrl: null, transcription: null };

    const transcription = httpReq?.headers.get('transcription');

    if (transcription) {
      const data = JSON.parse(transcription);
      audioData.transcription = data;
    }

    const mp3 = window.URL.createObjectURL(httpReq.body);
    audioData.blobUrl = mp3;

    return audioData;
  }

  public deleteAgentCard(id: string): Promise<IAgentCard> {
    return this.httpService.delete(`${Endpoints.AgentCard.Card}/${id}`);
  }

  public findAgentCardByID(id: string): Promise<IAgentCard> {
    return this.httpService.get(`${Endpoints.AgentCard.Card}/${id}`);
  }
  public getAllAgentCards(): Promise<IAgentCard[]> {
    return this.httpService.get(`${Endpoints.AgentCard.Card}`);
  }

  async saveAgentCard(conversation: IAgentCard): Promise<IAgentCard> {
    if (conversation.id || conversation._id) {
      return await this.httpService.put(`${Endpoints.AgentCard.Card}/${conversation._id}`, conversation);
    } else {
      return await this.httpService.post(`${Endpoints.AgentCard.Card}`, conversation);
    }
  }

  public async callChatCompletion(conversation: IConversationSettings | ConversationMessagesDTO): Promise<any> {
    console.log('callChatCompletion', conversation);

    let messages = conversation.messages?.map((m: any) => ({ content: m.content, role: m.role }));

    messages = messages?.filter((m: any) => m.role != ChatRole.AssistantHelper);
    const conversationFiltered = { ...conversation, messages };

    return await this.httpService.post(`${Endpoints.AgentCard.Chat}`, conversationFiltered);
  }

  getText(): void {
    console.log('getText');
  }

  setTTS(): void {
    console.log('getText');
  }
}
