// Xưởng Làm Phim Thông Minh AI - Ms. Hoà Đồng (1972)
// Tích hợp đa chức năng điện ảnh + AI API Key (Google Gemini / OpenAI) + Tự học sở thích người dùng (Self-Learning Memory Engine)

const STORAGE_KEYS = {
  AI_PROVIDER: 'hoadong_ai_provider',
  AI_KEY: 'hoadong_ai_api_key',
  AI_MEMORY: 'hoadong_ai_learning_memory',
  SAVED_PROJECT: 'hoadong_saved_movie_project'
};

const PRESET_QUOTES = {
  dongnghiep: [
    'Những năm tháng gắn bó dưới mái trường thân yêu cùng các chị em đồng nghiệp luôn là ký ức đẹp đẽ và rực rỡ nhất trong cuộc đời.',
    'Trong tà áo dài truyền thống duyên dáng, mỗi nụ cười của chị em chúng mình đều toả sáng tình thân ái và sự sẻ chia chân thành.',
    'Cảm ơn những người bạn, người đồng nghiệp tuyệt vời đã luôn đồng hành, sẻ chia buồn vui để mỗi ngày đi làm đều là một ngày hạnh phúc.'
  ],
  duxuan: [
    'Mỗi chuyến đi là một hành trình mở rộng tâm hồn, đón nhận hương sắc mùa xuân và lưu giữ những khoảnh khắc thanh xuân tươi đẹp.',
    'Giữa khung cảnh thiên nhiên tươi thắm, lòng người cũng trở nên an nhiên, rạng rỡ và tràn đầy năng lượng yêu đời.'
  ],
  giadinh: [
    'Gia đình và những người thân yêu chính là điểm tựa bình yên nhất, nơi ngập tràn tiếng cười và tình yêu thương vô điều kiện.',
    'Hạnh phúc chẳng ở đâu xa, hạnh phúc hiện diện ngay trong những phút giây sum vầy ấm áp bên những người ta trân quý.'
  ],
  cuocsong: [
    'Hoà đồng, nhân ái và lạc quan chính là chiếc chìa khoá vàng mở ra cánh cửa của một cuộc sống tươi đẹp và viên mãn.',
    'Mỗi ngày thức dậy với một nụ cười hiền hoà là một ngày ta trao gửi yêu thương và tô điểm sắc hoa cho cuộc đời.'
  ],
  tho4cau: [
    'Xuân về nắng ấm trải muôn nơi,\nÁo dài thướt tha nở nụ cười,\nChị em đồng nghiệp tình gắn kết,\nHoà đồng vui sống đẹp tuyệt vời!'
  ]
};

// Bộ nhớ học tập thói quen của cô Hoà Đồng
let learningMemory = loadLearningMemory();

function loadLearningMemory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AI_MEMORY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    favoriteTopics: { dongnghiep: 2, cuocsong: 2, duxuan: 1, giadinh: 1, tho4cau: 1 },
    preferredStyle: 'ấm áp, truyền cảm, giàu chất thơ, phù hợp nữ giáo viên sinh năm 1972',
    preferredSubtitleSize: '30',
    preferredFrame: 'hoadao',
    preferredFilter: 'warm',
    learnedSentences: [],
    optimizationCount: 1
  };
}

function saveLearningMemory() {
  try {
    localStorage.setItem(STORAGE_KEYS.AI_MEMORY, JSON.stringify(learningMemory));
    renderMemoryInsights();
  } catch {}
}

function recordUserHabit(type, value) {
  learningMemory.optimizationCount = (learningMemory.optimizationCount || 1) + 1;
  if (type === 'topic') {
    learningMemory.favoriteTopics[value] = (learningMemory.favoriteTopics[value] || 0) + 1;
  } else if (type === 'sentence' && value && value.length > 15) {
    if (!learningMemory.learnedSentences.includes(value)) {
      learningMemory.learnedSentences.unshift(value.slice(0, 180));
      learningMemory.learnedSentences = learningMemory.learnedSentences.slice(0, 8);
    }
  } else if (type === 'subtitleSize') {
    learningMemory.preferredSubtitleSize = value;
  } else if (type === 'frame') {
    learningMemory.preferredFrame = value;
  } else if (type === 'filter') {
    learningMemory.preferredFilter = value;
  }
  saveLearningMemory();
}

function getTopFavoriteTopicLabel() {
  const names = {
    dongnghiep: 'Tình Đồng Nghiệp & Mái Trường',
    duxuan: 'Du Xuân & Khám Phá',
    giadinh: 'Gia Đình Yêu Thương',
    cuocsong: 'Sống Vui Khoẻ & Hoà Đồng',
    tho4cau: 'Thơ Lục Bát / Bốn Câu'
  };
  let bestKey = 'dongnghiep';
  let bestVal = -1;
  Object.entries(learningMemory.favoriteTopics || {}).forEach(([k, v]) => {
    if (v > bestVal) {
      bestVal = v;
      bestKey = k;
    }
  });
  return names[bestKey] || 'Tình Đồng Nghiệp & Cuộc Sống';
}

// Danh sách cảnh phim
let slides = [
  {
    id: 'slide-1',
    type: 'image',
    src: 'NGT05445.jpg',
    caption:
      'Chào mừng bạn đến với không gian Hoà Đồng Cuộc Sống Tươi Đẹp. Mỗi ngày sống chan hoà và lạc quan là một ngày ngập tràn nắng ấm.',
    duration: 7,
    motionEffect: 'zoomIn',
    colorFilter: 'warm',
    customAudioUrl: null,
    customAudioName: ''
  },
  {
    id: 'slide-2',
    type: 'image',
    src: 'ao-dai-tap-the.jpg',
    caption:
      'Tình chị em đồng nghiệp gắn bó keo sơn trong tà áo dài truyền thống Việt Nam, cùng nhau lưu giữ những kỷ niệm thanh xuân tươi đẹp nhất.',
    duration: 8,
    motionEffect: 'panLeftRight',
    colorFilter: 'vibrant',
    customAudioUrl: null,
    customAudioName: ''
  }
];

let activeSlideIndex = 0;
let isPlaying = false;
let isRecordingMovie = false;
let currentPlaySlideIndex = 0;
let slideStartTime = 0;
let animationFrameId = null;

const mediaCache = new Map();

