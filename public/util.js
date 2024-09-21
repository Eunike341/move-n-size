import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';
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
  //console.log("values level:" + level + ", name:" + name + ", score:" + JSON.stringify(score) + ", playType:" + playType);
  name = name.toUpperCase();
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
    val = val.toUpperCase();
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
    const headers = ['Name', 'Type', 'Level', 'Score', 'Date'];
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
      const timestamp = data.timestamp;
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


export async function calculateUserScores(selectedDate) {
  try {
    console.log("====received selectedDate:" + selectedDate);
    const day = selectedDate;
    day.setHours(0, 0, 0, 0); // Start of day
    const startOfDay = day.getTime();

    day.setHours(23, 59, 59, 999); // End of day
    const endOfDay = day.getTime();

    console.log("===startdate:" + startOfDay+", enddate:" + endOfDay);

    const q = query(collection(db, inviteCode),
        where("timestamp", ">=", new Date(startOfDay)),
        where("timestamp", "<=", new Date(endOfDay)));

    const querySnapshot = await getDocs(q);

    const data = {};
    querySnapshot.forEach((doc) => {
      const entry = doc.data();
      const userName = entry.name;
      if (!data[userName]) {
         data[userName] = [];
      }
      data[userName].push(entry);
    });

    const PLACEMENT_MULTIPLIER = 1;
    const CLICK_LEVEL_CAP = 4;
    const PLACEMENT_LEVEL_CAP = 5;
    const users = {};

    // Group data by user
    Object.keys(data).forEach(userName => {
        const userEntries = data[userName];
        const groupedScores = { clicks: {}, placement: {}, typing: {} };

        // Group scores by playType and level for each user
        userEntries.forEach(entry => {
            const key = `${entry.playType}_${entry.level}`;
            if (!groupedScores[entry.playType][key]) {
                groupedScores[entry.playType][key] = [];
            }

            let score = 0;
            if (entry.playType === "clicks") {
                if (entry.score.clicked !== undefined) {
                    score = entry.score.clicked;
                } else if (entry.score.left !== undefined && entry.score.right !== undefined && entry.score.missed !== undefined) {
                    score = entry.score.left + entry.score.right - (entry.score.missed / 4);
                }
            } else if (entry.playType === "placement" && entry.score.time !== undefined) {
                let divider = 1000;
                if (entry.level == 3) {
                    divider = 1500;
                } else if (entry.level > 3) {
                    divider = 3500;
                }
                score = divider / entry.score.time;
                score *= PLACEMENT_MULTIPLIER;
            } else if (entry.playType === "typing") {
                if (entry.score.typing !== undefined) {
                    score = entry.score.typing/ 30 * 600;
                } else if (entry.score.time !== undefined) {
                    score = 30 / entry.score.time * 400;
                }

            }

            groupedScores[entry.playType][key].push(score);
        });

        let totalClicksScore = 0;
        let totalClicksWeight = 0;
        let totalPlacementScore = 0;
        let totalPlacementWeight = 0;
        let totalTypingScore = 0;
        let totalTypingWeight = 0;

        // Calculate average score for each group and apply weighting by level for each user
        Object.keys(groupedScores.clicks).forEach(key => {
            const scores = groupedScores.clicks[key];
            //const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
            const useScore = Math.max(...scores);
            const level = parseInt(key.split('_')[1], 10);

            if (level <= CLICK_LEVEL_CAP) {
                totalClicksScore += useScore * level;
                totalClicksWeight += level;
            }
        });

        Object.keys(groupedScores.placement).forEach(key => {
            const scores = groupedScores.placement[key];
            //const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
            const useScore = Math.max(...scores);
            const level = parseInt(key.split('_')[1], 10);

            if (level <= PLACEMENT_LEVEL_CAP) {
                totalPlacementScore += useScore * level;
                totalPlacementWeight += level;
            }
        });

        Object.keys(groupedScores.typing).forEach(key => {
            const scores = groupedScores.typing[key];
            //const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
            const useScore = Math.max(...scores);
            const level = parseInt(key.split('_')[1], 10);

            if (level <= 3) {
                totalTypingScore += useScore ;
                totalTypingWeight += level;
            }
        });

        // Calculate final scores without normalization
        const finalClicksScore = totalClicksWeight > 0 ? totalClicksScore : 0;
        const finalPlacementScore = totalPlacementWeight > 0 ? totalPlacementScore : 0;
        const finalTypingScore = totalTypingWeight > 0 ? totalTypingScore : 0;

        // Combine scores if desired, or keep them separate for different analysis
        users[userName] = {
            totalScore: finalClicksScore + finalPlacementScore + finalTypingScore,
            clicksScore: finalClicksScore,
            placementScore: finalPlacementScore,
            typingScore: finalTypingScore
        };
    });

    // Convert the users object to an array and sort it by score in descending order
    const sortedUsers = Object.entries(users)
        .map(([name, score]) => ({ name, score }))
        .sort((a, b) => b.score.totalScore - a.score.totalScore);

    return sortedUsers;
  } catch (error) {
    console.error('Error calculating overall score:', error);
  }
}



