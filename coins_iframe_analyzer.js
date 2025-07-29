// COINS-specific iframe analyzer for Virtuoso extension
// Handles all COINS iframe patterns and returns checkpoint breadcrumbs

function analyzeCOINSFrames(selector, selectorType) {
    // Common COINS iframe patterns
    const COINS_FRAME_PATTERNS = {
        mainarea: { id: 'mainarea', checkpoint: 'Main Area Frame' },
        getFrame: { id: 'getFrame', checkpoint: 'Get Frame' },
        dialogFrame: { id: 'dialogFrame', checkpoint: 'Dialog Frame' },
        inlineframeActive: { class: 'inlineframe active', checkpoint: 'Active Inline Frame' },
        inlineframe: { class: 'inlineframe', checkpoint: 'Inline Frame' },
        contentFrame: { id: 'contentFrame', checkpoint: 'Content Frame' },
        reportFrame: { id: 'reportFrame', checkpoint: 'Report Frame' },
        popupFrame: { id: 'popupFrame', checkpoint: 'Popup Frame' },
        wizardFrame: { id: 'wizardFrame', checkpoint: 'Wizard Frame' },
        formFrame: { id: 'formFrame', checkpoint: 'Form Frame' }
    };

    let result = {
        found: false,
        elementSelector: selector,
        selectorType: selectorType || 'auto',
        breadcrumbs: [],
        checkpointPath: [],
        framePath: '',
        virtuosoCommands: [],
        frameDetails: []
    };

    // Helper to find element by different selector types
    function findElementBySelector(doc, selector, type) {
        try {
            switch (type) {
                case 'id':
                    return doc.getElementById(selector);
                case 'class':
                    return doc.getElementsByClassName(selector)[0];
                case 'css':
                    return doc.querySelector(selector);
                case 'xpath':
                    const xpathResult = doc.evaluate(selector, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                    return xpathResult.singleNodeValue;
                case 'auto':
                    // Try to auto-detect selector type
                    if (selector.startsWith('/') || selector.includes('//')) {
                        return findElementBySelector(doc, selector, 'xpath');
                    } else if (selector.startsWith('#')) {
                        return doc.querySelector(selector);
                    } else if (selector.startsWith('.')) {
                        return doc.querySelector(selector);
                    } else if (selector.includes('[') || selector.includes(':')) {
                        return doc.querySelector(selector);
                    } else {
                        // Try as ID first, then as class
                        return doc.getElementById(selector) || doc.getElementsByClassName(selector)[0] || doc.querySelector(selector);
                    }
                default:
                    return null;
            }
        } catch (e) {
            return null;
        }
    }

    // Recursive frame search
    function searchInFrame(win, currentPath, currentBreadcrumbs, currentCheckpoints) {
        try {
            const element = findElementBySelector(win.document, selector, selectorType);
            
            if (element) {
                result.found = true;
                result.breadcrumbs = currentBreadcrumbs.slice();
                result.checkpointPath = currentCheckpoints.slice();
                result.framePath = currentPath.join(' > ');
                result.elementDetails = {
                    tagName: element.tagName,
                    id: element.id,
                    className: element.className,
                    visible: element.offsetWidth > 0 && element.offsetHeight > 0
                };
                return true;
            }

            const iframes = win.document.getElementsByTagName('iframe');
            
            for (let i = 0; i < iframes.length; i++) {
                const iframe = iframes[i];
                
                // Identify COINS frame type
                let frameInfo = {
                    index: i,
                    id: iframe.id,
                    className: iframe.className,
                    name: iframe.name,
                    src: iframe.src
                };
                
                let breadcrumb = '';
                let checkpoint = '';
                
                // Match against COINS patterns
                for (const [patternName, pattern] of Object.entries(COINS_FRAME_PATTERNS)) {
                    if (pattern.id && iframe.id === pattern.id) {
                        breadcrumb = `${pattern.id} (${pattern.checkpoint})`;
                        checkpoint = pattern.checkpoint;
                        frameInfo.coinsType = patternName;
                        break;
                    } else if (pattern.class && iframe.className && iframe.className.includes(pattern.class)) {
                        breadcrumb = `${pattern.class} (${pattern.checkpoint})`;
                        checkpoint = pattern.checkpoint;
                        frameInfo.coinsType = patternName;
                        break;
                    }
                }
                
                // Fallback for unknown frames
                if (!breadcrumb) {
                    if (iframe.id) {
                        breadcrumb = `${iframe.id} (Custom Frame)`;
                        checkpoint = `Frame: ${iframe.id}`;
                    } else if (iframe.className) {
                        breadcrumb = `${iframe.className} (Class-based Frame)`;
                        checkpoint = `Frame with class: ${iframe.className}`;
                    } else {
                        breadcrumb = `Frame[${i}] (Index-based)`;
                        checkpoint = `Frame at index ${i}`;
                    }
                }
                
                try {
                    const childWin = iframe.contentWindow;
                    if (childWin && childWin.document) {
                        const newPath = currentPath.slice();
                        newPath.push(iframe.id || iframe.className || `frame${i}`);
                        
                        const newBreadcrumbs = currentBreadcrumbs.slice();
                        newBreadcrumbs.push(breadcrumb);
                        
                        const newCheckpoints = currentCheckpoints.slice();
                        newCheckpoints.push(checkpoint);
                        
                        result.frameDetails.push(frameInfo);
                        
                        if (searchInFrame(childWin, newPath, newBreadcrumbs, newCheckpoints)) {
                            return true;
                        }
                        
                        // Remove if not in path
                        result.frameDetails.pop();
                    }
                } catch (e) {
                    // Cross-origin frame
                    frameInfo.crossOrigin = true;
                    frameInfo.error = 'Cross-origin access denied';
                    result.frameDetails.push(frameInfo);
                }
            }
        } catch (e) {
            return false;
        }
        return false;
    }

    // Start search
    searchInFrame(window.top || window, [], [], []);

    // Generate Virtuoso commands
    if (result.found) {
        result.virtuosoCommands.push('Switch to parent frame');
        
        result.checkpointPath.forEach((checkpoint, index) => {
            const frameDetail = result.frameDetails[index];
            
            if (frameDetail && frameDetail.coinsType) {
                // Use COINS-specific commands
                switch (frameDetail.coinsType) {
                    case 'mainarea':
                        result.virtuosoCommands.push('Switch to iframe "mainarea"');
                        break;
                    case 'getFrame':
                        result.virtuosoCommands.push('Switch to iframe "getFrame"');
                        break;
                    case 'dialogFrame':
                        result.virtuosoCommands.push('Switch to iframe "dialogFrame"');
                        break;
                    case 'inlineframeActive':
                        result.virtuosoCommands.push('Switch to active inlineframe');
                        break;
                    case 'inlineframe':
                        result.virtuosoCommands.push('Switch to inlineframe');
                        break;
                    default:
                        if (frameDetail.id) {
                            result.virtuosoCommands.push(`Switch to iframe "${frameDetail.id}"`);
                        } else if (frameDetail.className) {
                            result.virtuosoCommands.push(`Switch to iframe with class "${frameDetail.className}"`);
                        } else {
                            result.virtuosoCommands.push(`Switch to iframe at index ${frameDetail.index}`);
                        }
                }
            }
        });
        
        // Add checkpoint recommendations
        result.recommendations = generateCheckpointRecommendations(result);
    }
    
    return result;
}

// Generate checkpoint recommendations based on frame path
function generateCheckpointRecommendations(result) {
    const recommendations = {
        checkpoints: [],
        waitConditions: [],
        verifications: []
    };
    
    // Common COINS checkpoints
    const hasMainArea = result.checkpointPath.includes('Main Area Frame');
    const hasDialog = result.checkpointPath.includes('Dialog Frame');
    const hasActiveInline = result.checkpointPath.includes('Active Inline Frame');
    
    if (hasMainArea) {
        recommendations.checkpoints.push({
            name: 'Wait for Main Area',
            command: 'Wait for element "#mainarea" to be visible',
            reason: 'Main area frame must be loaded before switching'
        });
    }
    
    if (hasDialog) {
        recommendations.checkpoints.push({
            name: 'Check Dialog State',
            command: 'Wait for element "#dialogFrame" to exist',
            reason: 'Dialog frames are dynamically created'
        });
    }
    
    if (hasActiveInline) {
        recommendations.checkpoints.push({
            name: 'Verify Active Frame',
            command: 'Wait for element with class "inlineframe active" to be visible',
            reason: 'Active state may change dynamically'
        });
        recommendations.waitConditions.push('Wait 500ms for frame activation');
    }
    
    // Add verification for the target element
    recommendations.verifications.push({
        step: 'Final Verification',
        command: `Wait for element "${result.elementSelector}" to be visible`,
        timeout: 5000
    });
    
    // Frame depth warnings
    if (result.frameDetails.length > 3) {
        recommendations.warnings = [
            'Deep frame nesting detected (' + result.frameDetails.length + ' levels)',
            'Consider adding intermediate checkpoints',
            'May need longer timeouts for frame loading'
        ];
    }
    
    // Cross-origin warnings
    const crossOriginFrames = result.frameDetails.filter(f => f.crossOrigin);
    if (crossOriginFrames.length > 0) {
        recommendations.warnings = recommendations.warnings || [];
        recommendations.warnings.push('Cross-origin frames detected - some frames may not be accessible');
    }
    
    return recommendations;
}

// Main execution function for Virtuoso extension
function executeCOINSFrameAnalysis(selector, selectorType) {
    const analysis = analyzeCOINSFrames(selector, selectorType);
    
    // Format response for Virtuoso extension
    return {
        status: analysis.found ? 'SUCCESS' : 'NOT_FOUND',
        elementId: selector,
        selectorType: analysis.selectorType,
        frameCount: analysis.frameDetails.length,
        frameDetails: analysis.frameDetails,
        framePath: analysis.framePath,
        breadcrumbs: analysis.breadcrumbs,
        checkpointPath: analysis.checkpointPath,
        virtuosoSteps: analysis.virtuosoCommands,
        recommendations: analysis.recommendations || null,
        elementDetails: analysis.elementDetails || null,
        // Quick summary for easy consumption
        summary: analysis.found ? 
            `Element found in: ${analysis.breadcrumbs.join(' → ')}` : 
            `Element not found. Searched ${analysis.frameDetails.length} frames.`
    };
}

// Export for extension use
if (typeof chrome !== 'undefined' && chrome.runtime) {
    // Running in Chrome extension context
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'analyzeCOINSFrames') {
            const result = executeCOINSFrameAnalysis(request.selector, request.selectorType);
            sendResponse(result);
        }
    });
}

// Direct execution support
return executeCOINSFrameAnalysis(elementIdentifier, 'auto');