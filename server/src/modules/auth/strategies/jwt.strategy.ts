import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'секретный_ключ',
    });
  }

  async validate(payload: any) {
    // Получаем роли пользователя
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId: payload.sub },
      include: { role: true },
    });

    const roles = userRoles.map((ur) => ur.role.name);

    return {
      id: payload.sub,
      email: payload.email,
      roles,
    };
  }
}