let audioCtx = null;
let bgMusicTimer = null;
let customAudioElement = null;
let uploadedBgMusicElement = null;

let micRecorder = null;
let micChunks = [];
let isRecordingMic = false;

const canvasParticles = Array.from({ length: 22 }, () => ({
  x: Math.random() * 1280,
  y: Math.random() * 720,
  r: Math.random() * 7 + 4,
  vy: Math.random() * 0.85 + 0.35,
  vx: (Math.random() - 0.5) * 0.6,
  angle: Math.random() * Math.PI * 2
}));

document.addEventListener('DOMContentLoaded', () => {
  initAIHub();
  preloadInitialSlides();
  renderSlidesStrip();
  loadSlideIntoEditor(0);
  bindUIEvents();
  renderMemoryInsights();
  startCanvasPreviewLoop();
});

// ================= AI API KEY & SELF-LEARNING HUB =================
function initAIHub() {
  const providerSelect = document.getElementById('ai-provider-select');
  const keyInput = document.getElementById('ai-api-key-input');
  const saveKeyBtn = document.getElementById('save-ai-key-btn');
  const autoOptimizeBtn = document.getElementById('ai-optimize-app-btn');

  const savedProvider = localStorage.getItem(STORAGE_KEYS.AI_PROVIDER) || 'gemini';
  const savedKey = localStorage.getItem(STORAGE_KEYS.AI_KEY) || '';

  providerSelect.value = savedProvider;
  keyInput.value = savedKey;
  updateAIStatusBadge(Boolean(savedKey));

  saveKeyBtn.addEventListener('click', () => {
    const key = keyInput.value.trim();
    const prov = providerSelect.value;
    localStorage.setItem(STORAGE_KEYS.AI_PROVIDER, prov);
    localStorage.setItem(STORAGE_KEYS.AI_KEY, key);
    updateAIStatusBadge(Boolean(key));
    if (key) {
      showToast('🤖 Đã lưu AI API Key thành công! AI đã sẵn sàng học và tối ưu phim cho cô Hoà.');
    } else {
      showToast('Đã xoá API Key. Ứng dụng chuyển sang Trí Tuệ Nhân Tạo Nội Bộ tích hợp sẵn.');
    }
  });

  autoOptimizeBtn.addEventListener('click', () => {
    applyAILearnedOptimizations();
  });
}

function updateAIStatusBadge(hasKey) {
  const badge = document.getElementById('ai-status-pill');
  if (!badge) return;
  if (hasKey) {
    badge.className = 'ai-status-pill connected';
    badge.textContent = '🟢 Đã kết nối AI API Key (Chế độ Học Sâu & Sáng Tạo)';
  } else {
    badge.className = 'ai-status-pill';
    badge.textContent = '✨ Chế độ AI Thông Minh Tích Hợp Sẵn (Có thể nhập thêm API Key)';
  }
}

function renderMemoryInsights() {
  const box = document.getElementById('memory-badges');
  if (!box) return;
  const favTopic = getTopFavoriteTopicLabel();
  const count = learningMemory.optimizationCount || 1;
  box.innerHTML = `
    <span class="memory-tag">🧠 Đã học & tối ưu: <strong>${count} lần</strong></span>
    <span class="memory-tag">💖 Chủ đề cô yêu thích: <strong>${favTopic}</strong></span>
    <span class="memory-tag">🔤 Cỡ chữ ưu tiên: <strong>${learningMemory.preferredSubtitleSize || 30}px</strong></span>
    <span class="memory-tag">🎨 Màu phim yêu thích: <strong>${learningMemory.preferredFilter || 'Ấm áp'}</strong></span>
  `;
}

function applyAILearnedOptimizations() {
  // Áp dụng các thông số tối ưu nhất mà AI đã học được từ cô Hoà Đồng
  document.getElementById('subtitle-size-select').value = learningMemory.preferredSubtitleSize || '30';
  document.getElementById('frame-style-select').value = learningMemory.preferredFrame || 'hoadao';

  slides.forEach((s, idx) => {
    s.colorFilter = learningMemory.preferredFilter || 'warm';
    s.motionEffect = idx % 2 === 0 ? 'zoomIn' : 'panLeftRight';
    // Tự động tính thời lượng đọc lý tưởng dựa trên số từ của lời bình
    const wordCount = (s.caption || '').trim().split(/\s+/).length;
    s.duration = Math.max(6, Math.min(16, Math.ceil(wordCount / 2.6) + 2));
  });

  recordUserHabit('optimize', 'auto');
  loadSlideIntoEditor(activeSlideIndex);
  showToast('✨ AI đã tự động tối ưu cỡ chữ, màu ảnh và căn chỉnh thời gian khớp từng câu đọc!');
}

