document.addEventListener('DOMContentLoaded', () => {
    
    const userCheckins = {}; 
    let lastCheckinLocation = 'N/A'; 

    
    const mellowDownQuotes = [
        "Go slowly; the world will wait.",
        "Breathe. You’re not late for your own life.",
        "There is no rush. Just rhythm.",
        "Rest is not a pause from life—it's part of living.",
        "Let life unfold, not be chased.",
        "You are allowed to move at the pace of peace.",
        "Life isn’t a race; it’s a walk through a garden.",
        "When you slow down, you start to see what really matters.",
        "Freedom begins the moment you stop hurrying.",
        "Live gently. Nothing beautiful blooms in a hurry.",
        "Take your time; your time is yours.",
        "You don’t need to keep up—just keep being.",
        "Let go of rush, and you’ll find room to breathe.",
        "Walk lightly, live softly, love freely.",
        "Slow down long enough to notice your own life."
    ];


    
    const allLocations = {
        
        'library': { top: '50%', left: '45%', name: 'Library - Quiet Zone' },
        'mcs': { top: '35%', left: '30%', name: 'MSC - Quiet Lounges' },
        'village': { top: '20%', left: '70%', name: 'The Village - Dorm' },
        'hub': { top: '65%', left: '20%', name: 'The Hub' },
        
        
        'castor_lake': { top: '45%', left: '60%', name: 'Castor Lake' },
        'castor_beach': { top: '55%', left: '65%', name: 'Castor Beach' },
        'serenity_patio': { top: '30%', left: '35%', name: 'MSC Serenity Patio' },
        'rec_center': { top: '75%', left: '15%', name: 'Rec Center Chill Room' },
        'counseling_center': { top: '40%', left: '15%', name: 'USF Counseling Center' },
        'muma': { top: '60%', left: '35%', name: 'MUMA Bldg - Benches' },
        'botanical_gardens': { top: '85%', left: '55%', name: 'USF Botanical Gardens' },
        
        
        'home': { top: '80%', left: '80%', name: 'Home/Off Campus' }
    };

    
    const walkingTimes = {
        'library': {
            'library': 0, 'mcs': 5, 'village': 10, 'hub': 12, 'castor_lake': 5,
            'castor_beach': 8, 'serenity_patio': 4, 'rec_center': 15, 'counseling_center': 14,
            'muma': 7, 'botanical_gardens': 15
        },
        'mcs': {
            'library': 5, 'mcs': 0, 'village': 8, 'hub': 10, 'castor_lake': 7,
            'castor_beach': 10, 'serenity_patio': 2, 'rec_center': 12, 'counseling_center': 10,
            'muma': 5, 'botanical_gardens': 18
        },
        'hub': {
            'library': 12, 'mcs': 10, 'village': 18, 'hub': 0, 'castor_lake': 15,
            'castor_beach': 18, 'serenity_patio': 8, 'rec_center': 4, 'counseling_center': 3,
            'muma': 6, 'botanical_gardens': 25
        },
        'village': {
            'library': 10, 'mcs': 8, 'village': 0, 'hub': 18, 'castor_lake': 2,
            'castor_beach': 5, 'serenity_patio': 6, 'rec_center': 20, 'counseling_center': 20,
            'muma': 15, 'botanical_gardens': 10
        }
    };

    
    const homePage = document.getElementById('home-page');
    const checkInPage = document.getElementById('check-in-page');
    const campusMapPage = document.getElementById('campus-map-page');

    
    const checkInNavButton = document.getElementById('check-in-nav');
    const campusMapNavButton = document.getElementById('campus-map-nav');
    const getStartedButton = document.getElementById('get-started-button');
    const homeLogoButton = document.getElementById('home-logo-button'); 

    
    const checkinMonthInput = document.getElementById('checkin-month');
    const checkinDayInput = document.getElementById('checkin-day');
    const checkinYearInput = document.getElementById('checkin-year');
    
    const sliders = document.querySelectorAll('.slider');
    const logCheckinButton = document.getElementById('log-checkin-button');
    const logMessage = document.getElementById('log-message');
    const locationSelect = document.getElementById('location-select');
    
    
    const monthlyViewButton = document.getElementById('view-monthly');
    const weeklyViewButton = document.getElementById('view-weekly');
    const chartTilesContainer = document.getElementById('chart-tiles-container');
    const calmSpotMarkersContainer = document.getElementById('calm-spot-markers-container');
    const calmSpotList = document.getElementById('calm-spot-list'); 
    const mapTooltip = document.getElementById('map-tooltip');
    const lastLocationDisplay = document.getElementById('last-location-display');
    const connectionLine = document.getElementById('connection-line');
    const dynamicQuoteElement = document.getElementById('dynamic-quote'); 


    let currentView = 'monthly'; 
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


    // Function to display a random quote
    function displayRandomQuote() {
        if (dynamicQuoteElement && mellowDownQuotes.length > 0) {
            const randomIndex = Math.floor(Math.random() * mellowDownQuotes.length);
            dynamicQuoteElement.textContent = mellowDownQuotes[randomIndex];
        } else if (dynamicQuoteElement) {
            dynamicQuoteElement.textContent = "Welcome to your personal well-being companion.";
        }
    }
    
    function populateDays() {
        if (!checkinDayInput || !checkinMonthInput || !checkinYearInput) return;
        
        const year = parseInt(checkinYearInput.value);
        const monthIndex = parseInt(checkinMonthInput.value) - 1; 
        
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate(); 
        
        const currentDaySelection = checkinDayInput.value ? parseInt(checkinDayInput.value) : new Date().getDate();
        
        checkinDayInput.innerHTML = ''; 
        
        for (let day = 1; day <= daysInMonth; day++) {
            const option = document.createElement('option');
            option.value = String(day).padStart(2, '0');
            option.textContent = day;
            if (day === currentDaySelection || (day === 1 && currentDaySelection > daysInMonth)) {
                option.selected = true;
            }
            checkinDayInput.appendChild(option);
        }
    }

    function initializeDateDropdowns() {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1; 
        
        if (checkinYearInput) {
            for (let year = currentYear - 5; year <= currentYear + 5; year++) {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                if (year === currentYear) option.selected = true;
                checkinYearInput.appendChild(option);
            }
        }
        
        if (checkinMonthInput) {
            for (let i = 0; i < 12; i++) {
                const option = document.createElement('option');
                option.value = String(i + 1).padStart(2, '0'); 
                option.textContent = monthNames[i];
                if (i + 1 === currentMonth) option.selected = true;
                checkinMonthInput.appendChild(option);
            }
        }

        populateDays();
    }
    
    function getSelectedDateString() {
        const year = checkinYearInput.value;
        const month = checkinMonthInput.value;
        const day = checkinDayInput.value;
        
        if (year && month && day) {
            return `${year}-${month}-${day}`;
        }
        return new Date().toISOString().substring(0, 10); 
    }

    
    function getWalkingTimeText(fromKey, toKey) {
        if (fromKey === 'N/A') {
            return 'Time N/A (Log a Check-in)';
        } else if (fromKey === 'home') {
            return 'Off Campus (No walking time)';
        } else if (fromKey === toKey) {
            return 'You are here!';
        } else if (walkingTimes[fromKey] && walkingTimes[fromKey][toKey] !== undefined) {
            const time = walkingTimes[fromKey][toKey];
            return `${time} min walk`;
        }
        return 'Time N/A (Location not mapped)';
    }

    
    function setupMarkerHoverListeners(marker, targetLocationKey) {
        
        const updateTooltipAndLine = (e, isHovering) => {
            if (!mapTooltip || !connectionLine) return;

            const fromKey = lastCheckinLocation;
            const fromLocation = allLocations[fromKey];
            const toLocation = allLocations[targetLocationKey];
            const mapRect = connectionLine.getBoundingClientRect();
            
            if (isHovering && fromKey !== 'N/A' && fromKey !== 'home' && fromLocation && toLocation && fromKey !== targetLocationKey) {
                
                // 1. Line Drawing
                connectionLine.classList.remove('hidden');
                connectionLine.innerHTML = ''; 
                
                // Convert percentage coordinates (e.g., '50%') to pixel values
                const mapWidth = mapRect.width;
                const mapHeight = mapRect.height;
                
                const getCoords = (loc) => ({
                    x: (parseFloat(loc.left) / 100) * mapWidth,
                    y: (parseFloat(loc.top) / 100) * mapHeight
                });

                const startCoords = getCoords(fromLocation);
                const endCoords = getCoords(toLocation);

                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', `M ${startCoords.x} ${startCoords.y} L ${endCoords.x} ${endCoords.y}`);
                path.setAttribute('class', 'connection-path');
                connectionLine.appendChild(path);

                // 2. Tooltip Update
                const timeText = getWalkingTimeText(fromKey, targetLocationKey);
                mapTooltip.textContent = `${toLocation.name}: ${timeText}`;
                
                // Position tooltip near the mouse, relative to map container
                mapTooltip.style.left = `${e.clientX - mapRect.left}px`;
                mapTooltip.style.top = `${e.clientY - mapRect.top}px`;
                mapTooltip.classList.remove('hidden');
            } else {
                connectionLine.classList.add('hidden');
                mapTooltip.classList.add('hidden');
            }
        };

        marker.addEventListener('mousemove', (e) => updateTooltipAndLine(e, true));
        marker.addEventListener('mouseleave', (e) => updateTooltipAndLine(e, false));
    }

    function renderCampusMap() {
        if (!calmSpotMarkersContainer || !lastLocationDisplay || !calmSpotList) return;

        calmSpotMarkersContainer.innerHTML = ''; 
        calmSpotList.innerHTML = '<ul></ul>';
        const listUl = calmSpotList.querySelector('ul');
        

        // 1. Update the last check-in display
        const lastLocationName = allLocations[lastCheckinLocation] ? allLocations[lastCheckinLocation].name : 'N/A (Submit a Check-in to update.)';
        lastLocationDisplay.textContent = `Last Check-in Location: ${lastLocationName}`;


        
        Object.keys(allLocations).forEach(key => {
            const location = allLocations[key];

            if (key === 'home') return; 
            
            // 2. Populate the permanent list
            const listItem = document.createElement('li');
            listItem.textContent = location.name;
            
            // Add distance info to the list item next to the name
            if (key === lastCheckinLocation) {
                listItem.textContent += ' (YOU ARE HERE)';
                listItem.style.fontWeight = 'bold';
                listItem.style.color = '#ff0000';
            } else {
                 listItem.textContent += ` (${getWalkingTimeText(lastCheckinLocation, key)})`;
            }
            
            listUl.appendChild(listItem);


            // 3. Render map markers
            const marker = document.createElement('div');
            marker.className = 'calm-spot-marker';
            marker.style.top = location.top;
            marker.style.left = location.left;
            marker.setAttribute('data-location', key);

            
            if (key === lastCheckinLocation) {
                marker.classList.add('current-location');
                marker.style.zIndex = 40; 
            }
            
            
            setupMarkerHoverListeners(marker, key);

            calmSpotMarkersContainer.appendChild(marker);
        });
    }

    
    function showPage(pageToShow, navButtonToActivate) {
        
        homePage.classList.add('hidden');
        checkInPage.classList.add('hidden');
        campusMapPage.classList.add('hidden');
        if (checkInNavButton) checkInNavButton.classList.remove('active');
        if (campusMapNavButton) campusMapNavButton.classList.remove('active');

        if (pageToShow) pageToShow.classList.remove('hidden');
        
        if (navButtonToActivate) {
            navButtonToActivate.classList.add('active');
        }
        
        if (pageToShow === homePage) {
            displayRandomQuote(); 
        } else if (pageToShow === checkInPage) {
            renderChart();
        } else if (pageToShow === campusMapPage) {
            renderCampusMap(); 
        }
    }
    
    function renderChart() {
        if (!chartTilesContainer) return;
        chartTilesContainer.innerHTML = '';

        const dateString = getSelectedDateString();
        const selectedDate = new Date(dateString + 'T00:00:00'); 
        const tiles = [];
        
        if (currentView === 'monthly') {
            chartTilesContainer.style.gridTemplateColumns = 'repeat(7, 1fr)';
            
            const year = selectedDate.getFullYear();
            const month = selectedDate.getMonth();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const firstDayOfMonth = new Date(year, month, 1).getDay(); 

            for (let i = 0; i < firstDayOfMonth; i++) {
                tiles.push('<div class="day-tile" style="background: none; box-shadow: none;"></div>');
            }

            for (let day = 1; day <= daysInMonth; day++) {
                const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const checkin = userCheckins[dateKey];
                
                let tileClass = 'day-tile';
                let content = day;
                
                if (checkin) {
                    tileClass += ` mood-${checkin.mood}`; 
                } else {
                    tileClass += ` no-checkin`; 
                }

                tiles.push(`<div class="${tileClass}">${content}</div>`);
            }
        } else if (currentView === 'weekly') {
            chartTilesContainer.style.gridTemplateColumns = 'repeat(7, 1fr)';
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const todayIndex = selectedDate.getDay();
            
            const startDate = new Date(selectedDate);
            startDate.setDate(selectedDate.getDate() - todayIndex); 

            for (let i = 0; i < 7; i++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + i);
                
                const year = currentDate.getFullYear();
                const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                const day = String(currentDate.getDate()).padStart(2, '0');
                const dateKey = `${year}-${month}-${day}`;
                const checkin = userCheckins[dateKey];
                
                let tileClass = 'day-tile';
                
                if (checkin) {
                    tileClass += ` mood-${checkin.mood}`; 
                } else {
                    tileClass += ` no-checkin`;
                }

                const dayContent = `
                    <span class="day-name">${dayNames[i]}</span>
                    <span>${currentDate.getDate()}</span>
                `;
                
                tiles.push(`<div class="${tileClass}">${dayContent}</div>`);
            }
        }

        if (chartTilesContainer) chartTilesContainer.innerHTML = tiles.join('');
    }


    
    initializeDateDropdowns();
    showPage(homePage, null); 
    
    
    if (checkinMonthInput) checkinMonthInput.addEventListener('change', () => {
        populateDays();
        renderChart();
    });
    if (checkinYearInput) checkinYearInput.addEventListener('change', () => {
        populateDays();
        renderChart();
    });
    if (checkinDayInput) checkinDayInput.addEventListener('change', renderChart);


    
    if (homeLogoButton) homeLogoButton.addEventListener('click', () => {
        showPage(homePage, null); 
    });

    if (getStartedButton) getStartedButton.addEventListener('click', () => {
        showPage(checkInPage, checkInNavButton);
    });

    if (checkInNavButton) checkInNavButton.addEventListener('click', () => {
        showPage(checkInPage, checkInNavButton);
    });

    if (campusMapNavButton) campusMapNavButton.addEventListener('click', () => {
        showPage(campusMapPage, campusMapNavButton);
    });

    
    if (monthlyViewButton) monthlyViewButton.addEventListener('click', () => {
        currentView = 'monthly';
        monthlyViewButton.classList.add('active');
        weeklyViewButton.classList.remove('active');
        renderChart();
    });
    
    if (weeklyViewButton) weeklyViewButton.addEventListener('click', () => {
        currentView = 'weekly';
        weeklyViewButton.classList.add('active');
        monthlyViewButton.classList.remove('active');
        renderChart();
    });

    
    sliders.forEach(slider => {
        const valueSpan = document.getElementById(slider.id.replace('-slider', '-value'));
        slider.addEventListener('input', () => {
            if (valueSpan) valueSpan.textContent = slider.value;
        });
        if (valueSpan) valueSpan.textContent = slider.value;
    });

    
    if (logCheckinButton) logCheckinButton.addEventListener('click', () => {
        const selectedDate = getSelectedDateString();
        const selectedLocation = locationSelect.value; 

        const checkinData = { 
            timestamp: new Date().toISOString(),
            location: selectedLocation, 
            mood: parseInt(document.getElementById('mood-slider').value),
            stress: parseInt(document.getElementById('stress-slider').value), 
            sleep: parseInt(document.getElementById('sleep-slider').value), 
            study: `${document.getElementById('study-slider').value} hours`, 
            activity: parseInt(document.getElementById('activity-slider').value)
        };
        
        userCheckins[selectedDate] = checkinData;
        
        lastCheckinLocation = selectedLocation; 

        console.log(`Check-in Data Logged for ${selectedDate}:`, checkinData);
        
        if (logMessage) logMessage.classList.remove('hidden');
        
        
        document.getElementById('mood-slider').value = 3;
        document.getElementById('stress-slider').value = 3;
        document.getElementById('sleep-slider').value = 3;
        document.getElementById('study-slider').value = 0;
        document.getElementById('activity-slider').value = 3;
        
        
        sliders.forEach(slider => {
             const valueSpan = document.getElementById(slider.id.replace('-slider', '-value'));
             if (valueSpan) valueSpan.textContent = slider.value;
        });
        
        renderChart(); 
    });
});