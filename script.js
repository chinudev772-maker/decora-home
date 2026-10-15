'use strict';

/* ==========================================================================
   DECORA HOME — script.js
   1. Catalogue data   (edit this part to change products and categories)
   2. Saved state      (cart and wishlist in LocalStorage)
   3. Helpers
   4. Rendering
   5. Actions          (every clickable thing is a data-action="..." in the HTML)
   6. Forms
   7. Start-up
   ========================================================================== */


/* ---------- 1. Catalogue data ------------------------------------------- */

// Builds an Unsplash image address from a photo id, cropped to the size we need.
const photo = (id, w = 720, h = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=75`;

const FREE_SHIPPING_ABOVE = 999; // orders above this subtotal ship free
const SHIPPING_FEE = 99;
const MAX_QTY = 10;              // most of one product a cart can hold

// The seven category tiles on the homepage. Each product's "category" must match one of these names.
const CATEGORIES = [
  { name: 'Living Room', image: photo('1633505899118-4ca6bd143043', 1100, 700) },
  { name: 'Bedroom',     image: photo('1616486029423-aaa4789e8c9a', 700, 700) },
  { name: 'Lighting',    image: photo('1636368208791-17b81ed832d2', 700, 700) },
  { name: 'Plants',      image: photo('1618220179428-22790b461013', 700, 700) },
  { name: 'Vases',       image: photo('1597696929736-6d13bed8e6a8', 700, 700) },
  { name: 'Wall Art',    image: photo('1615873968403-89e068629265', 700, 700) },
  { name: 'Storage',     image: photo('1766047125625-7d271a7238e9', 700, 700) },
];

// A group is a filter that shows several categories at once (the "Decor" menu link).
const GROUPS = { Decor: ['Vases', 'Wall Art', 'Plants'] };

// tags: 'featured', 'best' and 'new' decide which homepage section shows the product.
// reviews is the number of reviews, and is what "Most Popular" sorts by.
const PRODUCTS = [
  { id: 1, name: 'Ivory Tufted Accent Chair', category: 'Living Room', price: 16999, rating: 4.8, reviews: 214, tags: ['featured'],
    image: photo('1567538096630-e0c55bd6374c'),
    description: 'A button-tufted accent chair in soft ivory upholstery on slim tapered legs. A quiet statement piece for a reading corner or a bedroom.' },
  { id: 2, name: 'Oslo Swivel Lounge Chair', category: 'Living Room', price: 14499, rating: 4.6, reviews: 132, tags: [],
    image: photo('1580480055273-228ff5388ef8'),
    description: 'A Scandinavian-style lounge chair with a curved, fabric-covered seat on a solid wood swivel base. Comfortable for long evenings with a book.' },
  { id: 3, name: 'Tan Leather Armchair', category: 'Living Room', price: 24999, rating: 4.7, reviews: 98, tags: [],
    image: photo('1579656381229-15bdb188da49'),
    description: 'A deep, generously padded armchair in tan leather that softens and gains character with age.' },
  { id: 4, name: 'Hairpin Leg Wooden Coffee Table', category: 'Living Room', price: 8999, rating: 4.7, reviews: 188, tags: [],
    image: photo('1581428982868-e410dd047a90'),
    description: 'A solid wood top on black hairpin legs. Light and airy to look at, and sturdy enough for everyday living.' },
  { id: 5, name: 'Glass-Top Wooden Coffee Table', category: 'Living Room', price: 13499, rating: 4.5, reviews: 96, tags: ['new'],
    image: photo('1647967527216-adea2f078e07'),
    description: 'A tempered glass top over a warm wooden frame, with an open shelf below for books, trays and remotes.' },

  { id: 6, name: 'Pure Linen Cushion', category: 'Bedroom', price: 899, rating: 4.6, reviews: 341, tags: [],
    image: photo('1691256676366-370303d55b61'),
    description: 'A breathable washed-linen cushion in ivory with a hidden zip. The insert is included. 45 × 45 cm.' },
  { id: 7, name: 'Textured Cushion Set of 3', category: 'Bedroom', price: 2199, rating: 4.5, reviews: 157, tags: [],
    image: photo('1538577880403-f9998e75dd06'),
    description: 'Three mix-and-match cushions in woven textures and soft patterns, made to layer on a sofa or a bed.' },
  { id: 8, name: 'Chunky Knit Throw Blanket', category: 'Bedroom', price: 2799, rating: 4.9, reviews: 438, tags: ['best'],
    image: photo('1674475760738-8c7af859f821'),
    description: 'A hand-knitted chunky throw in a soft neutral shade. Drape it over a sofa arm or the foot of the bed.' },
  { id: 9, name: 'Solid Wood Bedside Table', category: 'Bedroom', price: 6499, rating: 4.7, reviews: 121, tags: [],
    image: photo('1652155205433-52179159a15e'),
    description: 'A compact bedside table in warm solid wood with one drawer and softly rounded edges.' },

  { id: 10, name: 'Textured Ceramic Table Lamp', category: 'Lighting', price: 3299, rating: 4.8, reviews: 302, tags: ['featured'],
    image: photo('1580130281320-0ef0754f2bf7'),
    description: 'A hand-textured ceramic base with a cream fabric shade that gives a warm, diffused glow. Bulb not included.' },
  { id: 11, name: 'Wooden Tripod Table Lamp', category: 'Lighting', price: 2899, rating: 4.6, reviews: 174, tags: [],
    image: photo('1517991104123-1d56a6e81ed9'),
    description: 'A table lamp on a natural wood tripod base with a drum shade. Lovely on a console or a bedside table.' },
  { id: 12, name: 'Arc Floor Lamp', category: 'Lighting', price: 7499, rating: 4.7, reviews: 143, tags: [],
    image: photo('1675767528117-963ce219b52a'),
    description: 'A slim arched floor lamp with a dome shade that reaches over a sofa or an armchair.' },
  { id: 13, name: 'Paper Column Floor Lamp', category: 'Lighting', price: 5299, rating: 4.4, reviews: 88, tags: [],
    image: photo('1673939859210-23d8444237ff'),
    description: 'A tall column lamp with a paper shade that fills a corner with soft, even light.' },
  { id: 14, name: 'Copper Pendant Light Cluster', category: 'Lighting', price: 8499, rating: 4.8, reviews: 119, tags: ['new'],
    image: photo('1540932239986-30128078f3c5'),
    description: 'A cluster of brushed-copper pendant shades hung at different heights. Made for a dining table or a kitchen island.' },

  { id: 15, name: 'Concrete Planter Duo', category: 'Plants', price: 1799, rating: 4.6, reviews: 226, tags: [],
    image: photo('1463320898484-cdee8141c787'),
    description: 'Two cast planters in matte grey, each with a drainage hole. Plants are not included.' },
  { id: 16, name: 'Ribbed White Ceramic Planter', category: 'Plants', price: 749, rating: 4.7, reviews: 512, tags: ['best'],
    image: photo('1509423350716-97f9360b4e09'),
    description: 'A glazed white ceramic pot sized for succulents and small houseplants. The plant is not included.' },
  { id: 17, name: 'Macramé Hanging Planter', category: 'Plants', price: 899, rating: 4.5, reviews: 289, tags: [],
    image: photo('1513491952389-d52ceeb8c9d3'),
    description: 'A hand-knotted cotton macramé hanger with a ceramic pot. The plant is not included.' },

  { id: 18, name: 'Donut Ceramic Vase', category: 'Vases', price: 1299, rating: 4.9, reviews: 367, tags: ['featured'],
    image: photo('1643569556871-91ec60671ed7'),
    description: 'A sculptural ring-shaped vase in matte cream ceramic. Beautiful with dried stems, and just as good empty.' },
  { id: 19, name: 'Stoneware Vase Set of 3', category: 'Vases', price: 2499, rating: 4.7, reviews: 153, tags: [],
    image: photo('1631125915973-e0d155a14e4e'),
    description: 'Three hand-finished stoneware vases in chalky white, each a slightly different shape.' },
  { id: 20, name: 'Amber Glass Bud Vase', category: 'Vases', price: 599, rating: 4.5, reviews: 198, tags: [],
    image: photo('1618674622469-d7fd1a22fcf8'),
    description: 'A small amber glass bottle vase made for single stems and dried flowers.' },

  { id: 21, name: 'Abstract Botanical Framed Print', category: 'Wall Art', price: 2299, rating: 4.6, reviews: 104, tags: [],
    image: photo('1784006322945-efad2e732845'),
    description: 'An abstract botanical print in warm earthy tones, framed and ready to hang.' },
  { id: 22, name: 'Moon Framed Print Pair', category: 'Wall Art', price: 2999, rating: 4.7, reviews: 87, tags: ['new'],
    image: photo('1767605522009-ba5d73f3b91a'),
    description: 'A pair of monochrome moon prints in slim frames. Hang them side by side above a shelf or a console.' },
  { id: 23, name: 'Classic Round Wall Clock', category: 'Wall Art', price: 1499, rating: 4.6, reviews: 458, tags: ['best'],
    image: photo('1563861826100-9cb868fdbe1c'),
    description: 'A clean white dial in a slim dark frame with a silent sweep movement. 30 cm across.' },
  { id: 24, name: 'Roman Numeral Metal Wall Clock', category: 'Wall Art', price: 3499, rating: 4.8, reviews: 141, tags: [],
    image: photo('1558603655-491ecfa8324f'),
    description: 'A large open-frame metal clock with Roman numerals and an antique finish. 60 cm across.' },

  { id: 25, name: 'Rustic Floating Wall Shelves (Set of 2)', category: 'Storage', price: 2199, rating: 4.7, reviews: 233, tags: ['featured'],
    image: photo('1601027864736-b6121f34797e'),
    description: 'Two solid wood floating shelves with hidden brackets. Each holds books, frames and small plants.' },
  { id: 26, name: 'Black Frame Wall Shelf', category: 'Storage', price: 3299, rating: 4.5, reviews: 76, tags: ['new'],
    image: photo('1766047125655-837fe02718f5'),
    description: 'A wall-mounted shelf in black metal and wood with open tiers for display.' },
  { id: 27, name: 'Seagrass Belly Basket (Set of 2)', category: 'Storage', price: 1899, rating: 4.8, reviews: 397, tags: ['best'],
    image: photo('1654372066395-5a07f1e28afc'),
    description: 'Two handwoven seagrass baskets for plants, throws or toys. The tops fold down to make them shorter.' },
  { id: 28, name: 'Handwoven Wicker Basket Set', category: 'Storage', price: 1599, rating: 4.6, reviews: 164, tags: [],
    image: photo('1455669175216-9017c9b02fc6'),
    description: 'A set of handwoven wicker baskets and trays for shelves, entryways and tabletops.' },
];

const byId = new Map(PRODUCTS.map(p => [p.id, p]));


/* ---------- 2. Saved state ---------------------------------------------- */

const CART_KEY = 'decora_cart';         // saved as { productId: quantity }
const WISHLIST_KEY = 'decora_wishlist'; // saved as [productId, ...]

const store = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage blocked or full: carry on in memory */ }
  },
};

// Saved data can be old or hand-edited, so keep only known products and sensible quantities.
let cart = Object.fromEntries(
  Object.entries(store.get(CART_KEY, {}) || {})
    .map(([id, qty]) => [Number(id), Math.min(MAX_QTY, Math.floor(Number(qty)))])
    .filter(([id, qty]) => byId.has(id) && qty >= 1));
let wishlist = [...new Set([].concat(store.get(WISHLIST_KEY, [])))].filter(id => byId.has(id));

const filters = { category: 'All', query: '', sort: 'default' };
let detailQty = 1; // quantity chosen in the product details window


/* ---------- 3. Helpers --------------------------------------------------- */

const $ = (selector, root = document) => root.querySelector(selector);
const money = amount => '₹' + amount.toLocaleString('en-IN');
const icon = name => `<svg class="icon icon--${name}" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
const esc = text => String(text).replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);

