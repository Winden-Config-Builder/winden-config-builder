function updateValues() {
  return {
    minBaseFontSize: parseFloat(document.getElementById('minBaseFontSize').value),
    minScreenWidth: parseFloat(document.getElementById('minScreenWidth').value),
    minScaleRatio: parseFloat(document.getElementById('minScaleRatio').value),
    maxBaseFontSize: parseFloat(document.getElementById('maxBaseFontSize').value),
    maxScreenWidth: parseFloat(document.getElementById('maxScreenWidth').value),
    maxScaleRatio: parseFloat(document.getElementById('maxScaleRatio').value),
    typeScaleNames: document.getElementById('typeScaleNames').value.split(','),
    decimalPlaces: parseInt(document.getElementById('rounding').value),
  };
}

function generate() {
  let values = updateValues();
  let cssVariables = "";
  let tailwindVarPreview = "fontSize: {\n";
  let tailwindPreview = "fontSize: {\n";

  let select = document.getElementById('baseLineSelect');
  let index = select.selectedIndex;

  for (let i = 0; i < values.typeScaleNames.length; i++) {
    if (index > 0) {
      var base = i - index;
    } else {
      var base = i;
    }
    let minFontSize = values.minBaseFontSize * Math.pow(values.minScaleRatio, base);
    let maxFontSize = values.maxBaseFontSize * Math.pow(values.maxScaleRatio, base);

    let vwValue = ((maxFontSize - minFontSize) * 100) / (values.maxScreenWidth - values.minScreenWidth);
    let pxValue = minFontSize - (values.minScreenWidth * vwValue / 100);

    let typeScaleName = values.typeScaleNames[i].trim();
    let cssVariable = `--win-fs-${typeScaleName}`;

    cssVariables += `${cssVariable}: clamp(${minFontSize.toFixed(values.decimalPlaces)}px, ${vwValue.toFixed(values.decimalPlaces)}vw + ${pxValue.toFixed(values.decimalPlaces)}px, ${maxFontSize.toFixed(values.decimalPlaces)}px);\n`;

    // Add entries to tailwind var preview
    tailwindVarPreview += `  ${typeScaleName}: 'var(${cssVariable})',\n`;

    // Add entries to tailwind preview
    tailwindPreview += `  '${typeScaleName}': 'clamp(${minFontSize.toFixed(values.decimalPlaces)}px, ${vwValue.toFixed(values.decimalPlaces)}vw + ${pxValue.toFixed(values.decimalPlaces)}px, ${maxFontSize.toFixed(values.decimalPlaces)}px)',\n`;
  }

  const wrappedCSSVariables = `:root {\n${cssVariables}}`;

  const styleTag = document.getElementById('generated-styles');
  if (styleTag) {
    styleTag.textContent = wrappedCSSVariables;
  } else {
    const head = document.head || document.getElementsByTagName('head')[0];
    const newStyleTag = document.createElement('style');
    newStyleTag.setAttribute('id', 'generated-styles');
    newStyleTag.textContent = wrappedCSSVariables;
    head.appendChild(newStyleTag);
  }

  document.querySelector('#css-variables-preview code').textContent = wrappedCSSVariables;
  document.querySelector('#tailwind-var-preview code').textContent = `${tailwindVarPreview}}`;
  document.querySelector('#tailwind-preview code').textContent = `${tailwindPreview}}`;
}


function updateSelectOptions() {
  let typeScaleNames = document.getElementById('typeScaleNames').value.split(/\s*,\s*/);
  let select = document.getElementById('baseLineSelect');

  // clear out old options
  while (select.firstChild) {
    select.firstChild.remove();
  }

  // create and append new options
  for (let i = 0; i < typeScaleNames.length; i++) {
    let option = document.createElement('option');
    option.value = typeScaleNames[i];
    option.text = typeScaleNames[i];
    select.appendChild(option);
  }
}

// Event listeners for all input fields
let inputIds = ['minBaseFontSize', 'minScreenWidth', 'minScaleRatio', 'maxBaseFontSize', 'maxScreenWidth', 'maxScaleRatio', 'typeScaleNames', 'rounding', 'baseLineSelect'];

inputIds.forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    if (id === 'typeScaleNames') {
      updateSelectOptions();
    }
    generate();
  });
});

// Generate CSS variables and update select options on page load
window.addEventListener('load', function() {
  updateSelectOptions();
  generate();
});

document.getElementById('disableRatio').addEventListener('change', function() {
  let typographyRatio = document.getElementById('typographyRatio');
  let typographySingle = document.getElementById('typographySingle');

  if(this.checked) {
    typographyRatio.style.display = 'none';
    typographySingle.style.display = 'block';
  } else {
    typographyRatio.style.display = 'block';
    typographySingle.style.display = 'none';
  }
});


// Event listener for "AddFont" button
document.querySelector('.AddFont').addEventListener('click', function() {
  let typographySingleWrap = document.querySelector('#typographySingle .typographySingleWrap');
  let inputGroup = document.querySelector('#typographySingle .input-group');
  let clonedInputGroup = inputGroup.cloneNode(true); // This creates a copy of the inputGroup

  // Make sure to add an event listener to the cloned "delFont" button
  let delFontButton = clonedInputGroup.querySelector('.delFont');
  delFontButton.addEventListener('click', function() {
    this.closest('.input-group').remove();
  });

  typographySingleWrap.appendChild(clonedInputGroup); // This adds the copy to the DOM
});

// Event listener for initial "delFont" button
let delFontButtons = document.querySelectorAll('.delFont');
delFontButtons.forEach(button => {
  button.addEventListener('click', function() {
    this.closest('.input-group').remove();
  });
});

