document.addEventListener('DOMContentLoaded', function() {
    // Pricing Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const pricingSections = document.querySelectorAll('.pricing-section');
    
    if (tabButtons.length > 0 && pricingSections.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                tabButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get tab value
                const tabValue = this.getAttribute('data-tab');
                
                // Hide all pricing sections
                pricingSections.forEach(section => {
                    section.classList.remove('active');
                });
                
                // Show selected pricing section
                document.getElementById(tabValue).classList.add('active');
                
                // Scroll to pricing section
                document.getElementById(tabValue).scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });
        
        // Check URL hash for direct link to pricing section
        if (window.location.hash) {
            const hash = window.location.hash.substring(1);
            const tabButton = document.querySelector(`.tab-btn[data-tab="${hash}"]`);
            
            if (tabButton) {
                tabButton.click();
            }
        }
    }
    
    // Price Hover Effect
    const priceRows = document.querySelectorAll('.price-row');
    
    if (priceRows.length > 0) {
        priceRows.forEach(row => {
            row.addEventListener('mouseenter', function() {
                this.classList.add('highlight');
            });
            
            row.addEventListener('mouseleave', function() {
                this.classList.remove('highlight');
            });
        });
    }
    
    // Custom Quote Form Toggle
    const requestQuoteBtn = document.querySelector('.custom-quote .btn');
    
    if (requestQuoteBtn) {
        requestQuoteBtn.addEventListener('click', function(e) {
            // In a real application, this would show a quote request form
            // For this example, we'll just navigate to the contact page
        });
    }
});