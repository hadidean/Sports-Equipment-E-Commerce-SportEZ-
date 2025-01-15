//DOM Elements
const productGrid = document.getElementById("product-grid");
const categoryLinks = document.querySelectorAll(".Categories ul li a");
const searchBar = document.getElementById("search-bar");
const banner = document.getElementById("banner");

// Function to render products dynamically
function renderProducts(filteredProducts) {
  productGrid.innerHTML = ""; // Clear previous content

  if (filteredProducts.length === 0) {
    productGrid.innerHTML = `<p>No products found in this category.</p>`;
    return;
  }

  filteredProducts.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>Price: RM ${product.price.toFixed(2)}</p>
        <button onclick="viewProduct(${product.id})">View Details</button>
      `;

    productGrid.appendChild(productCard);
  });
}

// Function to display product reviews
/*function showReviews(productId) {
  const product = products.find((product) => product.id === productId);

  if (product && product.reviews.length > 0) {
    const reviewContent = product.reviews
      .map(
        (review) =>
          `<p><strong>Rating:</strong> ${review.rating} ⭐ - ${review.text}</p>`
      )
      .join("");
    alert(`Reviews for ${product.name}:\n\n${reviewContent}`);
  } else {
    alert("No reviews available for this product.");
  }
}*/

// Function to filter products by category
function filterProducts(category) {
  if (category === "All") {
    renderProducts(products);
  } else {
    const filteredProducts = products.filter(
      (product) => product.category === category
    );
    renderProducts(filteredProducts);
  }
}

// Function to search products by name
function searchProducts(query) {
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );
  renderProducts(filteredProducts); // Render products based on search query
}

// Event listener for category links
categoryLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent default link behavior
    const category = link.textContent.trim(); // Get category name
    filterProducts(category);
  });
});

// Event listener for search bar input
searchBar.addEventListener("keyup", (event) => {
  const query = event.target.value.trim(); // Get search query
  searchProducts(query); // Filter products based on search query
});

// Render all products initially
filterProducts("All");

// Redirect to product details page
function viewProduct(id) {
  window.location.href = `product-details.html?id=${id}`;
}

/*NAVIGATION MENU*/
var menuBtn = document.getElementById("menuBtn");
var sideNav = document.getElementById("sideNav");

sideNav.style.right = "-240px";
menuBtn.onclick = function () {
  if (sideNav.style.right == "-240px") {
    sideNav.style.right = "0";
    menu.src = "Images/close.png";
  } else {
    sideNav.style.right = "-240px";
    menu.src = "Images/menu.png";
  }
};

/*SLIDESHOW*/
var slideIndex = 1; // Start with the first slide
var slideInterval; // Variable for automatic sliding timer

showSlides(slideIndex); // Display the initial slide
startAutoSlide(); // Start automatic sliding

// Function to change slides manually on button click
window.plusSlides = function (n) {
  clearInterval(slideInterval); // Stop auto-sliding temporarily
  showSlides((slideIndex += n)); // Update slide
  startAutoSlide(); // Restart auto-sliding
};

// Function to show the slide based on index
function showSlides(n) {
  var slides = document.getElementsByClassName("slide");

  // Wrap around if index exceeds the number of slides
  if (n > slides.length) {
    slideIndex = 1; // Wrap back to the first slide
  }
  if (n < 1) {
    slideIndex = slides.length; // Wrap to the last slide
  }

  // Hide all slides
  for (var i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  // Display the active slide
  slides[slideIndex - 1].style.display = "block";
}

// Function to start automatic sliding
function startAutoSlide() {
  slideInterval = setInterval(() => {
    showSlides(++slideIndex); // Move to the next slide
  }, 2000); // Change slide every 3 seconds
}



