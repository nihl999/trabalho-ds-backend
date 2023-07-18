import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { UsuarioModel } from './Usuario'

@Entity('cargo')
export class CargoModel {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  nome: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @OneToMany((type) => UsuarioModel, (usuarioModel) => usuarioModel.cargo)
  usuarios: UsuarioModel[]
}
