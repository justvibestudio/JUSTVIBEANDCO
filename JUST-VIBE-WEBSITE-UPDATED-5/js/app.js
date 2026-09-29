(() => {
  const C = window.JV_CONFIG || {};
  const money = n => `${C.currency || '₹'}${Number(n).toLocaleString('en-IN')}`;
  const getCart = () => JSON.parse(localStorage.getItem('jv_cart') || '[]');
  const saveCart = cart => { localStorage.setItem('jv_cart', JSON.stringify(cart)); renderCart(); };
  const toast = msg => { const el=document.getElementById('toast'); if(!el)return; el.textContent=msg; el.classList.add('show'); clearTimeout(window.__jvToast); window.__jvToast=setTimeout(()=>el.classList.remove('show'),2600); };
  const cartCount = () => getCart().reduce((s,i)=>s+i.qty,0);
  function renderCart(){
    const cart=getCart(), count=document.getElementById('cartCount'), items=document.getElementById('cartItems'), total=document.getElementById('cartTotal');
    if(count) count.textContent=cartCount();
    if(!items)return;
    items.innerHTML=cart.length ? cart.map((i,idx)=>`<div class="cart-item"><img src="${i.image}" alt=""><div><b>${i.name}</b><small>${money(i.price)} × ${i.qty}</small><div class="line-actions"><button data-cart="minus" data-index="${idx}">−</button><button data-cart="plus" data-index="${idx}">+</button><button data-cart="remove" data-index="${idx}">Remove</button></div></div></div>`).join('') : '<div class="empty-state">Your bag is empty.<br><span>Add your first vibe.</span></div>';
    if(total) total.textContent=money(cart.reduce((s,i)=>s+i.price*i.qty,0));
  }
  function addProduct(qty=1){
    const cart=getCart(), id='jv-serum'; let item=cart.find(x=>x.id===id);
    if(item)item.qty+=qty; else cart.push({id,name:C.productName||'Daily Serum',price:C.productPrice||699,qty,image:'assets/images/product-packshot.jpg'});
    saveCart(cart); toast('Added to your bag ✦');
  }
  function setup(){
    renderCart();
    const menu=document.getElementById('menuBtn'), nav=document.getElementById('mainNav'); menu?.addEventListener('click',()=>nav?.classList.toggle('open'));
    document.querySelectorAll('#mainNav a').forEach(a=>a.addEventListener('click',()=>nav?.classList.remove('open')));
    const drawer=document.getElementById('cartDrawer'), overlay=document.getElementById('overlay');
    const openCart=()=>{drawer?.classList.add('open');overlay?.classList.add('show');renderCart()}; const closeCart=()=>{drawer?.classList.remove('open');overlay?.classList.remove('show')};
    document.getElementById('cartBtn')?.addEventListener('click',openCart); document.getElementById('closeCart')?.addEventListener('click',closeCart); overlay?.addEventListener('click',closeCart);
    document.addEventListener('click',e=>{const b=e.target.closest('[data-cart]'); if(!b)return; const cart=getCart(),i=+b.dataset.index, action=b.dataset.cart; if(!cart[i])return; if(action==='plus')cart[i].qty++; if(action==='minus')cart[i].qty--; if(action==='remove'||cart[i].qty<=0)cart.splice(i,1); saveCart(cart);});
    let qty=1; document.querySelectorAll('[data-qty]').forEach(b=>b.addEventListener('click',()=>{qty=Math.max(1,qty+Number(b.dataset.qty)); const q=document.getElementById('qty'); if(q)q.textContent=qty; const add=document.getElementById('addProduct'); if(add)add.textContent=`ADD TO BAG — ${money((C.productPrice||699)*qty)}`}));
    document.getElementById('addProduct')?.addEventListener('click',()=>addProduct(qty));
    document.getElementById('orderProduct')?.addEventListener('click',()=>{ addProduct(qty); setTimeout(()=>location.href='pages/checkout.html',180); });
    const search=document.getElementById('searchModal'); document.getElementById('searchBtn')?.addEventListener('click',()=>search?.classList.add('open')); document.getElementById('closeSearch')?.addEventListener('click',()=>search?.classList.remove('open')); document.getElementById('searchInput')?.addEventListener('keydown',e=>{if(e.key==='Enter'){const q=e.target.value.toLowerCase(); search?.classList.remove('open'); if(q.includes('faq'))location.href='pages/faq.html'; else if(q.includes('contact'))location.href='pages/contact.html'; else if(q.includes('formula')||q.includes('benefit'))location.href='#formula'; else location.href='pages/product.html';}});
    document.getElementById('newsletterForm')?.addEventListener('submit',e=>{e.preventDefault(); localStorage.setItem('jv_newsletter',e.target.querySelector('input').value); toast('Welcome to the Vibe Club ✦'); e.target.reset();});
    document.querySelectorAll('[data-email-form]').forEach(form=>form.addEventListener('submit',async e=>{
      e.preventDefault();
      const btn=form.querySelector('button[type=submit]'); if(btn){btn.disabled=true;btn.textContent='SENDING…';}
      try{
        const res=await fetch(form.action,{method:'POST',headers:{'Accept':'application/json'},body:new FormData(form)});
        if(!res.ok) throw new Error('send failed');
        toast('Message sent to JUST VIBE ✦'); form.reset();
      }catch(err){
        toast('Could not send right now. Please email us directly.');
      }finally{if(btn){btn.disabled=false;btn.textContent='SEND MESSAGE →';}}
    }));
    document.querySelectorAll('[data-community]').forEach(a=>a.href=C.whatsappCommunity||'https://chat.whatsapp.com/HIxL4lmihKeB8K32Jwth3A');
    document.querySelectorAll('[data-instagram]').forEach(a=>a.href=C.instagram);
    document.querySelectorAll('[data-email-link]').forEach(a=>a.href=`mailto:${C.supportEmail||'justvibestudio.in@gmail.com'}`);
  }
  window.JV={money,addProduct,getCart,saveCart,toast,renderCart};
  document.addEventListener('DOMContentLoaded',setup);
})();
