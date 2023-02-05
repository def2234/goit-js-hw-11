import axios from 'axios';

const API_URL = 'https://pixabay.com/api/';
const API_KEY = '33349604-d98837e0ddc559622cee86d09';
const PARAMETERS_REQUEST =
  '&image_type=photo&orientation=horizontal&safesearch=true';

class SearchImage {
  constructor() {
    this.queryPage = 1;
    this.inputValue = '';
  }
  async fetchImages() {
    const response = await axios.get(
      `${API_URL}?key=${API_KEY}&q=${this.inputValue}${PARAMETERS_REQUEST}&per_page=40&page=${this.queryPage}`
    );

    let responsePage = await this.incrementPge();

    return response.data;
  }

  resetPage() {
    this.queryPage = 1;
  }

  async incrementPge() {
    return (this.queryPage += 1);
  }
}

export { SearchImage };