const cartLines = () => Object.entries(cart).map(([id, qty]) => ({ product: byId.get(Number(id)), qty }));

function totals(lines) {
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.qty, 0);
  const count = lines.reduce((sum, line) => sum + line.qty, 0);
  const shipping = subtotal === 0 || subtotal > FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FEE;
  return { subtotal, count, shipping, total: subtotal + shipping };
}

// The products the shop grid should show for the current search, category and sort.
function visibleProducts({ category, query, sort }) {
  const categories = category === 'All' ? null : GROUPS[category] || [category];
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const list = PRODUCTS.filter(p => {
    const text = `${p.name} ${p.category} ${p.description}`.toLowerCase();
    return (!categories || categories.includes(p.category)) && words.every(word => text.includes(word));
  });
  const sorters = {
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    popular: (a, b) => b.reviews - a.reviews,
  };
  return sorters[sort] ? list.sort(sorters[sort]) : list; // filter() made a copy, so sorting it is safe
}

// Replaces a container's HTML and puts keyboard focus back on the same button afterwards.
function swap(container, html) {
  const active = document.activeElement;
  const sameButton = container.contains(active) && active.dataset.action
    ? `[data-action="${active.dataset.action}"][data-id="${active.dataset.id}"]` : null;
  container.innerHTML = html;
  if (sameButton) ($(sameButton, container) || $('[data-action="close"]', container.closest('dialog')))?.focus();
}

