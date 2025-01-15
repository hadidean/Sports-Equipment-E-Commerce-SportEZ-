const cartItemsContainer = document.getElementById('cart-items');
const totalPriceElement = document.getElementById('total-price');
const merchandiseSubtotalElement = document.getElementById('merchandise-subtotal');
const voucherCodeInput = document.getElementById('voucher-code');
const applyVoucherButton = document.getElementById('apply-voucher');
const voucherMessage = document.getElementById('voucher-message');
const voucherDiscountElement = document.getElementById('voucher-discount');
const totalAmountElement = document.getElementById('total-amount');
const shippingFeeElement = document.getElementById('shipping-fee');
const removeSelectedButton = document.getElementById('remove-selected');
const checkoutButton = document.getElementById("checkout-button");

//Get cart array from local storage
let cart = JSON.parse(localStorage.getItem("cart"));

let vouchers = [];

// Fetch vouchers from voucher.json
fetch('checkout.json')
    .then(response => response.json())
    .then(data => {
        vouchers = data;
    })
    .catch(error => console.error('Error loading vouchers:', error));

    function updateCart() {
        cartItemsContainer.innerHTML = '';
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            const subtotal = product.price * item.quantity;
    
            const row = document.createElement('tr');
            row.dataset.id = item.id;
    
            row.innerHTML = `
                <td><input type="checkbox" class="item-select" data-id="${item.id}" checked></td>
                <td><img src="${product.image}" alt="${product.name}" width="100"></td>
                <td>${product.name}</td>
                <td>
                    <div class="quantity-control">
                        <button class="decrease" data-id="${item.id}">-</button>
                        <input type="number" class="quantity" value="${item.quantity}" min="0">
                        <button class="increase" data-id="${item.id}">+</button>
                    </div>
                </td>
                <td>RM ${product.price.toFixed(2)}</td>
                <td class="subtotal">RM ${subtotal.toFixed(2)}</td>
            `;
    
            cartItemsContainer.appendChild(row);
        });

    calculateTotal();
}

function calculateTotal() {
    let total = 0;
    let itemCount = 0;

    document.querySelectorAll('.item-select:checked').forEach(checkbox => {
        const id = parseInt(checkbox.dataset.id);
        const item = cart.find(i => i.id === id);
        const product = products.find(p => p.id === item.id);
        total += product.price * item.quantity;
        itemCount += item.quantity;
    });

    updateTotal(total, itemCount);
}

function updateTotal(total, itemCount) {
    const shipping = itemCount > 0 ? 3 * itemCount : 0;
    totalPriceElement.textContent = total.toFixed(2);
    merchandiseSubtotalElement.textContent = `RM ${total.toFixed(2)}`;
    shippingFeeElement.textContent = `RM ${shipping.toFixed(2)}`;
    updateFinalTotal(total, shipping);
}

function applyVoucher() {
    const code = voucherCodeInput.value.trim().toUpperCase();
    const voucher = vouchers.find(v => v.code === code);

    let discount = 0;
    let shippingDiscount = false; // Flag for free shipping

    if (voucher) {
        if (voucher.type === 'percentage') {
            discount = (voucher.value / 100) * parseFloat(totalPriceElement.textContent);
        } else if (voucher.type === 'flat') {
            discount = voucher.value;
        } else if (voucher.type === 'freeShipping') {
            shippingDiscount = true;
        }

        voucherMessage.textContent = 'Voucher applied successfully!';
        voucherMessage.style.color = 'green';
    } else {
        voucherMessage.textContent = 'Invalid voucher code.';
        voucherMessage.style.color = 'red';
    }

    voucherDiscountElement.textContent = `- RM ${discount.toFixed(2)}`;
    const currentShipping = shippingDiscount ? 0 : parseFloat(shippingFeeElement.textContent.replace('RM ', ''));

    updateFinalTotal(parseFloat(totalPriceElement.textContent) - discount, currentShipping);
}

function updateFinalTotal(total, shipping) {
    totalAmountElement.textContent = `RM ${(total + shipping).toFixed(2)}`;
    shippingFeeElement.textContent = `RM ${shipping.toFixed(2)}`;
}

function removeSelectedItems() {
    const selectedItems = document.querySelectorAll('.item-select:checked');
    selectedItems.forEach(checkbox => {
        const id = parseInt(checkbox.dataset.id);
        cart = cart.filter(item => item.id !== id);
    });
    localStorage.removeItem('cart');
    updateCart();
}

cartItemsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('increase')) {
        const id = parseInt(e.target.dataset.id);
        const item = cart.find(i => i.id === id);
        item.quantity++;
        updateCart();
    } else if (e.target.classList.contains('decrease')) {
        const id = parseInt(e.target.dataset.id);
        const item = cart.find(i => i.id === id);
        if (item.quantity > 0) {
            item.quantity--;
            updateCart();
        }
    }
});

cartItemsContainer.addEventListener('change', (e) => {
    if (e.target.classList.contains('item-select')) {
        calculateTotal();
    }
});

applyVoucherButton.addEventListener('click', applyVoucher);

removeSelectedButton.addEventListener('click', removeSelectedItems);

checkoutButton.addEventListener('click', () => {
    localStorage.setItem("checkoutProduct", JSON.stringify(cart.map(item => {
        const product = products.find(p => p.id === item.id);
        return {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image
        };
    })));
    
    window.location.href = 'thankyou.html'; 
});


document.addEventListener('DOMContentLoaded', updateCart);
