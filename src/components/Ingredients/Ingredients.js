import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from './../UI/ErrorModal';

import Search from './Search';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

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
    setIsLoading(true);
    fetch('https://react-hooks-ef995.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        setIsLoading(false);
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
    setIsLoading(true);
    fetch(
      `https://react-hooks-ef995.firebaseio.com/ingredients/${ingredient}.jon`,
      {
        method: 'DELETE'
      }
    )
      .then(() => {
        setIsLoading(false);
        setUserIngredients(prevIngredients => {
          console.log('prevIngredients', prevIngredients);
          const auxArray = prevIngredients.filter(value => {
            console.log('filter value', value);
            console.log('ingredient', ingredient);
            return value.id !== ingredient;
          });
          console.log(auxArray);
          return auxArray;
        });
      })
      .catch(err => {
        setError('Something went wrong');
      });
  };

  const clearError = () => {
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}

      <IngredientForm
        onAddingIngredient={addIngredientHandler}
        loading={isLoading}
      />

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
