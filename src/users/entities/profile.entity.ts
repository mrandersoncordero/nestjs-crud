import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_profile')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ nullable: true })
  age: number;
}
