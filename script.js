//Erstemal html elemente holen

const form = document.getElementById("recipe-form");
const list = document.getElementById("recipe-list");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("category-filter");


//vorhandene Daten aus localStorage laden, wenn keine daten, dann starten wir mit leeren Array
let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
let currentIngredients = [];

// mit dieser function kann man neue zutaten mit menge hinzufügen.
//also die daten aus eingabe feld holen
//trim damit die leere zeichen zu löschen
function addIngredient() {
    const name = document.getElementById("ingredient-name").value.trim();
    const amount = document.getElementById("ingredient-amount").value.trim();

//hier wird geprüft, wenn name und amount nicht leer sind, dann werden zu Zutaten liste hinzufügt.
//und danach wird die eingabe Feld leer gemacht.
    if (name && amount) {
        currentIngredients.push({ name, amount });
        updateIngredientListUI();

        document.getElementById("ingredient-name").value = "";
        document.getElementById("ingredient-amount").value = "";
    }
}

// mit dieser function kann man Zutatenliste aktualisieren und neben die zutaten der Button Delete zeigen.
function updateIngredientListUI() {
    const ul = document.getElementById("ingredient-list");
    ul.innerHTML = "";

    currentIngredients.forEach((ingredient, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
      ${ingredient.amount} ${ingredient.name}
      <button type="button" onclick="removeIngredient(${index})">Delete</button>
    `;
        ul.appendChild(li);
    });
}
//man kann die zutaten löschen
function removeIngredient(index) {
    currentIngredients.splice(index, 1);
    updateIngredientListUI();
}
// dieser function wird die daten in localStorage speichern
function saveRecipes() {
    localStorage.setItem("recipes", JSON.stringify(recipes));
}

// dieser function wird alle gespeicherte Rezepte anzeigen, und man kann nach zutaten oder Category suchen.
function renderRecipes() {
    list.innerHTML = "";
    const search = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

// hier gehen wir durch alle gespeicherte Rezepte und dann nur Rezepte zeigen, die zu Suche oder Filter passen
//also es kann nach Titel sein, oder halt nach zutaten
    recipes
        .filter(recipe => {
            const inTitle = recipe.title.toLowerCase().includes(search);
            const inIngredients = Array.isArray(recipe.ingredients)
                ? recipe.ingredients.some(i =>
                    i.name.toLowerCase().includes(search)
                )
                : false;
            const categoryMatch = selectedCategory === "" || recipe.category === selectedCategory;
            return (inTitle || inIngredients) && categoryMatch;
        })
        .forEach((recipe, index) => {
            const div = document.createElement("div");
            div.className = "recipe-card";

            const ingredientItems = Array.isArray(recipe.ingredients)
                ? recipe.ingredients
                    .map(item => `<li>${item.amount} ${item.name}</li>`)
                    .join("")
                : "";
//hier wird beim klick auf Rezept die details angezeigt, und wird auch zwei buttons gezeigt, einmal für bearbeiten, und einmal für löchen
            div.innerHTML = `
        <h3 class="recipe-title" onclick="toggleDetails(this)">
          ${recipe.title} (${recipe.category})
        </h3>
        <div class="recipe-details" style="display: none;">
          <p><strong>Beschreibung:</strong> ${recipe.description}</p>
          <p><strong>Zutaten:</strong></p>
          <ul>${ingredientItems}</ul>
          <p><strong>Zubereitung:</strong> ${recipe.steps}</p>
          <button onclick="editRecipe(${index})">Bearbeiten</button>
          <button onclick="deleteRecipe(${index})">Löschen</button>
        </div>
      `;
            list.appendChild(div);
        });
}
//um gespeicherte Rezepte Details anzuzeigen oder verstecken
function toggleDetails(titleElement) {
    const details = titleElement.nextElementSibling;
    details.style.display = details.style.display === "none" ? "block" : "none";
}

// mit der function kann man die Rezepte bearbeiten
//also man kann title, oder beschreibung oder Zubereitungsschritte oder Kategorie ändern
//und wir benutzen hier form.dataset.edit = index; damit wir die vorhandene Rezept aktualisieren, nicht eine neue hinzufügen
function editRecipe(index) {
    const recipe = recipes[index];

    form.title.value = recipe.title;
    form.description.value = recipe.description;
    form.steps.value = recipe.steps;
    form.category.value = recipe.category;
    form.dataset.edit = index;

    currentIngredients = recipe.ingredients || [];
    updateIngredientListUI();
}
