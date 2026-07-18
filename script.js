const scriptURL = 'https://script.google.com/macros/s/AKfycbyf0-zCMnH46hEEk0Sc33bQrQdDuPFbPRem6a2Lxfiv5JmjyqLv1MhyrPOzIALJCmOwtA/exec';
const form = document.forms['submit-to-google-sheet'];

form.addEventListener('submit', e => {
  e.preventDefault();
  
  // Menampilkan indikator loading atau pesan (opsional)
  const btnSubmit = document.getElementById('btn-submit');
  btnSubmit.innerHTML = "Mengirim...";
  btnSubmit.disabled = true;

  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
    .then(response => {
      // Jika berhasil
      document.getElementById('alert-success').style.display = 'block';
      form.reset();
      btnSubmit.innerHTML = "Kirim Konfirmasi";
      btnSubmit.disabled = false;
      console.log('Success!', response);
    })
    .catch(error => {
      // Jika gagal
      alert('Gagal mengirim data. Silakan coba lagi.');
      btnSubmit.innerHTML = "Kirim Konfirmasi";
      btnSubmit.disabled = false;
      console.error('Error!', error.message);
    });
});