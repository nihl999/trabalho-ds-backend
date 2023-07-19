import { ImportarCsvUsecase } from './ImportarCSV.usecase'
import { LerPatrimonioUsecase } from './LerPatrimonio.usecase'
import { RetornarServidoresUsecase } from './RetornarServidores'
import { TaProntoUsecase } from './TaPronto.usecase'

export const Usecases = [ImportarCsvUsecase, TaProntoUsecase, RetornarServidoresUsecase, LerPatrimonioUsecase]
