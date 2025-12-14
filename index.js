/* ------------------ Hamburger Menu ------------------ */
const ham = document.getElementById("hamburger");
const nav = document.getElementById("nav");
const header = document.querySelector(".header");

ham.addEventListener("click", () => {
    // toggle a class so CSS can control display and animation
    nav.classList.toggle('open');
    ham.classList.toggle('active');
});

/* ------------------ Header Scroll Effect ------------------ */
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.background = 'linear-gradient(90deg, rgba(173, 196, 206, 0.35), rgba(135, 160, 170, 0.45))';
    } else {
        header.style.background = 'linear-gradient(90deg, rgba(173, 196, 206, 0.15), rgba(135, 160, 170, 0.25))';
    }
});

/* ------------------ Gallery Slider ------------------ */
const mainImage = document.getElementById("mainImage");
const thumbs = Array.from(document.querySelectorAll(".thumb"));
const galleryDotsContainer = document.getElementById("galleryDots");

// Get unique images from thumbnails (use relative paths)
const uniqueImages = [];
const imageMap = {};
const dots = [];

thumbs.forEach((thumb, idx) => {
    // Get the src attribute which contains the relative path
    const src = thumb.getAttribute('src');
    if (!uniqueImages.includes(src)) {
        uniqueImages.push(src);
        imageMap[idx] = uniqueImages.length - 1;
    } else {
        // Map duplicate to existing index
        imageMap[idx] = uniqueImages.indexOf(src);
    }
});

let currentImageIndex = 0;

// Create dots for navigation
uniqueImages.forEach((img, idx) => {
    const dot = document.createElement('button');
    dot.className = 'gallery-dot';
    dot.setAttribute('aria-label', `Go to image ${idx + 1}`);
    if (idx === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToImage(idx));
    galleryDotsContainer.appendChild(dot);
    dots.push(dot);
});

