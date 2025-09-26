<script>
  // ====== CONFIG ======
  // Atur target kejutan dalam UTC ISO. Jika 5 Okt 2025 00:00 WIB,
  // set jadi 2025-10-04T17:00:00Z
  let targetUtcISO = "2025-10-04T17:00:00Z";

  let images = [
    { src: "/photos/1.jpg", caption: "Momen favorit #1" },
    { src: "/photos/2.jpg", caption: "Momen favorit #2" },
    { src: "/photos/3.jpg", caption: "Momen favorit #3" },
  ];

  // ====== COUNTDOWN (inline) ======
  let remaining = 0; // ms
  let done = false;
  let intervalId;
  let surpriseOpen = false;

  function updateRemaining() {
    const target = new Date(targetUtcISO).getTime();
    const now = Date.now();
    remaining = Math.max(0, target - now);
    if (remaining === 0 && !done) {
      done = true;
      surpriseOpen = true;
      burst();
    }
  }

  $: secondsTotal = Math.floor(remaining / 1000);
  $: days = Math.floor(secondsTotal / 86400);
  $: hours = Math.floor((secondsTotal % 86400) / 3600);
  $: minutes = Math.floor((secondsTotal % 3600) / 60);
  $: seconds = secondsTotal % 60;

  // konfeti emoji
  let confettis = [];
  function burst() {
    const count = 80;
    confettis = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 2000 + Math.random() * 2000,
      delay: Math.random() * 300,
      rot: (Math.random() * 60 - 30).toFixed(2),
      emoji: Math.random() > 0.5 ? "🎉" : "✨",
    }));
    setTimeout(() => {
      confettis = [];
    }, 4500);
  }

  // lifecycle
  import { onMount, onDestroy } from "svelte";
  onMount(() => {
    updateRemaining();
    intervalId = setInterval(updateRemaining, 1000);
  });
  onDestroy(() => clearInterval(intervalId));

  // ====== GALLERY (inline) ======
  let open = false;
  let current = 0;
  function show(i) {
    current = i;
    open = true;
  }
  function next() {
    current = (current + 1) % images.length;
  }
  function prev() {
    current = (current - 1 + images.length) % images.length;
  }
  function close(e) {
    if (e.target.classList && e.target.classList.contains("overlay"))
      open = false;
  }
</script>

