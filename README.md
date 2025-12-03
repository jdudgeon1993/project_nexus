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
    .topbar {
      display: flex; gap: 1rem; align-items: center; justify-content: space-between;
      padding: 1rem 2rem; border-bottom: 1px solid var(--frame);
      background: var(--bg); position: sticky; top: 0; z-index: 10;
    }
    .search { flex: 1; max-width: 640px; }
    .search input {
      width: 100%; padding: 0.6rem 0.8rem; border: 1px solid #ccc; border-radius: 8px; font-size: 0.95rem;
    }
    .cart-button {
      display: inline-flex; align-items: center; gap: 0.5rem;
      background: var(--gilt); color: #2f2f2f; font-weight: 700;
      border: none; border-radius: 8px; padding: 0.6rem 0.9rem; cursor: pointer;
    }
    .cart-button:hover { background: var(--hover); }

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
    .product button {
      margin-top: 0.5rem; padding: 0.55rem 1rem; background: var(--gilt);
      border: none; border-radius: 8px; color: #2f2f2f; font-weight: 700; cursor: pointer;
    }
    .product button:hover { background: var(--hover); }

    .cart-overlay {
      position: fixed; top: 0; right: 0; width: min(360px, 92vw); height: 100%;
      background: #fff; box-shadow: -6px 0 18px rgba(0,0,0,0.2);
      padding: 1rem; display: none; flex-direction: column; z-index: 100;
      border-left: 4px solid var(--gilt);
    }
    .cart-overlay h3 { font-family: 'Playfair Display', Georgia, serif; margin: 0 0 1rem; color: var(--velvet); }
    .cart-items { flex: 1; overflow: auto; border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 0.5rem 0; }
    .cart-item { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid #f0f0f0; font-size: 0.95rem; }
    .cart-controls { display: flex; gap: 0.4rem; align-items: center; }
    .qty-btn {
      border: 1px solid #ddd; background: #fafafa; border-radius: 6px;
      padding: 0.2rem 0.5rem; cursor: pointer; font-weight: 700;
    }
    .cart-total { margin: 0.8rem 0 1rem; font-weight: 800; font-size: 1.05rem; }
    .overlay-actions { display: flex; gap: 0.6rem; }
    .overlay-actions button { flex: 1; padding: 0.7rem 1rem; border-radius: 8px; border: none; cursor: pointer; font-weight: 700; }
    .close-btn { background: #eee; }
    .checkout-btn { background: var(--gilt); }
    .checkout-btn:hover { background: var(--hover); }

    @media (max-width: 720px) {
      .topbar { padding: 0.75rem 1rem; }
      .category { padding: 1rem; }
    }
  </style>
</head>
<body>
  <header>✨ Modern Vintage Marketplace ✨</header>

  <div class="topbar">
    <div class="search">
      <input type="text" id="searchInput" placeholder="Search products..." aria-label="Search products" />
    </div>
    <button class="cart-button" id="cartButton" aria-haspopup="dialog" aria-controls="cartOverlay">
      🛒 Cart (<span id="cartCount">0</span>)
    </button>
  </div>

  <!-- Journals & Stationery -->
  <section class="category">
    <div class="category-header" data-target="journals">
      <h2>📖 Journals & Stationery</h2>
      <span class="hint">Tap to explore</span>
    </div>
    <div class="products" id="journals">
      <div class="product" data-name="Velvet Journal"><h3>Velvet Journal</h3><p>Elegant notebook with vintage flair.</p><div class="price"></div><button data-add="Velvet Journal">Add to Cart</button></div>
      <div class="product" data-name="Leather Journal"><h3>Leather Journal</h3><p>Classic design for timeless notes.</p><div class="price"></div><button data-add="Leather Journal">Add to Cart</button></div>
      <div class="product" data-name="Travel Notebook"><h3>Travel Notebook</h3><p>Compact companion for adventures.</p><div class="price"></div><button data-add="Travel Notebook">Add to Cart</button></div>
      <div class="product" data-name="Hardcover Sketchbook"><h3>Hardcover Sketchbook</h3><p>For artists and dreamers.</p><div class="price"></div><button data-add="Hardcover Sketchbook">Add to Cart</button></div>
      <div class="product" data-name="Vintage Diary"><h3>Vintage Diary</h3><p>Lockable, whimsical charm.</p><div class="price"></div><button data-add="Vintage Diary">Add to Cart</button></div>
      <div class="product" data-name="Calligraphy Set"><h3>Calligraphy Set</h3><p>Pens and ink for timeless writing.</p><div class="price"></div><button data-add="Calligraphy Set">Add to Cart</button></div>
    </div>
  </section>

  <!-- Home Décor -->
  <section class="category">
    <div class="category-header" data-target="decor">
      <h2>🏠 Home Décor</h2>
      <span class="hint">Tap to explore</span>
    </div>
    <div class="products" id="decor">
      <div class="product" data-name="Golden Lamp"><h3>Golden Lamp</h3><p>Warm light with antique charm.</p><div class="price"></div><button data-add="Golden Lamp">Add to Cart</button></div>
      <div class="product" data-name="Antique Clock"><h3>Antique Clock</h3><p>Vintage timepiece for your home.</p><div class="price"></div><button data-add="Antique Clock">Add to Cart</button></div>
      <div class="product" data-name="Velvet Cushion Set"><h3>Velvet Cushion Set</h3><p>Plush vintage accents.</p><div class="price"></div><button data-add="Velvet Cushion Set">Add to Cart</button></div>
      <div class="product" data-name="Framed Theater Poster"><h3>Framed Theater Poster</h3><p>Art for your walls.</p><div class="price"></div><button data-add="Framed Theater Poster">Add to Cart</button></div>
      <div class="product" data-name="Ornate Mirror"><h3>Ornate Mirror</h3><p>Gilded frame, old-world feel.</p><div class="price"></div><button data-add="Ornate Mirror">Add to Cart</button></div>
      <div class="product" data-name="Candlestick Pair"><h3>Candlestick Pair</h3><p>Brass with a warm glow.</p><div class="price"></div><button data-add="Candlestick Pair">Add to Cart</button></div>
    </div>
  </section>

  <!-- Drinkware -->
  <section class="category">
    <div class="category-header" data-target="drinkware">
      <h2>☕ Drinkware</h2>
      <span class="hint">Tap to explore</span>
    </div>
    <div class="products" id="drinkware">
      <div class="product" data-name="Whimsical Mug"><h3>Whimsical Mug</h3><p>Start your day with nostalgia.</p><div class="price"></div><button data-add="Whimsical Mug">Add to Cart</button></div>
      <div class="product" data-name="Vintage Teacup Set"><h3>Vintage Teacup Set</h3><p>Elegant tea moments, timeless style.</p><div class="price"></div><button data-add="Vintage Teacup Set">Add to Cart</button></div>
      <div class="product" data-name="Crystal Wine Glasses"><h3>Crystal Wine Glasses</h3><p>Refined sparkle for dining.</p><div class="price"></div><button data-add="Crystal Wine Glasses">Add to Cart</button></div>
      <div class="product" data-name="Copper Coffee Pot"><h3>Copper Coffee Pot</h3><p>Artisanal brewing meets charm.</p><div class="price"></div><button data-add="Copper Coffee Pot">Add to Cart</button></div>
      <div class="product" data-name="Porcelain Espresso Cups"><h3>Porcelain Espresso Cups</h3><p>Small cups, big elegance.</p><div class="price"></div><button data-add="Porcelain Espresso Cups">Add to Cart</button></div>
      <div class="product" data-name="Engraved Water Pitcher"><h3>Engraved Water Pitcher</h3><p>Practical yet decorative.</p><div class="price"></div><button data-add="Engraved Water Pitcher">Add to Cart</button></div>
    </div>
  </section>

  <!-- Collectibles -->
  <section class="category">
    <div class="category-header" data-target="collectibles">
      <h2>🎭 Collectibles</h2>
      <span class="hint">Tap to explore</span>
    </div>
    <div class="products" id="collectibles">
      <div class="product" data-name="Vintage Poster"><h3>Vintage Poster</h3><p>Classic artwork for your walls.</p><div class="price"></div><button data-add="Vintage Poster">Add to Cart</button></div>
      <div class="product" data-name="Stage Mask Replica"><h3>Stage Mask Replica</h3><p>A whimsical nod to theater history.</p><div class="price"></div><button data-add="Stage Mask Replica">Add to Cart</button></div>
      <div class="product" data-name="Miniature Spotlight Lamp"><h3>Miniature Spotlight Lamp</h3><p>Desk collectible with glow.</p><div class="price"></div><button data-add="Miniature Spotlight Lamp">Add to Cart</button></div>
      <div class="product" data-name="Playbill Archive Set"><h3>Playbill Archive Set</h3><p>Faux vintage programs.</p><div class="price"></div><button data-add="Playbill Archive Set">Add to Cart</button></div>
      <div class="product" data-name="Orchestra Baton Replica"><h3>Orchestra Baton Replica</h3><p>For your inner conductor.</p><div class="price"></div><button data-add="Orchestra Baton Replica">Add to Cart</button></div>
      <div class="product" data-name="Ticket Stub Shadowbox"><h3>Ticket Stub Shadowbox</h3><p>Nostalgic display piece.</p><div class="price"></div><button data-add="Ticket Stub Shadowbox">Add to Cart</button></div>
    </div>
  </section>

  <!-- Cart Overlay -->
  <aside class="cart-overlay" id="cartOverlay" role="dialog" aria-label="Shopping cart">
    <h3>Your Cart</h3>
    <div class="cart-items" id="cartItems"></div>
    <div class="cart-total">Total: $<span id="cartTotal">0.00</span></div>
    <div class="overlay-actions">
      <button class="close-btn" id="closeCart">Close</button>
      <button class="checkout-btn" id="checkout">Checkout</button>
    </div>
  </aside>

  <script>
    // Currency formatting
    const fmt = (n) => Number(n).toFixed(2);

    // Accordion: open one category at a time
    const headers = document.querySelectorAll('.category-header');
    const sections = document.querySelectorAll('.products');
    headers.forEach(h => {
      h.addEventListener('click', () => {
        const target = h.dataset.target;
        sections.forEach(sec => {
          sec.style.display = (sec.id === target && sec.style.display !== 'grid') ? 'grid' : 'none';
        });
      });
    });

    // Assign random prices ($10–$100) on load
    document.querySelectorAll('.product').forEach(prod => {
      const price = Math.floor(Math.random() * 91) + 10; // inclusive 10..100
      prod.dataset.price = String(price);
      const priceEl = prod.querySelector('.price');
      priceEl.textContent = `$${fmt(price)}`;
    });

    // Cart system
    const cartButton = document.getElementById('cartButton');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCartBtn = document.getElementById('closeCart');
    const checkoutBtn = document.getElementById('checkout');
    const cartCountEl = document.getElementById('cartCount');
    const cartItemsEl = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');

    let cart = []; // items: { name, price, qty }

    function toggleCart(show = null) {
      const isOpen = cartOverlay.style.display === 'flex';
      const next = show === null ? !isOpen : show;
      cartOverlay.style.display = next ? 'flex' : 'none';
    }
    cartButton.addEventListener('click', () => toggleCart());
    closeCartBtn.addEventListener('click', () => toggleCart(false));

    function addToCart(name) {
      const prod = [...document.querySelectorAll('.product')].find(p => p.dataset.name === name);
      if (!prod) return;
      const price = parseFloat(prod.dataset.price);
      const existing = cart.find(i => i.name === name);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ name, price, qty: 1 });
      }
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
            <button class="qty-btn" aria-label="Decrease quantity">−</button>
            <span>${item.qty}</span>
            <button class="qty-btn" aria-label="Increase quantity">+</button>
            <span>$${fmt(item.price * item.qty)}</span>
          </div>
        `;
        const buttons = row.querySelectorAll('button.qty-btn');
        buttons[0].addEventListener('click', () => removeOne(item.name));
        buttons[1].addEventListener('click', () => addToCart(item.name));
        cartItemsEl.appendChild(row);
      });
      cartTotalEl.textContent = fmt(total);
      cartCountEl.textContent = cart.reduce((sum, i) => sum + i.qty, 0);
    }

    // Bind add-to-cart buttons
    document.querySelectorAll('button[data-add]').forEach(btn => {
      btn.addEventListener('click', () => addToCart(btn.dataset.add));
    });

    // Search: filter products; open all while searching, collapse when cleared
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase();
      document.querySelectorAll('.product').forEach(prod => {
        const name = prod.dataset.name.toLowerCase();
        prod.style.display = name.includes(q) ? '' : 'none';
      });
      if (q.length) {
        sections.forEach(sec => sec.style.display = 'grid');
      } else {
        sections.forEach(sec => sec.style.display = 'none');
      }
    });

    // Fake checkout
    checkoutBtn.addEventListener('click', () => {
      const total = cartTotalEl.textContent;
      if (!cart.length) { alert('Your cart is empty.'); return; }
      alert(`Checkout is not implemented in this demo.\nYour total is $${total}.`);
    });
  </script>
</body>
</html>