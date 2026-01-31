// -------------------- DATA --------------------
const models = {
  image: [
    { id: "nano", name: "NanoBanana", price: 5, hint: "Быстрое и экономное создание картинок высокого качества" },
    { id: "nano_pro", name: "Nanobanana Pro", price: 15, hint: "Профессиональная нейросеть для сложных идей" },
    { id: "gpt15", name: "GPT 1.5", price: 15, hint: "Продвинутая нейросеть для креативных текстов и изображений" }
  ],
  video: []
};

let balance = 14125;
let refIncome = 0;
let likes = [];
let history = [];яяфф
let published = [];
let payments = [
  { id: 1, date: "20.01.2026", amount: 500, status: "Пополнение" },
  { id: 2, date: "22.01.2026", amount: 1000, status: "Пополнение" }
];

let currentCategory = "new";
let currentProfileTab = "profile";
let carouselIndex = 0;

// -------------------- UI --------------------
function switchPage(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(`page-${page}`).classList.add("active");

  document.querySelectorAll(".bottom-nav .nav-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelector(`.bottom-nav button[data-page="${page}"]`)?.classList.add("active");
}

function openWallet() {
  alert("Кошелёк: пока заглушка (в будущем добавим оплату)");
}

function updateTopBalance(){
  document.getElementById("balanceTop").textContent = `${balance.toLocaleString()} 💎`;
  document.getElementById("balanceTotal").textContent = `${balance.toLocaleString()} 💎`;
  document.getElementById("refIncome").textContent = `${refIncome.toLocaleString()} 💎`;
}

function topUp(amount = 50){
  balance += amount;
  payments.unshift({ id: Date.now(), date: new Date().toLocaleDateString(), amount, status: "Пополнение" });
  updateTopBalance();
  renderPayments();
  alert(`Баланс пополнен на ${amount}💎`);
}

function withdraw(){
  alert("Вывод пока заглушка (пока что просто UI)");
}

function copyRef(){
  const input = document.getElementById("refLink");
  input.select();
  document.execCommand("copy");
  alert("Ссылка скопирована");
}

function createCard(item){
  return `
    <div class="card" onclick="openCreateModal('${item.type}', '${item.id}')">
      <img src="${item.img}" alt="idea" />
      <div class="info">
        <div class="title">${item.title}</div>
        <div class="meta">
          <div>${item.model}</div>
          <div class="like">
            <svg viewBox="0 0 24 24"><path d="M12 21s-7.2-4.8-9.3-9.4C1.2 8.4 2.7 5.5 5.5 4.2c1.9-.9 4-.2 5.5 1.3 1.5-1.5 3.6-2.2 5.5-1.3 2.8 1.3 4.3 4.2 2.8 7.4C19.2 16.2 12 21 12 21z"/></svg>
            <span>${item.likes || 0}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// -------------------- RENDER --------------------
function renderMain(){
  const grid = document.getElementById("main-grid");
  grid.innerHTML = "";
  const items = published.slice(0, 6);
  if(items.length === 0){
    grid.innerHTML = `<div class="empty-text">Пока нет трендов — создай первую генерацию!</div>`;
    return;
  }
  items.forEach(i => grid.innerHTML += createCard(i));
}

function renderIdeas(){
  const grid = document.getElementById("ideas-grid");
  grid.innerHTML = "";
  const items = published.filter(i => i.category === currentCategory || currentCategory === "new");
  items.forEach(i => grid.innerHTML += createCard(i));
}

function renderLikes(){
  const grid = document.getElementById("likes-grid");
  const empty = document.getElementById("likes-empty");
  grid.innerHTML = "";

  if(likes.length === 0){
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  likes.forEach(id => {
    const item = published.find(p => p.id === id);
    if(item) grid.innerHTML += createCard(item);
  });
}

function renderProfile(){
  document.querySelectorAll(".profile-subpage").forEach(p => p.classList.remove("active"));
  document.getElementById(`profile-${currentProfileTab}`).classList.add("active");
}

function renderProfileHistory(){
  const container = document.getElementById("profile-generations");
  container.innerHTML = "";
  if(history.length === 0){
    container.innerHTML = `<div class="empty-text">Скоро здесь будут твои генерации и шедевры ✨</div>`;
    return;
  }
  history.forEach(i => container.innerHTML += createCard(i));
}

function renderPayments(){
  const container = document.getElementById("profile-payments");
  container.innerHTML = "";
  payments.forEach(p => {
    container.innerHTML += `
      <div class="payment">
        <div class="left">${p.date} • ${p.status}</div>
        <div class="right">+${p.amount} 💎</div>
      </div>
    `;
  });
}

// -------------------- CATEGORIES --------------------
function setCategory(cat){
  currentCategory = cat;
  document.querySelectorAll(".cat").forEach(b => b.classList.remove("active"));
  document.querySelector(`.cat[data-cat="${cat}"]`)?.classList.add("active");
  renderIdeas();
}

// -------------------- PROFILE TABS --------------------
function setProfileTab(tab){
  currentProfileTab = tab;
  document.querySelectorAll(".profile-tab").forEach(t => t.classList.remove("active"));
  document.querySelector(`.profile-tab[data-tab="${tab}"]`)?.classList.add("active");
  renderProfile();
}

// -------------------- CREATE MODAL --------------------
function openCreateModal(type="image", fromId=null){
  document.getElementById("create-modal").style.display = "flex";
  setType(type);

  if(fromId){
    const item = published.find(p => p.id === fromId) || history.find(p => p.id === fromId);
    if(item){
      document.getElementById("prompt").value = item.prompt;
      document.getElementById("model").value = item.modelId;
      updateModelHint();
    }
  }
}

function closeCreate(){
  document.getElementById("create-modal").style.display = "none";
}

function setType(type){
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelector(`.tab[data-type="${type}"]`)?.classList.add("active");

  populateModels(type);
  updateGenButton(type);
}

function populateModels(type){
  const select = document.getElementById("model");
  select.innerHTML = "";
  models[type].forEach(m => {
    select.innerHTML += `<option value="${m.id}">${m.name}</option>`;
  });
  updateModelHint();
}

function updateModelHint(){
  const type = document.querySelector(".tab.active").dataset.type;
  const modelId = document.getElementById("model").value;
  const model = models[type].find(m => m.id === modelId);
  document.getElementById("modelHint").textContent = model ? model.hint : "";
  updateGenButton(type);
}

function updateGenButton(type){
  const modelId = document.getElementById("model").value;
  const model = models[type].find(m => m.id === modelId);

  document.getElementById("genText").textContent = type === "image" ? "Создать" : "Скоро";
  document.getElementById("genPrice").textContent = model ? `— ${model.price}💎` : "";
}

// -------------------- GENERATE --------------------
function generate(){
  const type = document.querySelector(".tab.active").dataset.type;
  const modelId = document.getElementById("model").value;
  const model = models[type].find(m => m.id === modelId);
  const prompt = document.getElementById("prompt").value.trim();

  if(!prompt){
    alert("Пожалуйста, заполните поле «Промпт»");
    return;
  }
  if(balance < model.price){
    alert("Недостаточно средств. Пополните баланс.");
    return;
  }

  balance -= model.price;
  updateTopBalance();

  const id = Date.now().toString();
  const newItem = {
    id,
    type,
    modelId,
    model: model.name,
    title: prompt.slice(0, 28) + (prompt.length > 28 ? "..." : ""),
    prompt,
    category: currentCategory === "new" ? "trend" : currentCategory,
    likes: 0,
    img: `https://picsum.photos/400/300?random=${id}`
  };

  history.unshift(newItem);

  renderProfileHistory();
  closeCreate();
  alert("Генерация создана и добавлена в историю.");
}

