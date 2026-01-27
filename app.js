const tg = Telegram.WebApp;
tg.ready();

const userId = tg.initDataUnsafe.user.id;
const refLink = `https://t.me/remixa_bot?start=ref_${userId}`;

let galleryData = [
    { id: 1, src: 'https://i.imgur.com/robot-girl.jpg', likes: 2600, category: 'fantasy', prompt: 'Cyberpunk girl' },
    { id: 2, src: 'https://i.imgur.com/tiger.jpg', likes: 3100, category: 'animals', prompt: 'White tiger' },
    { id: 3, src: 'https://i.imgur.com/blue-car.jpg', likes: 5100, category: 'vehicles', prompt: 'Tesla storm' },
    { id: 4, src: 'https://i.imgur.com/castle.jpg', likes: 5100, category: 'fantasy', prompt: 'Floating castle' },
    // Добавь свои изображения
];

let saved = JSON.parse(localStorage.getItem('saved') || '[]');

const categories = ['НОВЫЕ', 'ТРЕНДЫ', 'Женское', 'Мужское', 'Дети', 'Семейное', '14 февраля', '23 февраля', '8 марта', 'Исторический', 'Фэнтези', 'Пара'];

function switchPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(page).classList.add('active');

    document.querySelectorAll('.bottom-nav button').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.bottom-nav button[data-page="${page}"]`)?.classList.add('active');
}

function renderCategories() {
    const container = document.getElementById('categories');
    container.innerHTML = '';
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.textContent = cat;
        btn.onclick = () => filterCategory(cat);
        container.appendChild(btn);
    });
}

function renderGallery(container, data) {
    const el = document.getElementById(container);
    el.innerHTML = '';
    data.forEach(item => {
        const div = document.createElement('div');
        div.innerHTML = `
            <img src="${item.src}" alt="Idea">
            <span>♥ ${item.likes}k</span>
        `;
        div.onclick = () => openCreate(item.src, item.prompt);
        el.appendChild(div);
    });
}

function searchIdeas() {
    const query = document.getElementById('search').value.toLowerCase();
    const filtered = galleryData.filter(item => item.prompt.toLowerCase().includes(query));
    renderGallery('gallery', filtered);
}

function openCreate(src = '', prompt = '') {
    document.getElementById('create-modal').style.display = 'block';
    if (src) {
        // Здесь можно показать загруженное фото (добавь <img> в модалку)
    }
    document.getElementById('prompt').value = prompt;
}

function closeModal() {
    document.getElementById('create-modal').style.display = 'none';
}

function generate() {
    const prompt = document.getElementById('prompt').value;
    const hide = document.getElementById('hide-prompt').checked;
    const model = document.getElementById('model').value;
    tg.sendData(JSON.stringify({ type: 'generate', prompt, hide, model }));
    closeModal();
    tg.showAlert('Запрос отправлен в бот!');
}

function showModelTips() {
    const model = document.getElementById('model').value;
    const tip = document.getElementById('model-tip');
    const tips = {
        'veo_fast': 'Veo 3.1 Fast — быстро и дешевле, но качество чуть ниже',
        'veo': 'Veo 3.1 — максимальное качество, но дольше и дороже',
        'sora2': 'Sora 2 — отличное видео из текста или фото',
        'sora2pro': 'Sora 2 Pro — топ-качество, длительность 10–15 сек, генерация может занять 2–3 часа',
        'kling26': 'Kling 2.6 — хороший баланс цены и качества',
        'klingv2pro': 'Kling v2 Pro — требует начальный и конечный кадры',
        'klingmotion': 'Motion Control — повтори движение из видео'
    };
    tip.textContent = tips[model] || '';
}

function toggleOptions() {
    const type = document.getElementById('content-type').value;
    document.getElementById('video-options').style.display = type === 'video' ? 'block' : 'none';
}

function init() {
    renderCategories();
    renderGallery('gallery', galleryData);
    renderGallery('saved', saved);
    document.getElementById('ref-link').value = `t.me/remixa_bot?start=ref_${userId}`;
    switchPage('main');
}

init();
