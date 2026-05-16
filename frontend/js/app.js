const API_BASE_URL ="http://localhost:5000";

let allProducts = [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

const AUTH_URL = `${API_BASE_URL}/api/auth`;

const API_URL = `${API_BASE_URL}/api/products`;

const hamburger =
    document.getElementById(
        "hamburger"
    );

const navMenu =
    document.getElementById(
        "navMenu"
    );

if (hamburger && navMenu) {

    hamburger.addEventListener(
        "click",
        () => {

            navMenu.classList.toggle(
                "active"
            );

        }
    );

}

const backToTop =
    document.getElementById("backToTop");

window.addEventListener("scroll", () => {

    if (backToTop) {

        if (window.scrollY > 300) {

            backToTop.style.display = "flex";

        } else {

            backToTop.style.display = "none";

        }

    }

});

if (backToTop) {

    backToTop.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    });

}

const navbar =
    document.getElementById("navbar");

window.addEventListener("scroll", () => {

    if (navbar) {

        if (window.scrollY > 50) {

            navbar.style.background =
                "rgba(0,0,0,0.8)";

            navbar.style.boxShadow =
                "0 5px 25px rgba(0,0,0,0.5)";

        } else {

            navbar.style.background =
                "rgba(0,0,0,0.4)";

            navbar.style.boxShadow =
                "none";

        }

    }

});

const filterButtons =
    document.querySelectorAll(".filter-buttons button");

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        filterButtons.forEach((btn) =>
            btn.classList.remove("active")
        );
        button.classList.add("active");
    });

});

const themeBtn =
    document.getElementById("themeBtn");

let darkMode = true;
if (themeBtn) {
    themeBtn.addEventListener("click", () => {

        if (darkMode) {

            document.documentElement.style.setProperty(
                "--bg",
                "#ffffff"
            );

            document.documentElement.style.setProperty(
                "--card",
                "#f4f4f4"
            );

            document.documentElement.style.setProperty(
                "--text",
                "#111111"
            );

            document.documentElement.style.setProperty(
                "--light",
                "#555555"
            );

            themeBtn.innerHTML =
                '<i class="fas fa-sun"></i>';

            darkMode = false;

        } else {

            document.documentElement.style.setProperty(
                "--bg",
                "#050505"
            );

            document.documentElement.style.setProperty(
                "--card",
                "#111111"
            );

            document.documentElement.style.setProperty(
                "--text",
                "#ffffff"
            );

            document.documentElement.style.setProperty(
                "--light",
                "#bdbdbd"
            );

            themeBtn.innerHTML =
                '<i class="fas fa-moon"></i>';

            darkMode = true;

        }

    });

}

async function fetchProducts() {

    

    const productGrid =
        document.getElementById(
            "productGrid"
        );

    

    if (!productGrid) return;

    try {

        const response =
            await fetch(API_URL);

        const data =
            await response.json();

        console.log(data);

        allProducts = data.products || data;
        console.log(allProducts);
        displayProducts(allProducts);

    } catch (error) {

        console.log(error);

    }

}

fetchProducts();

function displayProducts(products) {

    const productGrid =
        document.getElementById(
            "productGrid"
        );
    if (!productGrid) return;
    productGrid.innerHTML = "";

    products.forEach((product) => {

        productGrid.innerHTML += `

      <div class="product-card">

        <span class="discount-badge">
          -20%
        </span>

        <div class="wishlist-icon"  onclick="toggleWishlist('${product._id}')">
          <i class="${wishlist.find(
            item => item._id === product._id) ? 'fas fa-heart' : 'far fa-heart'}"></i>
        </div>

        <div class="product-image" onclick="goToProduct('${product._id}')">
          <img src="${product.image}"
           alt="${product.title}"/>
        </div>

        <div class="product-content">

          <span class="category">
            ${product.category}
          </span>

          <h3 onclick="goToProduct('${product._id}')">
          ${product.title}
          </h3>

          <div class="rating">

            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star-half-alt"></i>

            <span>
              (${product.ratings})
            </span>

          </div>

          <div class="price">

            <span class="new-price">
              ₹${product.price}
            </span>

          </div>

          <div class="product-buttons">
             <button class="quick-view-btn" onclick="openQuickView('${product._id}')">
             Quick View</button>

            <button
              class="cart-btn"
              onclick="addToCart('${product._id}')"
            >
              Add To Cart
            </button>

          </div>

        </div>

      </div>`;

    });
    initializeDynamicFeatures();

}

