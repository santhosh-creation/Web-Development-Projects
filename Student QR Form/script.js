// Tabs
const tabButtons = document.querySelectorAll('.tab');
const views = document.querySelectorAll('.view');
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    views.forEach(v => v.classList.remove('active'));
    btn.classList.add('active');
    const target = document.querySelector(btn.dataset.target);
    target.classList.add('active');
  });
});

// Form Handling
const form = document.getElementById('studentForm');
const resultSection = document.getElementById('result');
const qrcodeContainer = document.getElementById('qrcode');
const encodedTextEl = document.getElementById('encodedText');
const btnDownload = document.getElementById('btnDownload');
const btnReset = document.getElementById('btnReset');

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function collectData() {
  const fd = new FormData(form);
  const data = {
    fullName: fd.get('fullName')?.toString().trim(),
    registerNumber: fd.get('registerNumber')?.toString().trim(),
    gender: fd.get('gender')?.toString(),
    dob: formatDate(fd.get('dob')?.toString()),
    bloodGroup: fd.get('bloodGroup')?.toString(),
    nationality: fd.get('nationality')?.toString().trim(),
    mobile: fd.get('mobile')?.toString().trim(),
    altMobile: fd.get('altMobile')?.toString().trim(),
    email: fd.get('email')?.toString().trim(),
    address: fd.get('address')?.toString().trim(),
    city: fd.get('city')?.toString().trim(),
    state: fd.get('state')?.toString().trim(),
    pincode: fd.get('pincode')?.toString().trim(),
    department: fd.get('department')?.toString().trim(),
    course: fd.get('course')?.toString().trim(),
    year: fd.get('year')?.toString().trim(),
    rollNumber: fd.get('rollNumber')?.toString().trim(),
    college: fd.get('college')?.toString().trim(),
    fatherName: fd.get('fatherName')?.toString().trim(),
    fatherMobile: fd.get('fatherMobile')?.toString().trim(),
    motherName: fd.get('motherName')?.toString().trim(),
    motherMobile: fd.get('motherMobile')?.toString().trim(),
    guardianName: fd.get('guardianName')?.toString().trim(),
    guardianMobile: fd.get('guardianMobile')?.toString().trim(),
    aadhar: fd.get('aadhar')?.toString().trim(),
    emergencyName: fd.get('emergencyName')?.toString().trim(),
    emergencyMobile: fd.get('emergencyMobile')?.toString().trim(),
    notes: fd.get('notes')?.toString().trim(),
  };
  return data;
}

function toPrettyText(data) {
  const lines = [
    `Full Name: ${data.fullName || ''}`,
    `Register Number: ${data.registerNumber || ''}`,
    `Gender: ${data.gender || ''}`,
    `Mobile Number: ${data.mobile || ''}`,
    `Alternate Mobile: ${data.altMobile || ''}`,
    `Email Address: ${data.email || ''}`,
    `Address: ${data.address || ''}`,
    `City: ${data.city || ''}`,
    `State: ${data.state || ''}`,
    `Pincode: ${data.pincode || ''}`,
    `Department: ${data.department || ''}`,
    `Course / Degree: ${data.course || ''}`,
    `Year / Semester: ${data.year || ''}`,
    `Roll Number: ${data.rollNumber || ''}`,
    `College / Institution: ${data.college || ''}`,
    `Date of Birth: ${data.dob || ''}`,
    `Blood Group: ${data.bloodGroup || ''}`,
    `Nationality: ${data.nationality || ''}`,
    `Father's Name: ${data.fatherName || ''}`,
    `Father's Mobile: ${data.fatherMobile || ''}`,
    `Mother's Name: ${data.motherName || ''}`,
    `Mother's Mobile: ${data.motherMobile || ''}`,
    `Guardian Name: ${data.guardianName || ''}`,
    `Guardian Mobile: ${data.guardianMobile || ''}`,
    `Aadhar Number: ${data.aadhar || ''}`,
    `Emergency Contact: ${data.emergencyName || ''}`,
    `Emergency Mobile: ${data.emergencyMobile || ''}`,
    `Notes: ${data.notes || ''}`,
    `Developed by SANTHOSH_A`,
  ];
  return lines.join('\n');
}

function validateForm() {
  if (!form.checkValidity()) {
    form.reportValidity();
    return false;
  }
  return true;
}

function clearQRCode() {
  qrcodeContainer.innerHTML = '';
}

function downloadQRCode() {
  const img = qrcodeContainer.querySelector('img') || qrcodeContainer.querySelector('canvas');
  if (!img) return;
  const link = document.createElement('a');
  link.download = 'student-qr.png';
  link.href = img.tagName.toLowerCase() === 'canvas' ? img.toDataURL('image/png') : img.src;
  link.click();
}

btnDownload.addEventListener('click', downloadQRCode);
btnReset.addEventListener('click', () => {
  clearQRCode();
  encodedTextEl.textContent = '';
  resultSection.classList.add('hidden');
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  const data = collectData();
  const text = toPrettyText(data);
  encodedTextEl.textContent = text;
  clearQRCode();
  const qr = new QRCode(qrcodeContainer, {
    text,
    width: 256,
    height: 256,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.M,
  });
  // Reveal result
  resultSection.classList.remove('hidden');
  // Switch to Scan tab hint
});

// Scanner with password gate
const PASSWORD = '007124';
let html5QrCode = null;
let lastScannedText = '';
const readerEl = document.getElementById('qr-reader');
const btnStartScan = document.getElementById('btnStartScan');
const btnStopScan = document.getElementById('btnStopScan');
const pwdCard = document.getElementById('scanPassword');
const scanResult = document.getElementById('scanResult');
const scanText = document.getElementById('scanText');
const scanPwd = document.getElementById('scanPwd');
const btnVerifyPwd = document.getElementById('btnVerifyPwd');
const btnRetryScan = document.getElementById('btnRetryScan');
const pwdMsg = document.getElementById('pwdMsg');

async function startScanner() {
  try {
    if (!html5QrCode) {
      html5QrCode = new Html5Qrcode('qr-reader');
    }
    pwdCard.classList.add('hidden');
    scanResult.classList.add('hidden');
    pwdMsg.textContent = '';
    scanPwd.value = '';
    await html5QrCode.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: 280 },
      (decodedText) => {
        lastScannedText = decodedText;
        stopScanner();
        // Ask for password
        pwdCard.classList.remove('hidden');
      },
      (errMsg) => {
        // ignore per-frame errors
      }
    );
    btnStartScan.disabled = true;
    btnStopScan.disabled = false;
  } catch (err) {
    alert('Unable to start camera. Please allow camera permission or use a supported browser.');
    console.error(err);
  }
}

async function stopScanner() {
  if (html5QrCode && html5QrCode.isScanning) {
    await html5QrCode.stop();
    await html5QrCode.clear();
  }
  btnStartScan.disabled = false;
  btnStopScan.disabled = true;
}

btnStartScan.addEventListener('click', startScanner);
btnStopScan.addEventListener('click', stopScanner);

btnVerifyPwd.addEventListener('click', () => {
  if (scanPwd.value === PASSWORD) {
    pwdMsg.textContent = 'Access granted';
    scanText.textContent = lastScannedText || 'No data.';
    scanResult.classList.remove('hidden');
  } else {
    pwdMsg.textContent = 'Incorrect password. Try again.';
    scanResult.classList.add('hidden');
  }
});

btnRetryScan.addEventListener('click', () => {
  pwdCard.classList.add('hidden');
  startScanner();
});


