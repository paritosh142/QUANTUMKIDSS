import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FormModule } from './form/form.module';
// import { LeadModule } from './Lead/lead.module';
import { AdminModule } from './admin/admin.module';
import { BlogModule } from './blog/blog.module';

@Module({
  imports: [
    // LeadModule,
    ConfigModule.forRoot({
      isGlobal: true,

    }),
    MongooseModule.forRoot('mongodb+srv://paritosh142:Password@data.iv962.mongodb.net/?retryWrites=true&w=majority&appName=Data'),
    FormModule,
    AdminModule,
    BlogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

