const models = {
  image: [
    { id: "nano", name: "NanoBanana", price: 5, hint: "Дешёвое" },
    { id: "nano_pro", name: "Nanobanana Pro", price: 15, hint: "" },
    { id: "gpt15", name: "GPT 1.5", price: 15, hint: "" }
  ],
  video: [
    { id: "soon", name: "Видео (скоро)", price: 0, hint: "Скоро" }
  ]
};

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

function generate(){
  const type = document.querySelector(".tab.active").dataset.type;
  if(type === "video"){
    alert("Видео пока в разработке");
    return;
  }

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
  alert("Генерация создана.");
}





