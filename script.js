// ============================================
// MEOW SCRIPT WEB - JavaScript Core
// ============================================

// State management
let currentUser = null;
let isAdmin = false;
let onlineUsers = [];
let chatMessages = [];
let allScripts = [];
let memberScripts = [];
let pendingScripts = [];

// Admin credentials
const ADMIN_USERNAME = 'Anura123';
const ADMIN_PASSWORD = 'Anura123';

// DOM Elements
const elements = {
    // Pages
    homePage: document.getElementById('homePage'),
    memberScriptsPage: document.getElementById('memberScriptsPage'),
    chatPage: document.getElementById('chatPage'),
    infoPage: document.getElementById('infoPage'),
    
    // Menu items
    menuItems: document.querySelectorAll('.menu-item'),
    
    // User elements
    userName: document.getElementById('userName'),
    userStatus: document.getElementById('userStatus'),
    userAvatar: document.getElementById('userAvatar'),
    loginBtn: document.getElementById('loginBtn'),
    
    // Admin elements
    adminControls: document.getElementById('adminControls'),
    addScriptBtn: document.getElementById('addScriptBtn'),
    manageUsersBtn: document.getElementById('manageUsersBtn'),
    
    // Auth elements
    authModal: document.getElementById('authModal'),
    authModalTitle: document.getElementById('authModalTitle'),
    authTabs: document.querySelectorAll('.auth-tab'),
    loginForm: document.getElementById('loginForm'),
    registerForm: document.getElementById('registerForm'),
    switchToRegister: document.getElementById('switchToRegister'),
    switchToLogin: document.getElementById('switchToLogin'),
    
    // Script elements
    scriptsGrid: document.getElementById('scriptsGrid'),
    searchInput: document.getElementById('searchInput'),
    categoryBtns: document.querySelectorAll('.category-btn'),
    totalScripts: document.getElementById('totalScripts'),
    
    // Member scripts elements
    openAddScriptForm: document.getElementById('openAddScriptForm'),
    addScriptForm: document.getElementById('addScriptForm'),
    closeFormBtn: document.getElementById('closeFormBtn'),
    scriptUploadForm: document.getElementById('scriptUploadForm'),
    memberTabs: document.querySelectorAll('.member-tab'),
    approvedScriptsGrid: document.getElementById('approvedScriptsGrid'),
    pendingScriptsGrid: document.getElementById('pendingScriptsGrid'),
    myScriptsGrid: document.getElementById('myScriptsGrid'),
    
    // Chat elements
    messageInput: document.getElementById('messageInput'),
    sendMessageBtn: document.getElementById('sendMessageBtn'),
    messagesContainer: document.getElementById('messagesContainer'),
    usersList: document.getElementById('usersList'),
    onlineCount: document.getElementById('onlineCount'),
    onlineBadge: document.getElementById('onlineBadge'),
    
    // Admin modals
    adminScriptModal: document.getElementById('adminScriptModal'),
    adminScriptForm: document.getElementById('adminScriptForm'),
    adminManageModal: document.getElementById('adminManageModal'),
    adminManageTabs: document.querySelectorAll('.admin-tab'),
    pendingCount: document.getElementById('pendingCount'),
    
    // Footer links
    privacyLink: document.getElementById('privacyLink'),
    termsLink: document.getElementById('termsLink'),
    contactLink: document.getElementById('contactLink'),
    reportLink: document.getElementById('reportLink')
};

// Dữ liệu mẫu script (từ file JSON của bạn)
const sampleScripts = [
    {
        id: 1,
        name: "Xeter V3",
        trigger: "xeter v3",
        category: "farming",
        code: `getgenv().Version = "V3"\ngetgenv().Team = "Marines"\nloadstring(game:HttpGet("https://raw.githubusercontent.com/TlDinhKhoi/Xeter/refs/heads/main/Main.lua"))()`,
        description: "Script farm chính Xeter phiên bản V3",
        author: "System",
        approved: true
    },
    {
        id: 2,
        name: "Xeter V4",
        trigger: "xeter v4",
        category: "farming",
        code: `getgenv().Version = "V4"\ngetgenv().Team = "Marines"\nloadstring(game:HttpGet("https://raw.githubusercontent.com/TlDinhKhoi/Xeter/refs/heads/main/Main.lua"))()`,
        description: "Script farm chính Xeter phiên bản V4",
        author: "System",
        approved: true
    },
    {
        id: 3,
        name: "Teddy Hub Fram",
        trigger: "teddy hub fram",
        category: "farming",
        code: `repeat wait() until game:IsLoaded() and game.Players.LocalPlayer\nloadstring(game:HttpGet("https://raw.githubusercontent.com/Teddyseetink/Haidepzai/refs/heads/main/TeddyHub.lua"))()`,
        description: "Teddy Hub Fram phiên bản mới nhất",
        author: "System",
        approved: true
    },
    {
        id: 4,
        name: "Kaitun TSB",
        trigger: "kaitun tsb",
        category: "farming",
        code: `loadstring(game:HttpGet("https://raw.githubusercontent.com/MEOW-HUB-DEV/SCRIPT-FREE/refs/heads/main/KaitunTSB.lua"))()`,
        description: "Kaitun TSB - Auto Farm mạnh mẽ",
        author: "System",
        approved: true
    },
    {
        id: 5,
        name: "Auto lấy Cyborg",
        trigger: "auto lấy cyborg",
        category: "auto",
        code: `getgenv().Team = "Marines"\ngetgenv().Get_Race = "Cyborg"\nloadstring(game:HttpGet("https://api.luarmor.net/files/v3/loaders/7a6c326e81861b3e1e7207c5d11ed755.lua"))()`,
        description: "Auto nhận race Cyborg",
        author: "System",
        approved: true
    },
    {
        id: 6,
        name: "Fix Lag",
        trigger: "fixlag",
        category: "utility",
        code: `loadstring(game:HttpGet("https://raw.githubusercontent.com/TurboLite/Script/main/FixLag.lua"))()`,
        description: "Script giảm lag, tăng FPS",
        author: "System",
        approved: true
    },
    {
        id: 7,
        name: "Sóc Lọ",
        trigger: "sóc lọ",
        category: "vietnamese",
        code: `loadstring(game:HttpGet("https://raw.githubusercontent.com/anuragaming1/anura/refs/heads/main/soclo.lua"))()`,
        description: "Script Sóc Lọ cho Blox Fruits",
        author: "System",
        approved: true
    },
    {
        id: 8,
        name: "Nhặt Trái",
        trigger: "nhặt trái",
        category: "auto",
        code: `loadstring(game:HttpGet("https://raw.githubusercontent.com/MEOW-HUB-DEV/SCRIPT-FREE/refs/heads/main/Autofruitbypass.lua"))()`,
        description: "Auto nhặt fruit trong Blox Fruits",
        author: "System",
        approved: true
    },
    {
        id: 9,
        name: "Trẩu V5",
        trigger: "trẩu v5",
        category: "vietnamese",
        code: `loadstring(game:HttpGet("https://raw.githubusercontent.com/trungdao2k4/trauroblox/refs/heads/main/traurobloxv5.lua"))()`,
        description: "Script Trẩu phiên bản V5",
        author: "System",
        approved: true
    },
    {
        id: 10,
        name: "Banana Hub",
        trigger: "banana hub",
        category: "farming",
        code: `loadstring(game:HttpGet("https://raw.githubusercontent.com/Chiriku2013/BananaCatHub/refs/heads/main/BananaCatHub.lua"))()`,
        description: "Banana Hub - UI đẹp, nhiều tính năng",
        author: "System",
        approved: true
    }
];

