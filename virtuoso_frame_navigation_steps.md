# Virtuoso Frame Navigation Steps

Since `driver` is not available in browser extension context, you need to use Virtuoso's built-in frame switching after getting the frame path.

## Step 1: Get Frame Path (Extension)
```javascript
// This runs in browser context and returns frame information
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

    searchInFrame(window.top, [], []);

    if (found) {
        return "Found in: " + framePath.join(" > ");
    } else {
        return "Not found";
    }
}

return switchFrameToElement(elementIdentifier);
```

## Step 2: Use Frame Path in Virtuoso

After getting "Found in: mainarea > getFrame > inlineframe active > getFrame", use Virtuoso's frame switching:

1. **Switch to parent frame** (reset to top)
2. **Switch to iframe "mainarea"**
3. **Switch to iframe "getFrame"**  
4. **Switch to active inlineframe**
5. **Switch to iframe "getFrame"**

## Alternative: Return Detailed Frame Info

The enhanced version returns:
```json
{
    "status": "found",
    "path": "mainarea > getFrame > inlineframe active > getFrame",
    "frameCount": 4,
    "frames": ["mainarea", "getFrame", "inlineframe active", "getFrame"],
    "selectors": [
        {"type": "id", "value": "mainarea"},
        {"type": "id", "value": "getFrame"},
        {"type": "class", "value": "inlineframe active"},
        {"type": "id", "value": "getFrame"}
    ]
}
```

Then parse this in Virtuoso to switch frames appropriately.