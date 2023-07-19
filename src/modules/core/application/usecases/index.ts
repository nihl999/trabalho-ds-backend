import { ImportarCsvUsecase } from './ImportarCSV.usecase'
import { IniciarInventarioUsecase } from './IniciarInventario.usecase'
import { LerPatrimonioUsecase } from './LerPatrimonio.usecase'
import { RetornarPatrimonioSalaUsecase } from './RetornaPatrimonioSala.usecase'
import { RetornarInventariosIniciadosUsecase } from './RetornarInventariosIniciados.usecase'
import { RetornarInventariosPendentesUsecase } from './RetornarInventariosPendente.usecase'
import { RetornarSalasInventariosPendentesUsecase } from './RetornarSalasInventariosPendente.usecase'
import { RetornarSalasInventariosServidorUsecase } from './RetornarSalasInventariosServidor.usecase'
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
  IniciarInventarioUsecase,
  RetornarInventariosPendentesUsecase,
  RetornarInventariosIniciadosUsecase,
  RetornarSalasInventariosServidorUsecase,
  RetornarPatrimonioSalaUsecase,
]
