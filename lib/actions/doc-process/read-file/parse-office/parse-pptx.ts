import { SlideXML } from '@/types';

export function extractTextFromSlide(slide: SlideXML): string {
  let text = '';

  const shapes = slide['p:sld']['p:cSld']['p:spTree']['p:sp'];
  if (Array.isArray(shapes)) {
    shapes.forEach((shape) => {
      if (shape['p:txBody']) {
        const paragraphs = shape['p:txBody']['a:p'];
        if (Array.isArray(paragraphs)) {
          paragraphs.forEach((p) => {
            if (p['a:r']) {
              const runs = Array.isArray(p['a:r']) ? p['a:r'] : [p['a:r']];
              runs.forEach((run) => {
                if (run['a:t']) {
                  text += run['a:t'] + ' ';
                }
              });
            }
          });
        }
      }
    });
  }
  return text.trim();
}
