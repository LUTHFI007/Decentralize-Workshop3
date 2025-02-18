document.addEventListener("DOMContentLoaded", function () {
    loadCart();
});

function loadCart() {
    const userId = "user123"; // Example user
    fetch(`http://localhost:3003/cart/${userId}`)
        .then(response => response.json())
        .then(cart => {
            const cartList = document.getElementById("cart-list");
            cartList.innerHTML = "";

            if (!cart.products.length) {
                cartList.innerHTML = "<p>Your cart is empty.</p>";
                return;
            }

            cart.products.forEach(item => {
                cartList.innerHTML += `
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${item.productId.name}</h5>
                                <p>Quantity: ${item.quantity}</p>
                                <button class="btn btn-danger" onclick="removeFromCart('${item.productId._id}')">Remove</button>
                            </div>
                        </div>
                    </div>
                `;
            });
        })
        .catch(error => console.error("Error loading cart:", error));
}

function removeFromCart(productId) {
    const userId = "user123";

    fetch(`http://localhost:3003/cart/${userId}/item/${productId}`, {
        method: "DELETE"
    })
    .then(() => {
        alert("Product removed from cart!");
        loadCart();
    })
    .catch(error => console.error("Error removing from cart:", error));
}

function clearCart() {
    const userId = "user123";

    fetch(`http://localhost:3003/cart/${userId}`, {
        method: "DELETE"
    })
    .then(() => {
        alert("Cart cleared!");
        loadCart();
    })
    .catch(error => console.error("Error clearing cart:", error));
}
