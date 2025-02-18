document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:3003/products")
        .then(response => response.json())
        .then(products => {
            const productList = document.getElementById("product-list");
            productList.innerHTML = "";

            products.forEach(product => {
                productList.innerHTML += `
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${product.name}</h5>
                                <p>${product.description}</p>
                                <p><strong>$${product.price}</strong></p>
                                <button class="btn btn-primary" onclick="addToCart('${product._id}')">Add to Cart</button>
                            </div>
                        </div>
                    </div>
                `;
            });
        });
});

function addToCart(productId) {
    fetch(`http://localhost:3003/cart/user123`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 })
    })
    .then(() => alert("Product added to cart!"));
}
