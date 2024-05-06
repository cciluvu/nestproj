import { Module } from '@nestjs/common';
import { PostController } from './controllers/post.controller';
import { PostSubscriber } from './subscribers/post.subscribers';
import { PostService } from './services/post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { PostEntity } from './entities/post.entity';
import { PostRepository } from './repositories/post.repository';
import { SanitizeService } from './services/sanitize.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity]),
    DatabaseModule.forRepository([PostRepository]),
  ],
  controllers: [PostController],
  providers: [PostService, PostSubscriber, SanitizeService],
  exports: [PostService, DatabaseModule.forRepository([PostRepository])],
})
export class ContentModule {}
