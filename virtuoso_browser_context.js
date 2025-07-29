// Browser context version - finds element and returns frame information
function switchFrameToElement(elementIdentifier) {
    var framePath = [];
    var frameElements = [];
    var found = false;

    function searchInFrame(win, currentPath, currentFrames) {
        try {
            var element = win.document.getElementById(elementIdentifier);

            if (element) {
                found = true;
                framePath = currentPath.slice();
                frameElements = currentFrames.slice();
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
                        var newFrames = currentFrames.slice();
                        newFrames.push(iframe);
                        
                        if (searchInFrame(childWin, newPath, newFrames)) {
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
        // Return frame information for Virtuoso to use
        return {
            status: "found",
            path: framePath.join(" > "),
            frameCount: frameElements.length,
            frames: framePath,
            // Return frame selectors that Virtuoso can use
            selectors: frameElements.map(function(frame, index) {
                if (frame.id) {
                    return { type: "id", value: frame.id };
                } else if (frame.className) {
                    return { type: "class", value: frame.className };
                } else {
                    // Use index-based selector
                    return { type: "index", value: index };
                }
            })
        };
    } else {
        return {
            status: "not_found",
            message: "Element '" + elementIdentifier + "' not found in any frame"
        };
    }
}

// Execute and return result
return switchFrameToElement(elementIdentifier);