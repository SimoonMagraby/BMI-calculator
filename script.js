/**
 * BMI Calculator
 * Calculates Body Mass Index (BMI), provides categorization,
 * ideal weight range estimation, and dynamic UI visual feedback.
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const unitMetricBtn = document.getElementById('unit-metric');
  const unitImperialBtn = document.getElementById('unit-imperial');
  const metricInputs = document.getElementById('metric-inputs');
  const imperialInputs = document.getElementById('imperial-inputs');
  
  const metricHeight = document.getElementById('metric-height');
  const metricWeight = document.getElementById('metric-weight');
  
  const imperialHeightFt = document.getElementById('imperial-height-ft');
  const imperialHeightIn = document.getElementById('imperial-height-in');
  const imperialWeight = document.getElementById('imperial-weight');
  
  const bmiForm = document.getElementById('bmi-form');
  const resetBtn = document.getElementById('reset-btn');
  const errorBanner = document.getElementById('error-message');
  
  const resultsCard = document.getElementById('results-card');
  const bmiValueElem = document.getElementById('bmi-value');
  const bmiCategoryElem = document.getElementById('bmi-category');
  const idealRangeElem = document.getElementById('ideal-range');
  const bmiAdviceElem = document.getElementById('bmi-advice');
  const spectrumPointer = document.getElementById('spectrum-pointer');

  let currentUnit = 'metric'; // 'metric' | 'imperial'

  // Unit Switch Handler
  unitMetricBtn.addEventListener('click', () => switchUnit('metric'));
  unitImperialBtn.addEventListener('click', () => switchUnit('imperial'));

  function switchUnit(unit) {
    if (currentUnit === unit) return;
    currentUnit = unit;

    if (unit === 'metric') {
      unitMetricBtn.classList.add('active');
      unitImperialBtn.classList.remove('active');
      metricInputs.classList.add('active');
      imperialInputs.classList.remove('active');
      metricHeight.focus();
    } else {
      unitImperialBtn.classList.add('active');
      unitMetricBtn.classList.remove('active');
      imperialInputs.classList.add('active');
      metricInputs.classList.remove('active');
      imperialHeightFt.focus();
    }

    hideError();
  }

  // Handle Form Submission
  bmiForm.addEventListener('submit', (e) => {
    e.preventDefault();
    calculateBMI();
  });

  // Handle Reset
  resetBtn.addEventListener('click', () => {
    bmiForm.reset();
    hideError();
    resultsCard.classList.add('hidden');
  });

  // Hide error on typing
  [metricHeight, metricWeight, imperialHeightFt, imperialHeightIn, imperialWeight].forEach((input) => {
    input.addEventListener('input', () => {
      hideError();
    });
  });

  function showError(msg) {
    errorBanner.textContent = msg;
    errorBanner.hidden = false;
  }

  function hideError() {
    errorBanner.hidden = true;
  }

  function calculateBMI() {
    let bmi = 0;
    let minIdealWeight = 0;
    let maxIdealWeight = 0;
    let unitLabel = '';

    if (currentUnit === 'metric') {
      const heightCm = parseFloat(metricHeight.value);
      const weightKg = parseFloat(metricWeight.value);

      if (!heightCm || heightCm <= 0 || !weightKg || weightKg <= 0) {
        showError('Please enter valid positive numbers for height (cm) and weight (kg).');
        return;
      }

      if (heightCm < 50 || heightCm > 300) {
        showError('Please enter a realistic height between 50 cm and 300 cm.');
        return;
      }

      if (weightKg < 10 || weightKg > 500) {
        showError('Please enter a realistic weight between 10 kg and 500 kg.');
        return;
      }

      const heightM = heightCm / 100;
      bmi = weightKg / (heightM * heightM);

      // Normal BMI range: 18.5 to 24.9
      minIdealWeight = 18.5 * (heightM * heightM);
      maxIdealWeight = 24.9 * (heightM * heightM);
      unitLabel = 'kg';

    } else {
      const ft = parseFloat(imperialHeightFt.value) || 0;
      const inches = parseFloat(imperialHeightIn.value) || 0;
      const weightLbs = parseFloat(imperialWeight.value);

      const totalInches = (ft * 12) + inches;

      if (totalInches <= 0 || !weightLbs || weightLbs <= 0) {
        showError('Please enter valid positive numbers for feet, inches, and weight (lbs).');
        return;
      }

      if (totalInches < 20 || totalInches > 110) {
        showError('Please enter a realistic height between 1\'8" and 9\'2".');
        return;
      }

      if (weightLbs < 20 || weightLbs > 1000) {
        showError('Please enter a realistic weight between 20 lbs and 1000 lbs.');
        return;
      }

      // Formula: (weight in lbs / (height in inches)^2) * 703
      bmi = (weightLbs / (totalInches * totalInches)) * 703;

      minIdealWeight = (18.5 * (totalInches * totalInches)) / 703;
      maxIdealWeight = (24.9 * (totalInches * totalInches)) / 703;
      unitLabel = 'lbs';
    }

    hideError();
    renderResults(bmi, minIdealWeight, maxIdealWeight, unitLabel);
  }

  function getCategoryInfo(bmi) {
    if (bmi < 18.5) {
      return {
        category: 'Underweight',
        cssClass: 'category-underweight',
        advice: 'Below the recommended range. A nutrient-dense diet and consultation with a healthcare provider may help.',
        pointerPercent: calculatePointer(bmi, 0, 18.5, 0, 25)
      };
    } else if (bmi <= 24.9) {
      return {
        category: 'Normal weight',
        cssClass: 'category-normal',
        advice: 'Great job! You are in the healthy weight range. Continue with balanced nutrition and active lifestyle.',
        pointerPercent: calculatePointer(bmi, 18.5, 24.9, 25, 50)
      };
    } else if (bmi <= 29.9) {
      return {
        category: 'Overweight',
        cssClass: 'category-overweight',
        advice: 'Slightly above the recommended range. Regular exercise and mindful nutrition can help you reach a healthy weight.',
        pointerPercent: calculatePointer(bmi, 25.0, 29.9, 50, 75)
      };
    } else {
      let subCat = 'Obese';
      if (bmi < 35.0) subCat = 'Obese (Class I)';
      else if (bmi < 40.0) subCat = 'Obese (Class II)';
      else subCat = 'Obese (Class III)';

      return {
        category: subCat,
        cssClass: 'category-obese',
        advice: 'Significantly above the recommended range. Discussing a health and weight plan with a doctor is advised.',
        pointerPercent: calculatePointer(bmi, 30.0, 42.0, 75, 100)
      };
    }
  }

  // Maps a BMI in a sub-range to the corresponding percentage on the spectrum bar
  function calculatePointer(val, inMin, inMax, outMin, outMax) {
    const clamped = Math.max(inMin, Math.min(inMax, val));
    const normalized = (clamped - inMin) / (inMax - inMin);
    return outMin + (normalized * (outMax - outMin));
  }

  function renderResults(bmi, minIdeal, maxIdeal, unit) {
    const info = getCategoryInfo(bmi);

    // Animate counter display
    animateValue(bmiValueElem, 0, bmi, 700);

    // Update Category badge
    bmiCategoryElem.textContent = info.category;
    bmiCategoryElem.className = `bmi-category ${info.cssClass}`;

    // Update Ideal Range
    idealRangeElem.textContent = `${minIdeal.toFixed(1)} – ${maxIdeal.toFixed(1)} ${unit}`;

    // Update Advice
    bmiAdviceElem.textContent = info.advice;

    // Show Results Card
    resultsCard.classList.remove('hidden');

    // Move pointer smoothly
    requestAnimationFrame(() => {
      spectrumPointer.style.left = `${info.pointerPercent}%`;
    });

    // Smooth scroll into view if needed
    resultsCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Smooth number counter animation
  function animateValue(elem, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);
      const current = start + (end - start) * easeOutQuad;
      elem.textContent = current.toFixed(1);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }
});
