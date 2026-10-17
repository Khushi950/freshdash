/* FreshDash – quick-delivery grocery web app (vanilla JS) */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const money = (n) => "₹" + n.toLocaleString("en-IN");
  const FREE_DELIVERY_ABOVE = 199;
  const DELIVERY_FEE = 25;
  const HANDLING_FEE = 5;

  // ---------- state ----------
  const state = {
    cat: "all",
    query: "",
    sort: "rel",
    cart: load("fd_cart", {}),   // { productId: qty }
    coupon: load("fd_coupon", ""),
  };

  function load(key, fallback) {
    try {
      const v = JSON.parse(localStorage.getItem(key));
      return v ?? fallback;
    } catch { return fallback; }
  }
  function save() {
    try {
      localStorage.setItem("fd_cart", JSON.stringify(state.cart));
      localStorage.setItem("fd_coupon", JSON.stringify(state.coupon));
    } catch { /* storage unavailable: app still works */ }
  }

  // ---------- cart maths ----------
  const byId = (id) => PRODUCTS.find((p) => p.id === Number(id));
  const items = () => Object.entries(state.cart)
    .map(([id, qty]) => ({ p: byId(id), qty }))
    .filter((x) => x.p && x.qty > 0);
  const count = () => items().reduce((n, x) => n + x.qty, 0);

  function bill() {
    const list = items();
    const sub = list.reduce((s, x) => s + x.p.price * x.qty, 0);
    const mrp = list.reduce((s, x) => s + x.p.mrp * x.qty, 0);
    const delivery = sub === 0 || sub >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
    const handling = sub === 0 ? 0 : HANDLING_FEE;
    const c = COUPONS[state.coupon];
    const discount = c && sub >= c.min ? Math.min(c.apply(sub), sub) : 0;
    const total = Math.max(sub + delivery + handling - discount, 0);
    return { sub, mrp, saved: mrp - sub, delivery, handling, discount, total };
  }

  function setQty(id, qty) {
    if (qty <= 0) delete state.cart[id];
    else state.cart[id] = Math.min(qty, 10);
    save();
    renderAll();
  }

  // ---------- rendering ----------
  function renderChips() {
    $("#chips").innerHTML = CATEGORIES.map((c) => `
      <button class="chip ${c.id === state.cat ? "active" : ""}" data-cat="${c.id}">
        <span aria-hidden="true">${c.icon}</span>${c.name}
      </button>`).join("");
  }

  function visibleProducts() {
    const q = state.query.trim().toLowerCase();
    let list = PRODUCTS.filter((p) =>
      (state.cat === "all" || p.cat === state.cat) &&
      (!q || p.name.toLowerCase().includes(q) || p.cat.includes(q)));
    const off = (p) => (p.mrp - p.price) / p.mrp;
    if (state.sort === "low") list.sort((a, b) => a.price - b.price);
    if (state.sort === "high") list.sort((a, b) => b.price - a.price);
    if (state.sort === "off") list.sort((a, b) => off(b) - off(a));
    return list;
  }

  function controlFor(p) {
    const qty = state.cart[p.id] || 0;
    return qty
      ? `<div class="stepper" role="group" aria-label="Quantity of ${p.name}">
           <button data-dec="${p.id}" aria-label="Remove one ${p.name}">−</button>
           <span>${qty}</span>
           <button data-inc="${p.id}" aria-label="Add one ${p.name}">+</button>
         </div>`
      : `<button class="add" data-add="${p.id}" aria-label="Add ${p.name}">ADD</button>`;
  }

  function renderGrid() {
    const list = visibleProducts();
    const cat = CATEGORIES.find((c) => c.id === state.cat);
    $("#sectionTitle").textContent = state.query
      ? `Results for “${state.query.trim()}”`
      : cat.id === "all" ? "All products" : cat.name;
    $("#empty").hidden = list.length > 0;
    $("#grid").innerHTML = list.map((p) => {
      const pct = Math.round(((p.mrp - p.price) / p.mrp) * 100);
      return `
      <article class="card">
        ${pct > 0 ? `<span class="off-tag">${pct}% OFF</span>` : ""}
        <div class="img" aria-hidden="true">${p.emoji}</div>
        <div class="mins">⏱ ${p.mins} mins</div>
        <h3>${p.name}</h3>
        <div class="unit">${p.unit}</div>
        <div class="price-row">
          <div class="price"><b>${money(p.price)}</b>${p.mrp > p.price ? `<s>${money(p.mrp)}</s>` : ""}</div>
          ${controlFor(p)}
        </div>
      </article>`;
    }).join("");
  }

  function renderHeader() {
    const n = count();
    const b = bill();
    $("#cartCount").textContent = n;
    $("#headerTotal").textContent = n ? money(b.total) : "";
    const fc = $("#floatingCart");
    fc.hidden = n === 0;
    $("#floatingText").textContent = `${n} item${n === 1 ? "" : "s"} · ${money(b.total)}`;
  }

  function renderCart() {
    const list = items();
    const body = $("#cartBody");
    const foot = $("#cartFoot");
    if (!list.length) {
      body.innerHTML = `<div class="empty-cart"><div class="big">🛒</div><h3>Your cart is empty</h3><p>Add some fresh items to get started.</p></div>`;
      foot.innerHTML = "";
      return;
    }
    body.innerHTML = list.map(({ p, qty }) => `
      <div class="cart-item">
        <div class="em" aria-hidden="true">${p.emoji}</div>
        <div class="info"><b>${p.name}</b><small>${p.unit} · ${money(p.price)}</small></div>
        <div class="stepper">
          <button data-dec="${p.id}" aria-label="Remove one ${p.name}">−</button>
          <span>${qty}</span>
          <button data-inc="${p.id}" aria-label="Add one ${p.name}">+</button>
        </div>
        <div class="line-total">${money(p.price * qty)}</div>
      </div>`).join("");

    const b = bill();
    const c = COUPONS[state.coupon];
    let msg = "";
    if (state.coupon) {
      msg = c
        ? (b.discount > 0
            ? `<p class="coupon-msg ok">✔ ${state.coupon} applied – ${c.label}</p>`
            : `<p class="coupon-msg bad">Add ${money(c.min - b.sub)} more to use ${state.coupon}</p>`)
        : `<p class="coupon-msg bad">Invalid coupon code</p>`;
    }
    const toFree = FREE_DELIVERY_ABOVE - b.sub;
    foot.innerHTML = `
      ${toFree > 0 ? `<div class="free-note">Add ${money(toFree)} more for free delivery 🛵</div>` : `<div class="free-note">🎉 You get free delivery!</div>`}
      <div class="coupon">
        <input id="couponInput" placeholder="Coupon code (try FIRST20)" value="${state.coupon}" aria-label="Coupon code" />
        <button id="applyCoupon">Apply</button>
      </div>${msg}
      <div class="bill">
        <div><span>Item total</span><span>${money(b.sub)}</span></div>
        <div><span>Delivery fee</span><span>${b.delivery ? money(b.delivery) : "FREE"}</span></div>
        <div><span>Handling fee</span><span>${money(b.handling)}</span></div>
        ${b.discount ? `<div class="discount"><span>Coupon discount</span><span>−${money(b.discount)}</span></div>` : ""}
        <div class="total"><span>To pay</span><span>${money(b.total)}</span></div>
        ${b.saved + b.discount > 0 ? `<div class="discount"><span>Total savings</span><span>${money(b.saved + b.discount)}</span></div>` : ""}
      </div>
      <button class="primary" id="goCheckout">Proceed to checkout</button>`;
  }

  function renderAll() {
    renderGrid();
    renderHeader();
    renderCart();
  }

  // ---------- drawer / modals ----------
  let lastFocus = null;
  function openCart() {
    lastFocus = document.activeElement;
    $("#overlay").hidden = false;
    const d = $("#drawer");
    d.classList.add("open");
    d.setAttribute("aria-hidden", "false");
    $("#closeCart").focus();
  }
  function closeCart() {
    $("#overlay").hidden = true;
    const d = $("#drawer");
    d.classList.remove("open");
    d.setAttribute("aria-hidden", "true");
    lastFocus && lastFocus.focus && lastFocus.focus();
  }
  function toast(text) {
    const t = $("#toast");
    t.textContent = text;
    t.classList.add("show");
    clearTimeout(toast.t);
    toast.t = setTimeout(() => t.classList.remove("show"), 1800);
  }

  // ---------- checkout ----------
  function openCheckout() {
    if (!count()) return;
    $("#checkoutTotal").textContent = money(bill().total);
    $("#checkout").hidden = false;
    $("#checkoutForm").elements.name.focus();
  }
  function validate(form) {
    const f = form.elements;
    const errs = {};
    if (f.name.value.trim().length < 2) errs.name = "Please enter your name";
    if (!/^[6-9]\d{9}$/.test(f.phone.value.trim())) errs.phone = "Enter a valid 10-digit mobile number";
    if (f.address.value.trim().length < 8) errs.address = "Please enter a complete address";
    document.querySelectorAll(".err").forEach((e) => (e.textContent = errs[e.dataset.for] || ""));
    return Object.keys(errs).length === 0;
  }

  let trackTimers = [];
  function startTracking(orderNo, payMethod, total) {
    $("#checkout").hidden = true;
    closeCart();
    const modal = $("#tracking");
    modal.hidden = false;
    $("#trackEmoji").textContent = "✅";
    $("#trackTitle").textContent = "Order placed!";
    $("#trackSub").textContent = `Order #${orderNo} · ${money(total)} · ${payMethod}`;
    $("#trackDone").hidden = true;
    const steps = [...document.querySelectorAll("#steps li")];
    steps.forEach((li) => li.classList.remove("done", "now"));
    const emojis = ["✅", "📦", "🛵", "🎉"];
    const titles = ["Order placed!", "Packing your items", "On the way!", "Delivered. Enjoy!"];
    let eta = 10;
    const setStep = (i) => {
      steps.forEach((li, idx) => {
        li.classList.toggle("done", idx <= i);
        li.classList.toggle("now", idx === i + 1);
      });
      $("#trackEmoji").textContent = emojis[i];
      $("#trackTitle").textContent = titles[i];
      $("#eta").textContent = i === 3 ? "Delivered in 10 mins ⚡" : `Arriving in about ${Math.max(eta - i * 3, 1)} mins`;
      if (i === 3) $("#trackDone").hidden = false;
    };
    setStep(0);
    trackTimers.forEach(clearTimeout);
    trackTimers = [1, 2, 3].map((i) => setTimeout(() => setStep(i), i * 2500));
  }

  // ---------- events ----------
  document.addEventListener("click", (e) => {
    const t = e.target.closest("button");
    if (!t) return;
    if (t.dataset.cat) { state.cat = t.dataset.cat; renderChips(); renderGrid(); }
    else if (t.dataset.add) { setQty(t.dataset.add, 1); toast(`${byId(t.dataset.add).name} added`); }
    else if (t.dataset.inc) setQty(t.dataset.inc, (state.cart[t.dataset.inc] || 0) + 1);
    else if (t.dataset.dec) setQty(t.dataset.dec, (state.cart[t.dataset.dec] || 0) - 1);
    else if (t.id === "applyCoupon") {
      state.coupon = $("#couponInput").value.trim().toUpperCase();
      save(); renderCart();
    }
    else if (t.id === "goCheckout") openCheckout();
    else if (t.id === "openCart" || t.id === "floatingCart") openCart();
    else if (t.id === "closeCart") closeCart();
    else if (t.id === "closeCheckout") $("#checkout").hidden = true;
    else if (t.id === "locationBtn") {
      const place = prompt("Enter your delivery area", $("#locationText").textContent.replace(" ▾", ""));
      if (place && place.trim()) $("#locationText").textContent = place.trim().slice(0, 28) + " ▾";
    }
    else if (t.id === "trackDone") {
      $("#tracking").hidden = true;
      state.cart = {}; state.coupon = ""; save(); renderAll();
    }
  });
  $("#overlay").addEventListener("click", closeCart);
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!$("#checkout").hidden) $("#checkout").hidden = true;
    else closeCart();
  });
  $("#search").addEventListener("input", (e) => { state.query = e.target.value; renderGrid(); });
  $("#sort").addEventListener("change", (e) => { state.sort = e.target.value; renderGrid(); });
  $("#checkoutForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validate(e.target)) return;
    const pay = e.target.elements.pay.value;
    const total = bill().total;
    const orderNo = Math.floor(100000 + Math.random() * 900000);
    startTracking(orderNo, pay, total);
    // keep cart until user taps "Continue shopping" so the summary stays consistent
  });

  // ---------- init ----------
  renderChips();
  renderAll();
})();