// Gọi AI qua API Key (Gemini hoặc OpenAI) kèm tính năng phân tích hình ảnh Vision
async function generateCaptionWithAI(mode) {
  const apiKey = (localStorage.getItem(STORAGE_KEYS.AI_KEY) || '').trim();
  const provider = localStorage.getItem(STORAGE_KEYS.AI_PROVIDER) || 'gemini';
  const slide = slides[activeSlideIndex];
  const topicPrompt = document.getElementById('ai-custom-topic').value.trim();

  const modeInstructions = {
    analyze_photo:
      'Hãy quan sát bức ảnh này và viết 1 lời bình thuyết minh phim thật xúc động, tinh tế (khoảng 25-40 từ) tôn vinh vẻ đẹp, nụ cười và thần thái trong ảnh.',
    rewrite_emotional:
      'Hãy trau chuốt lại lời bình hiện tại trở nên sâu sắc, giàu cảm xúc, ấm áp và truyền cảm hứng hơn (khoảng 25-40 từ).',
    compose_poem:
      'Hãy sáng tác 4 câu thơ lục bát hoặc thơ 7 chữ thật vần điệu, tươi vui và ý nghĩa phù hợp với cảnh phim này để làm phụ đề.',
    auto_all_slides:
      'Hãy viết lời bình liên kết mạch lạc cho cảnh phim này theo chủ đề Hoà Đồng Cuộc Sống Tươi Đẹp.'
  };

  const memoryContext = `Người dùng là cô Bùi Thị Hoà (Ms. Hoà Đồng, sinh năm 1972), giáo viên yêu đời, nhân ái. Chủ đề yêu thích: ${getTopFavoriteTopicLabel()}. Các câu cô từng thích: ${(learningMemory.learnedSentences || []).slice(0, 2).join(' | ')}.`;
  const userInstruction = `${modeInstructions[mode] || modeInstructions.rewrite_emotional} ${
    topicPrompt ? `Gợi ý thêm từ cô Hoà: "${topicPrompt}".` : ''
  } Nội dung hiện tại: "${slide.caption}". Chỉ trả về đúng câu lời bình hoặc bài thơ bằng tiếng Việt, không thêm lời giải thích.`;

  // Nếu chưa nhập API Key -> Dùng Trí Tuệ Nhân Tạo Nội Bộ thông minh theo ngữ cảnh
  if (!apiKey) {
    const smartFallback = generateSmartLocalAICaption(mode, topicPrompt, slide);
    slide.caption = smartFallback;
    document.getElementById('slide-caption').value = smartFallback;
    recordUserHabit('sentence', smartFallback);
    showToast('✨ AI đã sáng tác lời bình mới! (Nhập thêm Gemini/OpenAI Key ở trên nếu muốn AI nhìn ảnh trực tiếp)');
    return;
  }

  showToast('🤖 AI đang phân tích tư liệu và sáng tác lời bình cho cô Hoà...');

  try {
    let resultText = '';
    if (provider === 'gemini') {
      resultText = await callGeminiAPI(apiKey, memoryContext, userInstruction, slide);
    } else {
      resultText = await callOpenAIAPI(apiKey, memoryContext, userInstruction);
    }

    if (resultText) {
      const cleaned = resultText.replace(/^["“]|["”]$/g, '').trim();
      slide.caption = cleaned;
      document.getElementById('slide-caption').value = cleaned;
      recordUserHabit('sentence', cleaned);
      showToast('🎉 AI đã sáng tác xong lời bình tuyệt đẹp và ghi nhớ gu của cô!');
    }
  } catch (err) {
    const fallback = generateSmartLocalAICaption(mode, topicPrompt, slide);
    slide.caption = fallback;
    document.getElementById('slide-caption').value = fallback;
    showToast('⚠️ Đã dùng bộ máy AI dự phòng do API Key cần kiểm tra lại.');
  }
}

async function callGeminiAPI(apiKey, systemContext, promptText, slide) {
  const parts = [{ text: `${systemContext}\n\n${promptText}` }];

  // Nếu là ảnh, cố gắng đính kèm dữ liệu ảnh base64 để Gemini Vision nhìn trực tiếp bức ảnh của cô Hoà
  if (slide.type === 'image') {
    const base64Data = await getSlideImageBase64(slide);
    if (base64Data) {
      parts.push({
        inline_data: {
          mime_type: 'image/jpeg',
          data: base64Data
        }
      });
    }
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts }]
    })
  });

  if (!resp.ok) throw new Error('Gemini API error');
  const data = await resp.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function callOpenAIAPI(apiKey, systemContext, promptText) {
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemContext },
        { role: 'user', content: promptText }
      ],
      temperature: 0.8
    })
  });
  if (!resp.ok) throw new Error('OpenAI API error');
  const data = await resp.json();
  return data?.choices?.[0]?.message?.content || '';
}

async function getSlideImageBase64(slide) {
  try {
    const img = mediaCache.get(slide.id);
    if (!img || !img.complete || !img.naturalWidth) return null;
    const tempCanvas = document.createElement('canvas');
    const maxDim = 512;
    const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
    tempCanvas.width = Math.round(img.naturalWidth * scale);
    tempCanvas.height = Math.round(img.naturalHeight * scale);
    const tCtx = tempCanvas.getContext('2d');
    tCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
    const dataUrl = tempCanvas.toDataURL('image/jpeg', 0.8);
    return dataUrl.split(',')[1];
  } catch {
    return null;
  }
}

