# Virtuoso Hybrid Iframe Solution

## The Problem
Browser extensions can't actually "switch" iframe contexts like Selenium WebDriver. They can only read and report information.

## The Solution: Two-Step Hybrid Approach

### Step 1: Browser Extension Finds Element Location
Use the JavaScript extension to find which iframes contain the element:

```javascript
function findElementLocation(elementId) {
    // Search all iframes and return the path
    return "Found in: mainarea > getFrame > inlineframe active > getFrame";
}
```

### Step 2: Virtuoso Executes Frame Switches
Parse the response and execute Virtuoso commands:

1. **Create a Virtuoso Helper Function**:
```javascript
// In Virtuoso test
function switchToElementFrame(elementId) {
    // Step 1: Run browser extension to find element
    var location = execute_javascript(`
        // Your frame search code here
        return findElementLocation("${elementId}");
    `);
    
    // Step 2: Parse the location and switch frames
    if (location.includes("Found in:")) {
        var frames = location.replace("Found in: ", "").split(" > ");
        
        // Reset to top
        switch_to_parent_frame();
        
        // Switch through each frame
        frames.forEach(frame => {
            if (frame === "mainarea" || frame === "getFrame") {
                switch_to_iframe(frame);
            } else if (frame.includes("inlineframe active")) {
                switch_to_active_inlineframe();
            }
        });
    }
}
```

## Alternative: Smart Element Selector

Create a custom element selector that includes frame context:

```javascript
// Browser extension generates a smart selector
function generateSmartSelector(elementId) {
    var result = findElementInFrames(elementId);
    if (result.found) {
        // Return a selector that Virtuoso can parse
        return {
            selector: `frame[${result.framePath}] #${elementId}`,
            steps: result.virtuosoCommands
        };
    }
}
```

## Recommended Approach

1. **Use the browser extension** to map all iframes and find elements
2. **Return structured data** that Virtuoso can parse
3. **Create Virtuoso helper functions** that:
   - Call the browser extension
   - Parse the response
   - Execute the frame switches
   - Perform the action on the element

Example Virtuoso test:
```
// Define once in your test setup
define helper "switch_to_element_frame" with parameter "elementId"
    execute javascript: "return findElementAcrossFrames('{{elementId}}')"
    store value in $frameInfo
    
    if $frameInfo.success equals true
        switch to parent frame
        for each $command in $frameInfo.virtuosoCommands
            execute command: $command
        end for
    end if
end helper

// Use in your tests
run helper "switch_to_element_frame" with "queryColumnFilter"
type "search text" into element with id "queryColumnFilter"
```

This hybrid approach leverages the browser extension for discovery and Virtuoso's native commands for execution.