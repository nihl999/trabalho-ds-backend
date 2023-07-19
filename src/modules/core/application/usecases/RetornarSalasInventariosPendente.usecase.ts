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
export class RetornarSalasInventariosPendentesUsecase {
  private logger = new Logger(RetornarSalasInventariosPendentesUsecase.name)

  constructor(
    @InjectRepository(InventarioModel)
    private inventarioRepository: Repository<InventarioModel>,
    @InjectRepository(EspacoInventarioModel)
    private espacoInventarioRepository: Repository<EspacoInventarioModel>
  ) {}

  public async execute() {
    const inventarios = await this.inventarioRepository.find({
      where: [
        {
          status: StatusInventario.PENDENTE_INICIO,
        },
        {
          status: StatusInventario.INICIADO,
        },
      ],
    })
    if (!inventarios || inventarios.length <= 0 || inventarios == null) return []
    const espacosInventario = await this.espacoInventarioRepository.find({
      where: {
        inventario: { id: inventarios[0].id },
      },
      relations: { espaco: true, responsavel: true, inventario: true },
    })
    this.logger.debug(espacosInventario)
    return espacosInventario ? espacosInventario : []
  }
}
