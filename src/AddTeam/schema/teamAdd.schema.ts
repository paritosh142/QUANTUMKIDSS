// import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
// import { Document } from 'mongoose';
// @Schema()
// export class AddTeam extends Document{
//     @Prop({ required: true, unique: true })
//     uuid: string;
    
//     @Prop()
//     memberName: string;
    
//     @Prop()
//     memberRole: string;

//     @Prop({unique: true})
//     memberEmail: string;

//     @Prop({unique: true})
//     memberMobile: string;

//     @Prop()
//     memberId: string;

//     @Prop()
//     memberDesination: string;

//     @Prop()
//     profilePic :string
// }


// export const AddTeamSchema = SchemaFactory.createForClass(AddTeam);
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AddTeam {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  memberName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  memberRole: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  memberEmail: string;

  @Column({ type: 'varchar', length: 15, nullable: true, unique: true })
  memberMobile: string;

  @Column({ type: 'varchar', length: 255, nullable: true , unique: true})
  memberId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  memberDesination: string;

  @Column({ type: 'text', nullable: true })
  description:string

  @Column({ type: 'varchar', nullable: true })
  profilePic: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  order:string;


}