fetch('data.json')
.then((reponse)=>reponse.json())
.then((data)=>{
    const select = document.getElementById('modele-list');
    const optionsContainer = document.getElementById('options-container');
    data.simulateur_bus.modeles_de_bus.forEach(info => {
        const option = document.createElement('option');
        option.value = info.nom;
        option.textContent = info.nom;
        select.appendChild(option);
    });

    data.simulateur_bus.options.forEach(option => {
        const div = document.createElement('div');
        div.className = 'option-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `option-${option.id}`;
        checkbox.dataset.cout = option.cout;
        
        const label = document.createElement('label');
        label.htmlFor = `option-${option.id}`;
        label.textContent = `${option.nom} (${option.cout.toLocaleString()} MAD)`;
        
        div.appendChild(checkbox);
        div.appendChild(label);
        optionsContainer.appendChild(div);
    });
    
    const btnCalculez = document.getElementById('calculez');
    btnCalculez.addEventListener('click', () => {
        console.clear();
        if (!select.value) {
            alert('Veuillez sélectionner un modèle de bus');
            select.focus();
            return;
        }
        const autonomieInput = document.getElementById('autonomie');
        if (!autonomieInput.value) {
            alert('Veuillez saisir une valeur pour l\'autonomie');
            autonomieInput.focus();
            return;
        }
        if (parseFloat(autonomieInput.value) < 0) {
            alert('L\'autonomie doit être un nombre positif');
            autonomieInput.focus();
            return;
        }

        const reductionInput = document.getElementById('reduction');
        if (!reductionInput.value) {
            alert('Veuillez saisir une valeur pour la réduction');
            reductionInput.focus();
            return;
        }
        if (parseFloat(reductionInput.value) < 0) {
            alert('La réduction doit être un nombre positif');
            reductionInput.focus();
            return;
        }

        const modeleSelectionne = select.value;
        const autonomie = parseFloat(autonomieInput.value);
        const reduction = parseFloat(reductionInput.value);

        const optionsSelectionnees = [...document.querySelectorAll('#options-container input:checked')];
        const coutTotalOptions = optionsSelectionnees.reduce((total, checkbox) => {
            return total + parseFloat(checkbox.dataset.cout);
        }, 0);

        console.log('Valeurs saisies :');
        console.log('Modèle sélectionné:', modeleSelectionne);
        console.log('Autonomie:', autonomie, 'km');
        console.log('Options sélectionnées:', optionsSelectionnees.map(cb => cb.id));
        console.log('Coût total des options:', coutTotalOptions, 'MAD');
        console.log('Réduction:', reduction, 'MAD');

        
        const modeleInfo = data.simulateur_bus.modeles_de_bus.find(m => m.nom === modeleSelectionne);

        if (modeleInfo) {
            console.log('\nDétails du modèle:');
            console.log('Prix de base:', modeleInfo.prix_de_base, 'MAD');
            console.log('Coût batterie par km:', modeleInfo.cout_batterie_par_km, 'MAD');

            const prixTotal = modeleInfo.prix_de_base + 
                            (autonomie * modeleInfo.cout_batterie_par_km) + 
                            coutTotalOptions - 
                            reduction;

            document.getElementById('result').textContent = prixTotal.toLocaleString();
            console.log('\nRésultat du calcul:');
            console.log('Prix total:', prixTotal.toLocaleString(), 'MAD');
        } else {
            alert('Veuillez sélectionner un modèle');
            console.log('Erreur: Aucun modèle sélectionné');
        }
    });
});

// if (optionsSelectionnees.length === 0) {
//     alert('Veuillez sélectionner au moins une option');
//     document.querySelector('#options-container input').focus();
//     return;
// }
