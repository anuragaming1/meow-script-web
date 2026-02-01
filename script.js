// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
    projectId: "YOUR_FIREBASE_PROJECT_ID",
    storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
    messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
    appId: "YOUR_FIREBASE_APP_ID"
};

// Khởi tạo Firebase
let app;
let auth;
let db;

try {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
} catch (error) {
    console.log("Firebase initialization error:", error);
    // Fallback nếu không có Firebase
}

// State management
let currentUser = null;
let isAdmin = false;
let onlineUsers = [];

// Dữ liệu script mẫu (backup nếu không có Firebase)
const sampleScripts = [
    {
        id: 1,
        name: "Xeter V3",
        trigger: "xeter v3",
        category: "farming",
        code: `getgenv().Version = "V3"\ngetgenv().Team = "Marines"\nloadstring(game:HttpGet("https://raw.githubusercontent.com/TlDinhKhoi/Xeter/refs/heads/main/Main.lua"))()`,
        description: "Script farm chính Xeter phiên bản V3",
        author: "System"
    },
    // ... thêm các script khác từ file JSON của bạn
];

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
    
    // Login elements
    loginModal: document.getElementById('loginModal'),
    modalGoogleLogin: document.getElementById('modalGoogleLogin'),
    modalFacebookLogin: document.getElementById('modalFacebookLogin'),
    guestName: document.getElementById('guestName'),
    guestLoginBtn: document.getElementById('guestLoginBtn'),
    
    // Script elements
    scriptsGrid: document.getElementById('scriptsGrid'),
    searchInput: document.getElementById('searchInput'),
    categoryBtns: document.querySelectorAll('.category-btn'),
    
    // Member scripts elements
    openAddScriptForm: document.getElementById('openAddScriptForm'),
    addScriptForm: document.getElementById('addScriptForm'),
    closeFormBtn: document.getElementById('closeFormBtn'),
    scriptUploadForm: document.getElementById('scriptUploadForm'),
    memberScriptsGrid: document.getElementById('memberScriptsGrid'),
    
    // Chat elements
    messageInput: document.getElementById('messageInput'),
    sendMessageBtn: document.getElementById('sendMessageBtn'),
    messagesContainer: document.getElementById('messagesContainer'),
    usersList: document.getElementById('usersList'),
    onlineCount: document.getElementById('onlineCount'),
    
    // Admin modal
    adminScriptModal: document.getElementById('adminScriptModal'),
    adminScriptForm: document.getElementById('adminScriptForm')
};

// Initialize function
function init() {
    // Load scripts
    loadScripts();
    
    // Setup event listeners
    setupEventListeners();
    
    // Check authentication state
    checkAuthState();
    
    // Set initial page
    navigateToPage('home');
    
    // Update online count
    updateOnlineCount();
}

// Load scripts
function loadScripts() {
    // Nếu có Firebase, load từ Firestore
    // Nếu không, load từ sample data
    if (db) {
        loadScriptsFromFirestore();
    } else {
        displayScripts(sampleScripts);
    }
}

function loadScriptsFromFirestore() {
    db.collection('scripts').where('approved', '==', true)
        .get()
        .then((snapshot) => {
            const scripts = [];
            snapshot.forEach(doc => {
                scripts.push({ id: doc.id, ...doc.data() });
            });
            displayScripts(scripts);
        })
        .catch(error => {
            console.error("Error loading scripts:", error);
            displayScripts(sampleScripts);
        });
}