function goToProduct(productId) {

    window.location.href =
        `product.html?id=${productId}`;

}

function initializeDynamicFeatures() {

    

    const wishlistIcons =
        document.querySelectorAll(
            ".wishlist-icon"
        );

    wishlistIcons.forEach((icon) => {

        icon.addEventListener("click", () => {

            const heart =
                icon.querySelector("i");

            heart.classList.toggle("fas");

            heart.classList.toggle("far");

            if (
                heart.classList.contains("fas")
            ) {

                heart.style.color =
                    "#ff7a00";

                showToast(
                    "Added To Wishlist ❤️"
                );

            } else {

                heart.style.color =
                    "white";

            }

        });

    });

    

    const viewButtons =
        document.querySelectorAll(
            ".view-btn"
        );

    viewButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                showToast(
                    "Quick View Coming Soon 🚀"
                );

            }
        );

    });

    

    const cards =
        document.querySelectorAll(
            ".product-card"
        );

    cards.forEach((card) => {

        card.style.opacity = "0";

        card.style.transform =
            "translateY(50px)";

        setTimeout(() => {

            card.style.opacity = "1";

            card.style.transform =
                "translateY(0px)";

            card.style.transition =
                "0.5s ease";

        }, 100);

    });

}

async function addToCart(productId) {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/cart`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",

                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },

                    body: JSON.stringify({
                        productId,
                        quantity: 1,
                    }),
                }
            );

        const data =
            await response.json();

        console.log(data);

        showToast(
            "Product Added To Cart ✅"
        );

        updateCartCount();

    } catch (error) {

        console.log(error);

    }

}

function showToast(message) {

    const toast =
        document.getElementById("toast");

    if (!toast) return;
    toast.innerText = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}

async function updateCartCount() {

    try {

        const cartCount =
            document.querySelector(
                ".cart-count"
            );

        

        if (!cartCount) return;

        const token =
            localStorage.getItem(
                "token"
            );

        

        if (!token) {

            cartCount.innerText = 0;

            return;

        }

        const response =
            await fetch(
                `${API_BASE_URL}/api/cart`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    },
                }
            );

        const cart =
            await response.json();

        console.log(cart);

        

        if (!cart.cartItems) {

            cartCount.innerText = 0;

            return;

        }

        let totalItems = 0;

        cart.cartItems.forEach(
            (item) => {

                totalItems +=
                    item.quantity;

            }
        );

        cartCount.innerText =
            totalItems;

    } catch (error) {

        console.log(error);

    }

}

updateCartCount();

const cartSidebar =
    document.getElementById(
        "cartSidebar"
    );

const overlay =
    document.getElementById(
        "overlay"
    );

const closeCart =
    document.getElementById(
        "closeCart"
    );

const cartIcon =
    document.querySelector(
        ".cart-icon"
    );

if (cartIcon) {
    cartIcon.addEventListener(
        "click",
        () => {

            cartSidebar.classList.add(
                "active"
            );

            overlay.classList.add(
                "active"
            );

            loadCartItems();

        }
    );
}

if (closeCart) {
    closeCart.addEventListener(
        "click",
        closeCartSidebar
    );
}
if (overlay) {
    overlay.addEventListener(
        "click",
        closeCartSidebar
    );
}
function closeCartSidebar() {

    cartSidebar.classList.remove(
        "active"
    );

    overlay.classList.remove(
        "active"
    );

}

async function loadCartItems() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/cart`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

        const cart =
            await response.json();

        const cartItems =
            document.getElementById(
                "cartItems"
            );

        cartItems.innerHTML = "";

        let total = 0;

        if (!cart.cartItems) {

            showToast(
                "Please Login First"
            );

            return;
        }

        if (!cart.cartItems) return;

        cart.cartItems.forEach((item) => {

            if (!item.product) return;
            total +=
                item.product.price *
                item.quantity;

            cartItems.innerHTML += `

        <div class="cart-item">

          <img
            src="${item.product.image}"
          />

          <div class="cart-item-content">

            <h4>
              ${item.product.title}
            </h4>

            <p>
              ₹${item.product.price}
            </p>

            <button
              class="remove-btn"
              onclick="removeCartItem('${item.product._id}')"
            >
              Remove
            </button>

          </div>

        </div>

      `;

        });

        document.getElementById(
            "cartTotal"
        ).innerText = `₹${total}`;

    } catch (error) {

        console.log(error);

    }

}

