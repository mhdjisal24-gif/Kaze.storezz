const WHATSAPP="919946375868";
const products=[
{id:1,name:"KAZE Street Runner",category:"Shoes",price:1299,old:1599,discount:"19%",tag:"NEW",meta:"Casual • Men",sizes:["6","7","8","9","10"],colors:["#111","#ddd","#1646ff"],image:"assets/shoe-black.jpg"},
{id:2,name:"KAZE Everyday Sneaker",category:"Shoes",price:1499,old:1999,discount:"25%",tag:"BEST SELLER",meta:"Sneaker • Men",sizes:["6","7","8","9","10","11"],colors:["#fff","#111","#8791a0"],image:"assets/shoe-white.jpg"},
{id:3,name:"KAZE Classic Runner",category:"Shoes",price:1199,old:1399,discount:"14%",tag:"NEW",meta:"Casual • Men",sizes:["6","7","8","9","10"],colors:["#111","#d22","#ddd"],image:"assets/shoe-runner.jpg"},
{id:4,name:"KAZE Urban Trainer",category:"Shoes",price:1699,old:1999,discount:"15%",tag:"POPULAR",meta:"Sports • Men",sizes:["7","8","9","10","11"],colors:["#111","#fff"],image:"assets/shoe-black.jpg"},
{id:5,name:"KAZE Minimal Watch",category:"Watches",price:999,old:1299,discount:"23%",tag:"",meta:"Everyday • One Size",sizes:["One Size"],colors:["#111","#1646ff"],image:"assets/watch-blue.jpg"},
{id:6,name:"KAZE Classic Watch",category:"Watches",price:1299,old:1599,discount:"19%",tag:"",meta:"Classic • One Size",sizes:["One Size"],colors:["#111","#ddd"],image:"assets/watch-blue.jpg"},
{id:7,name:"KAZE Essential Wallet",category:"Others",price:499,old:699,discount:"29%",tag:"",meta:"Accessory • One Size",sizes:["One Size"],colors:["#111"],image:"assets/category-other.jpg"},
{id:8,name:"KAZE Sunglasses",category:"Others",price:699,old:899,discount:"22%",tag:"",meta:"Accessory • One Size",sizes:["One Size"],colors:["#111","#555"],image:"assets/category-other.jpg"}
];
let cart=JSON.parse(localStorage.getItem("kazeCartV3")||"[]");
let filter="all", query="", heroIndex=0;

const money=n=>"₹"+Number(n).toLocaleString("en-IN");
const toast=m=>{const t=document.getElementById("toast");t.textContent=m;t.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove("show"),1800)};

function renderProducts(){
 const list=products.filter(p=>(filter==="all"||p.category===filter)&&(`${p.name} ${p.category} ${p.meta}`.toLowerCase().includes(query)));
 const grid=document.getElementById("productGrid");
 grid.innerHTML=list.length?list.map(p=>`
 <article class="product">
  <div class="product-image">
   ${p.tag?`<span class="badge">${p.tag}</span>`:""}
   <button class="heart ${wishlist.includes(p.id)?"liked":""}" data-wish="${p.id}" aria-label="Wishlist">${wishlist.includes(p.id)?"♥":"♡"}</button>
   <img src="${p.image}" alt="${p.name}" loading="lazy">
  </div>
  <div class="product-info">
   <h3>${p.name}</h3><div class="meta">${p.meta}</div>
   <div class="price-row"><span class="price">${money(p.price)}</span><span class="old">${money(p.old)}</span><span class="discount">-${p.discount}</span></div>
   <div class="size-title">SIZE</div>
   <div class="sizes">${p.sizes.map((s,i)=>`<button class="size ${i===0?"selected":""}" data-size="${s}" data-pid="${p.id}">${s}</button>`).join("")}</div>
   <div class="colors">${p.colors.map((c,i)=>`<button class="color ${i===0?"selected":""}" style="background:${c}" data-color="${c}" data-pid="${p.id}" aria-label="Color"></button>`).join("")}</div>
   <button class="add ripple" data-add="${p.id}" data-size="${p.sizes[0]}" data-color="${p.colors[0]}">▢ &nbsp; Add to Bag</button>
  </div>
 </article>`).join(""):`<div class="empty" style="grid-column:1/-1">No products found.</div>`;
}
let wishlist=JSON.parse(localStorage.getItem("kazeWishV3")||"[]");

