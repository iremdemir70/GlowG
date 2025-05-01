// ------------------------------
// NAVBAR MENU (click toggle)
// ------------------------------
$('.navTrigger').click(function () {
  $(this).toggleClass('active');
  console.log("Clicked menu");
  $("#mainListDiv").toggleClass("show_list");
  $("#mainListDiv").fadeIn();
});

// ------------------------------
// NAVBAR SCROLL EFFECT
// ------------------------------
$(window).scroll(function () {
  if ($(document).scrollTop() > 50) {
      $('.nav').addClass('affix');
      console.log("OK");
  } else {
      $('.nav').removeClass('affix');
  }
});

// ------------------------------
// POPUP SHOW/HIDE LOGIC
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const checkBtn = document.getElementById("checkProductBtn");
  const popup = document.getElementById("skinTypePopup");

  if (checkBtn && popup) {
      checkBtn.addEventListener("click", () => {
          popup.classList.remove("hidden");
      });
  }

  renderProducts(); // ürünleri yükle
});

// ------------------------------
// GO TO PAGE FUNCTIONS
// ------------------------------
function goToHomePage() {
  window.location.href = "index.html";
}

function goToQuiz() {
  window.location.href = "SkinTypeTest.html";
}

// ------------------------------
// LOGIN / LOGOUT
// ------------------------------
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (email === "user@example.com" && password === "1234") {
      document.getElementById("loginCard").classList.add("hidden");
      document.getElementById("profileCard").classList.remove("hidden");
      document.getElementById("profileEmail").value = email;
  } else {
      alert("E-mail or password is incorrect!");
  }
}

function logout() {
  document.getElementById("profileCard").classList.add("hidden");
  document.getElementById("loginCard").classList.remove("hidden");
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
}

// ------------------------------
// DROPDOWN FILTER (Product Page)
// ------------------------------
$(".dropdown dt a").on('click', function () {
  $(".dropdown dd ul").slideToggle('fast');
});

$(".dropdown dd ul li a").on('click', function () {
  $(".dropdown dd ul").hide();
});

$(document).bind('click', function (e) {
  var $clicked = $(e.target);
  if (!$clicked.parents().hasClass("dropdown")) $(".dropdown dd ul").hide();
});

$('.mutliSelect input[type="checkbox"]').on('click', function () {
  var title = $(this).val() + ",";
  if ($(this).is(':checked')) {
      var html = '<span title="' + title + '">' + title + '</span>';
      $('.multiSel').append(html);
      $(".hida").hide();
  } else {
      $('span[title="' + title + '"]').remove();
      var ret = $(".hida");
      $('.dropdown dt a').append(ret);
  }
});

// ------------------------------
// PRODUCT RENDERING
// ------------------------------
const allProducts = [
  { name: 'Hydrating Cleanser', category: 'cleanser' },
  { name: 'Gentle Toner', category: 'toner' },
  { name: 'Vitamin C Serum', category: 'serum' },
  { name: 'Deep Clean Cleanser', category: 'cleanser' },
  { name: 'Pore Tightening Toner', category: 'toner' },
  { name: 'Anti-Aging Serum', category: 'serum' },
  { name: 'Soothing Cleanser', category: 'cleanser' },
  { name: 'Brightening Toner', category: 'toner' },
  { name: 'Hydra Serum', category: 'serum' }
];

let visibleCount = 6;

function renderProducts() {
  const filterValue = document.querySelector('.mutliSelect input:checked');
  const productsContainer = document.getElementById('product-list');
  if (!productsContainer) return;

  productsContainer.innerHTML = '';
  let filtered = allProducts;

  if (filterValue) {
      filtered = allProducts.filter(product => filterValue.value === product.category);
  }

  filtered.slice(0, visibleCount).forEach(product => {
      const productEl = document.createElement('div');
      productEl.className = 'product-card';
      productEl.textContent = product.name;
      productsContainer.appendChild(productEl);
  });

  console.log(filtered);
}

// View More
const viewMoreBtn = document.getElementById('view-more-btn');
if (viewMoreBtn) {
  viewMoreBtn.addEventListener('click', function () {
      visibleCount += 3;
      renderProducts();
  });
}

// Filter button
const filterBtn = document.querySelector('.filter-section button');
if (filterBtn) {
  filterBtn.addEventListener('click', function () {
      visibleCount = 6;
      renderProducts();
  });
}
