/* --- APPLICATION STATE --- */
const STATE = {
  activePage: 'accueil',
  cart: [],
  wishlist: new Set(),
  orders: [
    { id: 'CMD-12345', date: '12 Juin 2026', total: 450000, status: 'En cours', items: [{ id: 'galaxy-s23', qty: 1 }] },
    { id: 'CMD-12344', date: '02 Juin 2026', total: 150000, status: 'Expédiée', items: [{ id: 'sony-xm5', qty: 1 }] },
    { id: 'CMD-12343', date: '18 Mai 2026', total: 850000, status: 'Livrée', items: [{ id: 'macbook-m2', qty: 1 }] },
    { id: 'CMD-12342', date: '12 Mars 2026', total: 450000, status: 'Annulée', items: [{ id: 'galaxy-s23', qty: 1 }] }
  ],
  contacts: [
    { id: 'tech-world', name: 'Tech World', avatar: '⚡', status: 'En ligne', messages: [
      { sender: 'them', text: 'Bonjour, votre produit est-il toujours disponible ?' },
      { sender: 'me', text: 'Oui, il est toujours disponible.' },
      { sender: 'them', text: 'Parfait, quand pouvez-vous livrer ?' }
    ]},
    { id: 'global-elec', name: 'Global Electronics', avatar: '💾', status: 'Hors ligne', messages: [
      { sender: 'them', text: 'Merci pour votre achat ! Votre commande est en préparation.' }
    ]},
    { id: 'maison-mod', name: 'Maison Moderne', avatar: '🏠', status: 'En ligne', messages: [
      { sender: 'them', text: 'Bonjour, avez-vous reçu la table basse ?' }
    ]}
  ],
  activeContactId: 'tech-world',
  selectedProductId: 'galaxy-s23',
  selectedColorIndex: 0,
  detailQty: 1,
  detailActiveTab: 'desc',
  checkoutDelivery: 'standard',
  userAddresses: [
    { type: 'Maison', address: 'Riviera Palmeraie, Rue F32, Abidjan', phone: '+225 07 12 34 56 78' },
    { type: 'Bureau', address: 'Plateau, Immeuble CCIA, 4ème étage, Abidjan', phone: '+225 20 22 22 22 22' }
  ],
  supportTickets: [],
  searchQuery: '',
  selectedVendorId: 'tech-world',
  vendorActiveTab: 'products',
  faqActiveIndex: -1
};

/* --- SHARED DATABASE SYNC --- */
let PRODUCTS = [
  {
    id: 'galaxy-s23',
    title: 'Samsung Galaxy S23 Ultra 5G',
    brand: 'Samsung',
    price: 450000,
    originalPrice: 520000,
    rating: 4.8,
    reviews: 28,
    image: 'assets/product_galaxy_s23.png',
    desc: 'Le smartphone ultime avec un capteur photo de 200 Mpx et le stylet S Pen intégré pour une productivité décuplée dans l\'univers Cyber-Tech.',
    specs: {
      'Écran': '6.8" Dynamic AMOLED 2X, 120Hz',
      'Processeur': 'Snapdragon 8 Gen 2 Mobile Platform for Galaxy',
      'Stockage': '512 Go SSD Cyber-Core',
      'Batterie': '5000 mAh avec charge ultra-rapide'
    },
    colors: ['#0f172a', '#1e3a8a', '#14532d']
  },
  {
    id: 'macbook-m2',
    title: 'MacBook Air M2 Pro Edition',
    brand: 'Apple',
    price: 850000,
    originalPrice: 950000,
    rating: 4.9,
    reviews: 14,
    image: 'assets/product_laptop.png',
    desc: 'Un design ultra-fin avec la puce M2. Une autonomie exceptionnelle pour coder dans l\'obscurité des réseaux cyberpunk.',
    specs: {
      'Écran': '13.6" Liquid Retina Display',
      'Processeur': 'Apple M2 Silicon Core',
      'Stockage': '512 Go SSD Fusion Drive',
      'Batterie': 'Jusqu\'à 18 heures d\'autonomie'
    },
    colors: ['#334155', '#0f172a', '#e2e8f0']
  },
  {
    id: 'sony-xm5',
    title: 'Casque Sony WH-1000XM5',
    brand: 'Sony',
    price: 150000,
    originalPrice: 180000,
    rating: 4.7,
    reviews: 42,
    image: 'assets/product_headphones.png',
    desc: 'La meilleure réduction de bruit active du marché pour vous isoler totalement du brouhaha de la mégalopole.',
    specs: {
      'Type': 'Casque supra-auriculaire sans fil',
      'Autonomie': '30 heures avec ANC',
      'Réseau': 'Bluetooth 5.2 LDAC',
      'Poids': '250g Ultra-léger'
    },
    colors: ['#0f172a', '#e2e8f0']
  }
];

function initDB() {
  const saved = localStorage.getItem('NEOMARKET_DB');
  if (saved) {
    const db = JSON.parse(saved);
    PRODUCTS = db.products || PRODUCTS;
    STATE.orders = db.orders || STATE.orders;
  }
}


const VENDORS = [
  { id: 'tech-world', name: 'Tech World', avatar: '⚡', rating: 4.9, reviews: 124, banner: 'linear-gradient(135deg, #1e1b4b, #1e40af)', badges: ['Top Vendeur', 'Livraison Rapide', 'Support 24/7'] },
  { id: 'global-elec', name: 'Global Electronics', avatar: '💾', rating: 4.7, reviews: 89, banner: 'linear-gradient(135deg, #311048, #701a75)', badges: ['Vendeur Certifié', 'Excellente Qualité'] },
  { id: 'maison-mod', name: 'Maison Moderne', avatar: '🏠', rating: 4.5, reviews: 54, banner: 'linear-gradient(135deg, #4c0519, #9f1239)', badges: ['Livraison standard'] },
  { id: 'mode-chic', name: 'Mode Chic', avatar: '👗', rating: 4.8, reviews: 110, banner: 'linear-gradient(135deg, #022c22, #065f46)', badges: ['Top Vendeur', 'Style Premium'] },
  { id: 'sport-pro', name: 'Sport Pro', avatar: '⚽', rating: 4.6, reviews: 37, banner: 'linear-gradient(135deg, #431407, #9a3412)', badges: ['Matériel Pro'] }
];

/* --- PAGES ROUTER --- */
const PAGES = [
  { id: 'accueil', name: '01 - ACCUEIL' },
  { id: 'produits', name: '02 - LISTE DES PRODUITS' },
  { id: 'detail', name: '03 - DÉTAIL PRODUIT' },
  { id: 'panier', name: '04 - PANIER' },
  { id: 'checkout', name: '05 - CHECKOUT' },
  { id: 'boutique-vendeur', name: '07 - NOTRE BOUTIQUE' },
  { id: 'compte', name: '09 - COMPTE CLIENT' },
  { id: 'commandes', name: '10 - MES COMMANDES' },
  { id: 'suivi', name: '11 - SUIVI DE COMMANDE' },
  { id: 'recherche', name: '12 - RECHERCHE' },
  { id: 'favoris', name: '13 - FAVORIS' },
  { id: 'messagerie', name: '14 - MESSAGERIE' },
  { id: 'support', name: '15 - SUPPORT' },
  { id: '404', name: '16 - PAGE 404' }
];

/* --- SPA NAVIGATOR --- */
function navigateTo(pageId, extraParam = null) {
  STATE.activePage = pageId;
  
  // Set navbar active states
  document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
  const navMap = {
    'accueil': 'nav-accueil',
    'produits': 'nav-produits',
    'support': 'nav-support'
  };
  if (navMap[pageId]) {
    const navItem = document.getElementById(navMap[pageId]);
    if (navItem) navItem.classList.add('active');
  }

  // Handle special sub-params
  if (pageId === 'detail' && extraParam) {
    STATE.selectedProductId = extraParam;
    STATE.detailQty = 1;
    STATE.selectedColorIndex = 0;
  }
  if (pageId === 'boutique-vendeur' && extraParam) {
    STATE.selectedVendorId = extraParam;
    STATE.vendorActiveTab = 'products';
  }

  // Update dev panel active status
  document.querySelectorAll('.dev-page-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === pageId);
  });

  // Render the selected view
  renderActivePage();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleSearchInput(event) {
  if (event.key === 'Enter') {
    const query = event.target.value.trim();
    if (query) {
      STATE.searchQuery = query;
      navigateTo('recherche');
    }
  }
}

