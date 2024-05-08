import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@Entity()
@Tree('materialized-path')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  building: string;

  @Column({ nullable: false })
  location_name: string;

  @Column({ nullable: false, unique: true })
  location_number: string;

  @Column({ nullable: true })
  area: string;

  @TreeChildren()
  children: Location[];

  @Column({ nullable: true })
  parent_id: number;

  @TreeParent()
  parent: Location;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_date: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_date: Date;
}
