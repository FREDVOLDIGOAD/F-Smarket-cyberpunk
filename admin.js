/* --- ADMIN APP STATE --- */
const STATE_ADMIN = {
  activePage: 'login',
  isLoggedIn: false,
  activeTab: 'console' // console, products, orders, clients, promos, stats, reviews, config
};

/* --- SHARED DATABASE STRUCTURE --- */
let DB = {
  products: [
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
  ],
  orders: [
    { id: 'CMD-12345', client: 'Jean Dupont', date: '12 Juin 2026', total: 450000, status: 'En cours' },
    { id: 'CMD-12344', client: 'Koffi Kouamé', date: '02 Juin 2026', total: 150000, status: 'Expédiée' },
    { id: 'CMD-12343', client: 'Fatou Sylla', date: '18 Mai 2026', total: 850000, status: 'Livrée' },
    { id: 'CMD-12342', client: 'Alice Smith', date: '12 Mars 2026', total: 450000, status: 'Annulée' }
  ],
  promos: [
    { code: 'CYBER50', discount: 50 },
    { code: 'NEO15', discount: 15 }
  ],
  clients: [
    { name: 'Jean Dupont', email: 'jean.dupont@email.com', date: '12 Mars 2026', total: 450000 },
    { name: 'Alice Smith', email: 'alice.smith@email.com', date: '01 Avr 2026', total: 850000 },
    { name: 'Adama Koné', email: 'adama.kone@gmail.com', date: '15 Mai 2026', total: 600000 }
  ],
  reviews: [
    { author: 'Jean Dupont', product: 'Samsung Galaxy S23', text: 'Ce smartphone est un monstre technologique !', rating: 5 },
    { author: 'Alice Smith', product: 'Samsung Galaxy S23', text: 'Livraison rapide et emballage soigné.', rating: 5 }
  ],
  config: {
    siteName: 'NeoMarket',
    shipping: 5000,
    supportEmail: 'contact@neomarket.cyber',
    maintenanceMode: false
  }
};

/* --- DB LOAD/SAVE --- */
function loadDB() {
  const saved = localStorage.getItem('NEOMARKET_DB');
  if (saved) {
    DB = JSON.parse(saved);
  } else {
    saveDB();
  }
}

function saveDB() {
  localStorage.setItem('NEOMARKET_DB', JSON.stringify(DB));
}

const PAGES_ADMIN = [
  { id: 'login', name: '06 - CONNEXION PORTAIL ADMIN' },
  { id: 'dashboard', name: '08 - CONSOLE D\'ADMINISTRATION' }
];

/* --- ADMIN SPA ROUTER --- */
function navigateToAdmin(pageId) {
  if (pageId === 'dashboard' && !STATE_ADMIN.isLoggedIn) {
    pageId = 'login';
    showAdminToast('AUTHENTIFICATION REQUISE');
  }

  STATE_ADMIN.activePage = pageId;

  const dashLi = document.getElementById('nav-dashboard');
  if (dashLi) {
    dashLi.classList.toggle('active', pageId === 'dashboard');
  }

  document.querySelectorAll('.dev-page-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === pageId);
  });

  renderAdminPage();
}

/* --- RENDER ACTIVE PAGE --- */
function renderAdminPage() {
  loadDB();
  const container = document.getElementById('page-content');
  if (!container) return;

  switch (STATE_ADMIN.activePage) {
    case 'login':
      container.innerHTML = getLoginHTML();
      break;
    case 'dashboard':
      container.innerHTML = getDashboardHTML();
      if (STATE_ADMIN.activeTab === 'console') {
        drawAdminDashboardCharts();
      }
      break;
    default:
      container.innerHTML = getLoginHTML();
      break;
  }
}

function selectAdminTab(tabId) {
  STATE_ADMIN.activeTab = tabId;
  renderAdminPage();
}