/* --- RENDER ACTIVE PAGE --- */
function renderActivePage() {
  const container = document.getElementById('page-content');
  if (!container) return;

  updateGlobalBadges();

  switch(STATE.activePage) {
    case 'accueil':
      container.innerHTML = getAccueilHTML();
      break;
    case 'produits':
      container.innerHTML = getProduitsHTML();
      setupProductsFiltersListeners();
      break;
    case 'detail':
      container.innerHTML = getDetailHTML();
      break;
    case 'panier':
      container.innerHTML = getPanierHTML();
      break;
    case 'checkout':
      container.innerHTML = getCheckoutHTML();
      break;
    case 'boutique-vendeur':
      container.innerHTML = getBoutiqueVendeurHTML();
      break;
    case 'compte':
      container.innerHTML = getCompteClientHTML();
      break;
    case 'commandes':
      container.innerHTML = getMesCommandesHTML();
      break;
    case 'suivi':
      container.innerHTML = getSuiviCommandeHTML();
      startSuiviMapSimulation();
      break;
    case 'recherche':
      container.innerHTML = getRechercheHTML();
      break;
    case 'favoris':
      container.innerHTML = getFavorisHTML();
      break;
    case 'messagerie':
      container.innerHTML = getMessagerieHTML();
      scrollToChatBottom();
      break;
    case 'support':
      container.innerHTML = getSupportHTML();
      break;
    case '404':
    default:
      container.innerHTML = get404HTML();
      break;
  }
}

/* --- STATE MUTATORS / HANDLERS --- */
function updateGlobalBadges() {
  const cartBadge = document.getElementById('header-cart-count');
  const wishlistBadge = document.getElementById('header-wishlist-count');
  
  if (cartBadge) {
    const totalQty = STATE.cart.reduce((sum, item) => sum + item.qty, 0);
    cartBadge.textContent = totalQty;
  }
  if (wishlistBadge) {
    wishlistBadge.textContent = STATE.wishlist.size;
  }
}

function toggleWishlist(productId) {
  if (STATE.wishlist.has(productId)) {
    STATE.wishlist.delete(productId);
  } else {
    STATE.wishlist.add(productId);
  }
  updateGlobalBadges();
  renderActivePage();
}

function addToCart(productId, qty = 1) {
  const existing = STATE.cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    STATE.cart.push({ id: productId, qty: qty });
  }
  updateGlobalBadges();
  // Display mini cyber toast alert
  showCyberToast('PRODUIT AJOUTÉ AU PANIER');
}

function updateCartQty(productId, delta) {
  const item = STATE.cart.find(item => item.id === productId);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      STATE.cart = STATE.cart.filter(i => i.id !== productId);
    }
  }
  updateGlobalBadges();
  renderActivePage();
}

function deleteCartItem(productId) {
  STATE.cart = STATE.cart.filter(i => i.id !== productId);
  updateGlobalBadges();
  renderActivePage();
}

function showCyberToast(text) {
  const toast = document.createElement('div');
  toast.className = 'cyber-badge cyber-badge-cyan';
  toast.style.position = 'fixed';
  toast.style.bottom = '30px';
  toast.style.left = '30px';
  toast.style.zIndex = '10000';
  toast.style.padding = '12px 24px';
  toast.style.fontSize = '0.85rem';
  toast.style.boxShadow = '0 0 15px rgba(0, 240, 255, 0.6)';
  toast.style.animation = 'page-fade-in 0.3s ease-out';
  toast.innerHTML = `<span class="glow-text-cyan">⚡ ${text}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.5s';
    setTimeout(() => toast.remove(), 500);
  }, 2500);
}

/* --- HTML TEMPLATE GENERATORS --- */

// --- 01 - ACCUEIL ---
function getAccueilHTML() {
  return `
    <div class="page-container active">
      <!-- Hero Banner -->
      <div class="hero-banner">
        <div class="hero-overlay"></div>
        <div class="hero-img" style="background-image: url('assets/hero_cyborg.png');"></div>
        <div class="hero-content">
          <div class="hero-tagline glow-text-cyan">NOUVEAU PARADIGME</div>
          <h1 class="hero-title">L'Avenir du Commerce</h1>
          <div class="hero-search">
            <input type="text" id="hero-search-input" placeholder="Que recherchez-vous aujourd'hui ?" onkeydown="if(event.key==='Enter'){ STATE.searchQuery=this.value; navigateTo('recherche'); }">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Categories -->
      <div class="section-header">
        <h2 class="glow-text-cyan">Catégories Populaires</h2>
      </div>
      <div class="categories-container">
        <div class="category-card cyber-glass" onclick="navigateTo('produits')">
          <div class="category-icon-wrapper">🔌</div>
          <span>Électronique</span>
        </div>
        <div class="category-card cyber-glass" onclick="navigateTo('produits')">
          <div class="category-icon-wrapper">👔</div>
          <span>Mode</span>
        </div>
        <div class="category-card cyber-glass" onclick="navigateTo('produits')">
          <div class="category-icon-wrapper">🏠</div>
          <span>Maison</span>
        </div>
        <div class="category-card cyber-glass" onclick="navigateTo('produits')">
          <div class="category-icon-wrapper">💄</div>
          <span>Beauté</span>
        </div>
        <div class="category-card cyber-glass" onclick="navigateTo('produits')">
          <div class="category-icon-wrapper">⚽</div>
          <span>Sport</span>
        </div>
        <div class="category-card cyber-glass" onclick="navigateTo('produits')">
          <div class="category-icon-wrapper">🚗</div>
          <span>Auto</span>
        </div>
        <div class="category-card cyber-glass" onclick="navigateTo('produits')">
          <div class="category-icon-wrapper">🎮</div>
          <span>Jeux</span>
        </div>
        <div class="category-card cyber-glass" onclick="navigateTo('produits')">
          <div class="category-icon-wrapper">➕</div>
          <span>Plus</span>
        </div>
      </div>

      <!-- Promo Grid -->
      <div class="home-promo-grid">
        <div class="promo-block promo-banner-01 cyber-purple-glass">
          <div>
            <div class="promo-tag">PROMOTIONS FLASH</div>
            <div class="promo-title">ÉLECTRONIQUE HAUT DE GAMME</div>
          </div>
          <div class="promo-discount">-50%</div>
          <button class="cyber-btn-secondary promo-btn" onclick="navigateTo('produits')">VOIR OFFRES</button>
        </div>
        <div class="promo-block promo-banner-02 cyber-glass">
          <div>
            <div class="promo-tag">NOUVEAUTÉS</div>
            <div class="promo-title">CYBER CASQUES AUDIO</div>
          </div>
          <div class="promo-discount">NEW</div>
          <button class="cyber-btn promo-btn" onclick="navigateTo('detail', 'sony-xm5')">DÉCOUVRIR</button>
        </div>
        <div class="promo-block promo-banner-03 cyber-glass">
          <div>
            <div class="promo-tag">MEILLEURES OFFRES</div>
            <div class="promo-title">CYBER LAPTOPS ET DRONES</div>
          </div>
          <div class="promo-discount">TOP</div>
          <button class="cyber-btn promo-btn" onclick="navigateTo('produits')">PARCOURIR</button>
        </div>
      </div>
    </div>
  `;
}

// --- 02 - LISTE DES PRODUITS ---
function getProduitsHTML(filteredList = PRODUCTS) {
  const listItems = filteredList.map(prod => {
    const isWish = STATE.wishlist.has(prod.id) ? 'active' : '';
    return `
      <div class="product-card cyber-glass">
        <div class="product-card-img-wrapper" onclick="navigateTo('detail', '${prod.id}')">
          <img src="${prod.image}" alt="${prod.title}">
          <div class="product-card-discount cyber-badge cyber-badge-pink">-15%</div>
        </div>
        <div class="product-card-wishlist ${isWish}" onclick="toggleWishlist('${prod.id}')">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        <div class="product-card-info">
          <div class="product-card-brand">${prod.brand}</div>
          <div class="product-card-title" onclick="navigateTo('detail', '${prod.id}')">${prod.title}</div>
          <div class="product-card-rating">
            <div class="stars">★★★★★</div>
            <span class="reviews-count">(${prod.reviews})</span>
          </div>
          <div class="product-card-footer">
            <div class="product-card-price">${prod.price.toLocaleString('fr-FR')} FCFA</div>
            <div class="product-card-buy-btn" onclick="addToCart('${prod.id}')">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="page-container active">
      <div class="product-list-layout">
        <!-- Sidebar Filters -->
        <aside class="filters-sidebar cyber-purple-glass">
          <div class="filter-group">
            <h3 class="glow-text-purple">Catégories</h3>
            <div class="filter-options">
              <label class="checkbox-label"><input type="checkbox" id="cat-elec" checked> Électronique</label>
              <label class="checkbox-label"><input type="checkbox" id="cat-mode"> Mode</label>
              <label class="checkbox-label"><input type="checkbox" id="cat-maison"> Maison</label>
              <label class="checkbox-label"><input type="checkbox" id="cat-beaute"> Beauté</label>
              <label class="checkbox-label"><input type="checkbox" id="cat-sport"> Sport</label>
              <label class="checkbox-label"><input type="checkbox" id="cat-auto"> Auto</label>
            </div>
          </div>
          <div class="filter-group">
            <h3>Prix</h3>
            <div class="price-range-inputs">
              <input type="number" id="price-min" value="0" placeholder="Min">
              <span style="font-size: 0.8rem;">à</span>
              <input type="number" id="price-max" value="1000000" placeholder="Max">
            </div>
          </div>
          <div class="filter-group">
            <h3>Marques</h3>
            <div class="filter-options">
              <label class="checkbox-label"><input type="checkbox" class="brand-filter" value="Samsung" checked> Samsung</label>
              <label class="checkbox-label"><input type="checkbox" class="brand-filter" value="Apple" checked> Apple</label>
              <label class="checkbox-label"><input type="checkbox" class="brand-filter" value="Sony" checked> Sony</label>
              <label class="checkbox-label"><input type="checkbox" class="brand-filter" value="HP"> HP</label>
            </div>
          </div>
        </aside>

        <!-- Main Product List -->
        <section class="products-main">
          <div class="products-bar cyber-glass">
            <div class="results-count">${filteredList.length} produits trouvés</div>
            <div style="display: flex; gap: 15px; align-items: center;">
              <span style="font-size: 0.8rem; color: var(--text-secondary);">Trier par:</span>
              <select class="sort-select" onchange="handleSort(this.value)">
                <option value="perf">Performance</option>
                <option value="asc">Prix : Croissant</option>
                <option value="desc">Prix : Décroissant</option>
              </select>
            </div>
          </div>

          <div class="products-grid">
            ${listItems || `<div style="grid-column: 1/-1; text-align: center; padding: 50px; color: var(--text-secondary);">Aucun produit ne correspond à ces critères.</div>`}
          </div>
        </section>
      </div>
    </div>
  `;
}

function setupProductsFiltersListeners() {
  const updateFilters = () => {
    const minVal = parseInt(document.getElementById('price-min').value) || 0;
    const maxVal = parseInt(document.getElementById('price-max').value) || Infinity;
    
    // Get checked brands
    const checkedBrands = Array.from(document.querySelectorAll('.brand-filter:checked')).map(el => el.value);
    
    const filtered = PRODUCTS.filter(prod => {
      const matchPrice = prod.price >= minVal && prod.price <= maxVal;
      const matchBrand = checkedBrands.length === 0 || checkedBrands.includes(prod.brand);
      return matchPrice && matchBrand;
    });
    
    // Re-render only product cards grid
    const grid = document.querySelector('.products-grid');
    if (grid) {
      grid.innerHTML = filtered.map(prod => {
        const isWish = STATE.wishlist.has(prod.id) ? 'active' : '';
        return `
          <div class="product-card cyber-glass">
            <div class="product-card-img-wrapper" onclick="navigateTo('detail', '${prod.id}')">
              <img src="${prod.image}" alt="${prod.title}">
              <div class="product-card-discount cyber-badge cyber-badge-pink">-15%</div>
            </div>
            <div class="product-card-wishlist ${isWish}" onclick="toggleWishlist('${prod.id}')">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <div class="product-card-info">
              <div class="product-card-brand">${prod.brand}</div>
              <div class="product-card-title" onclick="navigateTo('detail', '${prod.id}')">${prod.title}</div>
              <div class="product-card-rating">
                <div class="stars">★★★★★</div>
                <span class="reviews-count">(${prod.reviews})</span>
              </div>
              <div class="product-card-footer">
                <div class="product-card-price">${prod.price.toLocaleString('fr-FR')} FCFA</div>
                <div class="product-card-buy-btn" onclick="addToCart('${prod.id}')">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');
      
      const countEl = document.querySelector('.results-count');
      if (countEl) countEl.textContent = `${filtered.length} produits trouvés`;
    }
  };

  document.getElementById('price-min').addEventListener('input', updateFilters);
  document.getElementById('price-max').addEventListener('input', updateFilters);
  document.querySelectorAll('.brand-filter').forEach(el => el.addEventListener('change', updateFilters));
}

