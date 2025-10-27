import { Injectable } from '@angular/core';
import { DynamicNodeWithData } from './flow-diagram-state.service';
import { ChatMessage, ChatRole } from '@dataclouder/ngx-agent-cards';
import { groupBy } from 'es-toolkit';
import { NodeType } from '../models/flows.model';

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
        messages.push({
          role: ChatRole.System,
          content,
          messageId: source.id,
        });
      }
    }

    return messages;
  }
}
