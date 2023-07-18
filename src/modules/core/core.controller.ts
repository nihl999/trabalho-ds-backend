import { Body, Controller, Get, Logger, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { ImportarCsvUsecase } from './application/usecases/ImportarCSV.usecase'
import { TaProntoUsecase } from './application/usecases/TaPronto.usecase'
import { CoreModule } from './core.module'

@Controller('core')
@ApiTags('Core Controller')
export class CoreController {
  private logger = new Logger(CoreController.name)

  constructor(
    private readonly importarCsvUsecase: ImportarCsvUsecase,
    private readonly taProntoUsecase: TaProntoUsecase
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
}
