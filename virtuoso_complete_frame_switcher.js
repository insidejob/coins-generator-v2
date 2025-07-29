// Complete Virtuoso Frame Switcher - finds element and provides frame switching code
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
        // Build Virtuoso switching commands
        var switchCommands = [];
        
        // First, reset to top frame
        switchCommands.push("Switch to parent frame");
        
        // Then switch through each frame
        for (var i = 0; i < framePath.length; i++) {
            var frame = framePath[i];
            
            if (frame === "mainarea" || frame === "getFrame" || frame === "dialogFrame") {
                // Standard frame IDs
                switchCommands.push('Switch to iframe "' + frame + '"');
            } else if (frame === "inlineframe active" || frame.includes("inlineframe")) {
                // Active inlineframe
                switchCommands.push('Switch to active inlineframe');
            } else if (frame.startsWith("frame")) {
                // Index-based frame
                var index = parseInt(frame.replace("frame", ""));
                switchCommands.push('Switch to iframe at index ' + index);
            } else {
                // Try by class or ID
                switchCommands.push('Switch to iframe with class/id "' + frame + '"');
            }
        }
        
        // Return detailed result with everything needed
        return {
            status: "SUCCESS",
            elementId: elementIdentifier,
            framePath: framePath.join(" > "),
            frameCount: frameElements.length,
            virtuosoSteps: switchCommands,
            // Also return frame details for manual verification
            frameDetails: frameElements.map(function(frame, index) {
                return {
                    level: index + 1,
                    id: frame.id || null,
                    className: frame.className || null,
                    name: frame.name || null,
                    src: frame.src || null
                };
            }),
            // Provide the actual switching function for Virtuoso
            switchingCode: generateSwitchingCode(framePath)
        };
    } else {
        return {
            status: "NOT_FOUND",
            elementId: elementIdentifier,
            message: "Element '" + elementIdentifier + "' not found in any frame"
        };
    }
}

// Generate switching code based on frame path
function generateSwitchingCode(framePath) {
    var code = [];
    
    // Reset to top
    code.push("// Reset to top frame");
    code.push("driver.switchTo().defaultContent();");
    code.push("");
    
    // Switch through each frame
    code.push("// Switch through frame hierarchy");
    for (var i = 0; i < framePath.length; i++) {
        var frame = framePath[i];
        
        if (frame === "mainarea" || frame === "getFrame" || frame === "dialogFrame") {
            code.push('driver.switchTo().frame("' + frame + '");');
        } else if (frame === "inlineframe active") {
            code.push('// Find and switch to active inlineframe');
            code.push('var activeFrame = driver.findElement(By.css(".inlineframe.active"));');
            code.push('driver.switchTo().frame(activeFrame);');
        } else if (frame.includes("inlineframe")) {
            code.push('// Switch to inlineframe');
            code.push('var inlineFrame = driver.findElement(By.className("inlineframe"));');
            code.push('driver.switchTo().frame(inlineFrame);');
        } else if (frame.startsWith("frame")) {
            var index = parseInt(frame.replace("frame", ""));
            code.push('// Switch to frame by index');
            code.push('driver.switchTo().frame(' + index + ');');
        } else {
            code.push('// Switch to frame by id or class: ' + frame);
            code.push('try {');
            code.push('  driver.switchTo().frame("' + frame + '");');
            code.push('} catch(e) {');
            code.push('  var frameEl = driver.findElement(By.className("' + frame + '"));');
            code.push('  driver.switchTo().frame(frameEl);');
            code.push('}');
        }
    }
    
    return code.join('\n');
}

// Execute and return comprehensive result
return switchFrameToElement(elementIdentifier);