'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const learnMoreBtn = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const navLinks = document.querySelector('.nav__links');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const featureImages = document.querySelectorAll('img[data-src]');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotsContainer = document.querySelector('.dots');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//event listeners
learnMoreBtn.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  window.scrollTo({ left: s1coords.left + window.scrollX, top: s1coords.top + window.scrollY, behavior: 'smooth' });
});

//event delegation
navLinks.addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link') && !e.target.classList.contains('nav__link--btn')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//tabbed component
//event delegation
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;

  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //activate content area
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});

//menu fade animation
const hoverHandler = function (opacity, e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const nav = link.closest('.nav');
    const siblings = nav.querySelectorAll('.nav__link');
    const logo = nav.querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = opacity;
    });
    logo.style.opacity = opacity;
  }
}

nav.addEventListener('mouseover', hoverHandler.bind(this, 0.5));
//remove the effect on mouseout
nav.addEventListener('mouseout', hoverHandler.bind(this, 1));

//observer intersection API
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null, //viewport
  threshold: 0, //exactly where the section starts
  rootMargin: `-${navHeight}px`
});

headerObserver.observe(header);

//reveal sections
const revealSection = function (entries, observer) {
  const [entry] = entries;

  //guard
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//unblur images - lazy loading images
const revealImage = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    //will fire when the original image has been fully loaded as src (which was initiated at line #135)
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
}

const imageObserver = new IntersectionObserver(revealImage, {
  root: null,
  threshold: 0
});

featureImages.forEach(image => imageObserver.observe(image));

//slider
function slider() {
  let currSlide = 0; //initial slide
  const maxSlides = slides.length;

  const createDots = function () {
    slides.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`);
    });
  }

  const activateDot = function (slide) {
    //dots.querySelectorAll(...) will not work as dots would have been defined at the top of the script when it wasn't event created
    document.querySelectorAll('.dots__dot').forEach(el => el.classList.remove('dots__dot--active'));
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
  }

  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${(i - slide) * 100}%)`;
    });
    activateDot(slide);
  }

  const nextSlide = function () {
    if (currSlide === maxSlides - 1) {
      currSlide = 0;
    }
    else {
      currSlide++;
    }

    goToSlide(currSlide);
  }

  const prevSlide = function () {
    if (currSlide === 0) {
      currSlide = maxSlides - 1;
    }
    else {
      currSlide--;
    }

    goToSlide(currSlide);
  }

  const init = function () {
    createDots();
    goToSlide(0);
  }

  init();
  //event listeners
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);
  document.addEventListener('keydown', function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    else if (e.key === "ArrowRight") nextSlide();
  });

  //event delegation because we are creating dots__dot dynamically
  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      goToSlide(e.target.dataset.slide);
    }
  });
}

slider();