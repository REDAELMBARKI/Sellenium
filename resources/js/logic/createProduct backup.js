// Product data state
let productData = {
    name: '',
    brand: '',
    price: '',
    description: '',
    isFeatured: false,
    freeShipping: false
};

let tags = [];
let images = Array(5).fill(null);
let currentVariant = {
    color: null,
    size: null,
    fit: null,
    material: null,
    quantity: 0
};
let productVariants = [];

// Tag suggestions
const tagSuggestions = [
    'Electronics', 'Fashion', 'Sports', 'Home', 'Beauty', 'Books', 
    'Toys', 'Automotive', 'Health', 'Garden', 'Kitchen', 'Office'
];

// Inventory options
const inventoryOptions = {
    colors: [
        { name: 'Red', value: 'red', color: 'bg-red-500' },
        { name: 'Blue', value: 'blue', color: 'bg-blue-500' },
        { name: 'Green', value: 'green', color: 'bg-green-500' },
        { name: 'Black', value: 'black', color: 'bg-black' },
        { name: 'White', value: 'white', color: 'bg-white border-2 border-gray-300' },
        { name: 'Yellow', value: 'yellow', color: 'bg-yellow-500' },
        { name: 'Purple', value: 'purple', color: 'bg-purple-500' },
        { name: 'Pink', value: 'pink', color: 'bg-pink-500' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    fits: ['Slim', 'Regular', 'Loose', 'Oversized'],
    materials: ['Cotton', 'Polyester', 'Silk', 'Wool', 'Linen', 'Denim', 'Leather', 'Canvas']
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeImageSlots();
    initializeInventoryOptions();
});

function initializeEventListeners() {
    // Basic product information
    document.getElementById('productName').addEventListener('input', (e) => {
        productData.name = e.target.value;
    });
    
    document.getElementById('productBrand').addEventListener('input', (e) => {
        productData.brand = e.target.value;
    });
    
    document.getElementById('productPrice').addEventListener('input', (e) => {
        productData.price = e.target.value;
    });
    
    document.getElementById('productDescription').addEventListener('input', (e) => {
        productData.description = e.target.value;
    });
    
    document.getElementById('isFeatured').addEventListener('change', (e) => {
        productData.isFeatured = e.target.checked;
    });
    
    document.getElementById('freeShipping').addEventListener('change', (e) => {
        productData.freeShipping = e.target.checked;
    });

    // Tags
    const tagInput = document.getElementById('tagInput');
    tagInput.addEventListener('input', handleTagInput);
    tagInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleTagAdd(tagInput.value);
        }
    });

    // Variant quantity
    document.getElementById('variantQuantity').addEventListener('input', (e) => {
        currentVariant.quantity = parseInt(e.target.value) || 0;
        updateAddVariantButton();
    });

    // Add variant button
    document.getElementById('addVariantBtn').addEventListener('click', addVariant);

    // Add new variant button (in variants list)
    document.getElementById('addNewVariantBtn').addEventListener('click', scrollToVariantForm);

    // Save button
    document.getElementById('saveProduct').addEventListener('click', saveProduct);
}

function initializeImageSlots() {
    const imageGrid = document.getElementById('imageGrid');
    
    for (let i = 0; i < 5; i++) {
        const slot = document.createElement('div');
        slot.className = 'image-slot group';
        slot.innerHTML = `
            <div class="w-full h-full flex items-center justify-center">
                <svg class="w-10 h-10 text-slate-400 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
            </div>
            <input type="file" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
        `;
        
        const fileInput = slot.querySelector('input[type="file"]');
        fileInput.addEventListener('change', (e) => handleImageUpload(i, e.target.files[0]));
        
        imageGrid.appendChild(slot);
    }
}