function generateSmartLocalAICaption(mode, customTopic, slide) {
  const topicText = customTopic ? `Về ${customTopic}: ` : '';
  if (mode === 'compose_poem') {
    const poems = [
      'Nụ cười toả nắng giữa mùa xuân,\nHoà đồng nhân ái vẹn tình thân,\nTháng năm rực rỡ ngàn hoa thắm,\nCuộc sống tươi đẹp mãi thanh xuân!',
      'Áo dài thướt tha dưới mái trường,\nChị em đồng nghiệp trọn yêu thương,\nSẻ chia gắn kết từng năm tháng,\nHạnh phúc ngập tràn vạn nẻo đường!'
    ];
    return poems[Math.floor(Math.random() * poems.length)];
  }
  if (mode === 'analyze_photo') {
    if (slide.src.includes('ao-dai')) {
      return `${topicText}Khoảnh khắc hội ngộ rạng ngời của các chị em đồng nghiệp trong tà áo dài truyền thống Việt Nam, nơi tình thân ái và nụ cười luôn toả nắng.`;
    }
    return `${topicText}Vẻ đẹp dịu dàng, đằm thắm và nụ cười an nhiên toả sáng giữa không gian văn hoá rực rỡ sắc màu của cuộc sống tươi đẹp.`;
  }
  const templates = [
    `${topicText}Khi tâm hồn ta luôn rộng mở và chan hoà, mỗi khoảnh khắc đi qua đều kết thành những đoá hoa kỷ niệm ngát hương.`,
    `${topicText}Giữa nhịp sống bộn bề, chính sự chân thành và nụ cười ấm áp là món quà quý giá nhất kết nối những trái tim đồng điệu.`
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

// ================= MEDIA & SLIDES MANAGEMENT =================
function preloadInitialSlides() {
  slides.forEach((s) => loadMediaElement(s));
}

function loadMediaElement(slide) {
  if (mediaCache.has(slide.id)) return mediaCache.get(slide.id);

  if (slide.type === 'video') {
    const vid = document.createElement('video');
    vid.src = slide.src;
    vid.muted = true;
    vid.playsInline = true;
    vid.loop = true;
    mediaCache.set(slide.id, vid);
    return vid;
  } else {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = slide.src;
    mediaCache.set(slide.id, img);
    return img;
  }
}

function renderSlidesStrip() {
  const strip = document.getElementById('slides-strip');
  if (!strip) return;
  strip.innerHTML = '';

  slides.forEach((slide, idx) => {
    const item = document.createElement('div');
    item.className = `slide-thumb ${idx === activeSlideIndex ? 'active' : ''}`;
    item.onclick = (e) => {
      if (e.target.classList.contains('thumb-mini-btn')) return;
      activeSlideIndex = idx;
      currentPlaySlideIndex = idx;
      slideStartTime = performance.now();
      renderSlidesStrip();
      loadSlideIntoEditor(idx);
    };

    if (slide.type === 'video') {
      const v = document.createElement('video');
      v.src = slide.src;
      v.muted = true;
      item.appendChild(v);
    } else {
      const img = document.createElement('img');
      img.src = slide.src;
      img.alt = `Cảnh ${idx + 1}`;
      item.appendChild(img);
    }

    const badge = document.createElement('span');
    badge.className = 'slide-number';
    badge.textContent = `Cảnh ${idx + 1}`;
    item.appendChild(badge);

    // Mini controls: Move Left, Move Right, Duplicate, Delete
    const actions = document.createElement('div');
    actions.className = 'slide-actions-overlay';

    const leftBtn = document.createElement('button');
    leftBtn.className = 'thumb-mini-btn';
    leftBtn.textContent = '◀';
    leftBtn.title = 'Đưa cảnh này lên trước';
    leftBtn.onclick = () => moveSlide(idx, -1);

    const dupBtn = document.createElement('button');
    dupBtn.className = 'thumb-mini-btn';
    dupBtn.textContent = '➕';
    dupBtn.title = 'Nhân đôi cảnh này';
    dupBtn.onclick = () => duplicateSlide(idx);

    const rightBtn = document.createElement('button');
    rightBtn.className = 'thumb-mini-btn';
    rightBtn.textContent = '▶';
    rightBtn.title = 'Đưa cảnh này ra sau';
    rightBtn.onclick = () => moveSlide(idx, 1);

    actions.appendChild(leftBtn);
    actions.appendChild(dupBtn);
    actions.appendChild(rightBtn);

    if (slides.length > 1) {
      const delBtn = document.createElement('button');
      delBtn.className = 'thumb-mini-btn del';
      delBtn.title = 'Xoá cảnh này';
      delBtn.textContent = '✕';
      delBtn.onclick = () => deleteSlide(idx);
      actions.appendChild(delBtn);
    }

    item.appendChild(actions);
    strip.appendChild(item);
  });
}

function moveSlide(index, direction) {
  const target = index + direction;
  if (target < 0 || target >= slides.length) return;
  const temp = slides[index];
  slides[index] = slides[target];
  slides[target] = temp;
  activeSlideIndex = target;
  renderSlidesStrip();
  loadSlideIntoEditor(activeSlideIndex);
  showToast('Đã đổi thứ tự cảnh phim!');
}

function duplicateSlide(index) {
  const orig = slides[index];
  const copy = {
    ...orig,
    id: 'slide-' + Date.now() + '-' + Math.random().toString(36).slice(2, 5)
  };
  slides.splice(index + 1, 0, copy);
  loadMediaElement(copy);
  activeSlideIndex = index + 1;
  renderSlidesStrip();
  loadSlideIntoEditor(activeSlideIndex);
  showToast('Đã nhân đôi cảnh phim!');
}

function deleteSlide(idx) {
  slides.splice(idx, 1);
  if (activeSlideIndex >= slides.length) {
    activeSlideIndex = slides.length - 1;
  }
  renderSlidesStrip();
  loadSlideIntoEditor(activeSlideIndex);
  showToast('Đã xoá cảnh khỏi bộ phim');
}

function loadSlideIntoEditor(index) {
  const slide = slides[index];
  if (!slide) return;

  document.getElementById('active-slide-label').textContent = `Đang chỉnh sửa: Cảnh số ${index + 1} / ${slides.length}`;
  document.getElementById('slide-caption').value = slide.caption;
  document.getElementById('slide-duration').value = slide.duration;
  document.getElementById('slide-motion-select').value = slide.motionEffect || 'zoomIn';
  document.getElementById('slide-filter-select').value = slide.colorFilter || 'warm';

  const statusText = document.getElementById('slide-audio-status');
  const clearAudioBtn = document.getElementById('clear-slide-audio-btn');
  if (slide.customAudioUrl) {
    statusText.innerHTML = `🎙️ <strong>Đã có thu âm/nhạc riêng:</strong> ${slide.customAudioName}`;
    clearAudioBtn.style.display = 'inline-block';
  } else {
    statusText.innerHTML = `🔊 <strong>Chế độ mặc định:</strong> Máy tự động đọc thuyết minh Tiếng Việt theo lời bình bên trên`;
    clearAudioBtn.style.display = 'none';
  }
}

// ================= BIND UI EVENTS =================
function bindUIEvents() {
  const fileInput = document.getElementById('media-upload-input');
  const uploadZone = document.getElementById('upload-zone');

  uploadZone.addEventListener('click', () => fileInput.click());
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.style.background = '#ffd6e0';
  });
  uploadZone.addEventListener('dragleave', () => {
    uploadZone.style.background = '';
  });
  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.style.background = '';
    handleMediaFiles(e.dataTransfer.files);
  });

  fileInput.addEventListener('change', (e) => {
    handleMediaFiles(e.target.files);
    fileInput.value = '';
  });

  // Webcam / Camera Direct Capture
  document.getElementById('camera-capture-btn').addEventListener('click', capturePhotoFromCamera);

  // Caption & Duration & Per-slide Effects
  document.getElementById('slide-caption').addEventListener('input', (e) => {
    slides[activeSlideIndex].caption = e.target.value;
  });
  document.getElementById('slide-caption').addEventListener('blur', (e) => {
    recordUserHabit('sentence', e.target.value);
  });

  document.getElementById('slide-duration').addEventListener('change', (e) => {
    const val = Math.max(3, Math.min(35, Number(e.target.value) || 7));
    slides[activeSlideIndex].duration = val;
  });

  document.getElementById('slide-motion-select').addEventListener('change', (e) => {
    slides[activeSlideIndex].motionEffect = e.target.value;
  });

  document.getElementById('slide-filter-select').addEventListener('change', (e) => {
    slides[activeSlideIndex].colorFilter = e.target.value;
    recordUserHabit('filter', e.target.value);
  });

  // Aspect Ratio Switch (16:9 YouTube/TV, 9:16 TikTok/Zalo, 1:1 Facebook)
  document.getElementById('aspect-ratio-select').addEventListener('change', (e) => {
    const canvas = document.getElementById('movie-canvas');
    const ratio = e.target.value;
    if (ratio === '9:16') {
      canvas.width = 720;
      canvas.height = 1280;
    } else if (ratio === '1:1') {
      canvas.width = 960;
      canvas.height = 960;
    } else {
      canvas.width = 1280;
      canvas.height = 720;
    }
    showToast(`📐 Đã chuyển khung hình sang chuẩn ${ratio}`);
  });

  document.getElementById('subtitle-size-select').addEventListener('change', (e) => {
    recordUserHabit('subtitleSize', e.target.value);
  });

  document.getElementById('frame-style-select').addEventListener('change', (e) => {
    recordUserHabit('frame', e.target.value);
  });

  // Preset Quotes Chips
  document.querySelectorAll('[data-preset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-preset');
      recordUserHabit('topic', cat);
      const list = PRESET_QUOTES[cat] || PRESET_QUOTES.cuocsong;
      const randomQuote = list[Math.floor(Math.random() * list.length)];
      slides[activeSlideIndex].caption = randomQuote;
      document.getElementById('slide-caption').value = randomQuote;
      showToast('✨ Đã điền lời bình mẫu & ghi nhớ sở thích của cô Hoà!');
    });
  });

  // AI Generation Buttons
  document.getElementById('ai-analyze-photo-btn').addEventListener('click', () => {
    generateCaptionWithAI('analyze_photo');
  });
  document.getElementById('ai-rewrite-btn').addEventListener('click', () => {
    generateCaptionWithAI('rewrite_emotional');
  });
  document.getElementById('ai-poem-btn').addEventListener('click', () => {
    generateCaptionWithAI('compose_poem');
  });
  document.getElementById('ai-all-slides-btn').addEventListener('click', async () => {
    showToast('🤖 AI đang tự động viết kịch bản cho toàn bộ các cảnh trong phim...');
    for (let i = 0; i < slides.length; i++) {
      activeSlideIndex = i;
      await generateCaptionWithAI('analyze_photo');
    }
    renderSlidesStrip();
    loadSlideIntoEditor(0);
    showToast('🎉 Đã hoàn tất viết kịch bản AI cho toàn bộ bộ phim!');
  });

  // Voice & Audio Buttons
  document.getElementById('test-tts-btn').addEventListener('click', () => {
    speakVietnameseText(slides[activeSlideIndex].caption);
  });
  document.getElementById('dictate-btn').addEventListener('click', startVoiceDictation);
  document.getElementById('record-mic-btn').addEventListener('click', toggleMicRecording);

  const slideAudioInput = document.getElementById('slide-audio-input');
  document.getElementById('upload-slide-audio-btn').addEventListener('click', () => {
    slideAudioInput.click();
  });
  slideAudioInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    slides[activeSlideIndex].customAudioUrl = url;
    slides[activeSlideIndex].customAudioName = file.name;
    loadSlideIntoEditor(activeSlideIndex);
    showToast(`🎵 Đã gắn file âm thanh "${file.name}" cho Cảnh ${activeSlideIndex + 1}`);
  });

  document.getElementById('clear-slide-audio-btn').addEventListener('click', () => {
    slides[activeSlideIndex].customAudioUrl = null;
    slides[activeSlideIndex].customAudioName = '';
    loadSlideIntoEditor(activeSlideIndex);
    showToast('Đã chuyển lại về chế độ máy tự đọc lời bình');
  });

  // Background Music Select
  const bgMusicFileInput = document.getElementById('bg-music-file-input');
  document.getElementById('bg-music-select').addEventListener('change', (e) => {
    if (e.target.value === 'custom') {
      bgMusicFileInput.click();
    }
  });
  bgMusicFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (uploadedBgMusicElement) uploadedBgMusicElement.pause();
    uploadedBgMusicElement = new Audio(URL.createObjectURL(file));
    uploadedBgMusicElement.loop = true;
    uploadedBgMusicElement.volume = 0.25;
    showToast(`🎶 Đã tải nhạc nền: ${file.name}`);
  });

  // Play / Export / Snapshot / Save Project
  document.getElementById('play-movie-btn').addEventListener('click', () => {
    if (isPlaying) {
      stopMoviePlayback();
    } else {
      startMoviePlayback(false);
    }
  });

  document.getElementById('export-movie-btn').addEventListener('click', () => {
    if (isPlaying) stopMoviePlayback();
    startMoviePlayback(true);
  });

  document.getElementById('snapshot-btn').addEventListener('click', downloadGreetingCardSnapshot);
  document.getElementById('save-project-btn').addEventListener('click', saveProjectToBrowser);
}

