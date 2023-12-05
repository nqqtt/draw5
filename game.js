const gameContainer = document.querySelector('.game-container');
const dino = createDino();
const obstacles = [];

let isJumping = false;
let position = 0;

document.addEventListener('keydown', jump);

function createDino() {
  const dinoElement = document.createElement('div');
  dinoElement.classList.add('dino');
  gameContainer.appendChild(dinoElement);
  return dinoElement;
}

function jump(event) {
  if (event.code === 'Space' && !isJumping) {
    isJumping = true;

    const jumpInterval = setInterval(() => {
      if (position >= 230) {
        clearInterval(jumpInterval);

        const fallInterval = setInterval(() => {
          if (position === 0) {
            clearInterval(fallInterval);
            isJumping = false;
          } else {
            position -= 2;
            dino.style.bottom = position + 'px';
          }
        }, 7);
      } else {
        position += 2;
        dino.style.bottom = position + 'px';
      }
    }, 4);
  }
}

function createObstacle() {
  const obstacle = document.createElement('div');
  obstacle.classList.add('obstacle');
  gameContainer.appendChild(obstacle);
  obstacles.push(obstacle);

  let minDistance = 900; // Minimum distance between obstacles
  let obstaclePosition = window.innerWidth + Math.random() * minDistance;

  if (obstacles.length > 1) {
    const lastObstacle = obstacles[obstacles.length - 2];
    const lastObstaclePosition = parseInt(lastObstacle.style.left) || window.innerWidth;
    const distance = obstaclePosition - lastObstaclePosition;

    // Check if the distance between obstacles is less than the minimum distance
    if (distance < minDistance) {
      obstaclePosition = lastObstaclePosition + minDistance;
    }
  }

  obstacle.style.left = obstaclePosition + 'px';

  const obstacleInterval = setInterval(() => {
    if (obstaclePosition < -250) {
      clearInterval(obstacleInterval);
      obstacle.remove();
      obstacles.shift();
      createObstacle();
    } else {
      obstaclePosition -= 4;
      obstacle.style.left = obstaclePosition + 'px';

      if (
        obstaclePosition > dino.offsetLeft &&
        obstaclePosition < dino.offsetLeft + dino.offsetWidth &&
        position < obstacle.offsetHeight
      ) {
        alert('You died');
        clearInterval(obstacleInterval);
        location.reload();
      }
    }
  }, 15);
}

// Create fewer initial obstacles
createObstacle();
createObstacle();

// Create obstacles with increased random delay and minimum distance
function createRandomObstacle() {
  createObstacle();
  const randomDelay = Math.random() * 4000 + 2000; // Random delay between 2 and 6 seconds
  setTimeout(createRandomObstacle, randomDelay);
}

createRandomObstacle();
