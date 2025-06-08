import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CustomNodeComponent, Vflow } from 'ngx-vflow';

// Define custom data type for your node
export type NodeData = {
  text: string;
  image: string;
};

@Component({
  selector: 'app-circular-node',
  template: `
    <div class="circular-node">
      {{ data()?.text }}
    </div>

    <handle type="source" position="top" id="a" />
    <handle type="source" position="right" id="b" />
    <handle type="source" position="bottom" id="c" />
    <handle type="source" position="left" id="d" />
  `,
  styles: [
    `
      .circular-node {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: lightblue;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid steelblue;
        color: black;
        font-weight: bold;
      }
    `,
  ],
  standalone: true,
  imports: [Vflow],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircularNodeComponent extends CustomNodeComponent<NodeData> {}