function handleSort(criteria) {
  let sorted = [...PRODUCTS];
  if (criteria === 'asc') {
    sorted.sort((a, b) => a.price - b.price);
  } else if (criteria === 'desc') {
    sorted.sort((a, b) => b.price - a.price);
  }
  const grid = document.querySelector('.products-grid');
  if (grid) {
    // Renders the sorted grid
    navigateTo('produits');
  }
}

// --- 03 - DÉTAIL PRODUIT ---
function getDetailHTML() {
  const prod = PRODUCTS.find(p => p.id === STATE.selectedProductId) || PRODUCTS[0];
  const isWish = STATE.wishlist.has(prod.id) ? 'active' : '';
  
  const specsHTML = Object.entries(prod.specs).map(([k, v]) => `
    <div style="display: flex; border-bottom: 1px solid rgba(255,255,255,0.05); padding: 12px 0;">
      <div style="width: 200px; font-weight: 600; color: var(--text-primary);">${k}</div>
      <div style="color: var(--text-secondary);">${v}</div>
    </div>
  `).join('');

  return `
    <div class="page-container active">
      <div class="breadcrumb">
        <a onclick="navigateTo('accueil')">Accueil</a> &gt; 
        <a onclick="navigateTo('produits')">Électronique</a> &gt; 
        <span style="color: var(--color-cyan);">${prod.title}</span>
      </div>

      <div class="product-detail-layout">
        <!-- Gallery -->
        <div class="detail-gallery">
          <div class="gallery-thumbs">
            <div class="thumb-item active"><img src="${prod.image}" alt=""></div>
            <div class="thumb-item"><img src="${prod.image}" alt="" style="transform: rotate(90deg);"></div>
            <div class="thumb-item"><img src="${prod.image}" alt="" style="transform: scaleX(-1);"></div>
          </div>
          <div class="gallery-main">
            <img src="${prod.image}" alt="${prod.title}" id="main-product-gallery-img">
          </div>
        </div>

        <!-- Info -->
        <div class="detail-info">
          <div class="detail-brand">${prod.brand}</div>
          <h1 class="detail-title glow-text-cyan">${prod.title}</h1>
          
          <div class="detail-rating-line">
            <div class="stars">★★★★★</div>
            <span class="reviews-count">(${prod.reviews} avis clients)</span>
            <span class="cyber-badge cyber-badge-cyan">En Stock</span>
          </div>

          <div class="detail-price">
            <span>${prod.price.toLocaleString('fr-FR')} FCFA</span>
            <span class="detail-price-original">${prod.originalPrice.toLocaleString('fr-FR')} FCFA</span>
            <span class="cyber-badge cyber-badge-pink">-15% OFF</span>
          </div>

          <div class="detail-selectors">
            <!-- Colors -->
            <div class="selector-group">
              <h4>Couleur</h4>
              <div class="color-options">
                ${prod.colors.map((c, i) => `
                  <div class="color-dot ${STATE.selectedColorIndex === i ? 'active' : ''}" style="background-color: ${c};" onclick="selectDetailColor(${i})"></div>
                `).join('')}
              </div>
            </div>

            <!-- Qty -->
            <div class="selector-group">
              <h4>Quantité</h4>
              <div class="qty-selector">
                <button class="qty-btn" onclick="updateDetailQty(-1)">-</button>
                <span id="detail-qty-value" style="font-weight:700; font-size:1.1rem; width: 30px; text-align:center;">${STATE.detailQty}</span>
                <button class="qty-btn" onclick="updateDetailQty(1)">+</button>
              </div>
            </div>
          </div>

          <div class="detail-actions">
            <button class="cyber-btn-outline" onclick="addToCart('${prod.id}', STATE.detailQty)">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="margin-right:8px;">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Ajouter au panier
            </button>
            <button class="cyber-btn" onclick="addToCart('${prod.id}', STATE.detailQty); navigateTo('panier');">Acheter maintenant</button>
          </div>

          <div class="trust-badges">
            <div class="badge-item">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span>Livraison gratuite</span>
            </div>
            <div class="badge-item">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.25" /></svg>
              <span>Retour sous 30j</span>
            </div>
            <div class="badge-item">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              <span>Garantie 12 mois</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Description Tabs -->
      <div class="detail-tabs">
        <div class="tabs-header">
          <div class="tab-btn ${STATE.detailActiveTab === 'desc' ? 'active' : ''}" onclick="selectDetailTab('desc')">Description</div>
          <div class="tab-btn ${STATE.detailActiveTab === 'specs' ? 'active' : ''}" onclick="selectDetailTab('specs')">Caractéristiques</div>
          <div class="tab-btn ${STATE.detailActiveTab === 'reviews' ? 'active' : ''}" onclick="selectDetailTab('reviews')">Avis (28)</div>
          <div class="tab-btn ${STATE.detailActiveTab === 'shipping' ? 'active' : ''}" onclick="selectDetailTab('shipping')">Livraison & Retours</div>
        </div>

        <div class="tab-pane ${STATE.detailActiveTab === 'desc' ? 'active' : ''}">
          <p>${prod.desc}</p>
          <p style="margin-top: 15px;">Conçu avec des matériaux haut de gamme issus des industries militaires de la mégalopole, NeoMarket vous certifie un produit testé sous conditions extrêmes pour un fonctionnement sans faille.</p>
        </div>

        <div class="tab-pane ${STATE.detailActiveTab === 'specs' ? 'active' : ''}">
          ${specsHTML}
        </div>

        <div class="tab-pane ${STATE.detailActiveTab === 'reviews' ? 'active' : ''}">
          <div style="display:flex; flex-direction:column; gap:20px;">
            <div class="cyber-glass" style="padding:20px; border-radius:var(--border-radius-sm);">
              <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <span style="font-weight:700; color:var(--color-cyan);">Jean Dupont</span>
                <span style="font-size:0.8rem; color:var(--text-muted);">Il y a 3 jours</span>
              </div>
              <div class="stars" style="margin-bottom:10px;">★★★★★</div>
              <p style="font-size:0.85rem; color:var(--text-secondary);">Ce smartphone est un monstre technologique ! L'écran est sublime et la batterie tient facilement 2 jours d'utilisation intensive. Le réseau cyberpunk capte parfaitement.</p>
            </div>
            <div class="cyber-glass" style="padding:20px; border-radius:var(--border-radius-sm);">
              <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <span style="font-weight:700; color:var(--color-cyan);">Alice Smith</span>
                <span style="font-size:0.8rem; color:var(--text-muted);">Il y a 1 semaine</span>
              </div>
              <div class="stars" style="margin-bottom:10px;">★★★★★</div>
              <p style="font-size:0.85rem; color:var(--text-secondary);">Livraison rapide et emballage soigné. L'intégration du stylet S Pen est super pratique pour dessiner et prendre des notes.</p>
            </div>
          </div>
        </div>

        <div class="tab-pane ${STATE.detailActiveTab === 'shipping' ? 'active' : ''}">
          <p>Nous livrons dans toute l'Afrique de l'Ouest par transporteur privé Cyber-Courier. Nos délais de livraison varient de 24h à 72h selon votre localité.</p>
          <p style="margin-top: 15px;">Les retours sont autorisés sous 30 jours dans leur emballage d'origine scellé à nos frais.</p>
        </div>
      </div>
    </div>
  `;
}

