import { prisma } from '@/lib/prisma.js';

async function main() {
  // ✅ Fetch existing users
  const users = await prisma.user.findMany();
  if (users.length === 0) {
    throw new Error("No users found in the database. Please add users before seeding.");
  }

  const user = users[0]; // pick the first available user

  // ✅ Create Courses
  const [course1, course2, course3] = await Promise.all([
    prisma.course.create({ data: { title: 'Intro to AI', code: 'AI101' } }),
    prisma.course.create({ data: { title: 'Web Dev Advanced', code: 'WEB202' } }),
    prisma.course.create({ data: { title: 'Data Structures', code: 'DS303' } }),
  ]);

  // ✅ Create Groups
  const group1 = await prisma.contantGroup.create({
    data: {
      title: 'Week 1',
      description: 'Getting Started',
      courseId: course1.id,
    },
  });

  const subGroup = await prisma.contantGroup.create({
    data: {
      title: 'Tutorials',
      description: 'Hands-on Practice',
      courseId: course1.id,
      parentGroupId: group1.id,
    },
  });

  // ✅ Create Materials
  const createdMaterials = await prisma.material.createMany({
    data: [
      {
        title: 'Lecture Notes',
        description: 'Intro lecture',
        fileUrl: '/files/lecture1.pdf',
        type: 'PDF',
        courseId: course1.id,
        groupId: group1.id,
      },
      {
        title: 'Lecture Video',
        fileUrl: '/videos/intro.mp4',
        type: 'VIDEO',
        courseId: course1.id,
        groupId: group1.id,
      },
      {
        title: 'Reference Link',
        fileUrl: 'https://example.com',
        type: 'LINK',
        courseId: course1.id,
      },
      {
        title: 'Project Files',
        fileUrl: '/files/project.zip',
        type: 'ZIP',
        courseId: course2.id,
      },
      {
        title: 'API Guide',
        fileUrl: '/files/api-guide.docx',
        type: 'DOCX',
        courseId: course2.id,
        groupId: subGroup.id,
      },
      {
        title: 'Image Asset',
        fileUrl: '/images/sample.png',
        type: 'IMAGE',
        courseId: course3.id,
      },
      {
        title: 'Dataset CSV',
        fileUrl: '/data/sample.csv',
        type: 'CSV',
        courseId: course3.id,
      },
      {
        title: 'Audio Lecture',
        fileUrl: '/audio/lecture.mp3',
        type: 'AUDIO',
        courseId: course3.id,
      },
      {
        title: 'Homework PDF',
        fileUrl: '/homework/hw1.pdf',
        type: 'PDF',
        courseId: course2.id,
      },
      {
        title: 'Slide Deck',
        fileUrl: '/slides/week1.ppt',
        type: 'PPT',
        courseId: course1.id,
      },
    ],
  });

  // ✅ Fetch created materials to use their IDs
  const materials = await prisma.material.findMany({ take: 5 });

  // ✅ Add views and favorites for 5 materials
  for (const mat of materials) {
    await prisma.materialView.create({
      data: {
        userId: user.clerkId,
        materialId: mat.id,
      },
    });

    await prisma.favoriteMaterial.create({
      data: {
        userId: user.clerkId,
        materialId: mat.id,
      },
    });
  }

  console.log('✅ Seed complete using existing user:', user.clerkId);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });