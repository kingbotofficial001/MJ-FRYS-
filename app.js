/* ============================================================
   MJ FRYS â€” App Logic
   File: js/app.js
   Handles: menu rendering, cart, checkout, payments, delivery
   ============================================================ */

/* ---------- Product catalogue ----------
   Prices in KES. Image paths are local (relative).           */
const PRODUCTS = [
  { id: 'chips-large',  name: 'Chips (Large)',   cat: 'chips',     price: 100, unit: 'plate',   img: 'images/chips-large.jpg', tag: 'Bestseller', desc: 'Crispy golden fries, freshly fried to perfection. A generous large portion.' },
  { id: 'chips-small',  name: 'Chips (Small)',   cat: 'chips',     price: 70,  unit: 'plate',   img: 'images/chips-small.jpg', tag: 'Popular',    desc: 'Crispy golden fries in a smaller portion â€” perfect for a quick snack.' },
  { id: 'chicken-full', name: 'Full Chicken',    cat: 'chicken',   price: 640, unit: 'whole',   img: 'images/chicken-full.png', tag: 'Feast',     desc: 'A whole flame-grilled chicken, juicy inside with golden crispy skin.' },
  { id: 'chicken-half', name: 'Half Chicken',    cat: 'chicken',   price: 320, unit: 'half',    img: 'images/chicken-full.png', tag: 'Hot',       desc: 'Half a flame-grilled chicken â€” big on flavor, easy on the pocket.' },
  { id: 'chicken-qrt',  name: 'Quarter Chicken', cat: 'chicken',   price: 160, unit: 'quarter', img: 'images/chicken-full.png', tag: 'Value',     desc: 'A quarter grilled chicken. Great with a side of chips and a soda.' },
  { id: 'sausage',      name: 'Sausage',         cat: 'grill',     price: 50,  unit: 'piece',   img: 'images/sausage.png', tag: 'Grilled',      desc: 'Sizzling grilled sausage, smoky and juicy. A street-food classic.' },
  { id: 'smokie',       name: 'Smokie',          cat: 'grill',     price: 40,  unit: 'piece',   img: 'images/smokie.png', tag: 'Street Fav',    desc: 'Smoky split grilled smokie served with kachumbari on request.' },
  { id: 'samosa',       name: 'Samosa',          cat: 'snack',     price: 30,  unit: 'piece',   img: 'images/samosa.png', tag: 'Crunchy',       desc: 'Crispy golden pastry packed with spiced savoury filling.' },
  { id: 'soda',         name: 'Soda 300ml',      cat: 'drinks',    price: 50,  unit: 'bottle',  img: 'images/soda.png', tag: 'Chilled',       desc: 'Ice-cold 300ml soft drink to wash it all down.' },
  { id: 'sauce',        name: 'Tomato Sauce',    cat: 'extras',    price: 5,   unit: ' sachet', img: 'images/sauce.png', tag: 'Add-on',        desc: 'Tomato ketchup sachet â€” the perfect dip for your chips.' },
];

const DELIVERY_FEE = 100;          // flat delivery fee in KES
const FREE_DELIVERY_OVER = 1500;   // free delivery threshold
const SHOP_PHONE = '0734463997';   // order / delivery line (display)
const WHATSAPP = '254734463997';   // international format for WhatsApp link

/* ---------- State ---------- */
let cart = loadCart();
let activeFilter = 'all';
let selectedPay = 'mpesa';

/* ---------- Helpers ---------- */
const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const ksh = n => 'KES ' + Number(n).toLocaleString();
function loadCart() { try { return JSON.parse(localStorage.getItem('mjfrys_cart')) || []; } catch { return []; } }
function saveCart() { localStorage.setItem('mjfrys_cart', JSON.stringify(cart)); }

/* ---------- Menu rendering ---------- */
function renderMenu() {
  const grid = $('#menu-grid');
  if (!grid) return;
  const list = activeFilter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === activeFilter);
  grid.innerHTML = list.map(p => `
    <article class="card reveal" data-id="${p.id}">
      <div class="card-media">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <span class="card-tag">${p.tag}</span>
      </div>
      <div class="card-body">
        <div>
          <h3 class="card-title">${p.name}</h3>
          <p class="card-desc">${p.desc}</p>
        </div>
        <div class="card-foot">
          <span class="price"><span class="cur">KSh</span>${p.price}<span style="font-size:.72rem;color:var(--muted);font-weight:500"> / ${p.unit.trim()}</span></span>
          <button class="add-btn" data-add="${p.id}">+ Add</button>
        </div>
      </div>
    </article>
  `).join('');
  // attach add handlers
  $$('[data-add]', grid).forEach(btn => btn.addEventListener('click', e => {
    addToCart(e.currentTarget.dataset.add, e.currentTarget);
  }));
  reveal();
}

