<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Modern Vintage Marketplace</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    :root {
      --bg: #fdfaf5;
      --ink: #2f2f2f;
      --velvet: #5a3e36;
      --gilt: #d4af37;
      --frame: #e0dcd2;
      --hover: #b99062;
    }
    * { box-sizing: border-box; }
    body { font-family: 'Inter', system-ui, -apple-system, Segoe UI, Roboto, sans-serif; background: var(--bg); color: var(--ink); margin: 0; }

    header {
      background: var(--velvet); color: #fff; text-align: center;
      padding: 2rem 1rem; font-family: 'Playfair Display', Georgia, serif;
      font-size: clamp(1.6rem, 3.2vw, 2rem); border-bottom: 6px solid var(--gilt);
      letter-spacing: 0.06em;
    }

    /* Top controls */
    .topbar {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: 0.75rem;
      align-items: center;
      padding: 1rem 2rem;
      border-bottom: 1px solid var(--frame);
      background: var(--bg);
      position: sticky; top: 0; z-index: 10;
    }
    .search input {
      width: 100%; padding: 0.6rem 0.8rem; border: 1px solid #ccc; border-radius: 8px; font-size: 0.95rem;
    }
    .filters { display: flex; gap: 0.5rem; align-items: center; }
    .filters select, .filters input {
      padding: 0.5rem; border: 1px solid #ccc; border-radius: 6px; font-size: 0.9rem; width: 140px;
    }
    .cart-button {
      display: inline-flex; align-items: center; gap: 0.5rem;
      background: var(--gilt); color: #2f2f2f; font-weight: 700;
      border: none; border-radius: 8px; padding: 0.6rem 0.9rem; cursor: pointer;
    }
    .cart-button:hover { background: var(--hover); }

    /* Featured */
    .featured {
      padding: 1.5rem 2rem;
      border-bottom: 1px solid var(--frame);
      background: #fffdf7;
    }
    .featured h2 {
      font-family: 'Playfair Display', Georgia, serif; color: var(--velvet); margin: 0 0 1rem;
    }
    .featured-grid {
      display: grid; gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    }
    .featured-card {
      border: 1px solid var(--frame); border-radius: 12px; background: #fff;
      padding: 1rem; box-shadow: 0 4px 10px rgba(0,0,0,0.06);
    }
    .featured-card h3 { margin: 0 0 0.25rem; font-family: 'Playfair Display', Georgia, serif; color: var(--velvet); }
    .featured-card .price { font-weight: 700; color: var(--velvet); margin: 0.3rem 0; }
    .featured-card button {
      margin-top: 0.5rem; padding: 0.5rem 0.9rem; border: none; border-radius: 8px;
      background: var(--gilt); font-weight: 700; cursor: pointer;
    }
    .featured-card button:hover { background: var(--hover); }

    /* Categories */
    .category { padding: 1.5rem 2rem; border-bottom: 1px solid var(--frame); }
    .category-header { display: flex; align-items: baseline; justify-content: space-between; cursor: pointer; }
    .category-header h2 { font-family: 'Playfair Display', Georgia, serif; color: var(--velvet); font-size: clamp(1.2rem, 2.4vw, 1.6rem); margin: 0; }
    .category-header .hint { font-size: 0.9rem; color: #555; }
    .products {
      display: none; margin-top: 1rem; gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }
    .product {
      background: #fff; border: 1px solid var(--frame); border-radius: 12px;
      padding: 1rem; text-align: center; box-shadow: 0 4px 8px rgba(0,0,0,0.06);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .product:hover { transform: translateY(-3px); box-shadow: 0 8px 16px rgba(0,0,0,0.08); }
    .product h3 { font-family: 'Playfair Display', Georgia, serif; color: var(--velvet); margin: 0 0 0.25rem; font-size: 1.05rem; }
    .product p { color: #444; font-size: 0.92rem; margin: 0.25rem 0 0.5rem; }
    .price { font-weight: 700; color: var(--velvet); margin: 0.4rem 0; }
    .review { font-size: 0.85rem; color: #555; font-style: italic; margin: 0.35rem 0; }
    .quantity { display: inline-flex; align-items: center; gap: 0.3rem; margin: 0.35rem 0; }
    .qty-btn {
      border: 1px solid #ddd; background: #fafafa; border-radius: 6px;
      padding: 0.25rem 0.55rem; cursor: pointer; font-weight: 700;
    }
    .quantity input {
      width: 48px; text-align: center; padding: 0.35rem; border: 1px solid #ccc; border-radius: 6px;
    }
    .product button {
      margin-top: 0.5rem; padding: 0.55rem 1rem; background: var(--gilt);
      border: none; border-radius: 8px; color: #2f2f2f; font-weight: 700; cursor: pointer;
    }
    .product button:hover { background: var(--hover); }

    /* Cart overlay */
    .cart-overlay {
      position: fixed; top: 0; right: 0; width: min(380px, 92vw); height: 100%;
      background: #fff; box-shadow: -6px 0 18px rgba(0,0,0,0.2);
      padding: 1rem; display: none; flex-direction: column; z-index: 100;
      border-left: 4px solid var(--gilt);
    }
    .cart-overlay h3 { font-family: 'Playfair Display', Georgia, serif; margin: 0 0 1rem; color: var(--velvet); }
    .cart-items { flex: 1; overflow: auto; border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 0.5rem 0; }
    .cart-item { display: grid; grid-template-columns: 1fr auto; gap: 0.5rem; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid #f0f0f0; font-size: 0.95rem; }
    .cart-controls { display: inline-flex; gap: 0.4rem; align-items: center; }
    .cart-total { margin: 0.8rem 0 1rem; font-weight: 800; font-size: 1.05rem; }
    .overlay-actions { display: flex; gap: 0.6rem; }
    .overlay-actions button { flex: 1; padding: 0.7rem 1rem; border-radius: 8px; border: none; cursor: pointer; font-weight: 700; }
    .close-btn { background: #eee; }
    .checkout-btn { background: var(--gilt); }
    .checkout-btn:hover { background: var(--hover); }

    @media (max-width: 900px) {
      .topbar { grid-template-columns: 1fr 1fr auto; }
      .filters select, .filters input { width: 110px; }
    }
    @media (max-width: 640px) {
      .topbar { grid-template-columns: 1fr; }
      .filters { flex-wrap: wrap; }
    }
  </style>
</head>
<body>
  <header>✨ Modern Vintage Marketplace ✨</header>

  <div class="topbar">
    <div class="search">
      <input type="text" id="searchInput" placeholder="Search products..." aria-label="Search products" />
    </div>
    <div class="filters">
      <select id="filterCategory" aria-label="Filter by category">
        <option value="all">All categories</option>
        <option value="journals">Journals & Stationery</option>
        <option value="decor">Home Décor</option>
        <option value="drinkware">Drinkware</option>
        <option value="collectibles">Collectibles</option>
      </select>
      <input id="minPrice" type="number" min="0" placeholder="Min $" aria-label="Minimum price" />
      <input id="maxPrice" type="number" min="0" placeholder="Max $" aria-label="Maximum price" />
      <select id="sortBy" aria-label="Sort products">
        <option value="none">Sort: None</option>
        <option value="price-asc">Price: Low → High</option>
        <option value="price-desc">Price: High → Low</option>
        <option value="alpha-asc">Name: A → Z</option>
        <option value="alpha-desc">Name: Z → A</option>
        <option value="featured">Featured first</option>
      </select>
    </div>
    <button class="cart-button" id="cartButton" aria-haspopup="dialog" aria-controls="cartOverlay">
      🛒 Cart (<span id="cartCount">0</span>)
    </button>
  </div>

  <!-- Featured products -->
  <section class="featured" id="featured">
    <h2>Featured picks</h2>
    <div class="featured-grid" id="featuredGrid"></div>
  </section>

  <!-- Journals & Stationery -->
  <section class="category" data-cat="journals">
    <div class="category-header" data-target="journals">
      <h2>📖 Journals & Stationery</h2>
      <span class="hint">Tap to explore</span>
    </div>
    <div class="products" id="journals">
      <div class="product" data-name="Velvet Journal"><h3>Velvet Journal</h3><p>Elegant notebook with vintage flair.</p><div class="price"></div><div class="review"></div><div class="quantity"><button class="qty-btn" type="button">−</button><input type="number" value="1" min="1"><button class="qty-btn" type="button">+</button></div><button data-add="Velvet Journal" type="button">Add to Cart</button></div>
      <div class="product" data-name="Leather Journal"><h3>Leather Journal</h3><p>Classic design for timeless notes.</p><div class="price"></div><div class="review"></div><div class="quantity"><button class="qty-btn" type="button">−</button><input type="number" value="1" min="1"><button class="qty-btn" type="button">+</button></div><button data-add="Leather Journal" type="button">Add to Cart</button></div>
      <div class="product" data-name="Travel Notebook"><h3>Travel Notebook</h3><p>Compact companion for adventures.</p><div class="price"></div><div class="review"></div><div class="quantity"><button class="qty-btn" type="button">−</button><input type="number" value="1" min="1"><button class="qty-btn" type="button">+</button></div><button data-add="Travel Notebook" type="button">Add to Cart</button></div>
      <div class="product" data-name="Hardcover Sketchbook"><h3>Hardcover Sketchbook</h3><p>For artists and dreamers.</p><div class="price"></div><div class="review"></div><div class="quantity"><button class="qty-btn" type="button">−</button><input type="number" value="1" min="1"><button class="qty-btn" type="button">+</button></div><button data-add="Hardcover Sketchbook" type="button">Add to Cart</button></div>
      <div class="product" data-name="Vintage Diary"><h3>Vintage Diary</h3><p>Lockable, whimsical charm.</p><div class="price"></div><div class="review"></div><div class="quantity"><button class="qty-btn" type="button">−</button><input type="number" value="1" min="1"><button class="qty-btn" type="button">+</button></div><button data-add="Vintage Diary" type="button">Add to Cart</button></div>
      <div class="product" data-name="Calligraphy Set"><h3>Calligraphy Set</h3><p>Pens and ink for timeless writing.</p><div class="price"></div><div class="review"></div><div class="quantity"><button class="qty-btn" type="button">−</button><input type="number" value="1" min="1"><button class="qty-btn" type="button">+</button></div><button data-add="Calligraphy Set" type="button">Add to Cart</button></div>
    </div>
  </section>

  <!-- Home Décor -->
  <section class="category" data-cat="decor">
    <div class="category-header" data-target="decor">
      <h2>🏠 Home Décor</h2>
      <span class="hint">Tap to explore</span>
    </div>
    <div class="products" id="decor">
      <div class="product" data-name="Golden Lamp"><h3>Golden Lamp</h3><p>Warm light with antique charm.</p><div class="price"></div><div class="review"></div><div class="quantity"><button class="qty-btn" type="button">−</button><input type="number" value="1" min="1"><button class="qty-btn" type="button">+</button></div><button data-add="Golden Lamp" type="button">Add to Cart</button></div>
      <div class="product" data-name="Antique Clock"><h3>Antique Clock</h3><p>Vintage timepiece for your home.</p><div class="price"></div><div class="review"></div><div class="quantity"><button class="qty-btn" type="button">−</button><input type="number" value="1" min="1"><button class="qty-btn" type="button">+</button></div><button data-add="Antique Clock" type="button">Add to Cart</button></div>
      <div class="product" data-name="Velvet Cushion Set"><h3>Velvet Cushion Set</h3><p>Plush vintage accents.</p><div class="price"></div><div class="review"></div><div class="quantity"><button class="qty-btn" type="button">−</button><input type="number" value="1" min="1"><button class="qty-btn" type="button">+</button></div><button data-add="Velvet Cushion Set" type="button">Add to Cart</button></div>
      <div class="product" data-name="Framed Theater Poster"><h3>Framed Theater Poster</h3><p>Art for your walls.</p><div class="price"></div><div class="review"></div><div class="quantity"><button class="qty-btn" type="button">−</button><input type="number" value="1" min="1"><button class="qty-btn" type="button">+</button></div><button data-add="Framed Theater Poster" type="button">Add to Cart</button></div>
      <div class="product" data-name="Ornate Mirror"><h3>Ornate Mirror</h3><p>Gilded frame, old-world feel.</p><div class="price"></div><div class="review"></div><div class="quantity"><button class="qty-btn" type="button">−</button><input type="number" value="1" min="1"><button class="qty-btn" type="button">+</button></div><button data-add="Ornate Mirror" type="button">Add to Cart</button></div>
      <div class="product" data-name="Candlestick Pair"><h3>Candlestick Pair</h3><p>Brass with a warm glow.</p><div class="price"></div><div class="review"></div><div class="quantity"><button class="qty-btn" type="button">−</button><input type="number" value="1" min="1"><button class="qty-btn" type="button">+</button></div><button data-add="Candlestick Pair" type="button">Add to Cart</button></div>
    </div>
  </section>

  <!-- Drinkware -->
  <section class="category" data-cat="drinkware">
    <div class="category-header" data-target="drinkware">
      <h2>☕ Drinkware</h2>
      <span class="hint">Tap to explore</span>
    </div>
    <div class="products" id="drinkware">
      <div class="product" data-name="Whimsical Mug"><h3>Whimsical Mug</h3><p>Start your day with nostalgia.</p><div class="price"></div><div class="review"></div><div class="quantity"><button class="qty-btn" type="button">−</button><input type="number" value="1" min="1"><button class="qty-btn" type="button">+</button></div><button data-add="Whimsical Mug" type="button">Add to Cart</button></div>
      <div class="product" data-name="Vintage Teacup Set"><h3>Vintage Teacup Set</h3><p>Elegant tea moments, timeless style.</p><div class="price"></div><div class="review"></div><div class="quantity"><button class="qty-btn" type="button">−</button><input type="number" value="1" min="1"><button class="qty-btn" type="button">+</button></div><button data-add="Vintage Teacup Set" type="button">Add to Cart</button></div>
      <div class="product" data-name="Crystal Wine Glasses"><h3>Crystal Wine Glasses</h3><p>Refined sparkle for dining.</p><div class="price"></div><div class="review"></div><div class="quantity"><button class="qty-btn" type="button">−</button><input type="number" value="1" min="1"><button class="qty-btn" type="button">+</button></div><button data-add="Crystal Wine Glasses" type="button">Add to Cart</button></div>
      <div class="product" data-name="Copper Coffee Pot"><h3>Copper Coffee Pot</h3><p>Artisanal brewing meets charm.</p><div class="price"></div><div class="review"></div><div class="quantity"><button class="qty-btn" type="button">−</button><input type="number" value="1" min="1"><button class="qty-btn" type="button">+</button></div><button data-add="Copper Coffee Pot" type="button">Add to Cart</button></div>
      <div class="product" data-name="Porcelain Espresso Cups"><h3>Porcelain Espresso Cups</h3><p>Small cups, big elegance.</p><div class="price"></div><div class="review"></div><div class="quantity"><button class="qty-btn" type="button">−</button><input type="number" value="1" min="1"><button class="qty-btn" type="button">+</button></div><button data-add="Porcelain Espresso Cups" type="button">Add to Cart</button></div>
      <div class="product" data-name="Engraved Water Pitcher"><h3>Engraved Water Pitcher</h3><p>Practical yet decorative.</p><div class="price"></div><div class="review"></div><div class="quantity"><button class="qty-btn" type="button">−</button><input type="number" value="1" min="1"><button class="qty-btn" type="button">+</button></div><button data-add="Engraved Water Pitcher" type="button">Add to Cart</button></div>
    </div>
  </section>

  <!-- Collectibles -->
  <section class="category" data-cat="collectibles">
    <div class="category-header" data-target="collectibles">
      <h2>🎭 Collectibles</h2>
      <span class="hint">Tap to explore</span>
    </div>
    <div class="products" id="collectibles">
      <div class="product" data-name="Vintage Poster"><h3>Vintage Poster</h3><p>Classic artwork for your walls.</p><div class="price"></div><div class="review"></div><div class="quantity"><button class="qty-btn" type="button">−</button><input type="number" value="1" min="1"><button class="qty-btn" type="button">+</button></div><button data-add="Vintage Poster" type="button">Add to Cart</button></div>
      <div class="product" data-name="Stage Mask Replica"><h3>Stage Mask Replica</h3><p>A whimsical nod to theater history.</p><div class="price"></div><div class="review"></div><div class="quantity"><button class="qty-btn" type="button">−</button><input type="number" value="1" min="1"><button class="qty-btn" type="button">+</button></div><button data-add="Stage Mask Replica" type="button">Add to Cart</button></div>
      <div class="product" data-name="Miniature Spotlight Lamp"><h3>Miniature Spotlight Lamp</h3><p>Desk collectible with glow.</p><div class="price"></div><div class="review"></div><div class="quantity"><button class="qty-btn" type="button">−</button><input type="number" value="1" min="1"><button class="qty-btn" type="button">+</button></div><button data-add="Miniature Spotlight Lamp" type="button">Add to Cart</button></div>
      <div class="product" data-name="Playbill Archive Set"><h3>Playbill Archive Set</h3><p>Faux vintage programs.</p><div class="price"></div><div class="review"></div><div class="quantity"><button class="qty-btn" type="button">−</button><input type="number" value="1" min="1"><button class="qty-btn" type="button">+</button></div><button data-add="Playbill Archive Set" type="button">Add to Cart</button></div>
      <div class="product" data-name="Orchestra Baton Replica"><h3>Orchestra Baton Replica</h3><p>For your inner conductor.</p><div class="price"></div><div class="review"></div><div class="quantity"><button class="qty-btn" type="button">−</button><input type="number" value="1" min="1"><button class="qty-btn" type="button">+</button></div><button data-add="Orchestra Baton Replica" type="button">Add to Cart</button></div>
      <div class="product" data-name="Ticket Stub Shadowbox"><h3>Ticket Stub Shadowbox</h3><p>Nostalgic display piece.</p><div class="price"></div><div class="review"></div><div class="quantity"><button class="qty-btn" type="button">−</button><input type="number" value="1" min="1"><button class="qty-btn" type="button">+</button></div><button data-add="Ticket Stub Shadowbox" type="button">Add to Cart</button></div>
    </div>
  </section>

  <!-- Cart Overlay -->
  <aside class="cart-overlay" id="cartOverlay" role="dialog" aria-label="Shopping cart">
    <h3>Your Cart</h3>
    <div class="cart-items" id="cartItems"></div>
    <div class="cart-total">Total: $<span id="cartTotal">0.00</span></div>
    <div class="overlay-actions">
      <button class="close-btn" id="closeCart" type="button">Close</button>
      <button class="checkout-btn" id="checkout" type="button">Checkout</button>
    </div>
  </aside>

  <script>
    // Helpers
    const fmt = (n) => Number(n).toFixed(2);
    const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const choose = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // Cache DOM
    const headers = document.querySelectorAll('.category-header');
    const sections = document.querySelectorAll('.products');
    const searchInput = document.getElementById('searchInput');
    const filterCategory = document.getElementById('filterCategory');
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    const sortBy = document.getElementById('sortBy');

    // Accordion (one open at a time)
    function openCategory(id) {
      sections.forEach(sec => {
        sec.style.display = sec.id === id ? 'grid' : 'none';
      });
    }
    headers.forEach(h => {
      h.addEventListener('click', () => {
        const target = h.dataset.target;
        const sec = document.getElementById(target);
        const isOpen = sec.style.display === 'grid';
        sections.forEach(s => s.style.display = 'none');
        sec.style.display = isOpen ? 'none' : 'grid';
      });
    });

    // Random pricing ($10–$100) and reviews on load
    const reviewPool = [
      '⭐️⭐️⭐️⭐️⭐️ — “Feels like a treasure from another era.”',
      '⭐️⭐️⭐️⭐️ — “Elegant and reliable — I smile every time I use it.”',
      '⭐️⭐️⭐️⭐️⭐️ — “Quality with character. Instant favorite.”',
      '⭐️⭐️⭐️⭐️ — “A timeless touch to my daily ritual.”',
      '⭐️⭐️⭐️⭐️⭐️ — “Crafted with care — you can feel it.”'
    ];
    document.querySelectorAll('.product').forEach(prod => {
      const price = randInt(10, 100);
      prod.dataset.price = String(price);
      prod.querySelector('.price').textContent = `$${fmt(price)}`;
      const r = prod.querySelector('.review');
      if (r) r.textContent = choose(reviewPool);
    });

    // Quantity controls
    document.querySelectorAll('.quantity').forEach(q => {
      const [minusBtn, input, plusBtn] = [q.querySelectorAll('.qty-btn')[0], q.querySelector('input'), q.querySelectorAll('.qty-btn')[1]];
      minusBtn.addEventListener('click', () => { input.value = Math.max(1, parseInt(input.value || '1', 10) - 1); });
      plusBtn.addEventListener('click', () => { input.value = Math.min(999, parseInt(input.value || '1', 10) + 1); });
    });

    // Cart system
    const cartButton = document.getElementById('cartButton');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCartBtn = document.getElementById('closeCart');
    const checkoutBtn = document.getElementById('checkout');
    const cartCountEl = document.getElementById('cartCount');
    const cartItemsEl = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');
    let cart = []; // { name, price, qty }

    function toggleCart(show = null) {
      const isOpen = cartOverlay.style.display === 'flex';
      const next = show === null ? !isOpen : show;
      cartOverlay.style.display = next ? 'flex' : 'none';
    }
    cartButton.addEventListener('click', () => toggleCart());
    closeCartBtn.addEventListener('click', () => toggleCart(false));

    function addToCart(name, qty = 1) {
      const prod = [...document.querySelectorAll('.product')].find(p => p.dataset.name === name);
      if (!prod) return;
      const price = parseFloat(prod.dataset.price);
      const existing = cart.find(i => i.name === name);
      if (existing) { existing.qty += qty; } else { cart.push({ name, price, qty }); }
      renderCart();
    }

    function removeOne(name) {
      const idx = cart.findIndex(i => i.name === name);
      if (idx === -1) return;
      cart[idx].qty -= 1;
      if (cart[idx].qty <= 0) cart.splice(idx, 1);
      renderCart();
    }

    function renderCart() {
      cartItemsEl.innerHTML = '';
      let total = 0;
      cart.forEach(item => {
        total += item.price * item.qty;
        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = `
          <span>${item.name}</span>
          <div class="cart-controls">
            <button class="qty-btn" type="button" aria-label="Decrease">−</button>
            <span>${item.qty}</span>
            <button class="qty-btn" type="button" aria-label="Increase">+</button>
            <span style="min-width:80px; text-align:right;">$${fmt(item.price * item.qty)}</span>
          </div>
        `;
        const buttons = row.querySelectorAll('button.qty-btn');
        buttons[0].addEventListener('click', () => removeOne(item.name));
        buttons[1].addEventListener('click', () => addToCart(item.name, 1));
        cartItemsEl.appendChild(row);
      });
      cartTotalEl.textContent = fmt(total);
      cartCountEl.textContent = cart.reduce((sum, i) => sum + i.qty, 0);
    }

    // Bind add-to-cart buttons to use quantity input
    document.querySelectorAll('button[data-add]').forEach(btn => {
      btn.addEventListener('click', () => {
        const prod = btn.closest('.product');
        const qty = parseInt(prod.querySelector('.quantity input').value || '1', 10);
        addToCart(btn.dataset.add, Math.max(1, qty));
      });
    });

    // Featured products (random 3 picks)
    function buildFeatured() {
      const all = Array.from(document.querySelectorAll('.product'));
      const picks = [];
      const pool = all.slice(); // copy
      while (picks.length < 3 && pool.length) {
        const idx = randInt(0, pool.length - 1);
        picks.push(pool.splice(idx, 1)[0]);
      }
      const grid = document.getElementById('featuredGrid');
      grid.innerHTML = '';
      picks.forEach(p => {
        const card = document.createElement('div');
        card.className = 'featured-card';
        card.dataset.name = p.dataset.name;
        const price = parseFloat(p.dataset.price);
        card.innerHTML = `
          <h3>${p.dataset.name}</h3>
          <p>${p.querySelector('p').textContent}</p>
          <div class="price">$${fmt(price)}</div>
          <button type="button">Shop now</button>
        `;
        card.querySelector('button').addEventListener('click', () => {
          const sec = p.closest('.products');
          openCategory(sec.id);
          p.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        grid.appendChild(card);
      });
    }

    // Search + filters + sort
    function applySearchAndFilters() {
      const q = (searchInput.value || '').trim().toLowerCase();
      const cat = filterCategory.value;
      const min = minPrice.value === '' ? -Infinity : parseFloat(minPrice.value);
      const max = maxPrice.value === '' ? Infinity : parseFloat(maxPrice.value);

      // Determine which sections should be visible based on category
      sections.forEach(sec => {
        const sectionMatchesCat = (cat === 'all' || sec.id === cat);
        let visibleCount = 0;
        // Control each product visibility
        sec.querySelectorAll('.product').forEach(prod => {
          const name = prod.dataset.name.toLowerCase();
          const price = parseFloat(prod.dataset.price);
          const matches =
            (q === '' || name.includes(q)) &&
            price >= min && price <= max &&
            sectionMatchesCat;
          prod.style.display = matches ? '' : 'none';
          if (matches) visibleCount++;
        });
        // Section visibility
        if (cat === 'all' && q === '' && min === -Infinity && max === Infinity) {
          // No filters: keep sections closed until user opens one
          sec.style.display = sec.style.display; // no change
        } else {
          sec.style.display = visibleCount > 0 ? 'grid' : 'none';
        }
      });

      // Sort visible cards within visible sections
      const sortMode = sortBy.value;
      if (sortMode !== 'none') {
        ['journals','decor','drinkware','collectibles'].forEach(id => {
          const sec = document.getElementById(id);
          if (sec.style.display === 'none') return;
          const cards = Array.from(sec.querySelectorAll('.product')).filter(p => p.style.display !== 'none');

          switch (sortMode) {
            case 'price-asc':
              cards.sort((a,b) => parseFloat(a.dataset.price) - parseFloat(b.dataset.price)); break;
            case 'price-desc':
              cards.sort((a,b) => parseFloat(b.dataset.price) - parseFloat(a.dataset.price)); break;
            case 'alpha-asc':
              cards.sort((a,b) => a.dataset.name.localeCompare(b.dataset.name)); break;
            case 'alpha-desc':
              cards.sort((a,b) => b.dataset.name.localeCompare(a.dataset.name)); break;
            case 'featured': {
              const featuredNames = Array.from(document.querySelectorAll('#featuredGrid .featured-card')).map(el => el.dataset.name);
              cards.sort((a,b) => {
                const av = featuredNames.includes(a.dataset.name) ? -1 : 0;
                const bv = featuredNames.includes(b.dataset.name) ? -1 : 0;
                return av - bv;
              });
              break;
            }
          }
          cards.forEach(card => sec.appendChild(card));
        });
      }

      // If there’s a search query and no category selected, auto-open sections that have matches
      if (q.length && cat === 'all') {
        sections.forEach(sec => {
          const hasVisible = Array.from(sec.querySelectorAll('.product')).some(p => p.style.display !== 'none');
          sec.style.display = hasVisible ? 'grid' : 'none';
        });
      }
    }

    // Bind filters
    [searchInput, filterCategory, minPrice, maxPrice, sortBy].forEach(el => {
      el.addEventListener('input', applySearchAndFilters);
      el.addEventListener('change', applySearchAndFilters);
    });

    // Initialize featured and leave categories closed by default
    buildFeatured();
    // Do not auto-run filters; keep initial state simple (closed). Run once to normalize NaN handling.
    applySearchAndFilters();

    // Checkout (demo)
    checkoutBtn.addEventListener('click', () => {
      const total = cartTotalEl.textContent;
      if (!cart.length) { alert('Your cart is empty.'); return; }
      alert(`Checkout demo: Your total is $${total}.\nIn a real site, you’d proceed to shipping & payment.`);
    });
  </script>
</body>
</html>