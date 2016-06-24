window.onload = function() {
  var dpiVal = document.getElementById('dpiVal');
  var slider = document.getElementById('slider');
  var result = document.getElementById('result');

  dpiVal.innerHTML = slider.value + '<span class="bodytext"> dpi</span>';
  renderTable ( slider.value, result);

  slider.addEventListener('input', function (e) {
    dpiVal.innerHTML = e.target.value + '<span class="bodytext"> dpi</span>';
    renderTable (e.target.value,result)
  });

};

function renderTable ( dpi, element ) {

  var arr = dp360List(dpi);
  var thead = '<thead><tr><th>OW Sensitivity</th><th>in/360</th><th>cm/360</th></th></thead>'
  var rows = arr.map(function(val, i) {
    return (
      '<tr>' +
      '<td>' + (i + 1) + '</td>' +
      '<td>' + val.toFixed(2) + '</td>' +
      '<td>' + (val * 2.54).toFixed(2) + '</td>' +
      '</tr>')
  }).join("");

  element.innerHTML = "<table>" + thead + rows + "</table>";

}

function dp360List ( dpi ) {
  var arr = [];
  for (var i = 1; i <= 100; i++) {
    arr.push( dp360( dpi, i ) );
  }
  return arr;
}

function dp360 ( dpi, sens ) {
  return 360 / ((sens/150) * dpi);
}
