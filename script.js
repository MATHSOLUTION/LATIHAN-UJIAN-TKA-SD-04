// URL Web App Google Sheets Anda
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxpGgegPr1g6hfD7JUeZ56BnvQAEVeF2cRUfU-WRuqbVxMyevwbVnxwsG7ikluXOPWa3w/exec"; 

// Fungsi untuk menampilkan Custom Alert
function showAlert(text) {
    document.getElementById('alertMessage').innerText = text;
    document.getElementById('customAlert').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

// Fungsi untuk menutup Custom Alert
function closeAlert() {
    document.getElementById('customAlert').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

// Fitur Lihat/Sembunyikan Password (ikon mata)
document.getElementById('togglePasswordBtn').addEventListener('click', function() {
    const passwordInput = document.getElementById('student-password');
    const eyeIcon = document.getElementById('eyeIcon');
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.3" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />`;
    } else {
        passwordInput.type = "password";
        eyeIcon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.3" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.3" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        `;
    }
});

// Logika Proses Login Menggunakan Google Sheets
document.getElementById('btn-submit').addEventListener('click', function() {
    const inputName = document.getElementById('student-name').value.trim();
    const inputPassword = document.getElementById('student-password').value.trim();

    if (inputName === "" || inputPassword === "") {
        showAlert("Nama Siswa/NISN dan Password tidak boleh kosong!");
        return; 
    }

    document.getElementById('btn-submit').innerText = "MOHON TUNGGU SEJENAK";

    fetch(WEB_APP_URL, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify({ username: inputName, password: inputPassword })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            // Simpan Nama dan NISN dengan kunci yang berbeda dan benar
            sessionStorage.setItem('namaSiswaTerlogin', data.nama);
            sessionStorage.setItem('nisnSiswaTerlogin', data.nisn); // <--- Kunci NISN diubah menjadi nisnSiswaTerlogin
            
            // === TAMBAHAN BARU: Simpan ke localStorage agar bisa dibaca oleh fungsi Tombol TKA SMP ===
            localStorage.setItem('namaSiswaAktif', data.nama);
            localStorage.setItem('passwordSiswaAktif', inputPassword); // <--- Penting agar Apps Script bisa mencocokkan password di sheet ujian
            
            showAlert("Selamat datang, " + data.nama + "!");
            
            // Jeda sebentar sebelum pindah ke halaman menu
            setTimeout(() => {
                window.location.href = 'menu.html';
            }, 2000);
        } else {
            showAlert("Gagal Masuk!\n\nNama/NISN atau Password Salah. Periksa Kembali Data Kamu.");
        }
        document.getElementById('btn-submit').innerText = "KLIK UNTUK MASUK";
    })
    .catch(error => {
        showAlert("Terjadi kesalahan koneksi atau URL Web App belum benar.");
        document.getElementById('btn-submit').innerText = "KLIK UNTUK MASUK";
    });
});
