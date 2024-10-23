const cartPrice = document.getElementById("cart-price");
const cleanCart = document.getElementById("clean-cart");
const backToHome = document.getElementById("back-home");
const removeItem = document.getElementById("remove-item");  
const cartContainer = document.getElementById("cart-container"); 

const CART = "66e79f9222db5c70e4712aba"

// Obtener todos los productos del carrito
const getCartProducts = async () => {
    try {
        const res = await fetch(`/api/carts/${CART}`);
        const data = await res.json();
        if (data.products.length === 0) {
            cartContainer.innerHTML = "<h1>No hay productos en el carrito</h1>";
        } else {
            // Asegúrate de que todos los productos tienen 'product' y 'product.price'
            cartPrice.innerHTML = data.products.reduce((acc, item) => {
                if (item.product && item.product.price) {
                    return acc + item.product.price * item.quantity;
                }
                return acc; // Si 'product' o 'product.price' no está definido, se ignora este item
            }, 0);
        }
    } catch (err) {
        console.log(err);
    }
};
getCartProducts();

// Limpiar carrito
cleanCart.addEventListener("click", async () => {
    await fetch(`/api/carts/${CART}`, {
        method: "DELETE",
    });
});

// Volver a la página de productos
backToHome.addEventListener("click", () => {
    location.href = "/";
});

// Eliminar un producto del carrito
cartContainer.addEventListener("click", async (e) => {
    if (e.target.classList.contains("remove-item")) {
        const id = e.target.dataset.id;
        await fetch(`/api/carts/${CART}/products/${id}`, {
            method: "DELETE",
        });
    }
});

cartContainer.addEventListener("click", (e) => {
    // Incrementar cantidad de productos en el carrito
    if (e.target.classList.contains("btn-increase")) {
        const quantity = e.target.previousElementSibling;
        quantity.innerHTML = parseInt(quantity.textContent) + 1;
        updateQuantity(e.target.dataset.id, parseInt(quantity.textContent));
    }

    // Decrementar cantidad de productos en el carrito
    if (e.target.classList.contains("btn-decrease")) {
        const quantity = e.target.nextElementSibling;
        if (quantity.textContent <= 1) {
            return;
        }
        quantity.innerHTML = parseInt(quantity.textContent) - 1;
        updateQuantity(e.target.dataset.id, parseInt(quantity.textContent));
    }
});

// Actualizar cantidad de productos en el carrito
const updateQuantity = async (id, quantity) => {
    await fetch(`/api/carts/${CART}/products/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
    });
}