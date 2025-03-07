(function() {
  'use strict';

  // -------------------- Заглушка: дефолтные экскурсии --------------------
  const defaultToursData = [
    {
      id: "1",
      title: "Речная прогулка по каналам",
      info: "Маршрут: Невский пр., река Мойка, канал Грибоедова.\nДлительность: ~1,5 часа.\nОписание: Прогулка по историческим каналам.",
      images: ["images/image1.jpeg", "images/image2.jpeg"],
      priceGroup: 1500,
      priceIndividual: 2000,
      shortInfo: "На теплоходе по рекам и каналам",
      schedule: "Ежедневно 12:00, 14:00, 16:00",
      active: true,
      file: "tours/tour1.html"
    },
    {
      id: "2",
      title: "Ночной развод мостов",
      info: "Старт в 00:30, длительность: ~2 часа.\nОписание: Ночная прогулка с видом на развод мостов.",
      images: ["images/briges_background.jpeg"],
      priceGroup: 2000,
      priceIndividual: 2500,
      shortInfo: "Ночное шоу разводных мостов",
      schedule: "01:00 – 03:00 (ночью)",
      active: true,
      file: "tours/tour2.html"  // например, tour2.html
    },
    {
      id: "3",
      title: "Дворцовый Петербург",
      info: "Зимний дворец, Михайловский дворец, особняки на набережной.\nОписание: Экскурсия по дворцовым комплексам Петербурга.",
      images: ["images/tour3.jpeg"],
      priceGroup: 1800,
      priceIndividual: 2300,
      shortInfo: "Экскурсия по знаменитым дворцам",
      schedule: "Пт, Сб, Вс - 12:00 и 16:00",
      active: true,
      file: "tours/tour3.html"  // например, tour3.html
    }
  ];

  // -------------------- Дефолтный контент (FAQ, ABOUT, REVIEWS) --------------------
  const defaultContent = {
    aboutText: "",
    contacts: {
      phone: "+7 (999) 123-45-67",
      email: "info@spbinside.ru",
      address: "Невский проспект, д. 10, Санкт-Петербург",
      footerText: ""
    },
    faq: [
      {
        question: "Можно ли оплатить экскурсию онлайн?",
        answer: "Да, мы принимаем онлайн-оплату (карты Visa/MasterCard). После оформления заявки с вами свяжется менеджер и пришлёт ссылку на оплату."
      },
      {
        question: "Есть ли скидки для групп?",
        answer: "Да, при бронировании от 10 человек предусмотрены скидки. Подробности можно уточнить у менеджера."
      },
      {
        question: "Как отменить или перенести экскурсию?",
        answer: "Достаточно связаться с нами по телефону или электронной почте. Перенос возможен при наличии свободных мест."
      }
    ],
    reviews: [
      {
        author: "Мария",
        text: "Очень понравилась экскурсия по рекам и каналам! Гид замечательный, много интересных фактов услышали!",
        social: "instagram"
      },
      {
        author: "Андрей",
        text: "Отличная организация, всё чётко по времени, автобусы комфортные, успели посмотреть весь город!",
        social: "google"
      },
      {
        author: "Светлана",
        text: "Спонтанно решили пойти на ночную экскурсию по разводным мостам – осталось незабываемое впечатление!",
        social: "instagram"
      }
    ]
  };

  // -------------------- LocalStorage: TOURS --------------------
  function getToursFromStorage() {
    const toursStr = localStorage.getItem('spbTours');
    if (!toursStr) {
      localStorage.setItem('spbTours', JSON.stringify(defaultToursData));
      return defaultToursData;
    }
    try {
      return JSON.parse(toursStr);
    } catch (e) {
      console.error('Ошибка парсинга spbTours:', e);
      return defaultToursData;
    }
  }
  function saveToursToStorage(arr) {
    localStorage.setItem('spbTours', JSON.stringify(arr));
  }

  // -------------------- LocalStorage: SITE CONTENT --------------------
  function getSiteContentFromStorage() {
    const contentStr = localStorage.getItem('spbSiteContent');
    if (!contentStr) {
      localStorage.setItem('spbSiteContent', JSON.stringify(defaultContent));
      return defaultContent;
    }
    try {
      return JSON.parse(contentStr);
    } catch (e) {
      console.error('Ошибка парсинга spbSiteContent:', e);
      return defaultContent;
    }
  }
  function saveSiteContentToStorage(obj) {
    localStorage.setItem('spbSiteContent', JSON.stringify(obj));
  }

  const toursData = getToursFromStorage();
  const siteContent = getSiteContentFromStorage();

  // -------------------- Рендер Экскурсий (active -> впереди, inactive -> в конце) --------------------
  const toursContainer = document.getElementById('toursContainer');
  function renderTours() {
    if (!toursContainer) return; // вдруг мы не на index.html

    toursContainer.innerHTML = "";

    const activeTours = toursData.filter(t => t.active);
    const inactiveTours = toursData.filter(t => !t.active);

    function drawCard(tour, isActive) {
      const card = document.createElement('div');
      card.className = 'tour__card';
      if (!isActive) {
        card.classList.add('inactive');
      }
      // Image
      const imageDiv = document.createElement('div');
      imageDiv.className = 'tour__image';
      const imgEl = document.createElement('img');
      imgEl.src = (tour.images && tour.images.length) ? tour.images[0] : 'images/placeholder.jpg';
      imgEl.alt = tour.title;
      imageDiv.appendChild(imgEl);

      const contentDiv = document.createElement('div');
      contentDiv.className = 'tour__content';

      const titleEl = document.createElement('h3');
      titleEl.className = 'tour__title';
      titleEl.textContent = tour.title;

      const infoEl = document.createElement('p');
      infoEl.className = 'tour__info';
      infoEl.textContent = tour.shortInfo || "";

      const buttonEl = document.createElement('a');
      buttonEl.className = 'btn btn--primary tour__button';

      if (isActive) {
        buttonEl.textContent = 'Подробнее';
        // Если в админке указали файл, ведём на него. Иначе fallback на tour.html?id=
      if (tour.file && tour.file.trim() !== "") {
        buttonEl.href = tour.file.trim();
      } else {
        // fallback
        buttonEl.href = "tour.html?id=" + tour.id;
      }
      } else {
        buttonEl.textContent = 'Не проводится';
        buttonEl.style.pointerEvents = 'none';
        buttonEl.style.opacity = '0.6';
      }

      contentDiv.appendChild(titleEl);
      contentDiv.appendChild(infoEl);
      contentDiv.appendChild(buttonEl);

      card.appendChild(imageDiv);
      card.appendChild(contentDiv);
      toursContainer.appendChild(card);
    }

    // Активные
    activeTours.forEach(t => drawCard(t, true));
    // Неактивные
    inactiveTours.forEach(t => drawCard(t, false));
  }
  renderTours();

  // -------------------- САЙДБАР БРОНИРОВАНИЯ --------------------
  const bookingSidebar = document.getElementById('bookingSidebar');
  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
  const bookingForm = document.getElementById('bookingForm');
  const bookingTourSelect = document.getElementById('bookingTourSelect');
  const bookingTypeSelect = document.getElementById('bookingTypeSelect');
  const bookingTimeSelect = document.getElementById('bookingTimeSelect');
  const bookingDateField = document.getElementById('bookingDateField');
  const adultCountEl = document.getElementById('adultCount');
  const childCountEl = document.getElementById('childCount');
  const totalPriceEl = document.getElementById('totalPrice');
  const bookingTourTitle = document.getElementById('bookingTourTitle');
  const bookingTourImg = document.getElementById('bookingTourImg');

  // Заполняем select экскурсиями (только активными)
  function fillBookingTourSelect() {
    if (!bookingTourSelect) return;
    bookingTourSelect.innerHTML = '<option value="" disabled selected>Выбрать экскурсию</option>';
    toursData.forEach(t => {
      if (t.active) {
        const opt = document.createElement('option');
        opt.value = t.title;
        opt.textContent = t.title;
        bookingTourSelect.appendChild(opt);
      }
    });
  }
  fillBookingTourSelect();

  function findTourByTitle(title) {
    return toursData.find(t => t.title === title && t.active);
  }

  function updateTotalPrice() {
    if (!totalPriceEl) return;
    const adultCount = parseInt(adultCountEl.innerText, 10);
    const childCount = parseInt(childCountEl.innerText, 10);
    let totalPrice = 0;

    const selectedTour = findTourByTitle(bookingTourSelect.value);
    if (selectedTour && bookingTypeSelect.value) {
      if (bookingTypeSelect.value === 'Групповая') {
        totalPrice = selectedTour.priceGroup * adultCount 
                   + Math.round(selectedTour.priceGroup * 0.67) * childCount;
      } else {
        totalPrice = selectedTour.priceIndividual * adultCount
                   + Math.round(selectedTour.priceIndividual * 0.67) * childCount;
      }
    }
    totalPriceEl.innerText = totalPrice;
  }
  const counterBtns = document.querySelectorAll('.counter__btn');
  counterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      const targetId = btn.getAttribute('data-target');
      const countEl = document.getElementById(targetId);
      let count = parseInt(countEl.innerText, 10);
      if (action === 'increase') count++;
      if (action === 'decrease' && count > 0) count--;
      countEl.innerText = count;
      updateTotalPrice();
    });
  });
  if (bookingTourSelect) {
    bookingTourSelect.addEventListener('change', () => {
        const found = findTourByTitle(bookingTourSelect.value);
        if (found) {
            bookingTourTitle.textContent = found.title;
            bookingTourImg.src = (found.images && found.images.length)
                ? found.images[0]
                : 'images/placeholder.jpg'; // Если нет фото, ставим заглушку
            bookingTourImg.style.display = "block";
        } else {
            bookingTourTitle.textContent = 'Бронирование';
            bookingTourImg.src = '';
            bookingTourImg.style.display = "none";
        }
        updateTotalPrice();
    });
  }
  if (bookingTypeSelect) {
    bookingTypeSelect.addEventListener('change', updateTotalPrice);
  }

  // Открыть/закрыть сайдбар — при желании можно вызывать извне
  window.openBookingSidebar = function(preselectedTour) {
    if (!bookingSidebar) return;
    bookingSidebar.setAttribute('aria-hidden', 'false');
    bookingSidebar.style.right = '0';
    siteOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Сброс
    fillBookingTourSelect();
    if (bookingTourSelect) bookingTourSelect.value = '';
    if (bookingTypeSelect) bookingTypeSelect.value = '';
    if (bookingDateField) bookingDateField.value = '';
    if (adultCountEl) adultCountEl.innerText = '1';
    if (childCountEl) childCountEl.innerText = '0';
    if (totalPriceEl) totalPriceEl.innerText = '0';
    if (bookingTourTitle) bookingTourTitle.textContent = 'Бронирование';
    if (bookingTourImg) bookingTourImg.src = '';

    // Если хотим сразу выбрать тур
    if (preselectedTour) {
      const found = findTourByTitle(preselectedTour);
      if (found) {
        bookingTourSelect.value = found.title;
        bookingTourTitle.textContent = found.title;
        bookingTourImg.src = (found.images && found.images.length)
          ? found.images[0]
          : '';
        updateTotalPrice();
      }
    }
  };
  window.closeBookingSidebar = function() {
    if (!bookingSidebar) return;
    bookingSidebar.setAttribute('aria-hidden', 'true');
    bookingSidebar.style.right = '-100%';
    siteOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', window.closeBookingSidebar);
  }
  if (bookingSidebar) {
    bookingSidebar.addEventListener('click', (e) => {
      if (e.target === bookingSidebar) {
        window.closeBookingSidebar();
      }
    });
  }
  
  document.querySelectorAll("#bookingSidebar input, #bookingSidebar select").forEach(el => {
    el.style.border = "2px solid #ccc";
    el.style.borderRadius = "6px";
    el.style.padding = "8px";
    el.style.fontSize = "16px";
  });

  // -------------------- Клик по overlay => закрыть сайдбар (и быстр.модалку) --------------------
  const siteOverlay = document.getElementById('siteOverlay');
  if (siteOverlay) {
    siteOverlay.addEventListener('click', () => {
      // Быстрая Hero-модалка
      const qbModal = document.getElementById('quickBookingModal');
      if (qbModal && qbModal.getAttribute('aria-hidden') === 'false') {
        qbModal.setAttribute('aria-hidden','true');
      }
      // Сайдбар
      if (bookingSidebar && bookingSidebar.getAttribute('aria-hidden') === 'false') {
        window.closeBookingSidebar();
      }
    });
  }

  // -------------------- Отправка формы (сайдбар) --------------------
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameVal = document.getElementById('bookingNameField').value.trim();
      const phoneVal = document.getElementById('bookingPhoneField').value.trim();
      if (!nameVal || !phoneVal) {
        alert('Заполните имя и телефон!');
        return;
      }
      alert('Спасибо! Ваша заявка отправлена.');
      bookingForm.reset();
      window.closeBookingSidebar();
    });
  }

  // -------------------- КНОПКА ВВЕРХ --------------------
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  window.addEventListener('scroll', debounce(() => {
    if (!scrollTopBtn) return;
    if (window.scrollY > 300) {
      scrollTopBtn.style.opacity = '1';
      scrollTopBtn.style.pointerEvents = 'auto';
    } else {
      scrollTopBtn.style.opacity = '0';
      scrollTopBtn.style.pointerEvents = 'none';
    }
  }, 100));

  // -------------------- БУРГЕР-МЕНЮ --------------------
  const burgerBtn = document.getElementById('burgerBtn');
  const mainNav = document.getElementById('mainNav');
  if (burgerBtn && mainNav) {
    burgerBtn.addEventListener('click', () => {
      burgerBtn.classList.toggle('open');
      mainNav.classList.toggle('open');
    });
    document.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        burgerBtn.classList.remove('open');
        mainNav.classList.remove('open');
      });
    });
  }

  // -------------------- ЛОГО => РЕДИРЕКТ НА index.html --------------------
  const logoEl = document.getElementById('logo');
  if (logoEl) {
    logoEl.addEventListener('click', () => {
      window.location.href = "/index.html";
    });
  }

  // -------------------- ПЛАВНАЯ ПРОКРУТКА data-scroll --------------------
  document.querySelectorAll('[data-scroll]').forEach(btn => {
    btn.addEventListener('click', function() {
      const targetId = this.getAttribute('data-scroll');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        window.scrollTo({ top: targetEl.offsetTop - 70, behavior: 'smooth' });
      }
    });
  });

  // -------------------- АНИМАЦИЯ ПОЯВЛЕНИЯ СЕКЦИЙ --------------------
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.scroll-section').forEach(el => {
    observer.observe(el);
  });

  // -------------------- FAQ --------------------
  const faqContainer = document.getElementById('faqContainer');
  function renderFAQ() {
    if (!faqContainer) return;
    faqContainer.innerHTML = "";
    if (!siteContent.faq) return;
    siteContent.faq.forEach(item => {
      const wrap = document.createElement('div');
      wrap.className = 'faq__item';

      const questionBtn = document.createElement('button');
      questionBtn.className = 'faq__question';
      questionBtn.setAttribute('aria-expanded', 'false');
      questionBtn.textContent = item.question;

      const answerDiv = document.createElement('div');
      answerDiv.className = 'faq__answer';
      answerDiv.innerHTML = `<p>${item.answer}</p>`;

      questionBtn.addEventListener('click', () => {
        const expanded = questionBtn.getAttribute('aria-expanded') === 'true';
        questionBtn.setAttribute('aria-expanded', String(!expanded));
        answerDiv.classList.toggle('open', !expanded);
      });

      wrap.appendChild(questionBtn);
      wrap.appendChild(answerDiv);
      faqContainer.appendChild(wrap);
    });
  }
  renderFAQ();

  // -------------------- ABOUT / CONTACTS --------------------
  const aboutCompanyText = document.getElementById('aboutCompanyText');
  if (aboutCompanyText && siteContent.aboutText) {
    aboutCompanyText.textContent = siteContent.aboutText;
  }

  const footerPhone = document.getElementById('footerPhone');
  const footerEmail = document.getElementById('footerEmail');
  const footerAddress = document.getElementById('footerAddress');
  const footerAdditionalText = document.getElementById('footerAdditionalText');
  if (siteContent.contacts) {
    if (footerPhone) footerPhone.textContent = siteContent.contacts.phone || "";
    if (footerEmail) footerEmail.textContent = siteContent.contacts.email || "";
    if (footerAddress) footerAddress.textContent = siteContent.contacts.address || "";
    if (footerAdditionalText) footerAdditionalText.textContent = siteContent.contacts.footerText || "";
  }

  // -------------------- ОТЗЫВЫ --------------------
  const reviewsContainer = document.getElementById('reviewsContainer');
  function renderReviews() {
    if (!reviewsContainer || !siteContent.reviews) return;
    reviewsContainer.innerHTML = "";
    siteContent.reviews.forEach(rev => {
      const card = document.createElement('div');
      card.className = 'review__card';

      let iconHTML = '';
      if (rev.social === 'instagram') {
        iconHTML = '<i class="fab fa-instagram review__social-icon"></i>';
      } else if (rev.social === 'google') {
        iconHTML = '<i class="fab fa-google review__social-icon"></i>';
      }
      // Автор
      const authorEl = document.createElement('div');
      authorEl.className = 'review__author';
      authorEl.innerHTML = `${iconHTML}${rev.author}`;
      // Текст
      const textEl = document.createElement('div');
      textEl.className = 'review__text';
      textEl.textContent = `«${rev.text}»`;

      card.appendChild(authorEl);
      card.appendChild(textEl);
      reviewsContainer.appendChild(card);
    });
  }
  renderReviews();

  // -------------------- Быстрая модалка Hero --------------------
  const quickBookingModal = document.getElementById('quickBookingModal');
  const bookNowBtn = document.getElementById('bookNowBtn');
  const quickBookingClose = document.getElementById('quickBookingClose');
  const quickBookingSubmit = document.getElementById('quickBookingSubmit');
  const quickBookingPhone = document.getElementById('quickBookingPhone');

  if (bookNowBtn && quickBookingModal) {
    bookNowBtn.addEventListener('click', () => {
      quickBookingModal.setAttribute('aria-hidden','false');
      siteOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }
  if (quickBookingClose) {
    quickBookingClose.addEventListener('click', () => {
      quickBookingModal.setAttribute('aria-hidden','true');
      siteOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
  if (quickBookingSubmit && quickBookingPhone) {
    quickBookingSubmit.addEventListener('click', () => {
      if (!quickBookingPhone.value.trim()) {
        alert('Введите телефон!');
        return;
      }
      alert('Спасибо! Мы скоро свяжемся с вами.');
      quickBookingModal.setAttribute('aria-hidden','true');
      siteOverlay.classList.remove('active');
      document.body.style.overflow = '';
      quickBookingPhone.value = "";
    });
  }

  // -------------------- DEBOUNCE --------------------
  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
})();
document.querySelectorAll("#bookingSidebar input, #bookingSidebar select").forEach(el => {
  el.style.border = "2px solid #ccc";
  el.style.borderRadius = "6px";
  el.style.padding = "8px";
  el.style.fontSize = "16px";
  el.style.width = "100%";  // Растягиваем элементы на всю ширину
  el.style.boxSizing = "border-box";
  el.style.marginBottom = "10px"; // Добавляем отступы между элементами
});

// Выравниваем кнопки + и -
document.querySelectorAll(".counter").forEach(counter => {
  counter.style.display = "flex";
  counter.style.alignItems = "center";
  counter.style.justifyContent = "space-between";
  counter.style.maxWidth = "120px";
});

document.querySelectorAll(".counter__btn").forEach(btn => {
  btn.style.border = "2px solid #007bff";
  btn.style.borderRadius = "6px";
  btn.style.padding = "5px 10px";
  btn.style.fontSize = "18px";
  btn.style.cursor = "pointer";
  btn.style.transition = "background 0.3s ease";
});

document.querySelectorAll(".counter__btn:hover").forEach(btn => {
  btn.style.background = "#007bff";
  btn.style.color = "white";
});
// -------------------- ПЛАВНОЕ ПОЯВЛЕНИЕ КОНТЕНТА --------------------
document.addEventListener("DOMContentLoaded", () => {
  const fadeInElements = document.querySelectorAll(".fade-in");

  const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        fadeInObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  fadeInElements.forEach(el => fadeInObserver.observe(el));
});

// Закрытие меню при клике вне него
document.addEventListener('click', (event) => {
  const burgerBtn = document.getElementById('burgerBtn');
  const mainNav = document.getElementById('mainNav');

  if (burgerBtn && mainNav) {
    const isClickInsideMenu = mainNav.contains(event.target) || burgerBtn.contains(event.target);
    if (!isClickInsideMenu && mainNav.classList.contains('open')) {
      burgerBtn.classList.remove('open');
      mainNav.classList.remove('open');
    }
  }
});

// -------------------- ПЛАВНОЕ ПОЯВЛЕНИЕ ПРИ ЗАГРУЗКЕ --------------------
document.addEventListener("DOMContentLoaded", () => {
  const fadeInLoadElements = document.querySelectorAll(".fade-in-load");

  fadeInLoadElements.forEach(el => {
    setTimeout(() => {
      el.classList.add("visible");
    }, 300); // Задержка перед появлением контента
  });
});