function selectDetailColor(idx) {
  STATE.selectedColorIndex = idx;
  renderActivePage();
}

function updateDetailQty(delta) {
  STATE.detailQty = Math.max(1, STATE.detailQty + delta);
  const qtyVal = document.getElementById('detail-qty-value');
  if (qtyVal) qtyVal.textContent = STATE.detailQty;
}

function selectDetailTab(tabId) {
  STATE.detailActiveTab = tabId;
  renderActivePage();
}

// --- 04 - PANIER ---
function getPanierHTML() {
  if (STATE.cart.length === 0) {
    return `
      <div class="page-container active" style="text-align:center; padding: 80px 20px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" style="color:var(--color-cyan); margin-bottom:20px; filter:drop-shadow(0 0 10px rgba(0,240,255,0.4));">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h2 class="glow-text-cyan" style="font-family:var(--font-title); margin-bottom:15px;">VOTRE PANIER EST VIDE</h2>
        <p style="color:var(--text-secondary); margin-bottom:30px;">Parcourez notre catalogue technologique pour y ajouter des articles.</p>
        <button class="cyber-btn" onclick="navigateTo('produits')">Découvrir les Produits</button>
      </div>
    `;
  }

  let subtotal = 0;
  const itemsHTML = STATE.cart.map(item => {
    const prod = PRODUCTS.find(p => p.id === item.id);
    if (!prod) return '';
    const itemTotal = prod.price * item.qty;
    subtotal += itemTotal;

    return `
      <div class="cart-item cyber-glass">
        <div class="cart-item-img">
          <img src="${prod.image}" alt="">
        </div>
        <div class="cart-item-details">
          <h3 class="cart-item-title">${prod.title}</h3>
          <div class="cart-item-seller">Vendeur: <span style="font-weight:600;">NeoMarket Officiel</span></div>
        </div>
        <div class="qty-selector" style="margin-right:40px;">
          <button class="qty-btn" onclick="updateCartQty('${prod.id}', -1)">-</button>
          <span style="font-weight:700; width:20px; text-align:center;">${item.qty}</span>
          <button class="qty-btn" onclick="updateCartQty('${prod.id}', 1)">+</button>
        </div>
        <div class="cart-item-price">${itemTotal.toLocaleString('fr-FR')} FCFA</div>
        <div class="cart-item-delete" onclick="deleteCartItem('${prod.id}')" style="margin-left:20px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
      </div>
    `;
  }).join('');

  const shipping = 5000;
  const total = subtotal + shipping;

  return `
    <div class="page-container active">
      <h1 class="glow-text-cyan" style="font-family:var(--font-title); font-size:1.5rem; text-transform:uppercase; margin-bottom:30px;">Votre Panier (${STATE.cart.reduce((s,i)=>s+i.qty, 0)})</h1>
      
      <div class="cart-layout">
        <div class="cart-items-wrapper">
          ${itemsHTML}
        </div>

        <aside class="summary-sidebar cyber-purple-glass">
          <h2 class="summary-title glow-text-purple">Récapitulatif</h2>
          
          <div class="summary-row">
            <span>Sous-total</span>
            <span>${subtotal.toLocaleString('fr-FR')} FCFA</span>
          </div>
          <div class="summary-row">
            <span>Livraison</span>
            <span>${shipping.toLocaleString('fr-FR')} FCFA</span>
          </div>

          <div class="summary-row total">
            <span>Total</span>
            <span>${total.toLocaleString('fr-FR')} FCFA</span>
          </div>

          <button class="cyber-btn" style="width:100%; margin-top:20px;" onclick="navigateTo('checkout')">Passer la commande</button>

          <div class="payment-methods-logos">
            <!-- Simulated Payment Logos -->
            <span style="font-weight:700; color:#ff7a00; font-family:var(--font-title); font-size:0.75rem; border:1px solid #ff7a00; padding:3px 6px; border-radius:3px;">ORANGE</span>
            <span style="font-weight:700; color:#00a3ff; font-family:var(--font-title); font-size:0.75rem; border:1px solid #00a3ff; padding:3px 6px; border-radius:3px;">WAVE</span>
            <span style="font-weight:700; color:#0055ff; font-family:var(--font-title); font-size:0.75rem; border:1px solid #0055ff; padding:3px 6px; border-radius:3px;">VISA</span>
            <span style="font-weight:700; color:#ff3d00; font-family:var(--font-title); font-size:0.75rem; border:1px solid #ff3d00; padding:3px 6px; border-radius:3px;">MC</span>
          </div>
        </aside>
      </div>
    </div>
  `;
}

