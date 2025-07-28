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
    // document.getElementById('addVariantBtn').addEventListener('click', addVariant);

    // Add new variant button (in variants list)
    // document.getElementById('addNewVariantBtn').addEventListener('click', scrollToVariantForm);

    // Save button
    document.getElementById('saveProduct').addEventListener('click', saveProduct);
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