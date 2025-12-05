// Dynamic Island Application
class DynamicIsland {
    constructor() {
        this.island = document.getElementById('dynamicIsland');
        this.currentState = 'small';
        this.currentContent = 'music';
        this.isExpanded = false;
        this.animationSpeed = 1;
        this.settings = {
            theme: 'default',
            position: 'center',
            speed: 1,
            size: 1
        };
        
        // Demo data
        this.musicData = {
            isPlaying: true,
            currentTime: 16,
            totalTime: 199,
            title: "Montagem Orchestra Sinfonica",
            artist: "DJ Tenebroso"
        };
        
        this.timerData = {
            totalTime: 300,
            remainingTime: 180,
            isRunning: true
        };
        
        this.callData = {
            contact: "John Doe",
            isIncoming: true,
            isActive: false
        };
        
        this.batteryData = {
            level: 85,
            isCharging: true
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.startTimers();
        this.setActiveContent('music');
        this.updateAnimationSpeed();
    }
    
    bindEvents() {
        // Island click events
        this.island.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleState();
        });
        
        // Touch events for mobile
        let touchStartTime = 0;
        this.island.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
        });
        
        this.island.addEventListener('touchend', (e) => {
            const touchDuration = Date.now() - touchStartTime;
            if (touchDuration > 500) {
                this.handleLongPress();
            }
        });
        
        // Demo buttons
        document.querySelectorAll('.demo-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const demo = e.target.dataset.demo;
                this.setActiveContent(demo);
                this.setState('large');
            });
        });
        
        // State buttons
        document.querySelectorAll('.state-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const state = e.target.dataset.state;
                this.setState(state);
                this.updateStateButtons(state);
            });
        });
        
        // Music controls
        const playPauseBtn = document.getElementById('playPauseBtn');
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMusic();
            });
        }
        
        // Timer controls
        const timerBtn = document.getElementById('timerBtn');
        if (timerBtn) {
            timerBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleTimer();
            });
        }
        
        // Call controls
        const acceptBtn = document.getElementById('acceptBtn');
        const declineBtn = document.getElementById('declineBtn');
        
        if (acceptBtn) {
            acceptBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.acceptCall();
            });
        }
        
        if (declineBtn) {
            declineBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.declineCall();
            });
        }
        
        // Settings
        const settingsBtn = document.getElementById('settingsBtn');
        const closeSettingsBtn = document.getElementById('closeSettingsBtn');
        const settingsPanel = document.getElementById('settingsPanel');
        
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                settingsPanel.classList.remove('hidden');
            });
        }
        
        if (closeSettingsBtn) {
            closeSettingsBtn.addEventListener('click', () => {
                settingsPanel.classList.add('hidden');
            });
        }
        
        // Settings controls
        const themeSelect = document.getElementById('themeSelect');
        const positionSelect = document.getElementById('positionSelect');
        const speedRange = document.getElementById('speedRange');
        const sizeRange = document.getElementById('sizeRange');
        
        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                this.setTheme(e.target.value);
            });
        }
        
        if (positionSelect) {
            positionSelect.addEventListener('change', (e) => {
                this.setPosition(e.target.value);
            });
        }
        
        if (speedRange) {
            speedRange.addEventListener('input', (e) => {
                this.setAnimationSpeed(parseFloat(e.target.value));
                e.target.nextElementSibling.textContent = `${e.target.value}x`;
            });
        }
        
        if (sizeRange) {
            sizeRange.addEventListener('input', (e) => {
                this.setSize(parseFloat(e.target.value));
                e.target.nextElementSibling.textContent = `${e.target.value}x`;
            });
        }
        
        // Click outside to collapse
        document.addEventListener('click', (e) => {
            if (!this.island.contains(e.target) && !e.target.closest('.control-panel') && !e.target.closest('.settings-panel')) {
                if (this.currentState === 'large') {
                    this.setState('small');
                }
            }
        });
    }
    
    setState(newState) {
        if (this.currentState === newState) return;
        
        this.currentState = newState;
        this.island.setAttribute('data-state', newState);
        
        // Update expanded state
        this.isExpanded = newState === 'large';
        
        // Add loading class for smooth transition
        this.island.classList.add('loading');
        setTimeout(() => {
            this.island.classList.remove('loading');
        }, 400 * this.settings.speed);
    }
    
    toggleState() {
        switch (this.currentState) {
            case 'small':
                this.setState('medium');
                break;
            case 'medium':
                this.setState('large');
                break;
            case 'large':
                this.setState('small');
                break;
        }
    }
    
    setActiveContent(contentType) {
        this.currentContent = contentType;
        
        // Hide all content sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show active content section
        const activeSection = document.querySelector(`.${contentType}-content`);
        if (activeSection) {
            activeSection.classList.add('active');
        }
        
        // Update demo button states
        document.querySelectorAll('.demo-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-demo="${contentType}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }
    
    updateStateButtons(activeState) {
        document.querySelectorAll('.state-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-state="${activeState}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }
    
    handleLongPress() {
        // Long press to quickly access settings or change content
        if (this.currentState === 'small') {
            this.setState('large');
        } else {
            this.cycleContent();
        }
    }
    
    cycleContent() {
        const contentTypes = ['music', 'timer', 'call', 'notification', 'battery'];
        const currentIndex = contentTypes.indexOf(this.currentContent);
        const nextIndex = (currentIndex + 1) % contentTypes.length;
        this.setActiveContent(contentTypes[nextIndex]);
    }
    
    // Music Player Methods
    toggleMusic() {
        this.musicData.isPlaying = !this.musicData.isPlaying;
        const playPauseBtn = document.getElementById('playPauseBtn');
        if (playPauseBtn) {
            playPauseBtn.textContent = this.musicData.isPlaying ? '⏸️' : '▶️';
        }
    }
    
    updateMusicProgress() {
        if (this.musicData.isPlaying && this.musicData.currentTime < this.musicData.totalTime) {
            this.musicData.currentTime++;
            
            const progress = (this.musicData.currentTime / this.musicData.totalTime) * 100;
            const progressFill = document.querySelector('.progress-fill');
            const currentTimeEl = document.querySelector('.current-time');
            
            if (progressFill) {
                progressFill.style.width = `${progress}%`;
            }
            
            if (currentTimeEl) {
                const minutes = Math.floor(this.musicData.currentTime / 60);
                const seconds = this.musicData.currentTime % 60;
                currentTimeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
        }
    }
    
    // Timer Methods
    toggleTimer() {
        this.timerData.isRunning = !this.timerData.isRunning;
        const timerBtn = document.getElementById('timerBtn');
        if (timerBtn) {
            timerBtn.textContent = this.timerData.isRunning ? '⏸️' : '▶️';
        }
    }
    
    updateTimer() {
        if (this.timerData.isRunning && this.timerData.remainingTime > 0) {
            this.timerData.remainingTime--;
            
            const minutes = Math.floor(this.timerData.remainingTime / 60);
            const seconds = this.timerData.remainingTime % 60;
            const timerTimeEl = document.getElementById('timerTime');
            
            if (timerTimeEl) {
                timerTimeEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
            
            // Update circular progress
            const progress = (this.timerData.totalTime - this.timerData.remainingTime) / this.timerData.totalTime;
            const circumference = 2 * Math.PI * 45;
            const offset = circumference * (1 - progress);
            
            const timerCircle = document.getElementById('timerCircle');
            if (timerCircle) {
                timerCircle.style.strokeDashoffset = offset;
            }
            
            // Timer finished
            if (this.timerData.remainingTime === 0) {
                this.timerData.isRunning = false;
                this.showNotification('Timer', 'Timer finished!');
            }
        }
    }
    
    // Call Methods
    acceptCall() {
        this.callData.isIncoming = false;
        this.callData.isActive = true;
        
        const callerStatus = document.querySelector('.caller-status');
        if (callerStatus) {
            callerStatus.textContent = 'Call in progress...';
            callerStatus.style.animation = 'none';
        }
        
        const callControls = document.querySelector('.call-controls');
        if (callControls) {
            callControls.innerHTML = `
                <button class="call-btn decline-btn" onclick="dynamicIsland.endCall()">📞</button>
            `;
        }
    }
    
    declineCall() {
        this.endCall();
    }
    
    endCall() {
        this.callData.isIncoming = true;
        this.callData.isActive = false;
        this.setState('small');
        this.showNotification('Call', 'Call ended');
    }
    
    // Notification Methods
    showNotification(title, message, duration = 3000) {
        // Create a temporary notification display
        const notification = document.createElement('div');
        notification.className = 'notification-toast';
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--color-surface);
            border: 1px solid var(--color-card-border);
            border-radius: var(--radius-lg);
            padding: var(--space-12) var(--space-16);
            box-shadow: var(--shadow-lg);
            z-index: 10001;
            animation: slideDown 0.3s ease;
        `;
        
        notification.innerHTML = `
            <div style="font-weight: 500; margin-bottom: 4px;">${title}</div>
            <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">${message}</div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, duration);
    }
    
    // Settings Methods
    setTheme(theme) {
        this.settings.theme = theme;
        this.island.setAttribute('data-theme', theme);
    }
    
    setPosition(position) {
        this.settings.position = position;
        this.island.setAttribute('data-position', position);
    }
    
    setAnimationSpeed(speed) {
        this.settings.speed = speed;
        this.animationSpeed = speed;
        this.updateAnimationSpeed();
    }
    
    setSize(size) {
        this.settings.size = size;
        this.island.style.transform = `translateX(-50%) scale(${size})`;
    }
    
    updateAnimationSpeed() {
        const duration = 0.4 / this.animationSpeed;
        this.island.style.transitionDuration = `${duration}s`;
    }
    
    // Timer Functions
    startTimers() {
        // Music progress timer
        setInterval(() => {
            this.updateMusicProgress();
        }, 1000);
        
        // Timer countdown
        setInterval(() => {
            this.updateTimer();
        }, 1000);
        
        // Battery simulation (slow change)
        setInterval(() => {
            if (this.batteryData.isCharging && this.batteryData.level < 100) {
                this.batteryData.level = Math.min(100, this.batteryData.level + 1);
                this.updateBatteryDisplay();
            }
        }, 30000);
    }
    
    updateBatteryDisplay() {
        const batteryLevel = document.querySelector('.battery-level');
        const batteryFill = document.querySelector('.battery-fill');
        
        if (batteryLevel) {
            batteryLevel.textContent = `${this.batteryData.level}%`;
        }
        
        if (batteryFill) {
            batteryFill.style.width = `${this.batteryData.level}%`;
        }
    }
}

// Initialize the Dynamic Island when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dynamicIsland = new DynamicIsland();
    
    // Add CSS animations for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
        
        @keyframes slideUp {
            from {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
            to {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
        }
    `;
    document.head.appendChild(style);
});

// Touch gesture support for mobile
class TouchGestureHandler {
    constructor(element, callback) {
        this.element = element;
        this.callback = callback;
        this.startX = 0;
        this.startY = 0;
        this.startTime = 0;
        
        this.element.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.element.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }
    
    handleTouchStart(e) {
        const touch = e.touches[0];
        this.startX = touch.clientX;
        this.startY = touch.clientY;
        this.startTime = Date.now();
    }
    
    handleTouchEnd(e) {
        const touch = e.changedTouches[0];
        const endX = touch.clientX;
        const endY = touch.clientY;
        const endTime = Date.now();
        
        const deltaX = endX - this.startX;
        const deltaY = endY - this.startY;
        const deltaTime = endTime - this.startTime;
        
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Detect gesture type
        let gesture = 'tap';
        
        if (deltaTime > 500 && distance < 10) {
            gesture = 'longpress';
        } else if (distance > 30) {
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                gesture = deltaX > 0 ? 'swiperight' : 'swipeleft';
            } else {
                gesture = deltaY > 0 ? 'swipedown' : 'swipeup';
            }
        }
        
        this.callback(gesture, { deltaX, deltaY, deltaTime, distance });
    }
}

// Performance optimization for smooth animations
class PerformanceOptimizer {
    static requestAnimationFrame(callback) {
        return window.requestAnimationFrame(callback);
    }
    
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}