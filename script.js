const scriptURL = 'https://script.google.com/macros/s/AKfycbyBzKbpsiNoEB5VOCeUEIvFFpnL8z074513XhOoFbAqvBPyVH2MveymXb_SeHlISg8a4A/exec';
const form = document.forms['submit-to-google-sheet'];

// Variabel untuk menyimpan data secara instan di memori website
let dataStatistikLokal = null;

// Trik utama: Ambil data langsung di background saat halaman baru selesai dimuat
window.addEventListener('DOMContentLoaded', () => {
  fetch(scriptURL)
    .then(response => response.json())
    .then(data => {
      dataStatistikLokal = data; // Simpan data di latar belakang
    })
    .catch(error => console.error("Gagal mencuri data awal:", error));
});

// Logika Pengiriman Form RSVP
form.addEventListener('submit', e => {
  e.preventDefault();
  
  const btnSubmit = document.getElementById('btn-submit');
  btnSubmit.innerHTML = "Mengirim...";
  btnSubmit.disabled = true;

  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
    .then(response => {
      document.getElementById('alert-success').style.display = 'block';
      form.reset();
      btnSubmit.innerHTML = "Kirim Konfirmasi";
      btnSubmit.disabled = false;
      
      // Ambil data baru lagi di background agar statistik langsung terupdate otomatis
      fetch(scriptURL).then(res => res.json()).then(data => dataStatistikLokal = data);

      setTimeout(() => {
        document.getElementById('alert-success').style.display = 'none';
      }, 5000);
    })
    .catch(error => {
      alert('Gagal mengirim data. Silakan coba lagi.');
      btnSubmit.innerHTML = "Kirim Konfirmasi";
      btnSubmit.disabled = false;
      console.error('Error!', error.message);
    });
});

// Logika Buka Tutup Statistik (Sekarang Super Instan!)
async function toggleStats() {
    const box = document.getElementById('stats-box');
    const btn = document.querySelector('.btn-stats');
    
    if (box.style.display === 'none') {
        box.style.display = 'block';
        btn.innerHTML = "Menutup Statistik...";
        
        // JIKA data di background sudah siap, langsung tampilkan detik itu juga (0 delay)
        if (dataStatistikLokal) {
            document.getElementById('count-peserta').innerText = dataStatistikLokal.peserta;
            document.getElementById('count-anggota').innerText = dataStatistikLokal.anggota;
            btn.innerHTML = "📊 Lihat Statistik Peserta";
        } else {
            // Cadangan aman: Jika user super cepat nge-klik sebelum data background siap
            document.getElementById('count-peserta').innerText = "Memuat...";
            document.getElementById('count-anggota').innerText = "Memuat...";
            try {
                const response = await fetch(scriptURL);
                dataStatistikLokal = await response.json();
                document.getElementById('count-peserta').innerText = dataStatistikLokal.peserta;
                document.getElementById('count-anggota').innerText = dataStatistikLokal.anggota;
                btn.innerHTML = "📊 Lihat Statistik Peserta";
            } catch (error) {
                btn.innerHTML = "Gagal memuat data";
            }
        }
    } else {
        box.style.display = 'none';
        btn.innerHTML = "📊 Lihat Statistik Peserta";
    }
}
