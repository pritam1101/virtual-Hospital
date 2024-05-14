(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

  // =========================== Frequently ask question ================================
function toggleAnswer(id) {
  var answer = document.getElementById('answer' + id);
  answer.style.display = (answer.style.display === 'block') ? 'none' : 'block';
}

// ==========================search patient =========================================
function checkSymptoms() {
  const symptomsInput = document.getElementById('symptoms').value;

  const diagnosisContainer = document.getElementById('diagnosis');
  diagnosisContainer.innerHTML = `<h3>Diagnosis:</h3><p>${getSampleDiagnosis(symptomsInput)}</p>`;
}

function getSampleDiagnosis(symptoms) {
 
  if (symptoms.toLowerCase().includes('fever')) {
    return '1)Paracetamol. 2)Adnil';
  } 
  if (symptoms.toLowerCase().includes('headache')) {
    return '1)Panandol. 2)Aspirin';
  } 
  
  
  else if (symptoms.toLowerCase().includes('cough')) {
    return 'You may have a cough.';

    
  } else {
    return 'No specific diagnosis based on the provided symptoms. It is recommended to seek medical advice.';
  }



}

// ================== For Multi Lamguage Support =======================
     function loadGoogleTranslate(){
        new google.translate.TranslateElement({pageLanguage: 'en'}, "google_translate_element");  
     }
   