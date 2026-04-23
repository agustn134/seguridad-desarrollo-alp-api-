const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.findFirst({ where: { username: 'bbbbbb' } });
  console.log(user);
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
