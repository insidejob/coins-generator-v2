// Virtuoso-specific implementation that actually switches frames
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
        // For Virtuoso, we need to execute the frame switches
        // First switch to default content (top frame)
        driver.switchTo().defaultContent();
        
        // Then switch through each frame in sequence
        for (var i = 0; i < frameElements.length; i++) {
            driver.switchTo().frame(frameElements[i]);
        }
        
        return "Switched to: " + framePath.join(" > ");
    } else {
        return "Element not found";
    }
}

// Alternative approach using frame names/IDs directly
function switchToFramePath(framePath) {
    // Reset to top
    driver.switchTo().defaultContent();
    
    // Split the path and switch to each frame
    var frames = framePath.split(" > ");
    
    for (var i = 0; i < frames.length; i++) {
        var frameName = frames[i].trim();
        
        // Handle different frame identifiers
        if (frameName === "mainarea" || frameName === "getFrame") {
            // Switch by ID
            driver.switchTo().frame(frameName);
        } else if (frameName === "inlineframe active") {
            // Find the active inlineframe
            var inlineframes = driver.findElements(By.className("inlineframe"));
            for (var j = 0; j < inlineframes.length; j++) {
                if (inlineframes[j].getAttribute("class").includes("active")) {
                    driver.switchTo().frame(inlineframes[j]);
                    break;
                }
            }
        } else {
            // Try by ID or class
            try {
                driver.switchTo().frame(frameName);
            } catch (e) {
                // Try to find by class if ID fails
                var frameElement = driver.findElement(By.className(frameName));
                driver.switchTo().frame(frameElement);
            }
        }
    }
}

// Usage in Virtuoso:
// 1. Find and switch: switchFrameToElement("queryColumnFilter")
// 2. Or manually switch: switchToFramePath("mainarea > getFrame > inlineframe active > getFrame")