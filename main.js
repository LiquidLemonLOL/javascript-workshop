// main.js

// 1. Initialize State
let cart = [];

// 2. Select DOM Elements
const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('search-input');
const cartCount = document.getElementById('cart-count');
const categoryFilters = document.querySelectorAll('.category-filter');
const allCheckbox = document.querySelector('.category-filter[value="all"]');

// 3. Render Products Function
function renderProducts(productsToRender) {
    //  Clears the content of product grid
    productGrid.innerHTML = "";
    // no display check, if length equates to falsy
    if (!productsToRender) {
        productGrid.innerText = "<p>No products found.</p>";
        return;
    }
    // builds ALL cards, then inserts only once - might change
    productGrid.innerHTML = productsToRender.map(createProductCard).join("");
}
renderProducts(products);

// hint create card function
function createProductCard(product) {
    return `
        <article
            class="border border-slate-200 rounded-[1.25rem] bg-white p-3 transition-all duration-400 hover:border-blue-400 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 group">
            <!-- Image Container -->
            <div class="relative overflow-hidden rounded-2xl bg-slate-100">
                <img src="${product.image}" alt="${product.name}"
                     class="aspect-[4/5] w-full object-cover group-hover:scale-110 transition-transform duration-700"/>
            </div>

            <!-- Info Details -->
            <div class="mt-4 px-1 pb-2 space-y-1">
                <p class="text-[10px] font-black uppercase tracking-[0.15em] text-blue-600/70">
                    ${product.category}</p>
                <h3 class="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    ${product.name}</h3>
                <p class="text-[11px] font-medium text-slate-500">${product.availability}</p>

                <div class="flex items-center justify-between gap-3 pt-3">
                    <span class="text-lg font-black text-slate-900 tracking-tight">${product.price.toLocaleString(undefined, { style: "currency", currency: "SEK" })}</span>

                    <button type="button" onclick="addToCart(${product.id})"
                            class="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-xs font-bold text-white transition-all duration-300 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 active:scale-95 group/btn"
                            aria-label="Add to cart">
                        Add to cart
                    </button>
                </div>
            </div>
        </article>
    `;
}

// 4. Add to Cart Function
function addToCart(productId) {
    // TODO: Find product by id
    // TODO: Add to cart array
    // TODO: Update cart count UI
    // TODO: Save to localStorage
}

// 5. Update Cart Count UI
function updateCartCount() {
    // TODO: Set textContent of cartCount
    // TODO: Show/hide cartCount based on items
}

// gather all checked categories to filter for
function getCheckedCategories() {
    return [...categoryFilters]
        .filter((checkbox) => checkbox.checked && checkbox.value !== "all")
        .map((checkbox) => checkbox.value)
}

function applyCheckedFilters() {
    const checkedCategories = getCheckedCategories();

    // if nothing selected to filter, revert back to check all categories
    if (!checkedCategories.length) {
        allCheckbox.checked = true;
        renderProducts(products);
        return;
    }

    const filter = products.filter(product => checkedCategories.includes(product.category));
    renderProducts(filter);
}

// 6. Event Listeners
// Search
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        // TODO: Filter products by name or description
    });
}

// Category Filters
categoryFilters.forEach(filter => {
    filter.addEventListener('change', () => {
        // syncing checkboxes (so 'all categories' becomes unchecked after checking specific category or categories
        //if all checkbox is checked, make sure all other checkboxes are false
        if (filter === allCheckbox && allCheckbox.checked) {
            categoryFilters.forEach(checkbox => {
                if (checkbox !== allCheckbox) checkbox.checked = false;
            });
        // if specific category is checked, uncheck 'all categories'
        } else if (filter !== allCheckbox && filter.checked) {
            allCheckbox.checked = false;
        }
        applyCheckedFilters();
    });
});

// 7. Initial Load
document.addEventListener('DOMContentLoaded', () => {
    // TODO: Load cart from localStorage
    // TODO: Update cart count UI
    // TODO: Render all products initially
    renderProducts(products);
});