// Initialize function
function init() {
    console.log('🚀 Meow Script Web đang khởi động...');
    
    // Load data từ localStorage
    loadDataFromStorage();
    
    // Setup event listeners
    setupEventListeners();
    
    // Check authentication state
    checkAuthState();
    
    // Set initial page
    navigateToPage('home');
    
    // Load scripts
    loadAllScripts();
    
    // Load member scripts
    loadMemberScripts();
    
    // Load chat messages
    loadChatMessages();
    
    // Update online count
    updateOnlineCount();
    
    // Setup footer links
    setupFooterLinks();
    
    console.log('✅ Meow Script Web đã sẵn sàng!');
}

// Load data từ localStorage
function loadDataFromStorage() {
    // Load users
    const users = localStorage.getItem('meow_users');
    if (!users) {
        // Tạo admin mặc định
        const defaultUsers = [
            {
                id: 'admin_1',
                username: ADMIN_USERNAME,
                password: hashPassword(ADMIN_PASSWORD),
                displayName: 'Admin Anura',
                email: '',
                role: 'admin',
                createdAt: new Date().toISOString(),
                lastLogin: null
            }
        ];
        localStorage.setItem('meow_users', JSON.stringify(defaultUsers));
    }
    
    // Load member scripts
    const scripts = localStorage.getItem('meow_member_scripts');
    if (scripts) {
        memberScripts = JSON.parse(scripts);
    }
    
    // Load chat messages
    const messages = localStorage.getItem('meow_chat_messages');
    if (messages) {
        chatMessages = JSON.parse(messages);
    }
    
    // Load online users
    const online = localStorage.getItem('meow_online_users');
    if (online) {
        onlineUsers = JSON.parse(online);
    }
}

// Save data to localStorage
function saveDataToStorage() {
    localStorage.setItem('meow_member_scripts', JSON.stringify(memberScripts));
    localStorage.setItem('meow_chat_messages', JSON.stringify(chatMessages));
    localStorage.setItem('meow_online_users', JSON.stringify(onlineUsers));
}

// Hash password đơn giản (không dùng cho production)
function hashPassword(password) {
    // Đây chỉ là hash đơn giản cho demo
    // Trong thực tế, cần dùng bcrypt hoặc thư viện hash mạnh hơn
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString();
}

// Event Listeners setup
function setupEventListeners() {
    console.log('🔧 Đang thiết lập event listeners...');
    
    // Navigation
    elements.menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            navigateToPage(page);
            
            // Update active state
            elements.menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
    
    // Login button
    elements.loginBtn.addEventListener('click', () => {
        if (currentUser) {
            logout();
        } else {
            showAuthModal('login');
        }
    });
    
    // Auth tabs
    elements.authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            switchAuthTab(tabName);
        });
    });
    
    // Switch between login/register
    elements.switchToRegister?.addEventListener('click', (e) => {
        e.preventDefault();
        switchAuthTab('register');
    });
    
    elements.switchToLogin?.addEventListener('click', (e) => {
        e.preventDefault();
        switchAuthTab('login');
    });
    
    // Auth forms
    elements.loginForm?.addEventListener('submit', handleLogin);
    elements.registerForm?.addEventListener('submit', handleRegister);
    
    // Password show/hide
    document.querySelectorAll('.show-password').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const input = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
    
    // Close modals
    document.querySelectorAll('.close-modal, .close-form').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal') || elements.addScriptForm;
            modal.style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // Search functionality
    elements.searchInput?.addEventListener('input', filterScripts);
    
    // Category filtering
    elements.categoryBtns?.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterScripts();
        });
    });
    
    // Member script form
    elements.openAddScriptForm?.addEventListener('click', () => {
        if (!currentUser) {
            showToast('Vui lòng đăng nhập để chia sẻ script!', 'error');
            showAuthModal('login');
            return;
        }
        elements.addScriptForm.style.display = 'block';
    });
    
    // Member tabs
    elements.memberTabs?.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            switchMemberTab(tabName);
        });
    });
    
    // Member script form submit
    elements.scriptUploadForm?.addEventListener('submit', handleMemberScriptSubmit);
    
    // Admin add script
    elements.addScriptBtn?.addEventListener('click', () => {
        elements.adminScriptModal.style.display = 'flex';
    });
    
    // Admin manage
    elements.manageUsersBtn?.addEventListener('click', () => {
        showAdminManageModal();
    });
    
    // Admin script form
    elements.adminScriptForm?.addEventListener('submit', handleAdminScriptSubmit);
    
    // Admin manage tabs
    elements.adminManageTabs?.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            switchAdminTab(tabName);
        });
    });
    
    // Chat
    elements.sendMessageBtn?.addEventListener('click', sendMessage);
    elements.messageInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // File upload
    const scriptImage = document.getElementById('scriptImage');
    const fileName = document.getElementById('fileName');
    
    if (scriptImage) {
        scriptImage.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                fileName.textContent = e.target.files[0].name;
            }
        });
    }
    
    console.log('✅ Event listeners đã được thiết lập');
}

