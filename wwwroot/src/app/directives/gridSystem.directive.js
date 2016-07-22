import '../../css/grid-system.sass';
import template from './gridSystem.directive/template.jade';

class GridSystem {
    constructor($parse, $q, $window, $compile, d3Factory) {
        this.restrict = 'E';
        this.scope = false;
        this.replace = true;
        this.template = template;

        this.$parse = $parse;
        this.d3Factory = d3Factory;
        this.$q = $q;
        this.$window = $window;
        this.$compile = $compile;
    }

    link (scope, element, attributes) {
        this.d3Factory.then((d3) => {
            scope.center = (duration = 800) => {
                var scale = scope.editor.behavior.d3.zoom.scale();
                var editorWidth = scope.editor.features.pixelsPerMm * scope.editor.pageProperties.widthMm * scale;
                var editorHeight = scope.editor.features.pixelsPerMm * scope.editor.pageProperties.heightMm * scale;
                var center = {
                    x: (this.$window.innerWidth - editorWidth) / 2,
                    y: (this.$window.innerHeight - editorHeight) / 2
                };

                return scope.translateTo(center, duration);
            };

            angular.element(this.$window).on('resize', () => {
                scope.center(1);
            });

            /**
            * Перемещение рабочей области в заданую точку
            * @param {Object} point - точна назначения
            * @param {Object} point.x - x координата
            * @param {Object} point.y - y координата
            * @returns {Promise}
            */
            scope.translateTo = (point, duration = 800) => {
                return this.$q((resolve, reject) => {
                    d3.transition('translateTo')
                      .duration(duration)
                      .tween('translateTo', () => {

                          /**
                          * step - функция от t
                          * step(0)[0] = scope.editor.position.x
                          * step(0)[1] = scope.editor.position.y
                          */
                          var step = d3.interpolate(
                              [scope.editor.position.x, scope.editor.position.y], //начало отрезка для интерполяции (текущая позиция редактора)
                              [point.x, point.y] //конечная точка
                          );

                          var translateToInternal = (x, y) => {
                              scope.editor.behavior.d3.zoom.translate([x, y]);
                              scope.editor.behavior.d3.zoom.event(scope.editor.svg.container);

                              scope.editor.position.x = x;
                              scope.editor.position.y = y;
                          };

                          /**
                          *
                          * @param t - нормализованный интервал [0; 1]
                          */

                          return (t) => {
                              translateToInternal(step(t)[0], step(t)[1])
                          };
                      })
                      .each('end', () => {
                          resolve();
                      });
                });
            };

            scope.editor = {
                behavior: {
                    dragging: false
                },
                grid: {
                    sizeXMm: 5,
                    sizeYMm: 5
                },
                position: {
                    x: 0,
                    y: 0
                },
                pageProperties: {
                    widthMm: 297,
                    heightMm: 210
                },
                svg: {},
                features: {}
            };

            var animationDuration = 800;
            var editor = scope.editor;
            var svg = this.$parse('svg')(editor);
            var features = this.$parse('features')(editor);
            var position = this.$parse('position')(editor);
            var behavior = this.$parse('behavior')(editor);
            var rootNode = svg.rootNode = d3.select(element[0])
                                            .append('svg')
                                            .attr({ 'id': 'editor', 'class': 'svg-editor' });
            var g = rootNode
                        .append('g')
                        .attr({
                            'transform': 'translate(0, 0)'
                        });

            var conversionRect = rootNode
                                    .append('rect')
                                    .attr({
                                        'width': '1mm',
                                        'height': '1mm'
                                    });

            features.pixelsPerMm = conversionRect.node().getBBox().width;

            conversionRect.remove();

            svg.underlay = g.append('rect')
                            .attr({
                                'class': 'underlay',
                                'width': '100%',
                                'height': '100%'
                            });

            svg.container = g.append('g')
                             .attr({
                                'class' : 'svg-container'
                             });

            var gGridX = svg.container
                                .append('g')
                                .attr({ 'class': 'x axis' });

            var gGridY = svg.container
                                .append('g')
                                .attr({ 'class': 'y axis' });

            var borderFrame = svg.container
                                        .append('rect')
                                        .attr({
                                          'class': 'svg-border',
                                          'x': 0,
                                          'y': 0,
                                          'width': 0,
                                          'height': 0
                                        });

            var pageWidth = features.pixelsPerMm * editor.pageProperties.widthMm;
            var pageHeight = features.pixelsPerMm * editor.pageProperties.heightMm;

            borderFrame
                .transition()
                .duration(animationDuration)
                .attr({ 'width': pageWidth, 'height': pageHeight });

            var lineX = gGridX
                            .selectAll('line')
                            .data(d3.range(0, pageHeight, editor.grid.sizeXMm * features.pixelsPerMm));

            var lineY = gGridY
                            .selectAll('line')
                            .data(d3.range(0, pageWidth, editor.grid.sizeYMm * features.pixelsPerMm));

            lineX.enter()
                    .append('line')
                    .attr({
                        'x1': 0, 'x2': 0,
                        'y1': (d) => d
                    })
                    .transition()
                    .duration(animationDuration)
                    .attr({
                        'x2': pageWidth,
                        'y2': (d) => d
                    });

            lineY.enter()
                    .append('line')
                    .attr({
                        'y1': 0, 'y2': 0,
                        'x1': (d) => d
                    })
                    .transition()
                    .duration(animationDuration)
                    .attr({
                        'y2': pageHeight,
                        'x2': (d) => d
                    });

            behavior.d3 = {
                zoom: d3.behavior.zoom()
                                 .scale(1)
                                 .scaleExtent([.2, 10])
                                 .on('zoom', () => {
                                     var t = d3.event.translate;
                                     var s = d3.event.scale;

                                     svg.container.attr({
                                         'transform': 'translate(' + t + ')scale(' + s + ')' });

                                    t = t.toString().split(','); //1, 2 -> [1, 2]

                                    position.x = t[0];
                                    position.y = t[1];
                                })
            };

            g.call(behavior.d3.zoom);
            behavior.d3.zoom.event(svg.container); //ручной вызов события zoom (прокрутки)

            scope.center();

            this.$compile(angular.element(svg.container.append('g')
                                .attr({
                                    'transform': 'translate(10, 10)',
                                    'data-custom-shape': '',
                                    'data-custom-rectangle': '',
                                    'class': 'holes'
                                }).node()))(scope);

            this.$compile(angular.element(svg.container.append('g')
                                .attr({
                                    'transform': 'translate(10, 10)',
                                    'data-custom-shape': '',
                                    'data-custom-rectangle': '',
                                    'class': 'holes'
                                }).node()))(scope);
        });
    }

    static createInstance($parse, $q, $window, $compile, d3Factory) {
        return new GridSystem($parse, $q, $window, $compile, d3Factory);
    }
}

GridSystem.createInstance.$inject = ['$parse', '$q', '$window', '$compile', 'd3Factory'];

export default GridSystem.createInstance;
