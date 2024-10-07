import { z } from 'zod';

const RunSchema = z.object({
  'w:t': z.union([z.string(), z.object({ '#text': z.string() })]).optional(),
  'w:drawing': z
    .object({
      'wp:inline': z
        .object({
          'a:graphic': z
            .object({
              'a:graphicData': z
                .object({
                  'pic:pic': z
                    .object({
                      'pic:blipFill': z
                        .object({
                          'a:blip': z
                            .object({
                              '@_r:embed': z.string().optional(),
                            })
                            .optional(),
                        })
                        .optional(),
                    })
                    .optional(),
                })
                .optional(),
            })
            .optional(),
        })
        .optional(),
    })
    .optional(),
});

const ParagraphSchema = z.object({
  'w:r': z.union([z.array(RunSchema), RunSchema]).optional(),
});

export const XMLDocumentSchema = z.object({
  'w:document': z.object({
    'w:body': z.object({
      'w:p': z.union([z.array(ParagraphSchema), ParagraphSchema]),
    }),
  }),
});

export type DocXML = z.infer<typeof XMLDocumentSchema>;
export type DocParagraph = z.infer<typeof ParagraphSchema>;
export type DocRun = z.infer<typeof RunSchema>;