// Setup footer links
function setupFooterLinks() {
    // Privacy Policy
    elements.privacyLink?.addEventListener('click', (e) => {
        e.preventDefault();
        showInfoModal('Chính sách bảo mật', `
            <h3><i class="fas fa-shield-alt"></i> Chính sách bảo mật</h3>
            <p>Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Dữ liệu được lưu trữ cục bộ trên trình duyệt của bạn.</p>
            
            <h4>Thông tin thu thập:</h4>
            <ul>
                <li>Tên đăng nhập và mật khẩu (đã được mã hóa)</li>
                <li>Script bạn chia sẻ</li>
                <li>Tin nhắn trong chat</li>
                <li>Thời gian hoạt động</li>
            </ul>
            
            <h4>Mục đích sử dụng:</h4>
            <ul>
                <li>Xác thực người dùng</li>
                <li>Lưu trữ script chia sẻ</li>
                <li>Hiển thị tin nhắn chat</li>
                <li>Phân tích sử dụng (ẩn danh)</li>
            </ul>
            
            <p><strong>Lưu ý:</strong> Dữ liệu chỉ được lưu trên máy tính của bạn và có thể bị xóa khi xóa cache trình duyệt.</p>
        `);
    });
    
    // Terms of Service
    elements.termsLink?.addEventListener('click', (e) => {
        e.preventDefault();
        showInfoModal('Điều khoản dịch vụ', `
            <h3><i class="fas fa-file-contract"></i> Điều khoản dịch vụ</h3>
            <p>Bằng cách sử dụng Meow Script Web, bạn đồng ý với các điều khoản sau:</p>
            
            <h4>Quy tắc sử dụng:</h4>
            <ul>
                <li>Không chia sẻ script độc hại, virus, mã độc</li>
                <li>Không spam, quảng cáo trái phép</li>
                <li>Không sử dụng ngôn ngữ thô tục, xúc phạm người khác</li>
                <li>Không chia sẻ thông tin cá nhân nhạy cảm</li>
                <li>Tuân thủ luật pháp Việt Nam và quốc tế</li>
            </ul>
            
            <h4>Quyền của admin:</h4>
            <ul>
                <li>Xóa script vi phạm mà không cần báo trước</li>
                <li>Khóa tài khoản vi phạm</li>
                <li>Sửa đổi điều khoản bất kỳ lúc nào</li>
            </ul>
            
            <h4>Miễn trừ trách nhiệm:</h4>
            <p>Chúng tôi không chịu trách nhiệm về:</p>
            <ul>
                <li>Script không hoạt động hoặc gây lỗi game</li>
                <li>Tài khoản bị khóa do sử dụng script</li>
                <li>Mất mát dữ liệu do xóa cache trình duyệt</li>
                <li>Hành vi của người dùng khác</li>
            </ul>
            
            <p><strong>Cảnh báo:</strong> Sử dụng script có thể vi phạm điều khoản dịch vụ của Roblox. Sử dụng có trách nhiệm!</p>
        `);
    });
    
    // Contact
    elements.contactLink?.addEventListener('click', (e) => {
        e.preventDefault();
        showInfoModal('Liên hệ', `
            <h3><i class="fas fa-envelope"></i> Liên hệ với chúng tôi</h3>
            
            <div class="contact-info">
                <div class="contact-item">
                    <i class="fab fa-discord"></i>
                    <div>
                        <strong>Discord:</strong>
                        <p>https://discord.gg/sWtCuDf6zw</p>
                    </div>
                </div>
                
                <div class="contact-item">
                    <i class="fas fa-users"></i>
                    <div>
                        <strong>Zalo Group:</strong>
                        <p>https://zalo.me/g/mrzpvn566</p>
                    </div>
                </div>
                
                <div class="contact-item">
                    <i class="fab fa-youtube"></i>
                    <div>
                        <strong>YouTube:</strong>
                        <p>https://www.youtube.com/@Anura-gaming-real</p>
                    </div>
                </div>
                
                <div class="contact-item">
                    <i class="fab fa-tiktok"></i>
                    <div>
                        <strong>TikTok:</strong>
                        <p>https://tiktok.com/@anura_gaming</p>
                    </div>
                </div>
            </div>
            
            <h4>Báo cáo vấn đề:</h4>
            <ul>
                <li>Bug/ lỗi website: Liên hệ qua Discord</li>
                <li>Script độc hại: Báo cáo trong Discord</li>
                <li>Người dùng vi phạm: Tag admin trong chat</li>
                <li>Ý kiến đóng góp: Tạo topic trong Discord</li>
            </ul>
            
            <p><em>Thời gian phản hồi: 24-48 giờ</em></p>
        `);
    });
    
    // Report
    elements.reportLink?.addEventListener('click', (e) => {
        e.preventDefault();
        if (!currentUser) {
            showToast('Vui lòng đăng nhập để báo cáo!', 'error');
            showAuthModal('login');
            return;
        }
        
        showReportModal();
    });
}

// Navigation
function navigateToPage(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active-page');
    });
    
    // Show target page
    const targetPage = document.getElementById(`${page}Page`);
    if (targetPage) {
        targetPage.classList.add('active-page');
    }
    
    // Update page title
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        const titles = {
            home: 'Home - Script List',
            'member-scripts': 'Member Share Scripts',
            chat: 'Member Chat Help',
            info: 'Info'
        };
        pageTitle.textContent = titles[page] || 'Meow Script Web';
    }
    
    // Special handling for chat page
    if (page === 'chat') {
        updateChatUI();
    }
}

// Authentication functions
function checkAuthState() {
    const savedUser = localStorage.getItem('meow_current_user');
    const rememberMe = localStorage.getItem('meow_remember_me') === 'true';
    
    if (savedUser && rememberMe) {
        try {
            currentUser = JSON.parse(savedUser);
            updateUserUI();
            
            if (currentUser.username === ADMIN_USERNAME) {
                isAdmin = true;
                elements.adminControls.style.display = 'flex';
            }
            
            // Join chat
            joinChat();
            
            showToast(`Chào mừng trở lại, ${currentUser.displayName}!`, 'success');
        } catch (e) {
            console.error('Error loading saved user:', e);
            currentUser = null;
        }
    }
}

function showAuthModal(defaultTab = 'login') {
    elements.authModal.style.display = 'flex';
    switchAuthTab(defaultTab);
}