let toastTimer;
function toast(message) {
  const el = $('#toast');
  el.textContent = message;
  el.hidePopover(); // hide then show, so it lands on top of any dialog that is open
  el.showPopover();
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.hidePopover(), 2400);
}

// Graceful image fallback: a failed photo is swapped for a neutral placeholder.
const FALLBACK_IMAGE = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect width="400" height="500" fill="#EFE9E1"/>' +
  '<path d="M160 270v-52a40 40 0 0 1 80 0v52M184 270v-34a16 16 0 0 1 32 0v34M148 270h104" fill="none" stroke="#C89B6D" stroke-width="5" stroke-linecap="round"/>' +
  '<text x="200" y="312" text-anchor="middle" font-family="sans-serif" font-size="15" fill="#5C4033">Image unavailable</text></svg>');

function useFallback(image) {
  if (image.dataset.fallback) return; // never loop if the placeholder itself fails
  image.dataset.fallback = 'true';
  image.src = FALLBACK_IMAGE;
}


/* ---------- 4. Rendering ------------------------------------------------- */

const ratingHtml = p => `
  <span class="rating" role="img" aria-label="Rated ${p.rating} out of 5 by ${p.reviews} customers">
    ${icon('star')} ${p.rating.toFixed(1)} <span>(${p.reviews})</span>
  </span>`;

