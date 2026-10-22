// main.js

// 1. Initialize State
const cart = loadCart();

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
    // find product by id, if not exit
    const targetProduct = products.find(product => product.id === productId);
    if (!targetProduct) {return;}

    // add to cart array
    cart.push(targetProduct);

    //save to localstorage
    saveCart();
    // update cart count
    updateCartCount()
    showCartToast(`${targetProduct.name} added to shopping cart`);
}

// 5. Update Cart Count UI
function updateCartCount() {
    // set textcontent of cartcount, show only if items are there
    if (cartCount) {
        cartCount.textContent = cart.length;
        console.log(cartCount.textContent);
    }
}

function loadCart() {
    try {
        // get saved cart
        const savedCart = localStorage.getItem("cart");
        // if saved cart is found, parse it, else create empty array
        const parsedCart = savedCart ? JSON.parse(savedCart) : [];
        // return parsed, saved cart if found, otherwise return empty array
        return Array.isArray(parsedCart) ? parsedCart : [];
    } catch (e) {
        console.warn("Could not initialize cart: ", e)
        // double fail check, returns empty array if error found
        return [];
    }
}

function saveCart() {
    try {
        localStorage.setItem("cart", JSON.stringify(cart));
    } catch (e) {
        console.warn("Could not save cart", e);
    }
}

function showCartToast(message) {
    // create/show toast on add/delete
    const cartToast = document.createElement("div");
    cartToast.textContent = message;
    cartToast.setAttribute("role", "status");
    cartToast.className = "fixed bottom-6 right-6 z-100 rounded-xl bg-slate-500 px-5 py-3 text-m font-semibold" +
        " text-white shadow-lg opacity-0 translate-y-2 transition-all duration-500";

    document.body.appendChild(cartToast);

    //fade in
    requestAnimationFrame(() => {
        cartToast.classList.remove("opacity-0", "translate-y-2");
    })

    //fade out + remove
    setTimeout(() => {
        cartToast.classList.add("opacity-0", "translate-y-2");
        setTimeout(() => cartToast.remove(), 300);
    }, 3000);
}

// gather all checked categories to filter for
function getCheckedCategories() {
    return [...categoryFilters]
        .filter((checkbox) => checkbox.checked && checkbox.value !== "all")
        .map((checkbox) => checkbox.value)
}

// applies both category filters and search input filters for them to work in unison
function applyAllFilters() {
    const checkedCategories = getCheckedCategories();
    const searchQuery = searchInput.value.trim().toLowerCase();

    //combined filter
    const filter = products.filter(product => {

        //filter by category first, if nothing checked (all categories checked auto) match all
        const categoryFilter = checkedCategories.length === 0 || checkedCategories.includes(product.category);

        //filter by search query, if empty match all - description not included in products.js setup, added in case
        const queryFilter =
            searchQuery === "" ||
            product.name.toLowerCase().includes(searchQuery) ||
            (product.description || "").toLowerCase().includes(searchQuery);

        //return what is matched by both filters
        return categoryFilter && queryFilter;
        });
    renderProducts(filter);
}

// 6. Event Listeners
// Search
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        applyAllFilters()
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
        // if no checked categories to filter, revert back to check all
        if (getCheckedCategories().length === 0) {
            allCheckbox.checked = true;
        }

        applyAllFilters();
    });
});

// 7. Initial Load
document.addEventListener('DOMContentLoaded', () => {
    // load cart from local storage
    loadCart();
    // update cart count
    updateCartCount();
    // render all products
    renderProducts(products);
});
