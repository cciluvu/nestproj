// src/modules/database/database.module.ts
import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import {
  TypeOrmModule,
  TypeOrmModuleOptions,
  getDataSourceToken,
} from '@nestjs/typeorm';
import { DataSource, ObjectType } from 'typeorm';
import { CUSTOM_REPOSITORY_METADATA } from './constants';

/*这个静态函数将会接受一个自定义的Repository类列表以及数据库连接名称(我们目前只有一个连接,
所以不需要传入,因为默认就连default)
遍历每个自定义的Repository类判断是否有通过CUSTOM_REPOSITORY_METADATA常量存储的模型，
如果没有则忽略，因为这个类不是自定义Repository
如果有，那么首先我们获取数据库连接实例，
然后注入到useFactory里面生成一个自定义的Repository实例并返回为提供者，
其内部是先通过数据库连接实例(dataSource)生成这个模型的默认Repsitory实例，
然后默认Repository的构造函数需要的参数通过默认的Repository实例获取，
并传入到你自定义的Repository类的构造函数中以生成新的实例(自定义的Repository必须继承默认Repository，
所以它们的构造函数参数是相同的)
最后把返回的所有自定义Repository类实例全部注册为DatabaseModule的提供者并通过exports导出 */

@Module({})
export class DatabaseModule {
  static forRepository<T extends Type<any>>(
    repositories: T[],
    dataSourceName?: string,
  ): DynamicModule {
    const providers: Provider[] = [];

    for (const Repo of repositories) {
      const entity = Reflect.getMetadata(CUSTOM_REPOSITORY_METADATA, Repo);

      if (!entity) {
        continue;
      }

      providers.push({
        inject: [getDataSourceToken(dataSourceName)],
        provide: Repo,
        useFactory: (dataSource: DataSource): InstanceType<typeof Repo> => {
          const base = dataSource.getRepository<ObjectType<any>>(entity);
          return new Repo(base.target, base.manager, base.queryRunner);
        },
      });
    }
    return {
      exports: providers,
      module: DatabaseModule,
      providers,
    };
  }

  static forRoot(configRegister: () => TypeOrmModuleOptions): DynamicModule {
    return {
      global: true,
      module: DatabaseModule,
      imports: [TypeOrmModule.forRoot(configRegister())],
    };
  }
}