async function removeCartItem(
    productId
) {

    try {

        await fetch(
            `${API_BASE_URL}/api/cart/${productId}`,
            {
                method: "DELETE",

                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

        loadCartItems();

        updateCartCount();

        showToast(
            "Item Removed ❌"
        );

    } catch (error) {

        console.log(error);

    }

}

const authModal =
    document.getElementById(
        "authModal"
    );

const loginBtn =
    document.getElementById(
        "loginBtn"
    );

const registerBtn =
    document.getElementById(
        "registerBtn"
    );

const closeAuth =
    document.getElementById(
        "closeAuth"
    );

const authTitle =
    document.getElementById(
        "authTitle"
    );

const nameField =
    document.getElementById("name");

const authForm =
    document.getElementById(
        "authForm"
    );
if (authForm) {
    authForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            const name =
                document.getElementById(
                    "name"
                ).value;

            const email =
                document.getElementById(
                    "email"
                ).value;

            const password =
                document.getElementById(
                    "password"
                ).value;

            try {

                let endpoint = "";

                let bodyData = {};

                

                if (
                    authTitle.innerText ===
                    "Register"
                ) {

                    endpoint =
                        `${AUTH_URL}/register`;

                    bodyData = {
                        name,
                        email,
                        password,
                    };

                }

                

                else {

                    endpoint =
                        `${AUTH_URL}/login`;

                    bodyData = {
                        email,
                        password,
                    };

                }

                const response =
                    await fetch(endpoint, {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify(
                            bodyData
                        ),
                    });

                const data =
                    await response.json();

                console.log(data);

                

                if (!response.ok) {

                    showToast(
                        data.message ||
                        "Authentication Failed ❌"
                    );

                    return;
                }

                

                if (!data.token) {

                    showToast(
                        "Invalid Credentials ❌"
                    );

                    return;
                }

                

                localStorage.setItem(
                    "token",
                    data.token
                );
                localStorage.setItem(
                    "userInfo",
                    JSON.stringify(data)
                );

                showToast(
                    "Authentication Success ✅"
                );

                authModal.classList.remove(
                    "active"
                );

                checkLoginStatus();

            } catch (error) {

                console.log(error);

            }

        }
    );
}

if (loginBtn) {
    loginBtn.addEventListener(
        "click",
        () => {

            authModal.classList.add(
                "active"
            );

            authTitle.innerText =
                "Login";

            nameField.style.display =
                "none";

        }
    );
}

if (registerBtn) {
    registerBtn.addEventListener(
        "click",
        () => {

            authModal.classList.add(
                "active"
            );

            authTitle.innerText =
                "Register";

            nameField.style.display =
                "block";

        }
    );
}

if (closeAuth) {
    closeAuth.addEventListener(
        "click",
        () => {

            authModal.classList.remove(
                "active"
            );

        }
    );
}

const userMenu =
    document.getElementById(
        "userMenu"
    );

const userBtn =
    document.getElementById(
        "userBtn"
    );

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );

const authButtons =
    document.getElementById(
        "authButtons"
    );

if (userBtn) {
    userBtn.addEventListener(
        "click",
        () => {

            userMenu.classList.toggle(
                "active"
            );

        }
    );
}

if (logoutBtn) {
    logoutBtn.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "token"
            );

            showToast(
                "Logged Out 👋"
            );

            location.reload();

        }
    );

}

function checkLoginStatus() {

    const token =
        localStorage.getItem(
            "token"
        );

    const authButtons =
        document.getElementById(
            "authButtons"
        );

    const userMenu =
        document.getElementById(
            "userMenu"
        );

    if (
        token &&
        authButtons &&
        userMenu
    ) {

        authButtons.style.display =
            "none";

        userMenu.style.display =
            "block";

    }

}

checkLoginStatus();

function checkAdmin() {

    const userInfo =
        JSON.parse(
            localStorage.getItem(
                "userInfo"
            )
        );

    const adminLink =
        document.getElementById(
            "adminLink"
        );

    if (
        userInfo &&
        userInfo.isAdmin &&
        adminLink
    ) {

        adminLink.style.display =
            "block";

    }

}

checkAdmin();

const searchInput =
    document.getElementById(
        "searchInput"
    );
