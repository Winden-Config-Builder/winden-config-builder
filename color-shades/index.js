var colorPicker = document.getElementById("colorPicker");
var shadesContainer = document.getElementById("shadesContainer");
var shades = [];
var selectedIndex = null;
var numBlocks = 10; // Initial number of blocks

colorPicker.addEventListener("change", function() {
  generateShades();
  setColorName();
  exportColors();
});

generateShades(); // Generate shades when the page loads
setColorName(); // Set the color name when the page loads

function generateShades() {
    shadesContainer.innerHTML = "";
    var baseColor = chroma(colorPicker.value);
    
    // Adjust the color scale to always start from white and end at black
    shades = chroma.scale(['white', baseColor, 'black']).mode("lab").colors(numBlocks);
  
    shades.forEach(function (shade, index) {
      var shadeElement = document.createElement("div");
      shadeElement.style.backgroundColor = shade;
      shadeElement.className = "shade";
      shadeElement.textContent = chroma(shade).hex(); // Set the hex value as text content
  
      shadeElement.addEventListener("click", function () {
        setSelectedShade(index);
      });
  
      shadesContainer.appendChild(shadeElement);
    });
  
    // Reapply the selected shade if one is currently selected
    if (selectedIndex !== null) {
      setSelectedShade(selectedIndex);
    }
}


function setSelectedShade(index) {
  var selectedColor = chroma(colorPicker.value).hex();

  // Remove the style from the previously selected shade
  if (selectedIndex !== null) {
    shadesContainer.childNodes[selectedIndex].classList.remove("active-color");
  }

  // Set the style for the selected shade
  shadesContainer.childNodes[index].style.backgroundColor = selectedColor;
  shadesContainer.childNodes[index].classList.add("active-color");

  for (var i = 0; i < shadesContainer.childNodes.length; i++) {
    var shade;
    if (i < index) {
      shade = chroma(selectedColor).darken((index - i) / 2).hex();
    } else if (i > index) {
      shade = chroma(selectedColor).brighten((i - index) / 2).hex();
    } else {
      shade = selectedColor;
    }
    shadesContainer.childNodes[i].style.backgroundColor = shade;
    shadesContainer.childNodes[i].textContent = shade;  // Update the box name (hex color value)
  }

  // Update the selectedIndex
  selectedIndex = index;

  exportColors();
}

var addButton = document.getElementById("addButton");
var removeButton = document.getElementById("removeButton");

addButton.addEventListener("click", function() {
  addBlock();
  exportColors();
});
removeButton.addEventListener("click", function() {
  removeBlock();
  exportColors();
});

function addBlock() {
  numBlocks++;
  generateShades();
}

function removeBlock() {
    if (numBlocks > 1) {
      numBlocks--;
      if (selectedIndex !== null && selectedIndex >= numBlocks) {
        // If the selected index is out of range after removing a block,
        // update it to the last available index
        selectedIndex = numBlocks - 1;
      }
      generateShades();
    }
  }
  
  function setColorName() {
    var colorName = chroma(colorPicker.value).name();
    document.querySelector('input[type="text"]').value = colorName;
  }
  
  function exportColors() {
    var colorName = document.querySelector('input[type="text"]').value;
    var output = "colors: {\n";
    output += "  '" + colorName + "': {\n";
  
    shades.forEach(function (shade, index) {
      output += "    " + ((index + 1) * 100) + ": '" + chroma(shade).hex() + "',\n";
    });
  
    output += "  },\n},";
    
    document.querySelector('#preview code').textContent = output;
  }
  
  document.querySelector('input[type="text"]').addEventListener('input', exportColors);
  
  // Set the color name to "custom-color" when the page loads
  document.querySelector('input[type="text"]').value = "custom-color";
  exportColors();
  


var hueInput = document.getElementById("hue");

hueInput.addEventListener("input", function() {
  setColorWithHue();
  generateShades();
  setColorName();
  exportColors();
});



function setColorWithHue() {
  var hueValue = hueInput.value;
  var baseColor = chroma(colorPicker.value);
  var colorWithHue = baseColor.set('hsl.h', hueValue);

  // Set the color picker's value to the new color
  colorPicker.value = colorWithHue.hex();
}