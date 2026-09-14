const scene = document.querySelector('#scene');
const effects = document.querySelector('#effects');
const assets = { intro: 'image/anh ny.jpg', memory: 'image/image.png', apology: 'image/anh xinh gai.jpg', birthday: 'image/happy.jpg', gift: 'image/qua sn.jpg', video: 'image/video trêu khi ngủ.mp4' };
let current = 0;
let busy = false;
let accepted = false;
let proposalAccepted = false;
let refusals = 0;
let revealTimer;
const photo = (src, caption, alt) => `<div class="photo-wrap"><div class="polaroid"><div class="photo-window"><img src="${src}" alt="${alt}" decoding="async"></div><p class="photo-caption">${caption}</p></div><span class="spark" aria-hidden="true">✧</span><span class="doodle" aria-hidden="true">♡</span></div>`;
const next = (label) => `<button class="primary" data-action="next">${label}<span class="arrow" aria-hidden="true">→</span></button>`;

function markup(index) {
  switch(index) {
    case 0: return `<section class="screen intro"><p class="eyebrow">Một lời nhắn nhỏ</p>${photo(assets.intro, 'my favorite person ♡', 'Ánh nhỏ, người anh thương')}<span class="tiny-heart" aria-hidden="true">♡</span><h1>Ánh nhỏ <em>iuuuuu</em> ❤️</h1><p class="copy">Anh có một chuyện muốn nói với em…</p>${next('Xem tiếp 💌')}<p class="whisper">dành một chút thời gian cho anh nhé</p></section>`;
    case 1: return `<section class="screen memory"><p class="eyebrow">Những điều anh giữ trong tim</p>${photo(assets.memory, 'a moment to remember', 'Một kỷ niệm đáng yêu')}<h2>Nhớ lúc này <em>không em?</em></h2><p class="copy">Có những khoảnh khắc nhìn lại vẫn thấy đáng yêu ghê 😌</p>${next('Tiếp tục ❤️')}</section>`;
    case 2: return `<section class="screen"><p class="eyebrow">Một chút đáng yêu khác…</p><div class="video-frame"><video muted playsinline loop controls preload="metadata" aria-label="Video trêu khi ngủ"><source src="${assets.video}" type="video/mp4"></video><div class="video-tools"><button class="secondary" data-action="sound">Bật âm thanh ♫</button><button class="secondary" data-action="play" hidden>Phát video ▷</button></div><p class="response" id="video-status" role="status"></p></div><h2>Đừng giận anh <em>nha 🤭</em></h2><p class="copy">Nhưng mà có những lúc… nhìn cũng hơi buồn cười 🤭</p>${next('Rồi rồi, tiếp tục 😆')}</section>`;
    case 3: return `<section class="screen apology"><p class="eyebrow">Anh có điều này muốn nói</p>${photo(assets.apology, 'still my favorite, always.', 'Ánh xinh gái')}<h2>Anh xin lỗi em <em>nha 🥺</em></h2><p class="copy">Em tha lỗi cho anh được không?</p><p class="response" id="response" role="status" aria-live="polite"></p><div class="choices"><button class="primary yes" data-action="yes">Có ❤️</button><button class="secondary no" data-action="no">Không 😤</button></div></section>`;
    case 4: return `<section class="screen birthday"><p class="eyebrow">Surprise! Hôm nay là ngày của em</p>${photo(assets.birthday, 'make a wish, my love ✧', 'Khoảnh khắc chúc mừng sinh nhật Ánh')}<h1>Happy Birthday<br><em>Ánh nhỏ iuuuuu</em> 🎂❤️</h1><div class="date-row"><span class="date">15 / 09</span><span class="age">23 tuổi 🎉</span></div><div class="wishes"><p>Chúc mừng sinh nhật tuổi 23 của em ❤️</p><p>Chúc em tuổi mới luôn vui vẻ, xinh đẹp, hạnh phúc và gặp thật nhiều điều tốt đẹp.</p><p>Và đặc biệt…</p><p>bớt giận anh một chút nha 😌❤️</p></div>${next('Còn một lời nữa 💌')}</section>`;
    case 5: return `<section class="screen ending"><p class="eyebrow">Điều anh muốn nói nhất</p>${photo(assets.intro, 'you & me, and all the little things.', 'Ánh nhỏ iuuuuu')}<span class="tiny-heart" aria-hidden="true">♡</span><h2>Cảm ơn em vì đã xuất hiện trong <em>cuộc đời anh</em> ❤️</h2><p class="copy proposal-question">Làm người yêu anh nhé? 🥺❤️</p><p class="response" id="response" role="status" aria-live="polite"></p><div class="choices"><button class="primary yes" data-action="yes">Có ❤️</button><button class="secondary no" data-action="no">Không 😤</button></div><p class="whisper">thương em, hôm nay và cả những ngày sau.</p></section>`;
    case 6: return `<section class="screen gift"><p class="eyebrow">Một món quà nhỏ dành cho em</p>${photo(assets.gift, 'for you, with all my love ♡', 'Quà sinh nhật dành cho Ánh')}<h2>Quà sinh nhật <em>của em nè</em> 🎁❤️</h2><p class="copy">Happy Birthday, Ánh nhỏ iuuuuu 🎂</p><button class="primary" data-action="restart">Xem lại từ đầu ❤️ <span class="arrow" aria-hidden="true">↺</span></button><p class="whisper">thương em, hôm nay và cả những ngày sau.</p></section>`;
  }
}

