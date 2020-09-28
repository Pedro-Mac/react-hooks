import React, { useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  const addIngredientHandler = ingredient => {
    fetch('https://react-hooks-ef995.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        console.log(res);
        return res.json();
      })
      .then(data => {
        setUserIngredients(prevIngredients => [
          ...prevIngredients,
          { id: data.name, ...ingredient }
        ]);
      });
  };

  const removeIngredientHandler = ingredient => {
    setUserIngredients(prevIngredients => {
      const auxArray = prevIngredients.filter(value => {
        return value.id !== ingredient;
      });
      return auxArray;
    });
  };

  return (
    <div className="App">
      <IngredientForm onAddingIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
