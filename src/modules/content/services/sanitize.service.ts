// src/modules/content/services/sanitize.service.ts
import sanitizeHtml from 'sanitize-html';

import { Injectable } from '@nestjs/common';
import { deepMerge } from 'src/modules/core/helpers';

@Injectable()
export class SanitizeService {
  protected config: sanitizeHtml.IOptions = {};

  constructor() {
    this.config = {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'code']),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        '*': ['class', 'style', 'height', 'width'],
      },
      parser: {
        lowerCaseTags: true,
      },
    };
  }

  sanitize(body: string, options?: sanitizeHtml.IOptions) {
    return sanitizeHtml(body, deepMerge(this.config, options ?? {}, 'replace'));
  }
}
