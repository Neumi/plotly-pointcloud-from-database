$(document).ready(function () {
    Plotly.d3.csv(
        'data.php',
        function (err, rows) {
            function unpack(rows, key) {
                return rows.map(function (row) {
                    return row[key];
                });
            }

            var trace1 = {
                x: unpack(rows, 'x'),
                y: unpack(rows, 'y'),
                z: unpack(rows, 'z'),

                mode: 'markers',
                marker: {
                    color: unpack(rows, 'g'),
                    colorscale: [
                        ['0', 'rgb(255, 46, 28)'],
                        ['0.8', 'rgb(255, 255, 28)'],
                        ['1', 'rgb(28, 255, 84)']
                    ],
                    reversescale: true,
                    showscale: false,
                    size: 1.0,
                    symbol: 'circle',
                    opacity: 1
                },
                type: 'scatter3d'
            };

            var data = [trace1];
            var layout = {
                autosize: true,
                scene: {
                    bgcolor: 'rgb(100,100,100)',
                    aspectmode: "data",
                    aspectratio: {
                        x: 1.0,
                        y: 1.0,
                        z: 1.0
                    },
                    camera: {
                        center: {
                            x: 0,
                            y: 0,
                            Z: 0
                        },
                        eye: {
                            x: 1.25,
                            y: 1.25,
                            z: 0.1
                        },
                        up: {
                            x: 0,
                            y: 0,
                            Z: 1
                        }
                    }
                },
                margin: {
                    l: 0,
                    r: 0,
                    b: 0,
                    t: 0
                }
            };
            var gd = document.getElementById('pointcloud');
            console.log(gd);

            Plotly.newPlot(gd, data, layout, {
                displayModeBar: false
            });

            var fps = 24;
            var now;
            var then = Date.now();
            var interval = 10000 / fps;
            var delta;

            function draw() {

                requestAnimationFrame(draw);

                now = Date.now();
                delta = now - then;

                //enable these lines if you like auto-rotating (not recommended on slow machines)
                /*
                 if (delta > interval) {
                 then = now - (delta % interval);
                 rotate('scene', Math.PI / 1800);
                 }
                 */

            }

            draw();

            function rotate(id, angle) {
                var scene = gd._fullLayout[id]._scene;
                var camera = scene.getCamera();

                var rtz = xyz2rtz(camera.eye);

                rtz.t += angle;

                camera.eye = rtz2xyz(rtz);

                scene.setCamera(camera);
            }

            function xyz2rtz(xyz) {
                return {
                    r: Math.sqrt(xyz.x * xyz.x + xyz.y * xyz.y),
                    t: Math.atan2(xyz.y, xyz.x),
                    z: xyz.z
                };
            }

            function rtz2xyz(rtz) {
                return {
                    x: rtz.r * Math.cos(rtz.t),
                    y: rtz.r * Math.sin(rtz.t),
                    z: rtz.z
                };
            }

            var addEvent = function (object, type, callback) {
                if (object == null || typeof(object) == 'undefined') return;
                if (object.addEventListener) {
                    object.addEventListener(type, callback, false);
                } else if (object.attachEvent) {
                    object.attachEvent("on" + type, callback);
                } else {
                    object["on" + type] = callback;
                }
            };

            addEvent(window, "resize", function (event) {
                Plotly.newPlot(gd, data, layout, {
                    displayModeBar: false
                });
                draw();
            });
        });
});