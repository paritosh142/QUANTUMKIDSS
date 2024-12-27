// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { ConfigModule } from '@nestjs/config';
// import { MongooseModule } from '@nestjs/mongoose';
// import { FormModule } from './form/form.module';
// // import { LeadModule } from './Lead/lead.module';
// import { AdminModule } from './admin/admin.module';
// import { TeamAddModule } from './AddTeam/team.add.module';
// import { TypeOrmModule } from '@nestjs/typeorm';

// @Module({
//   imports: [
//     // LeadModule,
//     ConfigModule.forRoot({
//       isGlobal: true,

//     }),
//     // MongooseModule.forRoot('mongodb+srv://paritosh142:Password@data.iv962.mongodb.net/?retryWrites=true&w=majority&appName=Data'),
//     // FormModule,
//     // AdminModule,
//     // TeamAddModule
//     TypeOrmModule.forRoot({
//       type: 'mysql',
//       host: 'localhost', 
//       port: 3306, 
//       username: 'gAuravnegi',
//       password: 'gAuravnegi', 
//       database: 'Quantum', 
//       autoLoadEntities: true,
//       synchronize: true,
//     }),
//     FormModule,
//     AdminModule,
//     TeamAddModule,
  
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { FormModule } from './form/form.module';
import { AdminModule } from './admin/admin.module';
import { TeamAddModule } from './AddTeam/team.add.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Form } from './form/schema/form.schema';
import { AddTeam } from './AddTeam/schema/teamAdd.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // MongooseModule.forRoot('mongodb://localhost:27017/quantum'),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'gAuravnegi',
      database: 'quantum',
      entities: [Form, __dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
    }),
    FormModule,
    // AdminModule,
    TeamAddModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}