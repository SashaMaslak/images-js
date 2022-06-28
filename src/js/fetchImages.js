import axios from 'axios';
const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 4;
let page = DEFAULT_PAGE;
let per_page = DEFAULT_PER_PAGE;
export const reserPage = () => {
  page = DEFAULT_PAGE;
}

export const fetchImages = (searchImg) => {
  const searchParams = new URLSearchParams({
    key: '28271863-d0d50fdaf1b013fa8dcdf01ae',
    q: searchImg,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page,
  });

  return fetch(`https://pixabay.com/api/?${searchParams}`).then(res => {
    if (res.ok) {
      page += 1;
      return res.json();
    }
    throw new Error(res.statusText);
  }).then(data => {
    console.log(data);

    return {
      images: data.hits,
      totalHits: data.totalHits,
      isLastPage: page > (data.totalHits / per_page),
    }
  }
  );
}

