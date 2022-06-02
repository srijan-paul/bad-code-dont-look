import express from 'express'
import cors from 'cors'
import path from 'path'

const app = express()
app.use(cors({ credentials: true, origin: true }))

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
})

app.get('/1', (req, res) => {
  let basicSalary = req.query['basic_salary']
  if (typeof basicSalary !== 'string') basicSalary = '0'
  const salary = parseInt(basicSalary)

  const dra = 0.6 * salary
  const hra = 0.15 * salary
  const gross = salary + hra + dra

  res.send({ dra, hra, gross })
})

app.get('/2', (req, res) => {
  let { a, b, op } = req.query
  if (typeof a !== 'string') a = '0'
  if (typeof b !== 'string') b = '0'
  if (typeof op !== 'string') op = '+'

  const n1 = parseInt(a)
  const n2 = parseInt(b)

  let result = n1 + n2
  if (op === '-') result = n1 - n2
  else if (op === '*') result = n2 * n2
  else if (op === '/') result = n2 / n2

  res.send(result.toString())
})

app.get('/3', (req, res) => {
  let { month } = req.query
  if (typeof month !== 'string') month = 'Jan'
  const nDays: Record<any, number> = {
    Jan: 31,
    Feb: 28,
    Mar: 31,
    Apr: 30,
    May: 31,
    Jun: 30,
    Jul: 31,
    Aug: 31,
    Sep: 30,
    Oct: 31,
    Nov: 30,
    Dec: 31
  }
  res.send(nDays[month].toString())
})

app.listen(3000, () => console.log('listening...'))
