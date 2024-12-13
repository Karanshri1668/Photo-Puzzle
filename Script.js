const photoInput = document.getElementById('photoInput');
const referenceImage = document.getElementById('referenceImage');
const puzzleContainer = document.getElementById('puzzleContainer');
const doneButton = document.getElementById('doneButton');

let originalImage = null;

photoInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      originalImage = e.target.result;
      referenceImage.innerHTML = `<img src="${originalImage}" alt="Reference" />`;
      generatePuzzle(originalImage);
    };
    reader.readAsDataURL(file);
  }
});

doneButton.addEventListener('click', () => {
  alert('Puzzle Completed!');
  puzzleContainer.style.gap = 0;
});

function generatePuzzle(imageSrc) {
  puzzleContainer.innerHTML = '';
  const pieces = [];
  for (let i = 0; i < 9; i++) {
    const piece = document.createElement('div');
    piece.classList.add('puzzle-piece');
    piece.style.backgroundImage = `url('${imageSrc}')`;
    piece.style.backgroundPosition = `${-(i % 3) * 130}px ${-Math.floor(i / 3) * 130}px`;
    piece.setAttribute('draggable', true);
    piece.dataset.index = i;
    pieces.push(piece);
  }

  // Shuffle the pieces
  pieces.sort(() => Math.random() - 0.5);

  pieces.forEach((piece) => {
    piece.addEventListener('dragstart', dragStart);
    piece.addEventListener('dragover', dragOver);
    piece.addEventListener('drop', drop);
    puzzleContainer.appendChild(piece);
  });
}

let draggedPiece = null;

function dragStart(event) {
  draggedPiece = event.target;
}

function dragOver(event) {
  event.preventDefault();
  event.target.classList.add('drag-over');
}

function drop(event) {
  event.preventDefault();
  event.target.classList.remove('drag-over');
  const targetPiece = event.target;

  if (targetPiece !== draggedPiece) {
    const draggedIndex = draggedPiece.dataset.index;
    const targetIndex = targetPiece.dataset.index;

    draggedPiece.dataset.index = targetIndex;
    targetPiece.dataset.index = draggedIndex;

    const draggedStyle = {
      backgroundImage: draggedPiece.style.backgroundImage,
      backgroundPosition: draggedPiece.style.backgroundPosition,
    };

    draggedPiece.style.backgroundImage = targetPiece.style.backgroundImage;
    draggedPiece.style.backgroundPosition = targetPiece.style.backgroundPosition;

    targetPiece.style.backgroundImage = draggedStyle.backgroundImage;
    targetPiece.style.backgroundPosition = draggedStyle.backgroundPosition;
  }
}