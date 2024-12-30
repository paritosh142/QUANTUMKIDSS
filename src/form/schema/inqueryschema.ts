import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
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

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  address: string;

  @Column({ type: 'varchar', length: 15, nullable: false, unique: true })
  mobileNumber: string;

  @Column({type: 'varchar', length: 255, nullable: false})
  gender :string;
  
  @CreateDateColumn()
  submittedAt: Date;

  //foreginkey
  // @ManyToOne(() => Form, (form) => form.studentForms, { nullable: false, onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'formEnqueryId' })
  // form: Form;

  // @Column()
  // enformUuid: string;

  // @Column({type: 'varchar', length: 255, nullable: false})
  // formEnqueryId: string;
}

export default StudentForm;
