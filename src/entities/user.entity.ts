import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum UserGender {
  MALE = 'male',
  FEMALE = 'female',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'username', unique: true })
  @Index('IDX_USER_USERNAME', { unique: true })
  username: string;

  @Column({ name: 'user_email', unique: true })
  @Index('IDX_USER_EMAIL', { unique: true })
  userEmail: string;

  @Column({ name: 'user_password' })
  userPassword: string;

  @Column({
    type: 'enum',
    enum: UserGender,
    nullable: true
  })
  gender?: UserGender;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}