const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

function syncHeader() {
  if (header) header.classList.toggle('scrolled', window.scrollY > 20);
}

syncHeader();
window.addEventListener('scroll', syncHeader, { passive: true });

menuButton?.addEventListener('click', () => {
  const open = !nav?.classList.contains('open');
  nav?.classList.toggle('open', open);
  menuButton.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav?.classList.remove('open');
    menuButton?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

document.addEventListener('click', (event) => {
  if (!nav?.classList.contains('open')) return;
  if (!nav.contains(event.target) && !menuButton?.contains(event.target)) {
    nav.classList.remove('open');
    menuButton?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Cardápio baseado nos arquivos existentes em /assets.
// Itens sem preço confirmado ficam como "Consultar" para não inventar valor.
const MENU_ITEMS = [
  { id: 'carne', name: 'Espetinho de carne', category: 'espetos', price: 12, image: 'assets/Espetinho de carne.png', skewer: true },
  { id: 'frango', name: 'Espetinho de frango', category: 'espetos', price: 12, image: 'assets/Espetinho de frango.png', skewer: true },
  { id: 'coracao', name: 'Espetinho de coração', category: 'espetos', price: 12, image: 'assets/Espetinho de coracao.png', skewer: true },
  { id: 'misto', name: 'Espetinho misto', category: 'espetos', price: 12, image: 'assets/Espetinho misto.png', skewer: true },
  { id: 'linguica', name: 'Espetinho de linguiça', category: 'espetos', price: 12, image: 'assets/Espetinho de linguica.png', skewer: true },
  { id: 'linguica-apimentada', name: 'Espetinho de linguiça apimentada', category: 'espetos', price: 12, image: 'assets/Espetinho de linguca apimentada.png', skewer: true },
  { id: 'kafta', name: 'Espetinho de kafta', category: 'espetos', price: 12, image: 'assets/Espetinho de kafka.png', skewer: true },
  { id: 'medalhao', name: 'Espetinho de medalhão', category: 'espetos', price: 12, image: 'assets/Espetinho de medalhao.png', skewer: true },
  { id: 'queijo-coalho', name: 'Espetinho de queijo coalho', category: 'espetos', price: 10, image: 'assets/Espetinho de queijo coalho.png', skewer: true },
  { id: 'tulipa', name: 'Espetinho de tulipa', category: 'espetos', price: 12, image: 'assets/Espetinho de tulipa.png', skewer: true },
  { id: 'pao-de-alho', name: 'Pão de alho', category: 'espetos', price: 10, image: 'assets/pao de alho.png' },

  {
    id: 'jantinha-espetinho',
    name: 'Jantinha + espetinho',
    description: 'Jantinha acompanhada de um espetinho à sua escolha.',
    category: 'combos',
    price: 27,
    image: 'assets/jantinha.png?v=3',
    requiresSkewer: true
  },

  { id: 'farofa', name: 'Farofa', category: 'acompanhamentos', price: 4, image: 'assets/Farofa.png' },
  { id: 'vinagrete', name: 'Vinagrete', category: 'acompanhamentos', price: 4, image: 'assets/Vinagrete.png' },

  { id: 'x-burguer-artesanal', name: 'X-Burguer Artesanal', category: 'lanches', price: 19.90, image: 'assets/X - Burguer Artesanal.png' },
  { id: 'x-salada-artesanal', name: 'Lanche X-Salada Artesanal', category: 'lanches', price: 19.90, image: 'assets/Lanche X- Salada Artesanal.png' },
  { id: 'lanche-baguette', name: 'Lanche na Baguette', category: 'lanches', price: 21.99, image: 'assets/Lanche na Baguette.png' },

  { id: 'agua-sem-gas', name: 'Água mineral sem gás 510ml', category: 'bebidas', price: 5, image: 'assets/Agua mineral sem gas 510ml.png' },
  { id: 'agua-com-gas', name: 'Água mineral com gás 510ml', category: 'bebidas', price: 6, image: 'assets/Agua mineral com gas 510ml.png' },
  { id: 'coca-lata', name: 'Coca-Cola lata', category: 'bebidas', price: 7, image: 'assets/Coca Lata.png' },
  { id: 'coca-zero-lata', name: 'Coca-Cola Zero lata', category: 'bebidas', price: 7, image: 'assets/coca zero lata.png' },
  { id: 'guarana-lata', name: 'Guaraná lata', category: 'bebidas', price: 7, image: 'assets/guarana lata.png' },
  { id: 'guarana-zero-lata', name: 'Guaraná Zero lata', category: 'bebidas', price: 7, image: 'assets/guarana zero lata.png' },
  { id: 'fanta-laranja', name: 'Fanta Laranja lata', category: 'bebidas', price: 7, image: 'assets/fanta laranja lata.png' },
  { id: 'fanta-uva', name: 'Fanta Uva lata', category: 'bebidas', price: 7, image: 'assets/fanta uva lata.png' },
  { id: 'pepsi-lata', name: 'Pepsi lata', category: 'bebidas', price: 7, image: 'assets/pepsi lata.png' },
  { id: 'h2oh-limao', name: 'H2OH Limão 500ml', category: 'bebidas', price: 8, image: 'assets/H2OH limao 500ml.png' },
  { id: 'h2oh-limoneto', name: 'H2OH Limoneto 500ml', category: 'bebidas', price: 8, image: 'assets/H2OH Limoneto 500ml.png' },
  { id: 'del-valle-manga', name: 'Del Valle Manga lata 290ml', category: 'bebidas', price: 8, image: 'assets/del valle manga lata 290ml.png' },
  { id: 'del-valle-maracuja', name: 'Del Valle Maracujá lata 290ml', category: 'bebidas', price: 8, image: 'assets/del valle maracuja lata 290ml.png' },
  { id: 'del-valle-pessego', name: 'Del Valle Pêssego lata 290ml', category: 'bebidas', price: 8, image: 'assets/del valle pessego lata 290ml.png' },
  { id: 'del-valle-uva', name: 'Del Valle Uva lata 290ml', category: 'bebidas', price: 8, image: 'assets/del valle uva lata 290ml.png' },
  { id: 'redbull-250', name: 'Red Bull lata 250ml', category: 'bebidas', price: 15, image: 'assets/redbull lata 250ml.png' }
];

const CATEGORY_LABELS = {
  espetos: 'Espetos',
  combos: 'Combos',
  acompanhamentos: 'Acompanhamentos',
  lanches: 'Lanches',
  bebidas: 'Bebidas'
};

const formatBRL = (value) => Number(value).toLocaleString('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

function displayPrice(item) {
  return item.price == null ? 'Consultar' : formatBRL(item.price);
}

function getItem(id) {
  return MENU_ITEMS.find((item) => item.id === id);
}

const SKEWER_OPTIONS = MENU_ITEMS.filter((item) => item.skewer);
const skewerChoiceModal = document.getElementById('skewer-choice-modal');
const skewerChoiceGrid = document.getElementById('skewer-choice-grid');

// O carrinho usa uma chave própria para permitir variações da Jantinha + espetinho.
// Ex.: jantinha-espetinho::carne e jantinha-espetinho::frango ficam em linhas separadas.
const cart = new Map();
try {
  const saved = JSON.parse(localStorage.getItem('espetoCart') || '{}');
  Object.entries(saved).forEach(([key, qty]) => {
    const [baseId] = key.split('::');
    if (getItem(baseId) && Number(qty) > 0) cart.set(key, Number(qty));
  });
} catch (_) {
  localStorage.removeItem('espetoCart');
}

const catalogList = document.getElementById('catalog-list');
const cartModal = document.getElementById('cart-modal');
const cartItems = document.getElementById('cart-items');
const cartEmpty = document.getElementById('cart-empty');
const cartTotal = document.getElementById('cart-total');
const sendOrderButton = document.getElementById('send-whatsapp-order');
const clearCartButton = document.getElementById('clear-cart');
const cartCountNodes = document.querySelectorAll('[data-cart-count]');
let activeCategory = 'all';

function parseCartKey(key) {
  const [id, optionId] = key.split('::');
  const item = getItem(id);
  const option = optionId ? getItem(optionId) : null;
  return { id, optionId, item, option };
}

function persistCart() {
  const asObject = {};
  cart.forEach((qty, key) => { asObject[key] = qty; });
  localStorage.setItem('espetoCart', JSON.stringify(asObject));
}

function totalCartItems() {
  let total = 0;
  cart.forEach((qty) => { total += qty; });
  return total;
}

function updateCartCount() {
  const count = totalCartItems();
  cartCountNodes.forEach((node) => { node.textContent = String(count); });
  document.querySelector('.floating-cart')?.classList.toggle('has-items', count > 0);
}

function flashAdded(id) {
  const button = document.querySelector(`[data-add-item="${id}"]`);
  if (!button) return;
  const original = button.textContent;
  button.textContent = 'Adicionado';
  button.classList.add('added');
  setTimeout(() => {
    button.textContent = original;
    button.classList.remove('added');
  }, 800);
}

function addCartKey(key, amount = 1) {
  cart.set(key, (cart.get(key) || 0) + amount);
  persistCart();
  updateCartCount();
  renderCart();
}

function addToCart(id, amount = 1) {
  const item = getItem(id);
  if (!item) return;

  if (item.requiresSkewer) {
    openSkewerChoice();
    return;
  }

  addCartKey(id, amount);
  flashAdded(id);
}

function setQuantity(key, qty) {
  if (qty <= 0) cart.delete(key);
  else cart.set(key, qty);
  persistCart();
  updateCartCount();
  renderCart();
}

function openSkewerChoice() {
  if (!skewerChoiceModal || !skewerChoiceGrid) return;

  skewerChoiceGrid.innerHTML = SKEWER_OPTIONS.map((option) => `
    <button type="button" class="skewer-choice-card" data-skewer-choice="${option.id}">
      <img src="${option.image}" alt="${option.name}" loading="lazy">
      <span>${option.name.replace('Espetinho de ', '').replace('Espetinho ', '')}</span>
    </button>
  `).join('');

  skewerChoiceGrid.querySelectorAll('[data-skewer-choice]').forEach((button) => {
    button.addEventListener('click', () => {
      const optionId = button.dataset.skewerChoice;
      addCartKey(`jantinha-espetinho::${optionId}`, 1);
      closeSkewerChoice();
      flashAdded('jantinha-espetinho');
    });
  });

  skewerChoiceModal.classList.add('open');
  skewerChoiceModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('choice-open');
  skewerChoiceGrid.querySelector('button')?.focus();
}

function closeSkewerChoice() {
  if (!skewerChoiceModal) return;
  skewerChoiceModal.classList.remove('open');
  skewerChoiceModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('choice-open');
}

document.querySelectorAll('[data-close-skewer-choice]').forEach((button) => {
  button.addEventListener('click', closeSkewerChoice);
});

function renderCatalog() {
  if (!catalogList) return;
  const filtered = activeCategory === 'all'
    ? MENU_ITEMS
    : MENU_ITEMS.filter((item) => item.category === activeCategory);

  const grouped = filtered.reduce((acc, item) => {
    (acc[item.category] ||= []).push(item);
    return acc;
  }, {});

  catalogList.innerHTML = Object.entries(grouped).map(([category, items]) => `
    <section class="catalog-group" data-menu-category="${category}">
      <div class="catalog-group-title">
        <span>${CATEGORY_LABELS[category]}</span>
        <small>${items.length} ${items.length === 1 ? 'item' : 'itens'}</small>
      </div>
      <div class="menu-items-grid">
        ${items.map((item) => `
          <article class="menu-item-card category-${item.category}">
            <div class="menu-item-image"><img data-item-image="${item.id}" src="${item.image}" alt="${item.name}" loading="${item.id === 'jantinha-espetinho' ? 'eager' : 'lazy'}" ${item.id === 'jantinha-espetinho' ? 'fetchpriority="high"' : ''}></div>
            <div class="menu-item-body">
              <div class="menu-item-copy">
                <h3>${item.name}</h3>
                ${item.description ? `<p>${item.description}</p>` : ''}
                ${item.requiresSkewer ? '<small class="choice-hint">Você escolhe o espetinho ao adicionar.</small>' : ''}
              </div>
              <div class="menu-item-footer">
                <strong class="${item.price == null ? 'price-consult' : ''}">${displayPrice(item)}</strong>
                <button type="button" class="add-item-button" data-add-item="${item.id}">${item.requiresSkewer ? 'Escolher' : 'Adicionar'}</button>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    </section>
  `).join('');

  const jantinhaImage = catalogList.querySelector('[data-item-image="jantinha-espetinho"]');
  if (jantinhaImage) {
    jantinhaImage.addEventListener('error', () => {
      if (jantinhaImage.dataset.fallbackApplied === '1') return;
      jantinhaImage.dataset.fallbackApplied = '1';
      jantinhaImage.src = 'assets/Jantinha_Espetinho.png?v=3';
    });
  }

  catalogList.querySelectorAll('[data-add-item]').forEach((button) => {
    button.addEventListener('click', () => addToCart(button.dataset.addItem));
  });
}

function renderCart() {
  if (!cartItems) return;

  const entries = [...cart.entries()]
    .map(([key, qty]) => ({ key, qty, ...parseCartKey(key) }))
    .filter(({ item }) => item);

  if (!entries.length) {
    cartItems.innerHTML = '';
    if (cartEmpty) cartEmpty.hidden = false;
    if (cartTotal) cartTotal.textContent = formatBRL(0);
    if (sendOrderButton) sendOrderButton.disabled = true;
    if (clearCartButton) clearCartButton.disabled = true;
    return;
  }

  if (cartEmpty) cartEmpty.hidden = true;
  if (sendOrderButton) sendOrderButton.disabled = false;
  if (clearCartButton) clearCartButton.disabled = false;

  let total = 0;
  let hasUnpriced = false;

  cartItems.innerHTML = entries.map(({ key, item, option, qty }) => {
    const hasPrice = item.price != null;
    const subtotal = hasPrice ? item.price * qty : null;
    if (hasPrice) total += subtotal;
    else hasUnpriced = true;

    return `
      <article class="cart-item-row">
        <div class="cart-item-main">
          <div class="cart-item-thumb">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
          </div>
          <div class="cart-item-info">
            <strong>${item.name}</strong>
            ${option ? `<span class="cart-item-option">Com: ${option.name.replace('Espetinho de ', '').replace('Espetinho ', '')}</span>` : ''}
            <span>${hasPrice ? `${formatBRL(item.price)} cada` : 'Valor a confirmar'}</span>
          </div>
        </div>
        <div class="cart-item-actions">
          <div class="qty-control" aria-label="Quantidade de ${item.name}">
            <button type="button" data-cart-minus="${key}" aria-label="Diminuir quantidade">−</button>
            <span>${qty}</span>
            <button type="button" data-cart-plus="${key}" aria-label="Aumentar quantidade">+</button>
          </div>
          <strong class="cart-item-subtotal">${hasPrice ? formatBRL(subtotal) : 'A confirmar'}</strong>
          <button type="button" class="cart-remove" data-cart-remove="${key}">Remover</button>
        </div>
      </article>
    `;
  }).join('');

  if (cartTotal) cartTotal.textContent = hasUnpriced ? (total > 0 ? `${formatBRL(total)} + confirmar` : 'A confirmar') : formatBRL(total);

  cartItems.querySelectorAll('[data-cart-minus]').forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.dataset.cartMinus;
      setQuantity(key, (cart.get(key) || 0) - 1);
    });
  });

  cartItems.querySelectorAll('[data-cart-plus]').forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.dataset.cartPlus;
      setQuantity(key, (cart.get(key) || 0) + 1);
    });
  });

  cartItems.querySelectorAll('[data-cart-remove]').forEach((button) => {
    button.addEventListener('click', () => setQuantity(button.dataset.cartRemove, 0));
  });
}

function clearCart() {
  if (!cart.size) return;
  cart.clear();
  persistCart();
  updateCartCount();
  renderCart();
}

clearCartButton?.addEventListener('click', clearCart);

function openCart() {
  if (!cartModal) return;
  renderCart();
  cartModal.classList.add('open');
  cartModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  cartModal.querySelector('.cart-close')?.focus();
}

function closeCart() {
  if (!cartModal) return;
  cartModal.classList.remove('open');
  cartModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

document.querySelectorAll('[data-open-cart]').forEach((button) => button.addEventListener('click', openCart));
document.querySelectorAll('[data-close-cart]').forEach((button) => button.addEventListener('click', closeCart));

document.querySelectorAll('[data-category-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    activeCategory = button.dataset.categoryFilter;
    document.querySelectorAll('[data-category-filter]').forEach((tab) => tab.classList.toggle('active', tab === button));
    renderCatalog();
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (skewerChoiceModal?.classList.contains('open')) closeSkewerChoice();
  else if (cartModal?.classList.contains('open')) closeCart();
});

sendOrderButton?.addEventListener('click', () => {
  const entries = [...cart.entries()]
    .map(([key, qty]) => ({ key, qty, ...parseCartKey(key) }))
    .filter(({ item }) => item);

  if (!entries.length) return;

  let total = 0;
  let hasUnpriced = false;

  const lines = entries.map(({ item, option, qty }) => {
    const optionText = option ? ` (${option.name.replace('Espetinho de ', '').replace('Espetinho ', '')})` : '';
    if (item.price == null) {
      hasUnpriced = true;
      return `- ${qty}x ${item.name}${optionText} — valor a confirmar`;
    }
    const subtotal = item.price * qty;
    total += subtotal;
    return `- ${qty}x ${item.name}${optionText} — ${formatBRL(subtotal)}`;
  });

  const totalLine = hasUnpriced
    ? (total > 0 ? `Total parcial: ${formatBRL(total)} + valores a confirmar` : 'Total: a confirmar')
    : `Total: ${formatBRL(total)}`;

  const message = [
    'Olá! Vim pelo site e quero fazer um pedido',
    '',
    ...lines,
    '',
    totalLine
  ].join('\n');

  const url = `https://wa.me/5511963303480?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
});

renderCatalog();
renderCart();
updateCartCount();

const revealTargets = document.querySelectorAll('.catalog-heading, .catalog-group, .intro, .feature-card, .gallery-item, .location-grid, .hours-panel');
revealTargets.forEach((element) => element.classList.add('reveal'));

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach((element) => observer.observe(element));
} else {
  revealTargets.forEach((element) => element.classList.add('visible'));
}
