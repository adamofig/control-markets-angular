import { Injectable } from '@angular/core';
import { DynamicNodeWithData } from './flow-diagram-state.service';
import { ChatMessage, ChatRole, IAgentCard } from '@dataclouder/ngx-agent-cards';
import { groupBy } from 'es-toolkit';
import { NodeType } from '../models/flows.model';

export enum SectionType {
  Intro = 'intro',
  Persona = 'persona',
  Context = 'context',
  Rules = 'rules',
}

export enum SystemPromptType {
  SystemPrompt = 'system_prompt',
  ConversationType = 'conversation_type',
  CharacterIdentity = 'character_identity',
  CharacterAppearance = 'character_appearance',
  CharacterPersonality = 'character_personality',
  CharacterCommunication = 'character_communication',
  CharacterPsychology = 'character_psychology',
  CharacterBackground = 'character_background',
  CharacterCapabilities = 'character_capabilities',
  CharacterSocial = 'character_social',
  CharacterPreferences = 'character_preferences',
  CharacterSituation = 'character_situation',
  CharacterDescription = 'character_description',
  Language = 'language',
  UserInformation = 'user_information',
  ScenarioDescription = 'scenario_description',
  MessageExamples = 'message_examples',
}

export enum PersonaExtractionLevel {
  BASIC = 'basic',
  MEDIUM = 'medium',
  FULL = 'full',
}

@Injectable({
  providedIn: 'root',
})
export class NodePromptBuilderService {
  public getContextPrompts(nodes: DynamicNodeWithData[]): ChatMessage[] {
    const groupedInputNodes = groupBy(nodes, item => item.component);
    const sourceNodes = groupedInputNodes[NodeType.SourcesNodeComponent] || [];
    const messages: ChatMessage[] = [];

    if (sourceNodes.length > 0) {
      for (const source of sourceNodes) {
        const nodeData = source.data.nodeData;
        let content = '';
        if (nodeData.tag === 'rule') {
          content = `## Rule: ${nodeData.name}\n${nodeData.content}\n\n`;
        } else {
          content = `## Context: ${nodeData.name}\n${nodeData.content}\n\n`;
        }
        messages.push({ role: ChatRole.System, content, messageId: source.id });
      }
    }

    return messages;
  }

  public getAgentCardPersona(agentCard: IAgentCard, level: PersonaExtractionLevel): ChatMessage[] {
    const chat: ChatMessage[] = [];
    const characterCard = agentCard.characterCard;

    if (!characterCard?.data?.persona) {
      return chat;
    }

    const persona = characterCard.data.persona;

    const personaMapping: { [key: string]: { messageId: SystemPromptType; section: SectionType } } = {
      identity: { messageId: SystemPromptType.CharacterIdentity, section: SectionType.Persona },
      physical: { messageId: SystemPromptType.CharacterAppearance, section: SectionType.Persona },
      personality: { messageId: SystemPromptType.CharacterPersonality, section: SectionType.Persona },
      communication: { messageId: SystemPromptType.CharacterCommunication, section: SectionType.Persona },
      psychology: { messageId: SystemPromptType.CharacterPsychology, section: SectionType.Persona },
      background: { messageId: SystemPromptType.CharacterBackground, section: SectionType.Persona },
      capabilities: { messageId: SystemPromptType.CharacterCapabilities, section: SectionType.Persona },
      social: { messageId: SystemPromptType.CharacterSocial, section: SectionType.Persona },
      preferences: { messageId: SystemPromptType.CharacterPreferences, section: SectionType.Persona },
      situation: { messageId: SystemPromptType.CharacterSituation, section: SectionType.Persona },
    };

    const personaFields: { [key in PersonaExtractionLevel]: (keyof typeof persona)[] } = {
      [PersonaExtractionLevel.BASIC]: ['personality', 'communication', 'capabilities'],
      [PersonaExtractionLevel.MEDIUM]: ['personality', 'communication', 'capabilities', 'psychology', 'background', 'preferences'],
      [PersonaExtractionLevel.FULL]: Object.keys(personaMapping) as (keyof typeof persona)[],
    };

    const fieldsToExtract = personaFields[level];

    for (const field of fieldsToExtract) {
      if (persona[field]) {
        const mapping = personaMapping[field];
        chat.push({
          role: ChatRole.System,
          content: persona[field],
          messageId: mapping.messageId,
          section: mapping.section,
        });
      }
    }

    return chat;
  }
}
