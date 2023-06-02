export default function generateRandomEventData(maxEventNameLength = 40, minDescriptionWords = 1, maxDescriptionWords = 9) {
  const eventName = generateRandomEventName(maxEventNameLength);
  const eventDescription = generateRandomEventDescription(minDescriptionWords, maxDescriptionWords);
  let e = generateRandomEventTime()
  const eventStartTime = e.startTime;
  const eventEndTime = e.endTime;
  const eventVenue = generateRandomEventVenue();
  const eventColor = getRandomColor();

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

function getRandomColor() {
  // const colorList = [
  //   '#FF595E', '#FFCA3A', '#8AC926', '#1982C4', '#6A4C93', '#FFD3B5', '#F4D35E', '#EE964B', '#F95738', '#665191',
  //   '#A05195', '#D45087', '#F95D6A', '#FF7C43', '#FFB627', '#52BA96', '#2B580C', '#3E1F47', '#6930C3', '#5E60CE',
  //   '#C3423F', '#A77B7E', '#EAE2B7', '#3A405A', '#2E1114', '#7DCEA0', '#DA627D', '#9C9B7A', '#9C89B8', '#4A47A3',
  //   '#52616B', '#C5D86D', '#8CD790', '#7ED9C3', '#FCB9AA', '#FFABAB', '#B2B2B2', '#FDFD97', '#FE6D73', '#FE9C8F',
  //   '#FEB2A4', '#FED4C8', '#CCF5AC', '#AFDCEC', '#90ABE6', '#8E7CC3', '#E1CCE3', '#C4B0CB', '#FFE9A3', '#F8D5A3'
  // ];
  // const colorList = [
  //   "#FDD835", "#00897B", "#FF5722", "#673AB7", "#F44336", "#4CAF50", "#03A9F4", "#FFEB3B", "#9C27B0", "#009688",
  //   "#FF9800", "#3F51B5", "#FFC107", "#607D8B", "#C2185B", "#FFCDD2", "#69F0AE", "#FF1744", "#651FFF", "#00BCD4",
  //   "#D50000", "#9C27B0", "#607D8B", "#FF6D00", "#FF4081", "#2196F3", "#E65100", "#FFD600", "#FFC400", "#7B1FA2",
  //   "#8BC34A", "#E91E63", "#2962FF", "#00B0FF", "#FFAB00", "#FFA000", "#FF5722", "#607D8B", "#FF5252", "#CDDC39",
  //   "#9C27B0", "#00E5FF", "#FFEB3B", "#FF9800", "#4CAF50", "#9E9E9E", "#4DB6AC", "#F50057", "#9C27B0", "#E91E63",
  //   "#536DFE", "#448AFF", "#FF8F00", "#FFC107", "#3F51B5", "#795548", "#0097A7", "#607D8B", "#FF5722", "#FF5252",
  //   "#4CAF50", "#FFEB3B", "#2196F3", "#F44336", "#03A9F4", "#FF1744", "#607D8B", "#E81D62"];
  // const colorList = [
  //   "#87CEEB", "#98FF98", "#E6E6FA", "#FFDAB9", "#F08080",
  //   "#FAFAD2", "#AFEEEE", "#FFA07A", "#E6A8D7", "#98FB98",
  //   "#F0E68C", "#ADD8E6", "#FFB6C1", "#D3D3D3", "#FFE4B5",
  //   "#B0C4DE", "#FFFACD", "#C0C0C0", "#FFD700", "#AFEEEE"
  // ];
  const colorList = generateColors(30, "#000000")  
  
  let color = colorList[Math.floor(Math.random() * colorList.length)];

  // check if color is same as last time, and choose a new one if it is
  if (color === getRandomColor.lastColor) {
    color = getRandomColor();
  }

  getRandomColor.lastColor = color;

  return color;
}

function generateColors(numColors, desiredContrastColor) {
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    const color = generateRandomColor(desiredContrastColor);
    colors.push(color);
  }
  return colors;
}

function generateRandomColor(desiredContrastColor) {
  const contrastThreshold = 128; // Adjust this value as needed
  let color;
  do {
    color = getRandomHexColor();
  } while (!hasGoodContrast(color, desiredContrastColor, contrastThreshold));
  return color;
}

function getRandomHexColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function hasGoodContrast(color, desiredContrastColor, contrastThreshold) {
  const rgb1 = hexToRgb(color);
  const rgb2 = hexToRgb(desiredContrastColor);
  const brightness1 = calculateBrightness(rgb1.r, rgb1.g, rgb1.b);
  const brightness2 = calculateBrightness(rgb2.r, rgb2.g, rgb2.b);
  return Math.abs(brightness1 - brightness2) >= contrastThreshold;
}

function hexToRgb(hex) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function calculateBrightness(r, g, b) {
  return (r * 299 + g * 587 + b * 114) / 1000;
}