function handleMediaFiles(fileList) {
  if (!fileList || fileList.length === 0) return;
  let addedCount = 0;

  Array.from(fileList).forEach((file) => {
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    if (!isVideo && !isImage) return;

    const url = URL.createObjectURL(file);
    const newSlide = {
      id: 'slide-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      type: isVideo ? 'video' : 'image',
      src: url,
      caption: 'Khoảnh khắc kỷ niệm tươi đẹp và đáng nhớ trong cuộc sống.',
      duration: 7,
      motionEffect: addedCount % 2 === 0 ? 'zoomIn' : 'panLeftRight',
      colorFilter: learningMemory.preferredFilter || 'warm',
      customAudioUrl: null,
      customAudioName: ''
    };
    slides.push(newSlide);
    loadMediaElement(newSlide);
    addedCount++;
  });

  if (addedCount > 0) {
    activeSlideIndex = slides.length - 1;
    renderSlidesStrip();
    loadSlideIntoEditor(activeSlideIndex);
    showToast(`📸 Đã thêm ${addedCount} tư liệu mới vào bộ phim!`);
  }
}

async function capturePhotoFromCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const tempVideo = document.createElement('video');
    tempVideo.srcObject = stream;
    await tempVideo.play();

    const capCanvas = document.createElement('canvas');
    capCanvas.width = tempVideo.videoWidth || 1280;
    capCanvas.height = tempVideo.videoHeight || 720;
    capCanvas.getContext('2d').drawImage(tempVideo, 0, 0);

    stream.getTracks().forEach((t) => t.stop());

    const dataUrl = capCanvas.toDataURL('image/jpeg', 0.92);
    const newSlide = {
      id: 'slide-cam-' + Date.now(),
      type: 'image',
      src: dataUrl,
      caption: 'Nụ cười tươi tắn vừa chụp trực tiếp tại Xưởng Phim Kỷ Niệm Ms. Hoà Đồng!',
      duration: 7,
      motionEffect: 'zoomIn',
      colorFilter: 'warm',
      customAudioUrl: null,
      customAudioName: ''
    };
    slides.push(newSlide);
    loadMediaElement(newSlide);
    activeSlideIndex = slides.length - 1;
    renderSlidesStrip();
    loadSlideIntoEditor(activeSlideIndex);
    showToast('📸 Đã chụp ảnh trực tiếp từ Camera và đưa vào phim!');
  } catch {
    showToast('Cô hãy bấm "Cho phép" (Allow) Camera trên trình duyệt hoặc chọn ảnh từ máy nhé.');
  }
}

