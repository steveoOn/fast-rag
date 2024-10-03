import { DocXML } from '@/types';

export function extractTextFromParsedXml(parsedXml: DocXML): string {
  // 这个函数需要根据实际的XML结构来实现
  // 这里只是一个简化的示例
  let text = '';
  if (parsedXml['w:document'] && parsedXml['w:document']['w:body']) {
    const paragraphs = parsedXml['w:document']['w:body']['w:p'];
    if (Array.isArray(paragraphs)) {
      paragraphs.forEach((p) => {
        if (p['w:r']) {
          const runs = Array.isArray(p['w:r']) ? p['w:r'] : [p['w:r']];
          runs.forEach((run) => {
            if (run['w:t']) {
              const content = typeof run['w:t'] === 'string' ? run['w:t'] : run['w:t']['#text'];
              text += content;
            }
          });
          text += '\n';
        }
      });
    }
  }
  return text;
}

// 图片暂时解析不出来
export function findImageReferences(parsedXml: DocXML): string[] {
  const refs: string[] = [];
  if (!parsedXml['w:document'] || !parsedXml['w:document']['w:body']) {
    return refs;
  }
  const paragraphs = parsedXml['w:document']['w:body']['w:p'];

  if (Array.isArray(paragraphs)) {
    paragraphs.forEach((p) => {
      const runs = Array.isArray(p['w:r']) ? p['w:r'] : [p['w:r']];
      runs.forEach((run) => {
        if (run && run['w:drawing']) {
          const drawing = run['w:drawing'];
          if (drawing['wp:inline'] && drawing['wp:inline']['a:graphic']) {
            const graphic = drawing['wp:inline']['a:graphic'];
            if (graphic['a:graphicData'] && graphic['a:graphicData']['pic:pic']) {
              const pic = graphic['a:graphicData']['pic:pic'];
              if (pic['pic:blipFill'] && pic['pic:blipFill']['a:blip']) {
                const blip = pic['pic:blipFill']['a:blip'];
                if (blip['@_r:embed']) {
                  refs.push(blip['@_r:embed']);
                }
              }
            }
          }
        }
      });
    });
  }
  return refs;
}
