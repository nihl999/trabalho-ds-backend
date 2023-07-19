import { Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { parse } from 'papaparse'
import { Not, Repository } from 'typeorm'
import { PatrimonioModel, TiposCriacaoPatrimonio } from '../../infra/models/Patrimonio'
import { InventarioModel, StatusInventario } from '../../infra/models/Inventario'
import { EspacoInventarioModel, StatusEspacoInventario } from '../../infra/models/EspacoInventario'
import { UsuarioModel } from '../../infra/models/Usuario'
import { EspacoModel } from '../../infra/models/Espaco'

export class RetornarServidoresUsecase {
  private logger = new Logger(RetornarServidoresUsecase.name)

  constructor(
    @InjectRepository(UsuarioModel)
    private usuarioRepository: Repository<UsuarioModel>
  ) {}

  public async execute() {
    const usuarios = await this.usuarioRepository.find({
      where: {
        id: Not(0),
      },
      select: {
        id: true,
        nome: true,
        cargo: {
          id: true,
          nome: true,
        },
      },
      relations: {
        cargo: true,
      },
    })
    return usuarios
  }
}
