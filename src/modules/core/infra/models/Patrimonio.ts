import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { EspacoInventarioModel } from './EspacoInventario'
import { InventarioModel } from './Inventario'
import { UsuarioModel } from './Usuario'

export enum TiposCriacaoPatrimonio {
  IMPORTADO,
  ON_FLY,
}
@Entity('patrimonios')
export class PatrimonioModel {
  @PrimaryColumn()
  numero: number

  @PrimaryColumn()
  espacoInventarioInventarioId: number

  @ManyToOne(() => EspacoInventarioModel, (espacoInventario) => espacoInventario.patrimonios, { cascade: ['insert'] })
  @JoinColumn()
  espacoInventario: EspacoInventarioModel

  @ManyToOne(() => UsuarioModel)
  @JoinColumn()
  responsavel: UsuarioModel

  @Column({ name: 'descricao', type: 'text' })
  descricao: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @Column({ name: 'lido', type: 'boolean', default: false })
  lido: boolean

  @Column({ name: 'data_leitura', nullable: true })
  dataLeitura: Date

  @Column({ name: 'observacao', nullable: true })
  observacao: string

  @Column({ name: 'tipo_criacao', enum: TiposCriacaoPatrimonio })
  tipoCriacao: TiposCriacaoPatrimonio
}
