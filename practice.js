export function initPractice() {
// Practice extensions use only local, disposable browser state.
const byId = id => document.getElementById(id);
byId('register-demo').onclick = () => alert(prompt('Желаете пройти регистрацию на сайте?') === 'Да' ? 'Круто!' : 'Попробуй ещё раз');
byId('login-demo').onclick = () => {
  const login = prompt('Логин (учебный):');
  if (login === null || login === '') return alert('Отменено');
  if (login !== 'Админ') return alert('Я вас не знаю');
  const password = prompt('Пароль (учебный):');
  alert(password === null || password === '' ? 'Отменено' : password === 'Я главный' ? 'Здравствуйте!' : 'Неверный пароль');
};
byId('like-demo').onclick = e => e.currentTarget.setAttribute('aria-pressed', String(e.currentTarget.getAttribute('aria-pressed') !== 'true'));
let drawing = false;
byId('draw-demo').onclick = e => {
  drawing = !drawing;
  e.currentTarget.setAttribute('aria-pressed', String(drawing));
  byId('drawing-field').classList.toggle('drawing', drawing);
};
byId('drawing-field').onpointermove = e => {
  if (!drawing) return;
  const field = e.currentTarget, rect = field.getBoundingClientRect(), point = document.createElement('span');
  point.className = 'trail'; point.style.left = `${e.clientX - rect.left}px`; point.style.top = `${e.clientY - rect.top}px`;
  field.querySelector('.drawing-hint').hidden = true;
  field.append(point);
  if (field.childElementCount > 151) field.querySelector('.trail').remove();
};
function isEmpty(obj) { return Object.keys(obj).length === 0; }
function truncate(str, maxlength) { return str.length > maxlength ? str.slice(0, maxlength - 1) + '…' : str; }
window.practiceUtils = { isEmpty, truncate };
let challenge = Array.from({length:5},()=> 'aBcDeFgH23456789'[Math.floor(Math.random()*16)]).join(''), answer = challenge;
byId('practice-challenge').textContent = challenge;
byId('practice-captcha').onsubmit = e => {
  e.preventDefault(); const value = byId('practice-code').value.trim();
  if (isEmpty(value ? { value } : {})) { byId('practice-result').textContent = 'Введите код'; return; }
  if (value === answer) { byId('practice-result').textContent = 'Проверка пройдена'; return; }
  const a = Math.floor(Math.random() * 10), b = Math.floor(Math.random() * 10);
  answer = String(a + b); byId('practice-challenge').textContent = `${a} + ${b}`;
  byId('practice-result').textContent = 'Ошибка. Решите пример'; byId('practice-code').value = '';
};
function Accumulator(startingValue) {
  this.value = startingValue;
  this.read = () => { const v = prompt('Сумма:'); if (v === null || !v.trim()) return; const n = Number(v); if (Number.isFinite(n)) this.value += n; };
}
const accumulator = new Accumulator(0);
byId('accumulate').onclick = () => { accumulator.read(); byId('accumulator').textContent = String(accumulator.value); };
byId('long-text').oninput = e => { byId('truncated').textContent = truncate(e.target.value, 40); };
byId('long-text').dispatchEvent(new Event('input'));
const products = [{ id: 1, name: 'Индивидуальная', price: 3000 }, { id: 2, name: 'Семейная', price: 4500 }, { id: 3, name: 'Групповая', price: 1800 }];
let cart = [];
function renderCatalog() {
  const min = Number(byId('price-min').value), max = Number(byId('price-max').value);
  const filtered = products.filter(p => p.price >= min && p.price <= max).sort((a,b) => byId('price-order').value === 'asc' ? a.price-b.price : b.price-a.price);
  byId('catalog').replaceChildren(...filtered.map(p => {
    const item = document.createElement('article'); item.draggable = true; item.dataset.id = String(p.id);
    const title = document.createElement('h3'); title.textContent = p.name;
    const price = document.createElement('p'); price.textContent = `${p.price} ₽`;
    const button = document.createElement('button'); button.className = 'btn btn-outline'; button.textContent = 'Добавить'; button.dataset.add = String(p.id);
    item.append(title,price,button); item.ondragstart = e => e.dataTransfer.setData('text/plain', String(p.id)); return item;
  }));
}
function add(id) { const p = products.find(p => p.id === id); if (!p) return; const existing = cart.find(p => p.id === id); if (existing) existing.qty++; else cart.push({ ...p, qty: 1 }); renderCart(); }
function renderCart() {
  byId('cart-items').replaceChildren(...cart.map(p => {
    const li = document.createElement('li'); li.textContent = `${p.name}: ${p.qty} × ${p.price} ₽ `;
    for (const [action,text] of [['plus','+'],['minus','−'],['remove','Удалить']]) { const b=document.createElement('button');b.textContent=text;b.dataset[action]=String(p.id);li.append(b); }
    return li;
  })); byId('cart-total').textContent = `Итого: ${cart.reduce((sum,p)=>sum+p.qty*p.price,0)} ₽`;
}
byId('catalog').onclick = e => { const b=e.target.closest('[data-add]'); if(b) add(Number(b.dataset.add)); };
byId('cart-items').onclick = e => {
  const b=e.target.closest('button'); if(!b) return;
  if(b.dataset.plus) add(Number(b.dataset.plus));
  else if(b.dataset.remove) { cart=cart.filter(p=>p.id!==Number(b.dataset.remove));renderCart(); }
  else if(b.dataset.minus) { const p=cart.find(p=>p.id===Number(b.dataset.minus));if(p) p.qty=Math.max(1,p.qty-1);renderCart(); }
};
byId('cart-clear').onclick = () => { cart=[];renderCart(); };
byId('cart-drop').ondragover = e => e.preventDefault();
byId('cart-drop').ondrop = e => { e.preventDefault();add(Number(e.dataTransfer.getData('text/plain'))); };
for (const id of ['price-min','price-max','price-order']) byId(id).addEventListener('input',renderCatalog);
renderCatalog();renderCart();
let count=0,pausedUntil=0;
setInterval(()=>{if(Date.now()<pausedUntil||document.hidden)return;byId('notification-count').textContent=`Уведомления: ${++count}`;},3000);
function delayDecorator(fn,ms) { return function(...args){ return setTimeout(()=>fn.apply(this,args),ms); }; }
const resumeCounter=delayDecorator(()=>{byId('notification-count').textContent=`Уведомления: ${count}`;},10000);
byId('notification-count').onclick=()=>{pausedUntil=Date.now()+10000;byId('notification-count').textContent=`Пауза 10 секунд · ${count}`;resumeCounter();};
byId('new-list').onclick=()=>{while(true){const value=prompt('Пункт списка (пустой ввод завершает):');if(value===null||!value.trim())break;const li=document.createElement('li');li.textContent=value;byId('dynamic-list').append(li);}};
function showNotification(options) {const n=document.createElement('div');n.className='notification';n.textContent=options.text;const close=document.createElement('button');close.textContent='Закрыть';close.dataset.close='';n.append(close);byId('practice-notifications').append(n);setTimeout(()=>n.remove(),1500);}
byId('practice-notifications').onclick=e=>{const b=e.target.closest('[data-close]');if(b)b.parentElement.remove();};
byId('show-notification').onclick=()=>showNotification({text:'Учебное уведомление'});
const field=byId('center-field'), image=byId('center-image');
function centerImage(){image.style.left=`${(field.clientWidth-image.offsetWidth)/2}px`;image.style.top=`${(field.clientHeight-image.offsetHeight)/2}px`;}
image.onload=centerImage;window.addEventListener('resize',centerImage);centerImage();
field.onclick=e=>{const r=field.getBoundingClientRect();byId('coordinates').textContent=`x=${Math.round(e.clientX-r.left)}, y=${Math.round(e.clientY-r.top)}`;};
window.addEventListener('scroll',()=>{byId('scroll-status').textContent=`Прокрутка: ${Math.round(scrollY)} px`;},{passive:true});
byId('contents').onclick=e=>{const a=e.target.closest('a');if(a&&!confirm('Покинуть страницу демонстраций?'))e.preventDefault();};
byId('gallery').onclick=e=>{const img=e.target.closest('button')?.querySelector('img');if(img){byId('gallery-main').src=img.src;byId('gallery-main').alt=img.alt;}};
byId('multi-list').onclick=e=>{const li=e.target.closest('li');if(!li)return;if(!e.ctrlKey&&!e.metaKey)byId('multi-list').querySelectorAll('li').forEach(x=>x.classList.remove('selected'));li.classList.toggle('selected');};
byId('multi-list').onmousedown=e=>e.preventDefault();
byId('range-demo').oninput=e=>{byId('range-value').textContent=e.target.value;};
byId('animate-progress').onclick=()=>{const start=performance.now();function frame(now){const progress=Math.min((now-start)/1000,1);byId('progress-fill').style.width=`${progress*100}%`;if(progress<1)requestAnimationFrame(frame);}requestAnimationFrame(frame);};
byId('animate-image').onclick=()=>{image.animate([{transform:'scale(1)'},{transform:'scale(1.2)'},{transform:'scale(1)'}],{duration:600});};

// Expose only the named teaching demonstration for the verification console.
window.delayDecorator = delayDecorator;
}
initPractice();
