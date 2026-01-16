/**
 * =========================================
 * PREMIUM PAGE GATING SYSTEM
 * Role-based access control for premium pages
 * =========================================
 */

(function() {
    'use strict';

    // ===== USER ROLES =====
    const USER_ROLES = {
        SUPER_ADMIN: 'super_admin',
        PAID: 'paid',
        FREE: 'free'
    };

    // ===== CONFIGURATION =====
    const CONFIG = {
        STORAGE_KEY: 'cryptoUser',
        SUPER_ADMIN_EMAILS: ['orhan366@gmail.com', 'sajjad.aiengineer@gmail.com'],
        PAID_PLANS: ['rallye25', 'rallye50', 'rallye100', 'elite', 'lifetime']
    };

    // ===== GET USER ROLE =====
    function getUserRole() {
        const user = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY) || 'null');
        
        // Check if super admin
        if (user && user.email && CONFIG.SUPER_ADMIN_EMAILS.includes(user.email.toLowerCase())) {
            return USER_ROLES.SUPER_ADMIN;
        }
        
        // Check if paid user
        if (user && user.loggedIn && user.plan && CONFIG.PAID_PLANS.includes(user.plan)) {
            return USER_ROLES.PAID;
        }
        
        // Default to free
        return USER_ROLES.FREE;
    }

    // ===== GET USER PLAN =====
    function getUserPlan() {
        const user = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY) || 'null');
        if (!user || !user.loggedIn) return 'free';
        return user.plan || 'free';
    }

    // ===== APPLY GATING =====
    function applyPremiumGating() {
        const role = getUserRole();
        const plan = getUserPlan();
        
        console.log(`[PREMIUM GATING] User role: ${role}, Plan: ${plan}`);
        
        if (role === USER_ROLES.SUPER_ADMIN) {
            console.log('[PREMIUM GATING] Super Admin - Full access granted');
            removeLockOverlay();
            return;
        }
        
        if (role === USER_ROLES.PAID) {
            console.log('[PREMIUM GATING] Paid User - Full access granted');
            removeLockOverlay();
            return;
        }
        
        // Free user - show locked overlay
        console.log('[PREMIUM GATING] Free User - Applying lock overlay');
        showLockOverlay();
    }

    // ===== SHOW LOCK OVERLAY =====
    function showLockOverlay() {
        // Check if overlay already exists
        if (document.getElementById('premium-lock-overlay')) return;
        
        const overlay = document.createElement('div');
        overlay.id = 'premium-lock-overlay';
        overlay.innerHTML = `
            <div class="lock-content">
                <div class="lock-icon">🔒</div>
                <h2 class="lock-title">Premium Feature</h2>
                <p class="lock-description">
                    This page is exclusively available to paying members.<br>
                    Unlock powerful features and insights!
                </p>
                <div class="lock-plans">
                    <div class="plan-card">
                        <div class="plan-name">Rallye25</div>
                        <div class="plan-price">€24.90/mo</div>
                        <div class="plan-features">25 Coins Access</div>
                    </div>
                    <div class="plan-card highlighted">
                        <div class="plan-badge">POPULAR</div>
                        <div class="plan-name">Rallye50</div>
                        <div class="plan-price">€49.90/mo</div>
                        <div class="plan-features">50 Coins Access</div>
                    </div>
                    <div class="plan-card">
                        <div class="plan-name">Elite Rallye100</div>
                        <div class="plan-price">€99.90/mo</div>
                        <div class="plan-features">100 Coins Access</div>
                    </div>
                </div>
                <button class="upgrade-btn" onclick="window.location.href='dashboard.html'">
                    🚀 Upgrade Now
                </button>
                <a href="index.html" class="back-link">← Back to Home</a>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }

    // ===== REMOVE LOCK OVERLAY =====
    function removeLockOverlay() {
        const overlay = document.getElementById('premium-lock-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    // ===== INITIALIZE ON PAGE LOAD =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyPremiumGating);
    } else {
        applyPremiumGating();
    }

    // ===== EXPOSE UTILITY FUNCTIONS =====
    window.PremiumGating = {
        getUserRole: getUserRole,
        getUserPlan: getUserPlan,
        checkAccess: function() {
            const role = getUserRole();
            return role === USER_ROLES.SUPER_ADMIN || role === USER_ROLES.PAID;
        }
    };

})();
