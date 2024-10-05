const dropZone = document.getElementById('drop-zone') as HTMLDivElement;
const fileInput = document.getElementById('fileInput') as HTMLInputElement;
const filePreview = document.getElementById('file-preview') as HTMLDivElement;

// Stocker les fichiers sélectionnés
let selectedFiles: File[] = [];

// Gérer le clic pour ouvrir l'explorateur de fichiers
dropZone.addEventListener('click', () => fileInput.click());

// Gérer les fichiers sélectionnés via l'explorateur
fileInput.addEventListener('change', (event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files) {
        return;
    }
    addFiles(input.files);
});

// Empêcher le comportement par défaut lors du glisser-déposer
dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropZone.style.backgroundColor = '#f0f0f0'; // Changer la couleur pour indiquer un survol
});

dropZone.addEventListener('dragleave', () => {
    dropZone.style.backgroundColor = '#fff'; // Remettre la couleur de fond d'origine
});

// Gérer le dépôt des fichiers
dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.style.backgroundColor = '#fff'; // Remettre la couleur de fond d'origine
    const dataTransfer = event.dataTransfer;
    if (!dataTransfer) {
        return;
    }
    addFiles(dataTransfer.files);
});

// Fonction pour gérer et afficher les fichiers
function addFiles(files: FileList) {
    // Ajouter les fichiers sélectionnés aux fichiers existants
    selectedFiles = [...selectedFiles, ...Array.from(files as FileList)];
    
    // Réinitialiser l'aperçu des fichiers
    filePreview.innerHTML = '';

    // Afficher tous les fichiers sélectionnés
    selectedFiles.forEach((file, index) => {
        const fileElement = document.createElement('div');
        fileElement.textContent = `${index + 1}: ${file.name}`;
        filePreview.appendChild(fileElement);
    });

    // Créer un nouvel objet `DataTransfer` pour assigner tous les fichiers à l'input
    const dataTransfer = new DataTransfer();
    selectedFiles.forEach(file => dataTransfer.items.add(file));

    // Assigner les fichiers au champ input pour qu'ils soient envoyés avec le formulaire
    fileInput.files = dataTransfer.files;
}