// Structure des données du panier
let panier = {
    articles: [],
    fraisLivraison: 4.99, // Frais de livraison en euros
    codePromo: null
};

// Codes promo disponibles
const codesPromo = {
    "BIENVENUE10": { type: "pourcentage", valeur: 10 },
    "LIVRAISON": { type: "livraison", valeur: "gratuit" },
    "FLASH20": { type: "pourcentage", valeur: 20 }
};

// Données d'exemple pour simuler des produits
const produitsExemple = [
    { 
        id: 1, 
        nom: "T-shirt Premium", 
        prix: 19.99, 
        image: "/api/placeholder/80/80",
        couleur: "Bleu marine", 
        taille: "M" 
    },
    { 
        id: 2, 
        nom: "Jean Slim", 
        prix: 49.99, 
        image: "/api/placeholder/80/80",
        couleur: "Noir", 
        taille: "40" 
    },
    { 
        id: 3, 
        nom: "Baskets Urban", 
        prix: 79.99, 
        image: "/api/placeholder/80/80",
        couleur: "Blanc", 
        taille: "42" 
    }
];

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Charge les données du panier depuis localStorage si disponible
    chargerPanier();
    
    // Affiche le contenu du panier
    afficherPanier();
    
    // Mise en place des écouteurs d'événements
    configurerEvenements();
});

// Chargement du panier depuis localStorage
function chargerPanier() {
    const panierSauvegarde = localStorage.getItem('panier');
    
    if (panierSauvegarde) {
        panier = JSON.parse(panierSauvegarde);
    } else {
        // Ajoute des produits d'exemple au premier chargement
        panier.articles = [
            { 
                produit: produitsExemple[0], 
                quantite: 1 
            },
            { 
                produit: produitsExemple[2], 
                quantite: 1 
            }
        ];
        sauvegarderPanier();
    }
}

// Sauvegarde du panier dans localStorage
function sauvegarderPanier() {
    localStorage.setItem('panier', JSON.stringify(panier));
}

// Configuration des écouteurs d'événements
function configurerEvenements() {
    // Écouteur pour le formulaire de code promo
    const formCodePromo = document.getElementById('form-code-promo');
    if (formCodePromo) {
        formCodePromo.addEventListener('submit', (e) => {
            e.preventDefault();
            appliquerCodePromo();
        });
    }
    
    // Gestion des clics sur le modal
    const modal = document.getElementById('modal-confirmation');
    if (modal) {
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', fermerModal);
        }
        
        // Fermer le modal en cliquant en dehors
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                fermerModal();
            }
        });
    }
}

