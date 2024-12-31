import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { FormModule } from './form/form.module';
import { AdminModule } from './admin/admin.module';
import { TeamAddModule } from './AddTeam/team.add.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './admin/schema/admin.schema';
import { BlogModule } from './blog/blog.module';
import { Blog } from './blog/schema/blog.schema';
import { NewsEventModule } from './news_events/news_events.module';
import { PictureGalleryModule } from './picture_gallery/picture_gallery.module';
import { NewsEvent } from './news_events/schema/news_events.entity';
import { Picture } from './picture_gallery/schema/picture_gallery.entity';
import { Form } from './form/schema/form.schema';
import { AddTeam } from './AddTeam/schema/teamAdd.schema';
import StudentForm from './form/schema/inqueryschema';
import FeeManagement from './form/schema/feeManagement';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Password@0000',
      database: 'quantum',
      entities: [Form,FeeManagement,StudentForm,AddTeam,Admin,Blog,NewsEvent,Picture, __dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    FormModule,
    AdminModule,
    BlogModule,
    NewsEventModule,
    PictureGalleryModule,
    TeamAddModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}