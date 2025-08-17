document.addEventListener('DOMContentLoaded', () => {
    // Dades de l'aplicació
    const atomicMasses = {
        'H': 1.008, 'He': 4.0026, 'Li': 6.94, 'Be': 9.0122, 'B': 10.81, 'C': 12.011, 'N': 14.007, 'O': 15.999,
        'F': 18.998, 'Ne': 20.180, 'Na': 22.990, 'Mg': 24.305, 'Al': 26.982, 'Si': 28.085, 'P': 30.974, 'S': 32.06,
        'Cl': 35.45, 'K': 39.098, 'Ar': 39.948, 'Ca': 40.078, 'Sc': 44.956, 'Ti': 47.867, 'V': 50.942, 'Cr': 51.996,
        'Mn': 54.938, 'Fe': 55.845, 'Co': 58.933, 'Ni': 58.693, 'Cu': 63.546, 'Zn': 65.38, 'Ga': 69.723, 'Ge': 72.630,
        'As': 74.922, 'Se': 78.971, 'Br': 79.904, 'Kr': 83.798, 'Rb': 85.468, 'Sr': 87.62, 'Y': 88.906, 'Zr': 91.224,
        'Nb': 92.906, 'Mo': 95.96, 'Ru': 101.07, 'Rh': 102.91, 'Pd': 106.42, 'Ag': 107.87, 'Cd': 112.41, 'In': 114.82,
        'Sn': 118.71, 'Sb': 121.76, 'Te': 127.60, 'I': 126.90, 'Xe': 131.29, 'Cs': 132.91, 'Ba': 137.33, 'La': 138.91,
        'Ce': 140.12, 'Pr': 140.91, 'Nd': 144.24, 'Sm': 150.36, 'Eu': 151.96, 'Gd': 157.25, 'Tb': 158.93, 'Dy': 162.50,
        'Ho': 164.93, 'Er': 167.26, 'Tm': 168.93, 'Yb': 173.05, 'Lu': 174.97, 'Hf': 178.49, 'Ta': 180.95, 'W': 183.84,
        'Re': 186.21, 'Os': 190.23, 'Ir': 192.22, 'Pt': 195.08, 'Au': 196.97, 'Hg': 200.59, 'Tl': 204.38, 'Pb': 207.2,
        'Bi': 208.98, 'Po': 209, 'At': 210, 'Rn': 222
    };

    const reactions = [
        { reactants: ['N2', 'H2'], products: ['NH3'] },
        { reactants: ['CH4', 'O2'], products: ['CO2', 'H2O'] },
        { reactants: ['H2', 'O2'], products: ['H2O'] },
        { reactants: ['Fe', 'O2'], products: ['Fe2O3'] },
        { reactants: ['C6H12O6', 'O2'], products: ['CO2', 'H2O'] },
        { reactants: ['KClO3'], products: ['KCl', 'O2'] },
        { reactants: ['Al', 'HCl'], products: ['AlCl3', 'H2'] },
        { reactants: ['NaOH', 'HCl'], products: ['NaCl', 'H2O'] },
        { reactants: ['AgNO3', 'NaCl'], products: ['AgCl', 'NaNO3'] },
        { reactants: ['CaCO3'], products: ['CaO', 'CO2'] },
    ];

    let currentReaction = null;
    let currentCalculation = {};
    let sessionHistory = [];
    let totalCalculations = 0;
    let correctCalculations = 0;
    let attemptCounter = 1;
    let currentCalculationAttempts = [];

    // Elements del DOM
    const puntuacioContainer = document.getElementById('puntuacio-container');
    const puntuacioSpan = document.getElementById('puntuacio');
    const btnGenerarInforme = document.getElementById('btn-generar-informe');
    const btnModeAleatori = document.getElementById('btn-mode-aleatori');
    const btnModePersonalitzat = document.getElementById('btn-mode-personalitzat');
    const zonaAleatoria = document.getElementById('zona-aleatoria');
    const zonaCreacio = document.getElementById('zona-creacio');
    const btnNovaReaccio = document.getElementById('btn-nova-reaccio');
    const reactiusCreacioContainer = document.getElementById('reactius-creacio-container');
    const productesCreacioContainer = document.getElementById('productes-creacio-container');
    const btnAddReactiu = document.getElementById('btn-add-reactiu');
    const btnAddProducte = document.getElementById('btn-add-producte');
    const btnConfirmaReaccio = document.getElementById('btn-confirma-reaccio');
    const zonaAjust = document.getElementById('zona-ajust');
    const reactionContainer = document.getElementById('reaccio-container');
    const btnVerifica = document.getElementById('btn-verifica');
    const missatgeAjust = document.getElementById('missatge-ajust');
    const zonaCalcul = document.getElementById('zona-calcul');
    const btnEscriureResposta = document.getElementById('btn-preparar-calcul');
    const resultatDiv = document.getElementById('resultat');
    const selectPartida = document.getElementById('select-partida');
    const selectDesitjada = document.getElementById('select-desitjada');
    const massaPartidaInput = document.getElementById('massa-partida');
    const selectUnitatPartida = document.getElementById('select-unitat-partida');
    const selectUnitatDesitjada = document.getElementById('select-unitat-desitjada');
    const zonaRespostaUsuari = document.getElementById('zona-resposta-usuari');
    const respostaUsuariInput = document.getElementById('resposta-usuari');
    const btnComprovaResposta = document.getElementById('btn-comprova-resposta');
    const missatgeCalcul = document.getElementById('missatge-calcul');
    const opcionsCalculIncorrecte = document.getElementById('opcions-calcul-incorrecte');
    const btnReintentarCalcul = document.getElementById('btn-reintentar-calcul');
    const btnVeureSolucio = document.getElementById('btn-veure-solucio');
    const zonaAccionsFinal = document.getElementById('zona-accions-final');
    const btnSeguentReaccioAleatoria = document.getElementById('btn-seguent-reaccio-aleatoria');
    const btnAnarAPersonalitzat = document.getElementById('btn-anar-a-personalitzat');
    const btnGenerarInformeFinal = document.getElementById('btn-generar-informe-final');

    const AVOGADRO = 6.022e23;

    function generatePDF() {
        const studentName = prompt("Introdueix el teu nom per a l'informe:", "Nom Alumne");
        if (!studentName) return;
        if (sessionHistory.length === 0) {
            alert("No has realitzat cap exercici encara.");
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let y = 15;

        // Capçalera
        doc.setFontSize(18);
        doc.text("Informe del Laboratori d'Estequiometria", 105, y, { align: 'center' });
        y += 8;
        doc.setFontSize(12);
        doc.text(`Alumne/a: ${studentName}`, 105, y, { align: 'center' });
        y += 8;
        doc.text(`Data: ${new Date().toLocaleDateString('ca-ES')}`, 105, y, { align: 'center' });
        y += 15;

        // Càlcul i resum de la puntuació
        const correctExercises = sessionHistory.filter(item => item.status === 'Correcte a l\'intent 1').length;
        const totalExercises = sessionHistory.length;

        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text("Resum de la Puntuació", 15, y);
        y += 8;
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text(`Puntuació Final: ${correctExercises} de ${totalExercises} (1 punt per exercici correcte al primer intent)`, 20, y);
        y += 15;

        // Detall dels exercicis
        sessionHistory.forEach((item, index) => {
            if (y > 270) { // Marge per a nova pàgina
                doc.addPage();
                y = 15;
            }

            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text(`Exercici ${index + 1}`, 15, y);
            y += 8;
            doc.setFontSize(12);
            doc.setFont(undefined, 'normal');

            const linesReaction = doc.splitTextToSize(`Reacció: ${item.reaction}`, 180);
            doc.text(linesReaction, 20, y);
            y += linesReaction.length * 6 + 5;

            const linesCalc = doc.splitTextToSize(`Càlcul: ${item.calculation}`, 180);
            doc.text(linesCalc, 20, y);
            y += linesCalc.length * 6 + 5;

            if (item.attempts && item.attempts.length > 0) {
                doc.setFont(undefined, 'bold');
                doc.text("Intents de l'alumne:", 20, y);
                y += 6;
                doc.setFont(undefined, 'normal');
                item.attempts.forEach(attempt => {
                    const isCorrect = Math.abs((attempt.answer - item.correctResult) / item.correctResult) < 0.01;
                    doc.text(`- Intent ${attempt.attempt}: ${formatNumber(attempt.answer)} (${isCorrect ? 'Correcte' : 'Incorrecte'})`, 25, y);
                    y += 6;
                });
            }
            
            let statusText = `Resultat Final: ${item.result}`;
            if (item.status === 'Solució Vista') {
                statusText += " (Solució consultada, no puntua)";
                doc.setTextColor(220, 53, 69); // Vermell
            } else if (item.status === 'Correcte a l\'intent 1') {
                statusText += ` (${item.status}, +1 punt)`;
                doc.setTextColor(25, 135, 84); // Verd
            } else {
                 statusText += ` (${item.status}, no puntua)`;
                 doc.setTextColor(255, 193, 7); // Taronja/Groc per a reintents
            }
            const linesResult = doc.splitTextToSize(statusText, 180);
            doc.setFont(undefined, 'bold');
            doc.text(linesResult, 20, y);
            y += linesResult.length * 6 + 10;
            doc.setTextColor(0, 0, 0); // Restaura el color a negre
        });

        doc.save(`informe_estequiometria_${studentName.replace(/\s/g, '_')}.pdf`);
    }

    function formatNumber(num, precision = 4) {
        if (num === 0) return 0;
        if (Math.abs(num) < 1e-4 || Math.abs(num) >= 1e5) {
            return num.toExponential(2);
        }
        return Number(num.toFixed(precision));
    }

    function formatFormula(formula) {
        return formula.replace(/(\d+)/g, '<sub>$1</sub>');
    }

    function formatFormulaForPDF(formula) {
        return formula.replace(/<sub>/g, '').replace(/<\/sub>/g, '');
    }

    function parseFormula(formula) {
        const atoms = {};
        const regex = /([A-Z][a-z]*)(\d*)|(\()([^)]+)(\))(\d+)/g;
        let match;
        while ((match = regex.exec(formula))) {
            if (match[1]) {
                atoms[match[1]] = (atoms[match[1]] || 0) + (parseInt(match[2]) || 1);
            } else if (match[3]) {
                const groupAtoms = parseFormula(match[4]);
                for (const element in groupAtoms) {
                    atoms[element] = (atoms[element] || 0) + groupAtoms[element] * parseInt(match[6]);
                }
            }
        }
        return atoms;
    }

    function getMolarMass(formula) {
        const atoms = parseFormula(formula);
        return Object.entries(atoms).reduce((mass, [el, count]) => mass + (atomicMasses[el] ? count * atomicMasses[el] : 0), 0);
    }

    function updateScoreDisplay() {
        puntuacioSpan.textContent = `${correctCalculations} / ${totalCalculations}`;
    }

    function resetScore() {
        totalCalculations = 0;
        correctCalculations = 0;
        updateScoreDisplay();
    }

    function switchMode(mode) {
        btnModeAleatori.classList.toggle('active', mode === 'aleatori');
        btnModePersonalitzat.classList.toggle('active', mode !== 'aleatori');
        zonaAleatoria.style.display = mode === 'aleatori' ? 'block' : 'none';
        zonaCreacio.style.display = mode === 'aleatori' ? 'none' : 'block';
        
        // Amaga totes les zones de joc
        [puntuacioContainer, zonaAjust, zonaCalcul, zonaRespostaUsuari, zonaAccionsFinal].forEach(el => el.style.display = 'none');
        resultatDiv.innerHTML = '';
    }

    function addFormulaInput(container, placeholder) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control mb-2 formula-input';
        input.placeholder = placeholder;
        container.appendChild(input);
    }

    function loadRandomReaction() {
        displayReactionForBalancing(reactions[Math.floor(Math.random() * reactions.length)]);
    }

    function loadCustomReaction() {
        const getFormulas = (container) => Array.from(container.querySelectorAll('.formula-input')).map(i => i.value.trim()).filter(Boolean);
        const reactants = getFormulas(reactiusCreacioContainer);
        const products = getFormulas(productesCreacioContainer);
        if (reactants.length > 0 && products.length > 0) {
            displayReactionForBalancing({ reactants, products });
        } else {
            alert('Cal introduir almenys un reactiu i un producte.');
        }
    }

    function displayReactionForBalancing(reaction) {
        currentReaction = reaction;
        reactionContainer.innerHTML = '';
        [...reaction.reactants, ...reaction.products].forEach((comp, i) => {
            reactionContainer.innerHTML += `<input type="number" class="coeficient-input" min="1"> <span class="formula">${formatFormula(comp)}</span>`;
            if (i === reaction.reactants.length - 1) {
                reactionContainer.innerHTML += '<span class="mx-2">→</span>';
            } else if (i < reaction.reactants.length - 1 || (i > reaction.reactants.length -1 && i < reaction.reactants.length + reaction.products.length -1) ) {
                reactionContainer.innerHTML += '<span class="mx-1">+</span>';
            }
        });
        
        // Mostra la zona d'ajust i la puntuació, i reinicia el marcador
        zonaAjust.style.display = 'block';
        puntuacioContainer.style.display = 'block';
        resetScore();

        // Amaga les altres zones
        [zonaCalcul, zonaRespostaUsuari, zonaAccionsFinal].forEach(el => el.style.display = 'none');
        missatgeAjust.textContent = '';
        resultatDiv.innerHTML = '';
    }

    function getReactionString(coefficients) {
        const components = [...currentReaction.reactants, ...currentReaction.products];
        return components.map((c, i) => `${coefficients[i]} ${formatFormulaForPDF(c)}`).join(' + ').replace(/\+ \→ \+/, '→');
    }

    function checkBalance() {
        const userCoefficients = Array.from(reactionContainer.querySelectorAll('.coeficient-input')).map(input => parseInt(input.value) || 0);
        if (userCoefficients.some(c => c === 0)) {
            missatgeAjust.textContent = 'Cal introduir tots els coeficients.';
            missatgeAjust.className = 'incorrecte';
            return;
        }

        const atomsCount = { reactants: {}, products: {} };
        let errorFormula = null;
        [...currentReaction.reactants, ...currentReaction.products].forEach((component, i) => {
            if (errorFormula) return;
            const atoms = parseFormula(component);
            if (!atoms || Object.keys(atoms).length === 0 || Object.keys(atoms).some(el => !atomicMasses[el])) {
                errorFormula = component;
                return;
            }
            const side = i < currentReaction.reactants.length ? 'reactants' : 'products';
            for (const element in atoms) {
                atomsCount[side][element] = (atomsCount[side][element] || 0) + atoms[element] * userCoefficients[i];
            }
        });

        if (errorFormula) {
            missatgeAjust.textContent = `La fórmula "${errorFormula}" no és vàlida.`;
            missatgeAjust.className = 'incorrecte';
            zonaCalcul.style.display = 'none';
            return;
        }

        const allElements = new Set([...Object.keys(atomsCount.reactants), ...Object.keys(atomsCount.products)]);
        const balanced = [...allElements].every(el => (atomsCount.reactants[el] || 0) === (atomsCount.products[el] || 0));

        missatgeAjust.textContent = balanced ? 'Correcte! Reacció ajustada.' : 'Incorrecte. Revisa els coeficients.';
        missatgeAjust.className = balanced ? 'correcte' : 'incorrecte';
        zonaCalcul.style.display = balanced ? 'block' : 'none';
        if (balanced) {
            populateSelects();
            // L'exercici s'afegeix a l'historial un cop completat el càlcul.
        }
    }

    function populateSelects() {
        const allComponents = [...currentReaction.reactants, ...currentReaction.products];
        [selectPartida, selectDesitjada].forEach(select => {
            select.innerHTML = '';
            allComponents.forEach(comp => {
                select.innerHTML += `<option value="${comp}">${formatFormula(comp)}</option>`;
            });
        });
    }

    function prepareCalculation() {
        const quantitatPartida = parseFloat(massaPartidaInput.value);
        if (!quantitatPartida || quantitatPartida <= 0) {
            alert('Introdueix una quantitat de partida vàlida.');
            return;
        }
        
        totalCalculations++;
        attemptCounter = 1;
        currentCalculationAttempts = [];
        updateScoreDisplay();

        const userCoefficients = Array.from(reactionContainer.querySelectorAll('.coeficient-input')).map(input => parseInt(input.value));
        const allComponents = [...currentReaction.reactants, ...currentReaction.products];
        
        currentCalculation = {
            formulaPartida: selectPartida.value,
            formulaDesitjada: selectDesitjada.value,
            quantitatPartida: quantitatPartida,
            unitatPartida: selectUnitatPartida.value,
            unitatDesitjada: selectUnitatDesitjada.value,
            coefPartida: userCoefficients[allComponents.findIndex(c => c === selectPartida.value)],
            coefDesitjada: userCoefficients[allComponents.findIndex(c => c === selectDesitjada.value)],
            molarMassPartida: getMolarMass(selectPartida.value),
            molarMassDesitjada: getMolarMass(selectDesitjada.value)
        };
        
        currentCalculation.resultatCorrecte = calculateResult(currentCalculation);

        zonaRespostaUsuari.style.display = 'block';
        missatgeCalcul.innerHTML = `Calcula quants ${currentCalculation.unitatDesitjada} de ${formatFormula(currentCalculation.formulaDesitjada)} s'obtenen.`;
        missatgeCalcul.className = '';
        opcionsCalculIncorrecte.style.display = 'none';
        respostaUsuariInput.value = '';
        resultatDiv.innerHTML = '';
    }

    function calculateResult({ quantitatPartida, unitatPartida, molarMassPartida, coefPartida, coefDesitjada, molarMassDesitjada, unitatDesitjada }) {
        let molsPartida;
        if (unitatPartida === 'g') molsPartida = quantitatPartida / molarMassPartida;
        else if (unitatPartida === 'mols') molsPartida = quantitatPartida;
        else molsPartida = quantitatPartida / AVOGADRO;

        const molsDesitjats = molsPartida * (coefDesitjada / coefPartida);

        if (unitatDesitjada === 'g') return molsDesitjats * molarMassDesitjada;
        if (unitatDesitjada === 'mols') return molsDesitjats;
        return molsDesitjats * AVOGADRO;
    }

    function checkUserAnswer() {
        const userAnswer = parseFloat(respostaUsuariInput.value);
        if (isNaN(userAnswer)) {
            alert("Si us plau, introdueix un número vàlid.");
            return;
        }

        currentCalculationAttempts.push({ attempt: attemptCounter, answer: userAnswer });
        const correctResult = currentCalculation.resultatCorrecte;
        const isCorrect = Math.abs((userAnswer - correctResult) / correctResult) < 0.01;

        missatgeCalcul.textContent = isCorrect ? 'Molt bé! Resposta correcta.' : 'Resposta incorrecta.';
        missatgeCalcul.className = isCorrect ? 'correcte' : 'incorrecte';
        opcionsCalculIncorrecte.style.display = isCorrect ? 'none' : 'block';

        if (isCorrect) {
            if (attemptCounter === 1) {
                correctCalculations++;
                updateScoreDisplay();
            }
            showFinalResult(false);
        }
    }
    
    function showFinalResult(penalitzat) {
        const { quantitatPartida, unitatPartida, formulaPartida, unitatDesitjada, formulaDesitjada, resultatCorrecte } = currentCalculation;
        
        const pas1Html = getStep1Html(currentCalculation);
        const pas2Html = getStep2Html(currentCalculation);
        const pas3Html = getStep3Html(currentCalculation);

        resultatDiv.innerHTML = `
            <h3>Resultat del Càlcul ${penalitzat ? "<span class='text-danger'>(Solució Consultada)</span>" : ""}</h3>
            <p>Partint de <strong>${formatNumber(quantitatPartida)} ${unitatPartida}</strong> de <strong>${formatFormula(formulaPartida)}</strong>, s'obtenen:</p>
            <p class="fs-4 text-center bg-light p-3 rounded"><strong>${formatNumber(resultatCorrecte)} ${unitatDesitjada}</strong> de <strong>${formatFormula(formulaDesitjada)}</strong></p>
            <hr>
            <h4>Procediment Pas a Pas:</h4>
            <ol>${pas1Html}${pas2Html}${pas3Html}</ol>
        `;
        
        const userCoefficients = Array.from(reactionContainer.querySelectorAll('.coeficient-input')).map(input => parseInt(input.value));
        const calculationString = `De ${formatNumber(quantitatPartida)} ${unitatPartida} de ${formatFormulaForPDF(formulaPartida)} a ${unitatDesitjada} de ${formatFormulaForPDF(formulaDesitjada)}`;
        const resultString = `${formatNumber(resultatCorrecte)} ${unitatDesitjada}`;
        
        sessionHistory.push({
            type: "Exercici",
            reaction: getReactionString(userCoefficients),
            calculation: calculationString,
            result: resultString,
            correctResult: resultatCorrecte,
            status: penalitzat ? 'Solució Vista' : `Correcte a l\'intent ${attemptCounter}`,
            attempts: currentCalculationAttempts,
            timestamp: new Date()
        });

        zonaRespostaUsuari.style.display = 'none';
        zonaAccionsFinal.style.display = 'block';
    }

    function getStep1Html({ quantitatPartida, unitatPartida, formulaPartida, molarMassPartida }) {
        let molsPartida;
        let html = `<li><strong>Massa molar de ${formatFormula(formulaPartida)}:</strong> ${formatNumber(molarMassPartida)} g/mol</li>`;
        if (unitatPartida === 'g') {
            molsPartida = quantitatPartida / molarMassPartida;
            html += `<li><strong>Conversió a mols:</strong> ${formatNumber(quantitatPartida)} g / ${formatNumber(molarMassPartida)} g/mol = ${formatNumber(molsPartida)} mols</li>`;
        } else if (unitatPartida === 'molecules') {
            molsPartida = quantitatPartida / AVOGADRO;
            html += `<li><strong>Conversió a mols:</strong> ${formatNumber(quantitatPartida)} molècules / ${AVOGADRO.toExponential(2)} = ${formatNumber(molsPartida)} mols</li>`;
        } else {
             molsPartida = quantitatPartida;
             html = `<li><strong>Mols de partida:</strong> ${formatNumber(molsPartida)} mols</li>`;
        }
        return html;
    }

    function getStep2Html(calc) {
        const molsPartida = (calc.unitatPartida === 'g') ? calc.quantitatPartida / calc.molarMassPartida : (calc.unitatPartida === 'mols' ? calc.quantitatPartida : calc.quantitatPartida / AVOGADRO);
        const molsDesitjats = molsPartida * (calc.coefDesitjada / calc.coefPartida);
        return `<li><strong>Relació estequiomètrica (${calc.coefPartida}:${calc.coefDesitjada}):</strong> ${formatNumber(molsPartida)} mols * (${calc.coefDesitjada} / ${calc.coefPartida}) = ${formatNumber(molsDesitjats)} mols de ${formatFormula(calc.formulaDesitjada)}</li>`;
    }

    function getStep3Html(calc) {
        const molsPartida = (calc.unitatPartida === 'g') ? calc.quantitatPartida / calc.molarMassPartida : (calc.unitatPartida === 'mols' ? calc.quantitatPartida : calc.quantitatPartida / AVOGADRO);
        const molsDesitjats = molsPartida * (calc.coefDesitjada / calc.coefPartida);
        let html = `<li><strong>Massa molar de ${formatFormula(calc.formulaDesitjada)}:</strong> ${formatNumber(calc.molarMassDesitjada)} g/mol</li>`;
        if (calc.unitatDesitjada === 'g') {
            html += `<li><strong>Conversió a grams:</strong> ${formatNumber(molsDesitjats)} mols * ${formatNumber(calc.molarMassDesitjada)} g/mol = <strong>${formatNumber(calc.resultatCorrecte)} g</strong></li>`;
        } else if (calc.unitatDesitjada === 'molecules') {
            html += `<li><strong>Conversió a molècules:</strong> ${formatNumber(molsDesitjats)} mols * ${AVOGADRO.toExponential(2)} = <strong>${formatNumber(calc.resultatCorrecte)} molècules</strong></li>`;
        } else {
            html = `<li><strong>Resultat en mols:</strong> <strong>${formatNumber(calc.resultatCorrecte)} mols</strong></li>`;
        }
        return html;
    }


    // Event Listeners
    btnModeAleatori.addEventListener('click', () => switchMode('aleatori'));
    btnModePersonalitzat.addEventListener('click', () => switchMode('personalitzat'));
    btnNovaReaccio.addEventListener('click', loadRandomReaction);
    btnAddReactiu.addEventListener('click', () => addFormulaInput(reactiusCreacioContainer, 'p. ex. O2'));
    btnAddProducte.addEventListener('click', () => addFormulaInput(productesCreacioContainer, 'p. ex. H2O'));
    btnConfirmaReaccio.addEventListener('click', loadCustomReaction);
    btnVerifica.addEventListener('click', checkBalance);
    btnEscriureResposta.addEventListener('click', prepareCalculation);
    btnComprovaResposta.addEventListener('click', checkUserAnswer);
    btnReintentarCalcul.addEventListener('click', () => {
        attemptCounter++;
        opcionsCalculIncorrecte.style.display = 'none';
        missatgeCalcul.textContent = `Torna-ho a provar (Intent ${attemptCounter}): Calcula quants ${currentCalculation.unitatDesitjada} de ${formatFormula(currentCalculation.formulaDesitjada)} s'obtenen.`;
        missatgeCalcul.className = '';
        respostaUsuariInput.value = '';
        respostaUsuariInput.focus();
    });
    btnVeureSolucio.addEventListener('click', () => showFinalResult(true));
    btnGenerarInforme.addEventListener('click', generatePDF);

    // Botons de la zona final
    btnSeguentReaccioAleatoria.addEventListener('click', loadRandomReaction);
    btnAnarAPersonalitzat.addEventListener('click', () => switchMode('personalitzat'));
    btnGenerarInformeFinal.addEventListener('click', generatePDF);


    // Càrrega inicial
    switchMode('aleatori');
});