<div class="min-h-screen bg-gradient">
  <main class="container">
    <section class="card intro">
      <h1>Happy Birthday, Sayang! 🎂</h1>
      <p class="subtitle">Hitung mundur menuju kejutan ✨</p>

      {#if remaining > 0}
        <div class="countdown">
          <div class="timebox">
            <div class="unit">
              <span>{days}</span><label>hari</label>
            </div>
            <div class="sep">:</div>
            <div class="unit">
              <span>{hours.toString().padStart(2, "0")}</span><label>jam</label>
            </div>
            <div class="sep">:</div>
            <div class="unit">
              <span>{minutes.toString().padStart(2, "0")}</span><label
                >menit</label
              >
            </div>
            <div class="sep">:</div>
            <div class="unit">
              <span>{seconds.toString().padStart(2, "0")}</span><label
                >detik</label
              >
            </div>
          </div>
          <div class="confetti">
            {#each confettis as c (c.id)}
              <span
                class="piece"
                style="left:{c.left}%; animation-duration:{c.duration}ms; animation-delay:{c.delay}ms; transform: rotate({c.rot}deg);"
                >{c.emoji}</span
              >
            {/each}
          </div>
        </div>
      {:else}
        <div class="done">Waktunya tiba! 💌</div>
      {/if}

      {#if surpriseOpen}
        <div class="surprise">
          <h2>🎉 Surprise! 🎉</h2>
          <p>Aku sayang kamu. Semoga hari ini seindah senyummu. 💖</p>
        </div>
      {/if}
    </section>

    <section class="card gallery">
      <h2>Galeri Kenangan 📸</h2>

      <div class="grid">
        {#each images as img, i}
          <figure class="item" on:click={() => show(i)}>
            <img src={img.src} alt={img.caption} loading="lazy" />
            <figcaption>{img.caption}</figcaption>
          </figure>
        {/each}
      </div>

      {#if open}
        <div class="overlay" on:click={close}>
          <div class="modal">
            <button class="nav left" on:click|stopPropagation={prev}>⟨</button>
            <img src={images[current].src} alt={images[current].caption} />
            <button class="nav right" on:click|stopPropagation={next}>⟩</button>
            <div class="caption">{images[current].caption}</div>
            <button
              class="close"
              on:click|stopPropagation={() => (open = false)}>✕</button
            >
          </div>
        </div>
      {/if}
    </section>

    <footer class="footer">Made with ❤ using Svelte</footer>
  </main>
</div>

<style>
  .bg-gradient {
    background: radial-gradient(1200px 600px at 10% -20%, #ffe3ec, transparent),
      radial-gradient(1000px 500px at 110% 10%, #e3f0ff, transparent),
      linear-gradient(180deg, #fff, #fafafa);
  }
  .container {
    max-width: 960px;
    margin: 0 auto;
    padding: 24px;
  }
  .card {
    background: #fff;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
    margin-bottom: 24px;
  }
  .intro h1 {
    margin: 0 0 8px;
    font-size: 2rem;
  }
  .subtitle {
    color: #666;
    margin: 0 0 16px;
  }

  .countdown {
    position: relative;
  }
  .timebox {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  .unit {
    text-align: center;
    background: #f7f7f8;
    padding: 12px 16px;
    min-width: 90px;
    border-radius: 14px;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.6),
      0 1px 3px rgba(0, 0, 0, 0.06);
  }
  .unit span {
    display: block;
    font-size: 1.8rem;
    font-weight: 700;
  }
  .unit label {
    color: #666;
    font-size: 0.8rem;
  }
  .sep {
    font-size: 1.4rem;
    color: #bbb;
  }
  .done {
    text-align: center;
    font-size: 1.2rem;
    background: #eaffea;
    border: 1px solid #c7f0c7;
    padding: 12px;
    border-radius: 12px;
  }

  .confetti {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }
  .piece {
    position: absolute;
    top: -10%;
    animation: fall linear forwards;
  }
  @keyframes fall {
    to {
      transform: translateY(120vh) rotate(360deg);
      opacity: 0.9;
    }
  }

  .surprise {
    margin-top: 16px;
    padding: 16px;
    border-radius: 16px;
    background: #fff7e6;
    border: 1px dashed #f0c36a;
  }
  .gallery h2 {
    margin-top: 0;
  }
  .footer {
    text-align: center;
    color: #888;
    font-size: 0.9rem;
    padding: 16px 0 0;
  }

  /* Gallery */
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
  }
  .item {
    margin: 0;
    cursor: pointer;
    border-radius: 14px;
    overflow: hidden;
    background: #fafafa;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }
  .item img {
    width: 100%;
    height: 140px;
    object-fit: cover;
    display: block;
  }
  figcaption {
    padding: 8px 10px;
    font-size: 0.9rem;
    color: #555;
  }

  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: grid;
    place-items: center;
    z-index: 50;
  }
  .modal {
    position: relative;
    background: #111;
    padding: 12px;
    border-radius: 16px;
    max-width: 92vw;
    max-height: 88vh;
    display: grid;
    place-items: center;
  }
  .modal img {
    max-width: 90vw;
    max-height: 76vh;
    border-radius: 10px;
  }
  .caption {
    color: #eee;
    font-size: 0.95rem;
    margin-top: 8px;
    text-align: center;
    max-width: 80vw;
  }
  .nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.15);
    border: none;
    padding: 8px 12px;
    font-size: 1.6rem;
    color: #fff;
    border-radius: 10px;
    cursor: pointer;
  }
  .nav.left {
    left: 8px;
  }
  .nav.right {
    right: 8px;
  }
  .close {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(255, 255, 255, 0.15);
    border: none;
    color: #fff;
    font-size: 1.1rem;
    padding: 6px 8px;
    border-radius: 8px;
    cursor: pointer;
  }
</style>
