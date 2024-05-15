document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector("#search-input");
    const searchCloseIcon = document.querySelector("#search-close-icon");
    const sortWrapper = document.querySelector(".sort-wrapper");

    if (!searchInput || !searchCloseIcon || !sortWrapper) {
        console.error("One or more elements are missing in the DOM.");
        return;
    }

    searchInput.addEventListener("input", () => handleInputChange(searchInput));
    searchCloseIcon.addEventListener("click", handleSearchCloseClick);
    sortWrapper.addEventListener("click", handleSortIconClick);
});

function handleInputChange(searchInput) {
    const inputValue = searchInput.value.trim();

    const searchCloseIcon = document.querySelector("#search-close-icon");
    if (!searchCloseIcon) {
        console.error("Search close icon not found.");
        return;
    }

    if (inputValue !== "") {
        searchCloseIcon.classList.add("search-close-icon-visible");
    } else {
        searchCloseIcon.classList.remove("search-close-icon-visible");
    }
}

function handleSearchCloseClick() {
    const searchInput = document.querySelector("#search-input");
    const searchCloseIcon = document.querySelector("#search-close-icon");

    if (!searchInput || !searchCloseIcon) {
        console.error("Search input or close icon not found.");
        return;
    }

    searchInput.value = "";
    searchCloseIcon.classList.remove("search-close-icon-visible");
}

function handleSortIconClick() {
    const filterWrapper = document.querySelector(".filter-wrapper");
    const body = document.querySelector("body");

    if (!filterWrapper || !body) {
        console.error("Filter wrapper or body not found.");
        return;
    }

    filterWrapper.classList.toggle("filter-wrapper-open");
    body.classList.toggle("filter-wrapper-overlay");
}