function initializeInventoryOptions() {
    // Colors
    const colorOptions = document.getElementById('colorOptions');
    inventoryOptions.colors.forEach(color => {
        const button = document.createElement('button');
        button.className = `w-12 h-12 rounded-full ${color.color} color-option transition-all duration-200 hover:scale-110 ring-2 ring-slate-300 hover:ring-slate-400 shadow-sm`;
        button.title = color.name;
        button.dataset.value = color.value;
        button.dataset.name = color.name;
        button.addEventListener('click', () => handleVariantSelection('color', color, button));
        colorOptions.appendChild(button);
    });

    // Sizes
    const sizeOptions = document.getElementById('sizeOptions');
    inventoryOptions.sizes.forEach(size => {
        const button = document.createElement('button');
        button.className = 'px-4 py-3 rounded-xl border-2 font-medium variant-option bg-white/50 border-slate-300 text-slate-700 hover:bg-white hover:border-slate-400 shadow-sm transition-all duration-200';
        button.textContent = size;
        button.dataset.value = size;
        button.addEventListener('click', () => handleVariantSelection('size', { name: size, value: size }, button));
        sizeOptions.appendChild(button);
    });

    // Fits
    const fitOptions = document.getElementById('fitOptions');
    inventoryOptions.fits.forEach(fit => {
        const button = document.createElement('button');
        button.className = 'px-4 py-3 rounded-xl border-2 font-medium variant-option bg-white/50 border-slate-300 text-slate-700 hover:bg-white hover:border-slate-400 shadow-sm transition-all duration-200';
        button.textContent = fit;
        button.dataset.value = fit;
        button.addEventListener('click', () => handleVariantSelection('fit', { name: fit, value: fit }, button));
        fitOptions.appendChild(button);
    });

    // Materials
    const materialOptions = document.getElementById('materialOptions');
    inventoryOptions.materials.forEach(material => {
        const button = document.createElement('button');
        button.className = 'px-4 py-3 rounded-xl border-2 font-medium variant-option bg-white/50 border-slate-300 text-slate-700 hover:bg-white hover:border-slate-400 shadow-sm transition-all duration-200';
        button.textContent = material;
        button.dataset.value = material;
        button.addEventListener('click', () => handleVariantSelection('material', { name: material, value: material }, button));
        materialOptions.appendChild(button);
    });
}

function handleTagInput(e) {
    const input = e.target.value;
    const suggestionsContainer = document.getElementById('tagSuggestions');
    
    if (input) {
        const filteredSuggestions = tagSuggestions.filter(suggestion => 
            suggestion.toLowerCase().includes(input.toLowerCase()) && !tags.includes(suggestion)
        );
        
        if (filteredSuggestions.length > 0) {
            suggestionsContainer.innerHTML = '';
            filteredSuggestions.slice(0, 5).forEach(suggestion => {
                const button = document.createElement('button');
                button.className = 'suggestion-item';
                button.textContent = suggestion;
                button.addEventListener('click', () => handleTagAdd(suggestion));
                suggestionsContainer.appendChild(button);
            });
            suggestionsContainer.classList.remove('hidden');
            suggestionsContainer.classList.add('fade-in');
        } else {
            suggestionsContainer.classList.add('hidden');
        }
    } else {
        suggestionsContainer.classList.add('hidden');
    }
}

function handleTagAdd(tag) {
    if (tag && !tags.includes(tag)) {
        tags.push(tag);
        document.getElementById('tagInput').value = '';
        document.getElementById('tagSuggestions').classList.add('hidden');
        renderTags();
    }
}

function handleTagRemove(tagToRemove) {
    tags = tags.filter(tag => tag !== tagToRemove);
    renderTags();
}

function renderTags() {
    const container = document.getElementById('selectedTags');
    container.innerHTML = '';
    
    tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag-item slide-in';
        tagElement.innerHTML = `
            ${tag}
            <button class="tag-remove" onclick="handleTagRemove('${tag}')">×</button>
        `;
        container.appendChild(tagElement);
    });
}

function handleImageUpload(index, file) {
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            images[index] = e.target.result;
            renderImageSlot(index);
        };
        reader.readAsDataURL(file);
    }
}

function renderImageSlot(index) {
    const imageGrid = document.getElementById('imageGrid');
    const slot = imageGrid.children[index];
    
    if (images[index]) {
        slot.classList.add('has-image');
        slot.innerHTML = `
            <img src="${images[index]}" alt="Product ${index + 1}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            ${index === 0 ? '<div class="thumbnail-label">Thumbnail</div>' : ''}
            <input type="file" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
        `;
        
        const fileInput = slot.querySelector('input[type="file"]');
        fileInput.addEventListener('change', (e) => handleImageUpload(index, e.target.files[0]));
    }
}

