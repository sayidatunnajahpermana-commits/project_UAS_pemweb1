// DATA PRODUK
const products = [
    { id: 1, name: "Tas Daur Ulang", category: "tas", price: 25000, image: "img/tas2.jpg", description: "Tas daur ulang ini dibuat dari anyaman bungkus kopi dan dilengkapi dengan pegangan kuat." },
    { id: 2, name: "Selimut anak", category: "selimut", price: 50900, image: "img/selimut.jpg", description: "Selimut kain perca memanfaatkan kain sisa." },
    { id: 3, name: "Tempat Pensil", category: "tempat-pencil", price: 24000, image: "img/tpensil.jpg", description: "Tempat pensil dari botol plastik bekas." },
    { id: 4, name: "Tatakan Cangkir", category: "tatakan-cangkir", price: 15000, image: "img/tcangkir.jpg", description: "Tatakan cangkir dari kain perca." },
    { id: 5, name: "Bingkai Foto", category: "bingkai-kardus", price: 75000, image: "img/bingkai.png", description: "Bingkai foto dari kardus bekas." },
    { id: 6, name: "Totebag", category: "tas totebag", price: 70000, image: "img/tas1.jpg", description: "Tas kain reusable dari kain perca." },
    { id: 7, name: "Lampu Hias", category: "lampu hias", price: 30500, image: "img/lampuh.jpg", description: "Lampu hias dari sendok plastik." },
    { id: 8, name: "Botol Minum", category: "botol minum", price: 85000, image: "img/botol.jpg", description: "Botol stainless steel minimalis." }
];


//  VARIABEL GLOBAL
let cart = JSON.parse(localStorage.getItem('cart')) || []; 
let selectedProduct = null;
let selectedProductPrice = 0;

const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
});

const productGrid = document.getElementById('product-grid');
const quantityInput = document.getElementById('quantity-input');
let detailModal;

//  RENDER PRODUK
function renderProducts(data) {
    if (!productGrid) return;
    productGrid.innerHTML = '';

    data.forEach(product => {
        productGrid.innerHTML += `
            <div class="col">
                <div class="card h-100 shadow-sm" onclick="showProductDetail(${product.id})">
                    <img src="${product.image}" class="card-img-top" style="height:200px;object-fit:cover">
                    <div class="card-body">
                        <h5 class="text-success">${product.name}</h5>
                        <p class="fw-bold text-danger">${formatter.format(product.price)}</p>
                    </div>
                </div>
            </div>
        `;
    });
}
//DETAIL PRODUK
window.showProductDetail = (id) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    selectedProduct = product;

    document.getElementById('modal-product-title').textContent = product.name;
    document.getElementById('modal-product-price').textContent = formatter.format(product.price);
    document.getElementById('modal-product-description').textContent = product.description;
    document.getElementById('modal-product-image').src = product.image;

    selectedProductPrice = product.price;
    quantityInput.value = 1;
    updateTotalPrice();

    detailModal.show();
};


//  TOTAL HARGA

function updateTotalPrice() {
    const qty = parseInt(quantityInput.value);
    document.getElementById('total-price-display').textContent =
        formatter.format(selectedProductPrice * qty);
}



// TAMBAH KE KERANJANG
function addToCart() {
    const qty = parseInt(quantityInput.value);

    const existing = cart.find(item => item.id === selectedProduct.id);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({
            id: selectedProduct.id,
            name: selectedProduct.name,
            price: selectedProduct.price,
            image: selectedProduct.image,  
            qty: qty
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart)); 
    updateCartIcon();
    detailModal.hide();
}

//  FUNGSI UNTUK "BELI SEKARANG"
function buyNow() {
    if (!selectedProduct) return;
    
    // Simpan data produk yang dipilih untuk halaman detail
    localStorage.setItem('selectedProduct', JSON.stringify({
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        image: selectedProduct.image,
        description: selectedProduct.description,
        quantity: parseInt(quantityInput.value)
    }));
    
    // Arahkan ke halaman produk yang sesuai
    const productPages = {
        'selimut': 'sel.html',
        'tas': 'tas.html',
        'tas totebag': 'tas.html',
        'tempat-pencil': 'pencil.html',
        'tatakan-cangkir': 'cangkir.html',
        'bingkai-kardus': 'bingkai.html',
        'lampu hias': 'lampu.html',
        'botol minum': 'botol.html'
    };
    
    const page = productPages[selectedProduct.category] || 'product.html';
    window.location.href = page;
}

//  UPDATE IKON KERANJANG

function updateCartIcon() {
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) {
        cartBtn.innerHTML = `<i class="bi bi-bag"></i> (${total})`;
    }
}

// PINDAH KE HALAMAN KERANJANG
function goToCart() {
    window.location.href = "cart.html";
}

//DOM READY
document.addEventListener('DOMContentLoaded', () => {

    renderProducts(products);
    detailModal = new bootstrap.Modal(document.getElementById('productDetailModal'));

    updateCartIcon(); // 🔥 TAMPILKAN JUMLAH SAAT LOAD

     //  TOMBOL "BELI SEKARANG"
    document.querySelector('.btn-outline-dark').addEventListener('click', buyNow);

    //  FILTER PRODUK BERDASARKAN KATEGORI
const categoryButtons = document.querySelectorAll('#category-filters button');

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Hapus class 'active' dari semua tombol
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        // Tambahkan class 'active' ke tombol yang diklik
        button.classList.add('active');

        const selectedCategory = button.getAttribute('data-category');
        let filteredProducts;

        if (selectedCategory === 'all') {
            // Tampilkan semua produk
            filteredProducts = products;
        } else {
            // Filter produk berdasarkan kategori
            // Catatan: Jika kategori "tas", sertakan juga "tas totebag" jika diperlukan
            filteredProducts = products.filter(product => {
                if (selectedCategory === 'tas') {
                    return product.category === 'tas' || product.category === 'tas totebag';
                }
                return product.category === selectedCategory;
            });
        }

        // Render ulang produk yang difilter
        renderProducts(filteredProducts);
    });
});

    document.getElementById('btn-plus').onclick = () => {
        quantityInput.value++;
        updateTotalPrice();
    };

    document.getElementById('btn-minus').onclick = () => {
        if (quantityInput.value > 1) {
            quantityInput.value--;
            updateTotalPrice();
        }
    };

    document.getElementById('add-to-cart-btn').onclick = addToCart;

    //  KLIK IKON KEARANJANG
    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', goToCart);
    }
});