function productCard(p) {
  const name = esc(p.name);
  const badge = p.tags.includes('new') ? 'New' : p.tags.includes('best') ? 'Best Seller' : '';
  return `
    <article class="card">
      <div class="card__media">
        <button class="card__view" data-action="view" data-id="${p.id}" aria-label="View details: ${name}">
          <img src="${esc(p.image)}" alt="${name}" loading="lazy" width="720" height="900">
        </button>
        ${badge && `<span class="badge">${badge}</span>`}
        <button class="wish-btn" data-action="wish" data-id="${p.id}" aria-pressed="${wishlist.includes(p.id)}" aria-label="Wishlist: ${name}">${icon('heart')}</button>
      </div>
      <div class="card__body">
        <p class="card__cat">${esc(p.category)}</p>
        <h3 class="card__name" data-action="view" data-id="${p.id}">${name}</h3>
        <div class="card__row">
          <span class="price">${money(p.price)}</span>
          ${ratingHtml(p)}
        </div>
        <button class="btn btn--outline btn--small btn--block" data-action="add" data-id="${p.id}">Add to Cart</button>
      </div>
    </article>`;
}

function renderHome() {
  $('#categoryGrid').innerHTML = CATEGORIES.map(c => {
    const count = PRODUCTS.filter(p => p.category === c.name).length;
    return `
      <a class="category" href="#shop" data-action="filter" data-category="${esc(c.name)}">
        <img src="${esc(c.image)}" alt="" loading="lazy">
        <span><span class="category__name">${esc(c.name)}</span><span class="category__count">${count} ${count === 1 ? 'piece' : 'pieces'}</span></span>
      </a>`;
  }).join('');

  // Featured, Best Sellers and New Arrivals: each grid shows the products carrying its tag.
  document.querySelectorAll('[data-tag]').forEach(grid => {
    grid.innerHTML = PRODUCTS.filter(p => p.tags.includes(grid.dataset.tag)).map(productCard).join('');
  });

  $('#categoryChips').innerHTML = ['All', ...CATEGORIES.map(c => c.name), ...Object.keys(GROUPS)]
    .map(name => `<button class="chip" data-action="filter" data-category="${esc(name)}">${esc(name)}</button>`).join('');
}

