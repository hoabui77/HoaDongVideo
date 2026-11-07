// Xưởng Phim Kỷ Niệm - Ms. Hoà Đồng (1972)
// Thiết kế thân thiện, chữ to rõ, đầy đủ thuyết minh tự động, thu âm giọng thật, nhận diện giọng nói & xuất video.

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
  ]
};

// Danh sách cảnh phim (khởi tạo sẵn với 2 bức ảnh kỷ niệm của cô Hoà Đồng)
let slides = [
  {
    id: 'slide-1',
    type: 'image',
    src: 'NGT05445.jpg',
    caption:
      'Chào mừng bạn đến với không gian Hoà Đồng Cuộc Sống Tươi Đẹp. Mỗi ngày sống chan hoà và lạc quan là một ngày ngập tràn nắng ấm.',
    duration: 7,
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

// Media elements cache
const mediaCache = new Map();

// Audio & Voice synthesis state
let audioCtx = null;
let bgMusicGain = null;
let bgMusicTimer = null;
let customAudioElement = null;
let uploadedBgMusicElement = null;

// Voice Recording (Micro) for active slide
let micRecorder = null;
let micChunks = [];
let isRecordingMic = false;

// Decorative Petals on Movie Canvas
const canvasPetals = Array.from({ length: 18 }, () => ({
  x: Math.random() * 1280,
  y: Math.random() * 720,
  r: Math.random() * 7 + 4,
  vy: Math.random() * 0.8 + 0.4,
  vx: (Math.random() - 0.5) * 0.6,
  angle: Math.random() * Math.PI * 2
}));

document.addEventListener('DOMContentLoaded', () => {
  preloadInitialSlides();
  renderSlidesStrip();
  loadSlideIntoEditor(0);
  bindUIEvents();
  startCanvasPreviewLoop();
});

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

// 1. Render Slide Strip
function renderSlidesStrip() {
  const strip = document.getElementById('slides-strip');
  if (!strip) return;
  strip.innerHTML = '';

  slides.forEach((slide, idx) => {
    const item = document.createElement('div');
    item.className = `slide-thumb ${idx === activeSlideIndex ? 'active' : ''}`;
    item.onclick = (e) => {
      if (e.target.classList.contains('slide-delete')) return;
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

    if (slides.length > 1) {
      const delBtn = document.createElement('button');
      delBtn.className = 'slide-delete';
      delBtn.title = 'Xoá cảnh này';
      delBtn.textContent = '✕';
      delBtn.onclick = () => deleteSlide(idx);
      item.appendChild(delBtn);
    }

    strip.appendChild(item);
  });
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

// 2. Load Active Slide Into Right Editor
function loadSlideIntoEditor(index) {
  const slide = slides[index];
  if (!slide) return;

  document.getElementById('active-slide-label').textContent = `Đang chỉnh sửa: Cảnh số ${index + 1} / ${slides.length}`;
  document.getElementById('slide-caption').value = slide.caption;
  document.getElementById('slide-duration').value = slide.duration;

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

// 3. Bind UI Events
function bindUIEvents() {
  // Upload Photos/Videos from PC or Phone
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

  // Caption & Duration Change
  document.getElementById('slide-caption').addEventListener('input', (e) => {
    slides[activeSlideIndex].caption = e.target.value;
  });

  document.getElementById('slide-duration').addEventListener('change', (e) => {
    const val = Math.max(3, Math.min(30, Number(e.target.value) || 7));
    slides[activeSlideIndex].duration = val;
  });

  // Preset Quotes Chips
  document.querySelectorAll('[data-preset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-preset');
      const list = PRESET_QUOTES[cat] || PRESET_QUOTES.cuocsong;
      const randomQuote = list[Math.floor(Math.random() * list.length)];
      slides[activeSlideIndex].caption = randomQuote;
      document.getElementById('slide-caption').value = randomQuote;
      showToast('✨ Đã điền lời bình mẫu giàu cảm xúc!');
    });
  });

  // Test TTS Voice Button
  document.getElementById('test-tts-btn').addEventListener('click', () => {
    speakVietnameseText(slides[activeSlideIndex].caption);
  });

  // Speech-to-Text (Nói vào micro tự ra chữ phụ đề)
  document.getElementById('dictate-btn').addEventListener('click', startVoiceDictation);

  // Record Real Voice Narration for Current Slide
  document.getElementById('record-mic-btn').addEventListener('click', toggleMicRecording);

  // Upload Pre-recorded Voice/Audio File for Current Slide
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

  // Clear Custom Slide Audio
  document.getElementById('clear-slide-audio-btn').addEventListener('click', () => {
    slides[activeSlideIndex].customAudioUrl = null;
    slides[activeSlideIndex].customAudioName = '';
    loadSlideIntoEditor(activeSlideIndex);
    showToast('Đã chuyển lại về chế độ máy tự đọc lời bình');
  });

  // Upload Custom Background Music
  const bgMusicFileInput = document.getElementById('bg-music-file-input');
  document.getElementById('bg-music-select').addEventListener('change', (e) => {
    if (e.target.value === 'custom') {
      bgMusicFileInput.click();
    }
  });
  bgMusicFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (uploadedBgMusicElement) {
      uploadedBgMusicElement.pause();
    }
    uploadedBgMusicElement = new Audio(URL.createObjectURL(file));
    uploadedBgMusicElement.loop = true;
    uploadedBgMusicElement.volume = 0.25;
    showToast(`🎶 Đã tải nhạc nền: ${file.name}`);
  });

  // Play / Stop Movie Preview
  document.getElementById('play-movie-btn').addEventListener('click', () => {
    if (isPlaying) {
      stopMoviePlayback();
    } else {
      startMoviePlayback(false);
    }
  });

  // Export & Download Video File
  document.getElementById('export-movie-btn').addEventListener('click', () => {
    if (isPlaying) stopMoviePlayback();
    startMoviePlayback(true);
  });
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

