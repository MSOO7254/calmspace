// =====================
// FIREBASE IMPORTS
// =====================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// =====================
// FIREBASE CONFIG
// =====================
const firebaseConfig = {
  apiKey: "AIzaSyCXHbUDVlTR36dyOzoLLlTXeHkBmfNWM3Y",
  authDomain: "calmspace-8caec.firebaseapp.com",
  projectId: "calmspace-8caec",
  storageBucket: "calmspace-8caec.firebasestorage.app",
  messagingSenderId: "369534892322",
  appId: "1:369534892322:web:e4f9ca3caecc86dbc4cd7b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// =====================
// DAILY MICRO MOMENT
// =====================
const moments = [
  "you made it to today. that's genuinely impressive. 🌿",
  "hi. just checking — when did you last drink some water?",
  "no agenda here. just glad you showed up. 💚",
  "today doesn't have to be perfect. it just has to happen.",
  "you're allowed to feel exactly what you're feeling right now.",
  "small steps still count. you're moving. 🌱",
  "hey. take a breath. you've got this."
];

const today = new Date().getDay();
document.getElementById('microMoment').textContent = moments[today % moments.length];

// =====================
// TIME BASED GREETING
// =====================
const hour = new Date().getHours();
let greeting;

if (hour < 12) {
  greeting = "good morning... are you smiling? 🌤️";
} else if (hour < 17) {
  greeting = "good afternoon... are you smiling? ☀️";
} else if (hour < 21) {
  greeting = "good evening... are you smiling? 🌇";
} else {
  greeting = "still up? hope you're okay... 🌙";
}

document.querySelector('.hero h1').textContent = greeting;

// =====================
// EMOTION CATEGORIES
// =====================
const categories = {
  low: {
    label: 'low energy',
    emotions: [
      { id: 'lonely', emoji: '🫂', title: 'feeling lonely', text: 'Loneliness is one of the heaviest feelings. You can be in a room full of people and still feel completely alone. That\'s real. You don\'t have to pretend otherwise. We\'re here.', bg: '#dce6f0' },
      { id: 'empty', emoji: '🌫️', title: 'feeling empty', text: 'Empty is different from sad. It\'s the absence of feeling. Like someone turned the volume down on everything. Rest in it for now. It won\'t stay forever.', bg: '#e8e8e8' },
      { id: 'heartbroken', emoji: '💔', title: 'heartbroken', text: 'Heartbreak is a physical thing. It lives in your chest, your stomach, your throat. There\'s no shortcut through it. Only through it. We\'re walking with you.', bg: '#fde8e8' },
      { id: 'exhausted', emoji: '😮‍💨', title: 'completely exhausted', text: 'Not just tired — exhausted. The kind that sleep doesn\'t always fix. You\'ve been carrying a lot. Put it down for a moment. Just breathe.', bg: '#e8e5ff' },
      { id: 'numb', emoji: '🧊', title: 'feeling numb', text: 'Numb is your mind\'s way of protecting you when things get too heavy. It\'s okay. You don\'t have to feel everything right now. Be gentle with yourself.', bg: '#ddeeff' },
      { id: 'sad', emoji: '😢', title: 'just sad', text: 'Sad is valid. You don\'t need a reason big enough to justify it. You\'re allowed to be sad. Sit with it. Let it move through you.', bg: '#dce6f0' }
    ]
  },
  activated: {
    label: 'activated',
    emotions: [
      { id: 'angry', emoji: '😠', title: 'angry', text: 'Anger is information. It\'s telling you something matters, something was crossed, something wasn\'t right. Feel it. Then decide what to do with it.', bg: '#ffddd5' },
      { id: 'frustrated', emoji: '😤', title: 'frustrated', text: 'Frustration is anger\'s quieter cousin — and somehow harder to shake. Things aren\'t going the way they should. That\'s allowed to bother you.', bg: '#ffe8d5' },
      { id: 'anxious', emoji: '😰', title: 'anxious', text: 'Anxiety is your brain trying to protect you from every possible outcome at once. Take one breath. You only have to handle right now. Not all of it.', bg: '#fef9c3' },
      { id: 'overwhelmed', emoji: '🌊', title: 'overwhelmed', text: 'Too much, all at once. Everything feels urgent and nothing feels manageable. Pick one thing. Just one. Leave the rest for later.', bg: '#dce6f0' },
      { id: 'restless', emoji: '⚡', title: 'restless', text: 'Can\'t sit still. Can\'t settle. Something in you is searching for something but you\'re not sure what. That energy is telling you something. Listen to it.', bg: '#fff9c3' },
      { id: 'stressed', emoji: '😓', title: 'stressed', text: 'Stress means you care. But caring too much for too long wears you down. You\'re allowed to step back. The world won\'t fall apart in five minutes.', bg: '#ffddd5' }
    ]
  },
  positive: {
    label: 'positive',
    emotions: [
      { id: 'grateful', emoji: '🙏', title: 'feeling grateful', text: 'Gratitude is one of the most powerful things a human can feel. Hold onto this moment. Notice what\'s good right now. You deserve to feel this.', bg: '#fefce8' },
      { id: 'excited', emoji: '🎉', title: 'excited', text: 'Something good is happening or coming. Let yourself be excited. You don\'t have to play it cool. Be fully in it.', bg: '#fff9c4' },
      { id: 'proud', emoji: '✨', title: 'feeling proud', text: 'You did something. Maybe big, maybe small — but you did it. Own that. Pride in yourself is not arrogance. It\'s recognition. You earned this.', bg: '#fefce8' },
      { id: 'peaceful', emoji: '🌿', title: 'feeling peaceful', text: 'These moments are rare. Quiet, calm, settled. Notice it. Breathe it in. You don\'t have to do anything with peace except feel it.', bg: '#e1f5ee' },
      { id: 'loved', emoji: '💚', title: 'feeling loved', text: 'Someone loves you. Or you love someone. Or both. That\'s everything. Hold onto that feeling — it\'s one of the best ones there is.', bg: '#e1f5ee' },
      { id: 'hopeful', emoji: '🌅', title: 'feeling hopeful', text: 'Hope is brave. It means you believe things can be better. That takes courage. Don\'t let anyone talk you out of it.', bg: '#fef9c3' }
    ]
  },
  neutral: {
    label: 'neutral / unclear',
    emotions: [
      { id: 'bored', emoji: '😑', title: 'just bored', text: 'Boredom is underrated. It means your mind has space. Sometimes that space is uncomfortable. But creativity lives right on the other side of boredom.', bg: '#f0f4f8' },
      { id: 'confused', emoji: '🤔', title: 'confused', text: 'Things aren\'t making sense right now. That\'s okay. Confusion is just the space before clarity. You don\'t have to have it figured out today.', bg: '#e8e5ff' },
      { id: 'cant_explain', emoji: '🌫️', title: 'can\'t explain it', text: 'Sometimes feelings don\'t come with labels and that\'s completely okay. You\'re still allowed to feel it. We\'re not going anywhere.', bg: '#ede8ff' },
      { id: 'existing', emoji: '🌙', title: 'just existing', text: 'Not good, not bad. Just here. That\'s enough. Existing is enough. You don\'t have to be thriving every day.', bg: '#ddeeff' },
      { id: 'nostalgic', emoji: '📷', title: 'nostalgic', text: 'Missing something — a time, a person, a feeling. Nostalgia is love for the past. It\'s beautiful and painful at the same time. Let yourself remember.', bg: '#fff9c4' },
      { id: 'disconnected', emoji: '🔌', title: 'feeling disconnected', text: 'Like you\'re watching life through glass. Present but not really here. That feeling is valid. You don\'t have to force connection. It comes back.', bg: '#e8e8e8' }
    ]
  },
  situational: {
    label: 'situational',
    emotions: [
      { id: 'work', emoji: '😮‍💨', title: 'just got off a long shift', text: 'Long shifts take more than just your time — they take your energy, your patience, your whole self. You showed up today. That counts for a lot. Rest is not laziness. It\'s recovery.', bg: '#e8e5ff' },
      { id: 'grief', emoji: '🖤', title: 'grieving', text: 'There\'s no right way to do this. No timeline, no rules. You don\'t have to be okay right now. We\'re just here, sitting with you in it.', bg: '#dce6f0' },
      { id: 'birthday', emoji: '🎉', title: 'it\'s my birthday!', text: 'Birthdays can be complicated. But whatever this one looks like for you — we hope there\'s at least one small moment today that feels like yours. You deserve to be celebrated.', bg: '#fff9c4' },
      { id: 'hospital', emoji: '🏥', title: 'at the hospital', text: 'Whether it\'s you, someone you love, or something in between — this is hard. You\'re allowed to feel scared, bored, hopeful, or all of those at once. We\'re rooting for you.', bg: '#d8f0da' },
      { id: 'argument', emoji: '😤', title: 'after an argument', text: 'Arguments leave a residue. Your feelings are valid even if the moment has passed. Take your time. You don\'t have to resolve everything right now.', bg: '#ffddd5' },
      { id: 'good_day', emoji: '✨', title: 'actually having a good day', text: 'Good days are real and they matter. Notice what made today feel a little lighter — even if it\'s something tiny. You deserve this.', bg: '#fefce8' }
    ]
  }
};

// =====================
// CATEGORY SELECTOR
// =====================
window.selectCategory = function(categoryId, btn) {
  // Update active category button
  document.querySelectorAll('.category-btn').forEach(function(b) {
    b.classList.remove('active');
  });
  btn.classList.add('active');

  // Get emotions for this category
  const category = categories[categoryId];
  const emotionButtons = document.getElementById('emotionButtons');
  emotionButtons.innerHTML = '';

  // Build emotion buttons
  category.emotions.forEach(function(emotion) {
    const button = document.createElement('button');
    button.className = 'emotion-btn';
    button.setAttribute('data-mood', emotion.id);
    button.setAttribute('data-category', categoryId);
    button.innerHTML = emotion.emoji + ' ' + emotion.title;
    button.addEventListener('click', function() {
      selectMood(emotion);
      addToHistory(emotion);
      const user = auth.currentUser;
      if (user) {
        saveMoodToFirebase(user.uid, emotion.id, emotion);
      }
    });
    emotionButtons.appendChild(button);
  });

  // Show emotion grid
  document.getElementById('categoryGrid').style.display = 'none';
  document.getElementById('emotionGrid').style.display = 'block';
}

window.goBack = function() {
  document.getElementById('categoryGrid').style.display = 'flex';
  document.getElementById('emotionGrid').style.display = 'none';
  document.getElementById('responseBox').classList.remove('visible');
  setTimeout(function() {
    document.getElementById('responseBox').style.display = 'none';
  }, 600);
  document.body.style.background = '';
}

function selectMood(emotion) {
  // Change background
  document.body.style.background = emotion.bg;

  // Update active button
  document.querySelectorAll('.emotion-btn').forEach(function(btn) {
    btn.classList.remove('active');
  });

  // Hide response box first
  const responseBox = document.getElementById('responseBox');
  responseBox.classList.remove('visible');
  responseBox.style.display = 'none';

  // Fill response content
  document.getElementById('responseEmoji').textContent = emotion.emoji;
  document.getElementById('responseTitle').textContent = emotion.title;
  document.getElementById('responseText').textContent = emotion.text;

  // Fade response box in
  setTimeout(function() {
    responseBox.style.display = 'block';
    setTimeout(function() {
      responseBox.classList.add('visible');
    }, 50);
  }, 300);
}
// =====================
// AUTH STATE
// =====================

onAuthStateChanged(auth, async function(user) {
  const nav = document.querySelector('nav');
  const existingUserInfo = document.getElementById('userInfo');
  if (existingUserInfo) existingUserInfo.remove();

  if (user) {
    // Load saved theme from Firebase
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      const savedTheme = userDoc.data().theme;
      if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
        localStorage.setItem('calmspace_theme', savedTheme);
      }
    }

    // Show user info in nav
    const userInfo = document.createElement('span');
    userInfo.id = 'userInfo';
    userInfo.style.cssText = 'font-size: 13px; color: #888; display: flex; align-items: center; gap: 10px;';
    userInfo.innerHTML = `
      <span>👋 ${user.email}</span>
      <button onclick="handleSignOut()" style="background: none; border: 1.5px solid #ccc; padding: 6px 14px; border-radius: 40px; font-size: 12px; cursor: pointer; color: #888;">sign out</button>
    `;
    nav.appendChild(userInfo);

    // Load mood history
    loadMoodHistory(user.uid);
  }
});
// =====================
// SIGN OUT
// =====================
window.handleSignOut = function() {
  signOut(auth).then(function() {
    window.location.reload();
  });
};

