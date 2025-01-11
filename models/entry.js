<<<<<<< HEAD
import mongoose from "mongoose";

mongoose.set("strictQuery", false);
const url = process.env.MONGODB_URI;
console.log("connecting to ", url);
mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.err("connection failed ", err.message);
  });
=======
import mongoose from 'mongoose'

mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI
console.log('connecting to ', url)
mongoose
  .connect(url)
  .then((result) => {
    console.log('connected to MongoDB')
  })
  .catch((err) => {
    console.log('connection failed ', err.message)
  })
>>>>>>> 8944bc1aeaadc4ba1b583b49d79d6546a71922a8

// entryScheme is a document which is an instance of
const entryScheme = new mongoose.Schema({
  name: { type: String, minLength: 3, required: true },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function (v) {
<<<<<<< HEAD
        return /^\d{2,3}-\d+$/.test(v);
=======
        return /^\d{2,3}-\d+$/.test(v)
>>>>>>> 8944bc1aeaadc4ba1b583b49d79d6546a71922a8
      },
    },
    message: (props) => `${props.value} is not a valid phone number!`,
    required: true,
  },
<<<<<<< HEAD
});

entryScheme.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Entry = mongoose.model("Entry", entryScheme);
export default Entry;
=======
})

entryScheme.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Entry = mongoose.model('Entry', entryScheme)
export default Entry
>>>>>>> 8944bc1aeaadc4ba1b583b49d79d6546a71922a8
