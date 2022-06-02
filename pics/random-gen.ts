import { faker } from '@faker-js/faker'

function generateStudentInsertQuery() {
  const name = faker.name.findName().replace('\'', '')
  const email = faker.internet.email()
  const sic = '190310' + Math.floor(Math.random() * 100).toFixed(0).toString()
  const sex = ['M', 'F'][Math.floor(Math.random() * 2)]
  const branch = ['CSE', 'ECE', 'EEE', 'EIE'][Math.floor(Math.random() * 4)]
  const semester = 1 + Math.floor(Math.random() * 8)

  return `INSERT INTO student (name, email, semester, sic, branch, sex)
  VALUES ('${name}', '${email}', ${semester}, '${sic}', '${branch}', '${sex}');`
}

export function generateStudentInsertQueries(n: number) {
  const queries = []
  for (let i = 0; i < n; ++i) {
    queries.push(generateStudentInsertQuery())
  }
  return queries
}

console.log(generateStudentInsertQueries(10))

/* 
CREATE TABLE student (
  Id serial primary key,
  name varchar (60),
  email varchar(30),
  semester integer,
  sic varchar(10),
  branch varchar(3),
sex varchar(1));
*/