import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FormModule } from './form/form.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,

    }),
    MongooseModule.forRoot('mongodb+srv://paritosh142:Password@data.iv962.mongodb.net/?retryWrites=true&w=majority&appName=Data'),
    FormModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

