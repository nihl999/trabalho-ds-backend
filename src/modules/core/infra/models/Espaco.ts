import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'
import { EspacoInventarioModel } from './EspacoInventario'

@Entity('espaco')
export class EspacoModel {
  @PrimaryColumn()
  id: string

  @Column()
  nome: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @OneToMany((type) => EspacoInventarioModel, (espacoInventario) => espacoInventario.espaco)
  espacosInventario: EspacoInventarioModel[]
}