function renderShop() {
  const list = visibleProducts(filters);
  $('#shopGrid').innerHTML = list.map(productCard).join('');
  $('#shopEmpty').hidden = list.length > 0;
  $('#resultCount').textContent = `${list.length} ${list.length === 1 ? 'product' : 'products'}` +
    (filters.category === 'All' ? '' : ` in ${filters.category}`);
  document.querySelectorAll('.chip').forEach(chip =>
    chip.setAttribute('aria-pressed', chip.dataset.category === filters.category));
}

const emptyState = (iconName, title, text) => `
  <div class="empty">
    ${icon(iconName)}
    <h3>${title}</h3>
    <p>${text}</p>
    <a class="btn btn--primary" href="#shop" data-action="filter" data-category="All">Start Shopping</a>
  </div>`;

const qtyControl = (id, qty, name) => `
  <div class="qty" role="group" aria-label="Quantity of ${name}">
    <button data-action="dec" data-id="${id}" aria-label="Decrease quantity">${icon('minus')}</button>
    <output>${qty}</output>
    <button data-action="inc" data-id="${id}" aria-label="Increase quantity" ${qty >= MAX_QTY ? 'disabled' : ''}>${icon('plus')}</button>
  </div>`;

function summaryHtml({ subtotal, shipping, total }) {
  const hint = shipping ? `<p class="summary__hint">Add ${money(FREE_SHIPPING_ABOVE + 1 - subtotal)} more for free shipping.</p>` : '';
  return `
    <div><span>Subtotal</span><span>${money(subtotal)}</span></div>
    <div><span>Shipping</span><span>${shipping ? money(shipping) : 'Free'}</span></div>
    ${hint}
    <div class="summary__total"><span>Total</span><span>${money(total)}</span></div>`;
}

function renderCart() {
  const lines = cartLines();
  swap($('#cartItems'), lines.length ? lines.map(({ product: p, qty }) => `
    <div class="line">
      <img src="${esc(p.image)}" alt="" width="84" height="105">
      <div>
        <div class="line__top">
          <div><p class="line__name">${esc(p.name)}</p><p class="line__unit">${money(p.price)} each</p></div>
          <p class="line__total">${money(p.price * qty)}</p>
        </div>
        <div class="line__controls">
          ${qtyControl(p.id, qty, esc(p.name))}
          <button class="text-btn" data-action="remove" data-id="${p.id}" aria-label="Remove ${esc(p.name)} from cart">${icon('trash')} Remove</button>
        </div>
      </div>
    </div>`).join('') : emptyState('bag', 'Your cart is empty', 'Pieces you add to your cart will wait for you here.'));

  $('#cartSummary').innerHTML = lines.length ? `
    <div class="summary">${summaryHtml(totals(lines))}</div>
    <button class="btn btn--primary btn--block" data-action="checkout">Checkout (Demo)</button>` : '';
}

