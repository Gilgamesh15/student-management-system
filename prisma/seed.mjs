import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seeding...");

  // Clear existing data
  console.log("🧹 Cleaning up existing data...");
  await prisma.$transaction([
    prisma.attendance.deleteMany(),
    prisma.assignment.deleteMany(),
    prisma.courseEnrollment.deleteMany(),
    prisma.course.deleteMany(),
    prisma.subject.deleteMany(),
    prisma.teacher.deleteMany(),
    prisma.student.deleteMany(),
  ]);
  console.log("✨ Database cleaned");

  // Generate Subjects (same as before)
  console.log("📚 Creating subjects...");
  const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English Literature",
    "History",
    "Computer Science",
    "Art",
    "Music",
    "Physical Education",
  ];

  const createdSubjects = await prisma.subject.createMany({
    data: subjects.map((subject) => ({
      name: subject,
      description: faker.lorem.paragraph(),
    })),
  });
  console.log(`✅ Created ${subjects.length} subjects`);

  // Get created subjects for reference
  const subjectRecords = await prisma.subject.findMany();

  // Generate Teachers (batched)
  console.log("👩‍🏫 Creating teachers...");
  const teacherData = Array.from({ length: 25 }, () => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
  }));

  const createdTeachers = await prisma.teacher.createMany({
    data: teacherData,
  });

  // Get created teachers for reference
  const teachers = await prisma.teacher.findMany();

  // Connect teachers to subjects (batch operation)
  for (const teacher of teachers) {
    await prisma.teacher.update({
      where: { id: teacher.id },
      data: {
        subjects: {
          connect: [
            {
              id: subjectRecords[
                faker.number.int({ min: 0, max: subjects.length - 1 })
              ].id,
            },
            {
              id: subjectRecords[
                faker.number.int({ min: 0, max: subjects.length - 1 })
              ].id,
            },
          ],
        },
      },
    });
  }
  console.log(`✅ Created ${teachers.length} teachers`);

  // Generate Students (batched)
  console.log("👨‍🎓 Creating students...");
  const studentData = Array.from({ length: 500 }, () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    return {
      firstName,
      lastName,
      email: faker.internet.email({ firstName, lastName }),
      dateOfBirth: faker.date.between({ from: "2005-01-01", to: "2008-12-31" }),
      grade: faker.number.int({ min: 9, max: 12 }),
    };
  });

  await prisma.student.createMany({
    data: studentData,
  });
  console.log("✅ Created all students");

  // Get created students for reference
  const students = await prisma.student.findMany();

  // Generate Courses (batched)
  console.log("📅 Creating courses...");
  const courseData = [];
  const semesters = ["Fall", "Spring"];
  const years = [2023, 2024];

  for (const subject of subjectRecords) {
    for (const year of years) {
      for (const semester of semesters) {
        const sectionsCount = faker.number.int({ min: 2, max: 3 });
        for (let section = 1; section <= sectionsCount; section++) {
          courseData.push({
            name: `${subject.name} ${section}`,
            subjectId: subject.id,
            teacherId:
              teachers[faker.number.int({ min: 0, max: teachers.length - 1 })]
                .id,
            semester,
            year,
          });
        }
      }
    }
  }

  await prisma.course.createMany({
    data: courseData,
  });
  console.log(`✅ Created ${courseData.length} courses`);

  // Get created courses for reference
  const courses = await prisma.course.findMany();

  // Generate Course Enrollments (batched)
  console.log("📝 Creating course enrollments...");
  const enrollmentData = [];

  for (const student of students) {
    const numCourses = faker.number.int({ min: 4, max: 6 });
    const studentCourses = faker.helpers.arrayElements(courses, numCourses);

    for (const course of studentCourses) {
      enrollmentData.push({
        studentId: student.id,
        courseId: course.id,
        grade: faker.number.float({ min: 60, max: 100, fractionDigits: 1 }),
      });
    }
  }

  await prisma.courseEnrollment.createMany({
    data: enrollmentData,
  });
  console.log(`✅ Created ${enrollmentData.length} enrollments`);

  // Generate Assignments (batched)
  console.log("📚 Creating assignments...");
  const assignmentData = [];
  const assignmentTitles = [
    "Quiz",
    "Homework",
    "Project",
    "Essay",
    "Presentation",
    "Lab Report",
  ];

  const enrollments = await prisma.courseEnrollment.findMany();

  for (const enrollment of enrollments) {
    const numAssignments = faker.number.int({ min: 5, max: 8 });

    for (let i = 0; i < numAssignments; i++) {
      assignmentData.push({
        title: `${faker.helpers.arrayElement(assignmentTitles)} ${i + 1}`,
        description: faker.lorem.paragraph(),
        dueDate: faker.date.future(),
        courseId: enrollment.courseId,
        studentId: enrollment.studentId,
        score: faker.number.float({ min: 60, max: 100, fractionDigits: 1 }),
      });
    }
  }

  // Split assignment creation into chunks to avoid memory issues
  const chunkSize = 1000;
  for (let i = 0; i < assignmentData.length; i += chunkSize) {
    const chunk = assignmentData.slice(i, i + chunkSize);
    await prisma.assignment.createMany({
      data: chunk,
    });
    console.log(
      `   Created ${Math.min(
        i + chunkSize,
        assignmentData.length
      )} assignments out of ${assignmentData.length}...`
    );
  }

  // Generate Attendance (batched)
  console.log("📊 Creating attendance records...");
  const attendanceData = [];
  const pastDates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date;
  }).filter((date) => date.getDay() !== 0 && date.getDay() !== 6); // Exclude weekends

  for (const student of students) {
    for (const date of pastDates) {
      attendanceData.push({
        studentId: student.id,
        date,
        present: faker.number.float() < 0.9,
      });
    }
  }

  // Split attendance creation into chunks
  for (let i = 0; i < attendanceData.length; i += chunkSize) {
    const chunk = attendanceData.slice(i, i + chunkSize);
    await prisma.attendance.createMany({
      data: chunk,
    });
    console.log(
      `   Created ${Math.min(
        i + chunkSize,
        attendanceData.length
      )} attendance records out of ${attendanceData.length}...`
    );
  }

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    console.error("Error details:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("👋 Database connection closed");
  });
