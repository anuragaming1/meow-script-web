// Main Application JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize navigation
    setupNavigation();
    
    // Load scripts
    loadFeaturedScripts();
    loadAllScripts();
    
    // Setup event listeners
    setupEventListeners();
    
    // Check for saved scripts
    checkSavedScripts();
}

// ========== DATA ==========
const allScripts = [
    {
        id: 1,
        name: "Xeter V3",
        category: "Blox Fruits",
        description: "Premium script for Blox Fruits with auto farm, auto raid, and more features.",
        code: `getgenv().Version = "V3"
getgenv().Team = "Marines"
loadstring(game:HttpGet("https://raw.githubusercontent.com/TlDinhKhoi/Xeter/refs/heads/main/Main.lua"))()`,
        views: 1500,
        downloads: 1200
    },
    {
        id: 2,
        name: "Sóc lọ",
        category: "Auto Farm",
        description: "Fast farming script for various Roblox games.",
        code: `loadstring(game:HttpGet("https://raw.githubusercontent.com/anuragaming1/anura/refs/heads/main/soclo.lua"))()`,
        views: 800,
        downloads: 650
    },
    {
        id: 3,
        name: "Teddy hub fram",
        category: "GUI",
        description: "Beautiful GUI hub with multiple features.",
        code: `repeat wait() until game:IsLoaded() and game.Players.LocalPlayer
loadstring(game:HttpGet("https://raw.githubusercontent.com/Teddyseetink/Haidepzai/refs/heads/main/TeddyHub.lua"))()`,
        views: 1200,
        downloads: 900
    },
    {
        id: 4,
        name: "Kaitun TSB",
        category: "Blox Fruits",
        description: "Advanced auto farm script for Blox Fruits.",
        code: `loadstring(game:HttpGet("https://raw.githubusercontent.com/MEOW-HUB-DEV/SCRIPT-FREE/refs/heads/main/KaitunTSB.lua"))()`,
        views: 2000,
        downloads: 1800
    },
    {
        id: 5,
        name: "Hoho hub",
        category: "GUI",
        description: "Feature-rich GUI hub for multiple games.",
        code: `loadstring(game:HttpGet("https://raw.githubusercontent.com/acsu123/HOHO_H/main/Loading_UI"))()`,
        views: 950,
        downloads: 700
    },
    {
        id: 6,
        name: "Fixlag",
        category: "Utility",
        description: "Reduce lag and improve FPS in Roblox.",
        code: `loadstring(game:HttpGet("https://raw.githubusercontent.com/TurboLite/Script/main/FixLag.lua"))()`,
        views: 3000,
        downloads: 2500
    },
    {
        id: 7,
        name: "Fly Script",
        category: "Utility",
        description: "Universal fly script for Roblox games.",
        code: `loadstring(game:HttpGet("https://raw.githubusercontent.com/XNEOFF/FlyGuiV3/main/FlyGuiV3.txt"))()`,
        views: 4000,
        downloads: 3500
    },
    {
        id: 8,
        name: "Nolag",
        category: "Utility",
        description: "Remove lag and optimize performance.",
        code: `loadstring(game:HttpGet("https://raw.githubusercontent.com/NoLag-id/No-Lag-HUB/refs/heads/main/Loader/Main.lua"))()`,
        views: 2200,
        downloads: 1800
    }
];

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
            info: 'About & Contact'
        };
        document.getElementById('pageTitle').textContent = titles[page] || 'Meow Script';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ========== SCRIPT DISPLAY ==========
function loadFeaturedScripts() {
    const grid = document.getElementById('featuredScripts');
    if (!grid) return;
    
    // Get first 4 scripts as featured
    const featured = allScripts.slice(0, 4);
    displayScripts(featured, grid);
}

function loadAllScripts() {
    const grid = document.getElementById('allScripts');
    if (!grid) return;
    
    displayScripts(allScripts, grid);
}

function displayScripts(scripts, container) {
    container.innerHTML = '';
    
    scripts.forEach(script => {
        const card = createScriptCard(script);
        container.appendChild(card);
    });
}

function createScriptCard(script) {
    const card = document.createElement('div');
    card.className = 'script-card';
    card.innerHTML = `
        <div class="script-card-header">
            <h3>${script.name}</h3>
            <span class="script-badge">${script.category}</span>
        </div>
        <p>${script.description}</p>
        <div class="script-card-footer">
            <span class="script-category">${script.category}</span>
            <span class="script-views">
                <i class="fas fa-eye"></i> ${script.views.toLocaleString()}
            </span>
        </div>
    `;
    
    card.addEventListener('click', () => showScriptDetail(script));
    return card;
}

// ========== SCRIPT DETAIL ==========
function showScriptDetail(script) {
    // Save script to localStorage for detail page
    localStorage.setItem('currentScript', JSON.stringify(script));
    
    // Open modal
    document.getElementById('modalTitle').textContent = script.name;
    document.getElementById('modalCategory').textContent = script.category;
    document.getElementById('modalViews').textContent = `${script.views.toLocaleString()} views`;
    document.getElementById('modalDescription').textContent = script.description;
    document.getElementById('modalCode').textContent = script.code;
    
    openModal('scriptModal');
    
    // Update view count
    script.views++;
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
}

// ========== FILTER & SEARCH ==========
function filterScripts(category) {
    const grid = document.getElementById('allScripts');
    if (!grid) return;
    
    let filtered = allScripts;
    if (category) {
        filtered = allScripts.filter(script => script.category === category);
    }
    
    displayScripts(filtered, grid);
    
    // Update filter dropdown
    const filterSelect = document.getElementById('categoryFilter');
    if (filterSelect) {
        filterSelect.value = category;
    }
}

function searchScripts() {
    const searchInput = document.getElementById('searchInput') || document.getElementById('searchFilter');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    
    const grid = document.getElementById('allScripts');
    if (!grid) return;
    
    let filtered = allScripts;
    if (searchTerm) {
        filtered = allScripts.filter(script => 
            script.name.toLowerCase().includes(searchTerm) ||
            script.description.toLowerCase().includes(searchTerm) ||
            script.category.toLowerCase().includes(searchTerm)
        );
    }
    
    displayScripts(filtered, grid);
}

function scrollToScripts() {
    const section = document.getElementById('allScriptsSection');
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    } else {
        showPage('home');
    }
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
}

function checkSavedScripts() {
    // Check if there are saved scripts from admin
    const savedScripts = localStorage.getItem('meowScripts');
    if (savedScripts) {
        try {
            const scripts = JSON.parse(savedScripts);
            // Merge saved scripts with default ones
            scripts.forEach(savedScript => {
                if (!allScripts.find(s => s.id === savedScript.id)) {
                    allScripts.push(savedScript);
                }
            });
        } catch (e) {
            console.error('Error loading saved scripts:', e);
        }
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});
