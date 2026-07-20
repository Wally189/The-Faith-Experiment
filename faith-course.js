(() => {
  const storageKey = 'faith-experiment-completed-lessons';
  const lessons = [
    { id:'lesson-01', number:1, title:'The God question', href:'lesson-01.html', available:true },
    { id:'lesson-02', number:2, title:'What revelation is', available:false },
    { id:'lesson-03', number:3, title:'Scripture and Tradition', available:false },
    { id:'lesson-04', number:4, title:'Who is Jesus?', available:false },
    { id:'lesson-05', number:5, title:'Cross and Resurrection', available:false },
    { id:'lesson-06', number:6, title:'Grace and freedom', available:false },
    { id:'lesson-07', number:7, title:'Why matter matters', available:false },
    { id:'lesson-08', number:8, title:'The Eucharistic centre', available:false },
    { id:'lesson-09', number:9, title:'Conscience and virtue', available:false },
    { id:'lesson-10', number:10, title:'Learning to pray', available:false },
    { id:'lesson-11', number:11, title:'The common good', available:false },
    { id:'lesson-12', number:12, title:'The lay apostolate', available:false }
  ];

  let completed;
  try { completed = new Set(JSON.parse(localStorage.getItem(storageKey) || '[]')); }
  catch { completed = new Set(); }

  const select = document.querySelector('#lesson-select');
  const status = document.querySelector('#course-progress-text');
  const fill = document.querySelector('#course-progress-fill');

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
  render();
})();