// --- 05 - CHECKOUT ---
function getCheckoutHTML() {
  let subtotal = 0;
  const itemsSummaryHTML = STATE.cart.map(item => {
    const prod = PRODUCTS.find(p => p.id === item.id);
    if (!prod) return '';
    subtotal += prod.price * item.qty;
    return `
      <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:10px; color:var(--text-secondary);">
        <span>${prod.title} (x${item.qty})</span>
        <span>${(prod.price*item.qty).toLocaleString('fr-FR')} FCFA</span>
      </div>
    `;
  }).join('');

  const shipping = STATE.checkoutDelivery === 'standard' ? 0 : 5000;
  const total = subtotal + shipping;

  return `
    <div class="page-container active">
      <div class="checkout-layout">
        <!-- Form area -->
        <div>
          <!-- Delivery info -->
          <div class="form-card cyber-glass">
            <h2>Informations de Livraison</h2>
            <div class="form-grid">
              <div class="form-group">
                <label for="co-name">Nom Complet</label>
                <input type="text" id="co-name" value="Jean Dupont">
              </div>
              <div class="form-group">
                <label for="co-phone">Téléphone</label>
                <input type="text" id="co-phone" value="+225 07 12 34 56 78">
              </div>
              <div class="form-group col-span-2">
                <label for="co-address">Adresse</label>
                <input type="text" id="co-address" value="Riviera Palmeraie, Rue F32">
              </div>
              <div class="form-group">
                <label for="co-city">Ville</label>
                <input type="text" id="co-city" value="Abidjan">
              </div>
              <div class="form-group">
                <label for="co-country">Pays</label>
                <select id="co-country">
                  <option value="CI">Côte d'Ivoire</option>
                  <option value="SN">Sénégal</option>
                  <option value="ML">Mali</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Shipping method -->
          <div class="form-card cyber-glass">
            <h2>Méthode de Livraison</h2>
            <div class="delivery-options">
              <div class="delivery-option ${STATE.checkoutDelivery === 'standard' ? 'active' : ''}" onclick="selectCheckoutDelivery('standard')">
                <div class="radio-circle"></div>
                <div class="delivery-details">
                  <div class="delivery-title">Livraison standard (gratuite)</div>
                  <div class="delivery-desc">Livré sous 3 à 5 jours ouvrés.</div>
                </div>
                <div class="delivery-price">0 FCFA</div>
              </div>
              <div class="delivery-option ${STATE.checkoutDelivery === 'express' ? 'active' : ''}" onclick="selectCheckoutDelivery('express')">
                <div class="radio-circle"></div>
                <div class="delivery-details">
                  <div class="delivery-title">Livraison express 24h</div>
                  <div class="delivery-desc">Commandez avant midi et recevez le lendemain.</div>
                </div>
                <div class="delivery-price">5 000 FCFA</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Summary -->
        <aside class="summary-sidebar cyber-purple-glass">
          <h2 class="summary-title glow-text-purple">Récapitulatif de commande</h2>
          
          <div style="border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom:15px; margin-bottom:15px;">
            ${itemsSummaryHTML}
          </div>

          <div class="summary-row">
            <span>Sous-total</span>
            <span>${subtotal.toLocaleString('fr-FR')} FCFA</span>
          </div>
          <div class="summary-row">
            <span>Livraison</span>
            <span>${shipping.toLocaleString('fr-FR')} FCFA</span>
          </div>
          <div class="summary-row total">
            <span>Total</span>
            <span>${total.toLocaleString('fr-FR')} FCFA</span>
          </div>

          <button class="cyber-btn" style="width:100%; margin-top:25px;" onclick="confirmCheckoutOrder(${total})">Confirmer la commande</button>
        </aside>
      </div>
    </div>
  `;
}

function selectCheckoutDelivery(method) {
  STATE.checkoutDelivery = method;
  renderActivePage();
}

function confirmCheckoutOrder(totalVal) {
  const name = document.getElementById('co-name').value.trim();
  const phone = document.getElementById('co-phone').value.trim();
  const addr = document.getElementById('co-address').value.trim();
  
  if (!name || !phone || !addr) {
    alert("Veuillez remplir toutes les informations de livraison.");
    return;
  }

  // Create new order
  const newOrderId = 'CMD-' + Math.floor(10000 + Math.random() * 90000);
  const dateStr = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  
  // Clone items from cart
  const orderItems = STATE.cart.map(item => ({ id: item.id, qty: item.qty }));
  
  // Add to orders list
  STATE.orders.unshift({
    id: newOrderId,
    date: dateStr,
    total: totalVal,
    status: 'En cours',
    items: orderItems
  });

  // Empty cart
  STATE.cart = [];
  updateGlobalBadges();

  showCyberToast('COMMANDE CONFIRMÉE');
  navigateTo('suivi', newOrderId);
}

// --- 06 - PORTAIL CONNEXION ADMIN ---
function getVendeursHTML() {
  return `
    <div class="page-container active">
      <div style="max-width: 450px; margin: 60px auto; padding: 40px; border-radius: var(--border-radius);" class="cyber-purple-glass">
        <div style="text-align: center; margin-bottom: 30px;">
          <div class="logo-icon" style="margin: 0 auto 15px auto;"></div>
          <h2 class="glow-text-purple" style="font-family: var(--font-title); font-size: 1.3rem; text-transform: uppercase;">Connexion Administration</h2>
          <p style="color: var(--text-secondary); font-size: 0.8rem; margin-top: 5px;">Accès réservé au vendeur unique et administrateur du site</p>
        </div>
        <div class="form-grid full" style="gap: 20px;">
          <div class="form-group">
            <label>Identifiant Administrateur</label>
            <input type="text" id="admin-user-input" value="admin">
          </div>
          <div class="form-group">
            <label>Mot de passe Cyber-clef</label>
            <input type="password" id="admin-pass-input" value="12345678">
          </div>
          <button class="cyber-btn-secondary" style="width: 100%; margin-top: 10px;" onclick="handleAdminLogin()">Se connecter</button>
        </div>
      </div>
    </div>
  `;
}

function handleAdminLogin() {
  const user = document.getElementById('admin-user-input').value;
  const pass = document.getElementById('admin-pass-input').value;
  if (user === 'admin' && pass === '12345678') {
    showCyberToast('CONNEXION RÉUSSIE');
    navigateTo('tableau-vendeur');
  } else {
    alert('Identifiant ou mot de passe incorrect.');
  }
}