if (searchInput) {
    searchInput.addEventListener(
        "keyup",
        () => {

            const searchValue =
                searchInput.value
                    .toLowerCase()
                    .trim();

            const filteredProducts =
                allProducts.filter(
                    (product) => {

                        return (
                            product.title
                                .toLowerCase()
                                .includes(searchValue)

                            ||

                            product.category
                                .toLowerCase()
                                .includes(searchValue)
                        );

                    }
                );

            displayProducts(
                filteredProducts
            );

            

            document.getElementById("products").scrollIntoView({ behavior: "smooth", });

        }
    );
}

const categoryButtons =
    document.querySelectorAll(
        ".category-btn"
    );

categoryButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                

                categoryButtons.forEach(
                    (btn) => {

                        btn.classList.remove(
                            "active-category"
                        );

                    }
                );

                

                button.classList.add(
                    "active-category"
                );

                const category =
                    button.dataset.category;

                

                if (
                    category === "All"
                ) {

                    displayProducts(
                        allProducts
                    );

                    return;
                }

                

                const filteredProducts =
                    allProducts.filter(
                        (product) => {

                            return (
                                product.category ===
                                category
                            );

                        }
                    );

                displayProducts(
                    filteredProducts
                );

            }
        );

    }
);

const quickViewModal =
    document.getElementById(
        "quickViewModal"
    );

const quickViewData =
    document.getElementById(
        "quickViewData"
    );

const closeQuickView =
    document.getElementById(
        "closeQuickView"
    );

function openQuickView(id) {

    const product =
        allProducts.find(
            (item) =>
                item._id === id
        );

    if (!product) return;

    quickViewData.innerHTML = `

    <div class="quick-view-layout">

      <img
        src="${product.image}"
        class="quick-view-img"
      />

      <div>

        <h2>
          ${product.title}
        </h2>

        <p>
          ${product.description}
        </p>

        <h3>
          ₹${product.price}
        </h3>

        <button
          onclick="addToCart('${product._id}')"
          class="add-to-cart-btn">
          Add To Cart
        </button>

      </div>

    </div>

  `;

    quickViewModal.style.display =
        "flex";

}

if (closeQuickView) {
    closeQuickView.addEventListener(
        "click",
        () => {

            quickViewModal.style.display =
                "none";

        }
    );
}

function toggleWishlist(id) {

    const exists =
        wishlist.find(
            (item) =>
                item._id === id
        );

    

    if (exists) {

        wishlist =
            wishlist.filter(
                (item) =>
                    item._id !== id
            );

        showToast(
            "Removed From Wishlist ❌"
        );
        renderWishlist();
    }

    

    else {

        const product =
            allProducts.find(
                (item) =>
                    item._id === id
            );

        if (!product) return;

        wishlist.push(product);

        showToast(
            "Added To Wishlist ❤️"
        );

    }

    

    localStorage.setItem(
        "wishlist",
        JSON.stringify(
            wishlist
        )
    );
    fetchProducts();
    updateWishlistUI();
    displayProducts(allProducts);

}

function updateWishlistUI() {

    const wishlistCount =
        document.querySelector(
            ".wishlist-count"
        );

    

    if (!wishlistCount) return;

    wishlistCount.innerText =
        wishlist.length;

}

updateWishlistUI();

const wishlistSidebar =
    document.getElementById(
        "wishlistSidebar"
    );

const wishlistItems =
    document.getElementById(
        "wishlistItems"
    );

const closeWishlist =
    document.getElementById(
        "closeWishlist"
    );

function openWishlist() {

    wishlistSidebar.classList.add(
        "active"
    );

    renderWishlist();

}

if (closeWishlist) {
    closeWishlist.addEventListener(
        "click",
        () => {

            wishlistSidebar.classList.remove(
                "active"
            );

        }
    );
}

function renderWishlist() {

    wishlistItems.innerHTML = "";

    if (wishlist.length === 0) {

        wishlistItems.innerHTML =
            "<p>Wishlist Empty</p>";

        return;

    }

    wishlist.forEach((item) => {
        wishlistItems.innerHTML += `

       <div class="wishlist-item">

     <img src="${item.image}" />

     <div class="wishlist-info">

       <h4>
      ${item.title}
      </h4>

     <p>
      ₹${item.price}
     </p>

     <div class="wishlist-actions">

      <button
        onclick="addToCart('${item._id}')"
      >
        Add To Cart
      </button>

      <button
        onclick="removeWishlist('${item._id}')"
      >
        Remove
      </button>

      </div>

      </div>

     </div>`;

    });

}

