 // Tableau pour stocker l'index de chaque diaporama
 const slideshows = {
    'slideshow1': { currentIndex: 1, intervalId: null },
    'slideshow2': { currentIndex: 1, intervalId: null },
    'slideshow3': { currentIndex: 1, intervalId: null },
    'slideshow4': { currentIndex: 1, intervalId: null },
    'slideshow5': { currentIndex: 1, intervalId: null },
    'slideshow6': { currentIndex: 1, intervalId: null },
    'slideshow7': { currentIndex: 1, intervalId: null },
    'slideshow8': { currentIndex: 1, intervalId: null }
};

// Initialiser tous les diaporamas
Object.keys(slideshows).forEach(id => {
    showSlides(slideshows[id].currentIndex, id);
    startAutoSlide(id);
});

// Démarrer le défilement automatique
function startAutoSlide(slideshowId) {
    // Arrêter l'intervalle existant s'il y en a un
    if (slideshows[slideshowId].intervalId) {
        clearInterval(slideshows[slideshowId].intervalId);
    }
    
    // Définir un nouvel intervalle - changement toutes les 4 secondes
    slideshows[slideshowId].intervalId = setInterval(() => {
        // Passer à la diapositive suivante
        changeSlide(1, slideshowId);
    }, 4000); // 4000 ms = 4 secondes
}

// Réinitialiser le minuteur du défilement automatique lors d'une interaction
function resetAutoSlide(slideshowId) {
    startAutoSlide(slideshowId);
}

// Navigation manuelle
function changeSlide(n, slideshowId) {
    showSlides(slideshows[slideshowId].currentIndex += n, slideshowId);
    resetAutoSlide(slideshowId); // Réinitialiser le minuteur après une interaction
}

// Navigation par point
function currentSlide(n, slideshowId) {
    showSlides(slideshows[slideshowId].currentIndex = n, slideshowId);
    resetAutoSlide(slideshowId); // Réinitialiser le minuteur après une interaction
}

// Afficher une diapositive spécifique
function showSlides(n, slideshowId) {
    const slides = document.querySelectorAll(`#${slideshowId} .slide`);
    const dots = document.querySelectorAll(`#dots${slideshowId.replace('slideshow', '')} .dot`);
    
    // Gérer le bouclage
    if (n > slides.length) {
        slideshows[slideshowId].currentIndex = 1;
    }
    if (n < 1) {
        slideshows[slideshowId].currentIndex = slides.length;
    }
    
    // Masquer toutes les diapositives
    slides.forEach(slide => {
        slide.classList.remove("active");
    });
    
    dots.forEach(dot => {
        dot.classList.remove("active-dot");
    });
    
    // Afficher la diapositive actuelle
    const index = slideshows[slideshowId].currentIndex - 1;
    slides[index].classList.add("active");
    dots[index].classList.add("active-dot");
}

// Ajouter une interaction aux boutons d'ajout au panier
const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
        const productInfo = this.closest('.product-info');
        const ref = productInfo.querySelector('.product-ref').textContent;
        const price = productInfo.querySelector('.product-price').textContent;
        alert(`${ref} ajouté au panier!\nPrix: ${price}`);
    });
});

// Ajouter une interaction aux boutons de détails
const viewDetailsButtons = document.querySelectorAll('.view-details');
viewDetailsButtons.forEach(button => {
    button.addEventListener('click', function() {
        const productInfo = this.closest('.product-info');
        const ref = productInfo.querySelector('.product-ref').textContent;
        alert(`Voir les détails du produit ${ref}`);
    });
});

// Pause du défilement automatique au survol d'un diaporama
const slideshowContainers = document.querySelectorAll('.animph');
slideshowContainers.forEach(contenu => {
    const id = contenu.id;
    
    // Pause au survol
    contenu.addEventListener('mouseenter', function() {
        clearInterval(slideshows[id].intervalId);
    });
    
    // Reprise quand la souris quitte
    contenu.addEventListener('mouseleave', function() {
        startAutoSlide(id);
    });


    document.addEventListener('DOMContentLoaded', () => {
        const compteur = localStorage.getItem('panierCount') || 0;
        document.getElementById('compteur-panier').textContent = compteur;
      });
    
      function ajouterAuPanier() {
        let compteur = parseInt(localStorage.getItem('panierCount')) || 0;
        compteur += 1;
        localStorage.setItem('panierCount', compteur);
        document.getElementById('compteur-panier').textContent = compteur;
      }
    


    // Met à jour le compteur du panier dans l'élément avec l'ID "compteur-panier"
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('panier')) || [];
        const compteur = document.getElementById('compteur-panier');
        if (compteur) {
            compteur.textContent = cart.length;  // Met à jour le compteur avec le nombre d'articles dans le panier
        }
    }



});