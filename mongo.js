import mongoose from 'mongoose'

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://ha66772005:${password}@cluster0.nikmg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const entryScheme = new mongoose.Schema({
  name: String,
  number: String,
})

const Entry = mongoose.model('Entry', entryScheme)

// Create a new entry through command line arguments
const entry = new Entry({
  name: process.argv[3],
  number: process.argv[4],
})

if (process.argv.length === 3) {
  //List all entries in the phonebook if only password is given
  Entry.find({}).then((result) => {
    console.log('Phonebook list:')
    result.forEach((entry) => {
      console.log(`${entry.name} ${entry.number}`)
    })

    mongoose.connection.close()
  })
} else {
  //Save the entry
  entry.save().then(() => {
    console.log(`added ${entry.name} number ${entry.number} to phonebook!`)
    mongoose.connection.close()
  })
}
