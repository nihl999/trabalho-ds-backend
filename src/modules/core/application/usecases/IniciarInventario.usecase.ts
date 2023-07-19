import { Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { parse } from 'papaparse'
import { Not, Repository } from 'typeorm'
import { PatrimonioModel, TiposCriacaoPatrimonio } from '../../infra/models/Patrimonio'
import { InventarioModel, StatusInventario } from '../../infra/models/Inventario'
import { EspacoInventarioModel, StatusEspacoInventario } from '../../infra/models/EspacoInventario'
import { UsuarioModel } from '../../infra/models/Usuario'
import { EspacoModel } from '../../infra/models/Espaco'

//TODO Implementar
export class IniciarInventarioUsecase {
  private logger = new Logger(IniciarInventarioUsecase.name)

  constructor(
    @InjectRepository(InventarioModel)
    private inventarioRepository: Repository<InventarioModel>
  ) {}

  public async execute() {
    const inventarios = await this.inventarioRepository.findOne({
      where: {
        status: StatusInventario.PENDENTE_INICIO,
      },
    })
    if (!inventarios || inventarios == null) return false
    inventarios.status = StatusInventario.INICIADO
    await this.inventarioRepository.save(inventarios)
    return true
  }
}