function displayScripts(scripts) {
    elements.scriptsGrid.innerHTML = '';
    
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
    
    card.innerHTML = `
        <div class="script-icon">
            <i class="fas ${iconClass}"></i>
        </div>
        <h3>${script.name}</h3>
        <p>${script.description || 'No description available'}</p>
        <div class="script-tags">
            <span class="tag">${script.category}</span>
            <span class="tag">${script.author || 'System'}</span>
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

// Event Listeners setup
function setupEventListeners() {
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
        showLoginModal();
    });
    
    // Login methods
    if (elements.modalGoogleLogin) {
        elements.modalGoogleLogin.addEventListener('click', loginWithGoogle);
    }
    
    if (elements.modalFacebookLogin) {
        elements.modalFacebookLogin.addEventListener('click', loginWithFacebook);
    }
    
    // Guest login
    elements.guestLoginBtn.addEventListener('click', loginAsGuest);
    
    // Close modals when clicking X
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
    elements.searchInput.addEventListener('input', filterScripts);
    
    // Category filtering
    elements.categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterScripts();
        });
    });
    
    // Member script form
    elements.openAddScriptForm.addEventListener('click', () => {
        elements.addScriptForm.style.display = 'block';
    });
    
    // Admin add script
    if (elements.addScriptBtn) {
        elements.addScriptBtn.addEventListener('click', () => {
            elements.adminScriptModal.style.display = 'flex';
        });
    }
    
    // Admin script form
    if (elements.adminScriptForm) {
        elements.adminScriptForm.addEventListener('submit', handleAdminScriptSubmit);
    }
    
    // Member script form
    elements.scriptUploadForm.addEventListener('submit', handleMemberScriptSubmit);
    
    // Chat
    elements.sendMessageBtn.addEventListener('click', sendMessage);
    elements.messageInput.addEventListener('keypress', (e) => {
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
}

// Authentication
function checkAuthState() {
    if (auth) {
        auth.onAuthStateChanged((user) => {
            if (user) {
                // User is signed in
                currentUser = user;
                updateUserUI(user);
                checkIfAdmin(user);
                
                // Join chat
                joinChat(user);
            } else {
                // User is signed out
                currentUser = null;
                isAdmin = false;
                updateUserUI(null);
                elements.adminControls.style.display = 'none';
            }
        });
    }
}

function loginWithGoogle() {
    if (!auth) {
        showToast('Firebase not configured. Using guest mode.', 'warning');
        loginAsGuest();
        return;
    }
    
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            showToast('Đăng nhập thành công với Google!', 'success');
            elements.loginModal.style.display = 'none';
        })
        .catch((error) => {
            showToast('Lỗi đăng nhập Google: ' + error.message, 'error');
        });
}

function loginWithFacebook() {
    if (!auth) {
        showToast('Firebase not configured. Using guest mode.', 'warning');
        loginAsGuest();
        return;
    }
    
    const provider = new firebase.auth.FacebookAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            showToast('Đăng nhập thành công với Facebook!', 'success');
            elements.loginModal.style.display = 'none';
        })
        .catch((error) => {
            showToast('Lỗi đăng nhập Facebook: ' + error.message, 'error');
        });
}

function loginAsGuest() {
    const name = elements.guestName.value.trim();
    if (!name) {
        showToast('Vui lòng nhập tên của bạn!', 'error');
        return;
    }
    
    // Tạo user guest
    currentUser = {
        uid: 'guest_' + Date.now(),
        displayName: name,
        isGuest: true
    };
    
    updateUserUI(currentUser);
    showToast(`Chào mừng ${name}!`, 'success');
    elements.loginModal.style.display = 'none';
    
    // Join chat với tư cách guest
    joinChat(currentUser);
}

function logout() {
    if (auth) {
        auth.signOut();
    } else {
        currentUser = null;
        updateUserUI(null);
        showToast('Đã đăng xuất!', 'info');
    }
}

function updateUserUI(user) {
    if (user) {
        const name = user.displayName || user.isGuest ? user.displayName : 'User';
        elements.userName.textContent = name;
        elements.userStatus.textContent = user.isGuest ? 'Guest User' : 'Đã đăng nhập';
        elements.userStatus.style.color = user.isGuest ? '#ff9800' : '#4CAF50';
        
        if (!user.isGuest && user.photoURL) {
            elements.userAvatar.innerHTML = `<img src="${user.photoURL}" alt="${name}" style="width:100%;height:100%;border-radius:50%;">`;
        } else {
            const firstLetter = name.charAt(0).toUpperCase();
            elements.userAvatar.innerHTML = `<span>${firstLetter}</span>`;
        }
        
        elements.loginBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Đăng xuất';
        elements.loginBtn.onclick = logout;
    } else {
        elements.userName.textContent = 'Khách';
        elements.userStatus.textContent = 'Chưa đăng nhập';
        elements.userStatus.style.color = '#f44336';
        elements.userAvatar.innerHTML = '<i class="fas fa-user"></i>';
        elements.loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Đăng nhập';
        elements.loginBtn.onclick = showLoginModal;
    }
}

function checkIfAdmin(user) {
    if (user.email === 'admin@example.com' || 
        (user.displayName === 'Admin' && user.uid === 'admin_uid')) {
        isAdmin = true;
        elements.adminControls.style.display = 'flex';
    }
}

// Script Management
function filterScripts() {
    const searchTerm = elements.searchInput.value.toLowerCase();
    const activeCategory = document.querySelector('.category-btn.active').dataset.category;
    
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
                        <p><strong>Trigger:</strong> ${script.trigger}</p>
                        <p><strong>Category:</strong> ${script.category}</p>
                        <p><strong>Author:</strong> ${script.author || 'System'}</p>
                    </div>
                    <div class="code-container">
                        <div class="code-header">
                            <span>Code Script</span>
                            <button class="copy-btn" onclick="copyToClipboard('${escapeString(script.code)}')">
                                <i class="fas fa-copy"></i> Copy
                            </button>
                        </div>
                        <pre><code>${script.code}</code></pre>
                    </div>
                    <button class="use-script-btn" onclick="useScript('${escapeString(script.code)}')">
                        <i class="fas fa-play"></i> Use Script
                    </button>
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
    
    // Copy button inside modal
    modal.querySelector('.copy-btn').addEventListener('click', function() {
        copyToClipboard(script.code);
        showToast('Đã copy script vào clipboard!', 'success');
    });
}

function escapeString(str) {
    return str.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            showToast('Đã copy vào clipboard!', 'success');
        })
        .catch(err => {
            console.error('Copy failed:', err);
            showToast('Copy thất bại!', 'error');
        });
}

function useScript(code) {
    // Trong thực tế, đây là nơi bạn sẽ inject script vào Roblox
    // Đây chỉ là demo
    showToast('Script đã sẵn sàng để sử dụng!', 'success');
    console.log('Script to execute:', code);
}

function handleAdminScriptSubmit(e) {
    e.preventDefault();
    
    if (!isAdmin) {
        showToast('Chỉ admin mới có thể thêm script!', 'error');
        return;
    }
    
    const scriptName = document.getElementById('adminScriptName').value;
    const trigger = document.getElementById('adminTrigger').value;
    const code = document.getElementById('adminScriptCode').value;
    const category = document.getElementById('adminCategory').value;
    
    if (db) {
        db.collection('scripts').add({
            name: scriptName,
            trigger: trigger,
            code: code,
            category: category,
            author: currentUser.displayName || 'Admin',
            approved: true,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            showToast('Script đã được thêm thành công!', 'success');
            elements.adminScriptForm.reset();
            elements.adminScriptModal.style.display = 'none';
            loadScripts(); // Reload scripts
        })
        .catch(error => {
            showToast('Lỗi khi thêm script: ' + error.message, 'error');
        });
    } else {
        // Fallback: thêm vào local array
        const newScript = {
            id: Date.now(),
            name: scriptName,
            trigger: trigger,
            code: code,
            category: category,
            author: 'Admin',
            description: 'Added by admin'
        };
        
        sampleScripts.push(newScript);
        displayScripts(sampleScripts);
        showToast('Script đã được thêm thành công (local)!', 'success');
        elements.adminScriptForm.reset();
        elements.adminScriptModal.style.display = 'none';
    }
}

function handleMemberScriptSubmit(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showToast('Vui lòng đăng nhập để chia sẻ script!', 'error');
        return;
    }
    
    const scriptName = document.getElementById('scriptName').value;
    const category = document.getElementById('scriptCategory').value;
    const description = document.getElementById('scriptDescription').value;
    const code = document.getElementById('scriptCode').value;
    const authorName = document.getElementById('authorName').value;
    
    // Tạo script object
    const script = {
        name: scriptName,
        category: category,
        description: description,
        code: code,
        author: authorName || currentUser.displayName || 'Anonymous',
        createdAt: new Date().toISOString()
    };
    
    if (db) {
        // Lưu vào Firestore
        db.collection('member_scripts').add({
            ...script,
            userId: currentUser.uid,
            approved: false, // Cần admin duyệt
            status: 'pending'
        })
        .then(() => {
            showToast('Script của bạn đã được gửi, chờ admin duyệt!', 'success');
            elements.scriptUploadForm.reset();
            elements.addScriptForm.style.display = 'none';
            loadMemberScripts();
        })
        .catch(error => {
            showToast('Lỗi khi upload script: ' + error.message, 'error');
        });
    } else {
        // Fallback: lưu localStorage
        let memberScripts = JSON.parse(localStorage.getItem('memberScripts') || '[]');
        script.id = 'local_' + Date.now();
        memberScripts.push(script);
        localStorage.setItem('memberScripts', JSON.stringify(memberScripts));
        
        showToast('Script đã được lưu cục bộ!', 'success');
        elements.scriptUploadForm.reset();
        elements.addScriptForm.style.display = 'none';
        loadMemberScripts();
    }
}

function loadMemberScripts() {
    if (db) {
        db.collection('member_scripts').where('approved', '==', true)
            .orderBy('createdAt', 'desc')
            .get()
            .then((snapshot) => {
                const scripts = [];
                snapshot.forEach(doc => {
                    scripts.push({ id: doc.id, ...doc.data() });
                });
                displayMemberScripts(scripts);
            })
            .catch(error => {
                console.error("Error loading member scripts:", error);
                loadMemberScriptsFromLocal();
            });
    } else {
        loadMemberScriptsFromLocal();
    }
}

function loadMemberScriptsFromLocal() {
    const memberScripts = JSON.parse(localStorage.getItem('memberScripts') || '[]');
    displayMemberScripts(memberScripts);
}

function displayMemberScripts(scripts) {
    elements.memberScriptsGrid.innerHTML = '';
    
    if (scripts.length === 0) {
        elements.memberScriptsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-code-branch"></i>
                <h3>Chưa có script nào được chia sẻ</h3>
                <p>Hãy là người đầu tiên chia sẻ script của bạn!</p>
            </div>
        `;
        return;
    }
    
    scripts.forEach(script => {
        const card = document.createElement('div');
        card.className = 'script-card';
        card.innerHTML = `
            <div class="script-icon">
                <i class="fas ${getScriptIcon(script.category)}"></i>
            </div>
            <h3>${script.name}</h3>
            <p>${script.description || 'Không có mô tả'}</p>
            <div class="script-tags">
                <span class="tag">${script.category}</span>
                <span class="tag">${script.author}</span>
                <span class="tag">Member</span>
            </div>
        `;
        
        card.addEventListener('click', () => showScriptDetails(script));
        elements.memberScriptsGrid.appendChild(card);
    });
}

