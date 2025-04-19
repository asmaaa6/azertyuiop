function chargerPanier() {
    const panier = JSON.parse(localStorage.getItem('panier')) || [];
    const corpsTable = document.getElementById('liste-articles');
    const zoneMessage = document.getElementById('zone-message');
    corpsTable.innerHTML = '';
    let total = 0;
  
    if (panier.length === 0) {
      corpsTable.innerHTML = '<tr><td colspan="5">Votre panier est actuellement vide.</td></tr>';
      return;
    }
  
    panier.forEach((article, index) => {
      const sousTotal = article.prix * article.quantite;
      total += sousTotal;
  
      const ligne = document.createElement('tr');
      ligne.className = 'ligne-article';
  
      ligne.innerHTML = `
        <td>${article.nom}</td>
        <td>${article.prix.toFixed(2)} €</td>
        <td><input type="number" min="1" value="${article.quantite}" onchange="modifierQuantite(${index}, this.value)"></td>
        <td>${sousTotal.toFixed(2)} €</td>
        <td><button onclick="supprimerArticle(${index})">❌</button></td>
      `;
  
      corpsTable.appendChild(ligne);
    });
  
    const totalLigne = document.createElement('tr');
    totalLigne.innerHTML = `
      <td colspan="3"><strong>Total général</strong></td>
      <td colspan="2"><strong>${total.toFixed(2)} €</strong></td>
    `;
    corpsTable.appendChild(totalLigne);
  }
  
  function modifierQuantite(indice, nouvelleValeur) {
    const panier = JSON.parse(localStorage.getItem('panier')) || [];
    panier[indice].quantite = parseInt(nouvelleValeur);
    localStorage.setItem('panier', JSON.stringify(panier));
    chargerPanier();
    actualiserCompteur();
    afficherMessage("Quantité mise à jour !");
  }
  
  function supprimerArticle(indice) {
    const panier = JSON.parse(localStorage.getItem('panier')) || [];
    panier.splice(indice, 1);
    localStorage.setItem('panier', JSON.stringify(panier));
    chargerPanier();
    actualiserCompteur();
    afficherMessage("Article supprimé.");
  }
  
  function viderPanier() {
    localStorage.removeItem('panier');
    chargerPanier();
    actualiserCompteur();
    afficherMessage("Le panier a été vidé.");
  }
  
  function afficherMessage(texte) {
    const zone = document.getElementById('zone-message');
    zone.textContent = texte;
    zone.style.opacity = 1;
    setTimeout(() => {
      zone.style.opacity = 0;
    }, 3000);
  }
  
  function actualiserCompteur() {
    const panier = JSON.parse(localStorage.getItem('panier')) || [];
    const totalArticles = panier.reduce((acc, article) => acc + article.quantite, 0);
    document.getElementById('compteur-articles').textContent = totalArticles;
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    chargerPanier();
    actualiserCompteur();
  });
  