function removeWishlist(id) {

    wishlist =
        wishlist.filter(
            item =>
                item._id !== id
        );

    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );

    updateWishlistUI();

    renderWishlist();

    displayProducts(allProducts);

    showToast(
        "Removed From Wishlist ❌"
    );

}

async function startCheckout() {

    try {

        

        const token = localStorage.getItem("token");

        

        if (!token) {

            showToast("Please Login First");
            return;

        }

        

        const cartResponse = await fetch(
            `${API_BASE_URL}/api/cart`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        );

        const cart = await cartResponse.json();

        

        if (
            !cart.cartItems ||
            cart.cartItems.length === 0
        ) {

            showToast("Cart Is Empty");
            return;

        }

        

        let total = 0;

        cart.cartItems.forEach((item) => {

            if (!item.product) return;

            total +=
                item.product.price *
                item.quantity;

        });

        console.log("Total:", total);

        

        const response = await fetch(
            `${API_BASE_URL}/api/payment/create-order`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },

                body: JSON.stringify({
                    amount: total * 100
                })
            }
        );

        const data = await response.json();

        console.log("Razorpay Order:", data);

        

        if (!data.id) {

            showToast("Order Creation Failed");
            return;

        }

        

        const options = {

            key: "rzp_test_Sna3JYKDNoy3cp",

            amount: data.amount,

            currency: "INR",

            name: "NeoStore",

            description: "Premium Tech Store",

            image: "https://cdn-icons-png.flaticon.com/512/3081/3081559.png",

            order_id: data.id,

            handler: async function (response) {

                console.log("Payment Success:", response);

                

                await placeOrderAfterPayment();

                showToast("Payment Successful ✅");

            },

            prefill: {

                name: "Shubham Kumar",

                email: "test@example.com",

                contact: "9999999999"

            },

            notes: {
                address: "NeoStore Office"
            },

            theme: {
                color: "#ff7a00"
            },

            modal: {

                ondismiss: function () {

                    showToast("Payment Cancelled");

                }

            }

        };

        

        const razorpay = new Razorpay(options);

        

        razorpay.on(
            "payment.failed",
            function (response) {

                console.log(
                    "Payment Failed:",
                    response.error
                );

                alert(
                    response.error.description
                );

                showToast("Payment Failed ❌");

            }
        );

        razorpay.open();

    } catch (error) {

        console.log(error);

        showToast("Something Went Wrong ❌");

    }

}

async function placeOrderAfterPayment() {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            showToast("Login required to place order");
            return;
        }

        const response = await fetch(
            `${API_BASE_URL}/api/orders`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    shippingAddress: {
                        address: "",
                        city: "",
                        postalCode: "",
                        country: "",
                    },
                    paymentMethod: "Razorpay",
                    isPaid: true,
                }),
            }
        );

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Order placement failed");
        }

        return data;
    } catch (error) {
        console.log(error);
        showToast("Order placement failed ❌");
    }
}

async function loadOrders() {

    const ordersContainer =
        document.getElementById(
            "ordersContainer"
        );

    if (!ordersContainer) return;

    try {

        const token =
            localStorage.getItem(
                "token"
            );

        if (!token) {

            ordersContainer.innerHTML =
                `
                <p>
                    Please Login First
                </p>
                `;

            return;
        }

        const response =
            await fetch(
                `${API_BASE_URL}/api/orders/myorders`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, }
                }
            );

        const orders =
            await response.json();

        console.log(orders);

        

        if (
            !orders ||
            orders.length === 0
        ) {

            ordersContainer.innerHTML =
                `
                <p>
                    No Orders Found
                </p>
                `;

            return;

        }

        ordersContainer.innerHTML = "";

        orders.forEach(order => {

            ordersContainer.innerHTML += `

            <div class="order-card">

                <h3>
                    Order ID:
                    ${order._id}
                </h3>

                <p>
                    Total:
                    ₹${order.totalPrice}
                </p>

                <p>
                    Status:
                    ${order.isPaid
                    ? "Paid ✅"
                    : "Pending ❌"}
                </p>

                ${order.orderItems.map(item => `

                    <div class="order-product">

                        <img
                            src="${item.product?.image}"
                        >

                        <div>

                            <h4>
                                ${item.product?.title}
                            </h4>

                            <p>
                                ₹${item.product?.price}
                            </p>

                            <p>
                                Qty:
                                ${item.quantity}
                            </p>

                        </div>

                    </div>

                `).join("")}

            </div>

            `;

        });

    } catch (error) {

        console.log(error);

        ordersContainer.innerHTML =
            `
            <p>
                Failed To Load Orders
            </p>
            `;

    }

}

