import { PrismaClient } from '../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb({
  host: 'mysql',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'worklog',
});
const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log('🌱 Seeding database...');

  // Справочник видов работ
  const workTypes = [
    { name: 'Кладка перегородок' },
    { name: 'Монтаж опалубки' },
    { name: 'Армирование стен' },
    { name: 'Заливка бетона' },
    { name: 'Укладка кирпича' },
    { name: 'Штукатурка стен' },
    { name: 'Монтаж перекрытий' },
    { name: 'Утепление фасада' },
    { name: 'Кровельные работы' },
    { name: 'Электромонтаж' },
  ];

  for (const workType of workTypes) {
    await prisma.workType.upsert({
      where: { name: workType.name },
      update: {},
      create: workType,
    });
  }
  console.log(`✅ Added ${workTypes.length} work types`);
  console.log('🎉 Seeding completed!');
}

main()
  .catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
