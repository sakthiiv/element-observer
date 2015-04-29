angular.module("observerApp").directive("elementObserver", function () {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var options = scope[attrs.elementObserver]
                , observerObj = new ElementObserver();

            if (!options) {
                return;
            }

            if (!options.eventType) {
                options.eventType = 'change';
            }

            //Prevent re-attachment of the event
            elem.off(options.eventType);
            elem.on(options.eventType, function (e) {
                var isdataModified = observerObj.compareValues(options, e);

                if (options.onTrackerChange) {
                    obj = options.onTrackerChange(isdataModified);
                    scope.$apply();
                }

            });


            /**
             * ChangeTracker Utility Class
             */
            function ElementObserver() { }

            ElementObserver.prototype.getElementValue = function (evt) {
                var returnValue = null;
                switch (evt.currentTarget.type) {
                    case 'checkbox':
                        returnValue = evt.currentTarget.checked;
                        break;
                    case 'radio':
                    case 'text':
                    case 'select-one':
                        returnValue = evt.currentTarget.value;
                        break;
                    case 'select-multiple':
                        returnValue = this.getSelectMultiple(evt.currentTarget.selectedOptions);
                        break;
                }
                return returnValue;
            };

            /**
             * Get the values selected in the form of array for multiple select
             */
            ElementObserver.prototype.getSelectMultiple = function (arr) {
                var selected = [];
                for (var i = 0; i < arr.length; i++) {
                    selected.push(arr[i].value);
                }
                return selected;
            };

            /**
             * Get the default value to check
             */
            ElementObserver.prototype.getDefaultValue = function (options, evt) {
                var value = "";
                if (options.isGroup && options.defaultValue.hasOwnProperty(evt.currentTarget.name)) {
                    value = options.defaultValue[evt.currentTarget.name];
                } else {
                    value = options.defaultValue;
                }

                return value;
            }

            /**
             * Compare the default value with the new value
             */
            ElementObserver.prototype.compareValues = function (options, evt) {
                var newValue = this.getElementValue(evt), defValue = this.getDefaultValue(options, evt), key, ctrl, cur, isModified, i, j;
                if (options.isGroup) {
                    for (key in options.defaultValue) {
                        ctrl = $('[name="' + key + '"]');
                        for (i = 0; i < ctrl.length; i++) {
                            if (isModified) break;
                            cur = ctrl[i];
                            switch (cur.type) {
                                case 'checkbox':
                                    isModified = options.defaultValue[key] !== cur.checked;
                                    break;
                                case 'radio':
                                    for (j = 0; j < ctrl.length; j++) {
                                        if (isModified) break;
                                        if (ctrl[j].value !== options.defaultValue[key])
                                            isModified = ctrl[j].checked;
                                    }
                                    break;
                                case 'text':
                                    isModified = options.defaultValue[key] !== cur.value;
                                    break;
                            }
                        }
                    }
                    return isModified;
                } else {
                    return angular.isArray(defValue) ? !this.arrayEquals(defValue, newValue) : defValue !== newValue;
                }
            }

            /**
             * Compare the default value with the new value (array)
             */
            ElementObserver.prototype.arrayEquals = function (defValue, newValue) {
                if (!newValue)
                    return false;
                if (defValue.length != newValue.length)
                    return false;

                for (var i = 0, l = defValue.length; i < l; i++) {
                    if (defValue[i] instanceof Array && newValue[i] instanceof Array) {
                        if (!this.arrayEquals(defValue[i], newValue[i]))
                            return false;
                    }
                    else if (defValue[i] != newValue[i]) {
                        return false;
                    }
                }
                return true;
            }
        }
    }
});