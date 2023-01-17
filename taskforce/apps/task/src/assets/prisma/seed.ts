import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fillDb() {
  await prisma.category.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Ремонт компьютеров',
      tasks: {
        create: [
        {
          title: 'Нужно отремонтировать ПК',
          userId: '10',
          description: 'Сломался',
          status: 'New',
        },
        {
          title: 'Сгорел ПК',
          userId: '12',
          description: 'Сгорел',
          status: 'New',
        },
        ],
      },
    },
  });
  console.info('🤘️ Database was filled')
}

fillDb()
  .then(async () => await prisma.$disconnect())
  .catch(async (err) => {
    const error = err as Error;
    console.error(error.message, error.stack);
    await prisma.$disconnect();

    process.exit(1);
  });
