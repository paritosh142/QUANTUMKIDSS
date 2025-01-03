import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Form } from './form.schema';

@Entity()
class StudentForm {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  lastName: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  address: string;

  @Column({ type: 'varchar', length: 15, nullable: false })
  mobileNumber: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  gender: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  class: string;

  @CreateDateColumn()
  submittedAt: Date;

  @Column({ type: 'boolean', nullable: false, default: false })
  showFeeReceipt?: boolean;

  @Column({ type: 'varchar', length: 255, nullable: false })
  customId: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  applicantId: string;
}

export default StudentForm;