function render() {
  scene.innerHTML = markup(current);
  scene.querySelectorAll('img').forEach(img => img.addEventListener('error', () => {
    const fallback = document.createElement('span');
    fallback.className = 'media-error';
    fallback.textContent = 'Khoảnh khắc của chúng mình ♡';
    img.replaceWith(fallback);
  }, { once: true }));
  if (current === 2) {
    const video = scene.querySelector('video');
    const play = scene.querySelector('[data-action="play"]');
    video.play().catch(() => { if (video.isConnected) play.hidden = false; });
    video.addEventListener('volumechange', () => { scene.querySelector('[data-action="sound"]').textContent = video.muted ? 'Bật âm thanh ♫' : 'Tắt âm thanh ♫'; });
    video.querySelector('source').addEventListener('error', () => { document.querySelector('#video-status').textContent = 'Video chưa mở được, em vẫn có thể xem tiếp nhé.'; });
  }
  const heading = scene.querySelector('h1, h2');
  heading.tabIndex = -1;
  if (current > 0) heading.focus({ preventScroll: true });
  const upcoming = [assets.memory, assets.apology, assets.apology, assets.birthday, assets.intro, assets.gift][current];
  if (upcoming) { const img = new Image(); img.src = upcoming; }
}

async function go(index) {
  if (busy || (index >= 4 && !accepted) || (index === 6 && !proposalAccepted)) return;
  busy = true;
  scene.querySelector('video')?.pause();
  scene.classList.add('leaving');
  await new Promise(resolve => setTimeout(resolve, 300));
  current = index;
  refusals = 0;
  render();
  window.scrollTo({ top: 0, behavior: 'instant' });
  scene.classList.remove('leaving');
  busy = false;
  if (current === 4) { document.title = 'Happy Birthday Ánh nhỏ 🎂'; celebrate(); }
}

function dodge() {
  refusals++;
  const messages = ['Em chắc chưa? 🥺', 'Suy nghĩ lại đi mà 🥺', 'Nút Có đang đẹp hơn đấy 😌', 'Không cho chọn Không nữa 😌❤️'];
  document.querySelector('#response').textContent = messages[Math.min(refusals - 1, 3)];
  const yes = scene.querySelector('.yes');
  const no = scene.querySelector('.no');
  const area = scene.querySelector('.choices');
  yes.style.width = `${Math.min(46 + refusals * 10, 100)}%`;
  yes.style.height = `${Math.min(50 + refusals * 8, 84)}px`;
  yes.style.fontSize = `${Math.min(12 + refusals * 2, 24)}px`;
  if (refusals === 1) { no.style.left = '60%'; no.style.width = '40%'; return; }
  no.style.width = '100px';
  no.style.height = '44px';
  const room = Math.max(0, area.clientWidth - 100);
  // Alternate sides with bounded jitter; both endpoints remain inside the story.
  const x = refusals % 2 === 0 ? room * .08 : room * .92;
  no.style.left = `${x}px`;
  no.style.top = '100px';
}

function celebrate() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (let i = 0; i < 65; i++) {
    const particle = document.createElement('span');
    particle.className = `particle${i % 5 ? ' confetti' : ''}`;
    particle.textContent = i % 5 ? '' : '♡';
    particle.style.cssText = `left:${Math.random()*100}%;--duration:${2.5+Math.random()*2}s;--delay:${Math.random()*.8}s;--drift:${Math.random()*120-60}px;--color:${['#b85c72','#e9bac1','#cfb28e','#e7d6bd'][i%4]}`;
    effects.append(particle);
    particle.addEventListener('animationend', () => particle.remove(), { once: true });
  }
}

scene.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button || busy) return;
  const action = button.dataset.action;
  if (action === 'next') go(current + 1);
  const canChoose = (current === 3 && !accepted) || (current === 5 && !proposalAccepted);
  if (action === 'no' && canChoose) dodge();
  if (action === 'yes' && canChoose) {
    const destination = current === 3 ? 4 : 6;
    if (current === 3) accepted = true;
    else proposalAccepted = true;
    scene.querySelectorAll('.choices button').forEach(b => b.disabled = true);
    document.querySelector('#response').textContent = '';
    scene.querySelector('.choices').innerHTML = '<div class="success" role="status">Yeahhhhh ❤️</div>';
    celebrate();
    revealTimer = setTimeout(() => go(destination), 1250);
  }
  if (action === 'restart') {
    clearTimeout(revealTimer);
    accepted = false;
    proposalAccepted = false;
    refusals = 0;
    effects.replaceChildren();
    document.title = 'Gửi Ánh nhỏ ♡';
    go(0);
  }
  if (action === 'sound') { const v = scene.querySelector('video'); v.muted = !v.muted; }
  if (action === 'play') {
    scene.querySelector('video').play().then(() => button.hidden = true).catch(() => { document.querySelector('#video-status').textContent = 'Em thử nút phát trên video nhé.'; });
  }
});
window.addEventListener('resize', () => {
  const no = scene.querySelector('.no');
  if (no && refusals >= 2) no.style.left = `${Math.min(parseFloat(no.style.left) || 0, Math.max(0, scene.querySelector('.choices').clientWidth - 100))}px`;
});
render();