function switchAuthTab(tabName) {
    // Update tabs
    elements.authTabs.forEach(t => t.classList.remove('active'));
    document.querySelector(`.auth-tab[data-tab="${tabName}"]`)?.classList.add('active');
    
    // Update forms
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active-form'));
    document.getElementById(`${tabName}Form`)?.classList.add('active-form');
    
    // Update title
    elements.authModalTitle.textContent = tabName === 'login' ? 'Đăng nhập' : 'Đăng ký';
    
    // Reset forms
    if (tabName === 'login') {
        elements.loginForm.reset();
    } else {
        elements.registerForm.reset();
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    if (!username || !password) {
        showToast('Vui lòng điền đầy đủ thông tin!', 'error');
        return;
    }
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('meow_users') || '[]');
    
    // Check admin login first
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        currentUser = {
            id: 'admin_1',
            username: ADMIN_USERNAME,
            displayName: 'Admin Anura',
            role: 'admin',
            createdAt: new Date().toISOString()
        };
        
        isAdmin = true;
        elements.adminControls.style.display = 'flex';
        
        showToast('Đăng nhập admin thành công!', 'success');
    } else {
        // Check regular users
        const user = users.find(u => u.username === username && u.password === hashPassword(password));
        
        if (!user) {
            showToast('Tên đăng nhập hoặc mật khẩu không đúng!', 'error');
            return;
        }
        
        currentUser = {
            id: user.id,
            username: user.username,
            displayName: user.displayName || user.username,
            email: user.email || '',
            role: user.role || 'member',
            createdAt: user.createdAt
        };
        
        isAdmin = currentUser.role === 'admin';
        if (isAdmin) {
            elements.adminControls.style.display = 'flex';
        }
        
        showToast(`Chào mừng ${currentUser.displayName}!`, 'success');
    }
    
    // Update last login
    currentUser.lastLogin = new Date().toISOString();
    
    // Save to localStorage if remember me is checked
    if (rememberMe) {
        localStorage.setItem('meow_current_user', JSON.stringify(currentUser));
        localStorage.setItem('meow_remember_me', 'true');
    }
    
    // Update UI
    updateUserUI();
    
    // Close modal
    elements.authModal.style.display = 'none';
    
    // Join chat
    joinChat();
    
    // Reload member scripts to show "my scripts"
    if (window.location.hash.includes('member-scripts')) {
        loadMemberScripts();
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const email = document.getElementById('registerEmail').value.trim();
    
    // Validation
    if (username.length < 3 || username.length > 20) {
        showToast('Tên đăng nhập phải từ 3-20 ký tự!', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Mật khẩu phải có ít nhất 6 ký tự!', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showToast('Mật khẩu xác nhận không khớp!', 'error');
        return;
    }
    
    // Check if username already exists
    const users = JSON.parse(localStorage.getItem('meow_users') || '[]');
    if (users.some(u => u.username === username)) {
        showToast('Tên đăng nhập đã tồn tại!', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: 'user_' + Date.now(),
        username: username,
        password: hashPassword(password),
        displayName: username,
        email: email,
        role: 'member',
        createdAt: new Date().toISOString(),
        lastLogin: null
    };
    
    // Save user
    users.push(newUser);
    localStorage.setItem('meow_users', JSON.stringify(users));
    
    // Auto login
    currentUser = {
        id: newUser.id,
        username: newUser.username,
        displayName: newUser.displayName,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
        lastLogin: new Date().toISOString()
    };
    
    showToast('Đăng ký thành công! Đang đăng nhập...', 'success');
    
    // Update UI
    updateUserUI();
    
    // Close modal
    elements.authModal.style.display = 'none';
    
    // Join chat
    joinChat();
}

function logout() {
    // Remove from online users
    if (currentUser) {
        onlineUsers = onlineUsers.filter(u => u.id !== currentUser.id);
        saveDataToStorage();
    }
    
    // Clear current user
    currentUser = null;
    isAdmin = false;
    
    // Clear saved login
    localStorage.removeItem('meow_current_user');
    localStorage.removeItem('meow_remember_me');
    
    // Update UI
    updateUserUI();
    
    // Hide admin controls
    elements.adminControls.style.display = 'none';
    
    showToast('Đã đăng xuất!', 'info');
    
    // Update chat UI
    updateChatUI();
    
    // Reload member scripts
    if (window.location.hash.includes('member-scripts')) {
        loadMemberScripts();
    }
}

function updateUserUI() {
    if (currentUser) {
        elements.userName.textContent = currentUser.displayName;
        elements.userStatus.textContent = currentUser.role === 'admin' ? 'Admin' : 'Đã đăng nhập';
        elements.userStatus.style.color = currentUser.role === 'admin' ? '#ff9800' : '#4CAF50';
        
        const firstLetter = currentUser.displayName.charAt(0).toUpperCase();
        elements.userAvatar.innerHTML = `<span style="font-size: 1.2rem;">${firstLetter}</span>`;
        
        elements.loginBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Đăng xuất';
        
        // Update chat input
        if (elements.messageInput) {
            elements.messageInput.disabled = false;
            elements.messageInput.placeholder = 'Nhập tin nhắn của bạn... (Enter để gửi)';
        }
        if (elements.sendMessageBtn) {
            elements.sendMessageBtn.disabled = false;
        }
        
        // Hide chat note
        const chatNote = document.querySelector('.chat-note');
        if (chatNote) chatNote.style.display = 'none';
    } else {
        elements.userName.textContent = 'Khách';
        elements.userStatus.textContent = 'Chưa đăng nhập';
        elements.userStatus.style.color = '#f44336';
        elements.userAvatar.innerHTML = '<i class="fas fa-user"></i>';
        elements.loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Đăng nhập';
        
        // Disable chat input
        if (elements.messageInput) {
            elements.messageInput.disabled = true;
            elements.messageInput.placeholder = 'Vui lòng đăng nhập để chat';
        }
        if (elements.sendMessageBtn) {
            elements.sendMessageBtn.disabled = true;
        }
        
        // Show chat note
        const chatNote = document.querySelector('.chat-note');
        if (chatNote) chatNote.style.display = 'block';
    }
}

// Script management
function loadAllScripts() {
    // Combine sample scripts with approved member scripts
    const approvedMemberScripts = memberScripts.filter(s => s.approved);
    allScripts = [...sampleScripts, ...approvedMemberScripts];
    
    elements.totalScripts.textContent = allScripts.length + '+';
    displayScripts(allScripts);
}

function displayScripts(scripts) {
    elements.scriptsGrid.innerHTML = '';
    
    if (scripts.length === 0) {
        elements.scriptsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>Không tìm thấy script nào</h3>
                <p>Thử tìm kiếm với từ khóa khác</p>
            </div>
        `;
        return;
    }
    
    scripts.forEach(script => {
        const scriptCard = createScriptCard(script);
        elements.scriptsGrid.appendChild(scriptCard);
    });
}

function createScriptCard(script) {
    const card = document.createElement('div');
    card.className = 'script-card';
    card.dataset.id = script.id;
    card.dataset.category = script.category;
    
    const iconClass = getScriptIcon(script.category);
    const author = script.author === 'System' ? 'System' : script.author;
    
    card.innerHTML = `
        <div class="script-icon">
            <i class="fas ${iconClass}"></i>
        </div>
        <h3>${script.name}</h3>
        <p>${script.description || 'No description available'}</p>
        <div class="script-tags">
            <span class="tag">${script.category}</span>
            <span class="tag">${author}</span>
            ${script.approved === false ? '<span class="tag" style="background: rgba(255, 152, 0, 0.2); color: #ff9800;">Chờ duyệt</span>' : ''}
        </div>
    `;
    
    card.addEventListener('click', () => showScriptDetails(script));
    
    return card;
}

function getScriptIcon(category) {
    const icons = {
        farming: 'fa-seedling',
        auto: 'fa-robot',
        utility: 'fa-tools',
        vietnamese: 'fa-flag',
        tools: 'fa-wrench',
        other: 'fa-code'
    };
    return icons[category] || 'fa-code';
}

function filterScripts() {
    const searchTerm = elements.searchInput.value.toLowerCase();
    const activeCategory = document.querySelector('.category-btn.active')?.dataset.category || 'all';
    
    const scriptCards = document.querySelectorAll('.script-card');
    
    scriptCards.forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const category = card.dataset.category;
        
        const matchesSearch = name.includes(searchTerm) || description.includes(searchTerm);
        const matchesCategory = activeCategory === 'all' || category === activeCategory;
        
        if (matchesSearch && matchesCategory) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function showScriptDetails(script) {
    // Tạo modal hiển thị chi tiết script
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h2><i class="fas fa-code"></i> ${script.name}</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="script-details">
                    <div class="script-info">
                        <p><strong>Tác giả:</strong> ${script.author || 'System'}</p>
                        <p><strong>Thể loại:</strong> ${script.category}</p>
                        ${script.trigger ? `<p><strong>Trigger:</strong> ${script.trigger}</p>` : ''}
                        ${script.description ? `<p><strong>Mô tả:</strong> ${script.description}</p>` : ''}
                        ${script.createdAt ? `<p><strong>Ngày tạo:</strong> ${new Date(script.createdAt).toLocaleDateString('vi-VN')}</p>` : ''}
                    </div>
                    <div class="code-container">
                        <div class="code-header">
                            <span>Code Script</span>
                            <div>
                                <button class="copy-btn" onclick="copyToClipboard('${escapeString(script.code)}')">
                                    <i class="fas fa-copy"></i> Copy
                                </button>
                                ${isAdmin && !script.approved ? `
                                    <button class="approve-btn" onclick="approveScript('${script.id}')">
                                        <i class="fas fa-check"></i> Duyệt
                                    </button>
                                    <button class="reject-btn" onclick="rejectScript('${script.id}')">
                                        <i class="fas fa-times"></i> Từ chối
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                        <pre><code>${script.code}</code></pre>
                    </div>
                    <div class="script-actions">
                        <button class="use-script-btn" onclick="useScript('${escapeString(script.code)}')">
                            <i class="fas fa-play"></i> Sử dụng Script
                        </button>
                        ${currentUser && script.userId === currentUser.id ? `
                            <button class="delete-btn" onclick="deleteMyScript('${script.id}')">
                                <i class="fas fa-trash"></i> Xóa
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal
    modal.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal') || e.target.classList.contains('close-modal')) {
            modal.remove();
        }
    });
}

function escapeString(str) {
    return str.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            showToast('Đã copy script vào clipboard!', 'success');
        })
        .catch(err => {
            console.error('Copy failed:', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showToast('Đã copy script vào clipboard!', 'success');
        });
}

function useScript(code) {
    showToast('Script đã được copy! Dán vào executor để sử dụng.', 'success');
    copyToClipboard(code);
}

// Member scripts
function loadMemberScripts() {
    // Filter scripts
    const approved = memberScripts.filter(s => s.approved);
    const pending = memberScripts.filter(s => !s.approved);
    const myScripts = currentUser ? memberScripts.filter(s => s.userId === currentUser.id) : [];
    
    // Update pending count for admin
    if (isAdmin) {
        elements.pendingCount.textContent = pending.length;
    }
    
    // Display approved scripts
    displayMemberScripts(approved, elements.approvedScriptsGrid);
    
    // Display pending scripts
    displayMemberScripts(pending, elements.pendingScriptsGrid);
    
    // Display my scripts
    displayMemberScripts(myScripts, elements.myScriptsGrid);
}

function displayMemberScripts(scripts, container) {
    container.innerHTML = '';
    
    if (scripts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-code-branch"></i>
                <h3>Không có script nào</h3>
                <p>Hãy chia sẻ script đầu tiên của bạn!</p>
            </div>
        `;
        return;
    }
    
    scripts.forEach(script => {
        const card = createScriptCard(script);
        container.appendChild(card);
    });
}

function switchMemberTab(tabName) {
    // Update tabs
    elements.memberTabs.forEach(t => t.classList.remove('active'));
    document.querySelector(`.member-tab[data-tab="${tabName}"]`)?.classList.add('active');
    
    // Update grids
    const grids = ['approvedScriptsGrid', 'pendingScriptsGrid', 'myScriptsGrid'];
    grids.forEach(grid => {
        const element = document.getElementById(grid);
        if (element) {
            element.style.display = 'none';
        }
    });
    
    document.getElementById(`${tabName}ScriptsGrid`).style.display = 'grid';
}

function handleMemberScriptSubmit(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showToast('Vui lòng đăng nhập để chia sẻ script!', 'error');
        return;
    }
    
    const scriptName = document.getElementById('scriptName').value.trim();
    const category = document.getElementById('scriptCategory').value;
    const description = document.getElementById('scriptDescription').value.trim();
    const code = document.getElementById('scriptCode').value.trim();
    
    if (!scriptName || !category || !code) {
        showToast('Vui lòng điền đầy đủ thông tin!', 'error');
        return;
    }
    
    if (code.length < 10) {
        showToast('Code script quá ngắn!', 'error');
        return;
    }
    
    // Create new script
    const newScript = {
        id: 'script_' + Date.now(),
        name: scriptName,
        category: category,
        description: description || 'Không có mô tả',
        code: code,
        author: currentUser.displayName,
        userId: currentUser.id,
        approved: isAdmin, // Admin scripts are auto-approved
        status: isAdmin ? 'approved' : 'pending',
        createdAt: new Date().toISOString(),
        image: null // Handle image upload if needed
    };
    
    // Add to member scripts
    memberScripts.unshift(newScript);
    saveDataToStorage();
    
    // Reset form
    elements.scriptUploadForm.reset();
    elements.addScriptForm.style.display = 'none';
    
    // Show success message
    if (isAdmin) {
        showToast('Script đã được thêm thành công!', 'success');
    } else {
        showToast('Script đã được gửi, chờ admin duyệt!', 'success');
    }
    
    // Reload scripts
    loadAllScripts();
    loadMemberScripts();
}

// Admin functions
function handleAdminScriptSubmit(e) {
    e.preventDefault();
    
    if (!isAdmin) {
        showToast('Chỉ admin mới có thể thêm script!', 'error');
        return;
    }
    
    const scriptName = document.getElementById('adminScriptName').value.trim();
    const trigger = document.getElementById('adminTrigger').value.trim();
    const code = document.getElementById('adminScriptCode').value.trim();
    const category = document.getElementById('adminCategory').value;
    
    if (!scriptName || !trigger || !code || !category) {
        showToast('Vui lòng điền đầy đủ thông tin!', 'error');
        return;
    }
    
    // Add to sample scripts (system scripts)
    const newScript = {
        id: 'system_' + Date.now(),
        name: scriptName,
        trigger: trigger,
        category: category,
        code: code,
        description: `Script ${scriptName} - Added by admin`,
        author: 'System',
        approved: true,
        createdAt: new Date().toISOString()
    };
    
    // Add to beginning of sampleScripts array
    sampleScripts.unshift(newScript);
    
    // Reset form
    elements.adminScriptForm.reset();
    elements.adminScriptModal.style.display = 'none';
    
    // Show success
    showToast('Script hệ thống đã được thêm thành công!', 'success');
    
    // Reload
    loadAllScripts();
}

function showAdminManageModal() {
    if (!isAdmin) {
        showToast('Chỉ admin mới có thể truy cập!', 'error');
        return;
    }
    
    // Load pending scripts for admin
    pendingScripts = memberScripts.filter(s => !s.approved);
    
    // Update pending count
    elements.pendingCount.textContent = pendingScripts.length;
    
    // Show modal
    elements.adminManageModal.style.display = 'flex';
    
    // Load first tab
    switchAdminTab('pending-scripts');
}

function switchAdminTab(tabName) {
    // Update tabs
    elements.adminManageTabs.forEach(t => t.classList.remove('active'));
    document.querySelector(`.admin-tab[data-tab="${tabName}"]`)?.classList.add('active');
    
    // Hide all content
    document.querySelectorAll('.admin-tab-content').forEach(c => {
        c.style.display = 'none';
    });
    
    // Show selected content
    const contentId = `${tabName}Tab`;
    const content = document.getElementById(contentId);
    if (content) {
        content.style.display = 'block';
        loadAdminTabContent(tabName, content);
    }
}

function loadAdminTabContent(tabName, container) {
    switch(tabName) {
        case 'pending-scripts':
            loadPendingScriptsForAdmin(container);
            break;
        case 'manage-users':
            loadUserManagement(container);
            break;
        case 'system-stats':
            loadSystemStats(container);
            break;
    }
}

function loadPendingScriptsForAdmin(container) {
    if (pendingScripts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-check-circle"></i>
                <h3>Không có script nào chờ duyệt</h3>
                <p>Tất cả script đã được duyệt</p>
            </div>
        `;
        return;
    }
    
    let html = '<div class="pending-scripts-list">';
    
    pendingScripts.forEach(script => {
        html += `
            <div class="pending-script-item">
                <div class="script-header">
                    <h4>${script.name}</h4>
                    <span class="script-author">${script.author}</span>
                </div>
                <div class="script-info">
                    <span class="tag">${script.category}</span>
                    <span class="script-date">${new Date(script.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
                <p class="script-desc">${script.description}</p>
                <div class="script-actions">
                    <button class="btn-small btn-success" onclick="approveScript('${script.id}')">
                        <i class="fas fa-check"></i> Duyệt
                    </button>
                    <button class="btn-small btn-danger" onclick="rejectScript('${script.id}')">
                        <i class="fas fa-times"></i> Từ chối
                    </button>
                    <button class="btn-small btn-info" onclick="previewScript('${script.id}')">
                        <i class="fas fa-eye"></i> Xem
                    </button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function loadUserManagement(container) {
    const users = JSON.parse(localStorage.getItem('meow_users') || '[]');
    
    if (users.length === 0) {
        container.innerHTML = '<p>Không có người dùng nào</p>';
        return;
    }
    
    let html = `
        <div class="users-table">
            <table>
                <thead>
                    <tr>
                        <th>Tên đăng nhập</th>
                        <th>Tên hiển thị</th>
                        <th>Vai trò</th>
                        <th>Ngày tạo</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    users.forEach(user => {
        if (user.username === ADMIN_USERNAME) return; // Skip admin
        
        html += `
            <tr>
                <td>${user.username}</td>
                <td>${user.displayName || user.username}</td>
                <td>
                    <select onchange="changeUserRole('${user.id}', this.value)">
                        <option value="member" ${user.role === 'member' ? 'selected' : ''}>Member</option>
                        <option value="vip" ${user.role === 'vip' ? 'selected' : ''}>VIP</option>
                        <option value="mod" ${user.role === 'mod' ? 'selected' : ''}>Moderator</option>
                    </select>
                </td>
                <td>${new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                <td>
                    <button class="btn-small btn-danger" onclick="deleteUser('${user.id}')">
                        <i class="fas fa-trash"></i> Xóa
                    </button>
                </td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
            <div class="table-stats">
                <p>Tổng số người dùng: <strong>${users.length - 1}</strong> (không tính admin)</p>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function loadSystemStats(container) {
    const users = JSON.parse(localStorage.getItem('meow_users') || '[]');
    const totalScripts = allScripts.length;
    const totalMemberScripts = memberScripts.length;
    const approvedScripts = memberScripts.filter(s => s.approved).length;
    const pendingScripts = memberScripts.filter(s => !s.approved).length;
    const totalMessages = chatMessages.length;
    
    const today = new Date().toISOString().split('T')[0];
    const todayScripts = memberScripts.filter(s => s.createdAt.split('T')[0] === today).length;
    const todayMessages = chatMessages.filter(m => m.timestamp.split('T')[0] === today).length;
    
    container.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <h3>${users.length}</h3>
                <p>Tổng người dùng</p>
            </div>
            <div class="stat-card">
                <h3>${totalScripts}</h3>
                <p>Tổng script</p>
            </div>
            <div class="stat-card">
                <h3>${totalMemberScripts}</h3>
                <p>Script thành viên</p>
            </div>
            <div class="stat-card">
                <h3>${approvedScripts}</h3>
                <p>Script đã duyệt</p>
            </div>
            <div class="stat-card">
                <h3>${pendingScripts}</h3>
                <p>Script chờ duyệt</p>
            </div>
            <div class="stat-card">
                <h3>${totalMessages}</h3>
                <p>Tổng tin nhắn</p>
            </div>
            <div class="stat-card">
                <h3>${todayScripts}</h3>
                <p>Script hôm nay</p>
            </div>
            <div class="stat-card">
                <h3>${todayMessages}</h3>
                <p>Tin nhắn hôm nay</p>
            </div>
        </div>
        
        <div class="system-actions">
            <h4>Hành động hệ thống</h4>
            <div class="action-buttons">
                <button class="btn" onclick="exportData()">
                    <i class="fas fa-download"></i> Xuất dữ liệu
                </button>
                <button class="btn" onclick="clearChat()">
                    <i class="fas fa-trash"></i> Xóa chat
                </button>
                <button class="btn btn-danger" onclick="resetSystem()">
                    <i class="fas fa-redo"></i> Reset hệ thống
                </button>
            </div>
        </div>
    `;
}

function approveScript(scriptId) {
    const script = memberScripts.find(s => s.id === scriptId);
    if (script) {
        script.approved = true;
        script.status = 'approved';
        saveDataToStorage();
        
        showToast('Đã duyệt script!', 'success');
        
        // Reload
        loadAllScripts();
        loadMemberScripts();
        
        // Close modal if open
        document.querySelectorAll('.modal.active').forEach(m => m.remove());
        
        // Update admin modal
        if (elements.adminManageModal.style.display === 'flex') {
            switchAdminTab('pending-scripts');
        }
    }
}

function rejectScript(scriptId) {
    if (confirm('Bạn có chắc chắn muốn từ chối script này?')) {
        memberScripts = memberScripts.filter(s => s.id !== scriptId);
        saveDataToStorage();
        
        showToast('Đã từ chối script!', 'success');
        
        // Reload
        loadAllScripts();
        loadMemberScripts();
        
        // Close modal if open
        document.querySelectorAll('.modal.active').forEach(m => m.remove());
        
        // Update admin modal
        if (elements.adminManageModal.style.display === 'flex') {
            switchAdminTab('pending-scripts');
        }
    }
}

function deleteMyScript(scriptId) {
    if (confirm('Bạn có chắc chắn muốn xóa script này?')) {
        memberScripts = memberScripts.filter(s => s.id !== scriptId);
        saveDataToStorage();
        
        showToast('Đã xóa script!', 'success');
        
        // Reload
        loadAllScripts();
        loadMemberScripts();
        
        // Close modal
        document.querySelectorAll('.modal.active').forEach(m => m.remove());
    }
}

// Chat functions
function updateChatUI() {
    if (!currentUser) {
        // Disable chat input for guests
        if (elements.messageInput) {
            elements.messageInput.disabled = true;
            elements.messageInput.placeholder = 'Vui lòng đăng nhập để chat';
        }
        if (elements.sendMessageBtn) {
            elements.sendMessageBtn.disabled = true;
        }
    } else {
        // Enable chat input for logged in users
        if (elements.messageInput) {
            elements.messageInput.disabled = false;
            elements.messageInput.placeholder = 'Nhập tin nhắn của bạn... (Enter để gửi)';
        }
        if (elements.sendMessageBtn) {
            elements.sendMessageBtn.disabled = false;
        }
    }
}

function joinChat() {
    if (!currentUser) return;
    
    // Add to online users
    const existingIndex = onlineUsers.findIndex(u => u.id === currentUser.id);
    if (existingIndex === -1) {
        onlineUsers.push({
            id: currentUser.id,
            name: currentUser.displayName,
            role: currentUser.role,
            joined: new Date().toISOString()
        });
    } else {
        onlineUsers[existingIndex].joined = new Date().toISOString();
    }
    
    saveDataToStorage();
    updateOnlineUsersList();
    updateOnlineCount();
}

function loadChatMessages() {
    // Display last 50 messages
    const recentMessages = chatMessages.slice(-50);
    displayChatMessages(recentMessages);
}

function displayChatMessages(messages) {
    elements.messagesContainer.innerHTML = '';
    
    if (messages.length === 0) {
        elements.messagesContainer.innerHTML = `
            <div class="welcome-message">
                <i class="fas fa-comment-medical"></i>
                <h3>Chào mừng đến với Meow Chat!</h3>
                <p>Đây là nơi mọi người có thể trao đổi và hỗ trợ nhau về script</p>
                <p>Hãy đăng nhập để tham gia chat!</p>
            </div>
        `;
        return;
    }
    
    messages.forEach(message => {
        addMessageToUI(message);
    });
    
    // Scroll to bottom
    elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;
}

function addMessageToUI(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    
    const time = message.timestamp ? new Date(message.timestamp).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
    }) : 'Vừa xong';
    
    const roleBadge = message.role === 'admin' ? '<span class="role-badge admin">ADMIN</span>' : 
                     message.role === 'mod' ? '<span class="role-badge mod">MOD</span>' : 
                     message.role === 'vip' ? '<span class="role-badge vip">VIP</span>' : '';
    
    messageDiv.innerHTML = `
        <div class="message-header">
            <span class="message-author">
                ${message.senderName}
                ${roleBadge}
            </span>
            <span class="message-time">${time}</span>
        </div>
        <div class="message-content">${message.text}</div>
    `;
    
    elements.messagesContainer.appendChild(messageDiv);
}

function sendMessage() {
    if (!currentUser) {
        showToast('Vui lòng đăng nhập để chat!', 'error');
        return;
    }
    
    const messageText = elements.messageInput.value.trim();
    if (!messageText) return;
    
    // Create message
    const message = {
        id: 'msg_' + Date.now(),
        text: messageText,
        senderId: currentUser.id,
        senderName: currentUser.displayName,
        role: currentUser.role,
        timestamp: new Date().toISOString()
    };
    
    // Add to messages
    chatMessages.push(message);
    saveDataToStorage();
    
    // Add to UI
    addMessageToUI(message);
    
    // Clear input
    elements.messageInput.value = '';
    
    // Scroll to bottom
    elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;
    
    // Auto-reply for certain keywords (demo)
    setTimeout(() => {
        autoReply(messageText.toLowerCase());
    }, 1000);
}

function autoReply(message) {
    if (!currentUser) return;
    
    let reply = null;
    
    if (message.includes('chào') || message.includes('hello') || message.includes('hi')) {
        reply = `Chào ${currentUser.displayName}! Chúc bạn một ngày tốt lành!`;
    } else if (message.includes('script') && message.includes('đâu')) {
        reply = 'Bạn có thể tìm script trong mục Home hoặc chia sẻ script của bạn trong mục Member Share!';
    } else if (message.includes('admin') && message.includes('đâu')) {
        reply = 'Admin thường online vào buổi tối. Bạn có thể tag @Admin trong tin nhắn!';
    } else if (message.includes('cảm ơn') || message.includes('thanks')) {
        reply = 'Không có gì! Cảm ơn bạn đã tham gia cộng đồng!';
    } else if (message.includes('help') || message.includes('giúp')) {
        reply = 'Bạn cần giúp gì? Hãy mô tả vấn đề của bạn, admin hoặc thành viên khác sẽ hỗ trợ!';
    }
    
    if (reply && Math.random() > 0.7) { // 30% chance to auto-reply
        setTimeout(() => {
            const autoMessage = {
                id: 'auto_' + Date.now(),
                text: reply,
                senderId: 'system',
                senderName: 'Bot Hỗ trợ',
                role: 'system',
                timestamp: new Date().toISOString()
            };
            
            chatMessages.push(autoMessage);
            saveDataToStorage();
            addMessageToUI(autoMessage);
        }, 1500);
    }
}

function updateOnlineUsersList() {
    elements.usersList.innerHTML = '';
    
    // Remove users inactive for more than 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    onlineUsers = onlineUsers.filter(u => u.joined > fiveMinutesAgo);
    
    onlineUsers.forEach(user => {
        const userItem = document.createElement('div');
        userItem.className = 'user-item';
        
        const roleClass = user.role === 'admin' ? 'admin' : 
                         user.role === 'mod' ? 'mod' : 
                         user.role === 'vip' ? 'vip' : 'member';
        
        userItem.innerHTML = `
            <div class="user-avatar-small ${roleClass}">
                <i class="fas fa-user"></i>
            </div>
            <span>${user.name}</span>
            ${user.role === 'admin' ? '<span class="user-role admin">ADMIN</span>' : 
              user.role === 'mod' ? '<span class="user-role mod">MOD</span>' : 
              user.role === 'vip' ? '<span class="user-role vip">VIP</span>' : ''}
        `;
        
        elements.usersList.appendChild(userItem);
    });
    
    updateOnlineCount();
}

function updateOnlineCount() {
    const count = onlineUsers.length;
    elements.onlineCount.textContent = count;
    if (elements.onlineBadge) {
        elements.onlineBadge.textContent = count;
    }
}

// Utility functions
function showToast(message, type = 'info') {
    const colors = {
        success: '#4CAF50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196F3'
    };
    
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: colors[type] || colors.info,
        stopOnFocus: true,
        className: type
    }).showToast();
}

function showInfoModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal
    modal.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal') || e.target.classList.contains('close-modal')) {
            modal.remove();
        }
    });
}

function showReportModal() {
    showInfoModal('Báo cáo vấn đề', `
        <h3><i class="fas fa-flag"></i> Báo cáo vấn đề</h3>
        
        <form id="reportForm">
            <div class="form-group">
                <label for="reportType">Loại báo cáo</label>
                <select id="reportType" required>
                    <option value="">Chọn loại báo cáo</option>
                    <option value="script">Script độc hại/virus</option>
                    <option value="user">Người dùng vi phạm</option>
                    <option value="bug">Lỗi website</option>
                    <option value="other">Khác</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="reportTarget">Đối tượng báo cáo</label>
                <input type="text" id="reportTarget" placeholder="Tên script, tên người dùng, hoặc URL">
            </div>
            
            <div class="form-group">
                <label for="reportDetails">Chi tiết báo cáo</label>
                <textarea id="reportDetails" rows="5" placeholder="Mô tả chi tiết vấn đề..." required></textarea>
            </div>
            
            <div class="form-group">
                <label for="reportEvidence">Bằng chứng (không bắt buộc)</label>
                <input type="text" id="reportEvidence" placeholder="Link ảnh, video, hoặc bằng chứng khác">
            </div>
            
            <button type="submit" class="submit-btn">
                <i class="fas fa-paper-plane"></i> Gửi báo cáo
            </button>
        </form>
        
        <script>
            document.getElementById('reportForm').addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Báo cáo đã được gửi! Admin sẽ xem xét trong thời gian sớm nhất.');
                document.querySelector('.modal.active').remove();
            });
        </script>
    `);
}

// Admin utility functions (called from HTML)
window.approveScript = approveScript;
window.rejectScript = rejectScript;
window.deleteMyScript = deleteMyScript;
window.copyToClipboard = copyToClipboard;
window.useScript = useScript;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Auto-save every minute
setInterval(saveDataToStorage, 60000);

// Update online users every 30 seconds
setInterval(() => {
    if (currentUser) {
        joinChat();
    }
}, 30000);
