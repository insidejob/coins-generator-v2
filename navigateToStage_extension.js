/**
 * COINS ERP Virtuoso Extension: navigateToStage
 * 
 * Purpose: Navigate between stages in COINS multi-step dialogs (e.g., House Sales Reservation)
 * without frame context issues.
 * 
 * Usage:
 *   navigateToStage("PURCH1")
 *   navigateToStage("SOLIC", { action: "edit" })
 */

// Extension registration for Virtuoso
extensions.navigateToStage = function(stageCode, options = {}) {
    try {
        // Get current page URL and context
        const currentUrl = window.location.href;
        const baseUrl = window.location.origin;
        
        // Extract dynamic IDs from current URL or page
        let wbRowid = extractUrlParam(currentUrl, 'vp_wbsdefRowid');
        let resRowid = extractUrlParam(currentUrl, 'hs_resprogRowid');
        
        // If not in URL, try to extract from page elements
        if (!wbRowid || !resRowid) {
            const stageButtons = document.querySelectorAll('button.stage-button[data-coinshref]');
            if (stageButtons.length > 0) {
                const sampleHref = stageButtons[0].getAttribute('data-coinshref');
                wbRowid = wbRowid || extractUrlParam(sampleHref, 'vp_wbsdefRowid');
                resRowid = resRowid || extractUrlParam(sampleHref, 'hs_resprogRowid');
            }
        }
        
        // Validate we have required IDs
        if (!wbRowid || !resRowid) {
            throw new Error('Could not extract workbench or reservation IDs from current context');
        }
        
        // Get current KCO (company code)
        const kco = extractUrlParam(currentUrl, 'kco') || '210'; // Default to 210 if not found
        
        // Build navigation parameters
        const params = {
            'TopMenu': '%25WHS2',
            'kco': kco,
            'program': 'wou005',
            'MainArea': '%WHS1011SPPE',
            'workbench': 'SALES',
            'vp_wbsdefRowid': wbRowid,
            'hs_resprogRowid': resRowid,
            'reservationStage': stageCode,
            'button': options.action ? `action:${options.action}` : 'action:add',
            'fromSalesKanban': options.fromKanban ? 'progbar' : ''
        };
        
        // Build the full URL
        const queryString = Object.entries(params)
            .filter(([_, value]) => value) // Remove empty values
            .map(([key, value]) => `${key}=${value}`)
            .join('&');
        
        const navigationUrl = `${baseUrl}/env/upgrade/woframe.p?${queryString}`;
        
        // Log for debugging
        console.log('Navigating to stage:', stageCode);
        console.log('URL:', navigationUrl);
        
        // Navigate to the URL
        window.location.href = navigationUrl;
        
        // Return success (Virtuoso will handle the navigation)
        return {
            success: true,
            url: navigationUrl,
            stage: stageCode
        };
        
    } catch (error) {
        console.error('navigateToStage error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Helper function to extract URL parameters
function extractUrlParam(url, param) {
    try {
        const urlObj = new URL(url, window.location.origin);
        return urlObj.searchParams.get(param);
    } catch (e) {
        // Fallback for malformed URLs
        const regex = new RegExp(`[?&]${param}=([^&]*)`);
        const match = url.match(regex);
        return match ? match[1] : null;
    }
}

// Alternative implementation using Virtuoso's built-in navigation
extensions.navigateToStageVirtuoso = function(stageCode, options = {}) {
    try {
        // Extract IDs as before
        const currentUrl = window.location.href;
        let wbRowid = extractUrlParam(currentUrl, 'vp_wbsdefRowid');
        let resRowid = extractUrlParam(currentUrl, 'hs_resprogRowid');
        
        // Try to get from stage buttons if not in URL
        if (!wbRowid || !resRowid) {
            const stageButtons = document.querySelectorAll('button.stage-button[data-coinshref]');
            if (stageButtons.length > 0) {
                const sampleHref = stageButtons[0].getAttribute('data-coinshref');
                wbRowid = wbRowid || extractUrlParam(sampleHref, 'vp_wbsdefRowid');
                resRowid = resRowid || extractUrlParam(sampleHref, 'hs_resprogRowid');
            }
        }
        
        if (!wbRowid || !resRowid) {
            throw new Error('Could not extract required IDs');
        }
        
        const kco = extractUrlParam(currentUrl, 'kco') || '210';
        
        // Build URL
        const params = {
            'TopMenu': '%25WHS2',
            'kco': kco,
            'program': 'wou005',
            'MainArea': '%WHS1011SPPE',
            'workbench': 'SALES',
            'vp_wbsdefRowid': wbRowid,
            'hs_resprogRowid': resRowid,
            'reservationStage': stageCode,
            'button': options.action ? `action:${options.action}` : 'action:add',
            'fromSalesKanban': options.fromKanban ? 'progbar' : ''
        };
        
        const queryString = Object.entries(params)
            .filter(([_, value]) => value)
            .map(([key, value]) => `${key}=${value}`)
            .join('&');
        
        // Use Virtuoso's navigate command
        const url = `/env/upgrade/woframe.p?${queryString}`;
        
        // Return the URL for Virtuoso to navigate
        return url;
        
    } catch (error) {
        console.error('navigateToStageVirtuoso error:', error);
        throw error;
    }
};

// Stage code reference
const STAGE_CODES = {
    START: 'START',
    PURCHASER1: 'PURCH1',
    PURCHASER2: 'PURCH2',
    SOLICITOR: 'SOLIC',
    PLOT_SELECTION: 'PLOTSEL',
    EXTRAS: 'EXTRAS',
    SUMMARY: 'SUMM',
    FINANCE: 'FINANCE',
    DOCUMENTS: 'DOCS'
};

// Export stage codes for reference
extensions.COINS_STAGES = STAGE_CODES;

// Convenience methods for common stages
extensions.navigateToPurchaser1 = function() {
    return extensions.navigateToStage('PURCH1');
};

extensions.navigateToPurchaser2 = function() {
    return extensions.navigateToStage('PURCH2');
};

extensions.navigateToSolicitor = function() {
    return extensions.navigateToStage('SOLIC');
};

// Debug helper to show available stages on current page
extensions.debugStages = function() {
    const buttons = document.querySelectorAll('button.stage-button[data-coinshref]');
    const stages = [];
    
    buttons.forEach(button => {
        const href = button.getAttribute('data-coinshref');
        const stage = extractUrlParam(href, 'reservationStage');
        const text = button.textContent.trim();
        
        if (stage) {
            stages.push({
                stage: stage,
                text: text,
                href: href
            });
        }
    });
    
    console.table(stages);
    return stages;
};