function setViewportScale() {
    var viewportMeta = document.getElementsByTagName("meta");
    // Iterate over the NodeList to find the specific viewport meta tag
    for (var i = 0; i < viewportMeta.length; i++) {
        if (viewportMeta[i].getAttribute("name") === "viewport") {
            var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

            // Define the range of screen sizes where you want to set initial-scale to 0.75
            if (screenWidth >= 1119 && screenWidth <= 1281) {
                viewportMeta[i].setAttribute("content", "width=device-width, initial-scale=0.75");
            } else {
                // Reset to default values if outside the specified range
                viewportMeta[i].setAttribute("content", "width=device-width, initial-scale=1.0");
            }
            return; // Stop iterating once the viewport meta tag is found
        }
    }

    console.error("Viewport meta tag not found");
}

// Call the function after the DOM has been fully loaded
document.addEventListener('DOMContentLoaded', setViewportScale);

