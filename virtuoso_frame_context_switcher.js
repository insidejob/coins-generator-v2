// Version that sets the browser's context to the target frame
function switchFrameToElement(elementIdentifier) {
    var frameSequence = [];
    var found = false;
    var targetFrameWindow = null;

    function findElementInFrames(currentWindow, depth, framePath) {
        try {
            // Check current window for element
            var element = currentWindow.document.getElementById(elementIdentifier);
            if (element) {
                found = true;
                frameSequence = framePath.slice();
                targetFrameWindow = currentWindow;
                
                // IMPORTANT: Set the found element as a global reference
                currentWindow.__virtuoso_target_element__ = element;
                window.__virtuoso_target_frame_window__ = currentWindow;
                window.__virtuoso_frame_sequence__ = frameSequence;
                
                return true;
            }

            // Search child frames
            var iframes = currentWindow.document.getElementsByTagName('iframe');
            for (var i = 0; i < iframes.length; i++) {
                try {
                    var iframe = iframes[i];
                    var frameWindow = iframe.contentWindow;
                    if (frameWindow && frameWindow.document) {
                        var frameId = iframe.id || iframe.className || ('frame_' + i);
                        var newPath = framePath.concat([{
                            id: iframe.id,
                            className: iframe.className,
                            name: frameId,
                            element: iframe
                        }]);
                        
                        if (findElementInFrames(frameWindow, depth + 1, newPath)) {
                            return true;
                        }
                    }
                } catch (e) {
                    // Cross-origin frame, skip
                }
            }
        } catch (e) {
            // Access denied or other error
        }
        return false;
    }

    // Start search from top
    findElementInFrames(window.top, 0, []);

    if (found && targetFrameWindow) {
        // Create a function that will be available globally to interact with the element
        window.__virtuoso_execute_in_target_frame__ = function(code) {
            try {
                return targetFrameWindow.eval(code);
            } catch (e) {
                return { error: e.message };
            }
        };

        // Create helper to click the target element
        window.__virtuoso_click_target__ = function() {
            var el = targetFrameWindow.document.getElementById(elementIdentifier);
            if (el) {
                el.click();
                return true;
            }
            return false;
        };

        // Create helper to get/set value
        window.__virtuoso_get_target_value__ = function() {
            var el = targetFrameWindow.document.getElementById(elementIdentifier);
            return el ? el.value : null;
        };

        window.__virtuoso_set_target_value__ = function(value) {
            var el = targetFrameWindow.document.getElementById(elementIdentifier);
            if (el) {
                el.value = value;
                // Trigger change event
                el.dispatchEvent(new Event('change', { bubbles: true }));
                el.dispatchEvent(new Event('input', { bubbles: true }));
                return true;
            }
            return false;
        };

        // Build frame path description
        var pathDescription = frameSequence.map(function(f) {
            return f.id || f.className || f.name;
        }).join(' > ');

        return {
            success: true,
            framePath: pathDescription || "top",
            frameDepth: frameSequence.length,
            elementId: elementIdentifier,
            // Test functions
            canAccessElement: function() {
                return window.__virtuoso_execute_in_target_frame__(
                    'document.getElementById("' + elementIdentifier + '") !== null'
                );
            },
            // Interaction helpers
            helpers: {
                click: '__virtuoso_click_target__()',
                getValue: '__virtuoso_get_target_value__()',
                setValue: '__virtuoso_set_target_value__(value)'
            }
        };
    } else {
        return {
            success: false,
            message: "Element '" + elementIdentifier + "' not found in any accessible frame"
        };
    }
}

// Run the switcher
return switchFrameToElement(elementIdentifier);