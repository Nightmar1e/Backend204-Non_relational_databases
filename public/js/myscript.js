document.addEventListener('DOMContentLoaded', () => {
  const playerProfiles = document.querySelectorAll('.player-details');
  let ascendingOrder = true; 

const sortProfiles = () => {
  console.log("Sorting profiles...");
  ascendingOrder = !ascendingOrder;

  const sortedProfiles = Array.from(playerProfiles).sort((a, b) => {
    const aName = a.querySelector('.name').textContent.toLowerCase();
    const bName = b.querySelector('.name').textContent.toLowerCase();
    return ascendingOrder ? aName.localeCompare(bName) : bName.localeCompare(aName);
  });

  const playerList = document.querySelector('.player-list');
  playerList.innerHTML = ''; 
  sortedProfiles.forEach(profile => playerList.appendChild(profile));

  updateSortButtonText(); 
};

const updateSortButtonText = () => {
  const sortButton = document.getElementById('sort-button');
  sortButton.textContent = `Sort by Name (${ascendingOrder ? 'Asc' : 'Desc'})`;
};

const sortButton = document.getElementById('sort-button');
sortButton.addEventListener('click', sortProfiles);

const filterInput = document.getElementById('filter-input');
const filterPositionInput = document.getElementById('filter-position-input');
const filterNationalityInput = document.getElementById('filter-nationality-input');
const filterTeamInput = document.getElementById('filter-team-input');
//  make the user select the positions and not type it
const applyFilters = () => {
  console.log("Applying filters...");
//  make this in a function .trim().toLowerCase();
  function cleanFilterValue(input) {
    return input.trim().toLowerCase();
  }

  const playerNameFilter = cleanFilterValue(filterInput.value);
  const positionFilter = cleanFilterValue(filterPositionInput.value);
  const nationalityFilter = cleanFilterValue(filterNationalityInput.value);
  const teamFilter = cleanFilterValue(filterTeamInput.value);

  const filteredProfiles = Array.from(playerProfiles).filter(profile => {
    const playerName = profile.querySelector('.name').textContent.toLowerCase();
    const position = profile.querySelector('.position').textContent.toLowerCase();
    const nationality = profile.querySelector('.nationality img').getAttribute('alt').toLowerCase(); 
    const team = profile.querySelector('.team img').getAttribute('alt').toLowerCase(); 

    const playerNameMatches = playerName.includes(playerNameFilter);
    const positionMatches = position.includes(positionFilter);
    const nationalityMatches = nationality.includes(nationalityFilter);
    const teamMatches = team.includes(teamFilter);

    return playerNameMatches && positionMatches && nationalityMatches && teamMatches;
  });

  const playerList = document.querySelector('.player-list');
  playerList.innerHTML = ''; 
  filteredProfiles.forEach(profile => playerList.appendChild(profile));
};
filterInput.addEventListener('input', applyFilters);
filterPositionInput.addEventListener('input', applyFilters);
filterNationalityInput.addEventListener('input', applyFilters);
filterTeamInput.addEventListener('input', applyFilters);

let currentPage = 1;
const playersPerPage = 25;

const totalPlayers = playerProfiles.length;
const totalPages = Math.ceil(totalPlayers / playersPerPage);


//  reconsttruire le fetch (or any function) en petites functions
//  try to teest functions (how to test functions)
const fetchPlayers = async (page) => {
  console.log(`Fetching players for page ${page}`);
  try {
    const response = await fetch(`/api/players?page=${page}`);
    const players = await response.json();

    const playerList = document.querySelector('.player-list');
    playerList.innerHTML = '';

    players.forEach(player => {
      const playerRow = playerList.insertRow();

      const nameCell = playerRow.insertCell();
      const nationalityCell = playerRow.insertCell();
      const overallRatingCell = playerRow.insertCell();
      const potentialRatingCell = playerRow.insertCell();
      const positionCell = playerRow.insertCell();
      const ageCell = playerRow.insertCell();
      const teamCell = playerRow.insertCell();

      nameCell.className = 'name';
      nationalityCell.className = 'nationality';
      overallRatingCell.className = 'OverallRating';
      potentialRatingCell.className = 'PotentialRating';
      positionCell.className = 'position';
      ageCell.className = 'age';
      teamCell.className = 'team';

      nameCell.innerHTML = `<a href="/player/${player.playerId}">${player.name}</a>`;
      nationalityCell.innerHTML = `<img src="${player.nationalityImg}" alt="${player.nationality}" width="40px" height="40px">`;
      overallRatingCell.textContent = player.overallRating;
      potentialRatingCell.textContent = player.potentialRating;
      positionCell.textContent = player.preferredPositions.join(', ');
      ageCell.textContent = player.age;
      teamCell.innerHTML = `<img src="${player.teamImg}" alt="${player.team}" width="40px" height="40px">`;
    });

    currentPage = page;
  } catch (error) {
    console.error(error);
  }
};

  const prevButton = document.getElementById('prev-page');
  const nextButton = document.getElementById('next-page');
  const firstButton = document.getElementById('first-page');
  const lastButton = document.getElementById('last-page');

  prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
      fetchPlayers(currentPage - 1);      console.log("Last button clicked");
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
      fetchPlayers(currentPage + 1);
    }
  });

  firstButton.addEventListener('click', () => {
    console.log("First button clicked");
    fetchPlayers(1);
  });
  
  lastButton.addEventListener('click', () => {
    fetchPlayers(totalPages);
  });
// Update button visibility on page load

// Function to update button visibility
function updateButtonVisibility() {
  if (currentPage === 1) {
    prevButton.style.display = 'none';
    firstButton.style.display = 'none';
  } else {
    prevButton.style.display = 'block';
    firstButton.style.display = 'block';
  }

  if (currentPage === totalPages) {
    nextButton.style.display = 'none';
    lastButton.style.display = 'none';
  } else {
    nextButton.style.display = 'block';
    lastButton.style.display = 'block';
  }
}
updateButtonVisibility();

fetchPlayers(currentPage);
});

console.log('Script loaded')