// =====================
// MOOD SELECTOR
// =====================
const buttons = document.querySelectorAll('.emotion-btn');
const responseBox = document.getElementById('responseBox');
const responseEmoji = document.getElementById('responseEmoji');
const responseTitle = document.getElementById('responseTitle');
const responseText = document.getElementById('responseText');

buttons.forEach(function(button) {
  button.addEventListener('click', function() {
    const mood = button.getAttribute('data-mood');
    const selected = moods[mood];

    // Change background
    document.body.style.background = selected.bg;

    // Update active button
    buttons.forEach(function(btn) {
      btn.classList.remove('active');
    });
    button.classList.add('active');

    // Hide response box first
    responseBox.classList.remove('visible');
    responseBox.style.display = 'none';

    // Fill response content
    responseEmoji.textContent = selected.emoji;
    responseTitle.textContent = selected.title;
    responseText.textContent = selected.text;

    // Fade response box in
    setTimeout(function() {
      responseBox.style.display = 'block';
      setTimeout(function() {
        responseBox.classList.add('visible');
      }, 50);
    }, 300);

   function addToHistory(emotion) {
  const historyList = document.getElementById('historyList');
  const empty = historyList.querySelector('.history-empty');
  if (empty) empty.remove();

  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const item = document.createElement('div');
  item.classList.add('history-item');
  item.innerHTML = `${emotion.emoji} ${emotion.title} <span>${time}</span>`;
  historyList.appendChild(item);
}

    // Save to Firebase if logged in
    const user = auth.currentUser;
    if (user) {
      saveMoodToFirebase(user.uid, mood, selected);
    }
  });
});