// --- 07 - NOTRE BOUTIQUE (PROFIL VENDEUR) ---
function getBoutiqueVendeurHTML() {
  const productsHTML = PRODUCTS.map(prod => {
    const isWish = STATE.wishlist.has(prod.id) ? 'active' : '';
    return `
      <div class="product-card cyber-glass">
        <div class="product-card-img-wrapper" onclick="navigateTo('detail', '${prod.id}')">
          <img src="${prod.image}" alt="">
        </div>
        <div class="product-card-wishlist ${isWish}" onclick="toggleWishlist('${prod.id}')">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        <div class="product-card-info">
          <div class="product-card-brand">${prod.brand}</div>
          <div class="product-card-title" onclick="navigateTo('detail', '${prod.id}')">${prod.title}</div>
          <div class="product-card-rating">
            <div class="stars">★★★★★</div>
            <span class="reviews-count">(${prod.reviews})</span>
          </div>
          <div class="product-card-footer">
            <div class="product-card-price">${prod.price.toLocaleString('fr-FR')} FCFA</div>
            <div class="product-card-buy-btn" onclick="addToCart('${prod.id}')">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="page-container active">
      <!-- Shop Header Banner -->
      <div class="shop-banner" style="background: linear-gradient(135deg, #1e1b4b, #1e40af); border: 1px solid rgba(255,255,255,0.1);">
        <div class="shop-info-left">
          <div class="shop-avatar-large">⚡</div>
          <div>
            <h1 class="shop-name">NeoMarket Officiel</h1>
            <div style="display:flex; align-items:center; gap:15px; font-size:0.85rem; color:#e2e8f0;">
              <span class="stars" style="color:#ffb800;">★★★★★</span>
              <span>4.9 (242 avis clients)</span>
            </div>
          </div>
        </div>
        <div style="display:flex; gap:15px;">
          <button class="cyber-btn" onclick="navigateTo('messagerie');">Nous Contacter</button>
        </div>
      </div>

      <!-- Shop Tabs Nav -->
      <div class="shop-nav">
        <div class="shop-nav-btn active">Nos Produits</div>
        <div class="shop-nav-btn" onclick="showCyberToast('À propos de NeoMarket')">À Propos</div>
      </div>

      <!-- Tab Contents -->
      <div class="products-grid">
        ${productsHTML}
      </div>
    </div>
  `;
}

// --- 08 - TABLEAU DE BORD VENDEUR ---
function getTableauVendeurHTML() {
  return `
    <div class="page-container active">
      <div class="dashboard-layout">
        <!-- Sidebar Navigation -->
        <aside class="dashboard-sidebar cyber-purple-glass">
          <div class="dashboard-nav-item active">Tableau de bord</div>
          <div class="dashboard-nav-item">Produits</div>
          <div class="dashboard-nav-item">Commandes</div>
          <div class="dashboard-nav-item">Clients</div>
          <div class="dashboard-nav-item">Promotions</div>
          <div class="dashboard-nav-item">Statistiques</div>
          <div class="dashboard-nav-item">Avis</div>
          <div class="dashboard-nav-item">Paramètres</div>
        </aside>

        <!-- Main Dashboard View -->
        <main class="dashboard-main" style="padding:0;">
          <h1 class="glow-text-cyan" style="font-family:var(--font-title); font-size:1.5rem; text-transform:uppercase; margin-bottom:10px;">Console d'Administration</h1>
          <p style="color:var(--text-secondary); margin-bottom:20px; font-size:0.85rem;">Bienvenue, Administrateur Unique. Voici l'état global de votre boutique NeoMarket.</p>

          <!-- Stats Widgets -->
          <div class="stats-grid">
            <div class="stat-card cyber-glass">
              <div class="stat-header"><span>Ventes Totales</span> 💰</div>
              <div class="stat-value">12 490 000 FCFA</div>
              <div class="stat-change">▲ +12% ce mois</div>
            </div>
            <div class="stat-card cyber-glass">
              <div class="stat-header"><span>Commandes</span> 📦</div>
              <div class="stat-value">248</div>
              <div class="stat-change">▲ +8% ce mois</div>
            </div>
            <div class="stat-card cyber-glass">
              <div class="stat-header"><span>Produits</span> 🔌</div>
              <div class="stat-value">120</div>
              <div class="stat-change" style="color:var(--text-muted);">Stable</div>
            </div>
            <div class="stat-card cyber-glass">
              <div class="stat-header"><span>Clients</span> 👥</div>
              <div class="stat-value">1 245</div>
              <div class="stat-change">▲ +18% ce mois</div>
            </div>
          </div>

          <!-- Charts -->
          <div class="charts-grid">
            <div class="chart-card cyber-glass">
              <div class="chart-header">
                <span class="chart-title">Aperçu des Ventes (FCFA)</span>
              </div>
              <div class="chart-container" id="sales-line-chart-container">
                <!-- SVG Chart will be injected by drawTableauVendeurCharts -->
              </div>
            </div>
            <div class="chart-card cyber-glass">
              <div class="chart-header">
                <span class="chart-title">Répartition des ventes</span>
              </div>
              <div class="chart-container" id="sales-pie-chart-container">
                <!-- SVG Chart will be injected by drawTableauVendeurCharts -->
              </div>
            </div>
          </div>

          <!-- Recent Orders Table -->
          <div class="cyber-glass" style="border-radius:var(--border-radius); padding:25px; margin-top:20px;">
            <h2 class="chart-title" style="margin-bottom:20px; color:var(--color-cyan);">Commandes Récentes</h2>
            <div class="recent-orders-table-wrapper">
              <table class="cyber-table">
                <thead>
                  <tr>
                    <th>ID Commande</th>
                    <th>Client</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="font-weight:700; color:var(--color-cyan);">CMD-78942</td>
                    <td>Adama Koné</td>
                    <td>26 Juin 2026</td>
                    <td>450 000 FCFA</td>
                    <td><span class="cyber-badge cyber-badge-cyan">En préparation</span></td>
                  </tr>
                  <tr>
                    <td style="font-weight:700; color:var(--color-cyan);">CMD-78941</td>
                    <td>Koffi Kouamé</td>
                    <td>25 Juin 2026</td>
                    <td>150 000 FCFA</td>
                    <td><span class="cyber-badge cyber-badge-purple">Expédiée</span></td>
                  </tr>
                  <tr>
                    <td style="font-weight:700; color:var(--color-cyan);">CMD-78940</td>
                    <td>Fatou Sylla</td>
                    <td>24 Juin 2026</td>
                    <td>850 000 FCFA</td>
                    <td><span class="cyber-badge cyber-badge-cyan" style="background:rgba(16,185,129,0.15); color:#10b981; border-color:#10b981;">Livrée</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  `;
}

function drawTableauVendeurCharts() {
  const lineContainer = document.getElementById('sales-line-chart-container');
  const pieContainer = document.getElementById('sales-pie-chart-container');

  if (lineContainer) {
    // Generate an interactive SVG Line Chart
    lineContainer.innerHTML = `
      <svg viewBox="0 0 400 200" width="100%" height="100%">
        <!-- Grid Lines -->
        <line x1="40" y1="20" x2="380" y2="20" stroke="rgba(255,255,255,0.05)" />
        <line x1="40" y1="60" x2="380" y2="60" stroke="rgba(255,255,255,0.05)" />
        <line x1="40" y1="100" x2="380" y2="100" stroke="rgba(255,255,255,0.05)" />
        <line x1="40" y1="140" x2="380" y2="140" stroke="rgba(255,255,255,0.05)" />
        <line x1="40" y1="170" x2="380" y2="170" stroke="rgba(0, 240, 255, 0.2)" />
        
        <!-- Y-Axis labels -->
        <text x="30" y="25" fill="#64748b" font-size="8" text-anchor="end">2.0M</text>
        <text x="30" y="65" fill="#64748b" font-size="8" text-anchor="end">1.5M</text>
        <text x="30" y="105" fill="#64748b" font-size="8" text-anchor="end">1.0M</text>
        <text x="30" y="145" fill="#64748b" font-size="8" text-anchor="end">0.5M</text>
        
        <!-- Data Line -->
        <path d="M 50 150 Q 100 80, 150 110 T 250 50 T 350 90" fill="none" stroke="url(#line-glow-grad)" stroke-width="3" filter="url(#glow-filter)" />
        <path d="M 50 150 Q 100 80, 150 110 T 250 50 T 350 90 L 350 170 L 50 170 Z" fill="url(#area-grad)" opacity="0.15" />
        
        <!-- X-Axis Labels -->
        <text x="50" y="185" fill="#64748b" font-size="8" text-anchor="middle">Jan</text>
        <text x="110" y="185" fill="#64748b" font-size="8" text-anchor="middle">Fév</text>
        <text x="170" y="185" fill="#64748b" font-size="8" text-anchor="middle">Mar</text>
        <text x="230" y="185" fill="#64748b" font-size="8" text-anchor="middle">Avr</text>
        <text x="290" y="185" fill="#64748b" font-size="8" text-anchor="middle">Mai</text>
        <text x="350" y="185" fill="#64748b" font-size="8" text-anchor="middle">Juin</text>

        <!-- Gradients Definitions -->
        <defs>
          <linearGradient id="line-glow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#00f0ff" />
            <stop offset="100%" stop-color="#bc13fe" />
          </linearGradient>
          <linearGradient id="area-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#00f0ff" />
            <stop offset="100%" stop-color="transparent" />
          </linearGradient>
          <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    `;
  }

  if (pieContainer) {
    // Generate an interactive SVG Pie Chart
    pieContainer.innerHTML = `
      <svg viewBox="0 0 200 200" width="100%" height="100%">
        <!-- Pie slices -->
        <circle r="60" cx="100" cy="100" fill="transparent" stroke="#00f0ff" stroke-width="40" stroke-dasharray="188 377" stroke-dashoffset="0" />
        <circle r="60" cx="100" cy="100" fill="transparent" stroke="#bc13fe" stroke-width="40" stroke-dasharray="94 377" stroke-dashoffset="-188" />
        <circle r="60" cx="100" cy="100" fill="transparent" stroke="#ff2e93" stroke-width="40" stroke-dasharray="62 377" stroke-dashoffset="-282" />
        <circle r="60" cx="100" cy="100" fill="transparent" stroke="#ff5e00" stroke-width="40" stroke-dasharray="33 377" stroke-dashoffset="-344" />
        
        <!-- Legend in middle (donut-style) -->
        <circle r="30" cx="100" cy="100" fill="#121829" />
        
        <!-- Legend items sidebar simulation -->
        <text x="100" y="98" fill="#ffffff" font-size="8" font-family="Orbitron" font-weight="bold" text-anchor="middle">VENTES</text>
        <text x="100" y="110" fill="#00f0ff" font-size="9" font-family="Orbitron" font-weight="bold" text-anchor="middle">NEOMARKET</text>
      </svg>
    `;
  }
}

// --- 09 - COMPTE CLIENT ---
function getCompteClientHTML() {
  const addressesHTML = STATE.userAddresses.map((addr, i) => `
    <div class="address-card cyber-glass">
      <div class="address-header">
        <span>${addr.type}</span>
        <span style="cursor:pointer; color:var(--color-cyan);" onclick="editAddress(${i})">Modifier</span>
      </div>
      <div class="address-body" id="addr-body-${i}">
        <p>${addr.address}</p>
        <p style="margin-top:10px;">Tél: ${addr.phone}</p>
      </div>
    </div>
  `).join('');

  return `
    <div class="page-container active">
      <div class="account-layout">
        <!-- Sidebar -->
        <aside class="dashboard-sidebar cyber-purple-glass">
          <div class="dashboard-nav-item active">Informations personnelles</div>
          <div class="dashboard-nav-item" onclick="navigateTo('commandes')">Mes commandes</div>
          <div class="dashboard-nav-item">Mes adresses</div>
          <div class="dashboard-nav-item">Paiement</div>
          <div class="dashboard-nav-item" onclick="navigateTo('favoris')">Mes favoris</div>
          <div class="dashboard-nav-item">Mes avis</div>
          <div class="dashboard-nav-item">Sécurité</div>
        </aside>

        <!-- Account content -->
        <div>
          <div class="form-card cyber-glass">
            <h2>Informations Personnelles</h2>
            <div class="form-grid">
              <div class="form-group">
                <label>Nom complet</label>
                <input type="text" value="Jean Dupont" id="acc-name">
              </div>
              <div class="form-group">
                <label>Téléphone</label>
                <input type="text" value="+225 07 12 34 56 78" id="acc-phone">
              </div>
              <div class="form-group col-span-2">
                <label>Email</label>
                <input type="email" value="jean.dupont@email.com" id="acc-email">
              </div>
            </div>
            <button class="cyber-btn" style="margin-top:25px;" onclick="saveAccountInfo()">Enregistrer modifications</button>
          </div>

          <div class="form-card cyber-glass" style="margin-top:30px;">
            <h2>Adresses Enregistrées</h2>
            <div class="addresses-grid">
              ${addressesHTML}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function saveAccountInfo() {
  showCyberToast('PROFIL ENREGISTRÉ');
}

function editAddress(idx) {
  const addr = STATE.userAddresses[idx];
  const newAddr = prompt("Saisissez la nouvelle adresse :", addr.address);
  const newPhone = prompt("Saisissez le nouveau numéro de téléphone :", addr.phone);
  
  if (newAddr && newPhone) {
    STATE.userAddresses[idx].address = newAddr;
    STATE.userAddresses[idx].phone = newPhone;
    renderActivePage();
    showCyberToast('ADRESSE MODIFIÉE');
  }
}

// --- 10 - MES COMMANDES ---
function getMesCommandesHTML() {
  const list = STATE.orders.map(ord => {
    let badgeClass = 'cyber-badge-cyan';
    if (ord.status === 'Expédiée') badgeClass = 'cyber-badge-purple';
    if (ord.status === 'Livrée') badgeClass = 'cyber-badge-cyan'; // customized green
    if (ord.status === 'Annulée') badgeClass = 'cyber-badge-pink';

    const statusStyle = ord.status === 'Livrée' ? 'background:rgba(16,185,129,0.15); color:#10b981; border-color:#10b981;' : '';

    return `
      <div class="order-card cyber-glass">
        <div class="order-info">
          <span class="order-number">${ord.id}</span>
          <span class="order-date">Créée le ${ord.date}</span>
        </div>
        <div class="order-total">${ord.total.toLocaleString('fr-FR')} FCFA</div>
        <div>
          <span class="cyber-badge ${badgeClass}" style="${statusStyle}">${ord.status}</span>
        </div>
        <button class="cyber-btn-outline" onclick="navigateTo('suivi', '${ord.id}')">Voir détails</button>
      </div>
    `;
  }).join('');

  return `
    <div class="page-container active">
      <div class="account-layout">
        <!-- Sidebar -->
        <aside class="dashboard-sidebar cyber-purple-glass">
          <div class="dashboard-nav-item" onclick="navigateTo('compte')">Informations personnelles</div>
          <div class="dashboard-nav-item active">Mes commandes</div>
          <div class="dashboard-nav-item">Mes adresses</div>
          <div class="dashboard-nav-item">Paiement</div>
          <div class="dashboard-nav-item" onclick="navigateTo('favoris')">Mes favoris</div>
          <div class="dashboard-nav-item">Mes avis</div>
          <div class="dashboard-nav-item">Sécurité</div>
        </aside>

        <!-- Content -->
        <div class="orders-list">
          <h1 class="glow-text-cyan" style="font-family:var(--font-title); font-size:1.5rem; text-transform:uppercase; margin-bottom:20px;">Mes Commandes</h1>
          ${list}
        </div>
      </div>
    </div>
  `;
}

// --- 11 - SUIVI DE COMMANDE ---
function getSuiviCommandeHTML() {
  return `
    <div class="page-container active">
      <div class="account-layout">
        <!-- Sidebar -->
        <aside class="dashboard-sidebar cyber-purple-glass">
          <div class="dashboard-nav-item" onclick="navigateTo('compte')">Informations personnelles</div>
          <div class="dashboard-nav-item active" onclick="navigateTo('commandes')">Mes commandes</div>
          <div class="dashboard-nav-item">Mes adresses</div>
          <div class="dashboard-nav-item">Paiement</div>
          <div class="dashboard-nav-item" onclick="navigateTo('favoris')">Mes favoris</div>
          <div class="dashboard-nav-item">Mes avis</div>
          <div class="dashboard-nav-item">Sécurité</div>
        </aside>

        <!-- Tracking View -->
        <div class="tracking-wrapper">
          <h1 class="glow-text-cyan" style="font-family:var(--font-title); font-size:1.5rem; text-transform:uppercase;">Suivi de commande #CMD-12345</h1>

          <!-- Timeline -->
          <div class="tracking-timeline cyber-glass">
            <div class="timeline-progress-bar" id="timeline-progress-bar-el" style="width: 50%;"></div>
            
            <div class="timeline-step completed">
              <div class="step-dot">✓</div>
              <span class="step-label">Confirmée</span>
            </div>
            <div class="timeline-step completed">
              <div class="step-dot">✓</div>
              <span class="step-label">En préparation</span>
            </div>
            <div class="timeline-step active">
              <div class="step-dot">🚚</div>
              <span class="step-label">Expédiée</span>
            </div>
            <div class="timeline-step">
              <div class="step-dot">📍</div>
              <span class="step-label">En livraison</span>
            </div>
            <div class="timeline-step">
              <div class="step-dot">🏁</div>
              <span class="step-label">Livrée</span>
            </div>
          </div>

          <!-- Courier details -->
          <div class="form-card cyber-glass">
            <h2>Informations de Livraison</h2>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; font-size:0.85rem; color:var(--text-secondary);">
              <div>
                <p>Transporteur : <strong style="color:#fff;">Cyber-Courier Chronopost</strong></p>
                <p style="margin-top:8px;">Numéro de suivi : <strong style="color:#fff;">CP2348576483</strong></p>
              </div>
              <div>
                <p>Estimation de livraison : <strong style="color:#fff;">27 Juin 2026</strong></p>
              </div>
            </div>
          </div>

          <!-- Simulated Map -->
          <div class="map-simulation" id="map-simulation-container">
            <!-- Simulated map with road paths and animating courier icon -->
          </div>
        </div>
      </div>
    </div>
  `;
}

function startSuiviMapSimulation() {
  const container = document.getElementById('map-simulation-container');
  if (container) {
    container.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 600 300" style="background:#0a0f1d;">
        <!-- Simulated grid map -->
        <path d="M 50 150 L 250 150 L 250 80 L 450 80 L 450 220 L 550 220" fill="none" stroke="#1f293d" stroke-width="6" />
        <path d="M 50 150 L 250 150 L 250 80 L 450 80 L 450 220 L 550 220" fill="none" stroke="#00f0ff" stroke-width="2" opacity="0.3" />
        
        <!-- Nodes -->
        <circle cx="50" cy="150" r="6" fill="#bc13fe" />
        <text x="50" y="135" fill="#bc13fe" font-size="8" font-family="Orbitron" text-anchor="middle">DÉPART</text>

        <circle cx="550" cy="220" r="6" fill="#00f0ff" />
        <text x="550" y="205" fill="#00f0ff" font-size="8" font-family="Orbitron" text-anchor="middle">ARRIVÉE</text>

        <!-- Animating Courier -->
        <circle cx="50" cy="150" r="10" fill="#00f0ff" filter="url(#map-glow-filter)" id="courier-node-map">
          <animateMotion path="M 0 0 L 200 0 L 200 -70 L 400 -70 L 400 70 L 500 70" dur="8s" repeatCount="indefinite" />
        </circle>

        <!-- Glowing filter -->
        <defs>
          <filter id="map-glow-filter">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    `;
  }
}

// --- 12 - RECHERCHE ---
function getRechercheHTML() {
  const query = STATE.searchQuery.toLowerCase();
  const matched = PRODUCTS.filter(p => p.title.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query));
  
  return getProduitsHTML(matched);
}

