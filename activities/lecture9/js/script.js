
document.addEventListener('DOMContentLoaded', function() {
    const inputFields = ['firstName', 'lastName', 'email'];

    for (let i = 0; i < inputFields.length; i++) {
        const inputField = document.getElementById(inputFields[i]);
    
        inputField.addEventListener('focus', function() {
            this.style.backgroundColor = '#ffeef5';
            this.style.borderColor = '#ff69b4';
        });

        inputField.addEventListener('blur', function() {
            this.style.backgroundColor = '';
            this.style.borderColor = '';
        });
    }
});
