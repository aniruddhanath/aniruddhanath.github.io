var path, position, max;
var count = 0;
var grow = false;

var raster = new Raster('mona');
raster.visible = false;
raster.on('load', resetSpiral);

function onFrame(event) {
  if (grow) {
    if (raster.loaded && (view.center - position).length < max) {
      for (var i = 0, l = count / 36 + 1; i < l; i++) {
        growSpiral();
      }
      path.smooth();
    } else {
      grow = false;
    }
  }
}

function growSpiral() {
  count++;
  var vector = new Point({
    angle: count * 5,
    length: count / 100
  });
  var rot = vector.rotate(90);
  var color = raster.getAverageColor(position + vector / 2);
  var value = color ? (1 - color.gray) * 3.7 : 0;
  rot.length = Math.max(value, 0.2);
  path.add(position + vector - rot);
  path.insert(0, position + vector + rot);
  position += vector;
}

function resetSpiral() {
  grow = true;

  raster.fitBounds(view.bounds);

  count = 0;
  path = new Path({
    fillColor: 'black',
    closed: true
  });

  position = view.center;
  max = Math.min(raster.bounds.width, raster.bounds.height) * 0.5;
}

function onKeyDown(event) {
  if (event.key == 'space') {
    path.selected = !path.selected;
  }
}
