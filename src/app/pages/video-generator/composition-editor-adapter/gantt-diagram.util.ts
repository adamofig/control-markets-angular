import { IOverlayPlan } from '../models/videoGenerators.model';

export function createGanttChart(plannedOverlays: IOverlayPlan[] | undefined): string {
  if (!plannedOverlays) return '';

  const chartLines: string[] = [];
  for (const i in plannedOverlays) {
    const chartLine = extractTimes(plannedOverlays[i], i);
    console.log(chartLine);
    chartLines.push(chartLine);
  }

  const sections: string = chartLines.join('\n');

  const ganttChart = `
\`\`\`mermaid
gantt
    title Video Plan Timeline
    dateFormat s
    axisFormat %S

    section Videos
    ${sections}

    section Captions
    Captions 1     :s1, 2,5

    section Audio
    Song    :a1, 2, 4s
\`\`\``;

  console.log(ganttChart);

  return ganttChart;
}

function extractTimes(overlay: IOverlayPlan, index: string): string {
  const overlayClone = { ...overlay };
  console.log('overlay', overlay);

  let tag = '';

  if (overlayClone.timelineStart === null) {
    overlayClone.timelineStart = 0;
  }

  if (overlayClone.timelineEnd === null) {
    overlayClone.timelineEnd = overlayClone.fragment.duration;
    tag = 'crit,';
  }
  return `Video ${index} :${tag} v${index}, ${Math.round(overlayClone.timelineStart)}, ${Math.round(overlayClone.timelineEnd)}`;
}
