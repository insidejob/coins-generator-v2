function switchFrameToElement(elementIdentifier) {
    var framePath = [];
    var frameObjects = [];
    var found = false;

    function searchInFrame(win, currentPath, currentFrameObjects) {
        try {
            var element = win.document.getElementById(elementIdentifier);

            if (element) {
                found = true;
                framePath = currentPath.slice();
                frameObjects = currentFrameObjects.slice();
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
                        var newFrameObjects = currentFrameObjects.slice();
                        newFrameObjects.push(iframe);
                        
                        if (searchInFrame(childWin, newPath, newFrameObjects)) {
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
    searchInFrame(window.top, [], []);

    if (found) {
        // Switch to the correct frame context
        // Reset to top frame first
        window.top.focus();
        
        // Switch through each frame in the path
        var currentWindow = window.top;
        for (var i = 0; i < frameObjects.length; i++) {
            try {
                // For Selenium/WebDriver context
                if (typeof driver !== 'undefined' && driver.switchTo) {
                    driver.switchTo().frame(frameObjects[i]);
                }
                // For browser console context
                currentWindow = frameObjects[i].contentWindow;
            } catch (e) {
                console.error("Failed to switch to frame:", e);
            }
        }
        
        return {
            status: "success",
            path: framePath.join(" > "),
            message: "Found and switched to: " + framePath.join(" > "),
            targetWindow: currentWindow
        };
    } else {
        return {
            status: "not_found",
            message: "Element not found in any frame"
        };
    }
}

// For Virtuoso context - this is what you'd use
function switchToElementFrame(elementId) {
    var result = switchFrameToElement(elementId);
    
    if (result.status === "success") {
        // Return the frame path for Virtuoso to use
        return result.path;
    } else {
        throw new Error("Element '" + elementId + "' not found in any frame");
    }
}