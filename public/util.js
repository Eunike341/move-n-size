import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";
import firebaseConfig from './firebaseConfig.js';

const allowedExtensions = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'webp'];
const inviteCode = 'MINGGU_BELAJAR';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

let startTime, intervalId, totalTime;

export function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

export function startTimer() {
  startTime = new Date();
  intervalId = setInterval(updateTimer, 1000);
}

export function updateTimer() {
  const currentTime = new Date();
  const elapsedTime = Math.floor((currentTime - startTime) / 1000);
  document.getElementById('timer').textContent = `Time: ${elapsedTime}s`;
}

export function stopTimer() {
  const currentTime = new Date();
  totalTime = Math.floor((currentTime - startTime) / 1000);
  clearInterval(intervalId);
  document.getElementById('celebration').style.display = 'inline';
}

async function fetchIpAddress() {
  let ipAddress = '0.0.0.0';
  try {
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    if (!ipResponse.ok) {
      throw new Error('Failed to fetch IP address');
    }
    const ipData = await ipResponse.json();
    ipAddress = ipData.ip;
  } catch (error) {
    console.error('Error fetching IP address:', error);
  }
  return ipAddress;
}


export async function submitTimeToFirestore(level, name, playType) {
  await submitScoreToFirestore(level, name, {'time':totalTime}, playType);
}

export async function submitScoreToFirestore(level, name, score, playType) {
  const ipAddress = await fetchIpAddress();
  try {
    await addDoc(collection(db, inviteCode), {
      level,
      name,
      inviteCode,
      ipAddress,
      timestamp: serverTimestamp(),
      playType,
      score
    });
    console.log('Score submitted successfully!');
  } catch (error) {
    console.error('Error submitting score: ', error);
  }
}

export async function queryAndDisplayData(val, dataContainer) {
  try {
    // Get the start and end of today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const startOfDay = today.getTime();

    today.setHours(23, 59, 59, 999); // End of today
    const endOfDay = today.getTime();

    const q = query(collection(db, inviteCode), where("name", "==", val),
        where("timestamp", ">=", new Date(startOfDay)),
        where("timestamp", "<=", new Date(endOfDay)));

    const querySnapshot = await getDocs(q);

    dataContainer.innerHTML = ''; // Clear previous results

    if (querySnapshot.empty) {
      const noResults = document.createElement('div');
      noResults.textContent = 'No results found';
      dataContainer.appendChild(noResults);
      return;
    }

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const headerRow = document.createElement('tr');

    // Create table headers
    const headers = ['Name', 'Type', 'Level', 'Score', 'Date']; // Add your desired fields here
    headers.forEach(headerText => {
      const th = document.createElement('th');
      th.textContent = headerText;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Populate table rows
    querySnapshot.forEach((doc) => {
      const row = document.createElement('tr');
      const data = doc.data();

      // Add a cell for each field
      const nameCell = document.createElement('td');
      nameCell.textContent = data.name;
      row.appendChild(nameCell);

      const typeCell = document.createElement('td');
      typeCell.textContent = data.playType;
      row.appendChild(typeCell);

      const levelCell = document.createElement('td');
      levelCell.textContent = data.level;
      row.appendChild(levelCell);

      const scoreCell = document.createElement('td');
      scoreCell.innerHTML = '';
      const nestedData = data.score;
      for (const [key, value] of Object.entries(nestedData)) {
        const nestedItem = document.createElement('div');
        nestedItem.textContent = `${key}: ${value}`;
        scoreCell.appendChild(nestedItem);
      }
      row.appendChild(scoreCell);

      const dateCell = document.createElement('td');
      const timestamp = data.timestamp; // Replace 'timestamp' with your actual timestamp field name
      if (timestamp) {
          const date = timestamp.toDate(); // Convert Firestore timestamp to JavaScript Date
          const formattedDate = date.toLocaleDateString(); // Format date to locale date string
          dateCell.textContent = formattedDate;
      } else {
          dateCell.textContent = 'N/A';
      }
      row.appendChild(dateCell);

      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    dataContainer.appendChild(table);
  } catch (error) {
    console.error('Error getting documents: ', error);
  }
}

export async function uploadFile (fileSource, fileCreator, dataContainer) {
    if (!fileSource || !fileCreator) {
        dataContainer.innerText = 'Please provide a file and a name.';
        return;
    }
    const fileExtension = fileSource.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
        dataContainer.innerText = 'Invalid file type. Please upload a Word, Excel, PPT, or PDF file.';
        return;
    }

    try {
        const storageRef = ref(storage, `uploads/${fileSource.name}`);
        const uploadTask = uploadBytesResumable(storageRef, fileSource);

        uploadTask.on('state_changed',
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
          },
          (error) => {
            console.error('Upload failed', error);
            dataContainer.innerText = 'Upload failed.';
          },
          async () => {
            // Handle successful uploads on complete
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            await addDoc(collection(db, inviteCode+'_UPLOAD'), {
                  inviteCode,
                  fileName: uploadTask.snapshot.ref.name,
                  fileCreator: fileCreator,
                  fileURL: downloadURL,
                  timestamp: serverTimestamp()
                });

            dataContainer.innerText = 'Upload successful!';
          }
        );
      } catch (error) {
        console.error('Error uploading file:', error);
        dataContainer.innerText = 'Error uploading file.';
      }
}


