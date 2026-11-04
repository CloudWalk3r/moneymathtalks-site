(function () {
  var C = window.CALC;
  if (!C) return;
  var form = document.getElementById("calc");
  var out = document.getElementById("results");

  function fmt(v, unit) {
    if (v === null || v === undefined || !isFinite(v)) return "not reachable";
    if (unit === "money") return v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (unit === "percent") return v.toFixed(2) + "%";
    if (unit === "years") return v.toFixed(1) + " years";
    if (unit === "months") return Math.round(v) + " months";
    return Number.isInteger(v) ? v.toLocaleString() : v.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }

  C.fields.forEach(function (f) {
    var label = document.createElement("label");
    label.textContent = f.label;
    var input = document.createElement("input");
    input.type = "number";
    input.name = f.name;
    input.value = f.default;
    input.min = f.min;
    input.max = f.max;
    input.step = f.step;
    input.inputMode = "decimal";
    label.appendChild(input);
    form.appendChild(label);
  });

  function run() {
    var v = {};
    var ok = true;
    C.fields.forEach(function (f) {
      var x = parseFloat(form.elements[f.name].value);
      if (isNaN(x) || x < f.min || x > f.max) ok = false;
      v[f.name] = x;
    });
    if (!ok) {
      out.innerHTML = "<p>Enter values within the allowed ranges.</p>";
      return;
    }
    var r = C.fn(v);
    out.innerHTML = C.outputs.map(function (o) {
      return '<div class="result"><span>' + o.label + "</span><strong>" + fmt(r[o.key], o.unit) + "</strong></div>";
    }).join("");
  }

  form.addEventListener("input", run);
  run();
})();
