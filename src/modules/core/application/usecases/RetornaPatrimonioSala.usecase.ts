import { Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { EspacoInventarioModel } from '../../infra/models/EspacoInventario'
import { InventarioModel, StatusInventario } from '../../infra/models/Inventario'
import { PatrimonioModel } from '../../infra/models/Patrimonio'

//TODO Implementar
export class RetornarPatrimonioSalaUsecase {
  private logger = new Logger(RetornarPatrimonioSalaUsecase.name)

  constructor(
    @InjectRepository(InventarioModel)
    private inventarioRepository: Repository<InventarioModel>,
    @InjectRepository(PatrimonioModel)
    private patrimonioRepository: Repository<PatrimonioModel>
  ) {}

  public async execute(salaId: string) {
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

    const patrimonio = await this.patrimonioRepository.find({
      where: {
        espacoInventario: { espaco: { id: `${salaId} ` }, inventario: { id: inventarios[0].id } },
      },
      select: ['descricao', 'numero'],
    })

    this.logger.debug(patrimonio)
    this.logger.debug(inventarios[0].id)
    this.logger.debug(salaId)

    return patrimonio
  }
}
