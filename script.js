// =====================
// DAILY MICRO MOMENT
// Changes the top message based on the day
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
// Changes hero heading based on time of day
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
// Each mood has a background color, emoji, title and message
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
// MOOD SELECTOR
// Listens for button clicks and updates the page
// =====================
const buttons = document.querySelectorAll('.emotion-btn');
const responseBox = document.getElementById('responseBox');
const responseEmoji = document.getElementById('responseEmoji');
const responseTitle = document.getElementById('responseTitle');
const responseText = document.getElementById('responseText');

buttons.forEach(function(button) {

  button.addEventListener('click', function() {

    // Get which mood was clicked
    const mood = button.getAttribute('data-mood');
    const selected = moods[mood];

    // Change background color
    document.body.style.background = selected.bg;

    // Remove active class from all buttons
    buttons.forEach(function(btn) {
      btn.classList.remove('active');
    });

    // Add active class to clicked button
    
    button.classList.add('active');

// Add to mood history
addToHistory(mood, selected);

    // Hide response box first for fade effect
    responseBox.classList.remove('visible');
    responseBox.style.display = 'none';

    // Fill in the response content
    responseEmoji.textContent = selected.emoji;
    responseTitle.textContent = selected.title;
    responseText.textContent = selected.text;

    // Fade the response box back in
    setTimeout(function() {
      responseBox.style.display = 'block';
      setTimeout(function() {
        responseBox.classList.add('visible');
      }, 50);
    }, 300);

  });

});
// =====================
// DARK MODE TOGGLE
// Switches dark class on and off
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
// MOOD RESET
// Clears everything back to default
// =====================
document.getElementById('resetBtn').addEventListener('click', function() {

  // Remove active from all buttons
  buttons.forEach(function(btn) {
    btn.classList.remove('active');
  });

  // Fade out response box
  responseBox.classList.remove('visible');
  setTimeout(function() {
    responseBox.style.display = 'none';
  }, 600);

  // Reset background
  document.body.style.background = '';

});
// =====================
// MOOD HISTORY
// Records each mood selected this session
// =====================
const historyList = document.getElementById('historyList');
const moodHistory = [];

function addToHistory(mood, selected) {

  // Remove empty message if first entry
  const empty = historyList.querySelector('.history-empty');
  if (empty) empty.remove();

  // Get current time
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Add to history array
  moodHistory.push({ mood, time });

  // Create history item
  const item = document.createElement('div');
  item.classList.add('history-item');
  item.innerHTML = `${selected.emoji} ${selected.title} <span>${time}</span>`;

  // Add to history list
  historyList.appendChild(item);
}