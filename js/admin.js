// admin.js
document.addEventListener('DOMContentLoaded', () => {
  // -------------------- TOURS --------------------
  function getToursFromStorage() {
    const str = localStorage.getItem('spbTours');
    return str ? JSON.parse(str) : [];
  }
  function saveToursToStorage(arr) {
    localStorage.setItem('spbTours', JSON.stringify(arr));
  }

  // -------------------- SITE CONTENT --------------------
  function getSiteContent() {
    const str = localStorage.getItem('spbSiteContent');
    return str ? JSON.parse(str) : {};
  }
  function saveSiteContent(obj) {
    localStorage.setItem('spbSiteContent', JSON.stringify(obj));
  }

  let toursData = getToursFromStorage();
  let siteContent = getSiteContent();
  if (!siteContent.faq) siteContent.faq = [];
  if (!siteContent.reviews) siteContent.reviews = [];
  if (!siteContent.contacts) siteContent.contacts = {};

  // -------------------- ЭЛЕМЕНТЫ ФОРМЫ (Экскурсии) --------------------
  const toursTableBody = document.querySelector('#toursTable tbody');
  const editTourId = document.getElementById('editTourId');
  const tourTitle = document.getElementById('tourTitle');
  const tourShortInfo = document.getElementById('tourShortInfo');
  const tourInfo = document.getElementById('tourInfo');
  const tourImages = document.getElementById('tourImages');
  const tourActive = document.getElementById('tourActive');
  const tourPriceGroup = document.getElementById('tourPriceGroup');
  const tourPriceIndividual = document.getElementById('tourPriceIndividual');
  const tourSchedule = document.getElementById('tourSchedule');
  const saveTourBtn = document.getElementById('saveTourBtn');
  const resetFormBtn = document.getElementById('resetFormBtn');

  // Новое поле для html-файла:
  const tourFile = document.getElementById('tourFile');

  function renderToursTable() {
    toursTableBody.innerHTML = '';
    toursData.forEach(t => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${t.id}</td>
        <td>${t.title}</td>
        <td>
          <input type="checkbox" data-action="toggleActive" data-id="${t.id}" ${t.active ? 'checked' : ''}>
        </td>
        <td>${t.priceGroup || 0}</td>
        <td>${t.priceIndividual || 0}</td>
        <td>
          <button class="admin-btn" data-action="edit" data-id="${t.id}">Редакт</button>
          <button class="admin-btn delete-btn" data-action="delete" data-id="${t.id}">Удалить</button>
        </td>
      `;
      toursTableBody.appendChild(tr);
    });
  }
  renderToursTable();

  toursTableBody.addEventListener('click', (e) => {
    const btn = e.target;
    const action = btn.getAttribute('data-action');
    const id = btn.getAttribute('data-id');
    if (!action || !id) return;

    if (action === 'edit') {
      const found = toursData.find(x => x.id === id);
      if (found) {
        editTourId.value = found.id;
        tourTitle.value = found.title || "";
        tourShortInfo.value = found.shortInfo || "";
        tourInfo.value = found.info || "";
        tourImages.value = found.images ? found.images.join(",") : "";
        tourActive.checked = !!found.active;
        tourPriceGroup.value = Number(found.priceGroup) || 0;
        tourPriceIndividual.value = Number(found.priceIndividual) || 0;
        tourSchedule.value = found.schedule || "";
        tourFile.value = found.file || "";
      }
    } else if (action === 'delete') {
      toursData = toursData.filter(x => x.id !== id);
      saveToursToStorage(toursData);
      renderToursTable();
      resetTourForm();
    } else if (action === 'toggleActive') {
      const found = toursData.find(x => x.id === id);
      if (found) {
        found.active = btn.checked;
        saveToursToStorage(toursData);
        renderToursTable();
      }
    }
  });

  function resetTourForm() {
    editTourId.value = "";
    tourTitle.value = "";
    tourShortInfo.value = "";
    tourInfo.value = "";
    tourImages.value = "";
    tourActive.checked = true;
    tourPriceGroup.value = "";
    tourPriceIndividual.value = "";
    tourSchedule.value = "";
    tourFile.value = "";
  }
  resetFormBtn.addEventListener('click', resetTourForm);

  saveTourBtn.addEventListener('click', () => {
    const editingId = editTourId.value.trim();
    const found = toursData.find(x => x.id === editingId);

    if (!tourTitle.value.trim()) {
      alert('Введите название экскурсии');
      return;
    }

    let imagesArr = [];
    if (tourImages.value.trim()) {
      imagesArr = tourImages.value.split(',').map(s => s.trim());
    }

    if (!found) {
      // Создание новой
      const newId = Date.now().toString();
      const newTour = {
        id: newId,
        title: tourTitle.value.trim(),
        shortInfo: tourShortInfo.value.trim(),
        info: tourInfo.value.trim(),
        images: imagesArr,
        active: tourActive.checked,
        priceGroup: Number(tourPriceGroup.value) || 0,
        priceIndividual: Number(tourPriceIndividual.value) || 0,
        schedule: tourSchedule.value.trim(),
        file: tourFile.value.trim() // <-- имя html-файла
      };
      toursData.push(newTour);
    } else {
      // Редактирование существующей
      found.title = tourTitle.value.trim();
      found.shortInfo = tourShortInfo.value.trim();
      found.info = tourInfo.value.trim();
      found.images = imagesArr;
      found.active = tourActive.checked;
      found.priceGroup = Number(tourPriceGroup.value) || 0;
      found.priceIndividual = Number(tourPriceIndividual.value) || 0;
      found.schedule = tourSchedule.value.trim();
      found.file = tourFile.value.trim();
    }

    saveToursToStorage(toursData);
    renderToursTable();
    resetTourForm();
    alert('Экскурсия сохранена!');
  });

  // -------------------- TEXT CONTENT (ABOUT / FAQ / CONTACTS) --------------------
  const aboutTextEl = document.getElementById('aboutText');
  const faqListEl = document.getElementById('faqList');
  const newFaqQuestion = document.getElementById('newFaqQuestion');
  const newFaqAnswer = document.getElementById('newFaqAnswer');
  const addFaqBtn = document.getElementById('addFaqBtn');
  const contactPhone = document.getElementById('contactPhone');
  const contactEmail = document.getElementById('contactEmail');
  const contactAddress = document.getElementById('contactAddress');
  const contactFooterText = document.getElementById('contactFooterText');
  const saveContentBtn = document.getElementById('saveContentBtn');

  aboutTextEl.value = siteContent.aboutText || "";
  contactPhone.value = siteContent.contacts.phone || "";
  contactEmail.value = siteContent.contacts.email || "";
  contactAddress.value = siteContent.contacts.address || "";
  contactFooterText.value = siteContent.contacts.footerText || "";

  function renderFaqList() {
    faqListEl.innerHTML = "";
    siteContent.faq.forEach((item, index) => {
      const wrap = document.createElement('div');
      wrap.style.border = '1px solid #ccc';
      wrap.style.padding = '8px';
      wrap.style.marginBottom = '5px';

      const questionInput = document.createElement('input');
      questionInput.type = 'text';
      questionInput.value = item.question;
      questionInput.style.width = '100%';
      questionInput.style.marginBottom = '5px';

      const answerText = document.createElement('textarea');
      answerText.rows = 2;
      answerText.value = item.answer;
      answerText.style.width = '100%';

      const btnWrap = document.createElement('div');
      btnWrap.style.marginTop = '5px';

      const saveBtn = document.createElement('button');
      saveBtn.className = 'admin-btn';
      saveBtn.textContent = 'Сохранить';
      saveBtn.addEventListener('click', () => {
        siteContent.faq[index].question = questionInput.value.trim();
        siteContent.faq[index].answer = answerText.value.trim();
        saveSiteContent(siteContent);
        alert('FAQ обновлён!');
      });

      const delBtn = document.createElement('button');
      delBtn.className = 'admin-btn delete-btn';
      delBtn.textContent = 'Удалить';
      delBtn.addEventListener('click', () => {
        siteContent.faq.splice(index, 1);
        saveSiteContent(siteContent);
        renderFaqList();
      });

      btnWrap.appendChild(saveBtn);
      btnWrap.appendChild(delBtn);

      wrap.appendChild(questionInput);
      wrap.appendChild(answerText);
      wrap.appendChild(btnWrap);

      faqListEl.appendChild(wrap);
    });
  }
  renderFaqList();

  addFaqBtn.addEventListener('click', () => {
    const q = newFaqQuestion.value.trim();
    const a = newFaqAnswer.value.trim();
    if (!q || !a) {
      alert('Введите вопрос и ответ!');
      return;
    }
    siteContent.faq.push({ question: q, answer: a });
    saveSiteContent(siteContent);
    newFaqQuestion.value = "";
    newFaqAnswer.value = "";
    renderFaqList();
  });

  saveContentBtn.addEventListener('click', () => {
    siteContent.aboutText = aboutTextEl.value.trim();
    siteContent.contacts.phone = contactPhone.value.trim();
    siteContent.contacts.email = contactEmail.value.trim();
    siteContent.contacts.address = contactAddress.value.trim();
    siteContent.contacts.footerText = contactFooterText.value.trim();
    saveSiteContent(siteContent);
    alert('Контент сохранён!');
  });

  // -------------------- REVIEWS --------------------
  const reviewsTableBody = document.querySelector('#reviewsTable tbody');
  const editReviewIndex = document.getElementById('editReviewIndex');
  const reviewAuthor = document.getElementById('reviewAuthor');
  const reviewText = document.getElementById('reviewText');
  const reviewSocial = document.getElementById('reviewSocial');
  const saveReviewBtn = document.getElementById('saveReviewBtn');
  const reviewResetFormBtn = document.getElementById('reviewResetFormBtn');

  function renderReviewsTable() {
    reviewsTableBody.innerHTML = "";
    siteContent.reviews.forEach((rev, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${rev.author}</td>
        <td>${rev.text}</td>
        <td>${rev.social || ""}</td>
        <td>
          <button class="admin-btn" data-action="edit" data-idx="${idx}">Редакт</button>
          <button class="admin-btn delete-btn" data-action="delete" data-idx="${idx}">Удалить</button>
        </td>
      `;
      reviewsTableBody.appendChild(tr);
    });
  }
  renderReviewsTable();

  reviewsTableBody.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const action = e.target.getAttribute('data-action');
      const idx = parseInt(e.target.getAttribute('data-idx'), 10);
      if (action === 'edit') {
        const rev = siteContent.reviews[idx];
        editReviewIndex.value = idx;
        reviewAuthor.value = rev.author;
        reviewText.value = rev.text;
        reviewSocial.value = rev.social || '';
      } else if (action === 'delete') {
        siteContent.reviews.splice(idx, 1);
        saveSiteContent(siteContent);
        renderReviewsTable();
        reviewResetForm();
      }
    }
  });

  function reviewResetForm() {
    editReviewIndex.value = "";
    reviewAuthor.value = "";
    reviewText.value = "";
    reviewSocial.value = "";
  }
  reviewResetFormBtn.addEventListener('click', reviewResetForm);

  saveReviewBtn.addEventListener('click', () => {
    const idx = editReviewIndex.value.trim();
    const authorVal = reviewAuthor.value.trim();
    const textVal = reviewText.value.trim();
    const socialVal = reviewSocial.value.trim();
    if (!authorVal || !textVal) {
      alert('Введите имя автора и текст отзыва!');
      return;
    }

    if (idx === "") {
      // Добавление нового
      siteContent.reviews.push({
        author: authorVal,
        text: textVal,
        social: socialVal
      });
    } else {
      // Редактирование
      const i = parseInt(idx, 10);
      if (siteContent.reviews[i]) {
        siteContent.reviews[i].author = authorVal;
        siteContent.reviews[i].text = textVal;
        siteContent.reviews[i].social = socialVal;
      }
    }

    saveSiteContent(siteContent);
    renderReviewsTable();
    reviewResetForm();
    alert('Отзыв сохранён!');
  });
});