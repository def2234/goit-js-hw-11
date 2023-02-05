import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { SearchImage } from './fetchImages.js';

const formEl = document.querySelector('#search-form');
const divEl = document.querySelector('.gallery');
const btnEl = document.querySelector('.load-more');

formEl.addEventListener('submit', onClickSearchImage);
btnEl.addEventListener('click', onBtnFetchImage);

const gallery = new SimpleLightbox('.gallery a');

const searchImage = new SearchImage();

BtnHide();
let totalImages = [];

function onClickSearchImage(e) {
  e.preventDefault();
  const input = e.currentTarget;
  searchImage.inputValue = input.elements.searchQuery.value;

  if (searchImage.inputValue === '') {
    return;
  }

  clearMarkup();
  searchImage.resetPage();
  onBtnFetchImage();
  BtnShow();
}

async function onBtnFetchImage() {
  try {
    const imeges = await searchImage.fetchImages();

    searchQueryValidation(imeges);
    checkingTheNumberOfRequests(imeges);

    const markup = imeges.hits.map(image => createMarkup(image)).join('');
    updateImages(markup);

    gallery.refresh();
  } catch (error) {
    onError(error);
  }
}

function createMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<a href="${largeImageURL}">
  <div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <span>Likes</span>
        <b>${likes}</b>
      </p>
      <p class="info-item">
        <span>Views</span>
        <b>${views}</b>
      </p>
      <p class="info-item">
        <span>Comments</span>
        <b>${comments}</b>
      </p>
      <p class="info-item">
        <span>Downloads</span>
        <b>${downloads}</b>
      </p>
    </div>
  </div>
</a>`;
}

function updateImages(markup) {
  divEl.insertAdjacentHTML('beforeend', markup);
}

function clearMarkup() {
  divEl.innerHTML = '';
}

function onError(error) {
  console.log(error);
}

function BtnHide() {
  btnEl.classList.add('load-more-hidden');
}

function BtnShow() {
  btnEl.classList.remove('load-more-hidden');
}

function searchQueryValidation({ hits }) {
  if (hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    BtnHide();
    clearMarkup();
  }
}

function checkingTheNumberOfRequests({ hits }) {
  hits.map(hit => {
    totalImages.push(hit);
    if (totalImages.length === 500) {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      BtnHide();
    }
  });
}
