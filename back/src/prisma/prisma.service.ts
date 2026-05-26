import { Injectable } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from 'generated/prisma/client';

const adapter = new PrismaMariaDb({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'worklog',
});

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      adapter,
    });
  }
}