// -------------------- CAROUSEL --------------------
function initCarousel(){
  const items = document.querySelectorAll(".carousel-item");
  const indicators = document.createElement("div");
  indicators.className = "carousel-indicators";
  items.forEach((_, i) => {
    const dot = document.createElement("div");
    if(i === 0) dot.classList.add("active");
    indicators.appendChild(dot);
  });
  document.querySelector(".carousel").appendChild(indicators);

  function showSlide(index){
    items.forEach((el, i) => el.classList.toggle("active", i === index));
    indicators.querySelectorAll("div").forEach((d,i)=>d.classList.toggle("active", i===index));
  }

  function nextSlide(){
    carouselIndex = (carouselIndex + 1) % items.length;
    showSlide(carouselIndex);
  }

  setInterval(nextSlide, 3000);
  showSlide(0);
}

// -------------------- INITIALIZE --------------------
updateTopBalance();
renderMain();
renderIdeas();
renderLikes();
renderProfileHistory();
renderPayments();
populateModels("image");
renderProfile();
initCarousel();
};

  history.unshift(newItem);

  // сразу в историю (без модерации)
  renderProfileHistory();

  closeCreate();
  alert("Генерация создана и добавлена в историю.");
}

// INITIALIZE
updateTopBalance();
renderMain();
renderIdeas();
renderLikes();
renderProfileHistory();
renderPayments();
populateModels("image");














