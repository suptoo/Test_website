document.addEventListener('DOMContentLoaded', function() {
    // Portfolio Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (filterButtons.length > 0 && portfolioItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get filter value
                const filterValue = this.getAttribute('data-filter');
                
                // Filter portfolio items
                portfolioItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                        
                        // Add animation
                        item.classList.add('fade-in');
                        setTimeout(() => {
                            item.classList.remove('fade-in');
                        }, 500);
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Portfolio Modal
    const portfolioViewButtons = document.querySelectorAll('.portfolio-view');
    const portfolioModal = document.querySelector('.portfolio-modal');
    
    if (portfolioViewButtons.length > 0 && portfolioModal) {
        const closeModal = portfolioModal.querySelector('.close-modal');
        const modalTitle = portfolioModal.querySelector('.modal-title');
        const modalCategory = portfolioModal.querySelector('.modal-category');
        const modalDescription = portfolioModal.querySelector('.modal-description');
        const modalImage = portfolioModal.querySelector('.modal-image img');
        const specsList = portfolioModal.querySelector('.specs-list');
        
        // Sample project data (in a real application, this would come from a database)
        const projectData = {
            'Premium Business Cards': {
                category: 'Business Documents',
                description: 'Custom designed business cards with spot UV finish for a local law firm. The design features a minimalist approach with a sophisticated color palette that reflects the firm\'s professional image.',
                specs: [
                    'Size: 3.5" x 2"',
                    'Paper: 32pt Uncoated',
                    'Finish: Spot UV',
                    'Quantity: 500',
                    'Turnaround: 5 business days'
                ]
            },
            'Corporate Letterhead': {
                category: 'Business Documents',
                description: 'Elegant letterhead design with custom watermark for a financial services company. The letterhead incorporates the company\'s branding elements and provides a professional foundation for all business correspondence.',
                specs: [
                    'Size: 8.5" x 11"',
                    'Paper: 24lb Linen',
                    'Color: Full color',
                    'Quantity: 1000',
                    'Turnaround: 3 business days'
                ]
            },
            'Travel Agency Brochure': {
                category: 'Marketing Materials',
                description: 'Vibrant tri-fold brochure showcasing exotic destinations for a travel agency. The brochure features stunning photography, compelling copy, and a clean layout that guides potential customers through various travel packages.',
                specs: [
                    'Size: 8.5" x 11" (tri-fold)',
                    'Paper: 100lb Gloss',
                    'Printing: Full color both sides',
                    'Finish: Aqueous coating',
                    'Quantity: 2500',
                    'Turnaround: 7 business days'
                ]
            }
            // Add more project data as needed
        };
        
        // Open modal when portfolio item is clicked
        portfolioViewButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get project title from parent portfolio item
                const portfolioItem = this.closest('.portfolio-item');
                const portfolioInfo = portfolioItem.querySelector('.portfolio-info');
                const projectTitle = portfolioInfo.querySelector('h3').textContent;
                
                // Get project image
                const projectImage = portfolioItem.querySelector('.portfolio-image img').src;
                
                // Set modal content
                modalTitle.textContent = projectTitle;
                modalImage.src = projectImage;
                
                // Set project data if available
                if (projectData[projectTitle]) {
                    const project = projectData[projectTitle];
                    
                    modalCategory.textContent = project.category;
                    modalDescription.textContent = project.description;
                    
                    // Clear and populate specs list
                    specsList.innerHTML = '';
                    project.specs.forEach(spec => {
                        const li = document.createElement('li');
                        li.textContent = spec;
                        specsList.appendChild(li);
                    });
                } else {
                    // Default content if project data not available
                    modalCategory.textContent = 'Printing Project';
                    modalDescription.textContent = 'This is a sample project showcasing our printing capabilities. Contact us to learn more about how we can help with your printing needs.';
                    
                    // Default specs
                    specsList.innerHTML = `
                        <li>High-quality printing</li>
                        <li>Premium materials</li>
                        <li>Professional finishing</li>
                        <li>Quick turnaround</li>
                    `;
                }
                
                // Show modal
                portfolioModal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Prevent scrolling
                
                // Add animation
                setTimeout(() => {
                    portfolioModal.querySelector('.modal-content').classList.add('active');
                }, 10);
            });
        });
        
        // Close modal
        closeModal.addEventListener('click', function() {
            portfolioModal.querySelector('.modal-content').classList.remove('active');
            
            setTimeout(() => {
                portfolioModal.style.display = 'none';
                document.body.style.overflow = 'auto'; // Enable scrolling
            }, 300);
        });
        
        // Close modal when clicking outside
        portfolioModal.addEventListener('click', function(e) {
            if (e.target === portfolioModal) {
                closeModal.click();
            }
        });
    }
});