import { IOverlayPlan } from '../models/videoGenerators.model';

export function createGanttChart(plannedOverlays: IOverlayPlan[] | undefined): string {
  if (!plannedOverlays) return '';

  const chartLines: string[] = [];
  const captionLines: string[] = [];
  for (const i in plannedOverlays) {
    const chartLine = extractTimes(plannedOverlays[i], i);
    const captionsLine = extractTimes(plannedOverlays[i], i, true);
    chartLines.push(chartLine);
    captionLines.push(captionsLine);
  }

  const sections: string = chartLines.join('\n');
  const captionsSections: string = captionLines.join('\n');
  const ganttChart = `
\`\`\`mermaid
gantt
    title Video Plan Timeline
    dateFormat s
    axisFormat %S

    section Videos
    ${sections}

    section Captions
    ${captionsSections}

    section Audio
    Song    :a1, 2, 4s
\`\`\``;

  console.log(ganttChart);

  return ganttChart;
}

function extractTimes(overlay: IOverlayPlan, index: string, isCaption: boolean = false): string {
  const overlayClone = { ...overlay };
  console.log('overlay', overlay);

  let tag = '';

  if (overlayClone.timelineStartSec === null) {
    overlayClone.timelineStartSec = 0;
  }

  if (overlayClone.timelineEndSec === null) {
    overlayClone.timelineEndSec = overlayClone.fragment.durationSec || 0;
    tag = 'crit,';
  }
  let overlayId = 'video' + index;
  let title = `Video ${index} (${overlayClone.fragment.startSec}s - ${overlayClone.fragment.endSec}s)`;
  if (isCaption) {
    title = 'Captions ' + title;
    overlayId = 'caption' + index;
  }
  return `${title} :${tag} ${overlayId}, ${Math.round(overlayClone.timelineStartSec)}, ${Math.round(overlayClone.timelineEndSec)}`;
}