// =====================
// MOOD RESET
// =====================
document.getElementById('resetBtn').addEventListener('click', function() {
  goBack();
});

// =====================
// SESSION MOOD HISTORY
// Shows moods selected this session
// =====================
const historyList = document.getElementById('historyList');

function addToHistory(mood, selected) {
  const empty = historyList.querySelector('.history-empty');
  if (empty) empty.remove();

  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const item = document.createElement('div');
  item.classList.add('history-item');
  item.innerHTML = `${selected.emoji} ${selected.title} <span>${time}</span>`;
  historyList.appendChild(item);
}

// =====================
// SAVE MOOD TO FIREBASE
// Stores mood in Firestore under user's ID
// =====================
async function saveMoodToFirebase(uid, mood, selected) {
  try {
    await addDoc(collection(db, 'users', uid, 'moods'), {
      mood: mood,
      emoji: selected.emoji,
      title: selected.title,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error saving mood:', error);
  }
}
// Save to Firebase if logged in
const user = auth.currentUser;
if (user) {
  saveMoodToFirebase(user.uid, emotion.id, emotion);
  updateStreak(user.uid);
}

// =====================
// LOAD MOOD HISTORY FROM FIREBASE
// Loads past moods when user signs in
// =====================
async function loadMoodHistory(uid) {
  try {
    const empty = historyList.querySelector('.history-empty');
    if (empty) empty.remove();

    const q = query(
      collection(db, 'users', uid, 'moods'),
      orderBy('timestamp', 'desc')
    );

    const snapshot = await getDocs(q);

    snapshot.forEach(function(doc) {
      const data = doc.data();
      const date = data.timestamp.toDate();
      const time = date.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const item = document.createElement('div');
      item.classList.add('history-item');
      item.innerHTML = `${data.emoji} ${data.title} <span>${time}</span>`;
      historyList.appendChild(item);
    });

  } catch (error) {
    console.error('Error loading mood history:', error);
  }
}
// =====================
// STREAK TRACKER
// Tracks daily check in streak
// =====================
async function updateStreak(uid) {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);

    const today = new Date().toDateString();
    let streak = 1;
    let lastCheckin = null;

    if (userDoc.exists()) {
      const data = userDoc.data();
      lastCheckin = data.lastCheckin;
      streak = data.streak || 1;

      if (lastCheckin === today) {
        // Already checked in today
        document.getElementById('streakCount').textContent = streak;
        return;
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toDateString();

      if (lastCheckin === yesterdayString) {
        // Checked in yesterday — increase streak
        streak = streak + 1;
      } else {
        // Missed a day — reset streak
        streak = 1;
      }
    }

    // Save updated streak
    await setDoc(userRef, {
      streak: streak,
      lastCheckin: today
    }, { merge: true });

    // Update UI
    document.getElementById('streakCount').textContent = streak;

    // Celebrate milestones
    if (streak === 3) showStreakMessage('3 days in a row!! you\'re building something. 🌱');
    if (streak === 7) showStreakMessage('a whole week!! that\'s dedication. 🔥');
    if (streak === 30) showStreakMessage('30 days. you\'re unstoppable. 💚');

  } catch (error) {
    console.error('Error updating streak:', error);
  }
}

function showStreakMessage(message) {
  const box = document.createElement('div');
  box.style.cssText = `
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: #1D9E75;
    color: white;
    padding: 14px 28px;
    border-radius: 40px;
    font-size: 14px;
    z-index: 999;
    animation: fadeIn 0.5s ease;
  `;
  box.textContent = message;
  document.body.appendChild(box);
  setTimeout(function() {
    box.remove();
  }, 4000);
}

// =====================
// DARK MODE TOGGLE
// =====================
const darkToggle = document.getElementById('darkToggle');

darkToggle.addEventListener('click', function() {
  document.body.classList.toggle('dark');

  if (document.body.classList.contains('dark')) {
    darkToggle.textContent = '☀️';
  } else {
    darkToggle.textContent = '🌙';
  }
});
// =====================
// BACKGROUND ANIMATIONS
// Different for each personality theme
// =====================
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const currentTheme = document.body.getAttribute('data-theme') || 'default';

if (currentTheme === 'hacker') {
  runMatrixRain();
} else if (currentTheme === 'soft') {
  runFloatingPetals();
} else if (currentTheme === 'nostalgic') {
  runFireflies();
} else if (currentTheme === 'hype') {
  runParticles();
} else if (currentTheme === 'poetic') {
  runFloatingClouds();
} else {
  runDefaultBubbles();
}

// ── Matrix Rain ──
function runMatrixRain() {
  const chars = 'アイウエオカキクケコ0123456789ABCDEF<>{}[]|';
  const fontSize = 14;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = Array(columns).fill(1);

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#1D9E75';
    ctx.font = fontSize + 'px monospace';

    drops.forEach(function(y, i) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * fontSize, y * fontSize);
      if (y * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    });
  }
  setInterval(draw, 50);
}

