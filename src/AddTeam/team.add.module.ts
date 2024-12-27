import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddTeam } from './schema/teamAdd.schema';
import { TeamAddController } from './team.add.controller';
import { TeamAddService } from './team.add.service';


@Module({
  imports: [TypeOrmModule.forFeature([AddTeam])],
  providers: [TeamAddService],
  controllers: [TeamAddController],
})
export class TeamAddModule {}