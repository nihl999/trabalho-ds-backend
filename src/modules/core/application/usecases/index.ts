import { ImportarCsvUsecase } from './ImportarCSV.usecase'
import { LerPatrimonioUsecase } from './LerPatrimonio.usecase'
import { RetornarInventariosPendentesUsecase } from './RetornarInventariosPendente.usecase'
import { RetornarSalasInventariosPendentesUsecase } from './RetornarSalasInventariosPendente.usecase'
import { RetornarServidoresUsecase } from './RetornarServidores'
import { SetServidorResponsavelSalaUsecase } from './SetServidorResponsavelSala.usecase'
import { TaProntoUsecase } from './TaPronto.usecase'

export const Usecases = [
  ImportarCsvUsecase,
  TaProntoUsecase,
  RetornarServidoresUsecase,
  LerPatrimonioUsecase,
  RetornarInventariosPendentesUsecase,
  RetornarSalasInventariosPendentesUsecase,
  SetServidorResponsavelSalaUsecase,
]