// 4. Vietnamese Text-To-Speech (Máy tự đọc lời bình)
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
  utter.pitch = 1.05;

  const voices = window.speechSynthesis.getVoices();
  const viVoice = voices.find(
    (v) => v.lang.toLowerCase().includes('vi') || v.name.toLowerCase().includes('viet')
  );
  if (viVoice) utter.voice = viVoice;

  window.speechSynthesis.speak(utter);
}

// 5. Speech Recognition (Nói vào micro tự chuyển thành chữ phụ đề)
function startVoiceDictation() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    showToast('Bạn có thể gõ trực tiếp hoặc dùng nút Thu Âm Giọng Thật bên cạnh nhé!');
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

// 6. Real Voice Microphone Recording for Slide
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

// 7. Gentle Synthesized Background Music (Web Audio API - No copyright issues)
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

  // Scales: Pentatonic warm Vietnamese folk / Spring / Nostalgic
  const scales = {
    quehuong: [261.63, 293.66, 329.63, 392.0, 440.0, 523.25], // C D E G A C5
    muaxuan: [293.66, 329.63, 369.99, 440.0, 493.88, 587.33], // D Major Pentatonic
    kyniem: [220.0, 261.63, 293.66, 329.63, 392.0, 440.0] // A Minor Pentatonic
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

    // Soft gentle envelope (auto-ducked under voice)
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
  bgMusicTimer = setInterval(playNote, 1400);
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

// 8. Play Slide Narration (Custom Audio or Automatic Vietnamese TTS)
function triggerSlideNarration(slide) {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  if (customAudioElement) {
    customAudioElement.pause();
    customAudioElement = null;
  }

  // Play video sound or keep muted
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

// 9. Start / Stop Full Movie Playback & Video Recording
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
    showToast('🎬 Đang quay và ghép nhạc thành file Video... Cô đợi phim chạy hết nhé!');
  } else {
    showToast('▶️ Đang phát bộ phim kỷ niệm của cô Hoà Đồng!');
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
    const movieTitle = document.getElementById('movie-title-input').value.trim() || 'Phim-Ky-Niem-Hoa-Dong';
    dlLink.href = videoUrl;
    dlLink.download = `${movieTitle}.webm`;

    document.getElementById('download-box').classList.add('show');
    showToast('🎉 Bộ phim đã hoàn tất! Cô hãy bấm nút "Tải Video Về Máy" màu xanh nhé!');
  };

  mediaRecorder.start(200);
}

