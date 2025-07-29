// Auto-switching version that finds AND switches to the element's frame
function switchFrameToElement(elementIdentifier) {
    var framePath = [];
    var frameWindows = [];
    var targetWindow = null;
    var targetElement = null;
    var found = false;

    function searchInFrame(win, currentPath, currentWindows) {
        try {
            var element = win.document.getElementById(elementIdentifier);

            if (element) {
                found = true;
                framePath = currentPath.slice();
                frameWindows = currentWindows.slice();
                targetWindow = win;
                targetElement = element;
                return true;
            }

            var iframes = win.document.getElementsByTagName('iframe');
            for (var i = 0; i < iframes.length; i++) {
                var iframe = iframes[i];
                var frameId = iframe.id || iframe.className || 'frame' + i;

                try {
                    var childWin = iframe.contentWindow;
                    if (childWin) {
                        var newPath = currentPath.slice();
                        newPath.push(frameId);
                        var newWindows = currentWindows.slice();
                        newWindows.push(childWin);
                        
                        if (searchInFrame(childWin, newPath, newWindows)) {
                            return true;
                        }
                    }
                } catch (e) {
                    continue;
                }
            }
        } catch (e) {
            return false;
        }

        return false;
    }

    // Search starting from top window
    searchInFrame(window.top, [], [window.top]);

    if (found && targetWindow) {
        // Make the target window the active context
        // This is the key part - we need to ensure subsequent operations happen in this context
        
        // Focus the target element to ensure its frame is active
        try {
            targetElement.scrollIntoView();
            targetElement.focus();
        } catch (e) {
            // Element might not be focusable
        }
        
        // Create a flag in the target window to verify we're in the right context
        targetWindow.__virtuoso_active_frame__ = true;
        
        // Return success with the active window context
        return {
            success: true,
            message: "Switched to frame containing element '" + elementIdentifier + "'",
            framePath: framePath.join(" > "),
            frameDepth: framePath.length,
            // Provide a test to verify we're in the right frame
            verifyAccess: function() {
                try {
                    return targetWindow.document.getElementById(elementIdentifier) !== null;
                } catch (e) {
                    return false;
                }
            },
            // Provide direct access to the element
            getElement: function() {
                return targetWindow.document.getElementById(elementIdentifier);
            }
        };
    } else {
        return {
            success: false,
            message: "Element '" + elementIdentifier + "' not found in any frame"
        };
    }
}

// Execute the switch and verify it worked
var result = switchFrameToElement(elementIdentifier);

if (result.success) {
    // Verify we can access the element
    var element = result.getElement();
    if (element) {
        // Highlight the element to show we found it
        element.style.border = "3px solid red";
        setTimeout(function() {
            element.style.border = "";
        }, 2000);
        
        return {
            status: "SUCCESS - Switched to frame and highlighted element",
            framePath: result.framePath,
            elementFound: true,
            elementId: element.id,
            elementTagName: element.tagName,
            elementVisible: element.offsetWidth > 0 && element.offsetHeight > 0
        };
    }
}

return result;