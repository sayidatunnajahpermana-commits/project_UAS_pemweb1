// product-detail.js
document.addEventListener("DOMContentLoaded", function () {

    const pricePerItem = 50900;
    const quantityInput = document.getElementById("quantity");
    const totalPriceEl = document.getElementById("total-price");
    const checkoutBtn = document.getElementById("checkout-btn");

    function updateTotal() {
        const qty = parseInt(quantityInput.value);
        const total = pricePerItem * qty;
        totalPriceEl.innerText = "Rp " + total.toLocaleString("id-ID");
    }

    document.getElementById("plus-btn").addEventListener("click", () => {
        quantityInput.value++;
        updateTotal();
    });

    document.getElementById("minus-btn").addEventListener("click", () => {
        if (quantityInput.value > 1) {
            quantityInput.value--;
            updateTotal();
        }
    });

    quantityInput.addEventListener("change", updateTotal);

    // 👉 LANGSUNG KE WHATSAPP (TANPA KERANJANG)
    checkoutBtn.addEventListener("click", function () {
        const qty = quantityInput.value;
        const total = pricePerItem * qty;

        const adminPhone = "6289687231733"; 

        const message = `
        Halo EcoCraft 🌿
        Saya ingin membeli produk berikut:

        🛍 Produk: Selimut Anak
        📦 Jumlah: ${qty}
        💰 Total: Rp ${total.toLocaleString("id-ID")}

        Mohon info pembayaran & pengiriman.
        Terima kasih 🙏
                `;

        const waUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
        window.open(waUrl, "_blank");
    });

});

    
    // Update cart icon
    function updateCartIcon() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const total = cart.reduce((sum, item) => sum + item.qty, 0);
        const cartCount = document.getElementById('cart-count');
        if (cartCount) cartCount.textContent = total;
    }
    
    updateCartIcon();
    updateTotalPrice();