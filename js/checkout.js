document.addEventListener("DOMContentLoaded", function() {
    const cartItems = JSON.parse(localStorage.getItem('cart'));
    const cartInventoryDisplay = document.getElementById("cart-inventory");

    if (cartItems && cartItems.length > 0) {
        cartItems.forEach(item => {
            const listItem = document.createElement("div");
            listItem.classList.add('item')
            listItem.setAttribute("data-product", `${item.title}`);
            listItem.setAttribute("data-price", `${item.price}`);
            listItem.setAttribute("data-image", `${item.image}`);

            listItem.innerHTML = `
            <div class="itemscart">${item.title}</div>
            <div class="image">
            <img src="${item.image}" alt="" height="100" width="100" class="img-fluid rounded-3">
          </div>
          <div class="quantity" >
          <button class="btn btn-light btn-sm minus-btn">-</button>
            <span>Antal: <span class="quantity-value">${item.quantity}</span></span>
            <button class="btn btn-light btn-sm plus-btn">+</button>
          </div>
          <div class="totalPrice">Pris: $${item.price * item.quantity}</div>
          <hr>`;
        cartInventoryDisplay.appendChild(listItem);

        // Listener för minus
        const minusButton = listItem.querySelector('.minus-btn');
        minusButton.addEventListener('click', function() {
            if (item.quantity > 0) {
                item.quantity--;
                listItem.querySelector('.quantity-value').textContent = item.quantity;
                if (item.quantity === 0) {
                    // Ta bort varan från array
                    const itemIndex = cartItems.findIndex(cartItem => cartItem.product_id === item.product_id);
                    if (itemIndex !== -1) {
                        cartItems.splice(itemIndex, 1);
                    }
                    // Ta bort produkt visuellt
                    listItem.remove();
                }
                updateTotalPrice();
                saveCartToLocalStorage(cartItems);
                window.location.reload()
            }
        });

        // Listener för plus
        const plusButton = listItem.querySelector('.plus-btn');
        plusButton.addEventListener('click', function() {
            item.quantity++;
            listItem.querySelector('.quantity-value').textContent = item.quantity;
            updateTotalPrice();
            saveCartToLocalStorage(cartItems);
            window.location.reload()
        });

        });
    } else {
        const emptyCartMessage = document.createElement("div");
        emptyCartMessage.innerHTML = `<div>Varukorgen är tom</div>`;
        cartInventoryDisplay.appendChild(emptyCartMessage);
    }

    function updateTotalPrice() {
        const totalPrice = cartItems.reduce((acc, item) => {
            return acc + item.price * item.quantity;
        }, 0);
        const totalQuantity = cartItems.reduce((acc, item) => {
            return acc + item.quantity;
        }, 0);
        const totalPriceElement = document.getElementById("total-price");
        totalPriceElement.innerHTML = `Summa: $${totalPrice.toFixed(2)}
        <div style="font-weight: 200;">Antal varor: ${totalQuantity}</div> `;
    }

    updateTotalPrice();

    const emptyCartButton = document.getElementById('emptyCartBtn');
    emptyCartButton.addEventListener('click', function(){
        cartItems.length = 0;
        saveCartToLocalStorage(cartItems);
        window.location.reload();
    });
});


function saveCartToLocalStorage(cartItems) {
    localStorage.setItem('cart', JSON.stringify(cartItems));
}
