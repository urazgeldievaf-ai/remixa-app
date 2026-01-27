document.querySelectorAll('.create-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.create-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});
