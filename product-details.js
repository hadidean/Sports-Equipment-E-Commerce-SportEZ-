
// Get product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get("id"));

// Find the product in JSON data
const product = products.find(p => p.id === productId);

// Render product details with quantity input, price calculation, size selection if needed
const productDetails = document.getElementById("product-details");
if (product) {
  let sizeOptions = '';
  if (product.category === "Activewear") {
    sizeOptions = ` 
      <label for="size">Size:</label>
      <select id="size">
        <option value="S">Small</option>
        <option value="M">Medium</option>
        <option value="L">Large</option>
        <option value="XL">Extra Large</option>
      </select>
    `;
  } else if (product.category === "SportShoes") {
    sizeOptions = ` 
      <label for="size">Size:</label>
      <select id="size">
        <option value="7.5">7.5</option>
        <option value="8">8</option>
        <option value="8.5">8.5</option>
        <option value="9">9</option>
      </select>
    `;
  }

  productDetails.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h1>${product.name}</h1>
    <p>${product.description}</p>
    <p>Price: RM <span id="product-price">${product.price.toFixed(2)}</span></p>
    <p>Halal-certified: ${product.halal ? "Yes" : "No"}</p>
    <p>Sustainability: ${product.sustainability}</p>
    <label for="quantity">Quantity:</label>
    <input type="number" id="quantity" value="1" min="1" style="width: 50px; margin-left: 10px;">
    ${sizeOptions}
    <button onclick="storeItemToCart()">Add to Cart</button>
  `;
}

// Function to calculate total price based on quantity
function updatePrice() {
  const quantity = parseInt(document.getElementById("quantity").value);
  const price = product.price;
  const totalPrice = (price * quantity).toFixed(2);
  document.getElementById("product-price").textContent = totalPrice;
}

// Event listener for quantity input to update price
document.getElementById("quantity").addEventListener("input", updatePrice);

// Function to store the item in the cart
function storeItemToCart() {
  const quantityInput = document.getElementById("quantity");
  if (!quantityInput) {
    alert("Quantity input not found.");
    return;
  }

  const quantity = parseInt(quantityInput.value);
  if (quantity < 1) {
    alert("Quantity must be at least 1");
    return;
  }

  const selectedSize = document.getElementById("size") ? document.getElementById("size").value : null;

  if (!product) {
    alert("Product data is missing.");
    return;
  }

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingItem = cart.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ id: product.id, quantity: quantity});
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  alert("Item added to cart successfully!");
  window.location.href = "checkout.html";
}

// Render stars for product rating
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  let starsHtml = "";
  
  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    starsHtml += "★";
  }

  // Add half star if any
  if (halfStar) {
    starsHtml += "☆";
  }

  // Add empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += "☆";
  }

  return starsHtml;
}

// Render reviews
const reviewsList = document.getElementById("reviews-list");
if (product.reviews && product.reviews.length > 0) {
  product.reviews.forEach(review => {
    reviewsList.innerHTML += `
      <div class="review">
        <p><strong>Rating:</strong> ${renderStars(review.rating)}</p>
        <p><strong>Review:</strong> ${review.text}</p>
      </div>
    `;
  });
}

// Handle submitting a review
let selectedRating = 0;

// Function to render stars for review form
function renderReviewStars() {
  const reviewStarsContainer = document.getElementById("review-stars");
  reviewStarsContainer.innerHTML = ""; // Clear any existing stars

  // Generate 5 stars
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.classList.add("star");
    star.textContent = "★";

    // Add event listeners for mouseover and click events
    star.addEventListener("mouseover", () => highlightStars(i));
    star.addEventListener("mouseout", () => resetStars());
    star.addEventListener("click", () => selectRating(i));

    reviewStarsContainer.appendChild(star);
  }
}

// Function to highlight the stars on hover
function highlightStars(starIndex) {
  const stars = document.querySelectorAll("#review-stars .star");
  stars.forEach((star, index) => {
    if (index < starIndex) {
      star.style.color = "gold";
    } else {
      star.style.color = "gray";
    }
  });
}

// Function to reset the star colors when not hovering
function resetStars() {
  const stars = document.querySelectorAll("#review-stars .star");
  stars.forEach(star => {
    star.style.color = selectedRating > 0 ? "gold" : "gray";
  });
}

// Function to select a rating
function selectRating(rating) {
  selectedRating = rating;
  const stars = document.querySelectorAll("#review-stars .star");
  stars.forEach((star, index) => {
    if (index < rating) {
      star.style.color = "gold";
    } else {
      star.style.color = "gray";
    }
  });
}

// Call renderReviewStars to initialize the stars when the page loads
renderReviewStars();

// Handle submitting the review form
document.getElementById("review-form").addEventListener("submit", function(event) {
  event.preventDefault();

  const reviewText = document.getElementById("review-text").value;

  if (selectedRating && reviewText) {
    const newReview = {
      rating: selectedRating,
      text: reviewText
    };

    // Add new review to product and refresh the reviews section
    product.reviews.push(newReview);
    localStorage.setItem('products', JSON.stringify(products));  // Update products in local storage
    window.location.reload();  // Reload to show new review
  } else {
    alert("Please provide a rating and review text.");
  }
});

/*NAVIGATION MENU*/
var menuBtn = document.getElementById("menuBtn");
var sideNav = document.getElementById("sideNav");

sideNav.style.right = "-240px";
menuBtn.onclick = function(){
    if(sideNav.style.right == "-240px"){
        sideNav.style.right = "0";
        menu.src = "Images/close.png";
    }
    else{
        sideNav.style.right = "-240px";
        menu.src = "Images/menu.png";
    }
}
