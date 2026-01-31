// -------------------- DATA --------------------
const models = {
  image: [
    { id: "nano", name: "Нано Банана", price: 5, hint: "Быстро и доступно" },
    { id: "nano_pro", name: "Нано Банана Про", price: 15, hint: "Высокая детализация, чуть дольше" },
    { id: "gpt15", name: "GPT 1.5", price: 15, hint: "Умный и креативный" }
  ],
  video: [
    { id: "veo_fast", name: "Veo 3.1 (быстрая)", price: 60, hint: "Быстрая генерация ~8 сек", duration: 8, fields: ["start_frame", "end_frame", "prompt", "aspect"] },
    { id: "veo", name: "Veo 3.1", price: 250, hint: "Максимальное качество ~8 сек", duration: 8, fields: ["start_frame", "end_frame", "prompt", "aspect"] },
    { id: "sora2", name: "Sora 2", price: 50, hint: "~8 сек, креативные видео", duration: 8, fields: ["start_frame", "prompt", "aspect"] },
    { id: "sora_pro", name: "Sora 2 Про", price: 135, hint: "Киношное качество до 15 сек, генерация долгая", duration: 15, fields: ["start_frame", "prompt", "aspect"] },
    { id: "kling26", name: "Клинг 2.6", price: 50, hint: "Стабильные видео, выбор длительности", durationOptions: [5, 10], fields: ["photo", "prompt", "aspect", "duration", "sound"] },
    { id: "kling_motion", name: "Клинг Моушн Контрол", price: 100, hint: "Повтори движение из видео, выбор версии", versionOptions: [{name: "Быстрая", price: 45}, {name: "Качественная", price: 65}], fields: ["photo", "motion_video", "aspect", "version"] }
  ]
};
let balance = 14125;
let refIncome = 0;
let likes = [];
let history = [];
let published = [
  { id: "1", title: "Красивый закат", category: "new", model: "Нано Банана", likes: 12, img: "https://picsum.photos/400/300?random=1", type: "image", status: "approved", hiddenPrompt: false },
  { id: "2", title: "Город ночью", category: "trend", model: "Нано Банана Про", likes: 25, img: "https://picsum.photos/400/300?random=2", type: "image", status: "pending", hiddenPrompt: false }
];
let payments = [
  { id: 1, date: "20.01.2026", amount: 500, status: "Пополнение" },
  { id: 2, date: "22.01.2026", amount: 1000, status: "Пополнение" }
];
let currentCategory = "new";
let currentProfileSub = "user";
let carouselIndex = 0;
let carouselInterval = null;

