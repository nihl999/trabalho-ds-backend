import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OrmModuleOptions } from '../ormconfig'
import { Modules } from '../src'
import { AppController } from './app.controller'

@Module({
  controllers: [AppController],
  imports: [...Modules, TypeOrmModule.forRoot({ ...OrmModuleOptions })],
})
export class AppModule {}