// Afficher le contenu du panier
function afficherPanier() {
    const listeArticles = document.getElementById('liste-articles');
    const panierVide = document.getElementById('panier-vide');
    const conteneurPanier = document.querySelector('.conteneur-panier');
    const compteurArticles = document.getElementById('compteur-articles');
    
    // Mise à jour du compteur d'articles
    const nombreArticles = panier.articles.reduce((total, item) => total + item.quantite, 0);
    compteurArticles.textContent = nombreArticles;
    
    // Vérification si le panier est vide
    if (panier.articles.length === 0) {
        if (panierVide) panierVide.style.display = 'block';
        if (conteneurPanier) conteneurPanier.style.display = 'none';
        return;
    } else {
        if (panierVide) panierVide.style.display = 'none';
        if (conteneurPanier) conteneurPanier.style.display = 'block';
    }
    
    // Vide le contenu actuel
    if (listeArticles) {
        listeArticles.innerHTML = '';
        
        // Ajoute chaque article
        panier.articles.forEach(item => {
            const ligne = document.createElement('tr');
            ligne.innerHTML = `
                <td>
                    <div class="produit-info">
                        <img src="${item.produit.image}" alt="${item.produit.nom}" class="produit-image">
                        <div>
                            <h3 class="produit-titre">${item.produit.nom}</h3>
                            <div class="produit-details">
                                <span>Couleur: ${item.produit.couleur}</span>
                                <span> | Taille: ${item.produit.taille}</span>
                            </div>
                        </div>
                    </div>
                </td>
                <td class="prix">${formatMonnaie(item.produit.prix)}</td>
                <td>
                    <div class="controle-quantite">
                        <button class="btn-quantite" onclick="modifierQuantite(${item.produit.id}, -1)">-</button>
                        <input type="text" class="input-quantite" value="${item.quantite}" readonly>
                        <button class="btn-quantite" onclick="modifierQuantite(${item.produit.id}, 1)">+</button>
                    </div>
                </td>
                <td class="prix">${formatMonnaie(item.produit.prix * item.quantite)}</td>
                <td>
                    <button class="btn-supprimer" onclick="supprimerArticle(${item.produit.id})" aria-label="Supprimer l'article">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            listeArticles.appendChild(ligne);
        });
    }
    
    // Mise à jour des totaux
    mettreAJourTotaux();
}

// Mise à jour des totaux du panier
function mettreAJourTotaux() {
    const sousTotal = document.getElementById('sous-total');
    const fraisLivraison = document.getElementById('frais-livraison');
    const totalPanier = document.getElementById('total-panier');
    
    // Calcul du sous-total
    const sousTotal_val = panier.articles.reduce((total, item) => {
        return total + (item.produit.prix * item.quantite);
    }, 0);
    
    // Frais de livraison
    let fraisLivraison_val = panier.fraisLivraison;
    
    // Application du code promo si livraison gratuite
    if (panier.codePromo && codesPromo[panier.codePromo] && 
        codesPromo[panier.codePromo].type === "livraison") {
        fraisLivraison_val = 0;
    }
    
    // Calcul du total avec réduction pourcentage si applicable
    let total_val = sousTotal_val + fraisLivraison_val;
    
    if (panier.codePromo && codesPromo[panier.codePromo] && 
        codesPromo[panier.codePromo].type === "pourcentage") {
        const reduction = (sousTotal_val * codesPromo[panier.codePromo].valeur) / 100;
        total_val = sousTotal_val - reduction + fraisLivraison_val;
    }
    
    // Mise à jour des éléments d'affichage
    if (sousTotal) sousTotal.textContent = formatMonnaie(sousTotal_val);
    if (fraisLivraison) fraisLivraison.textContent = formatMonnaie(fraisLivraison_val);
    if (totalPanier) totalPanier.textContent = formatMonnaie(total_val);
    
    // Activer/désactiver le bouton de commande
    const btnCommander = document.getElementById('btn-commander');
    if (btnCommander) {
        if (sousTotal_val === 0) {
            btnCommander.classList.add('disabled');
            btnCommander.setAttribute('aria-disabled', 'true');
        } else {
            btnCommander.classList.remove('disabled');
            btnCommander.setAttribute('aria-disabled', 'false');
        }
    }
}

// Modifier la quantité d'un article
function modifierQuantite(produitId, delta) {
    const index = panier.articles.findIndex(item => item.produit.id === produitId);
    
    if (index !== -1) {
        panier.articles[index].quantite += delta;
        
        // Supprimer l'article si quantité <= 0
        if (panier.articles[index].quantite <= 0) {
            supprimerArticle(produitId);
            return;
        }
        
        // Limiter à max 10 articles
        if (panier.articles[index].quantite > 10) {
            panier.articles[index].quantite = 10;
            afficherMessage("Vous ne pouvez pas commander plus de 10 articles du même produit.", "erreur");
        }
        
        sauvegarderPanier();
        afficherPanier();
    }
}

// Supprimer un article du panier
function supprimerArticle(produitId) {
    panier.articles = panier.articles.filter(item => item.produit.id !== produitId);
    sauvegarderPanier();
    afficherPanier();
    afficherMessage("Article supprimé du panier.", "succes");
}

// Vider le panier (ouvre le modal de confirmation)
function viderPanier() {
    const modal = document.getElementById('modal-confirmation');
    if (modal) {
        modal.classList.add('active');
    }
}

// Confirmer la vidange du panier
function confirmerViderPanier() {
    panier.articles = [];
    panier.codePromo = null;
    sauvegarderPanier();
    afficherPanier();
    afficherMessage("Votre panier a été vidé.", "succes");
    fermerModal();
}

// Fermer le modal
function fermerModal() {
    const modal = document.getElementById('modal-confirmation');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Appliquer un code promo
function appliquerCodePromo() {
    const codeInput = document.getElementById('code-promo');
    const code = codeInput.value.trim().toUpperCase();
    
    if (!code) {
        afficherMessage("Veuillez entrer un code promo.", "erreur");
        return;
    }
    
    if (codesPromo[code]) {
        panier.codePromo = code;
        sauvegarderPanier();
        afficherPanier();
        
        let messagePromo = "";
        if (codesPromo[code].type === "pourcentage") {
            messagePromo = `Code promo appliqué : ${codesPromo[code].valeur}% de réduction.`;
        } else if (codesPromo[code].type === "livraison") {
            messagePromo = "Code promo appliqué : livraison gratuite.";
        }
        
        afficherMessage(messagePromo, "succes");
        codeInput.value = "";
    } else {
        afficherMessage("Code promo invalide ou expiré.", "erreur");
    }
}

// Afficher un message à l'utilisateur
function afficherMessage(texte, type) {
    const zoneMessage = document.getElementById('zone-message');
    
    if (zoneMessage) {
        const message = document.createElement('div');
        message.className = `message message-${type}`;
        message.innerHTML = `
            <i class="fas fa-${type === 'succes' ? 'check-circle' : 'exclamation-circle'}"></i>
            ${texte}
        `;
        
        zoneMessage.innerHTML = '';
        zoneMessage.appendChild(message);
        
        // Faire disparaître le message après 5 secondes
        setTimeout(() => {
            message.style.opacity = "0";
            setTimeout(() => {
                zoneMessage.innerHTML = '';
            }, 300);
        }, 5000);
    }
}

// Formater un nombre en format monétaire
function formatMonnaie(montant) {
    return new Intl.NumberFormat('fr-FR', { 
        style: 'currency', 
        currency: 'EUR' 
    }).format(montant);
}