// -------------------- UI --------------------
function switchPage(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(`page-${page}`).classList.add("active");
  document.querySelectorAll(".bottom-nav .nav-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelector(`.bottom-nav button[data-page="${page}"]`)?.classList.add("active");
}
function setProfileSub(sub){
  currentProfileSub = sub;
  document.querySelectorAll(".profile-tabs .tab").forEach(t => t.classList.remove("active"));
  document.querySelector(`.profile-tabs .tab[data-sub="${sub}"]`)?.classList.add("active");
  document.querySelectorAll(".profile-subpage").forEach(p => p.style.display = "none");
  document.getElementById(`profile-${sub}`).style.display = "block";
}
function openWallet() {
  alert("Кошелёк: пока заглушка (в будущем добавим оплату)");
}
function updateTopBalance(){
  document.getElementById("balanceTop").textContent = balance.toLocaleString() + " 💎";
  document.getElementById("balanceTotal").textContent = `${balance.toLocaleString()} 💎`;
  document.getElementById("refIncome").textContent = `${refIncome.toLocaleString()} 💎`;
}
function topUp(){
  balance += 50;
  payments.unshift({ id: Date.now(), date: new Date().toLocaleDateString(), amount: 50, status: "Пополнение" });
  updateTopBalance();
  renderPayments();
  alert("Баланс пополнен на 50💎");
}
function topUpAmount(amount){
  balance += amount;
  payments.unshift({ id: Date.now(), date: new Date().toLocaleDateString(), amount, status: "Пополнение" });
  updateTopBalance();
  renderPayments();
  alert(`Баланс пополнен на ${amount} 💎`);
}
function copyRef(id="refLink"){
  const input = document.getElementById(id);
  input.select();
  document.execCommand("copy");
  alert("Ссылка скопирована");
}
function createCard(item, showStatus = false){
  let statusIcon = '';
  if (showStatus && item.status) {
    if (item.status === 'pending') statusIcon = '<span style="position:absolute;left:8px;top:8px;background:yellow;color:black;padding:2px 6px;border-radius:4px;font-size:10px;">На модерации</span>';
    else if (item.status === 'approved') statusIcon = '<span style="position:absolute;left:8px;top:8px;background:green;color:white;padding:2px 6px;border-radius:4px;font-size:10px;">Прошло</span>';
    else if (item.status === 'rejected') statusIcon = '<span style="position:absolute;left:8px;top:8px;background:red;color:white;padding:2px 6px;border-radius:4px;font-size:10px;">Не прошло</span>';
  }
  return `
    <div class="card" onclick="openCreateModal('${item.type}', '${item.id}')">
      <div style="position:relative;">
        ${statusIcon}
        <img src="${item.img}" alt="idea" />
      </div>
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
  items.forEach(i => grid.innerHTML += createCard(i, false));
  startCarousel();
}
function renderIdeas(){
  const grid = document.getElementById("ideas-grid");
  grid.innerHTML = "";
  const items = published.filter(i => i.category === currentCategory || currentCategory === "new");
  if(items.length === 0){
    grid.innerHTML = `<div class="empty-text">Пока нет идей в этой категории!</div>`;
    return;
  }
  items.forEach(i => grid.innerHTML += createCard(i, false));
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
    if(item) grid.innerHTML += createCard(item, false);
  });
}
function renderProfileHistory(){
  const grid = document.getElementById("profile-history");
  grid.innerHTML = "";
  if(history.length === 0){
    grid.innerHTML = `<div class="empty-text">Скоро здесь будут твои генерации ✨</div>`;
    return;
  }
  history.forEach(i => grid.innerHTML += createCard(i, true));
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

// -------------------- CREATE MODAL --------------------
function openCreateModal(type="image", fromId=null){
  document.getElementById("create-modal").style.display = "flex";
  setType(type);
  if(fromId){
    const item = published.find(p => p.id === fromId) || history.find(p => p.id === fromId);
    if(item){
      document.getElementById("prompt").value = item.prompt || item.title;
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

// -------------------- FORM FIELDS DYNAMIC --------------------
function updateFormFields() {
  const modelId = document.getElementById("model").value;
  const type = document.querySelector(".tab.active").dataset.type;
  const model = models[type].find(m => m.id === modelId);
  if (!model) return;

  const extraFields = document.querySelectorAll('.extra-field');
  extraFields.forEach(f => f.remove());

  const promptField = document.querySelector('#prompt').parentElement;
  const container = promptField.parentElement;

  const aspectDiv = document.createElement('div');
  aspectDiv.className = 'field extra-field';
  aspectDiv.innerHTML = `
    <label>Пропорции</label>
    <select id="aspect-ratio">
      <option value="1:1">Квадрат (1:1)</option>
      <option value="16:9">Широкоэкранный (16:9)</option>
      <option value="9:16">Вертикальный (9:16)</option>
      <option value="4:3">4:3</option>
      <option value="3:4">3:4</option>
    </select>
  `;
  container.insertBefore(aspectDiv, promptField.nextSibling);

  model.fields.forEach(field => {
    let labelText = '';
    let inputHtml = '';

    if (field === 'start_frame' || field === 'end_frame' || field === 'photo') {
      labelText = field === 'start_frame' ? 'Начальный кадр (по желанию)' :
                  field === 'end_frame' ? 'Конечный кадр (по желанию)' :
                  'Фото/видео (по желанию)';
      inputHtml = `<input type="file" id="${field}-upload" accept="image/*,video/*">`;
    } else if (field === 'prompt') {
      return;
    } else if (field === 'duration') {
      labelText = 'Длительность';
      inputHtml = `<select id="duration">${model.durationOptions.map(d => `<option value="${d}">${d} секунд</option>`).join('')}</select>`;
    } else if (field === 'sound') {
      labelText = 'Добавить звук';
      inputHtml = `<select id="sound"><option value="no">Без звука</option><option value="yes">Со звуком</option></select>`;
    } else if (field === 'version') {
      labelText = 'Версия';
      inputHtml = `<select id="version">${model.versionOptions.map(v => `<option value="${v.price}">${v.name} (${v.price}💎)</option>`).join('')}</select>`;
    } else if (field === 'motion_video') {
      labelText = 'Видео-пример движения';
      inputHtml = `<input type="file" id="motion-video" accept="video/*">`;
    }

    if (inputHtml) {
      const div = document.createElement('div');
      div.className = 'field extra-field';
      div.innerHTML = `<label>${labelText}</label>${inputHtml}`;
      container.insertBefore(div, promptField.nextSibling);
    }
  });
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
  let finalPrice = model.price;
  if (model.id === "kling_motion") {
    const versionSelect = document.getElementById("version");
    if (versionSelect) finalPrice = Number(versionSelect.value);
  }
  if(balance < finalPrice){
    alert("Недостаточно средств. Пополните баланс.");
    return;
  }
  balance -= finalPrice;
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
    img: `https://picsum.photos/400/300?random=${id}`,
    status: "pending",
    hiddenPrompt: false
  };
  history.unshift(newItem);
  renderProfileHistory();

  const afterGenerate = document.createElement('div');
  afterGenerate.style.marginTop = "16px";
  afterGenerate.innerHTML = `
    <button class="small-btn" onclick="publishToIdeas('${id}')">Выложить в идеи (модерация)</button>
    <button class="small-btn" onclick="saveToProfile('${id}')">Сохранить в профиль</button>
    <label style="display:block;margin-top:8px;">
      <input type="checkbox" id="hidePrompt_${id}"> Скрыть промпт от других пользователей
    </label>
  `;
  document.querySelector('.modal-body').appendChild(afterGenerate);
  closeCreate();
}

