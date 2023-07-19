import { Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { EspacoInventarioModel } from '../../infra/models/EspacoInventario'
import { InventarioModel, StatusInventario } from '../../infra/models/Inventario'

//TODO Implementar
export class RetornarSalasInventariosServidorUsecase {
  private logger = new Logger(RetornarSalasInventariosServidorUsecase.name)

  constructor(
    @InjectRepository(InventarioModel)
    private inventarioRepository: Repository<InventarioModel>,
    @InjectRepository(EspacoInventarioModel)
    private espacoInventarioRepository: Repository<EspacoInventarioModel>
  ) {}

  public async execute(props: { idServidor: number }) {
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
        responsavel: { id: props.idServidor },
      },
      relations: { espaco: true, responsavel: true, inventario: true },
    })
    this.logger.debug(espacosInventario)

    return espacosInventario ? espacosInventario : []
  }
}
