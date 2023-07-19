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
export class RetornarInventariosServidoresUsecase {
  private logger = new Logger(RetornarInventariosServidoresUsecase.name)

  constructor(
    @InjectRepository(UsuarioModel)
    private usuarioRepository: Repository<UsuarioModel>,
    @InjectRepository(EspacoInventarioModel)
    private espacoInventarioRepository: Repository<EspacoInventarioModel>,
    @InjectRepository(InventarioModel)
    private inventarioRepository: Repository<InventarioModel>
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