// --- 13 - FAVORIS ---
function getFavorisHTML() {
  const wishArray = Array.from(STATE.wishlist).map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);

  if (wishArray.length === 0) {
    return `
      <div class="page-container active" style="text-align:center; padding:80px 20px;">
        <h2 class="glow-text-cyan" style="font-family:var(--font-title); margin-bottom:15px;">AUCUN FAVORIS</h2>
        <p style="color:var(--text-secondary); margin-bottom:30px;">Cliquez sur l'icône de cœur sur les fiches produits pour les retrouver ici.</p>
        <button class="cyber-btn" onclick="navigateTo('produits')">Voir les Produits</button>
      </div>
    `;
  }

  const grid = wishArray.map(prod => `
    <div class="product-card cyber-glass">
      <div class="product-card-img-wrapper" onclick="navigateTo('detail', '${prod.id}')">
        <img src="${prod.image}" alt="">
      </div>
      <div class="product-card-wishlist active" onclick="toggleWishlist('${prod.id}')">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>
      <div class="product-card-info">
        <div class="product-card-brand">${prod.brand}</div>
        <div class="product-card-title" onclick="navigateTo('detail', '${prod.id}')">${prod.title}</div>
        <div class="product-card-footer">
          <div class="product-card-price">${prod.price.toLocaleString('fr-FR')} FCFA</div>
          <button class="cyber-btn-outline" style="padding: 5px 10px;" onclick="navigateTo('detail', '${prod.id}')">Voir produit</button>
        </div>
      </div>
    </div>
  `).join('');

  return `
    <div class="page-container active">
      <h1 class="glow-text-cyan" style="font-family:var(--font-title); font-size:1.5rem; text-transform:uppercase; margin-bottom:30px;">Mes Favoris (${wishArray.length})</h1>
      <div class="products-grid">
        ${grid}
      </div>
    </div>
  `;
}