/* --- LOGIC HANDLERS --- */
function handleAdminFormLogin() {
  const user = document.getElementById('admin-user-input').value.trim();
  const pass = document.getElementById('admin-pass-input').value.trim();

  if (user === 'admin' && pass === '12345678') {
    STATE_ADMIN.isLoggedIn = true;
    showAdminToast('CONNEXION RÉUSSIE');
    navigateToAdmin('dashboard');
  } else {
    alert('Identifiant ou mot de passe incorrect.\nUtilisez admin / 12345678');
  }
}

function showAdminToast(text) {
  const toast = document.createElement('div');
  toast.className = 'cyber-badge cyber-badge-purple';
  toast.style.position = 'fixed';
  toast.style.bottom = '30px';
  toast.style.left = '30px';
  toast.style.zIndex = '10000';
  toast.style.padding = '12px 24px';
  toast.style.fontSize = '0.85rem';
  toast.style.boxShadow = '0 0 15px rgba(188, 19, 254, 0.6)';
  toast.style.animation = 'page-fade-in 0.3s ease-out';
  toast.innerHTML = `<span class="glow-text-purple">⚡ ${text}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.5s';
    setTimeout(() => toast.remove(), 500);
  }, 2500);
}

/* --- HTML TEMPLATES --- */

// --- 06 - CONNEXION ADMIN PORTAL ---
function getLoginHTML() {
  return `
    <div class="page-container active">
      <div style="max-width: 450px; margin: 80px auto; padding: 40px; border-radius: var(--border-radius);" class="cyber-purple-glass">
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
            <input type="password" id="admin-pass-input" value="12345678" onkeydown="if(event.key==='Enter') handleAdminFormLogin()">
          </div>
          <button class="cyber-btn-secondary" style="width: 100%; margin-top: 10px;" onclick="handleAdminFormLogin()">Se connecter</button>
        </div>
      </div>
    </div>
  `;
}

// --- 08 - CONSOLE D'ADMINISTRATION COMPOSITE ---
function getDashboardHTML() {
  const activeTab = STATE_ADMIN.activeTab;
  return `
    <div class="page-container active" style="padding: 20px 4%;">
      <div class="dashboard-layout">
        <!-- Sidebar Navigation -->
        <aside class="dashboard-sidebar cyber-purple-glass">
          <div class="dashboard-nav-item ${activeTab === 'console' ? 'active' : ''}" onclick="selectAdminTab('console')">Console Générale</div>
          <div class="dashboard-nav-item ${activeTab === 'products' ? 'active' : ''}" onclick="selectAdminTab('products')">Gestion Produits</div>
          <div class="dashboard-nav-item ${activeTab === 'orders' ? 'active' : ''}" onclick="selectAdminTab('orders')">Commandes</div>
          <div class="dashboard-nav-item ${activeTab === 'clients' ? 'active' : ''}" onclick="selectAdminTab('clients')">Clients</div>
          <div class="dashboard-nav-item ${activeTab === 'promos' ? 'active' : ''}" onclick="selectAdminTab('promos')">Promotions</div>
          <div class="dashboard-nav-item ${activeTab === 'stats' ? 'active' : ''}" onclick="selectAdminTab('stats')">Statistiques</div>
          <div class="dashboard-nav-item ${activeTab === 'reviews' ? 'active' : ''}" onclick="selectAdminTab('reviews')">Avis Modération</div>
          <div class="dashboard-nav-item ${activeTab === 'config' ? 'active' : ''}" onclick="selectAdminTab('config')">Configuration</div>
        </aside>

        <!-- Main Dashboard View -->
        <main class="dashboard-main" style="padding:0;" id="admin-main-view">
          ${getAdminTabContentHTML(activeTab)}
        </main>
      </div>
    </div>
  `;
}

function getAdminTabContentHTML(tabId) {
  switch (tabId) {
    case 'products':
      return getAdminProductsHTML();
    case 'orders':
      return getAdminOrdersHTML();
    case 'clients':
      return getAdminClientsHTML();
    case 'promos':
      return getAdminPromosHTML();
    case 'stats':
      return getAdminStatsHTML();
    case 'reviews':
      return getAdminReviewsHTML();
    case 'config':
      return getAdminConfigHTML();
    case 'console':
    default:
      return getAdminConsoleHTML();
  }
}

// TABS RENDERERS

// Tab: Console Générale
function getAdminConsoleHTML() {
  const recentOrders = DB.orders.slice(0, 3).map(ord => {
    let badgeClass = 'cyber-badge-cyan';
    if (ord.status === 'Expédiée') badgeClass = 'cyber-badge-purple';
    if (ord.status === 'Livrée') badgeClass = 'cyber-badge-cyan'; // green style
    if (ord.status === 'Annulée') badgeClass = 'cyber-badge-pink';

    const statusStyle = ord.status === 'Livrée' ? 'background:rgba(16,185,129,0.15); color:#10b981; border-color:#10b981;' : '';
    return `
      <tr>
        <td style="font-weight:700; color:var(--color-cyan);">${ord.id}</td>
        <td>${ord.client}</td>
        <td>${ord.date}</td>
        <td>${ord.total.toLocaleString('fr-FR')} FCFA</td>
        <td><span class="cyber-badge ${badgeClass}" style="${statusStyle}">${ord.status}</span></td>
      </tr>
    `;
  }).join('');

  return `
    <h1 class="glow-text-cyan" style="font-family:var(--font-title); font-size:1.5rem; text-transform:uppercase; margin-bottom:10px;">Console Générale</h1>
    <p style="color:var(--text-secondary); margin-bottom:20px; font-size:0.85rem;">Bienvenue, Administrateur Unique. Voici l'état global de votre boutique NeoMarket.</p>

    <!-- Stats Widgets -->
    <div class="stats-grid">
      <div class="stat-card cyber-glass">
        <div class="stat-header"><span>Ventes Totales</span> 💰</div>
        <div class="stat-value">${DB.orders.reduce((sum, o) => o.status !== 'Annulée' ? sum + o.total : sum, 0).toLocaleString('fr-FR')} FCFA</div>
        <div class="stat-change">▲ +12% ce mois</div>
      </div>
      <div class="stat-card cyber-glass">
        <div class="stat-header"><span>Commandes</span> 📦</div>
        <div class="stat-value">${DB.orders.length}</div>
        <div class="stat-change">▲ +8% ce mois</div>
      </div>
      <div class="stat-card cyber-glass">
        <div class="stat-header"><span>Produits Actifs</span> 🔌</div>
        <div class="stat-value">${DB.products.length}</div>
        <div class="stat-change" style="color:var(--text-muted);">Géré localement</div>
      </div>
      <div class="stat-card cyber-glass">
        <div class="stat-header"><span>Utilisateurs</span> 👥</div>
        <div class="stat-value">${DB.clients.length}</div>
        <div class="stat-change">▲ +18% ce mois</div>
      </div>
    </div>

    <!-- Charts -->
    <div class="charts-grid">
      <div class="chart-card cyber-glass">
        <div class="chart-header"><span class="chart-title">Aperçu des Ventes (FCFA)</span></div>
        <div class="chart-container" id="sales-line-chart-container"></div>
      </div>
      <div class="chart-card cyber-glass">
        <div class="chart-header"><span class="chart-title">Répartition des Ventes</span></div>
        <div class="chart-container" id="sales-pie-chart-container"></div>
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
            ${recentOrders || '<tr><td colspan="5" style="text-align:center;">Aucune commande disponible.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Tab: Gestion Produits
function getAdminProductsHTML() {
  const prodRows = DB.products.map(prod => `
    <tr>
      <td><img src="${prod.image}" style="width: 40px; height: 40px; object-fit: contain; background: var(--bg-input); border-radius: 4px; padding: 4px;"></td>
      <td style="font-weight:700;">${prod.title}</td>
      <td>${prod.brand}</td>
      <td style="font-family:var(--font-title);">${prod.price.toLocaleString('fr-FR')} FCFA</td>
      <td>
        <button class="cyber-btn-secondary" style="padding: 5px 10px; font-size: 0.7rem;" onclick="deleteAdminProduct('${prod.id}')">Supprimer</button>
      </td>
    </tr>
  `).join('');

  return `
    <h1 class="glow-text-cyan" style="font-family:var(--font-title); font-size:1.5rem; text-transform:uppercase; margin-bottom:10px;">Gestion des Produits</h1>
    <p style="color:var(--text-secondary); margin-bottom:20px; font-size:0.85rem;">Ajoutez ou supprimez les articles proposés sur le catalogue public.</p>

    <div class="charts-grid" style="grid-template-columns: 1.5fr 1fr;">
      <!-- Product list -->
      <div class="cyber-glass" style="padding:25px; border-radius:var(--border-radius); height: fit-content;">
        <h2 class="chart-title" style="margin-bottom:20px; color:var(--color-cyan);">Catalogue Actuel</h2>
        <div class="recent-orders-table-wrapper">
          <table class="cyber-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Titre</th>
                <th>Marque</th>
                <th>Prix</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${prodRows || '<tr><td colspan="5" style="text-align:center;">Aucun produit dans le catalogue.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add Product Form -->
      <div class="cyber-glass" style="padding:25px; border-radius:var(--border-radius); height: fit-content;">
        <h2 class="chart-title" style="margin-bottom:20px; color:var(--color-purple);">Ajouter un Produit</h2>
        <div class="form-grid full" style="gap: 15px;">
          <div class="form-group">
            <label>Nom du Produit</label>
            <input type="text" id="admin-new-title" placeholder="Ex: Galaxy Buds Pro">
          </div>
          <div class="form-group">
            <label>Marque</label>
            <input type="text" id="admin-new-brand" placeholder="Ex: Samsung">
          </div>
          <div class="form-group">
            <label>Prix (FCFA)</label>
            <input type="number" id="admin-new-price" placeholder="Ex: 85000">
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea id="admin-new-desc" style="background:var(--bg-input); border:1px solid rgba(255,255,255,0.08); padding:10px; border-radius:4px; font-size:0.85rem; height:80px;" placeholder="Description marketing..."></textarea>
          </div>
          <button class="cyber-btn" onclick="saveAdminNewProduct()">Créer le Produit</button>
        </div>
      </div>
    </div>
  `;
}

function saveAdminNewProduct() {
  const title = document.getElementById('admin-new-title').value.trim();
  const brand = document.getElementById('admin-new-brand').value.trim();
  const priceVal = parseInt(document.getElementById('admin-new-price').value) || 0;
  const desc = document.getElementById('admin-new-desc').value.trim();

  if (!title || !brand || priceVal <= 0) {
    alert("Veuillez renseigner les champs obligatoires (Titre, Marque, Prix).");
    return;
  }

  const id = 'prod-' + Math.floor(10000 + Math.random() * 90000);
  DB.products.push({
    id: id,
    title: title,
    brand: brand,
    price: priceVal,
    originalPrice: Math.floor(priceVal * 1.15),
    rating: 5.0,
    reviews: 0,
    image: 'assets/product_headphones.png', // Default generated asset
    desc: desc || "Aucune description fournie.",
    specs: { 'Type': 'Nouveau produit', 'Garantie': '12 mois' },
    colors: ['#0f172a', '#e2e8f0']
  });

  saveDB();
  renderAdminPage();
  showAdminToast('PRODUIT CRÉÉ ET PUBLIÉ');
}

function deleteAdminProduct(prodId) {
  if (confirm("Voulez-vous vraiment retirer ce produit du catalogue ?")) {
    DB.products = DB.products.filter(p => p.id !== prodId);
    saveDB();
    renderAdminPage();
    showAdminToast('PRODUIT SUPPRIMÉ');
  }
}

// Tab: Commandes
function getAdminOrdersHTML() {
  const orderRows = DB.orders.map(ord => {
    return `
      <tr>
        <td style="font-weight:700; color:var(--color-cyan);">${ord.id}</td>
        <td>${ord.client}</td>
        <td>${ord.date}</td>
        <td style="font-family:var(--font-title); font-weight:600;">${ord.total.toLocaleString('fr-FR')} FCFA</td>
        <td>
          <select style="background:var(--bg-input); border:1px solid rgba(255,255,255,0.08); padding:6px; border-radius:4px; font-size:0.8rem; cursor:pointer;" onchange="updateAdminOrderStatus('${ord.id}', this.value)">
            <option value="En cours" ${ord.status === 'En cours' ? 'selected' : ''}>En cours</option>
            <option value="Expédiée" ${ord.status === 'Expédiée' ? 'selected' : ''}>Expédiée</option>
            <option value="Livrée" ${ord.status === 'Livrée' ? 'selected' : ''}>Livrée</option>
            <option value="Annulée" ${ord.status === 'Annulée' ? 'selected' : ''}>Annulée</option>
          </select>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <h1 class="glow-text-cyan" style="font-family:var(--font-title); font-size:1.5rem; text-transform:uppercase; margin-bottom:10px;">Gestion des Commandes</h1>
    <p style="color:var(--text-secondary); margin-bottom:20px; font-size:0.85rem;">Suivez et mettez à jour le statut des expéditions en temps réel.</p>

    <div class="cyber-glass" style="padding:25px; border-radius:var(--border-radius);">
      <div class="recent-orders-table-wrapper">
        <table class="cyber-table">
          <thead>
            <tr>
              <th>ID Commande</th>
              <th>Client</th>
              <th>Date</th>
              <th>Montant Total</th>
              <th>Changer le Statut</th>
            </tr>
          </thead>
          <tbody>
            ${orderRows || '<tr><td colspan="5" style="text-align:center;">Aucune commande enregistrée.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function updateAdminOrderStatus(orderId, newStatus) {
  const ord = DB.orders.find(o => o.id === orderId);
  if (ord) {
    ord.status = newStatus;
    saveDB();
    renderAdminPage();
    showAdminToast(`STATUT COMMANDE MIS À JOUR : ${newStatus.toUpperCase()}`);
  }
}

// Tab: Clients
function getAdminClientsHTML() {
  const clientRows = DB.clients.map(c => `
    <tr>
      <td style="font-weight:700; color:var(--color-cyan);">${c.name}</td>
      <td>${c.email}</td>
      <td>${c.date}</td>
      <td style="font-family:var(--font-title);">${c.total.toLocaleString('fr-FR')} FCFA</td>
    </tr>
  `).join('');

  return `
    <h1 class="glow-text-cyan" style="font-family:var(--font-title); font-size:1.5rem; text-transform:uppercase; margin-bottom:10px;">Clients Enregistrés</h1>
    <p style="color:var(--text-secondary); margin-bottom:20px; font-size:0.85rem;">Liste des comptes acheteurs enregistrés dans le quadrant NeoMarket.</p>

    <div class="cyber-glass" style="padding:25px; border-radius:var(--border-radius);">
      <div class="recent-orders-table-wrapper">
        <table class="cyber-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Date d'inscription</th>
              <th>Volume d'achats</th>
            </tr>
          </thead>
          <tbody>
            ${clientRows || '<tr><td colspan="4" style="text-align:center;">Aucun client enregistré.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Tab: Promotions
function getAdminPromosHTML() {
  const promoRows = DB.promos.map(p => `
    <tr>
      <td style="font-weight:700; color:var(--color-cyan); font-family:var(--font-title);">${p.code}</td>
      <td>${p.discount}% de réduction</td>
      <td>
        <button class="cyber-btn-secondary" style="padding:5px 10px; font-size:0.7rem;" onclick="deleteAdminPromo('${p.code}')">Supprimer</button>
      </td>
    </tr>
  `).join('');

  return `
    <h1 class="glow-text-cyan" style="font-family:var(--font-title); font-size:1.5rem; text-transform:uppercase; margin-bottom:10px;">Codes de Promotion</h1>
    <p style="color:var(--text-secondary); margin-bottom:20px; font-size:0.85rem;">Créez et supprimez les coupons utilisables au panier par vos clients.</p>

    <div class="charts-grid" style="grid-template-columns: 1.5fr 1fr;">
      <div class="cyber-glass" style="padding:25px; border-radius:var(--border-radius);">
        <h2 class="chart-title" style="margin-bottom:20px; color:var(--color-cyan);">Codes Actifs</h2>
        <div class="recent-orders-table-wrapper">
          <table class="cyber-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Valeur</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${promoRows || '<tr><td colspan="3" style="text-align:center;">Aucun coupon promotionnel actif.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>

      <div class="cyber-glass" style="padding:25px; border-radius:var(--border-radius); height: fit-content;">
        <h2 class="chart-title" style="margin-bottom:20px; color:var(--color-purple);">Nouveau Coupon</h2>
        <div class="form-grid full" style="gap: 15px;">
          <div class="form-group">
            <label>Code</label>
            <input type="text" id="admin-new-promo-code" placeholder="Ex: GALAXY20">
          </div>
          <div class="form-group">
            <label>Pourcentage (%)</label>
            <input type="number" id="admin-new-promo-discount" placeholder="Ex: 20">
          </div>
          <button class="cyber-btn" onclick="saveAdminNewPromo()">Enregistrer</button>
        </div>
      </div>
    </div>
  `;
}

function saveAdminNewPromo() {
  const code = document.getElementById('admin-new-promo-code').value.toUpperCase().trim();
  const discount = parseInt(document.getElementById('admin-new-promo-discount').value) || 0;

  if (!code || discount <= 0 || discount > 100) {
    alert("Veuillez saisir un code valide et un pourcentage entre 1% et 100%.");
    return;
  }

  DB.promos.push({ code: code, discount: discount });
  saveDB();
  renderAdminPage();
  showAdminToast('CODE DE PROMOTION CRÉÉ');
}

function deleteAdminPromo(code) {
  if (confirm(`Voulez-vous supprimer le code ${code} ?`)) {
    DB.promos = DB.promos.filter(p => p.code !== code);
    saveDB();
    renderAdminPage();
    showAdminToast('CODE PROMO SUPPRIMÉ');
  }
}

// Tab: Statistiques
function getAdminStatsHTML() {
  return `
    <h1 class="glow-text-cyan" style="font-family:var(--font-title); font-size:1.5rem; text-transform:uppercase; margin-bottom:10px;">Statistiques Avancées</h1>
    <p style="color:var(--text-secondary); margin-bottom:20px; font-size:0.85rem;">Données analytiques détaillées de votre serveur e-commerce.</p>

    <div class="cyber-glass" style="padding:25px; border-radius:var(--border-radius); text-align:center; padding:50px;">
      <span style="font-size:3rem;">📊</span>
      <h2 style="font-family:var(--font-title); margin:15px 0;">Rapports de Performance</h2>
      <p style="color:var(--text-secondary); max-width:500px; margin:0 auto 20px auto; font-size:0.85rem;">Votre boutique fonctionne de manière optimale. Le taux de conversion ce mois est de 3.2% avec un panier moyen estimé à 350 000 FCFA.</p>
      <button class="cyber-btn" onclick="showAdminToast('RAPPORT TÉLÉCHARGÉ')">Télécharger le Rapport PDF</button>
    </div>
  `;
}

// Tab: Avis Modération
function getAdminReviewsHTML() {
  const reviewCards = DB.reviews.map((r, i) => `
    <div class="cyber-glass" style="padding:20px; border-radius:var(--border-radius-sm); margin-bottom:15px; display:flex; justify-content:space-between; align-items:center;">
      <div>
        <div style="display:flex; gap:10px; align-items:center; margin-bottom:8px;">
          <strong style="color:var(--color-cyan);">${r.author}</strong>
          <span style="font-size:0.75rem; color:var(--text-muted);">sur ${r.product}</span>
        </div>
        <div class="stars" style="margin-bottom:8px; color:#ffb800;">★★★★★</div>
        <p style="font-size:0.85rem; color:var(--text-secondary);">${r.text}</p>
      </div>
      <button class="cyber-btn-secondary" style="padding:6px 12px; font-size:0.75rem;" onclick="deleteAdminReview(${i})">Retirer l'avis</button>
    </div>
  `).join('');

  return `
    <h1 class="glow-text-cyan" style="font-family:var(--font-title); font-size:1.5rem; text-transform:uppercase; margin-bottom:10px;">Avis et Modération</h1>
    <p style="color:var(--text-secondary); margin-bottom:20px; font-size:0.85rem;">Modérez les commentaires publiés sur vos produits.</p>

    <div class="orders-list">
      ${reviewCards || '<div style="text-align:center; padding:40px;">Aucun avis à modérer.</div>'}
    </div>
  `;
}

function deleteAdminReview(idx) {
  if (confirm("Voulez-vous supprimer cet avis ?")) {
    DB.reviews.splice(idx, 1);
    saveDB();
    renderAdminPage();
    showAdminToast("AVIS RETIRÉ");
  }
}

// Tab: Configuration
function getAdminConfigHTML() {
  return `
    <h1 class="glow-text-cyan" style="font-family:var(--font-title); font-size:1.5rem; text-transform:uppercase; margin-bottom:10px;">Configuration Système</h1>
    <p style="color:var(--text-secondary); margin-bottom:20px; font-size:0.85rem;">Ajustez les réglages généraux de la plateforme.</p>

    <div class="cyber-glass" style="padding:30px; border-radius:var(--border-radius); max-width:600px;">
      <div class="form-grid full" style="gap:20px;">
        <div class="form-group">
          <label>Nom du Site</label>
          <input type="text" id="admin-config-site" value="${DB.config.siteName}">
        </div>
        <div class="form-group">
          <label>Frais de livraison standard (FCFA)</label>
          <input type="number" id="admin-config-shipping" value="${DB.config.shipping}">
        </div>
        <div class="form-group">
          <label>Email de support technique</label>
          <input type="email" id="admin-config-email" value="${DB.config.supportEmail}">
        </div>
        <div class="form-group">
          <label class="checkbox-label" style="margin-top:10px;">
            <input type="checkbox" id="admin-config-maintenance" ${DB.config.maintenanceMode ? 'checked' : ''}> Activer le mode maintenance
          </label>
        </div>
        <button class="cyber-btn" style="margin-top:10px;" onclick="saveAdminConfig()">Enregistrer les paramètres</button>
      </div>
    </div>
  `;
}

function saveAdminConfig() {
  const site = document.getElementById('admin-config-site').value.trim();
  const shipping = parseInt(document.getElementById('admin-config-shipping').value) || 0;
  const email = document.getElementById('admin-config-email').value.trim();
  const maintenance = document.getElementById('admin-config-maintenance').checked;

  if (!site || !email) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  DB.config.siteName = site;
  DB.config.shipping = shipping;
  DB.config.supportEmail = email;
  DB.config.maintenanceMode = maintenance;

  saveDB();
  renderAdminPage();
  showAdminToast("PARAMÈTRES ENREGISTRÉS");
}

function drawAdminDashboardCharts() {
  const lineContainer = document.getElementById('sales-line-chart-container');
  const pieContainer = document.getElementById('sales-pie-chart-container');

  if (lineContainer) {
    lineContainer.innerHTML = `
      <svg viewBox="0 0 400 200" width="100%" height="100%">
        <line x1="40" y1="20" x2="380" y2="20" stroke="rgba(255,255,255,0.05)" />
        <line x1="40" y1="60" x2="380" y2="60" stroke="rgba(255,255,255,0.05)" />
        <line x1="40" y1="100" x2="380" y2="100" stroke="rgba(255,255,255,0.05)" />
        <line x1="40" y1="140" x2="380" y2="140" stroke="rgba(255,255,255,0.05)" />
        <line x1="40" y1="170" x2="380" y2="170" stroke="rgba(0, 240, 255, 0.2)" />
        
        <text x="30" y="25" fill="#64748b" font-size="8" text-anchor="end">2.0M</text>
        <text x="30" y="65" fill="#64748b" font-size="8" text-anchor="end">1.5M</text>
        <text x="30" y="105" fill="#64748b" font-size="8" text-anchor="end">1.0M</text>
        <text x="30" y="145" fill="#64748b" font-size="8" text-anchor="end">0.5M</text>
        
        <path d="M 50 150 Q 100 80, 150 110 T 250 50 T 350 90" fill="none" stroke="url(#line-glow-grad-admin)" stroke-width="3" filter="url(#glow-filter-admin)" />
        <path d="M 50 150 Q 100 80, 150 110 T 250 50 T 350 90 L 350 170 L 50 170 Z" fill="url(#area-grad-admin)" opacity="0.15" />
        
        <text x="50" y="185" fill="#64748b" font-size="8" text-anchor="middle">Jan</text>
        <text x="110" y="185" fill="#64748b" font-size="8" text-anchor="middle">Fév</text>
        <text x="170" y="185" fill="#64748b" font-size="8" text-anchor="middle">Mar</text>
        <text x="230" y="185" fill="#64748b" font-size="8" text-anchor="middle">Avr</text>
        <text x="290" y="185" fill="#64748b" font-size="8" text-anchor="middle">Mai</text>
        <text x="350" y="185" fill="#64748b" font-size="8" text-anchor="middle">Juin</text>

        <defs>
          <linearGradient id="line-glow-grad-admin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#00f0ff" />
            <stop offset="100%" stop-color="#bc13fe" />
          </linearGradient>
          <linearGradient id="area-grad-admin" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#00f0ff" />
            <stop offset="100%" stop-color="transparent" />
          </linearGradient>
          <filter id="glow-filter-admin" x="-20%" y="-20%" width="140%" height="140%">
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
    pieContainer.innerHTML = `
      <svg viewBox="0 0 200 200" width="100%" height="100%">
        <circle r="60" cx="100" cy="100" fill="transparent" stroke="#00f0ff" stroke-width="40" stroke-dasharray="188 377" stroke-dashoffset="0" />
        <circle r="60" cx="100" cy="100" fill="transparent" stroke="#bc13fe" stroke-width="40" stroke-dasharray="94 377" stroke-dashoffset="-188" />
        <circle r="60" cx="100" cy="100" fill="transparent" stroke="#ff2e93" stroke-width="40" stroke-dasharray="62 377" stroke-dashoffset="-282" />
        <circle r="60" cx="100" cy="100" fill="transparent" stroke="#ff5e00" stroke-width="40" stroke-dasharray="33 377" stroke-dashoffset="-344" />
        
        <circle r="30" cx="100" cy="100" fill="#121829" />
        <text x="100" y="98" fill="#ffffff" font-size="8" font-family="Orbitron" font-weight="bold" text-anchor="middle">STATS</text>
        <text x="100" y="110" fill="#00f0ff" font-size="9" font-family="Orbitron" font-weight="bold" text-anchor="middle">ADMIN</text>
      </svg>
    `;
  }
}

/* --- DEV SWITCHER FOR ADMIN --- */
let isDevOpenAdmin = true;
function toggleDevPanel() {
  const body = document.getElementById('dev-panel-body');
  const icon = document.getElementById('dev-toggle-icon');
  if (body && icon) {
    isDevOpenAdmin = !isDevOpenAdmin;
    body.style.display = isDevOpenAdmin ? 'flex' : 'none';
    icon.style.transform = isDevOpenAdmin ? 'rotate(0deg)' : 'rotate(180deg)';
  }
}

function initAdminDevPanel() {
  const panel = document.getElementById('dev-panel-body');
  if (panel) {
    panel.innerHTML = PAGES_ADMIN.map(p => `
      <button class="dev-page-btn ${STATE_ADMIN.activePage === p.id ? 'active' : ''}" data-page="${p.id}" onclick="navigateToAdmin('${p.id}')">
        <span>${p.name}</span>
        <span>➔</span>
      </button>
    `).join('');
  }
}

/* --- INITIALIZATION --- */
document.addEventListener('DOMContentLoaded', () => {
  initAdminDevPanel();
  renderAdminPage();
});
