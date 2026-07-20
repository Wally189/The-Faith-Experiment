(() => {
  const storageKey = 'faith-experiment-completed-lessons';
  const lessons = [
    { id:'lesson-01', number:1, title:'The God question', href:'lesson-01.html', available:true },
    { id:'lesson-02', number:2, title:'What revelation is', href:'lesson.html?n=2', available:true },
    { id:'lesson-03', number:3, title:'Scripture and Tradition', href:'lesson.html?n=3', available:true },
    { id:'lesson-04', number:4, title:'Who is Jesus?', href:'lesson.html?n=4', available:true },
    { id:'lesson-05', number:5, title:'Cross and Resurrection', href:'lesson.html?n=5', available:true },
    { id:'lesson-06', number:6, title:'Grace and freedom', href:'lesson.html?n=6', available:true },
    { id:'lesson-07', number:7, title:'Why matter matters', href:'lesson.html?n=7', available:true },
    { id:'lesson-08', number:8, title:'The Eucharistic centre', href:'lesson.html?n=8', available:true },
    { id:'lesson-09', number:9, title:'Conscience and virtue', href:'lesson.html?n=9', available:true },
    { id:'lesson-10', number:10, title:'Learning to pray', href:'lesson.html?n=10', available:true },
    { id:'lesson-11', number:11, title:'The common good', href:'lesson.html?n=11', available:true },
    { id:'lesson-12', number:12, title:'The lay apostolate', href:'lesson.html?n=12', available:true }
  ];

  const blockAliases = [
    ['course-block-1', 'god-and-revelation'],
    ['course-block-2', 'christ-and-salvation'],
    ['course-block-3', 'sacraments-and-christian-life'],
    ['course-block-4', 'prayer-and-mission']
  ];
  blockAliases.forEach(([newId, oldId]) => {
    const block = document.getElementById(oldId);
    if (block) block.id = newId;
  });

  let completed;
  try { completed = new Set(JSON.parse(localStorage.getItem(storageKey) || '[]')); }
  catch { completed = new Set(); }

  const select = document.querySelector('#lesson-select');
  const status = document.querySelector('#course-progress-text');
  const fill = document.querySelector('#course-progress-fill');

  function openLesson(card) {
    const lesson = lessons.find(l => l.id === card.dataset.lessonId);
    if (lesson?.available && lesson.href) location.href = lesson.href;
  }

  function prepareCards() {
    document.querySelectorAll('[data-lesson-id]').forEach(card => {
      const lesson = lessons.find(l => l.id === card.dataset.lessonId);
      if (!lesson?.available || card.matches('a')) return;
      card.classList.remove('locked');
      card.setAttribute('role', 'link');
      card.setAttribute('tabindex', '0');
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => openLesson(card));
      card.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openLesson(card);
        }
      });
    });
  }

  function render() {
    if (select) {
      select.innerHTML = '<option value="">Choose a lesson…</option>' + lessons.map(l => {
        const done = completed.has(l.id) ? ' ✓' : '';
        const unavailable = l.available ? '' : ' — coming later';
        return `<option value="${l.available ? l.href : ''}" ${l.available ? '' : 'disabled'}>${l.number}. ${l.title}${done}${unavailable}</option>`;
      }).join('');
    }
    document.querySelectorAll('[data-lesson-id]').forEach(card => {
      const done = completed.has(card.dataset.lessonId);
      card.classList.toggle('completed', done);
      const badge = card.querySelector('.completion-badge');
      if (badge) badge.textContent = done ? 'Completed ✓' : 'Not completed';
    });
    if (status) status.textContent = `${completed.size} of ${lessons.length} lessons completed`;
    if (fill) fill.style.width = `${Math.round((completed.size / lessons.length) * 100)}%`;
  }

  select?.addEventListener('change', () => { if (select.value) location.href = select.value; });
  addEventListener('storage', render);
  prepareCards();
  render();
})();