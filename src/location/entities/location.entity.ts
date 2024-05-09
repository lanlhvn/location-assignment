import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
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
  children?: Location[];

  @Column({ nullable: true })
  parent_id: number;

  @TreeParent()
  parent?: Location;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_date: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_date: Date;
}
