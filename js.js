document.addEventListener('DOMContentLoaded', function () {
  const items = Array.from(document.querySelectorAll('.faq-item'));
  const categories = Array.from(document.querySelectorAll('.faq-category'));
  const searchInput = document.getElementById('faq-search');
  const noResults = document.querySelector('.no-results');
  const backToTop = document.getElementById('back-to-top');

  items.forEach(item => {
    const question = item.querySelector('.faq-question');

    // Klik/tap untuk toggle jawaban
    question.addEventListener('click', () => {
      item.classList.toggle('active');
    });

    // Keyboard: Enter atau Space untuk toggle
    question.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.classList.toggle('active');
      }
    });
  });

  if (searchInput) {
    // Simpan teks asli agar bisa restore saat kata kunci hilang
    items.forEach(item => {
      const qElem = item.querySelector('.faq-question');
      const aElem = item.querySelector('.faq-answer');
      qElem.dataset.original = qElem.textContent;
      aElem.dataset.original = aElem.textContent;
    });

    searchInput.addEventListener('input', function () {
      const rawQuery = this.value.trim();
      const query = rawQuery.toLowerCase();

      let anyVisible = false;

      items.forEach(item => {
        const qElem = item.querySelector('.faq-question');
        const aElem = item.querySelector('.faq-answer');

        // Restore teks asli (hilangkan <mark> sebelumnya)
        qElem.innerHTML = qElem.dataset.original;
        aElem.innerHTML = aElem.dataset.original;

        const questionText = qElem.textContent.toLowerCase();
        const answerText = aElem.textContent.toLowerCase();

        if (query && (questionText.includes(query) || answerText.includes(query))) {
          // Tampilkan item
          item.classList.remove('hidden');
          anyVisible = true;

          // HIGHLIGHT: ganti semua kemunculan kata kunci dengan <mark>
          // Gunakan RegExp dengan 'gi' (global, case-insensitive)
          const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
          qElem.innerHTML = qElem.innerHTML.replace(regex, '<mark>$1</mark>');
          aElem.innerHTML = aElem.innerHTML.replace(regex, '<mark>$1</mark>');
        } else if (!query) {
          // Jika kotak kosong → tampilkan kembali semua
          item.classList.remove('hidden');
        } else {
          // Sembunyikan item yang tidak cocok
          item.classList.add('hidden');
        }
      });

      // Jika tidak ada 1 pun yang tampil → tunjukkan pesan “Tidak Ada Hasil”
      if (query && !anyVisible) {
        noResults.classList.remove('hidden');
      } else {
        noResults.classList.add('hidden');
      }

      // Sembunyikan/Kembalikan kategori yang habis/ada pertanyaan visible
      categories.forEach(cat => {
        let sibling = cat.nextElementSibling;
        let hasVisibleItem = false;

        while (sibling && !sibling.classList.contains('faq-category')) {
          if (sibling.classList.contains('faq-item') &&
              !sibling.classList.contains('hidden')) {
            hasVisibleItem = true;
            break;
          }
          sibling = sibling.nextElementSibling;
        }

        if (hasVisibleItem) {
          cat.classList.remove('hidden');
        } else {
          cat.classList.add('hidden');
        }
      });
    });
  }

  // Munculkan tombol jika scroll > 200px
  window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
      backToTop.style.display = 'flex';
    } else {
      backToTop.style.display = 'none';
    }
  });

  // Klik tombol → scroll ke atas
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});