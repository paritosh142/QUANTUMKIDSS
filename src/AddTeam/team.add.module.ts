import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AddTeam, AddTeamSchema } from './schema/teamAdd.schema';
import { TeamAddController } from './team.add.controller';
import { TeamAddService } from './team.add.service';


@Module({
  imports: [MongooseModule.forFeature([{ name: AddTeam.name, schema: AddTeamSchema }])],
  controllers: [TeamAddController],
  providers: [TeamAddService],
})
export class TeamAddModule {}
