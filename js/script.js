// UrbanSprout script file
// This file includes dynamic content changes, popup feature, and form validation.

/**
 * Helper function to show an alert popup.
 * @param {string} message - Message to show to user.
 */
function showPopup(message) {
  window.alert(message);
}

/**
 * Shows a temporary alert bar message.
 * @param {string} message - Message text.
 */
function showAlertBar(message) {
  var bar = document.getElementById("cartAlertBar");
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "cartAlertBar";
    bar.style.position = "fixed";
    bar.style.top = "16px";
    bar.style.right = "16px";
    bar.style.background = "#1b5e20";
    bar.style.color = "#fff";
    bar.style.padding = "10px 14px";
    bar.style.borderRadius = "8px";
    bar.style.boxShadow = "0 10px 18px rgba(0,0,0,0.2)";
    bar.style.zIndex = "2000";
    bar.style.fontSize = "0.9rem";
    document.body.appendChild(bar);
  }
  bar.textContent = message;
  bar.style.display = "block";
  window.setTimeout(function () {
    bar.style.display = "none";
  }, 1800);
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem("urbansproutCart") || "[]");
  } catch (error) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("urbansproutCart", JSON.stringify(cart));
}

function addToCart(name, price) {
  var cart = getCart();
  var existing = cart.find(function (item) {
    return item.name === name;
  });

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name: name, price: Number(price), qty: 1 });
  }

  saveCart(cart);
  showAlertBar(name + " added to cart.");
}

function bindAddToCartButtons() {
  var buttons = document.querySelectorAll(".add-to-cart-btn");
  if (!buttons.length) return;

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      var name = button.getAttribute("data-name");
      var price = button.getAttribute("data-price");
      addToCart(name, price);
    });
  });
}

function renderCartPage() {
  var body =
    document.getElementById("cartBody") || document.getElementById("estimateBody");
  var totalTarget =
    document.getElementById("cartTotal") ||
    document.getElementById("estimateTotal");
  var countTarget =
    document.getElementById("cartItems") ||
    document.getElementById("estimateItems");
  var clearBtn =
    document.getElementById("clearCartBtn") ||
    document.getElementById("clearEstimateBtn");

  if (!body || !totalTarget || !countTarget) return;

  function render() {
    var cart = getCart();
    body.innerHTML = "";

    if (!cart.length) {
      body.innerHTML =
        '<tr><td colspan="4">Cart is empty. <a href="products.html">Go Shopping</a></td></tr>';
      totalTarget.textContent = "NPR 0";
      countTarget.textContent = "0";
      return;
    }

    var total = 0;
    var totalQty = 0;
    cart.forEach(function (item) {
      var lineTotal = item.price * item.qty;
      total += lineTotal;
      totalQty += item.qty;
      body.innerHTML +=
        "<tr><td>" +
        item.name +
        "</td><td>NPR " +
        item.price +
        "</td><td>" +
        item.qty +
        "</td><td>NPR " +
        lineTotal +
        "</td></tr>";
    });

    totalTarget.textContent = "NPR " + total;
    countTarget.textContent = String(totalQty);
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      saveCart([]);
      render();
      showAlertBar("Cart cleared.");
    });
  }

  render();
}

/**
 * Dynamically updates current date in footer section.
 */
function updateCurrentDate() {
  var dateTarget = document.getElementById("todayDate");
  if (dateTarget) {
    var now = new Date();
    dateTarget.textContent = now.toDateString();
  }
}

/**
 * Filters products based on category selection.
 */
function filterProducts() {
  var filter = document.getElementById("productFilter");
  if (!filter) return;

  var selected = filter.value;
  var cards = document.querySelectorAll(".product-card");

  cards.forEach(function (card) {
    var category = card.getAttribute("data-category");
    if (selected === "all" || category === selected) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

/**
 * Validates feedback form fields on About Us page.
 * @param {Event} event - submit event.
 */
function validateFeedbackForm(event) {
  var form = document.getElementById("feedbackForm");
  if (!form) return true;

  var name = document.getElementById("name").value.trim();
  var email = document.getElementById("email").value.trim();
  var message = document.getElementById("message").value.trim();
  var errorBox = document.getElementById("formError");
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  errorBox.textContent = "";

  if (name.length < 3) {
    event.preventDefault();
    errorBox.textContent = "Name should be at least 3 characters.";
    return false;
  }

  if (!emailPattern.test(email)) {
    event.preventDefault();
    errorBox.textContent = "Please enter a valid email address.";
    return false;
  }

  if (message.length < 10) {
    event.preventDefault();
    errorBox.textContent = "Message should be at least 10 characters.";
    return false;
  }

  event.preventDefault();
  showPopup("Thank you! Your feedback was submitted successfully.");
  form.reset();
  return true;
}

/**
 * Initializes all listeners after page load.
 */
function initSite() {
  updateCurrentDate();
  bindAddToCartButtons();
  renderCartPage();

  var filter = document.getElementById("productFilter");
  if (filter) {
    filter.addEventListener("change", filterProducts);
  }

  var form = document.getElementById("feedbackForm");
  if (form) {
    form.addEventListener("submit", validateFeedbackForm);
  }

  var welcomeBtn = document.getElementById("welcomeBtn");
  if (welcomeBtn) {
    welcomeBtn.addEventListener("click", function () {
      showPopup("Namaste from Pokhara! Welcome to UrbanSprout Nepal.");
    });
  }
}

document.addEventListener("DOMContentLoaded", initSite);