/* ---------- Cart operations ---------- */
function addToCart(id, btn) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const ex = cart.find(i => i.id === id);
  if (ex) ex.qty++; else cart.push({ id: p.id, name: p.name, price: p.price, unit: p.unit, img: p.img, qty: 1 });
  saveCart(); updateCartUI();
  if (btn) { const t=btn.textContent; btn.textContent='âœ“ Added'; btn.classList.add('added'); setTimeout(()=>{btn.textContent=t;btn.classList.remove('added');},1100); }
  toast(`${p.name} added to cart`);
  bumpCart();
}
function changeQty(id, delta) {
  const it = cart.find(i => i.id === id);
  if (!it) return;
  it.qty += delta;
  if (it.qty <= 0) cart = cart.filter(i => i.id !== id);
  saveCart(); updateCartUI();
}
function removeItem(id) { cart = cart.filter(i => i.id !== id); saveCart(); updateCartUI(); }
function cartCount() { return cart.reduce((s,i)=>s+i.qty,0); }
function subtotal() { return cart.reduce((s,i)=>s+i.price*i.qty,0); }
function deliveryFee() { const s=subtotal(); return s===0||s>=FREE_DELIVERY_OVER?0:DELIVERY_FEE; }
function grandTotal() { return subtotal()+deliveryFee(); }

/* ---------- UI updates ---------- */
function updateCartUI() {
  const cc = $('#cart-count'); if (cc) cc.textContent = cartCount();
  const body = $('#cart-items');
  if (!body) return;
  if (cart.length === 0) {
    body.innerHTML = `<div class="cart-empty"><div class="big">ðŸ›’</div><p>Your cart is empty.<br>Add something delicious!</p></div>`;
  } else {
    body.innerHTML = cart.map(i => `
      <div class="cart-item">
        <img src="${i.img}" alt="${i.name}">
        <div class="info">
          <div class="name">${i.name}</div>
          <div class="unit">${ksh(i.price)} / ${i.unit.trim()}</div>
          <div class="qty">
            <button data-dec="${i.id}">âˆ’</button>
            <span>${i.qty}</span>
            <button data-inc="${i.id}">+</button>
          </div>
        </div>
        <div class="right">
          <span class="lp">${ksh(i.price*i.qty)}</span>
          <button class="remove-btn" data-rm="${i.id}">Remove</button>
        </div>
      </div>`).join('');
    $$('[data-inc]', body).forEach(b=>b.onclick=()=>changeQty(b.dataset.inc,1));
    $$('[data-dec]', body).forEach(b=>b.onclick=()=>changeQty(b.dataset.dec,-1));
    $$('[data-rm]', body).forEach(b=>b.onclick=()=>removeItem(b.dataset.rm));
  }
  const sub = subtotal();
  $('#cart-sub').textContent = ksh(sub);
  $('#cart-del').textContent = deliveryFee()===0 ? 'FREE' : ksh(deliveryFee());
  $('#cart-total').textContent = ksh(grandTotal());
  const cko = $('#cart-checkout'); if (cko) cko.disabled = cart.length===0;
}
function bumpCart() {
  const c = $('#cart-count'); if(!c) return;
  c.animate([{transform:'scale(1.4)'},{transform:'scale(1)'}],{duration:300});
}

/* ---------- Drawer ---------- */
function openCart() { $('#drawer').classList.add('open'); $('#overlay').classList.add('open'); document.body.style.overflow='hidden'; }
function closeCart() { $('#drawer').classList.remove('open'); $('#overlay').classList.remove('open'); document.body.style.overflow=''; }

