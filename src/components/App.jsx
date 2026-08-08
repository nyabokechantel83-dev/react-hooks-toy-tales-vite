import React, { useEffect, useState } from "react";

import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [toys, setToys] = useState([]);

  function handleClick() {
    setShowForm((showForm) => !showForm);
  }

  // GET all toys
  useEffect(() => {
    fetch("http://localhost:3000/toys")
      .then((response) => response.json())
      .then((data) => setToys(data));
  }, []);

  // POST a new toy
  function handleAddToy(newToy) {
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newToy),
    })
      .then((response) => response.json())
      .then((toy) => {
        setToys((currentToys) => [...currentToys, toy]);
      });
  }

  // PATCH - like a toy
  function handleLike(id) {
    const toy = toys.find((toy) => toy.id === id);

    fetch(`http://localhost:3000/toys/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        likes: toy.likes + 1,
      }),
    })
      .then((response) => response.json())
      .then((updatedToy) => {
        setToys((currentToys) =>
          currentToys.map((toy) =>
            toy.id === updatedToy.id ? updatedToy : toy
          )
        );
      });
  }

  // DELETE - donate a toy
  function handleDelete(id) {
    fetch(`http://localhost:3000/toys/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        setToys((currentToys) =>
          currentToys.filter((toy) => toy.id !== id)
        );
      });
  }

  return (
    <>
      <Header />

      {showForm ? <ToyForm onAddToy={handleAddToy} /> : null}

      <div className="buttonContainer">
        <button onClick={handleClick}>Add a Toy</button>
      </div>

      <ToyContainer
        toys={toys}
        onLike={handleLike}
        onDelete={handleDelete}
      />
    </>
  );
}

export default App;