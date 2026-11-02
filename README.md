# ⚖️ BMI Calculator (JavaScript)

A modern, responsive Body Mass Index (BMI) calculator built with vanilla JavaScript, HTML5, and CSS3. Includes both a sleek web application and an interactive Node.js CLI tool.

---

## 🌟 Features

- **Dual Unit Systems**:
  - **Metric**: Height in centimeters (cm), Weight in kilograms (kg)
  - **Imperial**: Height in feet (ft) & inches (in), Weight in pounds (lbs)
- **Interactive Visual Gauge**: Color-coded spectrum bar with a dynamic pointer indicating exact category placement.
- **Detailed Insights**:
  - BMI Score (with smooth count-up animation)
  - Category Badge (Underweight, Normal weight, Overweight, Obese Classes I–III)
  - Personalized **Healthy Weight Range** calculation for your specific height
  - Tailored health advice
- **Responsive & Modern Design**: Glassmorphic aesthetic, dark mode styling, and mobile responsiveness.
- **Bonus CLI Mode**: Run calculations directly from the terminal with Node.js.

---

## 🚀 How to Run

### 1. Web Application (Browser)

Simply open [`index.html`](file:///D:/work/BMI%20calculator/index.html) in any modern web browser:

- Double-click `index.html`, or
- Open via PowerShell / command line:
  ```powershell
  Start-Process index.html
  ```

---

### 2. Node.js Terminal CLI

You can also run the calculator directly in your terminal using Node.js:

#### Interactive Mode:
```bash
node bmi.js
```

#### Quick Command-Line Mode:
- **Metric** (`node bmi.js <weight-kg> <height-cm>`):
  ```bash
  node bmi.js 70 175
  ```
- **Imperial** (`node bmi.js --imperial <weight-lbs> <height-feet> <height-inches>`):
  ```bash
  node bmi.js --imperial 155 5 9
  ```

---

## 📐 BMI Reference (WHO Standards)

| BMI Range | Category |
| :--- | :--- |
| `< 18.5` | Underweight |
| `18.5 – 24.9` | Normal weight |
| `25.0 – 29.9` | Overweight |
| `30.0 – 34.9` | Obesity Class I |
| `35.0 – 39.9` | Obesity Class II |
| `≥ 40.0` | Obesity Class III (Severe) |
