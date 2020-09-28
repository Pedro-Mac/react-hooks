import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  useEffect(() => {
    console.log('Rendering ingredients', userIngredients);
  }, [userIngredients]); // this will run only when userIngredients changed!!!

  const handleFilteredIngredients = useCallback(
    filteredIngredients => {
      setUserIngredients(filteredIngredients);
    },
    [] /*if we pass an empty array, is as if we used ComponentDidMount*/
  );

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
        <Search onLoadIngredients={handleFilteredIngredients} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
