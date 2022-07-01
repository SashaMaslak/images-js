import 'modern-normalize';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchImages, reserPage, isLastPage } from './fetchImages';
import { createImgCards } from './createImgCards';
import { gallery } from './lightbox';

const blockImg = document.querySelector('.gallery');

const formSearch = document.querySelector('#search-form');
formSearch.addEventListener('submit', submitImgBlock);
let searchImg = '';

async function submitImgBlock(event) {
  event.preventDefault();
  gallery.refresh();
  reserPage();
  window.scrollTo(0, 0);

  searchImg = formSearch.elements.searchQuery.value;

  if (searchImg === '') {
    return Notify.failure(
      'Sorry, the search field is empty. Please fill in the search field.');
  }
  await fetchImages(searchImg).then(({ images, isLastPage, totalHits }) => {
    
    if (images.length === 0) {
      return Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.');
    }
    blockImg.innerHTML = createImgCards(images);
    gallery.refresh();
    Notify.success(`Hooray! We found ${totalHits} images.`);
  });


  const options = {
    rootMargin: '200px',
    threshold: 0.1,
  };

  const observer = new IntersectionObserver(entries => {
    
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        fetchImages(searchImg).then(({ images, isLastPage, page, totalHits }) => {
            
          blockImg.insertAdjacentHTML('beforeend', createImgCards(images));
          gallery.refresh();
          smoothScrolling();
          if (isLastPage) {
            observer.unobserve(document.querySelector('.scroll-guard'));
            return Notify.warning("We're sorry, but you've reached the end of search results.");
            }
        });
      }
    });
  }, options);

    observer.observe(document.querySelector('.scroll-guard'));
    
  formSearch.addEventListener('click', () => {
    observer.unobserve(document.querySelector('.scroll-guard'));
  });
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






// const elem = document.getElementById('block');

// document.addEventListener('scroll', onScroll);

// function onScroll() {
//   const posTop = elem.getBoundingClientRect().top;
  
//   if(posTop + elem.clientHeight <= window.innerHeight && posTop >= 0) {
//     elem.classList.add('visible');
//     document.removeEventListener('scroll', onScroll);
//   }
// }