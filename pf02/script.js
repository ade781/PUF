//
// Shared JavaScript for the birthday website.  It handles the
// countdown timer on the home page, toggles the surprise message,
// and generates a simple confetti animation when the user clicks
// the surprise button.  If certain elements are not present on a
// page (for example, there is no countdown on the gallery page),
// the corresponding code gracefully skips itself.
//

document.addEventListener('DOMContentLoaded', () => {
  /**
   * Countdown timer
   *
   * To customise the date and time of the event, change the value
   * assigned to `eventDate` below.  Use ISO 8601 format
   * (YYYY-MM-DDTHH:MM:SS) to ensure consistent parsing across
   * browsers.  The countdown updates once per second until the
   * event occurs, at which point all values read zero.
   */
  const countdownContainer = document.getElementById('countdown');
  if (countdownContainer) {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    // Set the target date and time here.  Replace this date with
    // your actual celebration date.
    const eventDate = new Date('2025-10-01T19:00:00');

    function updateCountdown() {
      const now = new Date();
      const diff = eventDate - now;
      if (diff <= 0) {
        // Event has passed; ensure all values are zero
        daysEl.textContent = '0';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      daysEl.textContent = days;
      hoursEl.textContent = hours.toString().padStart(2, '0');
      minutesEl.textContent = minutes.toString().padStart(2, '0');
      secondsEl.textContent = seconds.toString().padStart(2, '0');
    }
    // Initial call and set up interval for updates
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  /**
   * Surprise button and message
   *
   * When the user clicks the surprise button, the hidden message
   * becomes visible and a burst of confetti is generated.  Clicking
   * the button again hides the message but does not repeat the
   * confetti effect.
   */
  const surpriseBtn = document.getElementById('surpriseButton');
  const surpriseMsg = document.getElementById('surpriseMessage');
  if (surpriseBtn && surpriseMsg) {
    surpriseBtn.addEventListener('click', () => {
      const isHidden = surpriseMsg.classList.contains('hidden');
      if (isHidden) {
        surpriseMsg.classList.remove('hidden');
        triggerConfetti();
      } else {
        surpriseMsg.classList.add('hidden');
      }
    });
  }

  /**
   * Generate a simple confetti animation by adding and removing
   * coloured dots that fall down the page.  Each piece is given
   * random colours, positions, animation durations and delays to
   * create a lively effect.  Confetti pieces clean themselves up
   * after 5 seconds.
   */
  function triggerConfetti() {
    const colours = ['#f7a4a4', '#ffe5e2', '#ffbc80', '#bde7fd', '#c4fae8'];
    const numPieces = 100;
    for (let i = 0; i < numPieces; i++) {
      const piece = document.createElement('div');
      piece.classList.add('confetti-piece');
      piece.style.backgroundColor = colours[Math.floor(Math.random() * colours.length)];
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.animationDuration = (2 + Math.random() * 3) + 's';
      piece.style.animationDelay = (Math.random() * 0.5) + 's';
      piece.style.opacity = (0.7 + Math.random() * 0.3).toString();
      document.body.appendChild(piece);
      // Remove the piece once the animation should have finished
      setTimeout(() => {
        piece.remove();
      }, 5000);
    }
  }

  /**
   * Dark mode toggle
   *
   * This feature allows visitors to switch between light and dark
   * themes.  The preference is stored in localStorage so that it
   * persists across page loads.  The mode toggle button updates its
   * icon to reflect the current state (moon for dark mode off, sun
   * for dark mode on).
   */
  (function initDarkMode() {
    const toggle = document.getElementById('modeToggle');
    if (!toggle) return;
    const body = document.body;
    // Apply persisted preference
    const stored = localStorage.getItem('darkMode');
    if (stored === 'true') {
      body.classList.add('dark-mode');
      toggle.textContent = '☀️';
    }
    toggle.addEventListener('click', () => {
      const isDark = body.classList.toggle('dark-mode');
      localStorage.setItem('darkMode', isDark);
      // Switch icon
      toggle.textContent = isDark ? '☀️' : '🌙';
    });
  })();

  /**
   * RSVP form handling
   *
   * When the RSVP form exists on a page, this function intercepts
   * the submission event, prevents the default page reload, and
   * displays a confirmation message.  The form data is not sent
   * anywhere; instead, it is appended to an array in localStorage so
   * that responses persist locally.
   */
  (function initRsvpForm() {
    const form = document.getElementById('rsvpForm');
    const thankYou = document.getElementById('rsvpThankYou');
    if (!form) return;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      // Gather form values
      const data = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        attendance: form.attendance.value,
        guests: form.guests.value,
        message: form.message.value.trim(),
        timestamp: new Date().toISOString(),
      };
      // Persist responses in localStorage
      try {
        const existing = JSON.parse(localStorage.getItem('rsvpResponses') || '[]');
        existing.push(data);
        localStorage.setItem('rsvpResponses', JSON.stringify(existing));
      } catch (err) {
        // If parsing fails, overwrite
        localStorage.setItem('rsvpResponses', JSON.stringify([data]));
      }
      // Hide form and show thank you message
      form.classList.add('hidden');
      if (thankYou) thankYou.classList.remove('hidden');
    });
  })();

  /**
   * Quiz functionality
   *
   * A simple multiple‑choice quiz is defined here.  Each question has
   * a set of options and a correct answer index.  The quiz moves
   * forward as the user selects answers, and finally displays the
   * score.  All DOM manipulation is contained within this function to
   * avoid polluting the global scope.
   */
  (function initQuiz() {
    const container = document.getElementById('quizContainer');
    if (!container) return;
    // Define your quiz questions here.  Feel free to edit or add more.
    const questions = [
      {
        question: 'What is the celebrant\'s favourite food?',
        options: ['Pizza', 'Sushi', 'Ice cream', 'Satay'],
        answer: 2,
      },
      {
        question: 'Which city were they born in?',
        options: ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta'],
        answer: 3,
      },
      {
        question: 'What hobby do they enjoy the most?',
        options: ['Coding', 'Painting', 'Cycling', 'Cooking'],
        answer: 0,
      },
    ];
    let current = 0;
    let score = 0;
    function showQuestion() {
      container.innerHTML = '';
      if (current >= questions.length) {
        const result = document.createElement('div');
        result.classList.add('quiz-result');
        result.textContent = `You scored ${score} out of ${questions.length}!`;
        container.appendChild(result);
        return;
      }
      const q = questions[current];
      const questionEl = document.createElement('div');
      questionEl.classList.add('quiz-question');
      questionEl.textContent = q.question;
      const optionsList = document.createElement('ul');
      optionsList.classList.add('quiz-options');
      q.options.forEach((opt, idx) => {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.textContent = opt;
        button.addEventListener('click', () => {
          if (idx === q.answer) {
            score++;
          }
          current++;
          showQuestion();
        });
        li.appendChild(button);
        optionsList.appendChild(li);
      });
      container.appendChild(questionEl);
      container.appendChild(optionsList);
    }
    showQuestion();
  })();

  /**
   * Guestbook functionality
   *
   * Messages left by visitors are stored in localStorage and displayed
   * under the form.  Users can add multiple messages.  When the
   * page loads, existing messages are rendered.
   */
  (function initGuestbook() {
    const form = document.getElementById('guestbookForm');
    const list = document.getElementById('messageList');
    if (!form || !list) return;
    // Load existing messages
    function loadMessages() {
      list.innerHTML = '';
      try {
        const msgs = JSON.parse(localStorage.getItem('guestbookMessages') || '[]');
        msgs.forEach((msg) => {
          const item = document.createElement('div');
          item.classList.add('message-item');
          const nameEl = document.createElement('h4');
          nameEl.textContent = msg.name;
          const bodyEl = document.createElement('p');
          bodyEl.textContent = msg.message;
          item.appendChild(nameEl);
          item.appendChild(bodyEl);
          list.appendChild(item);
        });
      } catch (err) {
        // ignore parse errors
      }
    }
    loadMessages();
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = form.name.value.trim();
      const message = form.message.value.trim();
      if (!name || !message) return;
      const newMsg = { name, message, timestamp: new Date().toISOString() };
      try {
        const msgs = JSON.parse(localStorage.getItem('guestbookMessages') || '[]');
        msgs.push(newMsg);
        localStorage.setItem('guestbookMessages', JSON.stringify(msgs));
      } catch (err) {
        localStorage.setItem('guestbookMessages', JSON.stringify([newMsg]));
      }
      // Clear inputs
      form.name.value = '';
      form.message.value = '';
      // Reload list
      loadMessages();
    });
  })();
});