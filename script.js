// =====================
// FIREBASE IMPORTS
// =====================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
// MOOD DATA
// =====================
const moods = {
  work: {
    emoji: '😮‍💨',
    title: 'okay. breathe. you made it through.',
    text: 'Long shifts take more than just your time — they take your energy, your patience, your whole self. You showed up today. That counts for a lot. Rest is not laziness. It\'s recovery.',
    bg: '#e8e5ff'
  },
  grief: {
    emoji: '🖤',
    title: 'grief is love with nowhere to go.',
    text: 'There\'s no right way to do this. No timeline, no rules. You don\'t have to be okay right now. We\'re just here, sitting with you in it.',
    bg: '#dce6f0'
  },
  birthday: {
    emoji: '🎉',
    title: 'hey — happy you exist!',
    text: 'Birthdays can be complicated. But whatever this one looks like for you — we hope there\'s at least one small moment today that feels like yours. You deserve to be celebrated.',
    bg: '#fff9c4'
  },
  hospital: {
    emoji: '🏥',
    title: 'hospitals are a lot. you\'re handling it.',
    text: 'Whether it\'s you, someone you love, or something in between — this is hard. You\'re allowed to feel scared, bored, hopeful, or all of those at once. We\'re rooting for you.',
    bg: '#d8f0da'
  },
  argument: {
    emoji: '😤',
    title: 'it\'s okay to still feel heated.',
    text: 'Arguments leave a residue. Your feelings are valid even if the moment has passed. Take your time. You don\'t have to resolve everything right now.',
    bg: '#ffddd5'
  },
  good: {
    emoji: '✨',
    title: 'yes! hold onto this one.',
    text: 'Good days are real and they matter. Notice what made today feel a little lighter — even if it\'s something tiny. You deserve this.',
    bg: '#fefce8'
  },
  cant_explain: {
    emoji: '🌫️',
    title: 'you don\'t have to name it.',
    text: 'Sometimes feelings don\'t come with labels and that\'s completely okay. You\'re still allowed to feel it. We\'re not going anywhere.',
    bg: '#ede8ff'
  },
  tired: {
    emoji: '😴',
    title: 'tired is valid. rest is radical.',
    text: 'Not every tired is fixed by sleep. Sometimes you\'re tired of trying, of keeping up, of everything. That\'s real. Be gentle with yourself today.',
    bg: '#ddeeff'
  }
};

// =====================
// AUTH STATE
// Shows user email and sign out button if logged in
// =====================
onAuthStateChanged(auth, function(user) {
  const nav = document.querySelector('nav');
  const existingUserInfo = document.getElementById('userInfo');
  if (existingUserInfo) existingUserInfo.remove();

  if (user) {
    // User is signed in
    const userInfo = document.createElement('span');
    userInfo.id = 'userInfo';
    userInfo.style.cssText = 'font-size: 13px; color: #888; display: flex; align-items: center; gap: 10px;';
    userInfo.innerHTML = `
      <span>👋 ${user.email}</span>
      <button onclick="handleSignOut()" style="background: none; border: 1.5px solid #ccc; padding: 6px 14px; border-radius: 40px; font-size: 12px; cursor: pointer; color: #888;">sign out</button>
    `;
    nav.appendChild(userInfo);

    // Load their mood history from Firebase
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

    // Add to history
    addToHistory(mood, selected);

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
  buttons.forEach(function(btn) {
    btn.classList.remove('active');
  });

  responseBox.classList.remove('visible');
  setTimeout(function() {
    responseBox.style.display = 'none';
  }, 600);

  document.body.style.background = '';
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
