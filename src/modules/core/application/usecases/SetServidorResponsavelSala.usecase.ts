import { Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { parse } from 'papaparse'
import { Not, Repository } from 'typeorm'
import { PatrimonioModel, TiposCriacaoPatrimonio } from '../../infra/models/Patrimonio'
import { InventarioModel, StatusInventario } from '../../infra/models/Inventario'
import { EspacoInventarioModel, StatusEspacoInventario } from '../../infra/models/EspacoInventario'
import { UsuarioModel } from '../../infra/models/Usuario'
import { EspacoModel } from '../../infra/models/Espaco'

export interface SetServidorResponsavelProps {
  espacoId: string
  inventario: number
  novoResponsavel: number
}

export class SetServidorResponsavelSalaUsecase {
  private logger = new Logger(SetServidorResponsavelSalaUsecase.name)

  constructor(
    @InjectRepository(EspacoInventarioModel)
    private espacoInventarioRepository: Repository<EspacoInventarioModel>
  ) {}

  public async execute(props: SetServidorResponsavelProps) {
    const espacoInventario = await this.espacoInventarioRepository.findOne({
      where: {
        espaco: { id: props.espacoId },
        inventario: { id: props.inventario },
      },
    })
    if (!espacoInventario || espacoInventario == null) return false
    this.espacoInventarioRepository.update(espacoInventario, { responsavel: { id: props.novoResponsavel } })
    this.espacoInventarioRepository.save(espacoInventario)
    return true
  }
}
