import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
@Schema()
export class AddTeam extends Document{
    @Prop({ required: true, unique: true })
    uuid: string;
    
    @Prop()
    memberName: string;
    
    @Prop()
    memberRole: string;

    @Prop({unique: true})
    memberEmail: string;

    @Prop({unique: true})
    memberMobile: string;

    @Prop()
    memberId: string;

    @Prop()
    memberDesination: string;

    @Prop()
    profilePic :string
}


export const AddTeamSchema = SchemaFactory.createForClass(AddTeam);