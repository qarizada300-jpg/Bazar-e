const PRODUCTS=[
 {id:1,n:"کشمش سبز هرات",c:"خشکبار",p:380,i:"🍇",img:"assets/products/p1.jpg",u:"هر کیلو"},
 {id:2,n:"بادام مغزدار",c:"خشکبار",p:950,i:"🌰",img:"assets/products/p2.jpg",u:"هر کیلو"},
 {id:3,n:"زعفران خالص",c:"ادویه",p:420,i:"🌺",img:"assets/products/p3.jpg",u:"هر گرام"},
 {id:4,n:"چای سبز و هیل",c:"ادویه",p:260,i:"🍵",img:"assets/products/p4.jpg",u:"هر بسته"},
 {id:5,n:"قالین دست‌باف ترکمنی",c:"صنایع دستی",p:18500,i:"🧶",img:"assets/products/p5.jpg",u:"هر قطعه"},
 {id:6,n:"انگشتر لاجورد بدخشان",c:"صنایع دستی",p:2200,i:"💎",img:"assets/products/p6.jpg",u:"هر عدد"},
 {id:7,n:"پکول و چپن",c:"پوشاک",p:3400,i:"🧥",img:"assets/products/p7.jpg",u:"هر دست"},
 {id:8,n:"انار شیرین کندهار",c:"میوه",p:140,i:"🍎",img:"assets/products/p8.jpg",u:"هر کیلو"}
];
const fa=n=>Number(n).toLocaleString("fa-AF");
let cart={};
try{cart=JSON.parse(localStorage.getItem("cart")||"{}")||{}}catch(e){cart={}}
const save=()=>{try{localStorage.setItem("cart",JSON.stringify(cart))}catch(e){}};
const $=s=>document.querySelector(s);

function card(p){
  return `<article class="item"><div class="thumb"><img src="${p.img}" alt="${p.n}" loading="lazy"></div>
  <h3>${p.n}</h3><span class="muted">${p.c}</span>
  <div class="price">${fa(p.p)} افغانی <small class="muted">${p.u}</small></div>
  <button class="btn small" data-add="${p.id}">افزودن به سبد</button></article>`;
}
let cat="همه";
function drawCats(){
  const all=["همه",...new Set(PRODUCTS.map(p=>p.c))];
  $("#cats").innerHTML=all.map(c=>`<button class="${c===cat?"on":""}" aria-pressed="${c===cat}" data-cat="${c}">${c}</button>`).join("");
  $("#list").innerHTML=PRODUCTS.filter(p=>cat==="همه"||p.c===cat).map(card).join("");
}
function drawCart(){
  const rows=Object.keys(cart).map(id=>({p:PRODUCTS.find(x=>x.id==id),q:cart[id]})).filter(r=>r.p);
  const n=rows.reduce((s,r)=>s+r.q,0);
  $("#count").textContent=fa(n);
  if(!rows.length){$("#cartBox").innerHTML=`<p class="muted">سبد شما خالی است.</p><a class="btn" href="#products">رفتن به محصولات</a>`;return}
  const total=rows.reduce((s,r)=>s+r.q*r.p.p,0);
  $("#cartBox").innerHTML=`<div class="scroll"><table><thead><tr><th>محصول</th><th>قیمت</th><th>تعداد</th><th>جمع</th></tr></thead><tbody>`+
   rows.map(r=>`<tr><td><span class="cart-thumb"><img src="${r.p.img}" alt=""></span> ${r.p.n}</td><td>${fa(r.p.p)}</td>
   <td><button data-dec="${r.p.id}" aria-label="کم کردن">−</button> ${fa(r.q)} <button data-add="${r.p.id}" aria-label="زیاد کردن">+</button></td>
   <td>${fa(r.q*r.p.p)}</td></tr>`).join("")+`</tbody></table></div>
   <div class="total">مجموع: ${fa(total)} افغانی ${total>=3000?'<span class="ok">(ارسال رایگان در کابل)</span>':''}</div>
   <a class="btn" href="#contact">ثبت سفارش از طریق تماس</a>
   <button class="btn alt" data-clear="1">خالی کردن سبد</button>`;
}
document.addEventListener("click",e=>{
  const t=e.target.closest("button");if(!t)return;
  if(t.dataset.add){cart[t.dataset.add]=(cart[t.dataset.add]||0)+1;save();drawCart()}
  else if(t.dataset.dec){const k=t.dataset.dec;if(--cart[k]<=0)delete cart[k];save();drawCart()}
  else if(t.dataset.clear){cart={};save();drawCart()}
  else if(t.dataset.cat){cat=t.dataset.cat;drawCats()}
});

const pages=["home","products","cart","about","delivery","contact"];
function route(){
  const h=location.hash.slice(1);const name=pages.includes(h)?h:"home";
  document.querySelectorAll(".page").forEach(s=>s.classList.toggle("on",s.id==="page-"+name));
  document.querySelectorAll("nav a").forEach(a=>a.toggleAttribute("aria-current",a.dataset.p===name)||0);
  document.querySelectorAll("nav a").forEach(a=>{if(a.dataset.p===name)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current")});
  document.title=(name==="home"?"":$("#page-"+name+" h1").textContent+" | ")+"بازار لاجورد";
  window.scrollTo(0,0);
}
addEventListener("hashchange",()=>{if(document.startViewTransition&&!matchMedia("(prefers-reduced-motion: reduce)").matches)document.startViewTransition(route);else route()});

$("#form").addEventListener("submit",e=>{
  e.preventDefault();
  const n=$("#n").value.trim(),t=$("#t").value.trim(),m=$("#m").value.trim(),box=$("#fmsg");
  if(!n||!m){box.className="msg err";box.textContent="نام و پیام را بنویسید.";return}
  if(!/^(\+93|0)?7\d{8}$/.test(t.replace(/[\s-]/g,""))){box.className="msg err";box.textContent="شمارهٔ موبایل درست نیست. مثال: 0700123456";return}
  box.className="msg ok";box.textContent="پیام شما ثبت شد. به‌زودی با شما تماس می‌گیریم.";e.target.reset();
});


// Hero image slider: five local images, manual controls and gentle autoplay.
(()=>{
  const root=$("#heroSlider"); if(!root)return;
  const slides=[...root.querySelectorAll(".slide")],dots=[...root.querySelectorAll(".dot")];
  const counter=$("#slideCount");let index=0,timer=null;
  const digits=n=>String(n).padStart(2,"0").replace(/\d/g,d=>"۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
  function show(next){index=(next+slides.length)%slides.length;
    slides.forEach((el,i)=>el.classList.toggle("is-active",i===index));
    dots.forEach((el,i)=>{el.classList.toggle("is-active",i===index);el.setAttribute("aria-pressed",String(i===index))});
    counter.textContent=digits(index+1)+" / "+digits(slides.length);
  }
  function stop(){if(timer)clearInterval(timer);timer=null}
  function start(){stop();if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches)timer=setInterval(()=>show(index+1),3000)}
  root.querySelector(".prev").addEventListener("click",()=>{show(index-1);start()});
  root.querySelector(".next").addEventListener("click",()=>{show(index+1);start()});
  dots.forEach((dot,i)=>dot.addEventListener("click",()=>{show(i);start()}));
  root.addEventListener("mouseenter",stop);root.addEventListener("mouseleave",start);
  root.addEventListener("focusin",stop);root.addEventListener("focusout",start);
  document.addEventListener("visibilitychange",()=>document.hidden?stop():start());
  show(0);start();
})();

$("#featured").innerHTML=PRODUCTS.slice(0,4).map(card).join("");
drawCats();drawCart();route();