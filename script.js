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