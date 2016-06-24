var unit = 'in';

window.onload = function() {
  var calculator = document.getElementById('calculator');

  calculator.addEventListener('submit', function(event) {
    event.preventDefault();
    var slider = document.getElementById('slider');
    var dpiInput = document.getElementById('dpi_input');

    var dpis = handleDpiString( dpiInput.value );
    var val = unit == 'in'? slider.value : slider.value / 2.54;

    renderResult( closestDistance(val,dpis) );

  });

  initTargetSlider();

};

function renderResult(dpiObj) {
  var result = document.getElementById('result');
  var dp360 = (unit == 'in' ? dpiObj.dp360 : dpiObj.dp360 * 2.54).toFixed(2);

  var thead = '<thead><tr><th>Nearest '+ (unit == 'in' ? 'in':'cm') + '/360&deg;</th><th>@ mouse dpi</th><th>@ ow sensitivity</th></tr></thead>';
  var trow = '<tr><td>' + dp360 + '</td>' +
            '<td>' + dpiObj.dpi + '</td>' +
            '<td>' + dpiObj.sens + '</td></tr>';

  result.innerHTML = '<table>' + thead + trow + '</table>';

}

function handleDpiString(dpi) {
  var arr = []
  dpi = dpi.replace(/\s/g, '')

  var temp = dpi.split('-');
  if (temp.length == 2) {
    for (var i = parseInt(temp[0]); i <= parseInt(temp[1]); i+=50) {
      arr.push(i);
    }
  }
  else {
    arr = dpi.split(',');
  }
  return arr;
}

function initTargetSlider () {
  var slider = document.getElementById('slider');
  var dp360Val = document.getElementById('dp360Val');
  var active = document.getElementById('active');
  var inactive = document.getElementById('inactive');

  setUnits();

  slider.addEventListener('input', function(event) {
    dp360Val.innerHTML = parseFloat(event.target.value).toFixed(2);
  });

  inactive.addEventListener('click', function(event) {
    var temp = slider.value;
    unit = unit == "in" ? "cm" : "in";
    setUnits();
    slider.value = unit == "in" ? temp / 2.54 : temp * 2.54;
    dp360Val.innerHTML = parseFloat(slider.value).toFixed(2);
  });

  function setUnits() {
    active.innerHTML = unit + "/360&deg;";
    var other = unit == "in" ? "cm" : "in";
    inactive.innerHTML = other +  "/360&deg;";

    slider.step = (unit == "in" ? 0.25 : 0.5);
    slider.max = (unit == "in" ? 30 : 75);
  }

}

function dp360 ( dpi, sens ) {
  return 360 / ((sens/150) * dpi);
}

function owSens ( dp360, dpi ) {
  return (360 * 150) / ( dp360 * dpi );
}

function closestDistance( target, dpiArr ) {
  return dpiArr.map(function (dpi) {
    var obj = {}

    //Calculate top and bottom closest sensitivity
    var actualSens = owSens( target, dpi );
    var floor = Math.floor(actualSens);
    var ceil = Math.ceil(actualSens);

    var floorD = dp360(dpi, floor);
    var ceilD = dp360(dpi, ceil);

    //Find the distance that is closer to the target
    var floorDiff = Math.abs(target-floorD);
    var ceilDiff = Math.abs(target-ceilD);
    if ( floorDiff < ceilDiff ) {
      return {
        dpi: dpi,
        sens: floor,
        dp360: floorD
      }
    }
    else {
      return {
        dpi: dpi,
        sens: ceil,
        dp360: ceilD
      }
    }
  }).reduce(function(a,b) {
    var aDiff = Math.abs(target-a.dp360);
    var bDiff = Math.abs(target-b.dp360);
    return aDiff < bDiff ? a : b;
  });

}

