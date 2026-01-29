/* Общие стили */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: linear-gradient(to bottom, #0a0a1e, #000);
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  min-height: 100vh;
  overflow-x: hidden;
}

.app {
  max-width: 480px;
  margin: 0 auto;
  padding-bottom: 80px; /* место для bottom-nav */
}

/* TOPBAR */
.topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(10, 10, 30, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 212, 255, 0.15);
}

.logo img {
  width: 160px; /* Увеличил лого (было меньше) */
  height: auto;
}

.top-right .diamond-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #00d4ff22, #0077ff22);
  border: 1px solid #00d4ff44;
  border-radius: 999px;
  padding: 8px 14px;
  color: #00d4ff;
  font-weight: 600;
  font-size: 15px;
  box-shadow: 0 0 12px rgba(0, 212, 255, 0.3);
  transition: all 0.2s;
}

.diamond-btn:active {
  transform: scale(0.96);
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.6);
}

.diamond-icon {
  width: 20px;
  height: 20px;
  fill: #00d4ff;
}

/* HERO / БАННЕР на главной */
.hero {
  margin: 70px 16px 24px; /* отступ от topbar */
  background: linear-gradient(135deg, #00b4d8, #0077b6);
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 10px 40px rgba(0, 180, 216, 0.4);
  animation: glow 4s infinite alternate;
  cursor: pointer; /* можно кликать по баннеру */
}

.hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 70%, rgba(255,255,255,0.15), transparent 60%);
  pointer-events: none;
}

/* Если хочешь свою фоновую картинку — раскомментируй и замени URL */
.hero {
  /* background-image: url('banner-bg.jpg'); */
  background-size: cover;
  background-position: center;
}

.hero-text {
  padding: 32px 24px;
  text-align: center;
  position: relative;
  z-index: 2;
}

.hero-text h1 {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 12px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.6);
}

.hero-text p {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 24px;
}

.hero-btn {
  background: white;
  color: #0077b6;
  border: none;
  font-size: 18px;
  font-weight: 700;
  padding: 16px 40px;
  border-radius: 999px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  transition: all 0.25s;
}

.hero-btn:active {
  transform: scale(0.96);
  box-shadow: 0 2px 12px rgba(0,0,0,0.4);
}

/* СЕТКА (галерея) */
.section-header {
  padding: 0 16px;
  margin: 24px 0 12px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #e0e0ff;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 0 16px;
  margin-bottom: 80px;
  position: relative;
}

.grid::after {
  content: "";
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 60px;
  background: radial-gradient(ellipse at center, rgba(0, 212, 255, 0.25) 0%, transparent 70%);
  filter: blur(20px);
  pointer-events: none;
}

.grid-item {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  transition: all 0.25s;
  aspect-ratio: 1 / 1;
}

.grid-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.grid-item .like {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: rgba(0,0,0,0.6);
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.grid-item .like svg {
  width: 16px;
  height: 16px;
  fill: #ff4d4d;
}

/* BOTTOM NAV */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: rgba(10, 10, 30, 0.92);
  backdrop-filter: blur(16px);
  border-top: 1px solid rgba(0, 212, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 99;
}

.nav-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #aaa;
  font-size: 11px;
  font-weight: 500;
  transition: all 0.2s;
}

.nav-btn.active {
  color: #00d4ff;
  text-shadow: 0 0 12px #00d4ff80;
}

.nav-btn svg {
  width: 26px;
  height: 26px;
  fill: currentColor;
  filter: brightness(0.8);
  transition: all 0.2s;
}

.nav-btn.active svg {
  filter: brightness(1.3) drop-shadow(0 0 8px #00d4ff);
}

.create-btn {
  width: 64px;
  height: 64px;
  margin-top: -32px;
  background: linear-gradient(135deg, #00d4ff, #0077ff);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 11px;
  box-shadow: 0 8px 30px rgba(0, 212, 255, 0.5);
  transition: all 0.25s;
}

.create-btn:active {
  transform: scale(0.92);
  box-shadow: 0 4px 20px rgba(0, 212, 255, 0.7);
}

/* MODAL */
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-inner {
  background: #1a1a2e;
  border-radius: 24px;
  width: 100%;
  max-width: 420px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.7);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #ffffff0f;
}

.modal-title {
  font-size: 22px;
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  color: #aaa;
  font-size: 32px;
  cursor: pointer;
}

.modal-body {
  padding: 24px;
}

.tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.tab {
  flex: 1;
  padding: 12px;
  background: #25253a;
  border-radius: 12px;
  text-align: center;
  font-weight: 600;
  transition: all 0.2s;
}

.tab.active {
  background: linear-gradient(135deg, #00d4ff, #0077ff);
  color: white;
}

.field {
  margin-bottom: 20px;
}

.field label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #ccc;
}

.field select,
.field textarea,
.field input[type="file"] {
  width: 100%;
  padding: 14px;
  background: #25253a;
  border: 1px solid #ffffff0f;
  border-radius: 12px;
  color: white;
  font-size: 16px;
}

.hint {
  margin-top: 8px;
  font-size: 13px;
  color: #00d4ff;
}

/* Анимации */
@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(0, 180, 216, 0.4); }
  50% { box-shadow: 0 0 40px rgba(0, 180, 216, 0.7); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
}






