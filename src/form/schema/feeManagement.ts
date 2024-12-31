import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class FeeManagement {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  lastName: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 15, nullable: false })
  mobileNumber: string;

  @Column({ type: 'varchar', length: 255, nullable: false, default: '0' })
  firstInstallment?: string;

  @Column({ type: 'varchar', length: 255, nullable: false, default: '0' })
  secondInstallment?: string;

  @Column({ type: 'varchar', length: 255, nullable: false, default: '0' })
  thirdInstallment?: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  customId: string;
}

export default FeeManagement;