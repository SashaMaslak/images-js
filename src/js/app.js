import 'modern-normalize';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchImages, reserPage } from './fetchImages';
import { createImgCards } from './createImgCards';
import { gallery } from './lightbox';

const blockImg = document.querySelector('.gallery');
// const loadMoreBtn = document.querySelector('.load-more');
// loadMoreBtn.addEventListener('click', () => {

// })

const formSearch = document.querySelector('#search-form');
formSearch.addEventListener('submit', submitImgBlock);
let searchImg = '';

async function submitImgBlock(event) {
  event.preventDefault();
  searchImg = formSearch.elements.searchQuery.value;

  if (searchImg === '') {
    return Notify.failure(
      'Sorry, the search field is empty. Please fill in the search field.',
      {
        ID: 'MKA',
        timeout: 2500,
        width: '280px',
        position: 'top-right',
      }
    );
  }
  reserPage();
  // loadMoreBtn.classList.remove('is-visible');
  await fetchImages(searchImg).then(({ images, isLastPage, totalHits }) => {
    if (images.length === 0) {
      return Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.',
        {
          ID: 'MKA',
          timeout: 2500,
          width: '280px',
          textColor: '#f0f',
          position: 'top-right',
        }
      );
    }
    blockImg.innerHTML = createImgCards(images);
    // loadMoreBtn.classList.add('is-visible');
    gallery.refresh();
    Notify.success(`Hooray! We found ${totalHits} images.`, {
      ID: 'MKA',
      timeout: 2500,
      width: '280px',
      textColor: '#f0f',
      position: 'top-right',
    });
  });

  const options = {
    rootMargin: '200px',
    threshold: 1.0,
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        fetchImages(searchImg).then(({ images, isLastPage, totalHits }) => {
          blockImg.insertAdjacentHTML('beforeend', createImgCards(images));
          gallery.refresh();
          smoothScrolling();
          // if (isLastPage) {
          //    loadMoreBtn.classList.remove('is-visible');
          // }
        });
      }
    });
  }, options);

  observer.observe(document.querySelector('.scroll-guard'));
}

new SimpleLightbox('.gallery a', {
  captions: true,
  captionSelector: 'img',
  captionType: 'attr',
  captionsData: 'alt',
  captionDelay: 250,
});

function smoothScrolling() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 1.2,
    behavior: 'smooth',
  });
}
