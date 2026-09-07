/**
 * ============================================================================
 * COMPONENT: ScrollToTop.js
 * HANDOVER SUMMARY:
 * This helper component ensures a smooth browsing experience. Whenever a user clicks 
 * a link and navigates to a new page (e.g., from Home to Case Filing), this component 
 * automatically resets their browser scroll position back to the very top (0, 0).
 * ============================================================================
 */

import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
    // Detects whenever the current URL path changes.
    const { pathname } = useLocation();

    useEffect(() => {
        // Immediately scroll the window to the top-left coordinate.
        window.scrollTo(0, 0);
    }, [pathname]);

    // Renders no visual UI itself—it works purely in the background.
    return null;
}

export default ScrollToTop;