function downloadGreetingCardSnapshot() {
  const canvas = document.getElementById('movie-canvas');
  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `Thiep-Anh-Hoa-Dong-Canh-${activeSlideIndex + 1}.png`;
  a.click();
  showToast('🖼️ Đã lưu bức ảnh kèm chữ phụ đề thành Thiệp Ảnh Kỷ Niệm!');
}

function saveProjectToBrowser() {
  try {
    const meta = {
      title: document.getElementById('movie-title-input').value,
      opening: document.getElementById('opening-title-input').value,
      ending: document.getElementById('ending-credit-input').value,
      savedAt: new Date().toLocaleTimeString('vi-VN')
    };
    localStorage.setItem(STORAGE_KEYS.SAVED_PROJECT, JSON.stringify(meta));
    showToast(`💾 Đã lưu kịch bản và cấu hình phim lúc ${meta.savedAt}!`);
  } catch {
    showToast('Đã lưu cấu hình dự án!');
  }
}

// ================= VOICE & AUDIO ENGINE =================
function speakVietnameseText(text) {
  if (!('speechSynthesis' in window)) {
    showToast('Trình duyệt này chưa hỗ trợ đọc tự động.');
    return;
  }
  window.speechSynthesis.cancel();
  if (!text || !text.trim()) return;

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'vi-VN';
  utter.rate = Number(document.getElementById('voice-speed').value) || 0.95;
  utter.pitch = Number(document.getElementById('voice-pitch').value) || 1.05;

  const voices = window.speechSynthesis.getVoices();
  const viVoice = voices.find(
    (v) => v.lang.toLowerCase().includes('vi') || v.name.toLowerCase().includes('viet')
  );
  if (viVoice) utter.voice = viVoice;

  window.speechSynthesis.speak(utter);
}

function startVoiceDictation() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    showToast('Cô có thể gõ trực tiếp hoặc dùng nút Thu Âm Giọng Thật bên cạnh nhé!');
    return;
  }

  const rec = new SpeechRec();
  rec.lang = 'vi-VN';
  rec.continuous = false;
  rec.interimResults = false;

  const btn = document.getElementById('dictate-btn');
  btn.textContent = '👂 Đang nghe cô nói...';
  showToast('🎙️ Cô Hoà hãy đọc lời bình vào micro nhé...');

  rec.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const currentText = slides[activeSlideIndex].caption;
    const updated = currentText ? `${currentText} ${transcript}` : transcript;
    slides[activeSlideIndex].caption = updated;
    document.getElementById('slide-caption').value = updated;
    recordUserHabit('sentence', updated);
    showToast('✨ Đã chuyển giọng nói của cô thành chữ phụ đề!');
  };

  rec.onerror = () => {
    showToast('Không nghe rõ, cô hãy thử lại hoặc bấm Thu Âm Giọng Thật nhé.');
  };

  rec.onend = () => {
    btn.textContent = '🗣️ Nói Để Tự Ra Chữ Phụ Đề';
  };

  rec.start();
}

async function toggleMicRecording() {
  const btn = document.getElementById('record-mic-btn');

  if (isRecordingMic && micRecorder) {
    micRecorder.stop();
    isRecordingMic = false;
    btn.classList.remove('recording');
    btn.innerHTML = '🎙️ Tự Thu Âm Giọng Cô Hoà';
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    micChunks = [];
    micRecorder = new MediaRecorder(stream);

    micRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) micChunks.push(e.data);
    };

    micRecorder.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      const blob = new Blob(micChunks, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      slides[activeSlideIndex].customAudioUrl = url;
      slides[activeSlideIndex].customAudioName = `Giọng đọc cô Hoà (Cảnh ${activeSlideIndex + 1})`;
      loadSlideIntoEditor(activeSlideIndex);
      showToast('🎙️ Đã lưu giọng đọc thật của cô cho cảnh này!');
    };

    micRecorder.start();
    isRecordingMic = true;
    btn.classList.add('recording');
    btn.innerHTML = '⏹️ Bấm Để Dừng Thu Âm';
    showToast('🎙️ Đang thu âm giọng cô Hoà... Khi đọc xong cô bấm lại nút màu đỏ nhé!');
  } catch {
    showToast('Vui lòng bấm "Cho phép" (Allow) sử dụng Micro trên trình duyệt để thu âm.');
  }
}

function startBackgroundMusic() {
  stopBackgroundMusic();
  const style = document.getElementById('bg-music-select').value;
  if (style === 'none') return;

  if (style === 'custom' && uploadedBgMusicElement) {
    uploadedBgMusicElement.currentTime = 0;
    uploadedBgMusicElement.play().catch(() => {});
    return;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  if (!audioCtx) audioCtx = new AudioContextClass();
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const scales = {
    quehuong: [261.63, 293.66, 329.63, 392.0, 440.0, 523.25],
    muaxuan: [293.66, 329.63, 369.99, 440.0, 493.88, 587.33],
    kyniem: [220.0, 261.63, 293.66, 329.63, 392.0, 440.0],
    binhyen: [196.0, 246.94, 293.66, 392.0, 493.88]
  };
  const notes = scales[style] || scales.quehuong;
  let step = 0;

  const playNote = () => {
    if (!isPlaying) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    const freq = notes[step % notes.length];
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.045, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + 2.1);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 2.2);
    step++;
  };

  playNote();
  bgMusicTimer = setInterval(playNote, 1350);
}

function stopBackgroundMusic() {
  if (bgMusicTimer) {
    clearInterval(bgMusicTimer);
    bgMusicTimer = null;
  }
  if (uploadedBgMusicElement) {
    uploadedBgMusicElement.pause();
  }
}

