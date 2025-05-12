import { saveOrderToFirebase, uploadFileToStorage, deleteFileFromStorage } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', function() {
    // Order Form with Firebase Integration
    const orderForm = document.getElementById('printingOrderForm');
    
    if (orderForm) {
        // Store uploaded files data
        const uploadedFilesData = [];
        
        // File Upload Handling with Firebase Storage
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
                    
                    // Show loading indicator
                    const loadingIndicator = document.createElement('div');
                    loadingIndicator.className = 'loading-indicator';
                    loadingIndicator.innerHTML = `
                        <div class="spinner"></div>
                        <p>Uploading files, please wait...</p>
                    `;
                    document.body.appendChild(loadingIndicator);
                    
                    // Process each file
                    const uploadPromises = [];
                    
                    for (let i = 0; i < files.length; i++) {
                        const file = files[i];
                        
                        // Check file type
                        const acceptedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.ai', '.psd', '.eps', '.tif', '.tiff', '.doc', '.docx', '.xls', '.xlsx'];
                        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
                        
                        if (!acceptedTypes.includes(fileExtension)) {
                            alert(`File type ${fileExtension} is not supported. Please upload PDF, JPG, PNG, AI, PSD, EPS, TIFF, DOC, DOCX, XLS, or XLSX files.`);
                            continue;
                        }
                        
                        // Generate a temporary ID for the file
                        const tempId = 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                        
                        // Create file element with loading state
                        const fileElement = document.createElement('div');
                        fileElement.className = 'uploaded-file';
                        fileElement.dataset.tempId = tempId;
                        
                        // Get file icon based on type
                        let fileIcon = 'fa-file';
                        if (fileExtension === '.pdf') fileIcon = 'fa-file-pdf';
                        else if (['.jpg', '.jpeg', '.png', '.tif', '.tiff'].includes(fileExtension)) fileIcon = 'fa-file-image';
                        else if (['.doc', '.docx'].includes(fileExtension)) fileIcon = 'fa-file-word';
                        else if (['.xls', '.xlsx'].includes(fileExtension)) fileIcon = 'fa-file-excel';
                        
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
                                    <div class="file-status">Uploading... <div class="upload-progress"></div></div>
                                </div>
                            </div>
                            <div class="file-actions">
                                <button type="button" class="remove-file" disabled><i class="fas fa-times"></i></button>
                            </div>
                        `;
                        
                        uploadedFilesContainer.appendChild(fileElement);
                        
                        // Upload the file to Firebase Storage
                        // We'll use a temporary order ID for now, and update it later when the order is submitted
                        const uploadPromise = uploadFileToStorage(file, 'temp')
                            .then(fileData => {
                                // Store the file data
                                fileData.tempId = tempId;
                                uploadedFilesData.push(fileData);
                                
                                // Update the file element with the download link
                                const fileElement = document.querySelector(`.uploaded-file[data-temp-id="${tempId}"]`);
                                if (fileElement) {
                                    const fileStatus = fileElement.querySelector('.file-status');
                                    fileStatus.innerHTML = `
                                        <a href="${fileData.url}" target="_blank" class="file-link">View File</a>
                                    `;
                                    
                                    // Enable the remove button
                                    const removeBtn = fileElement.querySelector('.remove-file');
                                    removeBtn.disabled = false;
                                    
                                    // Add event listener to remove button
                                    removeBtn.addEventListener('click', function() {
                                        // Find the file data
                                        const fileIndex = uploadedFilesData.findIndex(f => f.tempId === tempId);
                                        if (fileIndex !== -1) {
                                            const fileData = uploadedFilesData[fileIndex];
                                            
                                            // Delete the file from Firebase Storage
                                            deleteFileFromStorage(fileData.path)
                                                .then(() => {
                                                    // Remove the file data from the array
                                                    uploadedFilesData.splice(fileIndex, 1);
                                                    
                                                    // Remove the file element
                                                    fileElement.remove();
                                                    
                                                    // Hide container if no files left
                                                    if (uploadedFilesContainer.children.length === 0) {
                                                        uploadedFilesContainer.style.display = 'none';
                                                    }
                                                })
                                                .catch(error => {
                                                    console.error('Error deleting file:', error);
                                                    alert('Error deleting file. Please try again.');
                                                });
                                        }
                                    });
                                }
                                
                                return fileData;
                            })
                            .catch(error => {
                                console.error('Error uploading file:', error);
                                
                                // Update the file element with the error
                                const fileElement = document.querySelector(`.uploaded-file[data-temp-id="${tempId}"]`);
                                if (fileElement) {
                                    const fileStatus = fileElement.querySelector('.file-status');
                                    fileStatus.innerHTML = `
                                        <span class="error">Upload failed. Please try again.</span>
                                    `;
                                    
                                    // Enable the remove button to allow removing the failed upload
                                    const removeBtn = fileElement.querySelector('.remove-file');
                                    removeBtn.disabled = false;
                                    removeBtn.addEventListener('click', function() {
                                        fileElement.remove();
                                        
                                        // Hide container if no files left
                                        if (uploadedFilesContainer.children.length === 0) {
                                            uploadedFilesContainer.style.display = 'none';
                                        }
                                    });
                                }
                                
                                return null;
                            });
                        
                        uploadPromises.push(uploadPromise);
                    }
                    
                    // Wait for all uploads to complete
                    Promise.all(uploadPromises)
                        .finally(() => {
                            // Remove loading indicator
                            document.body.removeChild(loadingIndicator);
                        });
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
        
        // Form submission with Firebase
        orderForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Show loading indicator
            const loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'loading-indicator';
            loadingIndicator.innerHTML = `
                <div class="spinner"></div>
                <p>Submitting your order, please wait...</p>
            `;
            document.body.appendChild(loadingIndicator);
            
            try {
                // Collect form data
                const formData = new FormData(this);
                const orderData = {
                    customerInfo: {
                        firstName: formData.get('first-name'),
                        lastName: formData.get('last-name'),
                        email: formData.get('email'),
                        phone: formData.get('phone'),
                        company: formData.get('company'),
                        address: formData.get('address'),
                        city: formData.get('city'),
                        state: formData.get('state'),
                        zipCode: formData.get('zip')
                    },
                    orderDetails: {
                        service: formData.get('service'),
                        productType: formData.get('product-type'),
                        quantity: formData.get('quantity'),
                        size: formData.get('size'),
                        paperType: formData.get('paper-type'),
                        colorOption: formData.get('color-option'),
                        finishing: Array.from(formData.getAll('finishing[]')),
                        notes: formData.get('notes'),
                        needDesignHelp: formData.get('need-design-help') === 'on'
                    },
                    paymentInfo: {
                        paymentMethod: formData.get('payment-method')
                    },
                    files: uploadedFilesData.map(file => ({
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        url: file.url,
                        path: file.path
                    })),
                    status: 'new',
                    orderDate: new Date().toISOString()
                };
                
                // Save order to Firebase
                const orderId = await saveOrderToFirebase(orderData);
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'order-success-message';
                successMessage.innerHTML = `
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3>Thank You for Your Order!</h3>
                    <p>Your order has been submitted successfully. Your order ID is: <strong>${orderId}</strong></p>
                    <p>We will process your order shortly and contact you with further details.</p>
                    <button class="btn btn-primary" id="newOrderBtn">Place Another Order</button>
                `;
                
                // Replace form with success message
                orderForm.style.display = 'none';
                orderForm.parentNode.insertBefore(successMessage, orderForm.nextSibling);
                
                // Add event listener to new order button
                document.getElementById('newOrderBtn').addEventListener('click', function() {
                    // Reset form
                    orderForm.reset();
                    
                    // Clear uploaded files
                    uploadedFilesContainer.innerHTML = '';
                    uploadedFilesContainer.style.display = 'none';
                    uploadedFilesData.length = 0;
                    
                    // Show form again
                    successMessage.remove();
                    orderForm.style.display = 'block';
                    
                    // Reset to first step
                    const formSteps = document.querySelectorAll('.form-step');
                    const orderSteps = document.querySelectorAll('.order-step');
                    
                    formSteps.forEach(step => {
                        step.classList.remove('active');
                    });
                    
                    orderSteps.forEach(step => {
                        step.classList.remove('active', 'completed');
                    });
                    
                    formSteps[0].classList.add('active');
                    orderSteps[0].classList.add('active');
                });
            } catch (error) {
                console.error('Error submitting order:', error);
                alert('There was an error submitting your order. Please try again.');
            } finally {
                // Remove loading indicator
                document.body.removeChild(loadingIndicator);
            }
        });
    }
});