function renderWishlist() {
  swap($('#wishlistItems'), wishlist.length ? wishlist.map(id => byId.get(id)).map(p => `
    <div class="line">
      <img src="${esc(p.image)}" alt="" width="84" height="105">
      <div>
        <div class="line__top">
          <div><p class="line__name">${esc(p.name)}</p><p class="line__unit">${esc(p.category)}</p></div>
          <p class="line__total">${money(p.price)}</p>
        </div>
        <div class="line__controls">
          <button class="btn btn--outline btn--small" data-action="move-to-cart" data-id="${p.id}">Move to Cart</button>
          <button class="text-btn" data-action="unwish" data-id="${p.id}" aria-label="Remove ${esc(p.name)} from wishlist">${icon('trash')} Remove</button>
        </div>
      </div>
    </div>`).join('') : emptyState('heart', 'Your wishlist is empty', 'Tap the heart on any product to save it for later.'));
}

// Saves the cart and wishlist, then refreshes everything that shows them.
function commit() {
  store.set(CART_KEY, cart);
  store.set(WISHLIST_KEY, wishlist);
  renderCart();
  renderWishlist();

  const { count } = totals(cartLines());
  $('#cartCount').textContent = count;
  $('#wishCount').textContent = wishlist.length;
  $('#cartButton').setAttribute('aria-label', `Cart, ${count} ${count === 1 ? 'item' : 'items'}`);
  $('#wishButton').setAttribute('aria-label', `Wishlist, ${wishlist.length} ${wishlist.length === 1 ? 'item' : 'items'}`);
  document.querySelectorAll('[data-action="wish"]').forEach(button =>
    button.setAttribute('aria-pressed', wishlist.includes(Number(button.dataset.id))));
}

function openProduct(id) {
  const p = byId.get(id);
  if (!p) return;
  detailQty = 1;
  $('#productDetail').innerHTML = `
    <div class="detail__media"><img src="${esc(p.image)}" alt="${esc(p.name)}" width="720" height="900"></div>
    <div class="detail__body">
      <p class="eyebrow">${esc(p.category)}</p>
      <h2 id="detailName">${esc(p.name)}</h2>
      ${ratingHtml(p)}
      <p class="detail__price">${money(p.price)}</p>
      <p class="detail__desc">${esc(p.description)}</p>
      <div class="detail__buy">
        <div class="qty" role="group" aria-label="Quantity">
          <button data-action="detail-qty" data-step="-1" aria-label="Decrease quantity">${icon('minus')}</button>
          <output id="detailQty" aria-live="polite">1</output>
          <button data-action="detail-qty" data-step="1" aria-label="Increase quantity">${icon('plus')}</button>
        </div>
        <button class="btn btn--primary" data-action="add" data-id="${p.id}">Add to Cart</button>
      </div>
      <button class="btn btn--outline" data-action="wish" data-id="${p.id}" aria-pressed="${wishlist.includes(p.id)}">
        ${icon('heart')}<span class="when-off">Add to Wishlist</span><span class="when-on">Saved to Wishlist</span>
      </button>
      <ul class="detail__notes">
        <li>${icon('check')} Free shipping on orders above ${money(FREE_SHIPPING_ABOVE)}</li>
        <li>${icon('check')} Carefully packed and quality checked</li>
      </ul>
    </div>`;
  $('#productDialog').showModal();
}


/* ---------- 5. Actions --------------------------------------------------- */

function setQty(id, qty) {
  if (qty < 1) delete cart[id];
  else cart[id] = Math.min(MAX_QTY, qty);
  commit();
}

