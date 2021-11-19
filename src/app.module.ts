import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { KickboardsModule } from './kickboards/kickboards.module';
import { AreaModule } from './area/area.module';
import { CalculatorModule } from './calculator/calculator.module';
import { RegularPolicesModule } from './regular-policies/regular-policies.module';
import { Kickboard } from './kickboards/kickboard.entity';
import { Area } from './area/area.entity';
import { ForbiddenAreaModule } from './forbidden-area/forbidden-area.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
        }),
    }),
    TypeOrmModule.forFeature([Area, Kickboard]),
    AuthModule,
    UsersModule,
    KickboardsModule,
    AreaModule,
    CalculatorModule,
    RegularPolicesModule,
    ForbiddenAreaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
