const STORAGE_KEY = "vjox_items";

function loadItems() {
    return JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
    );
}

function saveItems(items) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(items)
    );
}