loadOrders();

const params =
    new URLSearchParams(
        window.location.search
    );

const productId =
    params.get("id");

console.log(productId);

async function loadProductDetails() {

    if (!productId) return;

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/products/${productId}`
            );

        const product =
            await response.json();

        displayProductDetails(product);

    } catch (error) {

        console.log(error);

    }

}

loadProductDetails();

function displayProductDetails(product) {

    const productDetails =
        document.getElementById(
            "productDetails"
        );

    if (!productDetails) return;

    productDetails.innerHTML = `

    <div class="single-product">

        <div class="single-product-image">

            <img
            src="${product.image}"
            alt="${product.title}"
            />

        </div>

        <div class="single-product-content">

            <h1>
                ${product.title}
            </h1>

            <p>
                ${product.description}
            </p>

            <h2>
                ₹${product.price}
            </h2>

            <button
            onclick="addToCart('${product._id}')">

                Add To Cart

            </button>

        </div>

    </div>

    `;

}

async function loadAdminProducts() {

    const adminProducts =
        document.getElementById(
            "adminProducts"
        );

    if (!adminProducts) return;

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/products`
            );

        const data =
            await response.json();

        const products =
            data.products || data;

        adminProducts.innerHTML = "";

        products.forEach(product => {

            adminProducts.innerHTML += `

            <div class="admin-product-card">

                <img
                src="${product.image}"
                alt="${product.title}">

                <h3>
                    ${product.title}
                </h3>

                <p>
                    ₹${product.price}
                </p>
                 <button onclick="editProduct('${product._id}')">Edit</button>
                <button
                onclick="deleteProduct('${product._id}')">

                    Delete

                </button>

            </div>

            `;

        });

    } catch (error) {

        console.log(error);

    }

}

loadAdminProducts();

async function deleteProduct(id) {

    try {

        const token =
            localStorage.getItem(
                "token"
            );

        await fetch(
            `${API_BASE_URL}/api/products/${id}`,
            {
                method: "DELETE",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                }

            });

        showToast(
            "Product Deleted"
        );

        loadAdminProducts();

    } catch (error) {

        console.log(error);

    }

}

async function addProduct() {

    try {

        const productId =
            document.getElementById(
                "productId"
            ).value;

        const title =
            document.getElementById(
                "productTitle"
            ).value;

        const image =
            document.getElementById(
                "productImage"
            ).value;

        const price =
            document.getElementById(
                "productPrice"
            ).value;

        const category =
            document.getElementById(
                "productCategory"
            ).value;

        const description =
            document.getElementById(
                "productDescription"
            ).value;

        const token =
            localStorage.getItem(
                "token"
            );

        let url =
            `${API_BASE_URL}/api/products`;

        let method =
            "POST";

        if (productId) {

            url =
                `${API_BASE_URL}/api/products/${productId}`;

            method =
                "PUT";

        }

        const response =
            await fetch(url, {

                method,

                headers: {

                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`

                },

                body: JSON.stringify({

                    title,
                    image,
                    price,
                    category,
                    description

                })

            });

        const data =
            await response.json();

        console.log(data);

        showToast(

            productId
                ?
                "Product Updated"
                :
                "Product Added"

        );

        document.getElementById(
            "productId"
        ).value = "";

        document.getElementById(
            "productTitle"
        ).value = "";

        document.getElementById(
            "productImage"
        ).value = "";

        document.getElementById(
            "productPrice"
        ).value = "";

        document.getElementById(
            "productCategory"
        ).value = "";

        document.getElementById(
            "productDescription"
        ).value = "";

        loadAdminProducts();

    } catch (error) {

        console.log(error);

    }

}

async function editProduct(id) {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/products/${id}`
            );

        const product =
            await response.json();

        document.getElementById(
            "productId"
        ).value =
            product._id;

        document.getElementById(
            "productTitle"
        ).value =
            product.title;

        document.getElementById(
            "productImage"
        ).value =
            product.image;

        document.getElementById(
            "productPrice"
        ).value =
            product.price;

        document.getElementById(
            "productCategory"
        ).value =
            product.category;

        document.getElementById(
            "productDescription"
        ).value =
            product.description;

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    } catch (error) {

        console.log(error);

    }

}