// 10. Real-time Cinema Canvas Renderer (Ken Burns Zoom, Frames, Subtitles, Title Banner)
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
      const elapsed = isPlaying ? now - slideStartTime : (now % durationMs);
      const progress = Math.min(1, Math.max(0, elapsed / durationMs));

      // Advance slide during playback
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

      // Draw Image or Video with smooth Ken Burns zoom effect
      const media = loadMediaElement(slide);
      const isReady =
        (slide.type === 'image' && media.complete && media.naturalWidth > 0) ||
        (slide.type === 'video' && media.readyState >= 2);

      if (isReady) {
        const mw = slide.type === 'video' ? media.videoWidth : media.naturalWidth;
        const mh = slide.type === 'video' ? media.videoHeight : media.naturalHeight;

        // 1. Blurred Warm Backdrop (so portrait photos look gorgeous without black bars)
        ctx.save();
        ctx.filter = 'blur(26px) brightness(0.55)';
        ctx.drawImage(media, -40, -40, W + 80, H + 80);
        ctx.restore();

        // 2. Sharp Center Media with Gentle Ken Burns Zoom (1.0 -> 1.08)
        const zoom = 1 + progress * 0.08;
        const scale = Math.min(W / mw, H / mh) * zoom;
        const drawW = mw * scale;
        const drawH = mh * scale;
        const drawX = (W - drawW) / 2;
        const drawY = (H - drawH) / 2;

        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.55)';
        ctx.shadowBlur = 28;
        ctx.drawImage(media, drawX, drawY, drawW, drawH);
        ctx.restore();
      }

      // 3. Decorative Frame Style
      const frameStyle = document.getElementById('frame-style-select').value;
      drawCinemaDecorations(ctx, W, H, frameStyle);

      // 4. Top Movie Title Watermark
      const movieTitle = document.getElementById('movie-title-input').value;
      if (movieTitle) {
        ctx.save();
        ctx.fillStyle = 'rgba(20, 13, 15, 0.55)';
        roundRect(ctx, 28, 24, Math.min(W - 56, movieTitle.length * 14 + 60), 48, 24);
        ctx.fill();

        ctx.font = '700 22px "Playfair Display", Georgia, serif';
        ctx.fillStyle = '#ffe5ec';
        ctx.textBaseline = 'middle';
        ctx.fillText(`🌸 ${movieTitle}`, 48, 48);
        ctx.restore();
      }

      // 5. Subtitle Box at the Bottom
      if (slide.caption) {
        drawSubtitleOverlay(ctx, W, H, slide.caption);
      }
    }

    animationFrameId = requestAnimationFrame(renderFrame);
  }

  animationFrameId = requestAnimationFrame(renderFrame);
}

function drawCinemaDecorations(ctx, W, H, style) {
  // Floating Blossom Petals
  if (style === 'hoadao' || style === 'kinhdoanh') {
    canvasPetals.forEach((p) => {
      p.y += p.vy;
      p.x += p.vx + Math.sin(p.angle) * 0.3;
      p.angle += 0.02;
      if (p.y > H + 10) {
        p.y = -10;
        p.x = Math.random() * W;
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = style === 'hoadao' ? 'rgba(255, 182, 193, 0.7)' : 'rgba(246, 189, 96, 0.65)';
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r, p.r * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  // Classic Golden Border
  ctx.save();
  ctx.strokeStyle =
    style === 'hoadao'
      ? 'rgba(255, 194, 209, 0.75)'
      : style === 'kinhdoanh'
      ? 'rgba(246, 189, 96, 0.85)'
      : 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 4;
  ctx.strokeRect(16, 16, W - 32, H - 32);
  ctx.restore();
}

function drawSubtitleOverlay(ctx, W, H, text) {
  ctx.save();
  const fontSize = Number(document.getElementById('subtitle-size-select').value) || 30;
  ctx.font = `700 ${fontSize}px "Plus Jakarta Sans", sans-serif`;
  ctx.textAlign = 'center';

  const maxWidth = W - 140;
  const lines = wrapCanvasText(ctx, text, maxWidth);
  const lineHeight = fontSize * 1.38;
  const boxHeight = lines.length * lineHeight + 34;
  const boxY = H - boxHeight - 28;

  // Semi-transparent dark luxury subtitle bar
  ctx.fillStyle = 'rgba(18, 10, 14, 0.82)';
  roundRect(ctx, 50, boxY, W - 100, boxHeight, 18);
  ctx.fill();

  ctx.strokeStyle = 'rgba(246, 189, 96, 0.65)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw crisp yellow/white readable subtitles
  const subColor = document.getElementById('subtitle-color-select').value || '#fff3b0';
  ctx.fillStyle = subColor;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 6;

  lines.forEach((line, i) => {
    const y = boxY + 22 + (i + 0.75) * lineHeight;
    ctx.fillText(line, W / 2, y);
  });

  ctx.restore();
}

function wrapCanvasText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  words.forEach((word) => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });
  if (currentLine) lines.push(currentLine);
  return lines.slice(0, 3); // Tối đa 3 dòng rõ đẹp trên màn hình
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
  }, 3600);
}
