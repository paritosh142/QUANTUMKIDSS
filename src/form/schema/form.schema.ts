import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Form {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  lastName: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  address: string;

  @Column({ type: 'varchar', length: 15, nullable: false, unique: true })
  mobileNumber: string;

  @Column({ type: 'enum', enum: ['Admission', 'Fee', 'Curriculum/Program', 'Other'], nullable: false })
  category: string;

  @CreateDateColumn()
  submittedAt: Date;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  customId: string;

  @Column({
    type: 'enum',
    enum: ['raw', 'interested', 'FollowUp', 'visitScheduled', 'converted', 'notInterested',"formFilled","admitted"],
    default: 'raw',
  })
  status: string;
}