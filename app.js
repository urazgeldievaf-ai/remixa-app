const modelSelect = document.getElementById('model');
const generateBtn = document.getElementById('generateBtn');

modelSelect.addEventListener('change', () => {
  const price = modelSelect.value;
  generateBtn.textContent = `Сгенерировать · ${price} ₽`;
});