function handleVariantSelection(type, option, buttonElement) {
    // Clear other selections in the same category
    const categoryContainer = buttonElement.parentElement;
    categoryContainer.querySelectorAll('button').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Select this option
    buttonElement.classList.add('selected');
    currentVariant[type] = option;
    
    updateAddVariantButton();
}

function updateAddVariantButton() {
    const addBtn = document.getElementById('addVariantBtn');
    const hasAllSelections = currentVariant.color && currentVariant.size && 
                            currentVariant.fit && currentVariant.material && 
                            currentVariant.quantity > 0;
    
    if (hasAllSelections) {
        addBtn.disabled = false;
        addBtn.textContent = 'Add Variant';
    } else {
        addBtn.disabled = true;
        addBtn.textContent = 'Select all options and enter quantity';
    }
}

function addVariant() {
    // Check if variant already exists
    const variantExists = productVariants.some(variant => 
        variant.color.value === currentVariant.color.value &&
        variant.size.value === currentVariant.size.value &&
        variant.fit.value === currentVariant.fit.value &&
        variant.material.value === currentVariant.material.value
    );
    
    if (variantExists) {
        alert('This variant combination already exists! Please select different options.');
        return;
    }
    
    // Add variant to list
    const newVariant = {
        id: Date.now(),
        color: { ...currentVariant.color },
        size: { ...currentVariant.size },
        fit: { ...currentVariant.fit },
        material: { ...currentVariant.material },
        quantity: currentVariant.quantity
    };
    
    productVariants.push(newVariant);
    
    // Reset form
    resetVariantForm();
    
    // Update display
    renderVariantsList();
    
    // Show success message
    showToast('Variant added successfully!', 'success');
}

function resetVariantForm() {
    // Clear selections
    document.querySelectorAll('.color-option, .variant-option').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Reset current variant
    currentVariant = {
        color: null,
        size: null,
        fit: null,
        material: null,
        quantity: 0
    };
    
    // Clear quantity input
    document.getElementById('variantQuantity').value = '';
    
    // Update button
    updateAddVariantButton();
}

function renderVariantsList() {
    const variantsList = document.getElementById('variantsList');
    const variantsContainer = document.getElementById('variantsContainer');
    const variantCount = document.getElementById('variantCount');
    
    if (productVariants.length === 0) {
        variantsList.classList.add('hidden');
        return;
    }
    
    variantsList.classList.remove('hidden');
    variantCount.textContent = `${productVariants.length} variant${productVariants.length !== 1 ? 's' : ''}`;
    
    variantsContainer.innerHTML = '';
    
    productVariants.forEach(variant => {
        const variantCard = document.createElement('div');
        variantCard.className = 'variant-card';
        
        const colorObj = inventoryOptions.colors.find(c => c.value === variant.color.value);
        
        variantCard.innerHTML = `
            <div class="flex items-center space-x-4">
                <div class="w-8 h-8 rounded-full ${colorObj?.color || 'bg-gray-500'} border-2 border-slate-300 shadow-sm"></div>
                <div class="flex-1">
                    <div class="font-medium text-slate-800">
                        ${variant.color.name} / ${variant.size.value} / ${variant.fit.value} / ${variant.material.value}
                    </div>
                    <div class="text-sm text-slate-600">
                        Quantity: <span class="font-medium">${variant.quantity}</span>
                    </div>
                </div>
                <button 
                    class="remove-variant-btn"
                    onclick="removeVariant(${variant.id})"
                    title="Remove variant"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        `;
        
        variantsContainer.appendChild(variantCard);
    });
}

function removeVariant(variantId) {
    productVariants = productVariants.filter(variant => variant.id !== variantId);
    renderVariantsList();
    showToast('Variant removed successfully!', 'info');
}

function scrollToVariantForm() {
    const variantForm = document.querySelector('.bg-gradient-to-br.from-slate-50.to-blue-50\\/50');
    if (variantForm) {
        variantForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full`;
    
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    toast.classList.add(bgColor, 'text-white');
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

function saveProduct() {
    const productInfo = {
        ...productData,
        tags: tags,
        images: images.filter(img => img !== null),
        variants: productVariants
    };
    
    console.log('Product saved:', productInfo);
    showToast('Product saved successfully!', 'success');
}

// Make functions globally available
window.handleTagRemove = handleTagRemove;
window.removeVariant = removeVariant;