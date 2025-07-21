import { User } from 'src/users/users.entity';
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.employee, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
