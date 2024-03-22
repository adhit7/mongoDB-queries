//1. Find all the topics and tasks which are thought in the month of October
db.topics.find({
  $expr: {
    $and: [
      {
        $gte: [
          { $dateFromString: { dateString: '$topicDate' } },
          new Date('2023-10-01 00:00:00'),
        ],
      },
      {
        $lte: [
          { $dateFromString: { dateString: '$topicDate' } },
          new Date('2023-10-31 23:59:59'),
        ],
      },
    ],
  },
});

//2. Find all the company drives which appeared between 15 oct-2023 and 31-oct-2023
db.companydrives.find({
  $expr: {
    $and: [
      {
        $gte: [
          { $dateFromString: { dateString: '$driveDate' } },
          new Date('2023-10-15 00:00:00'),
        ],
      },
      {
        $lte: [
          { $dateFromString: { dateString: '$driveDate' } },
          new Date('2023-10-31 23:59:59'),
        ],
      },
    ],
  },
});

//3.Find all the company drives and students who are appeared for the placement.
db.companydrives.find({ attended: { $eq: true } });

//4.Find the number of problems solved by the user in codekata
db.codekata.aggregate([
  {
    $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: 'userId',
      as: 'student',
    },
  },
  {
    $project: {
      _id: 0,
      userid: 1,
      problems: 1,
      student: 1,
    },
  },
]);

//5. Find all the mentors with who has the mentee's count more than 15
db.mentors.find({
  $expr: {
    $gt: [
      {
        $size: '$studentsId',
      },
      15,
    ],
  },
});

//6. Find the number of users who are absent and task is not submitted  between 15 oct-2020 and 31-oct-2020
db.attendance.aggregate([
  {
    $match: {
      $expr: {
        $and: [
          {
            $gte: [
              { $dateFromString: { dateString: '$topicDate' } },
              new Date('2023-10-15 00:00:00'),
            ],
          },
          {
            $lte: [
              { $dateFromString: { dateString: '$topicDate' } },
              new Date('2023-10-31 23:59:59'),
            ],
          },
          { status: false },
        ],
      },
    },
  },
  {
    $lookup: {
      from: 'tasks',
      localField: 'topicId',
      foreignField: 'topicId',
      as: 'tasks',
    },
  },

  { $match: { 'tasks.completedTask': false } },
  {
    $count: 'Total absentees',
  },
]);
