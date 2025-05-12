document.addEventListener('DOMContentLoaded', function() {
    // Contact Form Validation and Submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const firstName = document.getElementById('first-name').value;
            const lastName = document.getElementById('last-name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            const inquiryType = document.getElementById('inquiry-type').value;
            
            if (!firstName || !lastName || !email || !subject || !message || !inquiryType) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // In a real application, you would send the form data to the server
            // For this example, we'll just show a success message
            
            // Create success message
            const successMessage = document.createElement('div');
            successMessage.className = 'form-success-message';
            successMessage.innerHTML = `
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Thank You for Contacting Us!</h3>
                <p>Your message has been sent successfully. We'll get back to you as soon as possible.</p>
                <button class="btn btn-primary" id="resetFormBtn">Send Another Message</button>
            `;
            
            // Replace form with success message
            contactForm.style.display = 'none';
            contactForm.parentNode.insertBefore(successMessage, contactForm.nextSibling);
            
            // Add event listener to reset button
            document.getElementById('resetFormBtn').addEventListener('click', function() {
                contactForm.reset();
                successMessage.remove();
                contactForm.style.display = 'block';
            });
        });
    }
    
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const toggle = item.querySelector('.faq-toggle');
            
            question.addEventListener('click', function() {
                // Close all other answers
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.querySelector('.faq-answer').style.display = 'none';
                        otherItem.querySelector('.faq-toggle i').className = 'fas fa-plus';
                    }
                });
                
                // Toggle current answer
                if (answer.style.display === 'block') {
                    answer.style.display = 'none';
                    toggle.innerHTML = '<i class="fas fa-plus"></i>';
                } else {
                    answer.style.display = 'block';
                    toggle.innerHTML = '<i class="fas fa-minus"></i>';
                }
            });
        });
    }
});