// --- 14 - MESSAGERIE ---
function getMessagerieHTML() {
  const contactsHTML = STATE.contacts.map(c => `
    <div class="contact-item ${STATE.activeContactId === c.id ? 'active' : ''}" onclick="selectContact('${c.id}')">
      <div class="contact-avatar">${c.avatar}</div>
      <div class="contact-info">
        <div class="contact-name">${c.name}</div>
        <div class="contact-last-msg">${c.messages[c.messages.length - 1].text}</div>
      </div>
    </div>
  `).join('');

  const activeContact = STATE.contacts.find(c => c.id === STATE.activeContactId) || STATE.contacts[0];
  const messagesHTML = activeContact.messages.map(m => `
    <div class="message-bubble ${m.sender === 'me' ? 'outgoing' : 'incoming'}">
      ${m.text}
    </div>
  `).join('');

  return `
    <div class="page-container active">
      <div class="messaging-layout cyber-glass" style="padding:20px;">
        <!-- Left panel -->
        <aside class="contacts-list">
          ${contactsHTML}
        </aside>

        <!-- Right Chat Panel -->
        <section class="chat-window cyber-purple-glass">
          <div class="chat-header">
            <div class="contact-avatar">${activeContact.avatar}</div>
            <div>
              <div style="font-weight:700;">${activeContact.name}</div>
              <div style="font-size:0.75rem; color:var(--color-cyan);">${activeContact.status}</div>
            </div>
          </div>

          <div class="chat-messages" id="chat-messages-container">
            ${messagesHTML}
          </div>

          <div class="chat-input-area">
            <input type="text" id="chat-input-el" placeholder="Tapez votre message ici..." onkeydown="handleChatInput(event)">
            <button class="cyber-btn" onclick="sendChatMessage()">Envoyer</button>
          </div>
        </section>
      </div>
    </div>
  `;
}

function selectContact(cId) {
  STATE.activeContactId = cId;
  renderActivePage();
}

function handleChatInput(event) {
  if (event.key === 'Enter') {
    sendChatMessage();
  }
}

function sendChatMessage() {
  const input = document.getElementById('chat-input-el');
  if (!input) return;
  const val = input.value.trim();
  if (!val) return;

  const activeC = STATE.contacts.find(c => c.id === STATE.activeContactId);
  if (activeC) {
    activeC.messages.push({ sender: 'me', text: val });
    input.value = '';
    renderActivePage();
    scrollToChatBottom();

    // Trigger mock response
    setTimeout(() => {
      let replyText = "Merci pour votre message. Un agent de support va prendre contact avec vous rapidement.";
      if (activeC.id === 'tech-world') {
        replyText = "Bonjour ! Nous pouvons programmer la livraison à votre adresse dès demain matin.";
      }
      activeC.messages.push({ sender: 'them', text: replyText });
      renderActivePage();
      scrollToChatBottom();
      showCyberToast('NOUVEAU MESSAGE REÇU');
    }, 1500);
  }
}

function scrollToChatBottom() {
  const container = document.getElementById('chat-messages-container');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

// --- 15 - SUPPORT ---
function getSupportHTML() {
  const faqs = [
    { q: "Comment suivre ma commande ?", a: "Vous pouvez suivre l'état de votre livraison en temps réel en vous rendant dans l'onglet 'Mes Commandes', puis en sélectionnant la commande en cours et en cliquant sur 'Suivi de commande'. Notre drone cartographique vous montre la progression exacte de votre colis." },
    { q: "Quels sont les délais de livraison ?", a: "La livraison standard est de 3 à 5 jours. La livraison express garantit une livraison en moins de 24 heures pour toute commande validée avant midi." },
    { q: "Comment retourner un produit ?", a: "Pour retourner un produit, contactez le vendeur ou le support technique de NeoMarket sous 30 jours à compter de la réception de votre article pour éditer votre étiquette de retour." },
    { q: "Quels moyens de paiement acceptez-vous ?", a: "Nous acceptons les règlements par Mobile Money (Orange Money, Wave) ainsi que les cartes bancaires Visa et Mastercard." },
    { q: "Comment contacter un vendeur ?", a: "Rendez-vous sur la boutique du vendeur en question, puis cliquez sur le bouton 'Contacter' pour ouvrir un salon de discussion privé crypté de bout en bout." }
  ];

  const faqsHTML = faqs.map((f, i) => `
    <div class="faq-item ${STATE.faqActiveIndex === i ? 'active' : ''}">
      <div class="faq-q" onclick="toggleFaqAccordion(${i})">
        <span>${f.q}</span>
        <span>${STATE.faqActiveIndex === i ? '▲' : '▼'}</span>
      </div>
      <div class="faq-a">
        ${f.a}
      </div>
    </div>
  `).join('');

  return `
    <div class="page-container active">
      <div style="text-align:center; max-width:600px; margin:0 auto 50px auto;">
        <h1 class="glow-text-cyan" style="font-family:var(--font-title); font-size:1.8rem; text-transform:uppercase; margin-bottom:15px;">Comment pouvons-nous vous aider ?</h1>
        <div class="hero-search">
          <input type="text" placeholder="Rechercher une solution...">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <!-- FAQ categories -->
      <div class="faq-grid">
        <div class="faq-card cyber-glass">
          <span>📦</span>
          <h3>Commandes & Livraisons</h3>
        </div>
        <div class="faq-card cyber-glass">
          <span>💰</span>
          <h3>Paiements</h3>
        </div>
        <div class="faq-card cyber-glass">
          <span>🔄</span>
          <h3>Retours & Remboursements</h3>
        </div>
        <div class="faq-card cyber-glass">
          <span>🔒</span>
          <h3>Compte & Sécurité</h3>
        </div>
      </div>

      <!-- FAQ Accordions -->
      <h2 class="glow-text-purple" style="font-family:var(--font-title); font-size:1.1rem; text-transform:uppercase; text-align:center; margin-bottom:25px;">Questions Fréquentes</h2>
      <div class="faq-accordions">
        ${faqsHTML}
      </div>

      <div style="text-align:center; margin-top:50px;">
        <button class="cyber-btn" onclick="submitSupportTicket()">Contacter le Support Technique</button>
      </div>
    </div>
  `;
}

function toggleFaqAccordion(idx) {
  STATE.faqActiveIndex = STATE.faqActiveIndex === idx ? -1 : idx;
  renderActivePage();
}

function submitSupportTicket() {
  const desc = prompt("Décrivez brièvement votre problème technique :");
  if (desc) {
    showCyberToast("TICKET DE SUPPORT CRÉÉ #TK-" + Math.floor(10000 + Math.random()*90000));
  }
}

// --- 16 - PAGE 404 ---
function get404HTML() {
  return `
    <div class="page-container active">
      <div class="page-404-layout">
        <div class="error-404-content">
          <div class="error-404-code">404</div>
          <h1 class="error-404-title glow-text-cyan">Oups ! Page introuvable</h1>
          <p class="error-404-desc">La ressource technologique que vous tentez de charger a été déplacée, supprimée ou n'existe pas dans ce quadrant de la mégalopole.</p>
          <button class="cyber-btn" onclick="navigateTo('accueil')">Retour à l'accueil</button>
        </div>
        <div class="error-404-img-wrapper">
          <img src="assets/astronaut_lost.png" alt="Astronaute perdu dans le cyber-espace">
        </div>
      </div>
    </div>
  `;
}

/* --- DEV SWITCHER CONTROLLER --- */
let isDevOpen = true;
function toggleDevPanel() {
  const body = document.getElementById('dev-panel-body');
  const icon = document.getElementById('dev-toggle-icon');
  if (body && icon) {
    isDevOpen = !isDevOpen;
    body.style.display = isDevOpen ? 'flex' : 'none';
    icon.style.transform = isDevOpen ? 'rotate(0deg)' : 'rotate(180deg)';
  }
}

function initDevPanel() {
  const panel = document.getElementById('dev-panel-body');
  if (panel) {
    panel.innerHTML = PAGES.map(p => `
      <button class="dev-page-btn ${STATE.activePage === p.id ? 'active' : ''}" data-page="${p.id}" onclick="navigateTo('${p.id}')">
        <span>${p.name}</span>
        <span>➔</span>
      </button>
    `).join('');
  }
}

/* --- APP INITIALIZATION --- */
document.addEventListener('DOMContentLoaded', () => {
  initDB();
  initDevPanel();
  renderActivePage();
});
