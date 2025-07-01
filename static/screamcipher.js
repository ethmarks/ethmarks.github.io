
document.addEventListener('DOMContentLoaded', () => {
    const plainToScream = { 'A': 'A', 'B': 'Ȧ', 'C': 'A̧', 'D': 'A̱', 'E': 'Á', 'F': 'A̮', 'G': 'A̋', 'H': 'A̰', 'I': 'Ả', 'J': 'A̓', 'K': 'Ạ', 'L': 'Ă', 'M': 'Ǎ', 'N': 'Â', 'O': 'Å', 'P': 'A̯', 'Q': 'A̤', 'R': 'Ȃ', 'S': 'Ã', 'T': 'Ā', 'U': 'Ä', 'V': 'À', 'W': 'Ȁ', 'X': 'A̽', 'Y': 'A̦', 'Z': 'Ⱥ' };
    const screamToPlain = Object.fromEntries(Object.entries(plainToScream).map(([k, v]) => [v, k]));

    // Memoized regex
    const screamCharsOnly = Object.keys(screamToPlain).filter(c => c !== 'A');
    const screamCharsRegex = new RegExp(`(${screamCharsOnly.join('|')})`);
    const allScreamCharsSorted = Object.keys(screamToPlain).sort((a, b) => b.length - a.length);
    const conversionRegex = new RegExp(allScreamCharsSorted.join('|'), 'g');
    const validatorTempRegex = new RegExp(allScreamCharsSorted.join('|'), 'g');

    // Icon SVGs
    const iconCopy = '<svg viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>';
    const iconCheck = '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>';

    // DOM Elements
    const textInput = document.getElementById('text-input');
    const outputDisplay = document.getElementById('output-display');
    const grid = document.getElementById('cipher-grid');
    const copyButton = document.getElementById('copy-button');
    const inputContentBox = textInput.closest('.content-box'); // Get the parent content-box

    // Set initial copy icon
    copyButton.innerHTML = iconCopy;

    // Modal setup
    const modals = {
        'error-modal': document.getElementById('error-modal'),
        'key-modal': document.getElementById('key-modal')
    };
    const openKeyModalBtn = document.getElementById('open-key-modal');
    const closeButtons = document.querySelectorAll('.close-button');

    const openModal = (id) => modals[id].style.display = 'block';
    const closeModal = (id) => modals[id].style.display = 'none';

    openKeyModalBtn.addEventListener('click', () => openModal('key-modal'));
    closeButtons.forEach(btn => btn.addEventListener('click', (event) => {
        closeModal(event.currentTarget.dataset.modal);
    }));
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target.id);
        }
    });

    const showError = (message) => {
        document.getElementById('error-message').textContent = message;
        openModal('error-modal');
    };

    const convert = () => {
        const inputText = textInput.value;
        if (!inputText) {
            outputDisplay.textContent = '';
            return;
        }
        const isDecryptMode = screamCharsRegex.test(inputText);
        try {
            let result;
            if (isDecryptMode) {
                const tempText = inputText.replace(validatorTempRegex, '');
                if (!/^[\x00-\x7F]*$/.test(tempText)) {
                    throw new Error("Invalid Unicode characters found in ciphertext. Only Scream Cipher characters and standard ASCII are permitted.");
                }
                result = inputText.replace(conversionRegex, match => screamToPlain[match]);
            } else {
                if (!/^[\x00-\x7F]*$/.test(inputText)) {
                    throw new Error("Invalid characters detected for plaintext. Please use only standard ASCII letters, numbers, and punctuation.");
                }
                result = inputText.replace(/[a-zA-Z]/g, char => plainToScream[char.toUpperCase()]);
            }
            outputDisplay.textContent = result;
        } catch (e) {
            showError(e.message);
            outputDisplay.textContent = '';
        }
    };

    const populateGrid = () => {
        const sortedPlain = Object.keys(plainToScream).sort();
        sortedPlain.forEach(letter => {
            const screamChar = plainToScream[letter];
            const pairDiv = document.createElement('div');
            pairDiv.className = 'cipher-pair';
            pairDiv.innerHTML = `${letter} <span class="arrow">→</span> <span class="cipher-char">${screamChar}</span>`;
            grid.appendChild(pairDiv);
        });
    };

    const handleCopy = () => {
        const textToCopy = outputDisplay.textContent;
        if (!textToCopy || copyButton.innerHTML === iconCheck) return;

        navigator.clipboard.writeText(textToCopy).then(() => {
            copyButton.innerHTML = iconCheck;
            setTimeout(() => {
                copyButton.innerHTML = iconCopy;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy text to clipboard. Please try manually.');
        });
    };

    // Event listeners
    textInput.addEventListener('input', convert);
    copyButton.addEventListener('click', handleCopy);
    populateGrid();

    // Handle focus/blur for textarea to apply class to parent
    textInput.addEventListener('focus', () => {
        inputContentBox.classList.add('is-focused');
    });
    textInput.addEventListener('blur', () => {
        inputContentBox.classList.remove('is-focused');
    });
});