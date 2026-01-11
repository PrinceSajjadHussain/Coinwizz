/**
 * =========================================
 * MEMBERSHIP GATING SYSTEM - JavaScript
 * Modular, isolated, rollback-safe
 * =========================================
 * 
 * This system intercepts interactions on side panels
 * without modifying existing logic.
 */

(function() {
    'use strict';

    // ===== CONFIGURATION =====
    const CONFIG = {
        // Membership levels (check localStorage or your auth system)
        PLANS: {
            FREE: 'free',
            STARTER: 'starter',
            PRO: 'pro',
            ELITE: 'elite',
            LIFETIME: 'lifetime'
        },
        
        // Panel selectors for each page
        PANEL_SELECTORS: [
            '.vision-panel',           // crypto-matrix-vision.html
            '#flowsPanel',             // cryptoglobus.html
            '.history-panel',          // financial-galaxy.html, whale-resonance.html, echochambers.html
            '#historyPanel',           // whale-resonance.html, echochambers.html
            '.controls-panel',         // financial-galaxy.html
            '#vevPanel',               // game-vev.html
            '.control-panel',          // generic
            '.side-panel',             // generic
            '.right-panel'             // generic
        ],
        
        // Interactive elements to block
        INTERACTIVE_SELECTORS: 'button, .btn, [role="button"], input, select, textarea, .toggle, .slider, .tab, .filter-btn, .vfilter-btn, .action-btn, .apply-btn, .export-btn, .activate-btn, a[href="#"]',
        
        // Storage key for membership
        STORAGE_KEY: 'cryptospaces_membership'
    };

    // ===== STATE =====
    let currentPlan = CONFIG.PLANS.FREE;
    let tooltip = null;
    let upgradeModal = null;

    // ===== INITIALIZATION =====
    function init() {
        // Load membership status
        loadMembershipStatus();
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupGating);
        } else {
            setupGating();
        }
    }

    function loadMembershipStatus() {
        try {
            const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
            if (stored) {
                const data = JSON.parse(stored);
                currentPlan = data.plan || CONFIG.PLANS.FREE;
            }
        } catch (e) {
            currentPlan = CONFIG.PLANS.FREE;
        }
    }

    function setupGating() {
        // Create tooltip element
        createTooltip();
        
        // Create upgrade modal
        createUpgradeModal();
        
        // Find and gate all panels
        gatePanels();
        
        // Watch for panel open/close (MutationObserver)
        observePanelChanges();
    }

    // ===== TOOLTIP =====
    function createTooltip() {
        tooltip = document.createElement('div');
        tooltip.className = 'gating-tooltip';
        tooltip.textContent = 'Requires an active subscription (Starter/Pro/Elite/Lifetime)';
        document.body.appendChild(tooltip);
    }

    function showTooltip(e) {
        if (!tooltip) return;
        tooltip.style.left = e.clientX + 10 + 'px';
        tooltip.style.top = e.clientY + 10 + 'px';
        tooltip.classList.add('visible');
    }

    function hideTooltip() {
        if (tooltip) tooltip.classList.remove('visible');
    }

    // ===== UPGRADE MODAL =====
    function createUpgradeModal() {
        upgradeModal = document.createElement('div');
        upgradeModal.className = 'gating-upgrade-modal';
        upgradeModal.innerHTML = `
            <div class="gating-modal-content">
                <button class="gating-modal-close" onclick="window.GatingSystem.closeModal()">×</button>
                <h2 class="gating-modal-title">★ UNLOCK FULL ACCESS ★</h2>
                <p class="gating-modal-subtitle">This feature requires an active subscription</p>
                
                <div class="gating-plans">
                    <div class="gating-plan">
                        <div class="gating-plan-name">STARTER</div>
                        <div class="gating-plan-price">€24.90</div>
                        <div class="gating-plan-period">per month</div>
                        <div class="gating-plan-features">
                            <div>25 Rally-Coins</div>
                            <div>Basic Panel Access</div>
                            <div>Live Visualization</div>
                        </div>
                        <button class="gating-plan-btn" onclick="window.location.href='preise.html'">Select</button>
                    </div>
                    
                    <div class="gating-plan">
                        <div class="gating-plan-name">PRO</div>
                        <div class="gating-plan-price">€49.90</div>
                        <div class="gating-plan-period">per month</div>
                        <div class="gating-plan-features">
                            <div>50 Rally-Coins</div>
                            <div>All Panel Features</div>
                            <div>Premium Effects</div>
                            <div>Priority Updates</div>
                        </div>
                        <button class="gating-plan-btn" onclick="window.location.href='preise.html'">Select</button>
                    </div>
                    
                    <div class="gating-plan recommended">
                        <div class="gating-plan-name">ELITE</div>
                        <div class="gating-plan-price">€99.00</div>
                        <div class="gating-plan-period">per month</div>
                        <div class="gating-plan-features">
                            <div>100 Watchlist Slots</div>
                            <div>All Panel Features</div>
                            <div>Deep-Effects</div>
                            <div>AI Visualizations</div>
                            <div>Alerts & Triggers</div>
                        </div>
                        <button class="gating-plan-btn" onclick="window.location.href='preise.html'">Select</button>
                    </div>
                    
                    <div class="gating-plan">
                        <div class="gating-plan-name">LIFETIME</div>
                        <div class="gating-plan-price">€499</div>
                        <div class="gating-plan-period">one-time</div>
                        <div class="gating-plan-features">
                            <div>Everything in Elite</div>
                            <div>Founder Badge</div>
                            <div>Lifetime Access</div>
                            <div>Future Features</div>
                        </div>
                        <button class="gating-plan-btn" onclick="window.location.href='lifetime.html'">Select</button>
                    </div>
                </div>
                
                <div class="gating-legal">
                    ⚠️ No financial advice. Data visualization only. Cryptocurrencies are highly volatile.
                </div>
            </div>
        `;
        document.body.appendChild(upgradeModal);
        
        // Close on backdrop click
        upgradeModal.addEventListener('click', function(e) {
            if (e.target === upgradeModal) {
                closeUpgradeModal();
            }
        });
    }

    function showUpgradeModal() {
        if (upgradeModal) {
            upgradeModal.classList.add('visible');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeUpgradeModal() {
        if (upgradeModal) {
            upgradeModal.classList.remove('visible');
            document.body.style.overflow = '';
        }
    }

    // ===== PANEL GATING =====
    function gatePanels() {
        // Only apply gating for FREE users
        if (currentPlan !== CONFIG.PLANS.FREE) return;
        
        CONFIG.PANEL_SELECTORS.forEach(selector => {
            const panels = document.querySelectorAll(selector);
            panels.forEach(panel => {
                gatePanel(panel);
            });
        });
    }

    function gatePanel(panel) {
        if (!panel || panel.dataset.gated) return;
        panel.dataset.gated = 'true';
        
        // Add preview badge if panel has a header
        addPreviewBadge(panel);
        
        // Add interaction blocker
        addInteractionBlocker(panel);
        
        // Disable interactive elements
        disableInteractiveElements(panel);
    }

    function addPreviewBadge(panel) {
        const header = panel.querySelector('[class*="header"], [class*="Header"]');
        if (header && !header.querySelector('.gating-preview-badge')) {
            const badge = document.createElement('div');
            badge.className = 'gating-preview-badge';
            badge.innerHTML = '🔒 PREVIEW MODE<span class="gating-preview-text">Actions unlock with an active plan</span>';
            header.style.position = 'relative';
            header.appendChild(badge);
        }
    }

    function addInteractionBlocker(panel) {
        // Find the content area (not header)
        const contentArea = panel.querySelector('[class*="content"], [class*="Content"], [class*="body"], [class*="Body"]');
        const targetArea = contentArea || panel;
        
        if (targetArea.querySelector('.gating-interaction-blocker')) return;
        
        // Make target position relative if not already
        const computedStyle = window.getComputedStyle(targetArea);
        if (computedStyle.position === 'static') {
            targetArea.style.position = 'relative';
        }
        
        const blocker = document.createElement('div');
        blocker.className = 'gating-interaction-blocker';
        
        blocker.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            showUpgradeModal();
        });
        
        blocker.addEventListener('mousemove', showTooltip);
        blocker.addEventListener('mouseleave', hideTooltip);
        
        targetArea.appendChild(blocker);
    }

    function disableInteractiveElements(panel) {
        const elements = panel.querySelectorAll(CONFIG.INTERACTIVE_SELECTORS);
        elements.forEach(el => {
            el.classList.add('gating-disabled');
            
            // Add click interceptor
            el.addEventListener('click', function(e) {
                if (currentPlan === CONFIG.PLANS.FREE) {
                    e.preventDefault();
                    e.stopPropagation();
                    showUpgradeModal();
                }
            }, true);
        });
    }

    // ===== MUTATION OBSERVER =====
    function observePanelChanges() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // Check for newly added panels
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            CONFIG.PANEL_SELECTORS.forEach(selector => {
                                if (node.matches && node.matches(selector)) {
                                    gatePanel(node);
                                }
                                const innerPanels = node.querySelectorAll ? node.querySelectorAll(selector) : [];
                                innerPanels.forEach(gatePanel);
                            });
                        }
                    });
                }
                
                // Check for class changes (panel open/close)
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.classList.contains('open') || target.classList.contains('visible')) {
                        CONFIG.PANEL_SELECTORS.forEach(selector => {
                            if (target.matches && target.matches(selector)) {
                                gatePanel(target);
                            }
                        });
                    }
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });
    }

    // ===== PUBLIC API =====
    window.GatingSystem = {
        // Check current plan
        getPlan: function() { return currentPlan; },
        
        // Set plan (for testing or after successful payment)
        setPlan: function(plan) {
            currentPlan = plan;
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({ plan: plan }));
            // Reload to apply changes
            location.reload();
        },
        
        // Check if feature is available
        hasAccess: function(requiredPlan) {
            const hierarchy = [CONFIG.PLANS.FREE, CONFIG.PLANS.STARTER, CONFIG.PLANS.PRO, CONFIG.PLANS.ELITE, CONFIG.PLANS.LIFETIME];
            return hierarchy.indexOf(currentPlan) >= hierarchy.indexOf(requiredPlan);
        },
        
        // Show upgrade modal
        showModal: showUpgradeModal,
        closeModal: closeUpgradeModal,
        
        // Manual gate a panel
        gatePanel: gatePanel,
        
        // Re-run gating
        refresh: gatePanels
    };

    // Initialize
    init();
})();
