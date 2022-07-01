import 'modern-normalize';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchImages, reserPage, page } from './fetchImages';
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
  gallery.refresh();
  console.log(page);
  
  reserPage();
  console.log(page);
  window.scrollTo(0, 0);
  // blockImg.innerHTML = '';

  searchImg = formSearch.elements.searchQuery.value;

  if (searchImg === '') {
    return Notify.failure(
      'Sorry, the search field is empty. Please fill in the search field.');
  }
  
  // loadMoreBtn.classList.remove('is-visible');
  await fetchImages(searchImg).then(({ images, isLastPage, totalHits }) => {
    
    if (images.length === 0) {
      return Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.');
    }
    blockImg.innerHTML = createImgCards(images);
    // loadMoreBtn.classList.add('is-visible');
    gallery.refresh();
    Notify.success(`Hooray! We found ${totalHits} images.`);
  });


  const options = {
    rootMargin: '200px',
    threshold: 1.0,
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        console.log(entry);
        
        console.log('до функції ', page);
        fetchImages(searchImg).then(({ images, isLastPage, page, totalHits }) => {
          // if (images.length < per_page) { return }
            if (isLastPage) {
            return Notify.warning(
              'Sorry, but photos are over');
            }
          blockImg.insertAdjacentHTML('beforeend', createImgCards(images));
          gallery.refresh();
          smoothScrolling();
          console.log('після функції ', page);
        });
      }
      
    });
  }, options);
  if (page > 1) {
    observer.observe(document.querySelector('.scroll-guard'));
  }
  


  formSearch.reset();
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
