#!/usr/bin/env node

/**
 * Standalone Node.js BMI Calculator
 * Usage:
 *   Interactive mode: node bmi.js
 *   Metric command:   node bmi.js 70 175         (weight in kg, height in cm)
 *   Imperial command: node bmi.js --imperial 155 5 9 (weight in lbs, ft, inches)
 */

const readline = require('readline');

function calculateMetric(weightKg, heightCm) {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const minIdeal = 18.5 * (heightM * heightM);
  const maxIdeal = 24.9 * (heightM * heightM);
  return { bmi, minIdeal, maxIdeal, unit: 'kg' };
}

function calculateImperial(weightLbs, feet, inches = 0) {
  const totalInches = (feet * 12) + inches;
  const bmi = (weightLbs / (totalInches * totalInches)) * 703;
  const minIdeal = (18.5 * (totalInches * totalInches)) / 703;
  const maxIdeal = (24.9 * (totalInches * totalInches)) / 703;
  return { bmi, minIdeal, maxIdeal, unit: 'lbs' };
}

function getCategory(bmi) {
  if (bmi < 18.5) return { category: 'Underweight', advice: 'Consider a nutrient-dense diet to reach a healthy weight.' };
  if (bmi < 25.0) return { category: 'Normal weight', advice: 'Great work! Keep maintaining an active lifestyle and balanced diet.' };
  if (bmi < 30.0) return { category: 'Overweight', advice: 'Moderate daily exercise and mindful eating can help improve your health.' };
  if (bmi < 35.0) return { category: 'Obesity (Class I)', advice: 'Consulting a healthcare provider for guidance on lifestyle changes is recommended.' };
  if (bmi < 40.0) return { category: 'Obesity (Class II)', advice: 'Consulting a doctor for tailored weight management is advised.' };
  return { category: 'Obesity (Class III / Severe)', advice: 'Medical guidance is strongly recommended.' };
}

function displayResults(data) {
  const { category, advice } = getCategory(data.bmi);
  console.log('\n======================================');
  console.log('            BMI RESULTS               ');
  console.log('======================================');
  console.log(` BMI Value:             ${data.bmi.toFixed(1)}`);
  console.log(` Category:              ${category}`);
  console.log(` Healthy Weight Range:  ${data.minIdeal.toFixed(1)} - ${data.maxIdeal.toFixed(1)} ${data.unit}`);
  console.log(` Health Advice:         ${advice}`);
  console.log('======================================\n');
}

// Check for command line arguments
const args = process.argv.slice(2);

if (args.length > 0) {
  if (args[0] === '--imperial') {
    const weight = parseFloat(args[1]);
    const ft = parseFloat(args[2]);
    const inch = parseFloat(args[3]) || 0;
    if (isNaN(weight) || isNaN(ft) || weight <= 0 || ft <= 0) {
      console.error('Error: Please provide valid positive numbers. E.g. node bmi.js --imperial 155 5 9');
      process.exit(1);
    }
    displayResults(calculateImperial(weight, ft, inch));
    process.exit(0);
  } else {
    const weight = parseFloat(args[0]);
    const height = parseFloat(args[1]);
    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
      console.error('Error: Please provide valid positive numbers. E.g. node bmi.js 70 175');
      process.exit(1);
    }
    displayResults(calculateMetric(weight, height));
    process.exit(0);
  }
}

// Interactive Mode
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function runInteractive() {
  console.log('\n======================================');
  console.log('       BODY MASS INDEX (BMI)          ');
  console.log('======================================');
  console.log('Choose Unit System:');
  console.log(' 1) Metric (kg, cm)');
  console.log(' 2) Imperial (lbs, ft & inches)');

  const choice = (await ask('Select [1 or 2]: ')).trim();

  if (choice === '2') {
    const ftStr = await ask('Enter height (feet): ');
    const inStr = await ask('Enter height (inches): ');
    const wtStr = await ask('Enter weight (lbs): ');

    const ft = parseFloat(ftStr);
    const inches = parseFloat(inStr) || 0;
    const wt = parseFloat(wtStr);

    if (isNaN(ft) || ft <= 0 || isNaN(wt) || wt <= 0) {
      console.log('❌ Invalid input. Please enter valid positive numbers.');
    } else {
      displayResults(calculateImperial(wt, ft, inches));
    }
  } else {
    const heightStr = await ask('Enter height (cm): ');
    const weightStr = await ask('Enter weight (kg): ');

    const height = parseFloat(heightStr);
    const weight = parseFloat(weightStr);

    if (isNaN(height) || height <= 0 || isNaN(weight) || weight <= 0) {
      console.log('❌ Invalid input. Please enter valid positive numbers.');
    } else {
      displayResults(calculateMetric(weight, height));
    }
  }

  rl.close();
}

runInteractive();
