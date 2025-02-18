document.addEventListener("DOMContentLoaded", function () {
    loadOrderSummary();
});

function loadOrderSummary() {
    const userId = "user123";

    fetch(`http://localhost:3003/cart/${userId}`)
        .then(response => response.json())
        .then(cart => {
            const orderSummary = document.getElementById("order-summary");
            orderSummary.innerHTML = "<h4>Order Summary</h4>";

            if (!cart.products.length) {
                orderSummary.innerHTML += "<p>Your cart is empty.</p>";
                return;
            }

            let total = 0;
            cart.products.forEach(item => {
                total += item.productId.price * item.quantity;
                orderSummary.innerHTML += `
                    <p>${item.productId.name} - ${item.quantity} x $${item.productId.price}</p>
                `;
            });

            orderSummary.innerHTML += `<h5>Total: $${total.toFixed(2)}</h5>`;
        })
        .catch(error => console.error("Error loading order summary:", error));
}

function placeOrder() {
    const userId = "user123";

    fetch(`http://localhost:3003/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
    })
    .then(response => response.json())
    .then(() => {
        alert("Order placed successfully!");
        window.location.href = "index.html"; // Redirect to home
    })
    .catch(error => console.error("Error placing order:", error));
}
