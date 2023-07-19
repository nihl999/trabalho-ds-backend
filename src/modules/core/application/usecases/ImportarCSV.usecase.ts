import { Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { parse } from 'papaparse'
import { Repository } from 'typeorm'
import { PatrimonioModel, TiposCriacaoPatrimonio } from '../../infra/models/Patrimonio'
import { InventarioModel, StatusInventario } from '../../infra/models/Inventario'
import { EspacoInventarioModel, StatusEspacoInventario } from '../../infra/models/EspacoInventario'
import { UsuarioModel } from '../../infra/models/Usuario'
import { EspacoModel } from '../../infra/models/Espaco'

export interface ImportarCsvProps {
  csv: Express.Multer.File
  idSolicitacao: string
}

export interface LinhaCSV {
  numero: number
  descricao: string
  cargaAtual: string
  sala: string
}

export class ImportarCsvUsecase {
  private logger = new Logger(ImportarCsvUsecase.name)

  constructor(
    @InjectRepository(PatrimonioModel)
    private patrimonioRepository: Repository<PatrimonioModel>,
    @InjectRepository(InventarioModel)
    private inventarioRepository: Repository<InventarioModel>,
    @InjectRepository(UsuarioModel)
    private usuarioRepository: Repository<UsuarioModel>,
    @InjectRepository(EspacoModel)
    private espacoRepository: Repository<EspacoModel>,
    @InjectRepository(EspacoInventarioModel)
    private espacoInventarioRepository: Repository<EspacoInventarioModel>
  ) {}

  transformaCamelCase(header) {
    const reg = /[-_ ]\w/g
    return header.toLowerCase().replace(reg, (match, index) => match.charAt(1).toUpperCase())
  }
  public async execute(props: ImportarCsvProps) {
    this.logger.log('Iniciando usecase de IMPORTAR CSV')
    const csv = await parse<LinhaCSV>(props.csv.buffer.toString(), {
      header: true,
      skipEmptyLines: true,
      transformHeader: this.transformaCamelCase,
    })

    const inventario = this.inventarioRepository.create({
      status: StatusInventario.EM_IMPORTACAO,
      responsavel: {
        id: 0,
      },
      idSolicitacao: props.idSolicitacao,
    })
    await this.inventarioRepository.save(inventario)

    const usuariosCache: UsuarioModel[] = []
    const salasCache: EspacoModel[] = []

    csv.data.pop()
    for (const linha of csv.data) {
      const espacoSplit = linha.sala.split('-')
      if (espacoSplit.length == 0) {
        this.logger.error('PUTA Q PARIU')
        continue
      }
      const espacoId = espacoSplit[0] || 'espaço sem nome'
      const espacoNome = espacoSplit.slice(1).join('-')
      //   this.logger.debug(espacoNome)
      let sala
      //   sala = salasCache.find((sala) => sala.id == espacoId)
      if (!sala) {
        sala = await this.espacoRepository.findOneBy({
          id: espacoId,
        })
        // if (sala) salasCache.push(sala)
      }
      if (!sala) {
        this.logger.verbose('NOME DO ESPAÇO')

        sala = await this.espacoRepository.create({
          nome: espacoNome,
          id: espacoId,
        })
        await this.espacoRepository.save(sala)
        // salasCache.push(sala)
      }

      let usuario
      //   usuario = usuariosCache.find((usuario) => usuario.nome == linha.cargaAtual)
      //   this.logger.verbose('NOME DO SERVIDOR')
      //   this.logger.debug(linha.cargaAtual)
      if (!usuario) {
        usuario = await this.usuarioRepository.findOneBy({
          nome: linha.cargaAtual,
        })
        // if (usuario) usuariosCache.push(usuario)
      }
      if (!usuario) {
        this.logger.error('PUTA Q PARIU')

        usuario = await this.usuarioRepository.create({
          nome: linha.cargaAtual,
          cargo: {
            id: 1,
          },
        })
        await this.usuarioRepository.save(usuario)
        // usuariosCache.push(usuario)
      }

      let espacoInventario
      if (!espacoInventario) {
        espacoInventario = await this.espacoInventarioRepository.findOneBy({
          espacoId: espacoId,
          inventarioId: inventario.id,
        })
      }
      if (!espacoInventario) {
        espacoInventario = this.espacoInventarioRepository.create({
          espaco: sala,
          inventario: inventario,
          responsavel: usuario,
          status: StatusEspacoInventario.PENDENTE_INICIO,
          patrimoniosLidos: 0,
          quantidadePatrimonios: 0,
        })
      }
      const patrimonio = await this.patrimonioRepository.create({
        numero: linha.numero,
        descricao: linha.descricao,
        espacoInventario: {
          ...espacoInventario,
          quantidadePatrimonios: espacoInventario.quantidadePatrimonios + 1,
        },
        lido: false,
        responsavel: usuario,
        tipoCriacao: TiposCriacaoPatrimonio.IMPORTADO,
      })

      await this.patrimonioRepository.save(patrimonio)
    }
    inventario.status = StatusInventario.PENDENTE_INICIO
    await this.inventarioRepository.save(inventario)
  }
}
