const apiKey = "347b74b5";
const Url = "https://www.omdbapi.com/";

async function fetchMovies(query) {
  try {
    const response = await fetch(`${Url}?apikey=${apiKey}&s=${query}`);
    if (!response.ok) {
      throw new Error("Failed to fetch movies");
    }
    const data = await response.json();
    if (data.Response === "False") {
      throw new Error(data.Error);
    }
    return data.Search;
  } catch (error) {
    console.error("Error fetching movies:", error);
    alert("Could not fetch movie data. Please try again.");
  }
}

const srch_btn = document.getElementById("search");
const input = document.getElementById("input");

srch_btn.addEventListener("click", async () => {
  const title = input.value.trim();
  if (title) {
    const data = await fetchMovies(title);
    if (data) {
      displayMovies(data);
    } else {
      alert("No movies found for this title, try something else.");
    }
  } else {
    alert("Please enter a movie title.");
  }
});

function displayMovies(movies) {
  const result = document.getElementById("results");
  result.innerHTML = ""; 
  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    movieCard.setAttribute("data-id", movie.imdbID); 
    const moviePoster = document.createElement("img");
    moviePoster.src = movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg";
    moviePoster.alt = movie.Title;
    const movieTitle = document.createElement("h3");
    movieTitle.textContent = movie.Title;
    const movieYear = document.createElement("p");
    movieYear.textContent = `Year: ${movie.Year}`;
    movieCard.appendChild(moviePoster);
    movieCard.appendChild(movieTitle);
    movieCard.appendChild(movieYear);
    result.appendChild(movieCard);
  });
  addMovieCardListeners(); 
}

async function fetchMovieDetails(id) {
  try {
    const res = await fetch(`${Url}?apikey=${apiKey}&i=${id}`);
    if (!res.ok) {
      throw new Error("Failed to fetch movie details.");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    alert("Could not fetch movie details, please try again.");
  }
}

async function showMovieDetails(id) {
  const movie = await fetchMovieDetails(id);
  if (movie) {
    const details = document.getElementById("details-content");
    details.innerHTML = `
      <h2><strong>${movie.Title} (${movie.Year})</h2>
      <img src="${movie.Poster}" alt="${movie.Title}" />
      <p><strong>Genre:</strong> ${movie.Genre}</p>
      <p><strong>Director:</strong> ${movie.Director}</p>
      <p><strong>Actors:</strong> ${movie.Actors}</p>
      <p><strong>Plot:</strong> ${movie.Plot}</p>
      <p><strong>IMDB Rating:</strong> ${movie.imdbRating}</p>
    `;
    document.getElementById("movie-details").classList.remove("hidden"); 
  }
}

document.getElementById("close-details").addEventListener("click", () => {
  document.getElementById("movie-details").classList.add("hidden");
});

function addMovieCardListeners() {
  const movieCards = document.querySelectorAll(".movie-card");
  movieCards.forEach(card => {
    card.addEventListener("click", () => {
      const imdbID = card.getAttribute("data-id");
      showMovieDetails(imdbID);
    });
  });
}