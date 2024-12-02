import { useEffect, useState } from "react";
import "./Recipe.css";

const Recipe = () => {
    const [meals, setMeals] = useState([]);
    const [input, setInput] = useState("Chicken");
    const [error, setError] = useState(null);
    const [selectedMeal, setSelectedMeal] = useState(null);

    useEffect(() => {
        async function fetchMeal() {
            try {
                if (!input.trim()) return;
                let res = await fetch(
                    `https://www.themealdb.com/api/json/v1/1/search.php?s=${input}`
                );

                if (!res.ok) {
                    throw new Error("Nothing found");
                }

                let data = await res.json();
                if (data.meals) {
                    setMeals(data.meals);
                    setError(null);
                } else {
                    setMeals([]);
                    setError("No meals found for this search term");
                }
            } catch (err) {
                setError(err.message);
                setMeals([]);
            }
        }

        fetchMeal();
    }, [input]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            setInput(input.trim());
        }
    };

    const handleMealClick = (meal) => {
        setSelectedMeal(meal);
    };

    const closeModal = () => {
        setSelectedMeal(null);
    };

    return (
        <div className="main_Container">
            <nav className="navbar">
                <div className="logo">
                    <img
                        src="https://imgs.search.brave.com/CUg1nzwzmRt-AdZC_-V32UOUS6E6EkIgE-9lnGLdvS4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9wbmdp/bWcuY29tL3VwbG9h/ZHMvY2hlZi9jaGVm/X1BORzEzNC5wbmc"
                        alt="chef's hat toque"
                    />
                </div>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={input}
                        placeholder="Search meal..."
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button type="submit">Search</button>
                </form>
            </nav>

            {error && <p className="error">{error}</p>}

            <div className="mealsContainer">
                {meals.length > 0 ? (
                    meals.map((meal) => (
                        <div className="meal" key={meal.idMeal} onClick={() => handleMealClick(meal)}>
                            <img src={meal.strMealThumb} alt={meal.strMeal} />
                            <h3>{meal.strMeal}</h3>
                        </div>
                    ))
                ) : (
                    !error && <p className="defaultMessage">Search for a meal to see results.</p>
                )}
            </div>


            {selectedMeal && (
                <div className="modal" onClick={closeModal}>
                    <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                        <button className="closeBtn" onClick={closeModal}>X</button>
                        <h2>{selectedMeal.strMeal}</h2>
                        <img src={selectedMeal.strMealThumb} alt={selectedMeal.strMeal} />
                        <p><strong>Category:</strong> {selectedMeal.strCategory}</p>
                        <p><strong>Area:</strong> {selectedMeal.strArea}</p>
                        <p><strong>Instructions:</strong> {selectedMeal.strInstructions}</p>
                        <h4>Ingredients:</h4>
                        <ul>
                            {Array.from({ length: 20 }, (_, index) => index + 1)
                                .map((num) => selectedMeal[`strIngredient${num}`])
                                .filter((ingredient) => ingredient)
                                .map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Recipe;
