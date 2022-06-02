import Express from 'express'
import path from 'path'
import pg from 'pg'
import { generateStudentInsertQueries } from './random-gen'

const app = Express()
app.use(Express.json())
app.use(Express.urlencoded({ extended: true }))
app.use(Express.static(path.join(__dirname, '../public')))

// database name: 'student_portal'

const pool = new pg.Pool({
  user: 'me',
  host: 'localhost',
  database: 'student_portal',
  password: 'password',
  port: 5432
})


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

app.get('/api/students', () => {

})

app.listen(3000, async () => {
  // const cmds = generateStudentInsertQueries(10)
  // for (const cmd of cmds) {
  //   const [, err] = await runQuery(cmd)
  //   if (err) {
  //     console.log(cmd)
  //     console.error(err)
  //     break;
  //   }
  // }
})