function setMenu(open) {
  $('#header').classList.toggle('is-open', open);
  $('#menuToggle').setAttribute('aria-expanded', open);
}

const closeDialogs = () => document.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());

// One entry per data-action value used in the HTML. "el" is the element that was clicked.
const actions = {
  view: el => openProduct(Number(el.dataset.id)),

  add(el) {
    const id = Number(el.dataset.id);
    const qty = el.closest('#productDetail') ? detailQty : 1;
    setQty(id, (cart[id] || 0) + qty);
    toast(`${byId.get(id).name} added to cart`);
  },
  inc: el => setQty(Number(el.dataset.id), cart[el.dataset.id] + 1),
  dec: el => setQty(Number(el.dataset.id), cart[el.dataset.id] - 1),
  remove: el => setQty(Number(el.dataset.id), 0),

  'detail-qty'(el) {
    detailQty = Math.min(MAX_QTY, Math.max(1, detailQty + Number(el.dataset.step)));
    $('#detailQty').textContent = detailQty;
  },

  wish(el) {
    const id = Number(el.dataset.id);
    const saved = wishlist.includes(id);
    wishlist = saved ? wishlist.filter(other => other !== id) : [...wishlist, id];
    commit();
    toast(saved ? 'Removed from wishlist' : 'Saved to wishlist');
  },
  unwish(el) {
    wishlist = wishlist.filter(id => id !== Number(el.dataset.id));
    commit();
  },
  'move-to-cart'(el) {
    const id = Number(el.dataset.id);
    wishlist = wishlist.filter(other => other !== id);
    setQty(id, (cart[id] || 0) + 1);
    toast('Moved to cart');
  },

  // Used by menu links, category tiles and footer links (which also scroll to the shop) and by the chips.
  filter(el) {
    filters.category = el.dataset.category;
    if (el.tagName === 'A') { // arriving from elsewhere on the page: start from a clean search
      filters.query = '';
      $('#searchInput').value = '';
    }
    renderShop();
    closeDialogs();
  },
  'reset-filters'() {
    Object.assign(filters, { category: 'All', query: '', sort: 'default' });
    $('#searchInput').value = '';
    $('#sortSelect').value = 'default';
    renderShop();
  },

  'open-search'() {
    $('#shop').scrollIntoView();
    $('#searchInput').focus({ preventScroll: true });
  },
  'open-cart': () => $('#cartDrawer').showModal(),
  'open-wishlist': () => $('#wishlistDrawer').showModal(),
  close: el => el.closest('dialog').close(),
  'toggle-menu': () => setMenu(!$('#header').classList.contains('is-open')),

  checkout() {
    const lines = cartLines();
    if (!lines.length) return;
    $('#checkoutSummary').innerHTML =
      lines.map(({ product: p, qty }) => `<div><span>${esc(p.name)} × ${qty}</span><span>${money(p.price * qty)}</span></div>`).join('') +
      summaryHtml(totals(lines));
    $('#checkoutForm').hidden = false;
    $('#checkoutDone').hidden = true;
    $('#cartDrawer').close();
    $('#checkoutDialog').showModal();
  },
};

document.addEventListener('click', event => {
  const el = event.target.closest('[data-action]');
  if (el) actions[el.dataset.action]?.(el);
  else if (event.target.matches('dialog')) event.target.close(); // a click on the dimmed area around a dialog

  if (event.target.closest('#nav a')) setMenu(false);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') setMenu(false);
});

$('#searchInput').addEventListener('input', event => {
  filters.query = event.target.value;
  renderShop();
});

$('#sortSelect').addEventListener('change', event => {
  filters.sort = event.target.value;
  renderShop();
});

// Image errors do not bubble, so listen in the capture phase to catch every image on the page.
document.addEventListener('error', event => {
  if (event.target.tagName === 'IMG') useFallback(event.target);
}, true);


