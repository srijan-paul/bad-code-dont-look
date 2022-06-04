import Express, { application } from 'express';
import path from 'path';
import pg from 'pg';

const pool = new pg.Pool({
  user: 'me',
  host: 'localhost',
  database: 'student',
  password: 'password',
  port: 5432
})


const app = Express()
app.use('/', Express.static(path.join(__dirname, 'public')))
app.use(Express.json())
app.use(Express.urlencoded({ extended: true }))

interface StudentDetails {
  firstname: string;
  lastname: string;
  email: string;
  regdNo: string;
  branch: string;
}

function tryCall<T>(fn: () => T): [T | undefined, unknown?] {
  try {
    return [fn()]
  } catch (err: unknown) {
    return [, err]
  }
}

async function tryCallAsync<T>(fn: () => Promise<T>): Promise<[T | undefined, unknown?]> {
  try {
    return [await fn()]
  } catch (err: unknown) {
    return [, err]
  }
}

async function runQuery_(query: string, params: string[] = []): Promise<pg.QueryResult<any>> {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (err, result) => {
      if (err) { reject(err); return; }
      resolve(result);
    })
  });
}

async function runQuery(query: string, params: string[] = []) {
  return tryCallAsync(async () => await runQuery_(query, params))
}

app.get("/api/student", async (_, res) => {
  const [result, err] = await runQuery('SELECT * FROM students');
  if (result) return res.status(200).json(result.rows)

  res.status(500);
  res.end();
  throw err;
})

app.patch("/api/student", async (req, res) => {
  console.log(req.body)
  const { name, email, branch, id } = req.body
  const [firstname, lastname] = name.split(' ')
  if (!(firstname && lastname)) return res.status(400).end()

  const query = `UPDATE students
    SET firstname = '${firstname}',
        lastname = '${lastname}',
        email = '${email}',
        branch = '${branch}'
    WHERE id = ${id}`
  console.log(query)

  const [result, err] = await runQuery(query)

  if (!result) {
    res.status(500).end();
    throw err;
  }

  res.status(200)
  res.end()
})

app.get("/api/teacher", async (_, res) => {
  const [result, err] = await runQuery('SELECT * FROM teachers');
  if (result) return res.status(200).json(result.rows)

  res.status(500);
  res.end();
  throw err;
})

app.post('/api/student', async (req, res) => {
  const { firstname, lastname, email, branch } = req.body;
  const insertQuery = `INSERT INTO 
    students (firstname, lastname, email, branch)
    VALUES ('${firstname}', '${lastname}', '${email}', '${branch}')`;
  const [result, err] = await runQuery(insertQuery);
  if (result) return res.status(200);
  res.status(500);
  res.send();
  throw err;
})

app.post('/api/teacher', async (req, res) => {
  const { name, email, subject, phone } = req.body;

  const insertQuery = `INSERT INTO 
    teachers (name, email, subject, phone)
    VALUES ('${name}', '${email}', '${subject}', '${phone}')`;

  const [result, err] = await runQuery(insertQuery);
  if (result) return res.status(200);

  res.status(500);
  res.send();
  throw err;
})

// im sorry
app.post('/api/student-delete', async (req, res) => {
  const { id } = req.body
  const deleteQuery = `DELETE FROM STUDENTS where id = ${id};`
  const [result, err] = await runQuery(deleteQuery)
  if (result) return res.status(200)
  res.status(500)
  res.end();
  throw err
})

app.post('/api/login', async (req, res) => {
  const { name, password } = req.body
  const query = `SELECT * FROM student where username = ${name} AND password = ${password}`
  const [studentData] = await runQuery(query)
  if (studentData) return res.json(studentData)
  res.status(402)
})

app.listen(3000, () => console.log('Listening on port 3000'))
