import { z } from 'zod';

const TextRunSchema = z.object({
  'a:t': z.string().optional(),
});

const ParagraphSchema = z.object({
  'a:r': z.union([z.array(TextRunSchema), TextRunSchema]).optional(),
});

const ShapeSchema = z.object({
  'p:txBody': z
    .object({
      'a:p': z.union([z.array(ParagraphSchema), ParagraphSchema]),
    })
    .optional(),
});

const PictureSchema = z.object({
  'p:blipFill': z
    .object({
      'a:blip': z
        .object({
          '@_r:embed': z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

const SlideSchema = z.object({
  'p:cSld': z.object({
    'p:spTree': z.object({
      'p:sp': z.union([z.array(ShapeSchema), ShapeSchema]).optional(),
      'p:pic': z.union([z.array(PictureSchema), PictureSchema]).optional(),
    }),
  }),
});

export const XMLPresentationSchema = z.object({
  'p:presentation': z.object({
    'p:sldIdLst': z.object({
      'p:sldId': z.array(
        z.object({
          '@_r:id': z.string(),
        })
      ),
    }),
  }),
});

export const XMLSlideSchema = z.object({
  'p:sld': z.object({
    '@_r:id': z.string(),
    ...SlideSchema.shape,
  }),
});

export type PptxXML = z.infer<typeof XMLPresentationSchema>;
export type SlideXML = z.infer<typeof XMLSlideSchema>;
export type PptxParagraph = z.infer<typeof ParagraphSchema>;
export type PptxTextRun = z.infer<typeof TextRunSchema>;
export type PptxShape = z.infer<typeof ShapeSchema>;
export type PptxPicture = z.infer<typeof PictureSchema>;
