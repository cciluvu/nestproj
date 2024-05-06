import { CustomRepository } from 'src/modules/database/decorators/repository.decorator';
import { Repository } from 'typeorm';
import { PostEntity } from '../entities/post.entity';

// src/modules/content/repositories/post.repository.ts
@CustomRepository(PostEntity)
export class PostRepository extends Repository<PostEntity> {
  buildBaseQB() {
    return this.createQueryBuilder('post');
  }
}
