const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

function syncHeader() {
  header.classList.toggle('scrolled', window.scrollY > 20);
}

syncHeader();
window.addEventListener('scroll', syncHeader, { passive: true });

menuButton.addEventListener('click', () => {
  const open = !nav.classList.contains('open');
  nav.classList.toggle('open', open);
  menuButton.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

document.addEventListener('click', (event) => {
  if (!nav.classList.contains('open')) return;
  if (!nav.contains(event.target) && !menuButton.contains(event.target)) {
    nav.classList.remove('open');
    menuButton.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const MENU_ITEMS = [
  { id: 'carne', name: 'Carne', category: 'espetos', price: 12 },
  { id: 'frango', name: 'Frango', category: 'espetos', price: 12 },
  { id: 'coracao', name: 'Coração', category: 'espetos', price: 12 },
  { id: 'misto', name: 'Misto', category: 'espetos', price: 12 },
  { id: 'linguica', name: 'Linguiça', category: 'espetos', price: 12 },
  { id: 'linguica-apimentada', name: 'Linguiça apimentada', category: 'espetos', price: 12 },
  { id: 'kafta', name: 'Kafta', category: 'espetos', price: 12 },
  { id: 'pao-de-alho', name: 'Pão de alho', category: 'espetos', price: 10 },
  { id: 'pao-de-alho-gourmet', name: 'Pão de alho gourmet', category: 'espetos', price: 13 },
  { id: 'queijo-coalho', name: 'Queijo coalho', category: 'espetos', price: 10 },
  { id: 'medalhao', name: 'Medalhão', category: 'espetos', price: 12 },
  { id: 'tulipinha', name: 'Tulipinha', category: 'espetos', price: 12 },

  { id: 'jantinha', name: 'Jantinha', description: 'Arroz carreteiro, farofa e vinagrete', category: 'acompanhamentos', price: 18 },
  { id: 'arroz-carreteiro', name: 'Arroz carreteiro', category: 'acompanhamentos', price: 12 },
  { id: 'vinagrete', name: 'Vinagrete', category: 'acompanhamentos', price: 4 },
  { id: 'farofa', name: 'Farofa', category: 'acompanhamentos', price: 4 },
  { id: 'pao', name: 'Pão', category: 'acompanhamentos', price: 4 },

  { id: 'lanche-pao-frances', name: 'Lanche no pão francês', description: 'Vinagrete + espeto', category: 'lanches', price: 15 },

  { id: 'agua', name: 'Água', category: 'bebidas', price: 5 },
  { id: 'agua-gas', name: 'Água com gás', category: 'bebidas', price: 6 },
  { id: 'refrigerante-lata', name: 'Refrigerante lata', category: 'bebidas', price: 7 },
  { id: 'suco-del-valle', name: 'Suco Del Valle lata', category: 'bebidas', price: 8 },
  { id: 'suco-laranja', name: 'Suco natural de laranja', category: 'bebidas', price: 12 },
  { id: 'red-bull', name: 'Red Bull', category: 'bebidas', price: 15 }
];

const CATEGORY_LABELS = {
  espetos: 'Espetos',
  acompanhamentos: 'Acompanhamentos',
  lanches: 'Lanches',
  bebidas: 'Bebidas'
};

const formatBRL = (value) => value.toLocaleString('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

const cart = new Map();
try {
  const saved = JSON.parse(localStorage.getItem('espetoCart') || '{}');
  Object.entries(saved).forEach(([id, qty]) => {
    if (MENU_ITEMS.some((item) => item.id === id) && Number(qty) > 0) {
      cart.set(id, Number(qty));
    }
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
const cartCountNodes = document.querySelectorAll('[data-cart-count]');
let activeCategory = 'all';

function getItem(id) {
  return MENU_ITEMS.find((item) => item.id === id);
}

function persistCart() {
  const asObject = {};
  cart.forEach((qty, id) => { asObject[id] = qty; });
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

function addToCart(id, amount = 1) {
  const current = cart.get(id) || 0;
  cart.set(id, current + amount);
  persistCart();
  updateCartCount();
  renderCart();

  const button = document.querySelector(`[data-add-item="${id}"]`);
  if (button) {
    const original = button.textContent;
    button.textContent = 'Adicionado';
    button.classList.add('added');
    setTimeout(() => {
      button.textContent = original;
      button.classList.remove('added');
    }, 800);
  }
}

function setQuantity(id, qty) {
  if (qty <= 0) cart.delete(id);
  else cart.set(id, qty);
  persistCart();
  updateCartCount();
  renderCart();
}

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
          <article class="menu-item-card">
            <div class="menu-item-copy">
              <h3>${item.name}</h3>
              ${item.description ? `<p>${item.description}</p>` : ''}
            </div>
            <div class="menu-item-footer">
              <strong>${formatBRL(item.price)}</strong>
              <button type="button" class="add-item-button" data-add-item="${item.id}">Adicionar</button>
            </div>
          </article>
        `).join('')}
      </div>
    </section>
  `).join('');

  catalogList.querySelectorAll('[data-add-item]').forEach((button) => {
    button.addEventListener('click', () => addToCart(button.dataset.addItem));
  });
}

function renderCart() {
  if (!cartItems) return;
  const entries = [...cart.entries()]
    .map(([id, qty]) => ({ item: getItem(id), qty }))
    .filter(({ item }) => item);

  if (!entries.length) {
    cartItems.innerHTML = '';
    cartEmpty.hidden = false;
    cartTotal.textContent = formatBRL(0);
    sendOrderButton.disabled = true;
    return;
  }

  cartEmpty.hidden = true;
  sendOrderButton.disabled = false;
  let total = 0;

  cartItems.innerHTML = entries.map(({ item, qty }) => {
    const subtotal = item.price * qty;
    total += subtotal;
    return `
      <article class="cart-item-row">
        <div class="cart-item-info">
          <strong>${item.name}</strong>
          <span>${formatBRL(item.price)} cada</span>
        </div>
        <div class="cart-item-actions">
          <div class="qty-control" aria-label="Quantidade de ${item.name}">
            <button type="button" data-cart-minus="${item.id}" aria-label="Diminuir quantidade">−</button>
            <span>${qty}</span>
            <button type="button" data-cart-plus="${item.id}" aria-label="Aumentar quantidade">+</button>
          </div>
          <strong class="cart-item-subtotal">${formatBRL(subtotal)}</strong>
          <button type="button" class="cart-remove" data-cart-remove="${item.id}">Remover</button>
        </div>
      </article>
    `;
  }).join('');

  cartTotal.textContent = formatBRL(total);

  cartItems.querySelectorAll('[data-cart-minus]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.cartMinus;
      setQuantity(id, (cart.get(id) || 0) - 1);
    });
  });

  cartItems.querySelectorAll('[data-cart-plus]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.cartPlus;
      setQuantity(id, (cart.get(id) || 0) + 1);
    });
  });

  cartItems.querySelectorAll('[data-cart-remove]').forEach((button) => {
    button.addEventListener('click', () => setQuantity(button.dataset.cartRemove, 0));
  });
}

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

document.querySelectorAll('[data-open-cart]').forEach((button) => {
  button.addEventListener('click', openCart);
});

document.querySelectorAll('[data-close-cart]').forEach((button) => {
  button.addEventListener('click', closeCart);
});

document.querySelectorAll('[data-category-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    activeCategory = button.dataset.categoryFilter;
    document.querySelectorAll('[data-category-filter]').forEach((tab) => tab.classList.toggle('active', tab === button));
    renderCatalog();
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && cartModal?.classList.contains('open')) closeCart();
});

sendOrderButton?.addEventListener('click', () => {
  const entries = [...cart.entries()]
    .map(([id, qty]) => ({ item: getItem(id), qty }))
    .filter(({ item }) => item);

  if (!entries.length) return;

  const total = entries.reduce((sum, { item, qty }) => sum + item.price * qty, 0);
  const lines = entries.map(({ item, qty }) => `- ${qty}x ${item.name} — ${formatBRL(item.price * qty)}`);
  const message = [
    'Olá! Vim pelo site e quero fazer um pedido',
    '',
    ...lines,
    '',
    `Total: ${formatBRL(total)}`
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
