const productList = document.getElementById("product-list");
const cartPanel = document.getElementById("cart-panel");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const promoInput = document.getElementById("promoCodeInput"); // Updated ID for input
const promoMessage = document.getElementById("promoMessage"); // Updated ID for message
const cartSummary = document.getElementById("cart-summary");

let cart = [];
let appliedPromoCode = null; // To track the currently applied promo code

const promoCodes = {
  ostad10: 10, // 10% discount
  ostad5: 5,   // 5% discount
};

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

// Display products on the page
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

// Add item to the cart
function addToCart(id, name, price, image) {
  const existingItem = cart.find((item) => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id, name, price, image, quantity: 1 });
  }
  updateCartUI();
}

// Update the cart UI
function updateCartUI() {
  cartItems.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item) => {
    subtotal += item.price * item.quantity;
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

  const discount = appliedPromoCode ? (subtotal * promoCodes[appliedPromoCode]) / 100 : 0;
  const finalTotal = subtotal - discount;

  cartCount.textContent = cart.length;
  cartTotal.textContent = finalTotal.toFixed(2);

  // Update cart summary
  cartSummary.innerHTML = `
    <p>Subtotal: $${subtotal.toFixed(2)}</p>
    <p>Discount: -$${discount.toFixed(2)} (${appliedPromoCode ? promoCodes[appliedPromoCode] + "%" : "No Discount"})</p>
    <p><strong>Final Total: $${finalTotal.toFixed(2)}</strong></p>
  `;

  // Reset promo message if cart is updated
  if (cart.length === 0) {
    appliedPromoCode = null;
    promoMessage.textContent = "";
  }
}

// Update quantity of a cart item
function updateQuantity(id, quantity) {
  const item = cart.find((item) => item.id === id);
  if (item) {
    item.quantity = Math.max(1, parseInt(quantity));
    updateCartUI();
  }
}

// Remove item from the cart
function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  updateCartUI();
}

// Clear the cart
function clearCart() {
  cart = [];
  appliedPromoCode = null; // Reset promo code
  promoMessage.textContent = ""; // Clear promo message
  updateCartUI();
}

// Checkout the cart
function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
  } else {
    alert("Thank you for your purchase!");
    clearCart();
  }
}

// Toggle cart visibility
function toggleCart() {
  cartPanel.classList.toggle("visible");
}

// Apply promo code
function applyPromoCode() {
  const enteredCode = promoInput.value.trim();

  if (promoCodes[enteredCode] && enteredCode !== appliedPromoCode) {
    appliedPromoCode = enteredCode; // Apply the promo code
    promoMessage.textContent = `Promo code "${enteredCode}" applied successfully!`;
    promoMessage.classList.add("success");
    promoMessage.classList.remove("error");
  } else if (enteredCode === appliedPromoCode) {
    promoMessage.textContent = "Promo code already applied!";
    promoMessage.classList.add("error");
    promoMessage.classList.remove("success");
  } else {
    appliedPromoCode = null; // Reset promo code if invalid
    promoMessage.textContent = "Invalid promo code. Please try again.";
    promoMessage.classList.add("error");
    promoMessage.classList.remove("success");
  }

  updateCartUI(); // Update the cart UI with the discount
}

// Initialize the app
fetchProducts();
