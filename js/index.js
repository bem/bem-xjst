function XJSTController($scope) {
    $scope.compiledHtml = function() {
        $scope.error = '';
        var res, json, exports = {};
        try {
            json = eval('(' + $scope.data.inputBemjson + ')');
        } catch (e) {
            return 'BEMJSON parse error:\n' + e.stack;
        }
        var api = new BEMHTML({});
        try {
            api.compile($scope.data.inputMatchers);
            api.exportApply(exports);
        } catch (e) {
            return 'Matchers parse error:\n' + e.stack;
        }
        try {
            res = exports.apply(json).replace(/>/g, '>\n').replace(/([^>\n])</g, '$1\n<');
        } catch (e) {
            return 'Execution error:\n' + e.stack;
        }
        return res;
    };

    $scope.loadSettings = function(settings) {
        $scope.data = angular.fromJson(settings);
        $scope.data.inputBemjson = $scope.data.inputBemjson || '{ block: \'button\', content: \'Кнопка\' }';
        $scope.data.inputMatchers = $scope.data.inputMatchers ||
            'block(\'button\').tag()(\'span\')\n'
    };
    $scope.loadSettings(localStorage['xjst-config-settings-2'] || '{}');
    window.setInterval(function() {
        localStorage['xjst-config-settings-2'] = angular.toJson($scope.data);
    }, 1000);
}
