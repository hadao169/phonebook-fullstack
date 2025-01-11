import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import 'dotenv/config'
// Connect to environment variables
import Entry from './models/entry.js'

const app = express()

// Enable JSON parsing and CORS
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
// handler of requests with errors
const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
// // handler of requests with unknown endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// Define morgan custom token
morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})
// Use morgan with the custom token
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

// Routes
app.get('/api/persons', (req, res, next) => {
  Entry.find({})
    .then((phonebooks) => {
      res.json(phonebooks)
    })
    .catch((error) => next(error))
})

app.get('/info', (req, res) => {
  const date = new Date()
  Entry.countDocuments({}).then((countDocuments) => {
    res.send(`
      <p>Phonebook has info for ${countDocuments} entries.</p>
      <p>${date}</p>
    `)
  })
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'Name or number is missing',
    })
  }

  const newEntry = new Entry({
    name: body.name,
    number: body.number,
  })

  newEntry
    .save()
    .then((savedEntry) => {
      res.json(savedEntry)
    })
    .catch((err) => {
      next(err)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Entry.findById(id)
    .then((entry) => {
      res.json(entry)
    })
    .catch((err) => {
      next(err)
    })
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body
  const id = req.params.id

  Entry.findByIdAndUpdate(
    id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedEntry) => {
      res.json(updatedEntry)
    })
    .catch((err) => {
      next(err)
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
  Entry.findByIdAndDelete({ _id: req.params.id })
    .then((entry) => {
      res.status(204).json(entry)
    })
    .catch((err) => {
      next(err)
    })
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
