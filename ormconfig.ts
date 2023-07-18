import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import dotenv from 'dotenv'
import { DataSource } from 'typeorm'
dotenv.config()

const entities = ['dist/src/modules/**/infra/models/*.{ts,js}', 'dist/src/shared/infra/models/*.{ts,js}']

const DataSourceConfig = {
  name: 'default',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  dropSchema: false,
  cache: false,
  synchronize: false,
  logging: true,
  logger: 'advanced-console',
  extra: {
    connectionLimit: 10,
  },
  migrations: ['dist/src/shared/infra/migrations/**/*.{ts,js}'],
  entities,
}

export const OrmModuleOptions: TypeOrmModuleOptions = {
  ...DataSourceConfig,
  type: 'postgres',
  logger: 'advanced-console',
}

export const AppDataSource = new DataSource({
  ...DataSourceConfig,
  type: 'postgres',
  logger: 'advanced-console',
})
