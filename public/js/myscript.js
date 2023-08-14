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

  // Example usage:
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
  try {
    const response = await fetch(`/api/players?page=${page}`);
    const players = await response.json();

    const playerList = document.querySelector('.player-list');
    playerList.innerHTML = '';

    players.forEach(player => {
      // Instead of creating new elements, we can directly select the existing ones
      const playerRow = playerList.insertRow();

      // No need to create new cells, as they are already defined in the HTML structure
      const nameCell = playerRow.insertCell();
      const nationalityCell = playerRow.insertCell();
      const overallRatingCell = playerRow.insertCell();
      const potentialRatingCell = playerRow.insertCell();
      const positionCell = playerRow.insertCell();
      const ageCell = playerRow.insertCell();
      const teamCell = playerRow.insertCell();

      // Use the existing class names from your HTML
      nameCell.className = 'name';
      nationalityCell.className = 'nationality';
      overallRatingCell.className = 'OverallRating';
      potentialRatingCell.className = 'PotentialRating';
      positionCell.className = 'position';
      ageCell.className = 'age';
      teamCell.className = 'team';

      // Populate the cells with content from the player object
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


  const updatePaginationButtons = () => {
    const paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = ''; 
// remove the creation of html classes from js, an dmake it in html
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous Page';
    prevButton.classList.add('pagination-button', 'prev-button'); 
    prevButton.addEventListener('click', () => {
      if (currentPage > 1) {
        fetchPlayers(currentPage - 1);
      }
    });
    paginationContainer.appendChild(prevButton);
    
// fix again the number of the players ()

    // Calculate the range of page numbers to display
    // const minPage = Math.max(currentPage - 2, 1);
    // const maxPage = Math.min(currentPage + 2, totalPages);
  
    // for (let page = minPage; page <= maxPage; page++) {
    //   const button = document.createElement('button');
    //   button.textContent = page;
    //   button.classList.add('pagination-button');
      
    //   if (page === currentPage) {
    //     button.classList.add('active'); // Add a class to highlight the active page
    //   }
  
    //   button.addEventListener('click', () => fetchPlayers(page));
    //   paginationContainer.appendChild(button);
    // }
  
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next Page';
    nextButton.classList.add('pagination-button', 'next-button');
    nextButton.addEventListener('click', () => {
      if (currentPage < totalPages) {
        fetchPlayers(currentPage + 1);
      }
    });
    paginationContainer.appendChild(nextButton);
    };
fetchPlayers(currentPage);
updatePaginationButtons();
});

console.log('Script loaded')


