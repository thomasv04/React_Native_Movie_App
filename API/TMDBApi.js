const API_TOKEN = "3ca1ce4c7cfbb769c8d328fd2eec6e25"

export function getFilmsFromApiWithSearchedText(text, page) {
    const url = 'https://api.themoviedb.org/3/search/movie?api_key=' + API_TOKEN + '&language=fr&query=' + text + '&page=' +page
    return fetch(url)
        .then((response) => response.json())
        .catch((error) => console.log(error))

}

export function getImageFromApi(name, taille){
    return 'https://image.tmdb.org/t/p/w'+taille+'/' + name
}

export function getFilmDetailFromApi (id) {
    return fetch('https://api.themoviedb.org/3/movie/' + id + '?api_key=' + API_TOKEN + '&language=fr')
      .then((response) => response.json())
      .catch((error) => console.error(error));
}