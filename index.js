

const autocompleteConfig = {
  renderOption :(movie)=>{

 if(movie.Poster==="N/A")  movie.Poster=""
  return `<img src="${movie.Poster}">
 ${movie.Title} (${movie.Year})`

},

inputValue:(movie)=>{
  return movie.Title;
},

fetchData: async searchTerm => {
  const response = await axios.get('https://www.omdbapi.com/', {
    params: {
      apikey: 'd9835cc5',
      s: searchTerm
    }
  });

  if(response.data.Error)
    return [];

  return response.data.Search;
}
}


autocomplete({
  ...autocompleteConfig,
  root : document.querySelector("#left-autocomplete"),
  onOptionSelect : (movie)=>{
  document.querySelector(".tutorial").classList.add("is-hidden");
onMovieSelect(movie,document.querySelector("#left-summary"),"left");
}
})

autocomplete({
  ...autocompleteConfig,
  root : document.querySelector("#right-autocomplete"),
  onOptionSelect : (movie)=>{
  document.querySelector(".tutorial").classList.add("is-hidden");
onMovieSelect(movie,document.querySelector("#right-summary"),"right");
}
})



let leftMovie;
let rightMovie;
const onMovieSelect = async (movie,summaryElement,side)=>{
const response = await axios.get('https://www.omdbapi.com/', {
    params: {
      apikey: 'd9835cc5',
      i: movie.imdbID
    }
  });
  summaryElement.innerHTML = movieTemplate(response.data)
  if(side==="left")
    leftMovie = side;
  else
    rightMovie= side;
  if(leftMovie && rightMovie)
    runComparison();

}
const runComparison= ()=>{
  const leftSideStat = document.querySelectorAll("#left-summary .notification");
  const rightSideStat = document.querySelectorAll("#right-summary .notification");
  leftSideStat.forEach((leftStat,index)=>{
    const rightStat = rightSideStat[index];

    const leftStatValue = parseInt(leftStat.dataset.value);
     const rightStatValue = parseInt(rightStat.dataset.value);
     if(rightStatValue>leftStatValue){
      leftStat.classList.remove("is-primary");
      leftStat.classList.add("is-warning");
     }
     else if(rightStatValue<leftStatValue){
      rightStat.classList.remove("is-primary");
      rightStat.classList.add("is-warning");
     }else{
      rightStat.classList.remove("is-primary");
      rightStat.classList.add("is-info");
       leftStat.classList.remove("is-primary");
      leftStat.classList.add("is-info");
     }
     
  })
}
const movieTemplate = movieDetail => {

  const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g,"").replace(/,/g,""));
  const Metascore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g,""));
  const Awards =movieDetail.Awards.split(" ").reduce((prev,word)=>{
    const value = parseInt(word);
    if(isNaN(value))
      return prev;
    else
      return prev+value;
  },0);
  console.log(dollars,imdbVotes,imdbRating,Metascore,Awards);
  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article data-value=${Awards} class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value=${dollars} class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article data-value=${Metascore}  class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${imdbRating}  class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>

  `;
};


