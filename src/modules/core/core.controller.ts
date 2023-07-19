import { Body, Controller, Get, Logger, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { ImportarCsvUsecase } from './application/usecases/ImportarCSV.usecase'
import { LerPatrimonioUsecase } from './application/usecases/LerPatrimonio.usecase'
import { RetornarInventariosPendentesUsecase } from './application/usecases/RetornarInventariosPendente.usecase'
import { RetornarSalasInventariosPendentesUsecase } from './application/usecases/RetornarSalasInventariosPendente.usecase'
import { RetornarServidoresUsecase } from './application/usecases/RetornarServidores'
import { TaProntoUsecase } from './application/usecases/TaPronto.usecase'
import { CoreModule } from './core.module'
import { UsuarioModel } from './infra/models/Usuario'

@Controller('core')
@ApiTags('Core Controller')
export class CoreController {
  private logger = new Logger(CoreController.name)

  constructor(
    private readonly importarCsvUsecase: ImportarCsvUsecase,
    private readonly taProntoUsecase: TaProntoUsecase,
    private readonly retornarServidoresUsecase: RetornarServidoresUsecase,
    private readonly retornarInventariosPendentesUsecase: RetornarInventariosPendentesUsecase,
    private readonly retornarSalasInventariosPendentesUsecase: RetornarSalasInventariosPendentesUsecase,
    private readonly lerPatrimonioUsecase: LerPatrimonioUsecase
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