/* ---------- 6. Forms ----------------------------------------------------- */

function fieldError(field) {
  if (field.validity.valid) return '';
  if (field.validity.valueMissing) return 'This field is required.';
  return field.dataset.error || field.validationMessage;
}

function showError(field, message) {
  field.setAttribute('aria-invalid', Boolean(message));
  document.getElementById(`${field.id}-error`).textContent = message;
}

// Checks every field, shows a message under each bad one, and focuses the first of them.
function validate(form) {
  let firstBad;
  for (const field of form.querySelectorAll('input, textarea')) {
    field.value = field.value.trim();
    const message = fieldError(field);
    showError(field, message);
    if (message) firstBad ??= field;
  }
  firstBad?.focus();
  return !firstBad;
}

// Once a field has been marked wrong, re-check it as the visitor types.
document.addEventListener('input', event => {
  if (event.target.getAttribute('aria-invalid') === 'true') showError(event.target, fieldError(event.target));
});

$('#newsletterForm').addEventListener('submit', event => {
  event.preventDefault();
  const ok = validate(event.target);
  $('#newsletterMsg').textContent = ok ? 'Thank you for subscribing! (Demo: no email is stored or sent.)' : '';
  if (ok) event.target.reset();
});

$('#checkoutForm').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.target;
  if (!validate(form)) return;

  // Demo only: nothing is sent anywhere. Show the confirmation and empty the cart.
  $('#doneName').textContent = form.elements.name.value.split(' ')[0];
  $('#doneTotal').textContent = money(totals(cartLines()).total);
  cart = {};
  commit();
  form.reset();
  form.hidden = true;
  $('#checkoutDone').hidden = false;
  $('#checkoutDone').focus();
});


/* ---------- 7. Start-up -------------------------------------------------- */

renderHome();
renderShop();
commit();

// The hero image may have failed before this script was running, so check it once.
document.querySelectorAll('img:not([loading="lazy"])').forEach(image => {
  if (image.complete && image.naturalWidth === 0) useFallback(image);
});

// Self-check of the cart and filter logic: open index.html?selfcheck and read the browser console.
if (new URLSearchParams(location.search).has('selfcheck')) {
  const line = (price, qty) => ({ product: { price }, qty });
  const all = { category: 'All', query: '', sort: 'default' };
  const prices = visibleProducts({ ...all, sort: 'price-asc' }).map(p => p.price);

  console.assert(totals([]).total === 0, 'an empty cart costs nothing');
  console.assert(totals([line(500, 1)]).total === 500 + SHIPPING_FEE, 'small orders pay shipping');
  console.assert(totals([line(999, 1)]).shipping === SHIPPING_FEE, 'exactly 999 is not above 999');
  console.assert(totals([line(500, 2)]).total === 1000, 'orders above 999 ship free');
  console.assert(totals([line(500, 2), line(250, 3)]).count === 5, 'count adds up quantities');
  console.assert(visibleProducts(all).length === PRODUCTS.length, 'no filter shows everything');
  console.assert(prices.every((price, i) => i === 0 || prices[i - 1] <= price), 'price sort is ascending');
  console.assert(visibleProducts({ ...all, category: 'Lighting' }).every(p => p.category === 'Lighting'), 'category filter');
  console.assert(visibleProducts({ ...all, category: 'Decor' }).every(p => GROUPS.Decor.includes(p.category)), 'group filter');
  console.assert(visibleProducts({ ...all, query: 'LAMP floor' }).every(p => /floor lamp/i.test(p.name)), 'search matches every word');
  console.assert(visibleProducts({ ...all, query: 'zzzz' }).length === 0, 'nonsense search finds nothing');
  console.assert(PRODUCTS.every(p => CATEGORIES.some(c => c.name === p.category)), 'every product has a known category');
  console.assert(byId.size === PRODUCTS.length, 'product ids are unique');
  console.log('DECORA HOME self-check finished. Any failures are listed above this line.');
}
