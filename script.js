/* ============================================================
   ITCore Technologies — Interactive Script
   ============================================================ */
(function(){
  'use strict';

  // ---------- Year ----------
  var y = document.getElementById('itcore-year');
  if (y) y.textContent = new Date().getFullYear();

  // ---------- Mobile menu ----------
  var menuBtn = document.getElementById('itcore-menu-toggle');
  var nav = document.getElementById('itcore-nav');
  if (menuBtn && nav){
    menuBtn.addEventListener('click', function(){
      var open = nav.classList.toggle('open');
      menuBtn.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        nav.classList.remove('open');
        menuBtn.classList.remove('open');
      });
    });
  }

  // ---------- Header shadow on scroll ----------
  var header = document.getElementById('itcore-header');
  window.addEventListener('scroll', function(){
    if (!header) return;
    if (window.scrollY > 10) header.style.boxShadow = '0 1px 0 rgba(10,31,68,.06)';
    else header.style.boxShadow = 'none';
  });

  // ---------- Reveal on scroll ----------
  var revealEls = document.querySelectorAll('.itcore-section, .itcore-service-card, .itcore-product, .itcore-testimonials figure');
  revealEls.forEach(function(el){ el.classList.add('itcore-reveal'); });
  if ('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    },{threshold:.12});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

  // ---------- Products ----------
var products = [
  {id:1, name:'Business Laptop', cat:'laptops', price:12500, image:'images/business-laptop.jpg'},
  {id:2, name:'HP EliteBook', cat:'laptops', price:9800, image:'images/hp-elitebook.jpg'},
  {id:3, name:'Dell Latitude', cat:'laptops', price:10500, image:'images/dell-latitude.jpg'},
  {id:4, name:'iPhone 12', cat:'phones', price:8500, image:'images/iphone-12.jpg'},
  {id:5, name:'Samsung Galaxy A Series', cat:'phones', price:4200, image:'images/samsung-galaxy-a-series.jpg'},
  {id:6, name:'WiFi Router', cat:'networking', price:850, image:'images/wifi-router.jpg'},
  {id:7, name:'CCTV Camera Kit', cat:'security', price:3500, image:'images/cctv-camera-kit.jpg'},
  {id:8, name:'External Hard Drive 1TB', cat:'accessories', price:1200, image:'images/external-hard-drive-1tb.jpg'},
  {id:9, name:'Wireless Keyboard & Mouse', cat:'accessories', price:650, image:'images/wireless-keyboard-mouse.jpg'},
  {id:10, name:'Antivirus Security Package', cat:'security', price:450, image:'images/antivirus-security-package.jpg'}
];

var grid = document.getElementById('itcore-products');
var filters = document.getElementById('itcore-filters');
var activeFilter = 'all';

function fmt(n){ return 'ZMW ' + n.toLocaleString('en-US'); }

function renderProducts(){
  if (!grid) return;
  grid.innerHTML = '';

  products
    .filter(function(p){ return activeFilter === 'all' || p.cat === activeFilter; })
    .forEach(function(p){
      var el = document.createElement('article');
      el.className = 'itcore-product itcore-reveal in';

      el.innerHTML =
        '<div class="itcore-product-img">' +
          '<img src="' + p.image + '" alt="' + p.name + '">' +
        '</div>' +
        '<div class="itcore-product-body">' +
          '<span class="itcore-product-cat">' + p.cat + '</span>' +
          '<h3 class="itcore-product-name">' + p.name + '</h3>' +
          '<div class="itcore-product-price">' + fmt(p.price) + '</div>' +
          '<div class="itcore-product-actions">' +
            '<button class="itcore-add-cart" data-id="' + p.id + '">Add to Cart</button>' +
            '<button class="itcore-quote-btn" data-quote="' + p.id + '">Quote</button>' +
          '</div>' +
        '</div>';

      grid.appendChild(el);
    });
}

if (filters){
  filters.addEventListener('click', function(e){
    var t = e.target.closest('.itcore-filter');
    if (!t) return;

    filters.querySelectorAll('.itcore-filter').forEach(function(b){
      b.classList.remove('active');
    });

    t.classList.add('active');
    activeFilter = t.dataset.filter;
    renderProducts();
  });
}
  // ---------- Cart ----------
  var cart = []; // {id, qty}
  var cartBtn = document.getElementById('itcore-cart-btn');
  var drawer = document.getElementById('itcore-cart-drawer');
  var overlay = document.getElementById('itcore-overlay');
  var closeBtn = document.getElementById('itcore-cart-close');
  var itemsEl = document.getElementById('itcore-cart-items');
  var totalEl = document.getElementById('itcore-cart-total');
  var countEl = document.getElementById('itcore-cart-count');

  function openCart(){ drawer.classList.add('open'); overlay.classList.add('open'); drawer.setAttribute('aria-hidden','false'); }
  function closeCart(){ drawer.classList.remove('open'); overlay.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); }
  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (closeBtn) closeBtn.addEventListener('click', closeCart);
  if (overlay) overlay.addEventListener('click', closeCart);

  function findProduct(id){ return products.find(function(p){ return p.id===id; }); }

  function addToCart(id){
    var item = cart.find(function(c){ return c.id===id; });
    if (item) item.qty++;
    else cart.push({id:id, qty:1});
    renderCart();
    openCart();
  }
  function changeQty(id, delta){
    var item = cart.find(function(c){ return c.id===id; });
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(function(c){ return c.id!==id; });
    renderCart();
  }

  function renderCart(){
    if (!itemsEl) return;
    if (cart.length===0){
      itemsEl.innerHTML = '<div class="itcore-cart-empty">Your cart is empty.</div>';
    } else {
      itemsEl.innerHTML = '';
      cart.forEach(function(c){
        var p = findProduct(c.id); if(!p) return;
        var row = document.createElement('div');
        row.className = 'itcore-cart-item';
        row.innerHTML =
          '<div style="flex:1">'+
            '<div class="name">'+p.name+'</div>'+
            '<div class="price">'+fmt(p.price)+'</div>'+
            '<div class="itcore-qty">'+
              '<button data-dec="'+p.id+'">−</button>'+
              '<span>'+c.qty+'</span>'+
              '<button data-inc="'+p.id+'">+</button>'+
            '</div>'+
          '</div>'+
          '<strong>'+fmt(p.price*c.qty)+'</strong>';
        itemsEl.appendChild(row);
      });
    }
    var total = cart.reduce(function(s,c){ var p=findProduct(c.id); return s + (p?p.price*c.qty:0); },0);
    totalEl.textContent = fmt(total);
    var count = cart.reduce(function(s,c){ return s+c.qty; },0);
    countEl.textContent = count;
  }

  document.addEventListener('click', function(e){
    var add = e.target.closest('[data-id]');
    if (add && add.classList.contains('itcore-add-cart')){
      addToCart(parseInt(add.dataset.id,10)); return;
    }
    var q = e.target.closest('[data-quote]');
    if (q){
      var p = findProduct(parseInt(q.dataset.quote,10));
      if (p) sendWhatsApp('Hello ITCore, I would like a quote for: '+p.name+' ('+fmt(p.price)+').');
      return;
    }
    var inc = e.target.closest('[data-inc]'); if (inc){ changeQty(parseInt(inc.dataset.inc,10),+1); return; }
    var dec = e.target.closest('[data-dec]'); if (dec){ changeQty(parseInt(dec.dataset.dec,10),-1); return; }
  });

  function sendWhatsApp(msg){
    var phone = '260962947441'; // placeholder
    var url = 'https://wa.me/'+phone+'?text='+encodeURIComponent(msg);
    window.open(url,'_blank','noopener');
  }

  var checkoutBtn = document.getElementById('itcore-checkout');
  if (checkoutBtn) checkoutBtn.addEventListener('click', function(){
    if (cart.length===0){ alert('Your cart is empty.'); return; }
    var lines = cart.map(function(c){
      var p=findProduct(c.id);
      return '• '+p.name+' x'+c.qty+' — '+fmt(p.price*c.qty);
    });
    var total = cart.reduce(function(s,c){ var p=findProduct(c.id); return s+p.price*c.qty; },0);
    var msg = 'Hello ITCore Technologies, I would like to place an order:\n\n'+lines.join('\n')+'\n\nTotal: '+fmt(total);
    sendWhatsApp(msg);
  });
  var quoteBtn = document.getElementById('itcore-quote');
  if (quoteBtn) quoteBtn.addEventListener('click', function(){
    if (cart.length===0){ alert('Add products to request a quote.'); return; }
    var lines = cart.map(function(c){ var p=findProduct(c.id); return '• '+p.name+' x'+c.qty; });
    sendWhatsApp('Hello ITCore, I would like a quote for:\n\n'+lines.join('\n'));
  });

  // ---------- Contact form ----------
  var form = document.getElementById('itcore-form');
  var status = document.getElementById('itcore-form-status');
  if (form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var data = new FormData(form);
      var name = (data.get('name')||'').toString().trim();
      var email = (data.get('email')||'').toString().trim();
      var message = (data.get('message')||'').toString().trim();
      if (!name || !email || !message){
        status.style.color = '#fda4af';
        status.textContent = 'Please complete all required fields.';
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        status.style.color = '#fda4af';
        status.textContent = 'Please enter a valid email address.';
        return;
      }
      status.style.color = '';
      status.textContent = 'Thank you. Your message has been received — we will be in touch shortly.';
      form.reset();
    });
  }

  // Initial render
  renderProducts();
  renderCart();
})();