// ── Floating Petals ──
function runFloatingPetals() {
  const petals = Array.from({ length: 40 }, function() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 8 + 4,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: Math.random() * 0.5 + 0.2,
      opacity: Math.random() * 0.5 + 0.2,
      color: ['#ffb7c5', '#ffc0cb', '#ffadb9', '#ff85a1'][Math.floor(Math.random() * 4)]
    };
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(function(p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.y > canvas.height) {
        p.y = -10;
        p.x = Math.random() * canvas.width;
      }
    });
    ctx.globalAlpha = 1;
  }
  setInterval(draw, 30);
}

// ── Fireflies ──
function runFireflies() {
  const fireflies = Array.from({ length: 60 }, function() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random(),
      opacityDir: (Math.random() - 0.5) * 0.02
    };
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fireflies.forEach(function(f) {
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
      ctx.fillStyle = '#ffd700';
      ctx.globalAlpha = Math.max(0, Math.min(1, f.opacity));
      ctx.fill();
      f.x += f.speedX;
      f.y += f.speedY;
      f.opacity += f.opacityDir;
      if (f.opacity <= 0 || f.opacity >= 1) f.opacityDir *= -1;
      if (f.x < 0 || f.x > canvas.width) f.speedX *= -1;
      if (f.y < 0 || f.y > canvas.height) f.speedY *= -1;
    });
    ctx.globalAlpha = 1;
  }
  setInterval(draw, 30);
}

