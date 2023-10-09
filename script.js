let fields = [
    null, 
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
];

const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
    [0, 4, 8], [2, 4, 6], // diagonal
];

let currentPlayer = 'circle';

function init(){
    render();
}


function render(){
    const contentDiv = document.getElementById('content');

    let tableHtml = '<table>';
    for (let i = 0; i < 3; i++) {
        tableHtml += '<tr>';
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            let symbol = '';
            if (fields[index] == 'circle'){
                const circleSVG = generateCircleSVG();
                symbol = new XMLSerializer().serializeToString(circleSVG);

            } else if (fields[index] == 'cross'){
                const crossSVG = generateCrossSVG();
                symbol = new XMLSerializer().serializeToString(crossSVG);
            }
            tableHtml += `<td onclick="handleClick(this, ${index})">${symbol}</td>`;
        }
        tableHtml += '</tr>';
    }
tableHtml += '</table';
contentDiv.innerHTML = tableHtml;
}


function handleClick(cell, index) {
    if (fields[index] === null) {
        fields[index] = currentPlayer;
        if (currentPlayer === 'circle') {
            const circleSVG = generateCircleSVG();
            const circleString = new XMLSerializer().serializeToString(circleSVG);
            cell.innerHTML = circleString;
        } else {
            const crossSVG = generateCrossSVG();
            const crossString = new XMLSerializer().serializeToString(crossSVG);
            cell.innerHTML = crossString;
        }
        cell.onclick = null;
        currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';

        if (checkGameOver()) {
            // Spiel ist vorbei, fügen Sie hier den Code zum Anhalten des Spiels hinzu
        }
    }
}


// Hinzufügen einer Funktion zum Überprüfen des Spielendes
function checkGameOver() {
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontale Gewinnkombinationen
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertikale Gewinnkombinationen
        [0, 4, 8], [2, 4, 6] // Diagonale Gewinnkombinationen
    ];

    for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            // Gewonnen, zeichne die Linie
            drawWinningLine(a, b, c);
            endGame(); // Spiel beenden
            return true;
        }
    }

    // Unentschieden (Remis)
    if (!fields.includes(null)) {
        endGame(); // Spiel beenden
        return true;
    }

    return false;
}


function drawWinningLine(a, b, c) {
    const lineColor = '#ffffff';
    const lineWidth = 5;

    const startCell = document.querySelectorAll(`td`)[a];
    const endCell = document.querySelectorAll(`td`)[c];
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();
    const contentRect = document.getElementById('content').getBoundingClientRect();

    const lineLength = Math.sqrt(
        Math.pow(endRect.left - startRect.left, 2) + Math.pow(endRect.top - startRect.top, 2)
    );
    const lineAngle = Math.atan2(endRect.top - startRect.top, endRect.left - startRect.left);

    const line = document.createElement('div');
    line.style.position = 'absolute';
    line.style.width = `${lineLength}px`;
    line.style.height = `${lineWidth}px`;
    line.style.backgroundColor = lineColor;
    line.style.top = `${startRect.top + startRect.height / 2 - lineWidth / 2 - contentRect.top}px`;
    line.style.left = `${startRect.left + startRect.width / 2 - contentRect.left}px`;
    line.style.transform = `rotate(${lineAngle}rad)`;
    line.style.transformOrigin = `top left`;
    document.getElementById('content').appendChild(line);
} 


function endGame() {
    // Deaktivieren alle Klicks auf die Zellen
    const cells = document.querySelectorAll('td');
    cells.forEach(cell => cell.onclick = null);
    // Fügen Sie hier ggf. weiteren Code hinzu, um das Spiel nach einem Sieg zu verwalten
}


function generateCircleSVG(){
    // Erstellen Sie ein SVG-Element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100");
    svg.setAttribute("height", "100");

    // Erstellen Sie einen Kreis im SVG
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", "50");
    circle.setAttribute("cy", "50");
    circle.setAttribute("r", "30");
    circle.setAttribute("fill", "none"); // Keine Füllung
    circle.setAttribute("stroke", "blue"); // Umrandungsfarbe
    circle.setAttribute("stroke-width", "5"); // Breite der Umrandung

    // Erstellen Sie die Animation für die Ungefülltheit (dasharray)
    const animateDash = document.createElementNS("http://www.w3.org/2000/svg", "animate");
    animateDash.setAttribute("attributeName", "stroke-dasharray");
    animateDash.setAttribute("values", "0, 188; 188, 0; 0, 188");
    animateDash.setAttribute("dur", "2s");
    animateDash.setAttribute("repeatCount", "0.5");

    // Fügen Sie das animateDash-Element zum Kreis hinzu
    circle.appendChild(animateDash);

    // Fügen Sie den Kreis zum SVG hinzu
    svg.appendChild(circle);

    // Gibt das SVG-Element zurück
    return svg;
}


function generateCrossSVG() {
    // Erstellen Sie ein SVG-Element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100");
    svg.setAttribute("height", "100");

    // Erstellen Sie die Linien des "X" im SVG
    const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line1.setAttribute("x1", "20");
    line1.setAttribute("y1", "20");
    line1.setAttribute("x2", "80");
    line1.setAttribute("y2", "80");
    line1.setAttribute("stroke", "yellow"); // Linienfarbe
    line1.setAttribute("stroke-width", "5"); // Linienbreite

    const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line2.setAttribute("x1", "20");
    line2.setAttribute("y1", "80");
    line2.setAttribute("x2", "80");
    line2.setAttribute("y2", "20");
    line2.setAttribute("stroke", "yellow"); // Linienfarbe
    line2.setAttribute("stroke-width", "3"); // Linienbreite

    // Erstellen Sie die Animation für das "X"
    const animate = document.createElementNS("http://www.w3.org/2000/svg", "animate");
    animate.setAttribute("attributeName", "stroke-opacity");
    animate.setAttribute("values", "1;0.5;2");
    animate.setAttribute("dur", "2s");
    animate.setAttribute("repeatCount", "1");

    // Fügen Sie die Animation zu beiden Linien hinzu
    line1.appendChild(animate);
    line2.appendChild(animate);

    // Fügen Sie die Linien zum SVG hinzu
    svg.appendChild(line1);
    svg.appendChild(line2);

    // Gibt das SVG-Element zurück
    return svg;
}

