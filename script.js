document.addEventListener("DOMContentLoaded", function () {
    document.body.classList.add("loaded");
});

function buttonCatatan() {
    const bukaCatatan = document.getElementById('catatanPesanan');
    bukaCatatan.classList.toggle('bukac');
}

function openKeranjang() {
    const bukaKeranjang = document.querySelector('.form-cart');
    bukaKeranjang.classList.add('bukaf');
}

function closeForm(event) {
    event.preventDefault();
    const tutupKeranjang = document.querySelector('.form-cart');
    tutupKeranjang.classList.remove('bukaf');
}

function itemUkuran(btukuran) {
    const pemilihanUkuran = document.getElementById("pemiliHanukuran");
    pemilihanUkuran.value = btukuran;
}

let count = 0;
const numberElement = document.getElementById("angka");

function tambahAngka() {
    count += 1;
    numberElement.textContent = count;
    updateTotalHarga();
}

function kurangAngka() {
    if (count > 0) {
        count -= 1;
        numberElement.textContent = count;
        updateTotalHarga();
    }
}

function updateTotalHarga() {
    const hargaPerItem = parseFloat(document.querySelector('.InputhargaPesanan').value);
    const jumlahPesanan = count;
    const totalHarga = hargaPerItem * jumlahPesanan;
    document.getElementById("totalHargaInput").value = totalHarga;
}

function showConfirmation(nama, harga, imgSrc) {
    const bukaKonfirmasi = document.querySelector('.showconfirmation');
    const namaPesananInput = bukaKonfirmasi.querySelector('.InputnamaPesanan');
    const hargaPesananInput = bukaKonfirmasi.querySelector('.InputhargaPesanan');
    const fotoPesanan = bukaKonfirmasi.querySelector('#foto-pesanan');

    document.getElementById("pemiliHanukuran").value = "";
    count = 0;
    document.getElementById("angka").textContent = count;
    updateTotalHarga();

    namaPesananInput.value = nama;
    hargaPesananInput.value = harga;
    fotoPesanan.src = imgSrc;
    bukaKonfirmasi.classList.add('buka');
}

function closeConfirmation() {
    const tutupKonfirmasi = document.querySelector('.showconfirmation');
    tutupKonfirmasi.classList.remove('buka');
}

document.querySelector('.btreset').addEventListener('click', function () {
    document.getElementById("pemiliHanukuran").value = "";
    count = 0;
    document.getElementById("angka").textContent = count;
    document.getElementById("totalHargaInput").value = count;
    updateTotalSemuaHarga();
});


let cartCount = 0;

function tambahPesananKeDataPesanan() {
    const namaPesanan = document.querySelector('.InputnamaPesanan').value;
    const ukuranPesanan = document.getElementById("pemiliHanukuran").value;
    const jumlahPesanan = parseInt(document.getElementById("angka").textContent);
    const totalHarga = parseInt(document.getElementById("totalHargaInput").value);

    const newItem = document.createElement("li");
    newItem.textContent = `${namaPesanan} (${ukuranPesanan}) x ${jumlahPesanan} = Rp ${totalHarga}`;

    const removeButton = document.createElement("button");

    removeButton.style.backgroundColor = "red";
    removeButton.style.border = "none";
    removeButton.style.width = "30px";
    removeButton.style.height = "30px";
    removeButton.style.color = "white";
    removeButton.style.position = "relative";
    removeButton.style.fontSize = "1rem";
    removeButton.style.textAlign = "center";
    removeButton.style.borderRadius = "50%";
    removeButton.style.display = "flex";
    removeButton.style.justifyContent = "center";
    removeButton.style.alignItems = "center";

    removeButton.classList.add("fa-solid", "fa-xmark");
    removeButton.onclick = function () {
        hapusPesanan(newItem, newItem.textContent);
    };
    newItem.appendChild(removeButton);

    const listPesanan = document.getElementById("list-pesanan");
    listPesanan.appendChild(newItem);

    const dataPesananTextarea = document.getElementById("dataPesanan");
    dataPesananTextarea.value += `${namaPesanan} (${ukuranPesanan}) x ${jumlahPesanan}\n`;

    updateTotalSemuaHarga();

    document.getElementById("pemiliHanukuran").value = "";
    document.getElementById("angka").textContent = 0;
    document.getElementById("totalHargaInput").value = 0;

    tambahNotifikasiKeranjang();
    closeConfirmation();
}

function tambahNotifikasiKeranjang() {
    cartCount++;
    const NotifikasiKeranjang = document.getElementById('cart-notification');
    NotifikasiKeranjang.textContent = cartCount;
}

function hapusPesanan(liElement, pesananText) {
    const listPesanan = document.getElementById("list-pesanan");
    const dataPesananTextarea = document.getElementById("dataPesanan");
    const totalHargaInput = document.getElementById("semua-total-harga");

    listPesanan.removeChild(liElement);
    const pesananToRemove = pesananText.trim().split(" = Rp")[0];
    const pesananArray = dataPesananTextarea.value.split("\n");
    const newDataPesanan = pesananArray.filter(pesanan => pesanan !== pesananToRemove).join("\n");
    dataPesananTextarea.value = newDataPesanan;

    cartCount--;
    const NotifikasiKeranjang = document.getElementById("cart-notification");
    NotifikasiKeranjang.textContent = cartCount;

    updateTotalSemuaHarga();
}

function removeAll() {
    const dataPesananTextarea = document.getElementById("dataPesanan");
    dataPesananTextarea.value = "";
    cartCount = 0;
    const cartNotification = document.getElementById('cart-notification');
    cartNotification.textContent = cartCount;

    const listPesanan = document.getElementById('list-pesanan');
    while (listPesanan.firstChild) {
        listPesanan.removeChild(listPesanan.firstChild);
    }
}


function updateTotalSemuaHarga() {
    let totalSemuaHarga = 0;
    const listPesanan = document.querySelectorAll("#list-pesanan li");
    listPesanan.forEach(function (item) {
        const harga = parseInt(item.textContent.split("=")[1].trim().substring(3));
        totalSemuaHarga += harga;
    });

    document.getElementById("semua-total-harga").value = totalSemuaHarga;
}

const scriptURL = 'https://script.google.com/macros/s/AKfycbznLV46vcaHFz_odo7vfrZt_SbggTrfRHwesOQ9ZilLUDYfabPp4J48oZBA-x9W67B1AQ/exec'
const form = document.forms['FormCart-belanja']

form.addEventListener('submit', e => {
    e.preventDefault()

    const dataPesananTextarea = document.getElementById("dataPesanan");
    if (dataPesananTextarea.value.trim() === '') {
        document.querySelector('.alert').style.display = 'grid';
        return false; 
    }

    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
        .then(response => {

            cartCount = 0;
            const NotifikasiKeranjang = document.getElementById('cart-notification');
            NotifikasiKeranjang.textContent = cartCount;

            const listPesanan = document.getElementById('list-pesanan');
            while (listPesanan.firstChild) {
                listPesanan.removeChild(listPesanan.firstChild);
            }

            document.getElementById("Popup").style.display = "grid";
            form.reset();
        })
        .catch(error => console.error('Error!', error.message))
});

document.querySelector(".back-home").onclick = function () {
    document.getElementById("Popup").style.display = "none";
};

document.getElementById("button-alert").onclick = function () {
    document.querySelector('.alert').style.display = 'none';
};