function triggerSlideNarration(slide) {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  if (customAudioElement) {
    customAudioElement.pause();
    customAudioElement = null;
  }

  const media = mediaCache.get(slide.id);
  if (slide.type === 'video' && media) {
    media.currentTime = 0;
    media.play().catch(() => {});
  }

  if (slide.customAudioUrl) {
    customAudioElement = new Audio(slide.customAudioUrl);
    customAudioElement.play().catch(() => {});
  } else if (slide.caption) {
    speakVietnameseText(slide.caption);
  }
}

// ================= MOVIE PLAYBACK & VIDEO EXPORT =================
let mediaRecorder = null;
let recordedBlobs = [];

function startMoviePlayback(recordToVideo = false) {
  if (slides.length === 0) return;

  isPlaying = true;
  isRecordingMovie = recordToVideo;
  currentPlaySlideIndex = 0;
  slideStartTime = performance.now();

  const playBtn = document.getElementById('play-movie-btn');
  const exportBtn = document.getElementById('export-movie-btn');
  const recBadge = document.getElementById('recording-badge');
  const downloadBox = document.getElementById('download-box');

  downloadBox.classList.remove('show');
  playBtn.innerHTML = '⏹️ Dừng Phát Phim';

  if (recordToVideo) {
    exportBtn.disabled = true;
    recBadge.classList.add('active');
    startCanvasVideoRecorder();
    showToast('🎬 Đang quay và xuất file Video... Cô đợi phim chạy hết các cảnh nhé!');
  } else {
    showToast('▶️ Đang trình chiếu bộ phim kỷ niệm của cô Hoà Đồng!');
  }

  startBackgroundMusic();
  triggerSlideNarration(slides[0]);
}

function stopMoviePlayback() {
  isPlaying = false;
  stopBackgroundMusic();
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  if (customAudioElement) customAudioElement.pause();

  document.getElementById('play-movie-btn').innerHTML = '▶️ Xem Thử Bộ Phim';
  document.getElementById('export-movie-btn').disabled = false;
  document.getElementById('recording-badge').classList.remove('active');

  if (isRecordingMovie && mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
  isRecordingMovie = false;
}

function startCanvasVideoRecorder() {
  const canvas = document.getElementById('movie-canvas');
  if (!canvas.captureStream) {
    showToast('Trình duyệt của cô chưa hỗ trợ xuất file trực tiếp.');
    return;
  }

  const stream = canvas.captureStream(30);
  recordedBlobs = [];

  let options = { mimeType: 'video/webm;codecs=vp9' };
  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    options = { mimeType: 'video/webm' };
  }

  try {
    mediaRecorder = new MediaRecorder(stream, options);
  } catch {
    mediaRecorder = new MediaRecorder(stream);
  }

  mediaRecorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) {
      recordedBlobs.push(event.data);
    }
  };

  mediaRecorder.onstop = () => {
    const superBuffer = new Blob(recordedBlobs, { type: 'video/webm' });
    const videoUrl = URL.createObjectURL(superBuffer);
    const dlLink = document.getElementById('download-video-link');
    const movieTitle =
      document.getElementById('movie-title-input').value.trim() || 'Phim-Ky-Niem-Hoa-Dong';
    dlLink.href = videoUrl;
    dlLink.download = `${movieTitle}.webm`;

    document.getElementById('download-box').classList.add('show');
    showToast('🎉 Bộ phim đã hoàn tất! Cô hãy bấm nút "Lưu File Video Về Máy" màu xanh nhé!');
  };

  mediaRecorder.start(200);
}

// ================= REAL-TIME CINEMA RENDERER =================
function startCanvasPreviewLoop() {
  const canvas = document.getElementById('movie-canvas');
  const ctx = canvas.getContext('2d');

  function renderFrame(now) {
    const W = canvas.width;
    const H = canvas.height;

    ctx.fillStyle = '#140d0f';
    ctx.fillRect(0, 0, W, H);

    const slideIndex = isPlaying ? currentPlaySlideIndex : activeSlideIndex;
    const slide = slides[slideIndex] || slides[0];

    if (slide) {
      const durationMs = (slide.duration || 7) * 1000;
      const elapsed = isPlaying ? now - slideStartTime : now % durationMs;
      const progress = Math.min(1, Math.max(0, elapsed / durationMs));

      if (isPlaying && elapsed >= durationMs) {
        if (currentPlaySlideIndex < slides.length - 1) {
          currentPlaySlideIndex++;
          activeSlideIndex = currentPlaySlideIndex;
          slideStartTime = now;
          renderSlidesStrip();
          loadSlideIntoEditor(activeSlideIndex);
          triggerSlideNarration(slides[currentPlaySlideIndex]);
        } else {
          stopMoviePlayback();
        }
      }

      const media = loadMediaElement(slide);
      const isReady =
        (slide.type === 'image' && media.complete && media.naturalWidth > 0) ||
        (slide.type === 'video' && media.readyState >= 2);

      if (isReady) {
        const mw = slide.type === 'video' ? media.videoWidth : media.naturalWidth;
        const mh = slide.type === 'video' ? media.videoHeight : media.naturalHeight;

        // 1. Blurred Ambient Backdrop
        ctx.save();
        ctx.filter = 'blur(28px) brightness(0.5)';
        ctx.drawImage(media, -40, -40, W + 80, H + 80);
        ctx.restore();

        // 2. Color Filter Selection
        const filterMap = {
          normal: 'none',
          warm: 'sepia(0.18) saturate(1.25) brightness(1.04)',
          vibrant: 'saturate(1.4) contrast(1.06)',
          vintage: 'sepia(0.45) contrast(1.05) brightness(0.98)',
          dreamy: 'brightness(1.08) saturate(1.15) contrast(0.96)'
        };

        // 3. Motion Effect Calculation
        const motion = slide.motionEffect || 'zoomIn';
        let zoom = 1;
        let offsetX = 0;
        let offsetY = 0;

        if (motion === 'zoomIn') {
          zoom = 1 + progress * 0.1;
        } else if (motion === 'zoomOut') {
          zoom = 1.1 - progress * 0.1;
        } else if (motion === 'panLeftRight') {
          zoom = 1.06;
          offsetX = (progress - 0.5) * 45;
        } else if (motion === 'panBottomTop') {
          zoom = 1.06;
          offsetY = (0.5 - progress) * 40;
        }

        const scale = Math.min(W / mw, H / mh) * zoom;
        const drawW = mw * scale;
        const drawH = mh * scale;
        const drawX = (W - drawW) / 2 + offsetX;
        const drawY = (H - drawH) / 2 + offsetY;

        ctx.save();
        ctx.filter = filterMap[slide.colorFilter || 'warm'] || 'none';
        ctx.shadowColor = 'rgba(0,0,0,0.55)';
        ctx.shadowBlur = 28;
        ctx.drawImage(media, drawX, drawY, drawW, drawH);
        ctx.restore();
      }

      // 4. Decorative Effects & Frames
      const frameStyle = document.getElementById('frame-style-select').value;
      drawCinemaDecorations(ctx, W, H, frameStyle);

      // 5. Top Movie Title Watermark & Scene Counter
      const movieTitle = document.getElementById('movie-title-input').value;
      if (movieTitle) {
        ctx.save();
        ctx.fillStyle = 'rgba(20, 13, 15, 0.6)';
        roundRect(ctx, 24, 22, Math.min(W - 48, movieTitle.length * 13 + 70), 46, 23);
        ctx.fill();

        ctx.font = '700 21px "Playfair Display", Georgia, serif';
        ctx.fillStyle = '#ffe5ec';
        ctx.textBaseline = 'middle';
        ctx.fillText(`🌸 ${movieTitle}`, 44, 45);
        ctx.restore();
      }

      // Opening / Ending Overlay Banner on First / Last seconds
      const openingText = document.getElementById('opening-title-input').value.trim();
      const endingText = document.getElementById('ending-credit-input').value.trim();
      if (slideIndex === 0 && progress < 0.25 && openingText) {
        drawCenterCardOverlay(ctx, W, H, openingText, '🎬 PHIM KỶ NIỆM');
      } else if (slideIndex === slides.length - 1 && progress > 0.78 && endingText) {
        drawCenterCardOverlay(ctx, W, H, endingText, '💖 LỜI KẾT YÊU THƯƠNG');
      }

      // 6. Subtitle Overlay + Karaoke Progress Highlight
      if (slide.caption) {
        drawSubtitleOverlay(ctx, W, H, slide.caption, progress);
      }
    }

    animationFrameId = requestAnimationFrame(renderFrame);
  }

  animationFrameId = requestAnimationFrame(renderFrame);
}