// Chat functionality
function joinChat(user) {
    if (!db) return;
    
    const userName = user.displayName || (user.isGuest ? user.displayName : 'User');
    const userId = user.uid;
    
    // Thêm user vào online list
    db.collection('online_users').doc(userId).set({
        name: userName,
        isGuest: user.isGuest || false,
        lastSeen: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    // Load messages
    loadMessages();
    
    // Listen for new messages
    db.collection('chat_messages')
        .orderBy('timestamp', 'desc')
        .limit(50)
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                    addMessageToUI(change.doc.data());
                }
            });
        });
    
    // Listen for online users
    db.collection('online_users')
        .onSnapshot((snapshot) => {
            onlineUsers = [];
            elements.usersList.innerHTML = '';
            
            snapshot.forEach(doc => {
                const userData = doc.data();
                onlineUsers.push(userData);
                
                const userItem = document.createElement('div');
                userItem.className = 'user-item';
                userItem.innerHTML = `
                    <div class="user-avatar-small">
                        <i class="fas fa-user"></i>
                    </div>
                    <span>${userData.name}</span>
                    ${userData.isGuest ? '<span style="color: #ff9800; margin-left: auto;">(Guest)</span>' : ''}
                `;
                elements.usersList.appendChild(userItem);
            });
            
            updateOnlineCount();
        });
}