// ── Hype Particles ──
function runParticles() {
  const particles = Array.from({ length: 80 }, function() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 4 + 1,
      speedX: (Math.random() - 0.5) * 3,
      speedY: (Math.random() - 0.5) * 3,
      color: ['#ffd700', '#ff6b6b', '#4ecdc4', '#fff'][Math.floor(Math.random() * 4)]
    };
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(function(p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.6;
      ctx.fill();
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
      if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
    });
    ctx.globalAlpha = 1;
  }
  setInterval(draw, 20);
}

// ── Floating Clouds / Journal ──
function runFloatingClouds() {
  const particles = Array.from({ length: 50 }, function() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.4 - 0.1,
      opacity: Math.random() * 0.4 + 0.1,
      color: ['#c4a882', '#a89070', '#d4b896', '#8b7355'][Math.floor(Math.random() * 4)]
    };
  });

  // Ink drop ripples
  const ripples = Array.from({ length: 8 }, function() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 20 + 10,
      maxSize: Math.random() * 120 + 60,
      speed: Math.random() * 0.5 + 0.2,
      opacity: Math.random() * 0.12 + 0.04
    };
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ripples
    ripples.forEach(function(r) {
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.size, 0, Math.PI * 2);
      ctx.strokeStyle = '#8b7355';
      ctx.globalAlpha = r.opacity * (1 - r.size / r.maxSize);
      ctx.lineWidth = 1;
      ctx.stroke();
      r.size += r.speed;
      if (r.size > r.maxSize) {
        r.size = 0;
        r.x = Math.random() * canvas.width;
        r.y = Math.random() * canvas.height;
      }
    });

    // Draw floating dust particles
    particles.forEach(function(p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.y < -10) {
        p.y = canvas.height + 10;
        p.x = Math.random() * canvas.width;
      }
      if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
    });

    ctx.globalAlpha = 1;
    ctx.lineWidth = 1;
  }
  setInterval(draw, 30);
}