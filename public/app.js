// Main Application JavaScript - Version 3.0
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ========== GLOBAL VARIABLES ==========
let allScripts = [];
let displayedScripts = [];
let currentPage = 1;
const scriptsPerPage = 12;
let currentFilter = 'all';
let currentSearch = '';

// ========== INITIALIZATION ==========
function initializeApp() {
    // Load scripts from localStorage
    loadScriptsFromStorage();
    
    // Initialize navigation
    setupNavigation();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load recent scripts on home page
    loadRecentScripts();
    
    // Load all scripts with pagination
    loadAllScripts();
    
    // Load hashtag filters
    loadHashtagFilters();
    
    // Update statistics
    updateStatistics();
}

// ========== DATA MANAGEMENT ==========
function loadScriptsFromStorage() {
    // Try to load from localStorage (set by admin panel)
    const savedData = localStorage.getItem('scriptData');
    
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            allScripts = data.scripts || [];
            
            // Sort by date (newest first)
            allScripts.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            console.log(`Loaded ${allScripts.length} scripts from storage`);
        } catch (error) {
            console.error('Error loading scripts from storage:', error);
            allScripts = [];
        }
    } else {
        // No saved scripts, start with empty array
        allScripts = [];
        console.log('No scripts found in storage');
    }
}

function saveScriptsToStorage() {
    const totalViews = allScripts.reduce((sum, script) => sum + script.views, 0);
    const totalDownloads = allScripts.reduce((sum, script) => sum + script.downloads, 0);
    
    const data = {
        scripts: allScripts,
        lastUpdate: new Date().toISOString(),
        totalViews: totalViews,
        totalDownloads: totalDownloads
    };
    
    localStorage.setItem('scriptData', JSON.stringify(data));
}

// ========== NAVIGATION ==========
function setupNavigation() {
    // Navigation buttons
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            showPage(page);
            
            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Menu toggle for mobile
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('active');
        });
    }
}

function showPage(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    
    // Show selected page
    const pageElement = document.getElementById(page + 'Page');
    if (pageElement) {
        pageElement.classList.add('active');
        
        // Update page title
        const titles = {
            home: 'Meow Script Collection',
            scripts: 'All Scripts',
            info: 'About & Contact'
        };
        document.getElementById('pageTitle').textContent = titles[page] || 'Meow Script';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Load specific content for page
        if (page === 'scripts') {
            resetPagination();
            loadAllScripts();
        } else if (page === 'home') {
            loadRecentScripts();
        }
    }
}

// ========== SCRIPT DISPLAY ==========
function loadRecentScripts() {
    const grid = document.getElementById('recentScripts');
    if (!grid) return;
    
    // Get first 6 scripts (most recent)
    const recent = allScripts.slice(0, 6);
    displayScripts(recent, grid, 'recent');
    
    if (recent.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
                <i class="fas fa-code" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i>
                <p>No scripts available yet. Check back soon!</p>
            </div>
        `;
    }
}

function loadAllScripts() {
    const grid = document.getElementById('allScripts');
    if (!grid) return;
    
    // Filter scripts based on current filter and search
    let filteredScripts = filterScripts(allScripts);
    
    // Apply pagination
    const startIndex = (currentPage - 1) * scriptsPerPage;
    const endIndex = startIndex + scriptsPerPage;
    displayedScripts = filteredScripts.slice(startIndex, endIndex);
    
    // Display scripts
    displayScripts(displayedScripts, grid, 'all');
    
    // Update script count
    const scriptCount = document.getElementById('scriptCount');
    if (scriptCount) {
        scriptCount.textContent = `(${filteredScripts.length})`;
    }
    
    // Show/hide load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        if (endIndex < filteredScripts.length) {
            loadMoreBtn.style.display = 'block';
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }
    
    if (filteredScripts.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px; color: var(--text-muted);">
                <i class="fas fa-search" style="font-size: 64px; margin-bottom: 20px; opacity: 0.5;"></i>
                <h3 style="color: var(--neon-blue); margin-bottom: 10px;">No Scripts Found</h3>
                <p>Try adjusting your search or filter</p>
            </div>
        `;
    }
}

