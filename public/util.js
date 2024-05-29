import { collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

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

export async function submitTimeToFirestore(db, level, name, inviteCode, ipAddress) {
  try {
    await addDoc(collection(db, 'puzzleTimes'), {
      level: level,
      time: totalTime,
      name: name,
      inviteCode: inviteCode,
      ipAddress: ipAddress,
      timestamp: serverTimestamp()
    });
    console.log('Time submitted successfully!');
  } catch (error) {
    console.error('Error submitting time: ', error);
  }
}
