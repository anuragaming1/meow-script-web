// ========== SCRIPT DATA MANAGER ==========
class ScriptManager {
    constructor() {
        this.scripts = [];
        this.loadFromStorage();
        this.setupEventListeners();
        this.updateStats();
    }
    
    loadFromStorage() {
        const saved = localStorage.getItem('meowScripts');
        if (saved) {
            this.scripts = JSON.parse(saved);
            console.log(`Loaded ${this.scripts.length} scripts from storage`);
        } else {
            this.scripts = [];
            console.log('No scripts found in storage');
        }
        
        // Sort by date (newest first)
        this.scripts.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    saveToStorage() {
        localStorage.setItem('meowScripts', JSON.stringify(this.scripts));
        this.updateStats();
    }
    
    addScript(scriptData) {
        const newScript = {
            id: Date.now(),
            name: scriptData.name,
            hashtags: scriptData.hashtags,
            description: scriptData.description,
            code: scriptData.code,
            date: new Date().toISOString(),
            views: 0,
            downloads: 0
        };
        
        // Add to beginning of array
        this.scripts.unshift(newScript);
        this.saveToStorage();
        return newScript;
    }
    
    updateScript(id, data) {
        const index = this.scripts.findIndex(s => s.id === id);
        if (index !== -1) {
            this.scripts[index] = { ...this.scripts[index], ...data };
            this.saveToStorage();
            return true;
        }
        return false;
    }
    
    deleteScript(id) {
        const index = this.scripts.findIndex(s => s.id === id);
        if (index !== -1) {
            this.scripts.splice(index, 1);
            this.saveToStorage();
            return true;
        }
        return false;
    }
    
    incrementViews(id) {
        const script = this.scripts.find(s => s.id === id);
        if (script) {
            script.views++;
            this.saveToStorage();
        }
    }
    
    incrementDownloads(id) {
        const script = this.scripts.find(s => s.id === id);
        if (script) {
            script.downloads++;
            this.saveToStorage();
        }
    }
    
    searchScripts(query) {
        if (!query.trim()) return this.scripts;
        
        const searchTerm = query.toLowerCase();
        return this.scripts.filter(script => {
            // Search in name
            if (script.name.toLowerCase().includes(searchTerm)) return true;
            
            // Search in description
            if (script.description.toLowerCase().includes(searchTerm)) return true;
            
            // Search in hashtags
            if (script.hashtags.some(tag => tag.toLowerCase().includes(searchTerm))) return true;
            
            return false;
        });
    }
    
    getPopularHashtags() {
        const hashtagCount = {};
        this.scripts.forEach(script => {
            script.hashtags.forEach(tag => {
                hashtagCount[tag] = (hashtagCount[tag] || 0) + 1;
            });
        });
        
        return Object.entries(hashtagCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([tag]) => tag);
    }
    
    updateStats() {
        const totalScripts = this.scripts.length;
        const totalViews = this.scripts.reduce((sum, script) => sum + script.views, 0);
        
        // Update sidebar
        document.getElementById('totalScripts')?.textContent = totalScripts;
        document.getElementById('totalViews')?.textContent = totalViews.toLocaleString();
        
        // Update script count
        const scriptCountElement = document.getElementById('scriptCount');
        if (scriptCountElement) {
            scriptCountElement.textContent = `(${totalScripts} scripts)`;
        }
    }
    
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const page = this.id.replace('nav', '').toLowerCase();
                showPage(page);
            });
        });
        
        // Menu toggle for mobile
        document.getElementById('menuToggle')?.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('active');
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeModal();
        });
        
        // Close modal when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) closeModal();
            });
        });
    }
    
    displayScripts(scripts) {
        const grid = document.getElementById('allScripts');
        if (!grid) return;
        
        if (scripts.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-code"></i>
                    <h3>No scripts found</h3>
                    <p>Use the admin panel to add your first script!</p>
                    <a href="admin.html" target="_blank" class="btn-primary">
                        <i class="fas fa-plus"></i> Add First Script
                    </a>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = scripts.map(script => `
            <div class="script-card" data-id="${script.id}">
                <h3>${script.name}</h3>
                <div class="hashtags-container">
                    ${script.hashtags.map(tag => `<span class="hashtag">#${tag}</span>`).join('')}
                </div>
                <p>${script.description}</p>
                <div class="script-card-footer">
                    <div class="script-meta-info">
                        <span class="views-count">
                            <i class="fas fa-eye"></i> ${script.views.toLocaleString()}
                        </span>
                        <span>${formatDate(script.date)}</span>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add click event to each card
        document.querySelectorAll('.script-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = parseInt(card.dataset.id);
                const script = this.scripts.find(s => s.id === id);
                if (script) this.showScriptDetail(script);
            });
        });
    }
    
    showScriptDetail(script) {
        // Increment views
        this.incrementViews(script.id);
        
        // Update modal content
        document.getElementById('modalTitle').textContent = script.name;
        document.getElementById('modalDescription').textContent = script.description;
        document.getElementById('modalViews').textContent = script.views.toLocaleString();
        document.getElementById('modalDownloads').textContent = script.downloads.toLocaleString();
        document.getElementById('modalCode').textContent = script.code;
        
        // Update hashtags
        const hashtagsContainer = document.getElementById('modalHashtags');
        hashtagsContainer.innerHTML = script.hashtags
            .map(tag => `<span class="hashtag">#${tag}</span>`)
            .join('');
        
        // Store current script ID for download/copy
        window.currentScriptId = script.id;
        
        // Show modal
        openModal('scriptModal');
    }
    
    displayPopularHashtags() {
        const container = document.getElementById('popularHashtags');
        if (!container) return;
        
        const popularTags = this.getPopularHashtags();
        if (popularTags.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted); font-size: 14px;">No hashtags yet</p>';
            return;
        }
        
        container.innerHTML = popularTags.map(tag => `
            <button class="hashtag-filter" onclick="filterByHashtag('${tag}')">
                #${tag}
            </button>
        `).join('');
    }
}

