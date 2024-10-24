import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from './dto/create-user-dto';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Intern,
  })
  role: UserRole;

  @Column('date')
  dateOfBirth: Date;
}
