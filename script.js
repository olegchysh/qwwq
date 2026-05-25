// Глобальні змінні
let currentTheme = 'light';
let systemInfo = {};

// Ініціалізація при завантаженні сторінки
window.onload = function() {
    initializeTheme();
    detectSystemInfo();
    loadReviews();
    setupModalTimer();
};

// 1. Функціональність теми
function initializeTheme() {
    // Отримуємо збережену тему з localStorage
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        currentTheme = savedTheme;
    } else {
        // Автоматичне перемикання теми за часом (7:00-21:00 денна)
        const hour = new Date().getHours();
        currentTheme = (hour >= 7 && hour < 21) ? 'light' : 'dark';
    }
    
    applyTheme(currentTheme);
    
    // Додаємо обробник для кнопки перемикання теми
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
    currentTheme = theme;
}

function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
}

// 2. Визначення та збереження системної інформації
function detectSystemInfo() {
    systemInfo = {
        os: navigator.platform || 'Невідомо',
        browser: getBrowserName(),
        userAgent: navigator.userAgent
    };
    
    // Зберігаємо у localStorage
    localStorage.setItem('systemInfo', JSON.stringify(systemInfo));
    
    // Відображаємо у футері
    displaySystemInfo();
}

function getBrowserName() {
    const ua = navigator.userAgent;
    
    if (ua.includes('Chrome')) return 'Google Chrome';
    if (ua.includes('Firefox')) return 'Mozilla Firefox';
    if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Microsoft Edge';
    
    return 'Невідомий браузер';
}

function displaySystemInfo() {
    const osInfo = document.getElementById('os-info');
    const browserInfo = document.getElementById('browser-info');
    
    if (osInfo) osInfo.textContent = systemInfo.os;
    if (browserInfo) browserInfo.textContent = systemInfo.browser;
}

// 3. Завантаження відгуків з JSONPlaceholder (варіант 19)
function loadReviews() {
    const reviewsList = document.getElementById('reviews-list');
    
    // Показуємо завантаження
    reviewsList.innerHTML = '<div style="text-align: center; padding: 20px;">⏳ Завантаження відгуків...</div>';
    
    // Робимо запит до JSONPlaceholder
    fetch('https://jsonplaceholder.typicode.com/posts/19/comments')
        .then(response => {
            if (!response.ok) {
                throw new Error('Помилка завантаження');
            }
            return response.json();
        })
        .then(comments => {
            displayReviews(comments);
        })
        .catch(error => {
            console.error('Помилка завантаження відгуків:', error);
            reviewsList.innerHTML = '<div style="color: red; text-align: center;">❌ Не вдалося завантажити відгуки</div>';
        });
}

function displayReviews(comments) {
    const reviewsList = document.getElementById('reviews-list');
    
    if (!comments || comments.length === 0) {
        reviewsList.innerHTML = '<div style="text-align: center;">📝 Відгуки відсутні</div>';
        return;
    }
    
    let html = '';
    
    // Відображаємо коментарі у порядку отримання
    comments.forEach((comment, index) => {
        html += `
            <div class="review-item" style="animation-delay: ${index * 0.1}s">
                <strong>${escapeHtml(comment.name)}</strong>
                <p>"${escapeHtml(comment.body)}"</p>
                <small>📧 ${escapeHtml(comment.email)}</small>
            </div>
        `;
    });
    
    reviewsList.innerHTML = html;
}

// Функція для безпечного відображення HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 4. Модальне вікно форми (показується через 1 хвилину)
function setupModalTimer() {
    // Показуємо модальне вікно через 1 хвилину (60000 мс)
    setTimeout(() => {
        showModal();
    }, 100);
}

function showModal() {
    const modal = document.getElementById('modal-overlay');
    if (modal) {
        modal.style.display = 'flex';
        // Додаємо анімацію появи
        modal.style.animation = 'fadeIn 0.3s ease-out';
    }
}

function hideModal() {
    const modal = document.getElementById('modal-overlay');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Закриття модального вікна при кліку поза ним
document.addEventListener('click', function(event) {
    const modal = document.getElementById('modal-overlay');
    if (event.target === modal) {
        hideModal();
    }
});

// Закриття модального вікна при натисканні Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        hideModal();
    }
});

// 5. Обробка відправки форми
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form[action="https://formspree.io/f/mojkzdqk"]');
    
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Показуємо індикатор відправки
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '⏳ Відправка...';
            submitBtn.disabled = true;
            
            // Створюємо FormData для відправки
            const formData = new FormData(form);
            
            // Відправляємо форму через fetch
            fetch('https://formspree.io/f/mojkzdqk', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Показуємо повідомлення про успіх
                    alert('✅ Форму успішно відправлено!');
                    form.reset();
                    hideModal();
                } else {
                    throw new Error('Помилка відправки');
                }
            })
            .catch(error => {
                console.error('Помилка відправки форми:', error);
                alert('❌ Не вдалося відправити форму. Спробуйте ще раз.');
            })
            .finally(() => {
                // Повертаємо кнопку в початковий стан
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }
});

// 6. Плавна прокрутка до секцій
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 7. Додаткова анімація при скролі
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY + window.innerHeight;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition > sectionTop + 100) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    });
});

// Ініціалізація при першому завантаженні
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // Додаткова ініціалізація якщо потрібно
    });
} else {
    // Якщо документ вже завантажений
    // Додаткова ініціалізація якщо потрібно
}