function updateCounts(){
 const n=cart.reduce((s,x)=>s+x.qty,0);
 document.getElementById("cartCount").textContent=n;
 document.getElementById("mobileCartCount").textContent=n;
}
function renderCart(){
 const box=document.getElementById("cartItems");
 if(!cart.length){box.innerHTML='<div class="empty">Your bag is empty.<br>Add your favourite KAZE products.</div>'}
 else box.innerHTML=cart.map((x,i)=>`
 <div class="cart-item">
  <div class="cart-thumb"><img src="${x.image}" alt=""></div>
  <div><h4>${x.name}</h4><p>Size: ${x.size} • ${x.color}</p><div class="qty"><button data-minus="${i}">−</button><span>${x.qty}</span><button data-plus="${i}">+</button><button class="remove" data-remove="${i}">Remove</button></div></div>
  <b>${money(x.price*x.qty)}</b>
 </div>`).join("");
 document.getElementById("cartTotal").textContent=money(cart.reduce((s,x)=>s+x.price*x.qty,0));
 updateCounts();
}
function save(){localStorage.setItem("kazeCartV3",JSON.stringify(cart));renderCart()}
function openCart(){document.getElementById("cartDrawer").classList.add("open");document.getElementById("cartOverlay").classList.add("open");document.body.style.overflow="hidden"}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("cartOverlay").classList.remove("open");document.body.style.overflow=""}
function add(id,size,color){
 const p=products.find(x=>x.id===id);if(!p)return;
 const same=cart.find(x=>x.id===id&&x.size===size&&x.color===color);
 if(same)same.qty++;else cart.push({...p,qty:1,size,color});
 save();toast("Added to your bag ✓");openCart();
}
function openCheckout(){
 if(!cart.length){toast("Your bag is empty");return}
 closeCart();document.getElementById("checkoutModal").classList.add("open");
}
function closeCheckout(){document.getElementById("checkoutModal").classList.remove("open")}

document.addEventListener("click",e=>{
 const addBtn=e.target.closest("[data-add]");if(addBtn)add(+addBtn.dataset.add,addBtn.dataset.size,addBtn.dataset.color);
 const size=e.target.closest("[data-size]");if(size){
  document.querySelectorAll(`[data-pid="${size.dataset.pid}"]`).forEach(x=>{if(x.classList.contains("size"))x.classList.remove("selected")});
  size.classList.add("selected");document.querySelector(`[data-add="${size.dataset.pid}"]`).dataset.size=size.dataset.size;
 }
 const color=e.target.closest("[data-color]");if(color){
  document.querySelectorAll(`[data-pid="${color.dataset.pid}"]`).forEach(x=>{if(x.classList.contains("color"))x.classList.remove("selected")});
  color.classList.add("selected");document.querySelector(`[data-add="${color.dataset.pid}"]`).dataset.color=color.dataset.color;
 }
 const wish=e.target.closest("[data-wish]");if(wish){
  const id=+wish.dataset.wish;wishlist=wishlist.includes(id)?wishlist.filter(x=>x!==id):[...wishlist,id];
  localStorage.setItem("kazeWishV3",JSON.stringify(wishlist));renderProducts();toast(wishlist.includes(id)?"Added to wishlist":"Removed from wishlist");
 }
 const plus=e.target.closest("[data-plus]");if(plus){cart[+plus.dataset.plus].qty++;save()}
 const minus=e.target.closest("[data-minus]");if(minus){cart[+minus.dataset.minus].qty--;if(cart[+minus.dataset.minus].qty<=0)cart.splice(+minus.dataset.minus,1);save()}
 const rem=e.target.closest("[data-remove]");if(rem){cart.splice(+rem.dataset.remove,1);save()}
 const jump=e.target.closest("[data-jump]");if(jump){filter=jump.dataset.jump;document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b.dataset.filter===filter));renderProducts()}
});

document.getElementById("cartBtn").onclick=openCart;
document.getElementById("mobileCart").onclick=openCart;
document.getElementById("closeCart").onclick=closeCart;
document.getElementById("cartOverlay").onclick=closeCart;
document.getElementById("checkoutBtn").onclick=openCheckout;
document.getElementById("closeCheckout").onclick=closeCheckout;
document.getElementById("whatsappFloat").onclick=()=>window.open(`https://wa.me/${WHATSAPP}`,"_blank");
document.getElementById("mobileSearch").onclick=()=>{document.getElementById("searchWrap").classList.toggle("open");document.getElementById("searchInput").focus()};

document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{filter=b.dataset.filter;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));renderProducts()});
document.getElementById("searchBtn").onclick=()=>{document.getElementById("searchWrap").classList.toggle("open");document.getElementById("searchInput").focus()};
document.getElementById("searchInput").oninput=e=>{query=e.target.value.toLowerCase().trim();renderProducts()};

document.getElementById("menuBtn").onclick=()=>{document.getElementById("sideMenu").classList.add("open");document.getElementById("overlay").classList.add("open")};
document.getElementById("closeMenu").onclick=()=>{document.getElementById("sideMenu").classList.remove("open");document.getElementById("overlay").classList.remove("open")};
document.getElementById("overlay").onclick=()=>{document.getElementById("sideMenu").classList.remove("open");document.getElementById("overlay").classList.remove("open")};

