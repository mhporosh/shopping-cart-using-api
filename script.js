const productList = document.getElementById("product-list");
const cartPanel = document.getElementById("cart-panel");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");

let cart = [];

// Fetch products API
async function fetchProducts() {
    try {
        const response = await fetch("https://fakestoreapi.com/products");
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error("Failed to fetch products:", error);
    }
}

function displayProducts(products) {
    products.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.className = "product";
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>${product.description.substring(0, 50)}...</p>
            <p><strong>$${product.price.toFixed(2)}</strong></p>
            <button onclick="addToCart(${product.id}, '${product.title}', ${product.price}, '${product.image}')">Add to Cart</button>
        `;
        productList.appendChild(productCard);
    });
}

function addToCart(id, name, price, image) {
    const existingItem = cart.find((item) => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }
    updateCartUI();
}

function updateCartUI() {
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item) => {
        total += item.price * item.quantity;
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
    <div>
        <p>${item.name}</p>
        <p>$${item.price.toFixed(2)}</p>
    </div>
    <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, this.value)">
    <button onclick="removeFromCart(${item.id})">
        <i class="fas fa-trash"></i>
    </button>
`;

        cartItems.appendChild(cartItem);
    });

    cartCount.textContent = cart.length;
    cartTotal.textContent = total.toFixed(2);
}

function updateQuantity(id, quantity) {
    const item = cart.find((item) => item.id === id);
    if (item) {
        item.quantity = Math.max(1, parseInt(quantity));
        updateCartUI();
    }
}

function removeFromCart(id) {
    cart = cart.filter((item) => item.id !== id);
    updateCartUI();
}

function clearCart() {
    cart = [];
    updateCartUI();
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
    } else {
        alert("Thank you for your purchase!");
        clearCart();
    }
}

function toggleCart() {
    cartPanel.classList.toggle("visible");
}

// Initialize the app
fetchProducts();
