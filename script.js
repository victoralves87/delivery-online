const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const pagInput = document.getElementById("pag")
const pagWarn = document.getElementById("pag-warn")
const addressWarn = document.getElementById("address-warn")
const obs = document.getElementById("observations")


let cart = [];


const cartIcons = document.querySelectorAll('.cart-icon');

  cartIcons.forEach(function(cartIcon) {
    cartIcon.addEventListener('click', function() {
      // Adiciona o movimento para cima
      cartIcon.classList.add('-translate-y-1');

      // Define um temporizador para remover o movimento após 200 milissegundos (ou 0.2 segundos)
      setTimeout(function() {
        cartIcon.classList.remove('-translate-y-1');
      }, 200);
    });
  });


//abrir modal carrinho
cartBtn.addEventListener("click", function(){
    updateCartModal();
    cartModal.style.display = 'flex'
})

//fechar modal carrinho
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = 'none'
    }
})

//fechar model com botão
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = 'none'
})

//
menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name, price)
    }

})

//função para adicionar no carrinho
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)
    if(existingItem){
        //se o item exite aumentea +1
        existingItem.quantity += 1;
        return;
    }else{
        cart.push({
            name,
            price,
            quantity:1,
        })
    }

    updateCartModal()
}

//atualiza o carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex","justify-between","mb-4","flex-col")

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>
            
            <button class="remove-from-cart-btn px-5 rounded hover:bg-red-600" data-name="${item.name}">
                Remover
            </button>
            
        </div>
        `
        total += item.price * item.quantity

        cartItemsContainer.appendChild(cartItemElement)
    })

        cartTotal.textContent = total.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        //contar o numero de itens no carrinho
        cartCounter.innerHTML = cart.length

}

    //função para remover item do carrinho
    cartItemsContainer.addEventListener("click", function(event){
        if(event.target.classList.contains("remove-from-cart-btn")){
            const name = event.target.getAttribute("data-name")

            removeItemCart(name);
        }
    })

    function removeItemCart(name){
        const index = cart.findIndex(item => item.name === name);

        if(index !== -1){
            const item = cart[index];

            if(item.quantity > 1){
                item.quantity -= 1;
                updateCartModal();
                return;
            }

            cart.splice(index,1);
            updateCartModal();
        }
    }

    //pegar valor do input
    addressInput.addEventListener("input", function(event){
        let inputValue = event.target.value;

        if(inputValue !== ""){
            addressInput.classList.remove("border-red-500")
            addressWarn.classList.add("hidden");
        }
    })
    ///validação endereço
    // Adicione um ouvinte de evento para o clique no botão de checkout
    checkoutBtn.addEventListener("click", function() {

        const isOpen = checkRestaurantOpen();
        if (!isOpen) {
            Toastify({
                text: "Opa o restaurante está fechado!",
                duration: 3000,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    background: "#ef4444",
                },
            }).showToast();
            return;
        }

        // Verifique se o carrinho está vazio
        if (cart.length === 0) return;

        // Obter o valor do endereço e remover espaços em branco
        let addressValue = addressInput.value.trim();
        
        // Se o endereço estiver vazio, mostrar aviso e adicionar classe de erro
        if (addressValue === "") {
            addressWarn.classList.remove("hidden");
            addressInput.classList.add("border-red-500");
            return;
        }

        // Obter o valor da forma de pagamento e remover espaços em branco
        let paymentValue = pagInput.value.trim();

        // Se a forma de pagamento estiver vazia, mostrar aviso e adicionar classe de erro
        if (paymentValue === "") {
            pagWarn.classList.remove("hidden");
            pagInput.classList.add("border-red-500");
            return;
        }

        // Obter as observações e remover espaços em branco
         let observationsValue = obs.value.trim();

        // Calcular o total do pedido
        let total = 0;
        cart.forEach(item => {
            total += item.price * item.quantity;
        });

        // Criar a mensagem com os itens do carrinho e o total do pedido
        const cartItems = cart.map((item) => {
            return (
                `${item.name} Quantidade: (${item.quantity}) Preço Unidade: R$${item.price}\n\n`
            );
        }).join("");

        const message = encodeURIComponent(cartItems + `\nForma de Pagamento: ${paymentValue}\nObservações: ${observationsValue}\nTOTAL DO PEDIDO: R$${total.toFixed(2)}\n`);

        const phone = "5581989376677";

        // Envie o pedido para a API com o endereço e o total do pedido
        window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressValue}`, "_blank");

        // Limpe o carrinho e atualize o modal do carrinho
        cart = [];
        updateCartModal();
    });


    //validação do pagamento
    pagInput.addEventListener("input", function(event){
        let inputValue = event.target.value;

        if(inputValue !== ""){
            pagInput.classList.remove("border-red-500")
            pagWarn.classList.add("hidden");
        }
    })

    checkoutBtn.addEventListener("click", function(){
        if(cart.length === 0) return;
        let inputValue = pagInput.value.trim(); // Obter o valor do input e remover espaços em branco
        if(inputValue === ""){
            pagWarn.classList.remove("hidden");
            pagInput.classList.add("border-red-500");
            return;  
        }
    })

    //verificar a hora do delivery
    function checkRestaurantOpen(){
        const data = new Date();
        const hora = data.getHours();
        return hora >= 11 && hora < 22;
        //true
    }

    const spanItem = document.getElementById("date-span")
    const isOpen = checkRestaurantOpen();

    if(isOpen){
        spanItem.classList.remove("bg-red-500")
        spanItem.classList.add("bg-green-600")
    }else{
        spanItem.classList.remove("bg-green-600")
        spanItem.classList.add("bg-red-500") 
    }