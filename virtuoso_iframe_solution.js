// Solution 1: Return Virtuoso-executable commands as a string
function generateVirtuosoFrameCommands(elementIdentifier) {
    var framePath = [];
    var found = false;

    function searchInFrame(win, currentPath) {
        try {
            var element = win.document.getElementById(elementIdentifier);
            if (element) {
                found = true;
                framePath = currentPath.slice();
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
                        newPath.push({
                            id: iframe.id,
                            className: iframe.className,
                            index: i
                        });
                        
                        if (searchInFrame(childWin, newPath)) {
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

    searchInFrame(window.top, []);

    if (found) {
        // Generate Virtuoso commands
        var commands = [];
        
        // Always start from parent frame
        commands.push('Switch to parent frame');
        
        // Build frame switching commands
        for (var i = 0; i < framePath.length; i++) {
            var frame = framePath[i];
            
            if (frame.id) {
                commands.push('Switch to iframe "' + frame.id + '"');
            } else if (frame.className && frame.className.includes('active')) {
                commands.push('Switch to active inlineframe');
            } else if (frame.className) {
                commands.push('Switch to iframe with class "' + frame.className + '"');
            } else {
                commands.push('Switch to iframe at index ' + frame.index);
            }
        }
        
        return {
            success: true,
            commands: commands,
            commandString: commands.join('\n'),
            elementId: elementIdentifier
        };
    }
    
    return {
        success: false,
        message: "Element not found"
    };
}

// Solution 2: Create a smart element locator that works across frames
function createCrossFrameElementLocator(elementIdentifier) {
    var result = generateVirtuosoFrameCommands(elementIdentifier);
    
    if (result.success) {
        // Return a custom protocol URL that Virtuoso could interpret
        return {
            type: "VIRTUOSO_FRAME_NAVIGATION",
            steps: result.commands,
            target: elementIdentifier,
            // Create a unique selector that includes frame context
            virtualSelector: "frames:" + result.commands.map(function(cmd) {
                var match = cmd.match(/"([^"]+)"/);
                return match ? match[1] : "index";
            }).join(">") + ">#" + elementIdentifier
        };
    }
    
    return null;
}

// Solution 3: Create a frame map with element visibility info
function mapFramesWithElement(elementIdentifier) {
    var frameMap = {
        top: { hasElement: false, frames: {} }
    };
    
    function mapFrame(win, path, node) {
        try {
            // Check for element
            var element = win.document.getElementById(elementIdentifier);
            if (element) {
                node.hasElement = true;
                node.elementInfo = {
                    visible: element.offsetWidth > 0 && element.offsetHeight > 0,
                    tagName: element.tagName,
                    value: element.value || element.textContent || ""
                };
            }
            
            // Map child frames
            var iframes = win.document.getElementsByTagName('iframe');
            for (var i = 0; i < iframes.length; i++) {
                var iframe = iframes[i];
                var frameKey = iframe.id || iframe.className || 'frame_' + i;
                
                node.frames[frameKey] = {
                    hasElement: false,
                    frames: {},
                    frameInfo: {
                        id: iframe.id,
                        className: iframe.className,
                        src: iframe.src,
                        index: i
                    }
                };
                
                try {
                    if (iframe.contentWindow) {
                        mapFrame(iframe.contentWindow, path + '/' + frameKey, node.frames[frameKey]);
                    }
                } catch (e) {
                    node.frames[frameKey].accessible = false;
                }
            }
        } catch (e) {
            node.error = e.message;
        }
    }
    
    mapFrame(window.top, 'top', frameMap.top);
    
    // Find the path to the element
    function findElementPath(node, currentPath) {
        if (node.hasElement) {
            return currentPath;
        }
        
        for (var frameKey in node.frames) {
            var result = findElementPath(node.frames[frameKey], currentPath.concat([frameKey]));
            if (result) {
                return result;
            }
        }
        
        return null;
    }
    
    var elementPath = findElementPath(frameMap.top, []);
    
    return {
        frameMap: frameMap,
        elementPath: elementPath,
        found: !!elementPath,
        virtuosoPath: elementPath ? elementPath.join(' > ') : null
    };
}

// Main solution: Combine all approaches
function findElementAcrossFrames(elementIdentifier) {
    var navigation = generateVirtuosoFrameCommands(elementIdentifier);
    var frameMap = mapFramesWithElement(elementIdentifier);
    
    if (navigation.success) {
        return {
            success: true,
            elementId: elementIdentifier,
            // Provide multiple formats for Virtuoso to use
            virtuosoCommands: navigation.commands,
            framePath: frameMap.virtuosoPath,
            // Provide a JavaScript snippet that Virtuoso could execute
            jsExecutor: 'document.evaluate("' + frameMap.virtuosoPath + '", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue',
            // Instructions for manual execution
            instructions: "Execute these commands in order:\n" + navigation.commandString
        };
    }
    
    return {
        success: false,
        elementId: elementIdentifier,
        message: "Element not found in any accessible frame"
    };
}

// Execute the search
return findElementAcrossFrames(elementIdentifier);