function loadMessages() {
    if (!db) return;
    
    db.collection('chat_messages')
        .orderBy('timestamp', 'desc')
        .limit(50)
        .get()
        .then((snapshot) => {
            const messages = [];
            snapshot.forEach(doc => {
                messages.unshift(doc.data()); // Thêm vào đầu mảng
            });
            
            displayMessages(messages);
        });
}

function displayMessages(messages) {
    elements.messagesContainer.innerHTML = '';
    
    messages.forEach(message => {
        addMessageToUI(message);
    });
}

function addMessageToUI(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    
    const time = message.timestamp ? new Date(message.timestamp.toDate()).toLocaleTimeString() : 'Just now';
    
    messageDiv.innerHTML = `
        <div class="message-header">
            <span class="message-author">${message.senderName}</span>
            <span class="message-time">${time}</span>
        </div>
        <div class="message-content">${message.text}</div>
    `;
    
    elements.messagesContainer.appendChild(messageDiv);
    elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;
}

function sendMessage() {
    if (!currentUser) {
        showToast('Vui lòng đăng nhập để chat!', 'error');
        return;
    }
    
    const messageText = elements.messageInput.value.trim();
    if (!messageText) return;
    
    const senderName = currentUser.displayName || (currentUser.isGuest ? currentUser.displayName : 'User');
    
    if (db) {
        db.collection('chat_messages').add({
            text: messageText,
            senderId: currentUser.uid,
            senderName: senderName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            elements.messageInput.value = '';
        })
        .catch(error => {
            showToast('Lỗi khi gửi tin nhắn: ' + error.message, 'error');
        });
    } else {
        // Fallback: lưu localStorage
        const message = {
            text: messageText,
            senderName: senderName,
            timestamp: new Date().toISOString()
        };
        
        // Hiển thị ngay
        addMessageToUI(message);
        elements.messageInput.value = '';
        
        // Lưu vào localStorage
        let messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
        messages.push(message);
        if (messages.length > 100) messages = messages.slice(-100);
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
}

function updateOnlineCount() {
    const count = onlineUsers.length || 1; // Ít nhất là 1 (chính bạn)
    elements.onlineCount.textContent = count;
}

// Utility functions
function showLoginModal() {
    elements.loginModal.style.display = 'flex';
}

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
        stopOnFocus: true
    }).showToast();
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
