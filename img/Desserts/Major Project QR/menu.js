document.addEventListener("DOMContentLoaded", function () {
    const categoryButtons = document.querySelectorAll(".category-btn");
    const foodItems = document.querySelectorAll(".food-item");

    categoryButtons.forEach(button => {
        button.addEventListener("click", function () {
            // Remove 'active' class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");

            const category = this.getAttribute("data-category");

            foodItems.forEach(item => {
                if (category === "all" || item.getAttribute("data-category") === category) {
                    item.style.display = "block";
                } else {
                    item.style.display = "none";
                }
            });
        });
    });
});


let cart = JSON.parse(localStorage.getItem('cart')) || [];

const cartCount = document.querySelector('.cart-count');
const addToCartButtons = document.querySelectorAll('.add-to-cart');

addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const id = button.getAttribute('data-id');
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));
        const image = button.getAttribute('data-image');


        // Check if item is already in cart
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price, image, quantity: 1 });
        }

        updateCart();
        localStorage.setItem('cart', JSON.stringify(cart));

        // Visual feedback
        button.textContent = 'Added!';
        button.style.backgroundColor = '#4CAF50';
        setTimeout(() => {
            button.textContent = 'Add to Cart';
            button.style.backgroundColor = '';
        }, 1000);
    });
});

// Update cart icon count
function updateCart() {
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}

// Initialize cart count on page load
updateCart();
