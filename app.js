const tg = Telegram.WebApp;
tg.ready();

lucide.createIcons();

/* MODELS */
const IMAGE_MODELS = [
  { id: 'nano', name: 'Nano Banana · 5 кр' },
  { id: 'nano_pro', name: 'Nano Banana Pro · 15 кр' },
  { id: 'gpt15', name: 'GPT 1.5 · 15 кр' }
];

const VIDEO_MODELS = [
  { id: 'veo', name: 'Veo 3.1 · 250 кр' },
  { id: 'sora', name: 'Sora 2 · 25 кр' },
  { id: 'kling', name: 'Kling 2.6 · 50 кр' }
];

let currentType = 'image';

function switchPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function openCreate() {
  document.getElementById('createModal').style.display = 'block';
  setType('image');
}

function closeCreate() {
  document.getElementById('createModal').style.display = 'none';
}

function setType(type) {
  currentType = type;

  document.querySelectorAll('.toggle button').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');

  document.getElementById('videoOptions').classList.toggle('hidden', type !== 'video');
  document.getElementById('imageUpload').classList.toggle('hidden', type !== 'image');

  renderModels();
}

function renderModels() {
  const select = document.getElementById('modelSelect');
  select.innerHTML = '';

  const models = currentType === 'image' ? IMAGE_MODELS : VIDEO_MODELS;
  models.forEach(m => {
    const o = document.createElement('option');
    o.value = m.id;
    o.textContent = m.name;
    select.appendChild(o);
  });
}

function generate() {
  const data = {
    type: currentType,
    model: document.getElementById('modelSelect').value,
    prompt: document.getElementById('prompt').value
  };

  tg.sendData(JSON.stringify(data));
  closeCreate();
  tg.showAlert('Запрос отправлен 🚀');
}
