export default function generateRandomEventData(maxEventNameLength = 40, minDescriptionWords = 1, maxDescriptionWords = 9) {
  const eventName = generateRandomEventName(maxEventNameLength);
  const eventDescription = generateRandomEventDescription(minDescriptionWords, maxDescriptionWords);
  let e = generateRandomEventTime()
  const eventStartTime = e.startTime;
  const eventEndTime = e.endTime;
  const eventVenue = generateRandomEventVenue();
  const eventColor = generateRandomHSLColor();

  return {
    eventName,
    eventDescription,
    eventStartTime,
    eventEndTime,
    eventVenue,
    eventColor
  };
}

function generateRandomEventName(maxLength) {
  const prefixes = ["Annual", "Weekly", "Monthly", "Bi-Annual", "Charity", "Fundraiser", "Gala", "Networking", "Social", "Corporate"];
  const topics = ["Conference", "Workshop", "Seminar", "Meeting", "Retreat", "Concert", "Exhibition", "Webinar", "Panel Discussion", "Training Session"];
  const suffixes = ["2023", "2024", "Spring Edition", "Summer Edition", "Fall Edition", "Winter Edition", "Global", "Local", "Regional", "National"];
  const name = `${pickRandom(prefixes)} ${pickRandom(topics)} ${pickRandom(suffixes)}`.substring(0, maxLength);
  return name;
}

function generateRandomEventDescription(minWords, maxWords) {
  const descriptions = [
    "Join us for a day of networking and learning from industry leaders in a variety of fields.",
    "This is a can't-miss event for anyone interested in the latest trends and technologies in their field.",
    "Experience the best music, food, and drinks that the city has to offer while supporting a great cause.",
    "Our expert panelists will be discussing the challenges and opportunities facing our industry today.",
    "This event is designed to help you expand your network and build new relationships with fellow professionals.",
    "Come celebrate with us and enjoy an evening of entertainment, food, and drinks.",
    "Discover the latest products and services from leading vendors in your industry.",
    "Get a head start on your career by attending our training session with industry experts.",
    "This is a great opportunity to meet like-minded individuals and make valuable connections."
  ];

  const numWords = getRandomNumberBetween(minWords, maxWords);
  const selectedDescriptions = Array.from({ length: numWords }, () => pickRandom(descriptions));
  const description = selectedDescriptions.join(" ");
  return description;
}

// Rest of the code...


function generateRandomEventTime() {
  const startHours = getRandomNumberBetween(0, 23);
  const startMinutes = getRandomNumberBetween(0, 10);

  let endHours = getRandomNumberBetween(startHours, 23);
  let endMinutes;

  if (endHours === startHours) {
      endMinutes = getRandomNumberBetween(startMinutes + 1, 11);
  } else {
    endMinutes = getRandomNumberBetween(0, 11);
  }

  if (endHours === startHours && endMinutes - startMinutes == 0) {
    endMinutes = startMinutes + 1;
  }

  const startTime = padNumberWithZero(startHours, 2) + ':' + padNumberWithZero(startMinutes * 5, 2);
  const endTime = padNumberWithZero(endHours, 2) + ':' + padNumberWithZero(endMinutes * 5, 2);

  return {
    startTime,
    endTime
  }
}

function generateRandomEventVenue() {
  const venues = ["Convention Center", "Hotel Ballroom", "Outdoor Space", "Museum", "Art Gallery", "Restaurant", "Office Building", "Community Center", "Auditorium", "Theater"];
  const cityNames = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"];
  const venue = `${pickRandom(venues)} in ${pickRandom(cityNames)}`;
  return venue;
}

function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function padNumberWithZero(number, width) {
  return number.toString().padStart(width, '0');
}

// function getRandomColor() {
//   const colorList = generateColors(30, document.querySelector("body").classList.contains("dark") ? "#ffffff": "#280a28")  
  
//   let color = colorList[Math.floor(Math.random() * colorList.length)];

//   // check if color is same as last time, and choose a new one if it is
//   if (color === getRandomColor.lastColor) {
//     color = getRandomColor();
//   }

//   getRandomColor.lastColor = color;

//   return color;
// }

// function generateColors(numColors, desiredContrastColor) {
//   const colors = [];
//   for (let i = 0; i < numColors; i++) {
//     const color = generateRandomColor(desiredContrastColor);
//     colors.push(color);
//   }
//   return colors;
// }

// function generateRandomColor(desiredContrastColor) {
//   const contrastThreshold = 160; // Adjust this value as needed
//   let color;
//   do {
//     color = getRandomHexColor();
//   } while (!hasGoodContrast(color, desiredContrastColor, contrastThreshold));
//   return color;
// }

// function getRandomHexColor() {
//   const letters = "0123456789ABCDEF";
//   let color = "#";
//   for (let i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// }

// function hasGoodContrast(color, desiredContrastColor, contrastThreshold) {
//   const rgb1 = hexToRgb(color);
//   const rgb2 = hexToRgb(desiredContrastColor);
//   const brightness1 = calculateBrightness(rgb1.r, rgb1.g, rgb1.b);
//   const brightness2 = calculateBrightness(rgb2.r, rgb2.g, rgb2.b);
//   return Math.abs(brightness1 - brightness2) >= contrastThreshold;
// }

// function hexToRgb(hex) {
//   const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
//   hex = hex.replace(shorthandRegex, function (m, r, g, b) {
//     return r + r + g + g + b + b;
//   });

//   const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//   return result
//     ? {
//         r: parseInt(result[1], 16),
//         g: parseInt(result[2], 16),
//         b: parseInt(result[3], 16),
//       }
//     : null;
// }

// function calculateBrightness(r, g, b) {
//   return (r * 299 + g * 587 + b * 114) / 1000;
// }
// Generate a random HSL color with good contrast to a provided HSL color
// Generate a random HSL color with random hue and saturation values
function generateRandomHSLColor() {
  const h = getRandomHue();
  const s = getRandomSaturation();
  const l = 50; // Set a default lightness value (you can adjust this as needed)
  return { h, s, l };
}

// Generate a random hue value between 0 and 360
function getRandomHue() {
  return Math.floor(Math.random() * 361);
}

// Generate a random saturation value between 0 and 100
function getRandomSaturation() {
  return Math.floor(Math.random() * 101);
}



