
const showSelect = document.getElementById("show-select");
const showDetails = document.getElementById("show-details");
const message = document.getElementById("message");

// Options used for both TMDB requests
const requestOptions = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_TOKEN}`
    }
};

// Display loading and error messages
function showMessage(text) {
    message.textContent = text;

    if (text === "") {
        message.className = "";
    } else if (text.startsWith("Loading")) {
        message.className = "loading";
    } else {
        message.className = "error";
    }
}

// Populate the dropdown with popular shows
function fillDropdown(shows) {
    showSelect.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select a show";
    showSelect.appendChild(placeholder);

    for (const show of shows) {
        const option = document.createElement("option");
        option.value = show.id;
        option.textContent = show.name;
        showSelect.appendChild(option);
    }
}

// Display the selected show's information
function displayDetails(show) {
    showDetails.innerHTML = "";

    const layout = document.createElement("div");
    layout.className = "show-layout";

    // Create the poster
    const posterContainer = document.createElement("div");
    posterContainer.className = "poster-container";

    if (show.poster_path) {
        const poster = document.createElement("img");
        poster.src = `https://image.tmdb.org/t/p/w500${show.poster_path}`;
        poster.alt = `${show.name} poster`;
        posterContainer.appendChild(poster);
    } else {
        const noPoster = document.createElement("p");
        noPoster.textContent = "No poster available";
        posterContainer.appendChild(noPoster);
    }

    // Create the information container
    const info = document.createElement("div");
    info.className = "show-info";

    const heading = document.createElement("h2");
    heading.textContent = show.name;
    info.appendChild(heading);

    const overview = document.createElement("p");
    overview.textContent = show.overview || "No overview available.";
    overview.className = "overview";
    info.appendChild(overview);

    // Display genres
    const genres = [];

    for (const genre of show.genres) {
        genres.push(genre.name);
    }

    const genreText = document.createElement("p");
    genreText.textContent = "Genres: " + genres.join(", ");
    info.appendChild(genreText);

    // Display seasons
    const seasons = document.createElement("p");
    seasons.textContent = "Seasons: " + show.number_of_seasons;
    info.appendChild(seasons);

    // Display episodes
    const episodes = document.createElement("p");
    episodes.textContent = "Episodes: " + show.number_of_episodes;
    info.appendChild(episodes);

    // Display status
    const status = document.createElement("p");
    status.textContent = "Status: " + show.status;
    info.appendChild(status);

    // Put everything together
    layout.appendChild(posterContainer);
    layout.appendChild(info);
    showDetails.appendChild(layout);
}

// Request popular shows from TMDB
async function loadPopularShows() {
    const url = "https://api.themoviedb.org/3/tv/popular";

    showMessage("Loading popular shows...");

    try {
        const res = await fetch(url, requestOptions);

        if (!res.ok) {
            if (res.status === 401) {
                throw new Error("TMDB token rejected. Please check your API Read Access Token.");
            }

            throw new Error(`Request failed with status ${res.status}`);
        }

        const data = await res.json();

        showMessage("");
        fillDropdown(data.results);

    } catch (error) {
        showMessage(error.message);
        console.error(error);
    }
}

// Request details for the selected show
async function loadShowDetails(id) {
    const url = `https://api.themoviedb.org/3/tv/${id}`;

    showMessage("Loading show details...");

    try {
        const res = await fetch(url, requestOptions);

        if (!res.ok) {
            if (res.status === 401) {
                throw new Error("TMDB token rejected. Please check your API Read Access Token.");
            }

            throw new Error(`Request failed with status ${res.status}`);
        }

        const show = await res.json();

        showMessage("");
        displayDetails(show);

    } catch (error) {
        showMessage(error.message);
        console.error(error);
    }
}

// Listen for changes to the dropdown
showSelect.addEventListener("change", function () {
    const id = showSelect.value;

    if (id === "") {
        showDetails.innerHTML = "";
        return;
    }

    loadShowDetails(id);
});

// Load popular shows when the page opens
loadPopularShows();
