import React, {
  /*useState,*/ useReducer,
  useState,
  useEffect,
  useCallback
} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from './../UI/ErrorModal';

import Search from './Search';

// !!! THIS IS NOT RELATED TO REDUX, BUT TO REACT USEREDUCER  !!!
const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should not get there');
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  // const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    console.log('Rendering ingredients', userIngredients);
  }, [userIngredients]); // this will run only when userIngredients changed!!!

  const handleFilteredIngredients = useCallback(
    filteredIngredients => {
      // setUserIngredients(filteredIngredients);
      dispatch({ type: 'SET', ingredients: filteredIngredients });
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
        //   setUserIngredients(prevIngredients => [
        //     ...prevIngredients,
        //     { id: data.name, ...ingredient }
        //   ]);
        dispatch({ type: 'ADD', ingredient: { id: data.name, ...ingredient } });
      });
  };

  const removeIngredientHandler = ingredient => {
    setIsLoading(true);
    fetch(
      `https://react-hooks-ef995.firebaseio.com/ingredients/${ingredient}.json`,
      {
        method: 'DELETE'
      }
    )
      .then(() => {
        setIsLoading(false);
        // setUserIngredients(prevIngredients => {
        //   const auxArray = prevIngredients.filter(value => {
        //     return value.id !== ingredient;
        //   });

        //   return auxArray;
        // });
        dispatch({ type: 'DELETE', id: ingredient });
      })
      .catch(err => {
        setError('Something went wrong');
        setIsLoading(false);
      });
  };

  const clearError = () => {
    setError(null);
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
