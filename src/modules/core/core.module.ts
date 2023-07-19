import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Usecases } from './application/usecases'
import { ImportarCsvUsecase } from './application/usecases/ImportarCSV.usecase'
import { TaProntoUsecase } from './application/usecases/TaPronto.usecase'
import { CoreController } from './core.controller'
import { EspacoModel } from './infra/models/Espaco'
import { EspacoInventarioModel } from './infra/models/EspacoInventario'
import { InventarioModel } from './infra/models/Inventario'
import { PatrimonioModel } from './infra/models/Patrimonio'
import { UsuarioModel } from './infra/models/Usuario'

@Module({
  imports: [
    TypeOrmModule.forFeature([PatrimonioModel, InventarioModel, UsuarioModel, EspacoModel, EspacoInventarioModel]),
  ],
  controllers: [CoreController],
  providers: [...Usecases],
})
export class CoreModule {}