/* ---------- Checkout flow ---------- */
function openCheckout() {
  if (cart.length === 0) { toast('Your cart is empty','warn'); return; }
  closeCart();
  $('#checkout-amount').textContent = ksh(grandTotal());
  $('#checkout-modal').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeCheckout() { $('#checkout-modal').classList.remove('open'); document.body.style.overflow=''; }

function selectPay(method, el) {
  selectedPay = method;
  $$('.pay-opt').forEach(o=>o.classList.remove('selected'));
  el.classList.add('selected');
  const mp = $('#mpesa-box');
  if (method === 'mpesa') mp.classList.add('show'); else mp.classList.remove('show');
}

function placeOrder() {
  const name = $('#f-name').value.trim();
  const phone = $('#f-phone').value.trim();
  const address = $('#f-address').value.trim();
  if (!name) return toast('Please enter your name','warn');
  if (!phone) return toast('Please enter your phone number','warn');
  if (!address) return toast('Please enter your delivery address','warn');
  if (selectedPay === 'mpesa' && !$('#f-mpesa').value.trim()) return toast('Enter your M-Pesa phone number','warn');

  const orderId = 'MJ' + Date.now().toString().slice(-6);
  const pay = selectedPay === 'mpesa' ? 'M-Pesa ('+$('#f-mpesa').value.trim()+')' : 'Cash on Delivery';

  // Build a WhatsApp order message for the shop
  let msg = `*NEW ORDER â€” MJ FRYS*%0AOrder ID: ${orderId}%0A%0A*Items:*%0A`;
  cart.forEach(i=>{ msg += `â€¢ ${i.name} x${i.qty} â€” ${ksh(i.price*i.qty)}%0A`; });
  msg += `%0A*Subtotal:* ${ksh(subtotal())}%0A*Delivery:* ${deliveryFee()===0?'FREE':ksh(deliveryFee())}%0A*TOTAL:* ${ksh(grandTotal())}%0A%0A*Customer:* ${name}%0A*Phone:* ${phone}%0A*Address:* ${address}%0A*Payment:* ${pay}`;
  const waLink = `https://wa.me/${WHATSAPP}?text=${msg}`;

  // Show success screen
  $('#checkout-form-wrap').classList.add('hidden');
  $('#success-screen').classList.remove('hidden');
  $('#order-id').textContent = orderId;
  $('#wa-link').href = waLink;

  // Simulate M-Pesa STK push note
  if (selectedPay === 'mpesa') {
    $('#pay-note').textContent = 'An M-Pesa STK push prompt will appear on your phone. Alternatively, send the order via WhatsApp to confirm.';
  } else {
    $('#pay-note').textContent = 'Please have the exact cash ready upon delivery.';
  }

  cart = []; saveCart(); updateCartUI();
}

function resetCheckout() {
  $('#success-screen').classList.add('hidden');
  $('#checkout-form-wrap').classList.remove('hidden');
  $('#checkout-form').reset();
  closeCheckout();
}

/* ---------- Toast ---------- */
let toastTimer;
function toast(text, type='ok') {
  let wrap = $('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className='toast-wrap'; document.body.appendChild(wrap); }
  const el = document.createElement('div');
  el.className = `toast ${type==='warn'?'':'ok'}`;
  el.innerHTML = `<span class="t-ico">${type==='warn'?'âš ï¸':'âœ“'}</span><span>${text}</span>`;
  wrap.appendChild(el);
  setTimeout(()=>{ el.style.opacity='0'; el.style.transform='translateY(10px)'; setTimeout(()=>el.remove(),300); }, 2600);
}

/* ---------- Scroll reveal ---------- */
function reveal() {
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(el=>io.observe(el));
}

/* ---------- Scroll progress ---------- */
function scrollProgress() {
  const bar = $('.scroll-progress');
  if (!bar) return;
  const h = document.documentElement.scrollHeight - window.innerHeight;
  const p = (window.scrollY / h) * 100;
  bar.style.width = p + '%';
}

/* ---------- Init ---------- */
function init() {
  renderMenu();
  updateCartUI();

  // filter chips
  $$('.chip').forEach(c => c.addEventListener('click', ()=>{
    $$('.chip').forEach(x=>x.classList.remove('active'));
    c.classList.add('active');
    activeFilter = c.dataset.filter;
    renderMenu();
  }));

  // cart open/close
  $('#open-cart').addEventListener('click', openCart);
  $('#close-cart').addEventListener('click', closeCart);
  $('#overlay').addEventListener('click', closeCart);
  $('#cart-checkout').addEventListener('click', openCheckout);

  // checkout
  $('#checkout-close').addEventListener('click', resetCheckout);
  $('#checkout-overlay').addEventListener('click', resetCheckout);
  $('#place-order').addEventListener('click', placeOrder);
  $('#order-more').addEventListener('click', resetCheckout);
  $$('.pay-opt').forEach(o=>o.addEventListener('click', ()=>selectPay(o.dataset.pay, o)));

  // mobile menu
  $('#menu-toggle').addEventListener('click', ()=> $('#nav-links').classList.toggle('mobile-open'));
  $$('#nav-links a').forEach(a=>a.addEventListener('click', ()=> $('#nav-links').classList.remove('mobile-open')));

  // scroll
  window.addEventListener('scroll', scrollProgress, { passive: true });

  // set dynamic values
  const ph = $$('.shop-phone'); ph.forEach(e=>e.textContent = SHOP_PHONE);
  const wa = $('#wa-fab'); if (wa) wa.href = `https://wa.me/${WHATSAPP}`;

  reveal();
}

document.addEventListener('DOMContentLoaded', init);