function displayScripts(scripts, container, type) {
    if (scripts.length === 0) {
        if (type === 'recent') {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
                    <i class="fas fa-code" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i>
                    <p>No scripts available yet. Check back soon!</p>
                </div>
            `;
        }
        return;
    }
    
    let html = '';
    scripts.forEach(script => {
        const date = new Date(script.date);
        const formattedDate = date.toLocaleDateString('vi-VN');
        
        html += `
            <div class="script-card" onclick="showScriptDetail(${script.id})">
                <div class="script-card-header">
                    <h3>${script.name}</h3>
                    ${script.views >= 1000 ? '<span class="script-badge">POPULAR</span>' : ''}
                </div>
                <p>${script.description || 'No description available.'}</p>
                <div class="script-card-footer">
                    <div class="script-hashtags">
                        ${script.hashtags && script.hashtags.length > 0 
                            ? script.hashtags.slice(0, 3).map(tag => 
                                `<span class="hashtag">${tag}</span>`
                            ).join('') 
                            : '<span class="hashtag">#script</span>'
                        }
                        ${script.hashtags && script.hashtags.length > 3 
                            ? `<span class="hashtag">+${script.hashtags.length - 3}</span>` 
                            : ''
                        }
                    </div>
                    <div class="script-stats">
                        <span><i class="fas fa-eye"></i> ${script.views.toLocaleString()}</span>
                        <span><i class="far fa-calendar"></i> ${formattedDate}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// ========== FILTER & SEARCH ==========
function filterScripts(scripts) {
    let filtered = [...scripts];
    
    // Apply hashtag filter
    if (currentFilter !== 'all' && currentFilter !== '') {
        filtered = filtered.filter(script => 
            script.hashtags && 
            script.hashtags.some(tag => 
                tag.toLowerCase().includes(currentFilter.toLowerCase())
            )
        );
    }
    
    // Apply search filter
    if (currentSearch.trim() !== '') {
        const searchTerm = currentSearch.toLowerCase().trim();
        filtered = filtered.filter(script => 
            script.name.toLowerCase().includes(searchTerm) ||
            script.description.toLowerCase().includes(searchTerm) ||
            (script.hashtags && script.hashtags.some(tag => 
                tag.toLowerCase().includes(searchTerm)
            ))
        );
    }
    
    return filtered;
}

function searchScripts() {
    const searchInput = document.getElementById('searchInput');
    currentSearch = searchInput ? searchInput.value : '';
    
    if (document.getElementById('scriptsPage').classList.contains('active')) {
        resetPagination();
        loadAllScripts();
    } else {
        loadRecentScripts();
    }
}

function searchAllScripts() {
    const searchInput = document.getElementById('globalSearch');
    currentSearch = searchInput ? searchInput.value : '';
    resetPagination();
    loadAllScripts();
}

function filterByHashtag(hashtag) {
    // Remove # if present
    const cleanHashtag = hashtag.startsWith('#') ? hashtag.substring(1) : hashtag;
    
    if (currentFilter === cleanHashtag) {
        // Clear filter if same hashtag clicked again
        currentFilter = 'all';
    } else {
        currentFilter = cleanHashtag;
    }
    
    // Update active state of hashtag buttons
    document.querySelectorAll('.hashtag-filter-btn').forEach(btn => {
        if (btn.getAttribute('data-hashtag') === cleanHashtag) {
            btn.classList.toggle('active', currentFilter === cleanHashtag);
        } else {
            btn.classList.remove('active');
        }
    });
    
    resetPagination();
    loadAllScripts();
}

function loadHashtagFilters() {
    const hashtagList = document.getElementById('hashtagList');
    if (!hashtagList) return;
    
    // Get all unique hashtags from scripts
    const allHashtags = [];
    allScripts.forEach(script => {
        if (script.hashtags) {
            script.hashtags.forEach(tag => {
                const cleanTag = tag.startsWith('#') ? tag.substring(1) : tag;
                if (!allHashtags.includes(cleanTag)) {
                    allHashtags.push(cleanTag);
                }
            });
        }
    });
    
    // Sort hashtags by frequency
    const hashtagCounts = {};
    allScripts.forEach(script => {
        if (script.hashtags) {
            script.hashtags.forEach(tag => {
                const cleanTag = tag.startsWith('#') ? tag.substring(1) : tag;
                hashtagCounts[cleanTag] = (hashtagCounts[cleanTag] || 0) + 1;
            });
        }
    });
    
    allHashtags.sort((a, b) => hashtagCounts[b] - hashtagCounts[a]);
    
    // Display top 20 hashtags
    const topHashtags = allHashtags.slice(0, 20);
    
    if (topHashtags.length === 0) {
        hashtagList.innerHTML = `
            <span style="color: var(--text-muted); font-style: italic;">
                No hashtags available yet
            </span>
        `;
        return;
    }
    
    let html = '';
    topHashtags.forEach(tag => {
        const count = hashtagCounts[tag] || 0;
        html += `
            <button class="hashtag-filter-btn ${currentFilter === tag ? 'active' : ''}" 
                    data-hashtag="${tag}"
                    onclick="filterByHashtag('${tag}')"
                    title="${count} script${count !== 1 ? 's' : ''}">
                #${tag}
            </button>
        `;
    });
    
    hashtagList.innerHTML = html;
}

// ========== PAGINATION ==========
function resetPagination() {
    currentPage = 1;
}

function loadMoreScripts() {
    currentPage++;
    loadAllScripts();
    
    // Scroll to newly loaded scripts
    const grid = document.getElementById('allScripts');
    if (grid) {
        const newCards = grid.querySelectorAll('.script-card');
        if (newCards.length > 0) {
            const lastCard = newCards[newCards.length - 1];
            lastCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
}

// ========== SCRIPT DETAIL ==========
function showScriptDetail(scriptId) {
    const script = allScripts.find(s => s.id === scriptId);
    if (!script) {
        showToast('Script not found!');
        return;
    }
    
    // Increase view count
    script.views++;
    saveScriptsToStorage();
    
    // Update statistics
    updateStatistics();
    
    // Save script to localStorage for detail page
    localStorage.setItem('currentScript', JSON.stringify(script));
    
    // Open modal
    document.getElementById('modalTitle').textContent = script.name;
    document.getElementById('modalDescription').textContent = script.description || 'No description available.';
    document.getElementById('modalCode').textContent = script.code;
    document.getElementById('modalViews').textContent = `${script.views.toLocaleString()} views`;
    
    const date = new Date(script.date);
    document.getElementById('modalDate').textContent = date.toLocaleDateString('vi-VN');
    
    // Display hashtags
    const hashtagsDiv = document.getElementById('modalHashtags');
    if (script.hashtags && script.hashtags.length > 0) {
        hashtagsDiv.innerHTML = script.hashtags.map(tag => 
            `<span class="hashtag">${tag}</span>`
        ).join('');
    } else {
        hashtagsDiv.innerHTML = '<span class="hashtag">#script</span>';
    }
    
    openModal('scriptModal');
}

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

function showDonate() {
    openModal('donateModal');
}

// ========== SCRIPT ACTIONS ==========
function copyScript() {
    const code = document.getElementById('modalCode').textContent;
    navigator.clipboard.writeText(code).then(() => {
        showToast('Script copied to clipboard!');
        
        // Find and update download count
        const scriptName = document.getElementById('modalTitle').textContent;
        const script = allScripts.find(s => s.name === scriptName);
        if (script) {
            script.downloads++;
            saveScriptsToStorage();
            updateStatistics();
        }
    }).catch(err => {
        console.error('Failed to copy:', err);
        showToast('Failed to copy. Please try again.');
    });
}

function downloadScript() {
    const code = document.getElementById('modalCode').textContent;
    const name = document.getElementById('modalTitle').textContent;
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.lua';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Script downloaded!');
    
    // Find and update download count
    const script = allScripts.find(s => s.name === name);
    if (script) {
        script.downloads++;
        saveScriptsToStorage();
        updateStatistics();
    }
}

// ========== STATISTICS ==========
function updateStatistics() {
    const totalViews = allScripts.reduce((sum, script) => sum + script.views, 0);
    const totalDownloads = allScripts.reduce((sum, script) => sum + script.downloads, 0);
    
    // Update sidebar
    const totalViewsElement = document.getElementById('totalViews');
    const totalDownloadsElement = document.getElementById('totalDownloads');
    
    if (totalViewsElement) {
        totalViewsElement.textContent = totalViews.toLocaleString();
    }
    if (totalDownloadsElement) {
        totalDownloadsElement.textContent = totalDownloads.toLocaleString();
    }
    
    // Also save updated data
    saveScriptsToStorage();
}

// ========== UTILITIES ==========
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function setupEventListeners() {
    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    });
    
    // Search input enter key
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchScripts();
            }
        });
    }
    
    const globalSearch = document.getElementById('globalSearch');
    if (globalSearch) {
        globalSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchAllScripts();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Auto-refresh hashtag filters when scripts change
    window.addEventListener('storage', function(e) {
        if (e.key === 'scriptData') {
            loadScriptsFromStorage();
            loadRecentScripts();
            loadAllScripts();
            loadHashtagFilters();
            updateStatistics();
        }
    });
}

// Auto-sync with admin panel changes
setInterval(() => {
    const savedData = localStorage.getItem('scriptData');
    if (savedData) {
        const data = JSON.parse(savedData);
        if (data.lastUpdate) {
            // Check if data is newer than what we have
            const ourData = JSON.parse(localStorage.getItem('scriptData') || '{}');
            if (new Date(data.lastUpdate) > new Date(ourData.lastUpdate || 0)) {
                loadScriptsFromStorage();
                loadRecentScripts();
                loadAllScripts();
                loadHashtagFilters();
                updateStatistics();
            }
        }
    }
}, 5000); // Check every 5 seconds
