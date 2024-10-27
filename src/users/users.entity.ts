import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { UserRole } from './dto/create-user-dto';
import { Grouplist } from 'src/grouplists/grouplists.entity';
import { Exclude } from 'class-transformer';
import { Employee } from 'src/employees/employees.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Intern,
  })
  role: UserRole;

  @Column('date')
  dateOfBirth: Date;

  @Column()
  @Exclude()
  password: string;

  @OneToOne(() => Employee, (employee) => employee.user, {
    onDelete: 'CASCADE',
  })
  employee: Employee;

  @ManyToMany(() => Grouplist, (grouplist) => grouplist.users)
  @JoinTable({
    name: 'user_groups',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'group_id', referencedColumnName: 'id' },
  })
  grouplists: Grouplist[];

  @OneToMany(() => Grouplist, (grouplist) => grouplist.owner)
  ownedGroups: Grouplist[];
}
