export enum PostBodyType {
  HTML = 'html',
  MD = 'markdown',
}

/**
 * 文章排序类型
 */
export enum PostOrderType {
  CREATED = 'createdAt',
  UPDATED = 'updatedAt',
  PUBLISHED = 'publishedAt',
  CUSTOM = 'custom',
}
