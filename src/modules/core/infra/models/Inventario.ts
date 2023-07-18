import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { EspacoInventarioModel } from './EspacoInventario'
import { UsuarioModel } from './Usuario'
import { PatrimonioModel } from './Patrimonio'

export enum StatusInventario {
  EM_IMPORTACAO,
  PENDENTE_INICIO,
  INICIADO,
  COMPLETO,
}
@Entity('inventario')
export class InventarioModel {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  idSolicitacao: string

  @ManyToOne((type) => UsuarioModel, (usuarioModel) => usuarioModel.inventarios)
  @JoinColumn()
  responsavel: UsuarioModel

  @OneToMany((type) => EspacoInventarioModel, (espacoInventario) => espacoInventario.inventario)
  espacosInventario: EspacoInventarioModel[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @Column({ name: 'status', type: 'enum', enum: StatusInventario })
  status: StatusInventario
}
