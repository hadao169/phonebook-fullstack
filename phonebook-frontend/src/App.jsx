import { useState, useEffect } from "react";
import personService from "./services/persons.js";

const PersonForm = ({
  onAddName,
  onNameChange,
  onNumberChange,
  newName,
  newNumber,
}) => {
  return (
    <form onSubmit={onAddName} className="form">
      <div>
        name: <input value={newName} onChange={onNameChange} required />
      </div>
      <div>
        number: <input value={newNumber} onChange={onNumberChange} required />
      </div>
      <div>
        <button type="submit" className="addBtn">
          add
        </button>
      </div>
    </form>
  );
};

const Persons = ({ persons, onDelete }) => {
  return (
    <div>
      {persons.map((person) => {
        return (
          <div key={person.id}>
            {person.name} {person.number}
            <button className="deleteBtn" onClick={() => onDelete(person.id)}>
              Delete
            </button>
          </div>
        );
      })}
    </div>
  );
};

const Filter = ({ searchTerm, onSearch }) => {
  return (
    <div>
      Filter shown with{": "}
      <input value={searchTerm} onChange={onSearch} />
    </div>
  );
};

const Notification = ({ error, message }) => {
  if (!message) {
    return null;
  }
  return <div className={error ? "error" : "notification"}>{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    personService
      .getAll()
      .then((initialPersons) => {
        setPersons(initialPersons);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setNewNumber(e.target.value);
  };

  const handleSearchNameChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddName = (event) => {
    event.preventDefault();

    const newContact = {
      name: newName,
      number: newNumber,
      id: (persons.length + 1).toString(),
    };

    if (!isDuplicate(persons)) {
      personService
        .create(newContact)
        .then((returnedContact) => {
          setPersons(persons.concat(returnedContact));
          setMessage(`Added ${newContact.name}`);
          setTimeout(() => {
            setMessage("");
          }, 4000);
          setNewName("");
          setNewNumber("");
        })
        .catch((err) => {
          console.log("Errors occurred", err);
        });
    } else {
      const changedPerson = persons.find((person) => person.name === newName);
      if (
        window.confirm(
          `${changedPerson.name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        if (changedPerson) {
          const updatedPerson = { ...changedPerson, number: newNumber };

          personService
            .update(changedPerson.id, updatedPerson)
            .then((returnedContact) => {
              setPersons(
                persons.map((person) =>
                  person.id !== returnedContact.id ? person : returnedContact
                )
              );
              setMessage(
                `${updatedPerson.name}'s phonenumber has been changed!`
              );
              setTimeout(() => {
                setMessage("");
              }, 4000);
              setNewName("");
              setNewNumber("");
            })
            .catch((err) => {
              console.log("Errors occurred", err);
            });
        }
      }
    }
  };

  const isDuplicate = (persons) => {
    for (var i = 0; i < persons.length; i++) {
      if (persons[i].name === newName) {
        return true;
      }
    }
    return false;
  };

  // => Should use 'some' method
  // const isDuplicate = (persons, name) => {
  //   return persons.some((person) => person.name === name);
  // };

  const handleDeleteContact = (id) => {
    const contactRemoved = persons.find((person) => person.id === id);
    if (window.confirm(`Delete ${contactRemoved.name}`)) {
      personService

        .deletes(id)
        .then(() => {
          // Update state by filtering out the deleted contact
          setPersons(persons.filter((person) => person.id !== id));
          setError(true);
          setMessage(
            `${contactRemoved.name} has been deleted from the server!`
          );
          setTimeout(() => {
            setMessage("");
            setError(false);
          }, 4000);
        })
        .catch((err) => {
          console.error("Error deleting contact:", err);
        });
    }
  };

  //handle "filter by name" logic which is case insensitivity
  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} error={error} />
      <Filter searchTerm={searchTerm} onSearch={handleSearchNameChange} />
      <h2>Add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        onNameChange={handleNameChange}
        onNumberChange={handlePhoneNumberChange}
        onAddName={handleAddName}
      />
      <h2>Number</h2>
      <Persons persons={filteredPersons} onDelete={handleDeleteContact} />
    </div>
  );
};
export default App;
