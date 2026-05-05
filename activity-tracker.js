/**
 * Activity Tracker for VisuaLearning
 * Tracks user interaction and security violations.
 * Connect this to a backend (e.g., Firebase) for real-time tracking across users.
 */

const ActivityTracker = {
    logs: [],
    sessionId: Math.random().toString(36).substring(2, 15),
    startTime: Date.now(),

    init() {
        this.loadLogs();
        this.trackPageView();
        this.setupSecurityListeners();
        this.detectDevTools();
        
        // Save logs every 10 seconds or on page leave
        setInterval(() => this.saveLogs(), 10000);
        window.addEventListener('beforeunload', () => this.saveLogs());
    },

    logEvent(type, details = {}) {
        const event = {
            id: Date.now() + Math.random().toString(10),
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            page: window.location.pathname.split('/').pop() || 'index.html',
            type: type,
            details: details,
            userAgent: navigator.userAgent
        };
        
        this.logs.push(event);
        console.log(`[Tracker] ${type}:`, details);
        
        // In a real app, you would POST this to an API
        // fetch('https://your-api.com/log', { method: 'POST', body: JSON.stringify(event) });
    },

    loadLogs() {
        const saved = localStorage.getItem('vls_activity_logs');
        if (saved) {
            try {
                this.logs = JSON.parse(saved);
            } catch (e) {
                this.logs = [];
            }
        }
    },

    saveLogs() {
        // We only save the last 500 logs to prevent localStorage bloat
        const totalLogs = [...this.logs];
        if (totalLogs.length > 500) totalLogs.splice(0, totalLogs.length - 500);
        localStorage.setItem('vls_activity_logs', JSON.stringify(totalLogs));
    },

    trackPageView() {
        this.logEvent('PAGE_VIEW', { referrer: document.referrer });
    },

    setupSecurityListeners() {
        // Track Right Click
        document.addEventListener('contextmenu', (e) => {
            this.logEvent('SECURITY_VIOLATION', { action: 'RIGHT_CLICK_ATTEMPT' });
        });

        // Track Keyboard Shortcuts
        document.addEventListener('keydown', (e) => {
            // F12
            if (e.keyCode === 123) {
                this.logEvent('SECURITY_VIOLATION', { action: 'F12_ATTEMPT' });
            }
            // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
            if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
                this.logEvent('SECURITY_VIOLATION', { action: 'DEVTOOLS_SHORTCUT' });
            }
            if (e.ctrlKey && e.keyCode === 85) {
                this.logEvent('SECURITY_VIOLATION', { action: 'VIEW_SOURCE_ATTEMPT' });
            }
        });
    },

    detectDevTools() {
        let lastState = false;
        const threshold = 160;

        const check = () => {
            const widthDiff = window.outerWidth - window.innerWidth > threshold;
            const heightDiff = window.outerHeight - window.innerHeight > threshold;
            const isOpen = widthDiff || heightDiff;

            if (isOpen && !lastState) {
                this.logEvent('SECURITY_VIOLATION', { action: 'DEVTOOLS_OPENED' });
            }
            lastState = isOpen;
        };

        setInterval(check, 1000);
        
        // Advanced detection using debugger timing
        setInterval(() => {
            const startTime = performance.now();
            debugger;
            const endTime = performance.now();
            if (endTime - startTime > 100) {
                this.logEvent('SECURITY_VIOLATION', { action: 'DEBUGGER_PAUSE_DETECTED' });
            }
        }, 2000);
    }
};

// Start tracking
ActivityTracker.init();
window.ActivityTracker = ActivityTracker;
