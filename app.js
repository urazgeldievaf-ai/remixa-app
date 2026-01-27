const tg = Telegram.WebApp;
tg.ready();

// -------------------- DATA --------------------
const models = {
  image: [
    { id: "nano", name: "Nano Banana", price: 5, hint: "Быстрое и дешёвое. Отлично для простых картинок." },
    { id: "nano_pro", name: "Nano Banana Pro", price: 15, hint: "Лучше детализация и свет." },
    { id: "gpt15", name: "GPT 1.5", price: 15, hint: "Лучше для сложных сцен и людей." }
  ],
  video: [
    { id: "veo_fast", name: "Veo 3.1 Fast", price: 65, hint: "Быстрое видео. Низкая стоимость." },
    { id: "veo", name: "Veo 3.1", price: 250, hint: "Максимальное качество. Дольше." },
    { id: "sora2", name: "Sora 2", price: 25, hint: "Видео из текста или фото." },
    { id: "sora2pro", name: "Sora 2 Pro", price: 135, hint: "Видео 10–15 сек. Может занять до 2–3 часов." },
    { id: "kling26", name: "Kling 2.6", price: 50, hint: "Хороший баланс качества и цены." },
    { id: "klingv2pro", name: "Kling v2 Pro", price: 150, hint: "Нужны начальный и конечный кадры." },
    { id: "klingmotion", name: "Kling 2.6 Motion", price: 50, hint: "Нужны 2 изображения + промпт. Стандарт/Про." }
  ]
};

let balance = 0;
let invited = 0;
let earned = 0;

let history = [];
let published = [];
let likes = [];

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

function topUp() {
  balance += 50;
  updateProfile();
  alert("Баланс пополнен на 50₽");
}

function copyRef() {
  const input = document.getElementById("ref-link");
  input.select();
  document.execCommand("copy");
  alert("Ссылка скопирована");
}

function updateProfile() {
  document.getElementById("balance").textContent = balance;
  document.getElementById("invited").textContent = invited;
  document.getElementById("earned").textContent = earned;
}

function renderGallery() {
  const main = document.getElementById("main-gallery");
  main.innerHTML = "";

  published.slice(0, 6).forEach(item => {
    main.innerHTML += createCard(item);
  });

  renderLikes();
  renderIdeas();
  renderProfile();
}

function createCard(item) {
  const liked = likes.includes(item.id);
  return `
    <div class="card" onclick="openCreateModal('${item.type}', '${item.id}')">
      <img src="${item.img}" alt="idea" />
      <div class="info">
        <div class="title">${item.title}</div>
        <div class="meta">
          <div>${item.model}</div>
          <div class="like">
            <svg viewBox="0 0 24 24"><path d="M12 21s-7.2-4.8-9.3-9.4C1.2 8.4 2.7 5.5 5.5 4.2c1.9-.9 4-.2 5.5 1.3 1.5-1.5 3.6-2.2 5.5-1.3 2.8 1.3 4.3 4.2 2.8 7.4C19.2 16.2 12 21 12 21z"/></svg>
            <span>${item.likes}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderIdeas() {
  const search = document.getElementById("ideas-search").value.toLowerCase();
  const container = document.getElementById("ideas-gallery");
  container.innerHTML = "";

  published
    .filter(i => i.title.toLowerCase().includes(search))
    .forEach(item => container.innerHTML += createCard(item));
}

function renderLikes() {
  const container = document.getElementById("likes-gallery");
  container.innerHTML = "";

  likes.forEach(id => {
    const item = published.find(p => p.id === id);
    if (item) container.innerHTML += createCard(item);
  });
}

function renderProfile() {
  const publishedContainer = document.getElementById("profile-published");
  const historyContainer = document.getElementById("profile-history");

  publishedContainer.innerHTML = "";
  historyContainer.innerHTML = "";

  published.forEach(i => publishedContainer.innerHTML += createCard(i));
  history.forEach(i => historyContainer.innerHTML += createCard(i));
}

// -------------------- CREATE MODAL --------------------
function openCreateModal(type = "image", fromId = null) {
  document.getElementById("create-modal").style.display = "flex";
  document.getElementById("content-type").value = type;
  updateModelList();

  if (fromId) {
    const item = published.find(p => p.id === fromId) || history.find(p => p.id === fromId);
    if (item) {
      document.getElementById("prompt").value = item.prompt;
      document.getElementById("hide-prompt").checked = item.hidePrompt;
      document.getElementById("model").value = item.modelId;
    }
  }
}

function closeCreate() {
  document.getElementById("create-modal").style.display = "none";
}

function updateModelList() {
  const type = document.getElementById("content-type").value;
  const select = document.getElementById("model");

  select.innerHTML = "";
  models[type].forEach(m => {
    select.innerHTML += `<option value="${m.id}">${m.name} — ${m.price}₽</option>`;
  });

  document.getElementById("video-options").style.display = type === "video" ? "block" : "none";
  updateGenerateButton();
  updateModelHints();
}

function updateModelHints() {
  const type = document.getElementById("content-type").value;
  const modelId = document.getElementById("model").value;
  const model = models[type].find(m => m.id === modelId);

  document.getElementById("model-hint").textContent = model ? model.hint : "";
  updateGenerateButton();
}

function updateGenerateButton() {
  const type = document.getElementById("content-type").value;
  const modelId = document.getElementById("model").value;
  const model = models[type].find(m => m.id === modelId);

  document.getElementById("generate-text").textContent = type === "image" ? "Сгенерировать" : "Создать видео";
  document.getElementById("generate-price").textContent = model ? `— ${model.price}₽` : "";
}

function generate() {
  const type = document.getElementById("content-type").value;
  const modelId = document.getElementById("model").value;
  const prompt = document.getElementById("prompt").value.trim();
  const hidePrompt = document.getElementById("hide-prompt").checked;

  const model = models[type].find(m => m.id === modelId);

  // validation
  if (!prompt) {
    alert("Пожалуйста, заполните поле «Промпт»");
    return;
  }

  // subtract balance
  if (balance < model.price) {
    alert("Недостаточно средств. Пополните баланс.");
    return;
  }
  balance -= model.price;
  updateProfile();

  const id = Date.now().toString();
  const newItem = {
    id,
    type,
    modelId,
    model: model.name,
    title: prompt.slice(0, 28) + (prompt.length > 28 ? "..." : ""),
    prompt,
    hidePrompt,
    likes: 0,
    img: type === "image" ? "https://picsum.photos/400/300?random=" + id : "https://picsum.photos/400/300?random=" + id,
  };

  history.unshift(newItem);

  // moderation: add to published after check (simulated)
  setTimeout(() => {
    published.unshift(newItem);
    renderGallery();
  }, 2000);

  closeCreate();
  alert("Генерация отправлена на модерацию. После проверки появится в Идеях.");
}

