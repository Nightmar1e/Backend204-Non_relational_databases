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

const applyFilters = () => {
  console.log("Applying filters...");

  const playerNameFilter = filterInput.value.trim().toLowerCase();
  const positionFilter = filterPositionInput.value.trim().toLowerCase();
  const nationalityFilter = filterNationalityInput.value.trim().toLowerCase();
  const teamFilter = filterTeamInput.value.trim().toLowerCase();

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

const fetchPlayers = async (page) => {
  try {
    const response = await fetch(`/api/players?page=${page}`);
    const players = await response.json();

    const playerList = document.querySelector('.player-list');
    playerList.innerHTML = ''; 

    players.forEach(player => {
      const playerRow = document.createElement('tr');
      playerRow.classList.add('player-details');

      const nameCell = document.createElement('td');
      nameCell.classList.add('name');

      const nameLink = document.createElement('a');
      nameLink.href = `/player/${player.playerId}`; 
      nameLink.textContent = player.name;
      
      const nationalityCell = document.createElement('td');
      const nationalityImage = document.createElement('img');
      nationalityImage.src = `${player.nationalityImg}`;
      nationalityImage.alt = player.nationality;
      nationalityImage.className = 'nation size-2';
      nationalityImage.setAttribute('data-original-src', player.nationality);
    
    
      const overallRatingCell = document.createElement('td');
      overallRatingCell.textContent = player.overallRating;

      const potentialRatingCell = document.createElement('td');
      potentialRatingCell.textContent = player.potentialRating;

      const positionCell = document.createElement('td');
      positionCell.textContent = player.preferredPositions.join(', ');

      const ageCell = document.createElement('td');
      ageCell.textContent = player.age;
      

      const teamCell = document.createElement('td');

      const teamCellImg = document.createElement('img');
      teamCellImg.src = `${player.teamImg}`;
      teamCellImg.alt = player.team;
      teamCellImg.className = 'team size-1';
      teamCellImg.setAttribute('data-original-src', player.team);

      playerRow.appendChild(nameCell);
      playerRow.appendChild(nationalityCell);
      nationalityCell.appendChild(nationalityImage);

      playerRow.appendChild(overallRatingCell);
      playerRow.appendChild(potentialRatingCell);
      playerRow.appendChild(positionCell);
      playerRow.appendChild(ageCell);
      playerRow.appendChild(teamCell);
      teamCell.appendChild(teamCellImg);
      nameCell.appendChild(nameLink);

      playerList.appendChild(playerRow);
    });

    currentPage = page;
  } catch (error) {
    console.error(error);
  }
};

  const updatePaginationButtons = () => {
    const paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = ''; 

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous Page';
    prevButton.classList.add('pagination-button', 'prev-button'); 
    prevButton.addEventListener('click', () => {
      if (currentPage > 1) {
        fetchPlayers(currentPage - 1);
      }
    });
    paginationContainer.appendChild(prevButton);
    
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