// -------------------- PUBLISH & STATUS --------------------
function publishToIdeas(id) {
  const item = history.find(i => i.id === id);
  if (!item) return;
  const hidePrompt = document.getElementById(`hidePrompt_${id}`).checked;
  item.hiddenPrompt = hidePrompt;
  item.status = "pending";
  published.push(item);
  renderIdeas();
  alert("Работа отправлена на модерацию!");
}
function saveToProfile(id) {
  const item = history.find(i => i.id === id);
  if (!item) return;
  item.status = "approved";
  renderProfileHistory();
  alert("Сохранено в профиль!");
}

// -------------------- CAROUSEL --------------------
function startCarousel(){
  const slides = document.querySelectorAll(".carousel-item");
  const indicators = document.querySelectorAll(".carousel-indicators .indicator");
  if (slides.length === 0) return;
  carouselIndex = 0;
  showSlide(carouselIndex);
  const carousel = document.querySelector('.carousel');
  if (carousel) {
    carousel.addEventListener('scroll', () => {
      const scrollPosition = carousel.scrollLeft;
      const itemWidth = carousel.offsetWidth;
      const currentIndex = Math.round(scrollPosition / itemWidth);
      indicators.forEach((ind, i) => {
        ind.classList.toggle('active', i === currentIndex);
      });
    });
  }
}
function showSlide(index){
  const slides = document.querySelectorAll(".carousel-item");
  const indicators = document.querySelectorAll(".carousel-indicators .indicator");
  slides.forEach((s, i) => s.classList.toggle('active', i === index));
  indicators.forEach((ind, i) => ind.classList.toggle('active', i === index));
  carouselIndex = index;
}

// -------------------- INIT --------------------
updateTopBalance();
renderMain();
renderIdeas();
renderLikes();
renderProfileHistory();
renderPayments();
populateModels("image");