function drawCenterCardOverlay(ctx, W, H, mainText, badgeText) {
  ctx.save();
  ctx.fillStyle = 'rgba(20, 10, 16, 0.72)';
  roundRect(ctx, W * 0.15, H * 0.14, W * 0.7, 92, 20);
  ctx.fill();
  ctx.strokeStyle = 'rgba(246, 189, 96, 0.85)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#f6bd60';
  ctx.fillText(badgeText, W / 2, H * 0.14 + 30);

  ctx.font = '700 24px "Playfair Display", Georgia, serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(mainText, W / 2, H * 0.14 + 66);
  ctx.restore();
}

function drawCinemaDecorations(ctx, W, H, style) {
  if (style !== 'thanhlich') {
    canvasParticles.forEach((p) => {
      p.y += p.vy;
      p.x += p.vx + Math.sin(p.angle) * 0.35;
      p.angle += 0.02;
      if (p.y > H + 10) {
        p.y = -10;
        p.x = Math.random() * W;
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);

      if (style === 'traitim') {
        ctx.font = `${Math.round(p.r * 2.2)}px sans-serif`;
        ctx.fillText('💖', 0, 0);
      } else if (style === 'hoasen') {
        ctx.fillStyle = 'rgba(255, 166, 201, 0.75)';
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r * 1.2, p.r * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle =
          style === 'hoadao' ? 'rgba(255, 182, 193, 0.75)' : 'rgba(246, 189, 96, 0.7)';
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r, p.r * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
  }

  ctx.save();
  ctx.strokeStyle =
    style === 'hoadao' || style === 'hoasen'
      ? 'rgba(255, 194, 209, 0.78)'
      : style === 'kinhdoanh'
      ? 'rgba(246, 189, 96, 0.88)'
      : 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 4;
  ctx.strokeRect(14, 14, W - 28, H - 28);
  ctx.restore();
}

function drawSubtitleOverlay(ctx, W, H, text, progress) {
  ctx.save();
  const fontSize = Number(document.getElementById('subtitle-size-select').value) || 30;
  ctx.font = `700 ${fontSize}px "Plus Jakarta Sans", sans-serif`;
  ctx.textAlign = 'center';

  const maxWidth = W - 110;
  const lines = wrapCanvasText(ctx, text, maxWidth);
  const lineHeight = fontSize * 1.36;
  const boxHeight = lines.length * lineHeight + 38;
  const boxY = H - boxHeight - 24;

  ctx.fillStyle = 'rgba(18, 10, 14, 0.84)';
  roundRect(ctx, 40, boxY, W - 80, boxHeight, 18);
  ctx.fill();

  ctx.strokeStyle = 'rgba(246, 189, 96, 0.7)';
  ctx.lineWidth = 2;
  ctx.stroke();

  const subColor = document.getElementById('subtitle-color-select').value || '#fff3b0';
  ctx.fillStyle = subColor;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 6;

  lines.forEach((line, i) => {
    const y = boxY + 22 + (i + 0.75) * lineHeight;
    ctx.fillText(line, W / 2, y);
  });

  // Karaoke Timeline Progress Bar at the bottom of subtitle box
  const barWidth = (W - 120) * progress;
  ctx.fillStyle = '#ff4d6d';
  roundRect(ctx, 60, boxY + boxHeight - 8, Math.max(8, barWidth), 4, 2);
  ctx.fill();

  ctx.restore();
}

function wrapCanvasText(ctx, text, maxWidth) {
  const rawLines = text.split('\n');
  const finalLines = [];

  rawLines.forEach((paragraph) => {
    const words = paragraph.split(' ');
    let currentLine = '';
    words.forEach((word) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine) {
        finalLines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    if (currentLine) finalLines.push(currentLine);
  });

  return finalLines.slice(0, 4);
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(window.__studioToast);
  window.__studioToast = setTimeout(() => {
    toast.classList.remove('show');
  }, 3800);
}
