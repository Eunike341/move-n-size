import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';
import firebaseConfig from './firebaseConfig.js';

const inviteCode = 'MINGGU_BELAJAR';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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


