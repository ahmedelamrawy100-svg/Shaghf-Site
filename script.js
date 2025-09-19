let users = [{username:"ahmed",password:"Ahmed",role:"owner"}];
let currentUser = null;
let products = [];
let cart = [];

document.getElementById('showPassword').addEventListener('change',function(){
  const pwd = document.getElementById('authPassword');
  const conf = document.getElementById('authConfirmPassword');
  pwd.type = this.checked ? 'text' : 'password';
  conf.type = this.checked ? 'text' : 'password';
});

function handleAuth(){
  const u = document.getElementById('authUsername').value;
  const p = document.getElementById('authPassword').value;
  const conf = document.getElementById('authConfirmPassword').value;
  if(document.getElementById('authConfirmPassword').style.display==="block"){
    if(users.find(user=>user.username===u)){ alert('الاسم مستخدم بالفعل'); return; }
    if(p!==conf){ alert('كلمة السر غير متطابقة'); return; }
    users.push({username:u,password:p,role:"client"});
    alert('تم التسجيل'); toggleAuth(false);
    return;
  }
  let found = users.find(user=>user.username===u && user.password===p);
  if(!found){ alert('بياناتك خاطئة'); return; }
  currentUser = found;
  document.getElementById('authModal').style.display='none';
  if(currentUser.role==='owner'){ document.getElementById('ownerPanel').style.display='block'; }
  document.getElementById('logoutBtn').style.display='inline';
  renderProducts();
}

function toggleAuth(isSignUp){
  document.getElementById('authTitle').innerText = isSignUp ? 'تسجيل جديد' : 'تسجيل الدخول';
  document.getElementById('authConfirmPassword').style.display = isSignUp ? 'block' : 'none';
}

document.getElementById('switchAuth').onclick = function(){ toggleAuth(true); };
document.getElementById('forgotPassword').onclick = function(){ alert('اتصل بالمالك لإعادة تعيين كلمة المرور'); };

function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.style.display='none');
  document.getElementById(id).style.display='block';
}

function addProduct(){
  const name = document.getElementById('prodName').value;
  const desc = document.getElementById('prodDesc').value;
  const price = document.getElementById('prodPrice').value;
  const image = document.getElementById('prodImage').files[0];
  if(!name||!desc||!price||!image) return alert('اكمل كل الحقول');
  const reader = new FileReader();
  reader.onload = function(e){
    products.push({name,desc,price,image:e.target.result});
    renderProducts();
  };
  reader.readAsDataURL(image);
}

function renderProducts(){
  const container = document.getElementById('productList');
  container.innerHTML='';
  products.forEach((p,i)=>{
    const card = document.createElement('div');
    card.className='product-card';
    card.innerHTML=`<img src="${p.image}" alt="${p.name}"><h3>${p.name}</h3><p>${p.desc}</p><p>${p.price} ج.م</p>`;
    if(currentUser && currentUser.role==='owner'){
      card.innerHTML += `<button onclick="deleteProduct(${i})">حذف</button>`;
    } else {
      card.innerHTML += `<button onclick="addToCart(${i})">أضف للسلة</button>`;
    }
    container.appendChild(card);
  });
}

function deleteProduct(i){ products.splice(i,1); renderProducts(); }

function addToCart(i){ cart.push(products[i]); updateCart(); alert('تمت الإضافة للعربة!'); }

function updateCart(){ document.getElementById('cartCount').innerText=cart.length;
  const c = document.getElementById('cartItems'); c.innerHTML=''; cart.forEach(p=>{ c.innerHTML+=`<p>${p.name} - ${p.price} ج.م</p>`; });
}

function placeOrder(){ if(cart.length===0){ alert('العربة فارغة'); return; } alert('تم إرسال الطلب بنجاح'); cart=[]; updateCart(); }

function sendContact(){ alert('شكرًا على رسالتك! تواصل مع المالك على الرقم: 01286273755'); }

function logout(){ currentUser=null; document.getElementById('logoutBtn').style.display='none'; document.getElementById('ownerPanel').style.display='none'; document.getElementById('authModal').style.display='flex'; }
