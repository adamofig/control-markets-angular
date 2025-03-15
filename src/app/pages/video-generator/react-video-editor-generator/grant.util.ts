import { IOverlayPlan } from '../models/videoGenerators.model';

export function createGanttChart(plan: IOverlayPlan | undefined): string {
  if (!plan) return '';
  const start = plan.timelineStart || 0;
  const end = plan.timelineEnd || 0;
  console.log('start', start, 'end', end);

  const ganttChart = `
\`\`\`mermaid
gantt
    title Video Plan Timeline
    dateFormat s
    axisFormat %S

    section Videos
    Video 1           :v1, ${start}, ${end}s
    Video 2           :v2, after v1, 4s

    section Captions
    Captions 1     :s1, ${start}, ${end}s

    section Audio
    Song    :a1, ${start}, ${end}s
\`\`\``;

  console.log(ganttChart);

  return ganttChart;
}
