import { Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { parse } from 'papaparse'
import { Not, Repository } from 'typeorm'
import { PatrimonioModel, TipoLeituraPatrimonio, TiposCriacaoPatrimonio } from '../../infra/models/Patrimonio'
import { InventarioModel, StatusInventario } from '../../infra/models/Inventario'
import { EspacoInventarioModel, StatusEspacoInventario } from '../../infra/models/EspacoInventario'
import { UsuarioModel } from '../../infra/models/Usuario'
import { EspacoModel } from '../../infra/models/Espaco'

export interface LerPatrimonioProps {
  numero: number
  espaco: string
  inventario: number
}
export class LerPatrimonioUsecase {
  private logger = new Logger(LerPatrimonioUsecase.name)

  constructor(
    @InjectRepository(PatrimonioModel)
    private patrimonioRepository: Repository<PatrimonioModel>,
    @InjectRepository(EspacoInventarioModel)
    private espacoInventarioRepository: Repository<EspacoInventarioModel>
  ) {}

  public async execute(props: LerPatrimonioProps) {
    const patrimonio = await this.patrimonioRepository.findOne({
      where: {
        numero: props.numero,
        espacoInventarioInventarioId: props.inventario,
      },
      relations: {
        espacoInventario: true,
      },
    })
    if (!patrimonio) {
      const espacoInventario = await this.espacoInventarioRepository.findOne({
        where: {
          espaco: { id: props.espaco },
          inventario: { id: props.inventario },
        },
      })
      espacoInventario.patrimoniosLidos += 1
      const patrimonioInstante = this.patrimonioRepository.create({
        numero: props.numero,
        espacoInventario: espacoInventario,
        tipoCriacao: TiposCriacaoPatrimonio.ON_FLY,
        lido: true,
        dataLeitura: new Date(),
        responsavel: { id: 0 },
        descricao: `PATRIMONIO NÃO EXISTENTE, CRIADO ON FLY DURANTE INVENTÁRIO, PRESENTE NO ESPACO ID: ${props.espaco}`,
      })
      const patri = await this.patrimonioRepository.save(patrimonioInstante)
      return {
        patrimonio: patri,
        status: TipoLeituraPatrimonio.ERRO,
      }
    }
    if (patrimonio && patrimonio.espacoInventario.espacoId != props.espaco) {
      const patri = this.patrimonioRepository.merge(patrimonio, {
        lido: true,
        dataLeitura: new Date(),
        observacao: 'OBJETO NA SALA ERRADA',
      })
      const patriSalvo = await this.patrimonioRepository.save(patri)
      return {
        patrimonio: patriSalvo,
        status: TipoLeituraPatrimonio.OBSERVACAO,
      }
    }
    const espacoInventario = await this.espacoInventarioRepository.findOne({
      where: {
        espaco: { id: props.espaco },
        inventario: { id: props.inventario },
      },
    })
    espacoInventario.patrimoniosLidos += 1
    const patri = this.patrimonioRepository.merge(patrimonio, {
      lido: true,
      dataLeitura: new Date(),
    })
    const patriSalvo = await this.patrimonioRepository.save(patri)
    return {
      patrimonio: patriSalvo,
      status: TipoLeituraPatrimonio.CERTO,
    }
  }
}
