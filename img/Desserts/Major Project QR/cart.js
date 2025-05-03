document.addEventListener('DOMContentLoaded', () => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartItemsContainer = document.querySelector('.cart-items');
  const cartTotal = document.querySelector('.cart-total');

  function displayCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
      cartTotal.textContent = '₹0.00';
      return;
    }

    cart.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.classList.add('cart-item');
      itemElement.innerHTML = `
                <div class="cart-item-info">
                    <img src="${item.image || 'placeholder.jpg'}" alt="${item.name}" class="cart-item-image">
                    <p class="cart-item-name">${item.name}</p>
                    <p class="cart-item-price">₹${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    <button class="remove-item" data-id="${item.id}">Remove</button>
                </div>
            `;
      cartItemsContainer.appendChild(itemElement);
      total += item.price * item.quantity;
    });

    cartTotal.textContent = `₹${total.toFixed(2)}`;

    // Quantity change
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
      button.addEventListener('click', () => {
        const id = button.getAttribute('data-id');
        const item = cart.find(item => item.id === id);
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          cart = cart.filter(item => item.id !== id);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
      });
    });

    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
      button.addEventListener('click', () => {
        const id = button.getAttribute('data-id');
        const item = cart.find(item => item.id === id);
        item.quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
      });
    });

    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', () => {
        const id = button.getAttribute('data-id');
        cart = cart.filter(item => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
      });
    });
  }

  displayCart();

  // ✅ Proceed to Checkout logic (moved inside DOMContentLoaded)
  const checkoutBtn = document.querySelector(".checkout-btn");
  const checkoutModal = document.getElementById("checkoutModal");
  const closeCheckout = document.getElementById("closeCheckout");
  const checkoutForm = document.getElementById("checkoutForm");

  checkoutBtn.addEventListener("click", () => {
    checkoutModal.classList.remove("hidden");
  });

  closeCheckout.addEventListener("click", () => {
    checkoutModal.classList.add("hidden");
  });

  checkoutForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();
    const seat = document.getElementById("seatNumber").value.trim();

    if (name && phone && seat) {
      alert(`Order placed!\nName: ${name}\nPhone: ${phone}\nSeat: ${seat}`);
      checkoutModal.classList.add("hidden");
      displayCart();
    } else {
      alert("Please fill out all fields.");
    }
  });

  const paymentModal = document.getElementById("paymentModal");
  const closePayment = document.getElementById("closePayment");
  const paymentForm = document.getElementById("paymentForm");

  checkoutForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();
    const seat = document.getElementById("seatNumber").value.trim();

    // const namePattern = /^[A-Za-z\s]+$/;
    // const numberPattern = /^[0-9]+$/;

    if (name && phone && seat) {
      checkoutModal.classList.add("hidden");
      paymentModal.classList.remove("hidden");
    } else {
      alert("Please fill out all fields.");
    }
  });


// Allow only letters and spaces in the name
document.getElementById("customerName").addEventListener("input", function () {
  this.value = this.value.replace(/[^A-Za-z\s]/g, "");
});

// Allow only digits in the phone number
document.getElementById("customerPhone").addEventListener("input", function () {
  this.value = this.value.replace(/[^0-9]/g, "");
});

// Allow only digits in the seat number
document.getElementById("seatNumber").addEventListener("input", function () {
  this.value = this.value.replace(/[^0-9]/g, "");
});



  // Close Payment Modal
  closePayment.addEventListener("click", () => {
    paymentModal.classList.add("hidden");
  });

  // Handle fake payment
  paymentForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const activeTab = document.querySelector(".payment-tab.active").id;

    if (activeTab === "creditTab") {
      const cardNumber = creditFields.querySelector("input[placeholder='1234 1234 1234 1234']").value.trim();
      const expiry = creditFields.querySelector("input[placeholder='MM / YY']").value.trim();
      const cvc = creditFields.querySelector("input[placeholder='CVC']").value.trim();

      console.log("Credit Card Fields:", { cardNumber, expiry, cvc });

      if (!cardNumber || !expiry || !cvc) {
        alert("Please fill out all credit card fields.");
        return;
      }
    }


    else if (activeTab === "upiTab") {
      const upiApp = upiFields.querySelector("select").value.trim();
      const upiId = upiFields.querySelector("input").value.trim();

      if (!upiApp || !upiId) {
        alert("Please fill out all UPI details.");
        return;
      }
    }

    // No validation needed for PayPal
    alert("✅ Payment successful! Thank you for your order ❤️");
    paymentModal.classList.add("hidden");

    // Get customer details
    const name = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();
    const seat = document.getElementById("seatNumber").value.trim();
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Format item details like "Paneer Paratha x2, Veg Burger x1"
    const formattedItems = cart.map(item => `${item.name} x${item.quantity}`).join(", ");

    const amount = document.querySelector(".cart-total").textContent.replace("₹", "").trim();
    const paymentStatus = "Paid";

    // ✅ Send order to backend
    fetch("http://localhost:5000/submit-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        phone: phone,
        seat: seat,
        items: formattedItems,
        amount: parseFloat(amount),
        payment_status: paymentStatus
      }),
    })
      .then(res => res.json())
      .then(data => {
        console.log(data.message);
        localStorage.removeItem("cart");
        displayCart();
      })
      .catch(err => {
        console.error("Failed to store order:", err);
      });


  });



  // Tab Switching Logic
  const creditTab = document.getElementById("creditTab");
  const paypalTab = document.getElementById("paypalTab");
  const upiTab = document.getElementById("upiTab");

  const creditFields = document.getElementById("creditFields");
  const paypalFields = document.getElementById("paypalFields");
  const upiFields = document.getElementById("upiFields");

  function switchTab(selected) {
    document.querySelectorAll('.payment-tab').forEach(tab => tab.classList.remove('active'));
    creditFields.classList.add("hidden");
    paypalFields.classList.add("hidden");
    upiFields.classList.add("hidden");

    if (selected === "credit") {
      creditTab.classList.add("active");
      creditFields.classList.remove("hidden");
    } else if (selected === "paypal") {
      paypalTab.classList.add("active");
      paypalFields.classList.remove("hidden");
    } else if (selected === "upi") {
      upiTab.classList.add("active");
      upiFields.classList.remove("hidden");
    }

    updateRequiredFields(); // ✅ Call this here
  }

  function updateRequiredFields() {
    // Disable all requireds first
    creditFields.querySelectorAll("input").forEach(input => input.required = false);
    upiFields.querySelectorAll("input, select").forEach(input => input.required = false);

    // Enable only for visible one
    if (!creditFields.classList.contains("hidden")) {
      creditFields.querySelectorAll("input").forEach(input => input.required = true);
    } else if (!upiFields.classList.contains("hidden")) {
      upiFields.querySelectorAll("input, select").forEach(input => input.required = true);
    }
  }



  creditTab.addEventListener("click", () => switchTab("credit"));
  paypalTab.addEventListener("click", () => switchTab("paypal"));
  upiTab.addEventListener("click", () => switchTab("upi"));

  // Restrict Credit Card Fields to numeric input only
const cardNumberInput = document.getElementById("cardNumber");
const cardExpiryInput = document.getElementById("cardExpiry");
const cardCVCInput = document.getElementById("cardCVC");

if (cardNumberInput) {
  cardNumberInput.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, "");
  });
}

if (cardExpiryInput) {
  cardExpiryInput.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9\/ ]/g, "");
  });
}

if (cardCVCInput) {
  cardCVCInput.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, "");
  });
}


});

updateRequiredFields();