// ========== GLOBAL INSTANCE ==========
let scriptManager;

// ========== PAGE MANAGEMENT ==========
function showPage(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    
    // Show selected page
    const pageElement = document.getElementById(page + 'Page');
    if (pageElement) {
        pageElement.classList.add('active');
        
        // Update active nav
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.getElementById('nav' + page.charAt(0).toUpperCase() + page.slice(1))?.classList.add('active');
        
        // Update page title
        const titles = {
            home: 'Meow Script Collection',
            info: 'About & Contact'
        };
        document.getElementById('pageTitle').textContent = titles[page] || 'Meow Script';
        
        // Load data if home page
        if (page === 'home') {
            scriptManager.displayScripts(scriptManager.scripts);
            scriptManager.displayPopularHashtags();
        }
    }
}

// ========== MODAL FUNCTIONS ==========
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

// ========== SCRIPT ACTIONS ==========
function copyScript() {
    const code = document.getElementById('modalCode').textContent;
    navigator.clipboard.writeText(code).then(() => {
        alert('Script copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy. Please try again.');
    });
}

function downloadScript() {
    const code = document.getElementById('modalCode').textContent;
    const name = document.getElementById('modalTitle').textContent;
    
    // Increment download count
    if (window.currentScriptId) {
        scriptManager.incrementDownloads(window.currentScriptId);
    }
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.lua';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Script downloaded!');
}

// ========== SEARCH & FILTER ==========
function searchScripts() {
    const searchInput = document.getElementById('searchInput') || document.getElementById('searchFilter');
    const query = searchInput ? searchInput.value : '';
    
    const results = scriptManager.searchScripts(query);
    scriptManager.displayScripts(results);
    
    // Update count
    const countElement = document.getElementById('scriptCount');
    if (countElement) {
        countElement.textContent = `(${results.length} scripts found)`;
    }
}

function filterByHashtag(tag) {
    const searchInput = document.getElementById('searchInput') || document.getElementById('searchFilter');
    if (searchInput) {
        searchInput.value = tag;
        searchScripts();
    }
}

// ========== UTILITY FUNCTIONS ==========
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString('vi-VN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    // Initialize script manager
    scriptManager = new ScriptManager();
    
    // Load initial data
    scriptManager.displayScripts(scriptManager.scripts);
    scriptManager.displayPopularHashtags();
    
    // Show home page by default
    showPage('home');
    
    // Setup search input event
    const searchInput = document.getElementById('searchInput');
    const searchFilter = document.getElementById('searchFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', searchScripts);
    }
    if (searchFilter) {
        searchFilter.addEventListener('input', searchScripts);
    }
});