function updateActiveStates(index) {
    // Update thumbnails
    thumbs.forEach((thumb, idx) => {
        if (imageMap[idx] === index) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
    
    // Update dots
    dots.forEach((dot, idx) => {
        if (idx === index) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function goToImage(index) {
    if (index < 0) index = uniqueImages.length - 1;
    if (index >= uniqueImages.length) index = 0;
    
    currentImageIndex = index;
    if (mainImage && uniqueImages[currentImageIndex]) {
        mainImage.src = uniqueImages[currentImageIndex];
    }
    updateActiveStates(currentImageIndex);
}

// Arrow navigation
const prevArrow = document.querySelector('.gallery-arrow-prev');
const nextArrow = document.querySelector('.gallery-arrow-next');

if (prevArrow) {
    prevArrow.addEventListener('click', () => goToImage(currentImageIndex - 1));
}

if (nextArrow) {
    nextArrow.addEventListener('click', () => goToImage(currentImageIndex + 1));
}

// Thumbnail click handlers
thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
        const thumbIndex = parseInt(thumb.dataset.index);
        const targetImageIndex = imageMap[thumbIndex];
        goToImage(targetImageIndex);
    });
});

// Initialize gallery - ensure DOM is ready
function initializeGallery() {
    if (thumbs.length > 0 && uniqueImages.length > 0) {
        goToImage(0);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGallery);
} else {
    initializeGallery();
}

/* ------------------ Radio Groups + AddToCart Logic ------------------ */
const addToCartBtn = document.getElementById("addToCart");
const singleSub = document.getElementById("singleContent");
const doubleSub = document.getElementById("doubleContent");
const optionBoxes = document.querySelectorAll('.pricing-options .option');

function setActiveOption(){
    const purchase = document.querySelector("input[name='purchase']:checked");
    optionBoxes.forEach(box => box.classList.remove('active'));
    if(purchase){
        const parent = purchase.closest('.option');
        if(parent) parent.classList.add('active');
    }
}

function updateSubscriptionContent(){
    const purchase = document.querySelector("input[name='purchase']:checked");
    if(!purchase) return;

    // Toggle content panels based on selected purchase option
    if(purchase.value === 'single'){
        if(singleSub) singleSub.style.display = 'block';
        if(doubleSub) doubleSub.style.display = 'none';
    } else if(purchase.value === 'double'){
        if(singleSub) singleSub.style.display = 'none';
        if(doubleSub) doubleSub.style.display = 'block';
    }

    setActiveOption();
}

function updateAddToCart(){
    const purchase = document.querySelector("input[name='purchase']:checked");
    if(!purchase || !addToCartBtn) return;

    let url = '#';
    
    if(purchase.value === 'single'){
        // Single subscription: 3 fragrance options
        const fragrance1 = document.querySelector("input[name='fragrance1']:checked");
        if(fragrance1){
            url = `https://dummy.com/cart/add?type=single&fragrance=${encodeURIComponent(fragrance1.value)}`;
        }
    } else if(purchase.value === 'double'){
        // Double subscription: 3 fragrances × 3 fragrances = 9 combinations
        const fragrance1 = document.querySelector("input[name='fragrance1-double']:checked");
        const fragrance2 = document.querySelector("input[name='fragrance2-double']:checked");
        if(fragrance1 && fragrance2){
            url = `https://dummy.com/cart/add?type=double&fragrance1=${encodeURIComponent(fragrance1.value)}&fragrance2=${encodeURIComponent(fragrance2.value)}`;
        }
    }

    // Update the button href if it's an anchor, or set data attribute if it's a button
    if(addToCartBtn.tagName === 'A'){
        addToCartBtn.href = url;
    } else {
        addToCartBtn.setAttribute('data-cart-url', url);
        addToCartBtn.onclick = function(e) {
            e.preventDefault();
            window.location.href = url;
        };
    }
}

function updateCartAndContent(){
    updateSubscriptionContent();
    updateAddToCart();
}

// Initialize everything when DOM is ready
function initializeProductSection() {
    // Wire change events for purchase type radios
    document.querySelectorAll("input[name='purchase']").forEach(radio => {
        radio.addEventListener('change', updateCartAndContent);
    });

    // Wire change events for fragrance radios
    document.querySelectorAll("input[name='fragrance1'], input[name='fragrance1-double'], input[name='fragrance2-double']").forEach(radio => {
        radio.addEventListener('change', updateAddToCart);
    });

    // Ensure a purchase option is selected
    if(!document.querySelector("input[name='purchase']:checked")){
        const single = document.getElementById('singleOpt');
        if(single) single.checked = true;
    }

    // Ensure fragrance defaults exist for each group
    const groups = ['fragrance1','fragrance1-double','fragrance2-double'];
    groups.forEach(name => {
        if(!document.querySelector(`input[name='${name}']:checked`)){
            const first = document.querySelector(`input[name='${name}']`);
            if(first) first.checked = true;
        }
    });

    updateCartAndContent();
}

// Initialize on page load
if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initializeProductSection);
} else {
    initializeProductSection();
}

// ================= Accordion for Our Collection =================
document.querySelectorAll('.accordion .acc-header').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.accordion-item');
        // close other items
        document.querySelectorAll('.accordion .accordion-item').forEach(i => {
            if(i !== item) i.classList.remove('open');
        });
        // toggle this
        item.classList.toggle('open');
    });
});

// Dropdown toggle for header Shop (handles mobile taps)
document.querySelectorAll('.dropdown > a').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        // if nav overlay is visible (mobile), let CSS show items; still toggle open class for accessibility
        e.preventDefault();
        const parent = toggle.parentElement;
        // close other dropdowns
        document.querySelectorAll('.dropdown').forEach(d => { if(d !== parent) d.classList.remove('open'); });
        parent.classList.toggle('open');
    });
});

// close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    const isDropdown = e.target.closest('.dropdown');
    if(!isDropdown){
        document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
    }
});

/* ------------------ Counter Animation ------------------ */
let started = false;
function counterAnimation() {
    if(started) return;

    const sectionTop = document.getElementById("counterSec").offsetTop;
    const scrollPos = window.scrollY + window.innerHeight;

    if(scrollPos > sectionTop){
        started = true;
        document.querySelectorAll(".count").forEach(counter => {
            let target = +counter.getAttribute("data-target");
            let count = 0;

            const speed = target / 100;

            let update = setInterval(() => {
                count += speed;
                counter.innerText = Math.floor(count);

                if(count >= target){
                    counter.innerText = target;
                    clearInterval(update);
                }
            }, 20);
        });
    }
}
window.addEventListener("scroll", counterAnimation);
