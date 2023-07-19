import { Body, Controller, Get, Logger, Param, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { ImportarCsvUsecase } from './application/usecases/ImportarCSV.usecase'
import { IniciarInventarioUsecase } from './application/usecases/IniciarInventario.usecase'
import { LerPatrimonioUsecase } from './application/usecases/LerPatrimonio.usecase'
import { RetornarInventariosIniciadosUsecase } from './application/usecases/RetornarInventariosIniciados.usecase'
import { RetornarInventariosPendentesUsecase } from './application/usecases/RetornarInventariosPendente.usecase'
import { RetornarSalasInventariosPendentesUsecase } from './application/usecases/RetornarSalasInventariosPendente.usecase'
import { RetornarServidoresUsecase } from './application/usecases/RetornarServidores'
import {
  SetServidorResponsavelProps,
  SetServidorResponsavelSalaUsecase,
} from './application/usecases/SetServidorResponsavelSala.usecase'
import { TaProntoUsecase } from './application/usecases/TaPronto.usecase'
import { CoreModule } from './core.module'
import { UsuarioModel } from './infra/models/Usuario'
import { RetornarSalasInventariosServidorUsecase } from './application/usecases/RetornarSalasInventariosServidor.usecase'
import { RetornarPatrimonioSalaUsecase } from './application/usecases/RetornaPatrimonioSala.usecase'
import { RetornarAdminUsecase } from './application/usecases/RetornarAdmin.usecase'

@Controller('core')
@ApiTags('Core Controller')
export class CoreController {
  private logger = new Logger(CoreController.name)

  constructor(
    private readonly importarCsvUsecase: ImportarCsvUsecase,
    private readonly taProntoUsecase: TaProntoUsecase,
    private readonly retornarServidoresUsecase: RetornarServidoresUsecase,
    private readonly retornarAdminUsecase: RetornarAdminUsecase,
    private readonly retornarInventariosPendentesUsecase: RetornarInventariosPendentesUsecase,
    private readonly retornarSalasInventariosPendentesUsecase: RetornarSalasInventariosPendentesUsecase,
    private readonly retornarInventariosIniciadosUsecase: RetornarInventariosIniciadosUsecase,
    private readonly lerPatrimonioUsecase: LerPatrimonioUsecase,
    private readonly iniciarInventarioUsecase: IniciarInventarioUsecase,
    private readonly setServidorResponsavelSala: SetServidorResponsavelSalaUsecase,
    private readonly retornarSalasInventariosServidorUsecase: RetornarSalasInventariosServidorUsecase,
    private readonly retornarPatrimonioSala: RetornarPatrimonioSalaUsecase
  ) {}

  @Post('importar-csv')
  @UseInterceptors(FileInterceptor('file'))
  public async importarCSV(@UploadedFile() csv: Express.Multer.File, @Res() response: Response) {
    try {
      const idSolicitacao = `${new Date().getTime()}`
      this.importarCsvUsecase.execute({ csv, idSolicitacao })
      return response.status(202).json({ message: idSolicitacao })
    } catch (e) {
      return response.status(500).json(e)
    }
  }

  @Get('ta-pronto')
  public async taPronto(@Query() query, @Res() response: Response) {
    const resposta = await this.taProntoUsecase.execute(query)
    return response.status(200).json({ message: resposta })
  }

  @Get('retornar-servidores')
  public async retornarServidores(@Query() query, @Res() response: Response) {
    const resposta = await this.retornarServidoresUsecase.execute()
    return response.status(200).json({ message: resposta })
  }

  @Get('retornar-admin')
  public async retornarAdmin(@Query() query, @Res() response: Response) {
    const resposta = await this.retornarAdminUsecase.execute()
    return response.status(200).json({ message: resposta })
  }

  @Get('retornar-inventarios-pendentes')
  public async retornarInventariosPendentes(@Res() response: Response) {
    const resposta = await this.retornarInventariosPendentesUsecase.execute()
    return response.status(200).json({ message: resposta })
  }

  @Get('retornar-salas-inventarios-pendentes')
  public async retornarSalasInventariosPendentes(@Res() response: Response) {
    const resposta = await this.retornarSalasInventariosPendentesUsecase.execute()
    return response.status(200).json({ message: resposta })
  }

  @Get('retornar-salas-inventarios-servidor/:idServidor')
  public async retornarSalasInventariosServidor(@Param() params: { idServidor: number }, @Res() response: Response) {
    const resposta = await this.retornarSalasInventariosServidorUsecase.execute(params)
    return response.status(200).json({ message: resposta })
  }

  @Get('retornar-inventarios-iniciados')
  public async retornarSalasInventariosIniciados(@Res() response: Response) {
    const resposta = await this.retornarInventariosIniciadosUsecase.execute()
    return response.status(200).json({ message: resposta })
  }

  @Get('retorna-patrimonio-sala/:idSala')
  public async retornaPatrimonioSala(@Param() params: { idSala: string }, @Res() response: Response) {
    const resposta = await this.retornarPatrimonioSala.execute(params.idSala)
    return response.status(200).json({ message: resposta })
  }

  @Post('/set-responsavel-sala')
  public async setResponsavelSala(@Body() body: SetServidorResponsavelProps, @Res() response: Response) {
    const resposta = await this.setServidorResponsavelSala.execute(body)
    return response.status(200).json({ message: resposta })
  }

  @Post('/iniciar-inventario')
  public async iniciarInventario(@Res() response: Response) {
    const resposta = await this.iniciarInventarioUsecase.execute()
    return response.status(200).json({ message: resposta })
  }

  @Get('ler-patrimonio')
  public async lerPatrimonio(
    @Body()
    body: {
      servidor: UsuarioModel
      espaco: string
      inventario: number
      numero: number
    },
    @Res() response: Response
  ) {
    const resposta = await this.lerPatrimonioUsecase.execute(body)
    return response.status(200).json({ message: resposta })
  }
}
