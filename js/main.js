document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Toggle between hamburger and close icon
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Scroll to Top Button
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    
    if (scrollToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('active');
            } else {
                scrollToTopBtn.classList.remove('active');
            }
        });
        
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Testimonial Slider
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-testimonial');
    const nextBtn = document.querySelector('.next-testimonial');
    
    if (testimonialSlides.length > 0) {
        let currentSlide = 0;
        
        // Function to show a specific slide
        function showSlide(index) {
            // Hide all slides
            testimonialSlides.forEach(slide => {
                slide.classList.remove('active');
            });
            
            // Remove active class from all dots
            dots.forEach(dot => {
                dot.classList.remove('active');
            });
            
            // Show the selected slide and activate the corresponding dot
            testimonialSlides[index].classList.add('active');
            dots[index].classList.add('active');
            
            // Update current slide index
            currentSlide = index;
        }
        
        // Event listeners for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                showSlide(index);
            });
        });
        
        // Event listeners for prev/next buttons
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', function() {
                let newIndex = currentSlide - 1;
                if (newIndex < 0) {
                    newIndex = testimonialSlides.length - 1;
                }
                showSlide(newIndex);
            });
            
            nextBtn.addEventListener('click', function() {
                let newIndex = currentSlide + 1;
                if (newIndex >= testimonialSlides.length) {
                    newIndex = 0;
                }
                showSlide(newIndex);
            });
        }
        
        // Auto slide change
        setInterval(function() {
            let newIndex = currentSlide + 1;
            if (newIndex >= testimonialSlides.length) {
                newIndex = 0;
            }
            showSlide(newIndex);
        }, 5000);
    }
    
    // Order Form Steps
    const orderForm = document.getElementById('printingOrderForm');
    
    if (orderForm) {
        const formSteps = document.querySelectorAll('.form-step');
        const orderSteps = document.querySelectorAll('.order-step');
        const nextButtons = document.querySelectorAll('.next-step');
        const prevButtons = document.querySelectorAll('.prev-step');
        
        // Function to show a specific form step
        function showFormStep(stepIndex) {
            // Hide all form steps
            formSteps.forEach(step => {
                step.classList.remove('active');
            });
            
            // Show the selected form step
            formSteps[stepIndex].classList.add('active');
            
            // Update order steps indicators
            orderSteps.forEach((step, index) => {
                if (index < stepIndex) {
                    step.classList.add('completed');
                    step.classList.remove('active');
                } else if (index === stepIndex) {
                    step.classList.add('active');
                    step.classList.remove('completed');
                } else {
                    step.classList.remove('active', 'completed');
                }
            });
            
            // Scroll to top of the form
            window.scrollTo({
                top: orderForm.offsetTop - 100,
                behavior: 'smooth'
            });
        }
        
        // Event listeners for next buttons
        nextButtons.forEach((button, index) => {
            button.addEventListener('click', function() {
                // Validate current step before proceeding
                if (validateStep(index)) {
                    showFormStep(index + 1);
                }
            });
        });
        
        // Event listeners for previous buttons
        prevButtons.forEach((button, index) => {
            button.addEventListener('click', function() {
                // Find the index of the current step
                const currentStepIndex = Array.from(formSteps).findIndex(step => step.classList.contains('active'));
                showFormStep(currentStepIndex - 1);
            });
        });
        
        // Function to validate form step
        function validateStep(stepIndex) {
            const currentStep = formSteps[stepIndex];
            
            // Step 1: Service Selection
            if (stepIndex === 0) {
                const serviceRadios = currentStep.querySelectorAll('input[name="service"]');
                let serviceSelected = false;
                
                serviceRadios.forEach(radio => {
                    if (radio.checked) {
                        serviceSelected = true;
                        
                        // Update product types based on selected service
                        updateProductTypes(radio.value);
                    }
                });
                
                if (!serviceSelected) {
                    alert('Please select a service to continue.');
                    return false;
                }
                
                return true;
            }
            
            // Step 2: Project Details
            else if (stepIndex === 1) {
                const productType = document.getElementById('product-type');
                const quantity = document.getElementById('quantity');
                const size = document.getElementById('size');
                const paperType = document.getElementById('paper-type');
                const colorOption = document.getElementById('color-option');
                
                if (productType.value === '') {
                    alert('Please select a product type.');
                    productType.focus();
                    return false;
                }
                
                if (quantity.value === '' || quantity.value < 1) {
                    alert('Please enter a valid quantity.');
                    quantity.focus();
                    return false;
                }
                
                if (size.value === '') {
                    alert('Please select a size.');
                    size.focus();
                    return false;
                }
                
                if (paperType.value === '') {
                    alert('Please select a paper/material type.');
                    paperType.focus();
                    return false;
                }
                
                if (colorOption.value === '') {
                    alert('Please select a color option.');
                    colorOption.focus();
                    return false;
                }
                
                return true;
            }
            
            // Step 3: Upload Files
            else if (stepIndex === 2) {
                const uploadedFiles = document.getElementById('uploadedFiles');
                const needDesignHelp = document.getElementById('need-design-help');
                
                // If no files uploaded and no design help requested
                if (uploadedFiles.children.length === 0 && !needDesignHelp.checked) {
                    alert('Please upload at least one file or check the "I need help with my design" option.');
                    return false;
                }
                
                // Update order summary
                updateOrderSummary();
                
                return true;
            }
            
            return true;
        }
        
        // Function to update product types based on selected service
        function updateProductTypes(serviceType) {
            const productTypeSelect = document.getElementById('product-type');
            const sizeSelect = document.getElementById('size');
            const paperTypeSelect = document.getElementById('paper-type');
            
            // Clear existing options
            productTypeSelect.innerHTML = '<option value="">Select Product Type</option>';
            
            // Add options based on selected service
            if (serviceType === 'business-documents') {
                addOption(productTypeSelect, 'business-cards', 'Business Cards');
                addOption(productTypeSelect, 'letterheads', 'Letterheads');
                addOption(productTypeSelect, 'envelopes', 'Envelopes');
                addOption(productTypeSelect, 'presentation-folders', 'Presentation Folders');
                addOption(productTypeSelect, 'notepads', 'Notepads');
                addOption(productTypeSelect, 'invoices-forms', 'Invoices and Forms');
            } 
            else if (serviceType === 'marketing-materials') {
                addOption(productTypeSelect, 'brochures', 'Brochures');
                addOption(productTypeSelect, 'flyers', 'Flyers');
                addOption(productTypeSelect, 'posters', 'Posters');
                addOption(productTypeSelect, 'banners', 'Banners');
                addOption(productTypeSelect, 'postcards', 'Postcards');
                addOption(productTypeSelect, 'door-hangers', 'Door Hangers');
            }
            else if (serviceType === 'books-catalogs') {
                addOption(productTypeSelect, 'books', 'Books');
                addOption(productTypeSelect, 'catalogs', 'Catalogs');
                addOption(productTypeSelect, 'magazines', 'Magazines');
                addOption(productTypeSelect, 'booklets', 'Booklets');
                addOption(productTypeSelect, 'manuals', 'Manuals');
                addOption(productTypeSelect, 'yearbooks', 'Yearbooks');
            }
            else if (serviceType === 'custom-merchandise') {
                addOption(productTypeSelect, 't-shirts', 'T-shirts');
                addOption(productTypeSelect, 'mugs', 'Mugs');
                addOption(productTypeSelect, 'pens', 'Pens');
                addOption(productTypeSelect, 'tote-bags', 'Tote Bags');
                addOption(productTypeSelect, 'usb-drives', 'USB Drives');
                addOption(productTypeSelect, 'promotional-items', 'Other Promotional Items');
            }
            else if (serviceType === 'large-format') {
                addOption(productTypeSelect, 'banners', 'Banners');
                addOption(productTypeSelect, 'posters', 'Posters');
                addOption(productTypeSelect, 'signs', 'Signs');
                addOption(productTypeSelect, 'trade-show-displays', 'Trade Show Displays');
                addOption(productTypeSelect, 'vehicle-wraps', 'Vehicle Wraps');
                addOption(productTypeSelect, 'window-graphics', 'Window Graphics');
            }
            else if (serviceType === 'design-services') {
                addOption(productTypeSelect, 'logo-design', 'Logo Design');
                addOption(productTypeSelect, 'branding', 'Branding');
                addOption(productTypeSelect, 'layout-design', 'Layout Design');
                addOption(productTypeSelect, 'graphic-design', 'Graphic Design');
                addOption(productTypeSelect, 'image-editing', 'Image Editing');
                addOption(productTypeSelect, 'design-consultation', 'Design Consultation');
            }
            
            // Event listener for product type change
            productTypeSelect.addEventListener('change', function() {
                updateSizeOptions(this.value, serviceType);
                updatePaperOptions(this.value, serviceType);
            });
        }
        
        // Function to add option to select element
        function addOption(selectElement, value, text) {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = text;
            selectElement.appendChild(option);
        }
        
        // Function to update size options based on selected product
        function updateSizeOptions(productType, serviceType) {
            const sizeSelect = document.getElementById('size');
            
            // Clear existing options
            sizeSelect.innerHTML = '<option value="">Select Size</option>';
            
            // Add options based on selected product and service
            if (serviceType === 'business-documents') {
                if (productType === 'business-cards') {
                    addOption(sizeSelect, 'standard', 'Standard (3.5" x 2")');
                    addOption(sizeSelect, 'square', 'Square (2.5" x 2.5")');
                    addOption(sizeSelect, 'folded', 'Folded (3.5" x 4")');
                } 
                else if (productType === 'letterheads') {
                    addOption(sizeSelect, 'letter', 'Letter (8.5" x 11")');
                    addOption(sizeSelect, 'a4', 'A4 (210mm x 297mm)');
                }
                else if (productType === 'envelopes') {
                    addOption(sizeSelect, '#10', '#10 (4.125" x 9.5")');
                    addOption(sizeSelect, '#9', '#9 (3.875" x 8.875")');
                    addOption(sizeSelect, 'a7', 'A7 (5.25" x 7.25")');
                }
            }
            else if (serviceType === 'marketing-materials') {
                if (productType === 'brochures') {
                    addOption(sizeSelect, 'letter-trifold', 'Letter Trifold (8.5" x 11")');
                    addOption(sizeSelect, 'letter-bifold', 'Letter Bifold (8.5" x 11")');
                    addOption(sizeSelect, 'legal-trifold', 'Legal Trifold (8.5" x 14")');
                }
                else if (productType === 'flyers') {
                    addOption(sizeSelect, 'letter', 'Letter (8.5" x 11")');
                    addOption(sizeSelect, 'half-letter', 'Half Letter (5.5" x 8.5")');
                    addOption(sizeSelect, 'quarter-letter', 'Quarter Letter (4.25" x 5.5")');
                }
                else if (productType === 'posters') {
                    addOption(sizeSelect, '11x17', '11" x 17"');
                    addOption(sizeSelect, '18x24', '18" x 24"');
                    addOption(sizeSelect, '24x36', '24" x 36"');
                }
            }
            // Add more product-specific size options for other services
            
            // Default options for any product type not specifically handled
            if (sizeSelect.options.length <= 1) {
                addOption(sizeSelect, 'small', 'Small');
                addOption(sizeSelect, 'medium', 'Medium');
                addOption(sizeSelect, 'large', 'Large');
                addOption(sizeSelect, 'custom', 'Custom Size');
            }
        }
        
        // Function to update paper/material options based on selected product
        function updatePaperOptions(productType, serviceType) {
            const paperTypeSelect = document.getElementById('paper-type');
            
            // Clear existing options
            paperTypeSelect.innerHTML = '<option value="">Select Paper/Material Type</option>';
            
            // Add options based on selected product and service
            if (serviceType === 'business-documents') {
                if (productType === 'business-cards') {
                    addOption(paperTypeSelect, '14pt-gloss', '14pt Gloss Coated');
                    addOption(paperTypeSelect, '16pt-matte', '16pt Matte Coated');
                    addOption(paperTypeSelect, '100lb-uncoated', '100lb Uncoated');
                    addOption(paperTypeSelect, 'recycled', 'Recycled');
                } 
                else if (productType === 'letterheads') {
                    addOption(paperTypeSelect, '70lb-uncoated', '70lb Uncoated');
                    addOption(paperTypeSelect, '24lb-bond', '24lb Bond');
                    addOption(paperTypeSelect, 'linen', 'Linen');
                }
            }
            else if (serviceType === 'marketing-materials') {
                if (productType === 'brochures' || productType === 'flyers') {
                    addOption(paperTypeSelect, '100lb-gloss', '100lb Gloss');
                    addOption(paperTypeSelect, '100lb-matte', '100lb Matte');
                    addOption(paperTypeSelect, '80lb-uncoated', '80lb Uncoated');
                }
                else if (productType === 'posters') {
                    addOption(paperTypeSelect, 'photo-gloss', 'Photo Gloss');
                    addOption(paperTypeSelect, 'photo-matte', 'Photo Matte');
                    addOption(paperTypeSelect, 'canvas', 'Canvas');
                }
            }
            else if (serviceType === 'custom-merchandise') {
                if (productType === 't-shirts') {
                    addOption(paperTypeSelect, 'cotton', '100% Cotton');
                    addOption(paperTypeSelect, 'cotton-blend', 'Cotton Blend');
                    addOption(paperTypeSelect, 'performance', 'Performance Fabric');
                }
                else if (productType === 'mugs') {
                    addOption(paperTypeSelect, 'ceramic', 'Ceramic');
                    addOption(paperTypeSelect, 'travel', 'Travel Mug');
                    addOption(paperTypeSelect, 'glass', 'Glass');
                }
            }
            
            // Default options for any product type not specifically handled
            if (paperTypeSelect.options.length <= 1) {
                addOption(paperTypeSelect, 'standard', 'Standard');
                addOption(paperTypeSelect, 'premium', 'Premium');
                addOption(paperTypeSelect, 'economy', 'Economy');
            }
        }
        
        // File Upload Handling
        const fileUploadArea = document.getElementById('fileUploadArea');
        const fileUploadInput = document.getElementById('file-upload');
        const uploadedFilesContainer = document.getElementById('uploadedFiles');
        
        if (fileUploadArea && fileUploadInput) {
            // Click on upload area to trigger file input
            fileUploadArea.addEventListener('click', function() {
                fileUploadInput.click();
            });
            
            // Handle file selection
            fileUploadInput.addEventListener('change', function() {
                handleFiles(this.files);
            });
            
            // Drag and drop functionality
            fileUploadArea.addEventListener('dragover', function(e) {
                e.preventDefault();
                e.stopPropagation();
                this.classList.add('dragover');
            });
            
            fileUploadArea.addEventListener('dragleave', function(e) {
                e.preventDefault();
                e.stopPropagation();
                this.classList.remove('dragover');
            });
            
            fileUploadArea.addEventListener('drop', function(e) {
                e.preventDefault();
                e.stopPropagation();
                this.classList.remove('dragover');
                
                const files = e.dataTransfer.files;
                handleFiles(files);
            });
            
            // Function to handle selected files
            function handleFiles(files) {
                if (files.length > 0) {
                    uploadedFilesContainer.style.display = 'block';
                    
                    for (let i = 0; i < files.length; i++) {
                        const file = files[i];
                        
                        // Check file type
                        const acceptedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.ai', '.psd', '.eps', '.tif', '.tiff'];
                        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
                        
                        if (!acceptedTypes.includes(fileExtension)) {
                            alert(`File type ${fileExtension} is not supported. Please upload PDF, JPG, PNG, AI, PSD, EPS, or TIFF files.`);
                            continue;
                        }
                        
                        // Create file element
                        const fileElement = document.createElement('div');
                        fileElement.className = 'uploaded-file';
                        
                        // Get file icon based on type
                        let fileIcon = 'fa-file';
                        if (fileExtension === '.pdf') fileIcon = 'fa-file-pdf';
                        else if (['.jpg', '.jpeg', '.png', '.tif', '.tiff'].includes(fileExtension)) fileIcon = 'fa-file-image';
                        
                        // Format file size
                        const fileSize = formatFileSize(file.size);
                        
                        fileElement.innerHTML = `
                            <div class="file-info">
                                <div class="file-icon">
                                    <i class="fas ${fileIcon}"></i>
                                </div>
                                <div>
                                    <div class="file-name">${file.name}</div>
                                    <div class="file-size">${fileSize}</div>
                                </div>
                            </div>
                            <div class="file-actions">
                                <button type="button" class="remove-file"><i class="fas fa-times"></i></button>
                            </div>
                        `;
                        
                        uploadedFilesContainer.appendChild(fileElement);
                        
                        // Add event listener to remove button
                        const removeBtn = fileElement.querySelector('.remove-file');
                        removeBtn.addEventListener('click', function() {
                            fileElement.remove();
                            
                            // Hide container if no files left
                            if (uploadedFilesContainer.children.length === 0) {
                                uploadedFilesContainer.style.display = 'none';
                            }
                        });
                    }
                }
            }
            
            // Function to format file size
            function formatFileSize(bytes) {
                if (bytes === 0) return '0 Bytes';
                
                const k = 1024;
                const sizes = ['Bytes', 'KB', 'MB', 'GB'];
                const i = Math.floor(Math.log(bytes) / Math.log(k));
                
                return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
            }
        }
        
        // Function to update order summary
        function updateOrderSummary() {
            // Get selected service
            const serviceRadios = document.querySelectorAll('input[name="service"]');
            let selectedService = '';
            
            serviceRadios.forEach(radio => {
                if (radio.checked) {
                    selectedService = radio.nextElementSibling.querySelector('h3').textContent;
                }
            });
            
            // Get product details
            const productType = document.getElementById('product-type');
            const quantity = document.getElementById('quantity');
            const size = document.getElementById('size');
            const paperType = document.getElementById('paper-type');
            const colorOption = document.getElementById('color-option');
            
            // Get finishing options
            const finishingOptions = document.querySelectorAll('input[name="finishing[]"]:checked');
            let finishingText = '';
            
            finishingOptions.forEach((option, index) => {
                finishingText += option.nextElementSibling.textContent;
                if (index < finishingOptions.length - 1) {
                    finishingText += ', ';
                }
            });
            
            if (finishingText === '') {
                finishingText = 'None';
            }
            
            // Get uploaded files
            const uploadedFiles = document.getElementById('uploadedFiles').children;
            let filesText = '';
            
            if (uploadedFiles.length > 0) {
                for (let i = 0; i < uploadedFiles.length; i++) {
                    const fileName = uploadedFiles[i].querySelector('.file-name').textContent;
                    filesText += fileName;
                    if (i < uploadedFiles.length - 1) {
                        filesText += ', ';
                    }
                }
            } else {
                const needDesignHelp = document.getElementById('need-design-help');
                if (needDesignHelp.checked) {
                    filesText = 'Design assistance requested';
                } else {
                    filesText = 'No files uploaded';
                }
            }
            
            // Update summary elements
            document.getElementById('summary-service').textContent = selectedService;
            document.getElementById('summary-product').textContent = productType.options[productType.selectedIndex].text;
            document.getElementById('summary-quantity').textContent = quantity.value;
            document.getElementById('summary-size').textContent = size.options[size.selectedIndex].text;
            document.getElementById('summary-paper').textContent = paperType.options[paperType.selectedIndex].text;
            document.getElementById('summary-color').textContent = colorOption.options[colorOption.selectedIndex].text;
            document.getElementById('summary-finishing').textContent = finishingText;
            document.getElementById('summary-files').textContent = filesText;
            
            // Calculate price (simplified example)
            const basePrice = calculateBasePrice(productType.value, quantity.value);
            const finishingPrice = calculateFinishingPrice(finishingOptions);
            
            const subtotal = basePrice + finishingPrice;
            const shipping = 15.00; // Fixed shipping for this example
            const tax = subtotal * 0.08; // 8% tax rate
            const total = subtotal + shipping + tax;
            
            // Update price summary
            document.getElementById('summary-subtotal').textContent = '$' + subtotal.toFixed(2);
            document.getElementById('summary-shipping').textContent = '$' + shipping.toFixed(2);
            document.getElementById('summary-tax').textContent = '$' + tax.toFixed(2);
            document.getElementById('summary-total').textContent = '$' + total.toFixed(2);
        }
        
        // Function to calculate base price (simplified example)
        function calculateBasePrice(productType, quantity) {
            // This is a simplified pricing model
            // In a real application, you would have a more complex pricing structure
            
            let unitPrice = 0;
            
            // Set base unit price based on product type
            if (productType === 'business-cards') unitPrice = 0.15;
            else if (productType === 'letterheads') unitPrice = 0.25;
            else if (productType === 'brochures') unitPrice = 0.75;
            else if (productType === 'flyers') unitPrice = 0.35;
            else if (productType === 'posters') unitPrice = 5.00;
            else if (productType === 't-shirts') unitPrice = 12.00;
            else unitPrice = 1.00; // Default price
            
            // Apply quantity discounts
            let discount = 1.0; // No discount
            
            if (quantity >= 1000) discount = 0.7; // 30% discount
            else if (quantity >= 500) discount = 0.8; // 20% discount
            else if (quantity >= 250) discount = 0.9; // 10% discount
            
            return unitPrice * quantity * discount;
        }
        
        // Function to calculate finishing price
        function calculateFinishingPrice(finishingOptions) {
            let price = 0;
            
            finishingOptions.forEach(option => {
                if (option.value === 'lamination') price += 15;
                else if (option.value === 'folding') price += 10;
                else if (option.value === 'binding') price += 25;
                else if (option.value === 'cutting') price += 20;
                else if (option.value === 'embossing') price += 30;
            });
            
            return price;
        }
        
        // Form submission
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real application, you would send the form data to the server
            // For this example, we'll just show a success message
            
            alert('Thank you for your order! We will process it shortly and contact you with further details.');
            
            // Reset form
            this.reset();
            showFormStep(0);
        });
        
        // Check URL parameters for pre-selected service
        const urlParams = new URLSearchParams(window.location.search);
        const serviceParam = urlParams.get('service');
        
        if (serviceParam) {
            const serviceRadio = document.getElementById(serviceParam);
            if (serviceRadio) {
                serviceRadio.checked = true;
                
                // Update product types based on selected service
                updateProductTypes(serviceParam);
                
                // Move to next step
                showFormStep(1);
            }
        }
    }
    
    // Add CSS class for mobile navigation
    function setupMobileNav() {
        const navLinks = document.querySelector('.nav-links');
        
        if (navLinks) {
            // Add mobile nav styles
            const style = document.createElement('style');
            style.textContent = `
                @media (max-width: 768px) {
                    .nav-links {
                        position: absolute;
                        top: 100%;
                        left: 0;
                        width: 100%;
                        background-color: var(--white);
                        flex-direction: column;
                        padding: 1rem;
                        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
                        display: none;
                        z-index: 1000;
                    }
                    
                    .nav-links.active {
                        display: flex;
                    }
                    
                    .nav-links li {
                        margin: 0.5rem 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Initialize mobile navigation
    setupMobileNav();
    
    // Add placeholder images if real images are not available
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.src || img.src === window.location.href) {
            // Set placeholder image with dimensions based on parent container
            const parent = img.parentElement;
            const width = parent.offsetWidth || 800;
            const height = parent.offsetHeight || 600;
            
            img.src = `https://via.placeholder.com/${width}x${height}/e2e8f0/1e293b?text=PrintMaster`;
            img.alt = img.alt || 'Printing service image';
        }
    });
});