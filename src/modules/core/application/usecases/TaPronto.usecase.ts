import { Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { parse } from 'papaparse'
import { Repository } from 'typeorm'
import { PatrimonioModel, TiposCriacaoPatrimonio } from '../../infra/models/Patrimonio'
import { InventarioModel, StatusInventario } from '../../infra/models/Inventario'
import { EspacoInventarioModel, StatusEspacoInventario } from '../../infra/models/EspacoInventario'
import { UsuarioModel } from '../../infra/models/Usuario'
import { EspacoModel } from '../../infra/models/Espaco'

export interface TaProntoProps {
  idSolicitacao: string
}

export class TaProntoUsecase {
  private logger = new Logger(TaProntoUsecase.name)

  constructor(
    @InjectRepository(InventarioModel)
    private inventarioRepository: Repository<InventarioModel>
  ) {}

  public async execute(props: TaProntoProps) {
    const inventario = await this.inventarioRepository.findOneBy({
      idSolicitacao: props.idSolicitacao,
    })
    if (inventario == null) return true
    if (inventario.status !== StatusInventario.EM_IMPORTACAO) return true
    return false
  }
}