document.querySelectorAll("[data-watch-link]").forEach(x=>x.addEventListener("click",()=>{filter="Watches";document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b.dataset.filter==="Watches"));renderProducts()}));

document.getElementById("checkoutForm").onsubmit=e=>{
 e.preventDefault();if(!cart.length)return;
 const f=new FormData(e.target);
 const items=cart.map(x=>`• ${x.name} — Size ${x.size} — ${x.qty} × ${money(x.price)} = ${money(x.price*x.qty)}`).join("\n");
 const total=cart.reduce((s,x)=>s+x.price*x.qty,0);
 const msg=`*KAZE — NEW ORDER*\n\n*Products:*\n${items}\n\n*Subtotal:* ${money(total)}\n*Customer:* ${f.get("name")}\n*Phone:* ${f.get("phone")}\n*Delivery Address:* ${f.get("address")}\n*Notes:* ${f.get("notes")||"None"}\n\n*COD:* No\nPlease confirm delivery charge and availability.`;
 window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`,"_blank");
 closeCheckout();toast("Opening WhatsApp…");
};

const revealObserver=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(x=>revealObserver.observe(x));

const heroSlides=[
 {title:"STEP UP<br>YOUR <em>STYLE</em>",text:"Premium shoes, stylish watches and more — curated for everyday confidence.",img:"assets/hero-shoes.jpg"},
 {title:"FRESH<br><em>ARRIVALS</em>",text:"New everyday styles are waiting for you.",img:"assets/shoe-white.jpg"},
 {title:"TIMELESS<br><em>DETAILS</em>",text:"Finish every fit with a clean KAZE watch.",img:"assets/watch-blue.jpg"}
];
function showHero(i){
 heroIndex=(i+heroSlides.length)%heroSlides.length;const s=heroSlides[heroIndex];
 const h=document.querySelector(".hero-copy");const p=document.querySelector(".hero-photo img");
 h.classList.add("slide-out");p.classList.add("slide-out");
 setTimeout(()=>{document.querySelector(".hero h1").innerHTML=s.title;document.querySelector(".hero-copy p").textContent=s.text;p.src=s.img;h.classList.remove("slide-out");p.classList.remove("slide-out")},180);
 document.querySelectorAll(".dot").forEach((d,n)=>d.classList.toggle("active",n===heroIndex));
}
document.getElementById("prevHero").onclick=()=>showHero(heroIndex-1);
document.getElementById("nextHero").onclick=()=>showHero(heroIndex+1);
setInterval(()=>showHero(heroIndex+1),6000);

document.getElementById("year").textContent=new Date().getFullYear();
renderProducts();renderCart();

// Premium interaction layer
window.addEventListener('load',()=>{
  const loader=document.getElementById('pageLoader');
  setTimeout(()=>loader?.classList.add('hide'),420);
});

const progress=document.getElementById('scrollProgress');
const updateProgress=()=>{if(!progress)return; const d=document.documentElement; const max=d.scrollHeight-d.clientHeight; progress.style.width=(max>0?(window.scrollY/max)*100:0)+'%'};
window.addEventListener('scroll',updateProgress,{passive:true}); updateProgress();

// Gentle cursor-follow magnetic motion on desktop
if(window.matchMedia('(pointer:fine)').matches){
 document.querySelectorAll('.magnetic').forEach(el=>{
   el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();const x=(e.clientX-r.left-r.width/2)*.10;const y=(e.clientY-r.top-r.height/2)*.10;el.style.transform=`translate(${x}px,${y}px)`});
   el.addEventListener('pointerleave',()=>el.style.transform='');
 });
 document.querySelectorAll('.category-card,.mini-card').forEach(card=>{
   card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(700px) rotateY(${x*3}deg) rotateX(${y*-3}deg) translateY(-6px)`});
   card.addEventListener('pointerleave',()=>card.style.transform='');
 });
}

// Ripple effect for dynamically rendered and static buttons
window.addEventListener('pointerdown',e=>{
 const target=e.target.closest('.ripple'); if(!target)return;
 const rect=target.getBoundingClientRect(); const wave=document.createElement('span');
 wave.className='click-wave'; wave.style.left=(e.clientX-rect.left)+'px'; wave.style.top=(e.clientY-rect.top)+'px'; target.appendChild(wave);
 setTimeout(()=>wave.remove(),650);
});

// Keep active navigation item in sync with scroll position
const sections=[...document.querySelectorAll('main section[id]')];
const navLinks=[...document.querySelectorAll('.nav a')];
const navObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
 if(!entry.isIntersecting)return; navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id));
}),{rootMargin:'-35% 0px -55% 0px',threshold:0});
sections.forEach(s=>navObserver.observe(s));
