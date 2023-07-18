import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'
import { EspacoModel } from './Espaco'
import { InventarioModel } from './Inventario'
import { PatrimonioModel } from './Patrimonio'
import { UsuarioModel } from './Usuario'

export enum StatusEspacoInventario {
  PENDENTE_INICIO,
  INICIADO,
  COMPLETO,
}

@Entity('espaco_inventario')
export class EspacoInventarioModel {
  @PrimaryColumn()
  espacoId: string

  @PrimaryColumn()
  inventarioId: number

  @ManyToOne(() => InventarioModel, (inventario) => inventario.espacosInventario)
  @JoinColumn()
  inventario: InventarioModel

  @ManyToOne(() => UsuarioModel, (responsavel) => responsavel.espacosInventario)
  @JoinColumn()
  responsavel: UsuarioModel

  @Column({ name: 'quantidade_patrimonios', type: 'integer' })
  quantidadePatrimonios: number

  @Column({ name: 'patrimonios_lidos', type: 'integer' })
  patrimoniosLidos: number

  @Column({ name: 'status', type: 'enum', enum: StatusEspacoInventario })
  status: StatusEspacoInventario

  @ManyToOne((type) => EspacoModel, (espacoModel) => espacoModel.espacosInventario)
  @JoinColumn()
  espaco: EspacoModel

  @OneToMany((type) => PatrimonioModel, (patrimonio) => patrimonio.espacoInventario)
  @JoinColumn()
  patrimonios: PatrimonioModel[]
}
