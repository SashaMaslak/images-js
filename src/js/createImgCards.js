export const createImgCards = (images) => {
   return images.map(
      ({
         webformatURL,
         largeImageURL,
         tags,
         likes,
         views,
         comments,
         downloads,
      }) => `
         <a class="gallery__link" href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" class="img gallery__img"/>
            <div class="img__info">
               <p class="img__info-item">
                  <b>Likes: ${likes}</b>
               </p>
               <p class="img__info-item">
                  <b>Views: ${views}</b>
               </p>
               <p class="img__info-item">
                  <b>Comments: ${comments}</b>
               </p>
               <p class="img__info-item">
                  <b>Downloads: ${downloads}</b>
               </p>
            </div>
         </a>
      `).join('');
}