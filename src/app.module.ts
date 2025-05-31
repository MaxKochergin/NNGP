import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { SkillsModule } from './modules/skills/skills.module';
import { SpecializationsModule } from './modules/specializations/specializations.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { LearningMaterialsModule } from './modules/learning-materials/learning-materials.module';
import { TestsModule } from './modules/tests/tests.module';
import { AuthModule } from './modules/auth/auth.module';
import { TestAttemptsModule } from './modules/test-attempts/test-attempts.module';

@Module({
  imports: [
    UsersModule,
    RolesModule,
    ProfilesModule,
    SkillsModule,
    SpecializationsModule,
    TestsModule,
    QuestionsModule,
    LearningMaterialsModule,
    AuthModule,
    TestAttemptsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
