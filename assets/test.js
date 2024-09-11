const gridSize = {
    3: 3,
    4: 4,
    5: 5
};

let currentGridSize = 3; // domyślny rozmiar siatki

// Funkcja mapująca ID kropek na indeksy w siatce
function getDotIndex(dotId) {
    return parseInt(dotId.substring(1), 10) - 1;
}

// Funkcja mapująca indeksy w siatce na ID kropek
function getDotId(index) {
    return `n${index + 1}`;
}

// Funkcja obracająca pozycje kropek
function rotatePositions(indices, degree) {
    const newIndices = indices.map(index => {
        const row = Math.floor(index / currentGridSize);
        const col = index % currentGridSize;

        let newRow, newCol;

        switch (degree) {
            case 90:
                newRow = col;
                newCol = currentGridSize - 1 - row;
                break;
            case -90:
                newRow = currentGridSize - 1 - col;
                newCol = row;
                break;
            case 180:
                newRow = currentGridSize - 1 - row;
                newCol = currentGridSize - 1 - col;
                break;
            default:
                newRow = row;
                newCol = col;
                break;
        }

        return newRow * currentGridSize + newCol;
    });

    return newIndices;
}

// Funkcja obracająca zaznaczone kropki
function rotateDots(degree) {
    const activeDots = Array.from(document.querySelectorAll('.dot.is-active'));
    const activeIndices = activeDots.map(dot => getDotIndex(dot.id));

    const newIndices = rotatePositions(activeIndices, degree);

    resetDots();

    newIndices.forEach(index => {
        document.getElementById(getDotId(index)).classList.add('is-active');
    });
}

function rotateRight() {
    rotateDots(90);
}

function rotateLeft() {
    rotateDots(-90);
}

function rotate180() {
    rotateDots(180);
}

function flipVertical() {
    const activeDots = Array.from(document.querySelectorAll('.dot.is-active'));
    const activeIndices = activeDots.map(dot => getDotIndex(dot.id));

    const newIndices = activeIndices.map(index => {
        const row = Math.floor(index / currentGridSize);
        const col = index % currentGridSize;
        const newRow = currentGridSize - 1 - row;
        return newRow * currentGridSize + col;
    });

    resetDots();

    newIndices.forEach(index => {
        document.getElementById(getDotId(index)).classList.add('is-active');
    });
}

function flipHorizontal() {
    const activeDots = Array.from(document.querySelectorAll('.dot.is-active'));
    const activeIndices = activeDots.map(dot => getDotIndex(dot.id));

    const newIndices = activeIndices.map(index => {
        const row = Math.floor(index / currentGridSize);
        const col = index % currentGridSize;
        const newCol = currentGridSize - 1 - col;
        return row * currentGridSize + newCol;
    });

    resetDots();

    newIndices.forEach(index => {
        document.getElementById(getDotId(index)).classList.add('is-active');
    });
}

function move(direction, step) {
    const activeDots = Array.from(document.querySelectorAll('.dot.is-active'));
    const activeIndices = activeDots.map(dot => getDotIndex(dot.id));

    const newIndices = activeIndices.map(index => {
        let row = Math.floor(index / currentGridSize);
        let col = index % currentGridSize;

        switch (direction) {
            case 'up':
                row = Math.max(0, row - step);
                break;
            case 'down':
                row = Math.min(currentGridSize - 1, row + step);
                break;
            case 'left':
                col = Math.max(0, col - step);
                break;
            case 'right':
                col = Math.min(currentGridSize - 1, col + step);
                break;
        }

        return row * currentGridSize + col;
    });

    resetDots();

    newIndices.forEach(index => {
        document.getElementById(getDotId(index)).classList.add('is-active');
    });
}

// Funkcja resetująca zaznaczenia
function resetDots() {
    dots.forEach(dot => {
        dot.classList.remove('is-active');
    });
}

// Funkcja zmieniająca rozmiar siatki
function setGridSize(size) {
    currentGridSize = gridSize[size];
    document.querySelector('.stone').style.width = `${currentGridSize * 70}px`;
    document.querySelector('.stone').style.height = `${currentGridSize * 70}px`;

    dots.forEach(dot => {
        dot.style.display = 'none';
    });

    for (let i = 0; i < size * size; i++) {
        const dot = document.getElementById(getDotId(i));
        if (dot) {
            dot.style.display = 'block';
        }
    }

    resetDots();
}

// Podpięcie eventów do kropek
dots.forEach(dot => {
    dot.addEventListener('click', () => {
        dot.classList.toggle('is-active');
    });
});

        document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.button').addEventListener('click', resetDots);

    document.querySelector('[data-action="grid-3"]').addEventListener('click', () => setGridSize(3));
    document.querySelector('[data-action="grid-4"]').addEventListener('click', () => setGridSize(4));
    document.querySelector('[data-action="grid-5"]').addEventListener('click', () => setGridSize(5));

    document.querySelector('[data-action="rotate-right"]').addEventListener('click', rotateRight);
    document.querySelector('[data-action="rotate-left"]').addEventListener('click', rotateLeft);
    document.querySelector('[data-action="rotate-180"]').addEventListener('click', rotate180);

    document.querySelector('[data-action="flip-vertical"]').addEventListener('click', flipVertical);
    document.querySelector('[data-action="flip-horizontal"]').addEventListener('click', flipHorizontal);

    document.querySelector('[data-action="move-down-1"]').addEventListener('click', () => move('down', 1));
    document.querySelector('[data-action="move-up-1"]').addEventListener('click', () => move('up', 1));
    document.querySelector('[data-action="move-left-1"]').addEventListener('click', () => move('left', 1));
    document.querySelector('[data-action="move-right-1"]').addEventListener('click', () => move('right', 1));

    document.querySelector('[data-action="move-down-2"]').addEventListener('click', () => move('down', 2));
    document.querySelector('[data-action="move-up-2"]').addEventListener('click', () => move('up', 2));
    document.querySelector('[data-action="move-left-2"]').addEventListener('click', () => move('left', 2));
    document.querySelector('[data-action="move-right-2"]').addEventListener('click', () => move('right', 2));
});