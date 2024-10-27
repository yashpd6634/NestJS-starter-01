import { Exclude } from 'class-transformer';
import { User } from 'src/users/users.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity('grouplists')
export class Grouplist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => User, (user) => user.grouplists)
  users: User[];

  @ManyToOne(() => User, (user) => user.ownedGroups, { onDelete: 'CASCADE' })
  owner: User;
}
