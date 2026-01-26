const telegramApp = Telegram.WebApp;
telegramApp.ready();

let galleryData = [
    { id: 1, src: 'image1.jpg', likes: 2600, category: 'fantasy', prompt: 'cyberpunk girl' },
    { id: 2, src: 'image2.jpg', likes: 1300, category: 'animals', prompt: 'tiger portrait' },
    { id: 3, src: 'image3.jpg', likes: 5100, category: 'vehicles', prompt: 'blue tesla in storm' },
    { id: 4, src: 'image4.jpg', likes: 5100, category: 'fantasy', prompt: 'floating castle' },
    { id: 5, src: 'image5.jpg', likes: 2600, category: 'portrait', prompt: 'anime girl in snow' },
    { id: 6, src: 'image6.jpg', likes: 2800, category: 'fantasy', prompt: 'red dragon at sunset' },
    { id: 7, src: 'image7.jpg', likes: 2600, category: 'abstract', prompt: 'cosmic eye' },
    { id: 8, src: 'image8.jpg', likes: 4600, category: 'nature', prompt: 'mountain landscape' },
    // Добавь больше данных (или подключи Firebase для динамики)
];

let saved = []; // Сохранённые идеи

function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId + '-page').classList.add('active');
}

function renderGallery(container, data) {
    container.innerHTML = '';
    data.forEach(item => {
        const div = document.createElement('div');
        div.innerHTML = `
            <img src="${item.src}" alt="Idea">
            <span>♥ ${item.likes / 1000}k</span>
        `;
        div.onclick = () => showPrompt(item.prompt);
        container.appendChild(div);
    });
}

function filterCategory(category) {
    const filtered = category === 'all' ? galleryData : galleryData.filter(item => item.category === category);
    renderGallery(document.getElementById('gallery'), filtered);
}

function createIdea() {
    telegramApp.sendData('create_idea');  // Отправляет в бот для генерации
    telegramApp.showAlert('Промпт отправлен в бот для генерации!');
}

function showPrompt(prompt) {
    telegramApp.showConfirm('Повторить генерацию?', (ok) => {
        if (ok) telegramApp.sendData(`repeat_prompt:${prompt}`);
    });
}

function copyRefLink() {
    const input = document.getElementById('ref-link');
    input.select();
    document.execCommand('copy');
    telegramApp.showAlert('Ссылка скопирована!');
}

function showWallet() {
    telegramApp.showAlert('Баланс: 0 RUB. Пополнить через /pay в боте.');
}

function pay() {
    telegramApp.sendData('pay');  // Отправляет в бот для YooKassa
}

function init() {
    renderGallery(document.getElementById('gallery'), galleryData);
    renderGallery(document.getElementById('ideas-gallery'), galleryData);
    renderGallery(document.getElementById('collection-gallery'), saved);
}

init();
