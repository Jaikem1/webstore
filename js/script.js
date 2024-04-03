
let iconCartSpan = document.querySelector('.icon-cart span');
let carts = [];

document.addEventListener("DOMContentLoaded", function () {

  if(localStorage.getItem('cart')){
    carts = JSON.parse(localStorage.getItem('cart'))
    cartCounter();
  }
  // Hämta produkter från Fake Store API och rendera dem på sidan
  fetch("https://fakestoreapi.com/products")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const productList = document.getElementById("product-list");
      data.forEach((product) => {
        // Skapa produktkort
        const productCard = document.createElement("div");
        productCard.classList.add(
          "col-lg-3",
          "col-md-4",
          "col-sm-6",
          "mb-4",
          "product-container"
        );
        productCard.setAttribute("data-product", `${product.title}`);
        productCard.setAttribute("data-price", `${product.price}`);
        productCard.setAttribute("data-description", `${product.description}`);
        productCard.dataset.id = product.id;
        productCard.innerHTML = `
                <div class="card h-100">
                  <div data-bs-toggle="offcanvas" data-bs-target="#offcanvas-product" aria-controls="offcanvas-product">
                    <img class="card-img-top" src="${product.image}" alt="${product.title}">  
                    <div class="card-body">
                        <h5 class="card-title text-truncate">${product.title}</h5>
                    </div>
                  </div>
                  <div class="d-flex flex-column card-body product-button">
                    <p class="card-text">$${product.price}</p>
                    <button class="btn btn-primary btn-order">Lägg i varukorg</button>
                  </div>
                </div>
            `;
        productList.appendChild(productCard);
      });
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });

  // Hantera klickhändelser
  document.addEventListener("click", function (event) {
    // Hämta produktinformation
    let positionClick = event.target;

    if (positionClick.classList.contains("btn-order")) {
      event.preventDefault();
      let product_id = positionClick.closest(".product-container").dataset.id;
      let title = positionClick.closest(".product-container").querySelector(".card-title").textContent;
      let image = positionClick.closest(".product-container").querySelector(".card-img-top").src;
      let price = parseFloat(positionClick.closest(".product-container").querySelector(".card-text").textContent.replace("$", ""));
      addToCart(product_id, title, image, price);

      // Skapa en URL för beställningsformuläret med produktinformationen som query parametrar
      //const orderFormUrl = `order.html?product=${encodeURIComponent(
      //  productName
      //)}&price=${encodeURIComponent(productPrice)}`;

      // Omdirigera användaren till varukorgen
      //window.location.href = "cart.html";

      // Sätter produktinfo i offcanvas
    }
  });
});

const addToCart = (product_id, title, image, price) => {
  let posCart = carts.findIndex((value) => value.product_id == product_id)
  if(carts.length <= 0){
    carts = [{
      product_id: product_id,
      title: title,
      quantity: 1,
      image: image,
      price: price
    }]
  } else if(posCart < 0 ){
    carts.push({
      product_id: product_id,
      title: title,
      quantity: 1,
      image: image,
      price: price
    })
  } else{
    carts[posCart].quantity = carts[posCart].quantity + 1;
  }

  localStorage.setItem('cart', JSON.stringify(carts));
  console.log(carts);
  cartCounter();
}

const cartCounter = () => {
  tempCountArray = JSON.parse(localStorage.getItem('cart'));
  if (tempCountArray.length != null){
    let totalQuantity = 0;
    carts.forEach(cart =>{
      totalQuantity = totalQuantity + cart.quantity;
    })
    iconCartSpan.innerText = totalQuantity;

  } else{
    iconCartSpan.innerText = 0;
  }
}


//dynamiskt år i footer
document.getElementById("cRyear").innerHTML = new Date().getFullYear();
