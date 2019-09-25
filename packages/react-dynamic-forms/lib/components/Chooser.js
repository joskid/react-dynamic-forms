"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ChooserGroup = exports.Chooser = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _flexboxReact = require("flexbox-react");

var _flexboxReact2 = _interopRequireDefault(_flexboxReact);

var _formGroup = require("../js/formGroup");

var _formGroup2 = _interopRequireDefault(_formGroup);

var _renderers = require("../js/renderers");

var _actions = require("../js/actions");

var _style = require("../js/style");

require("react-virtualized/styles.css");

require("react-virtualized-select/styles.css");

var _reactVirtualizedSelect = require("react-virtualized-select");

var _reactVirtualizedSelect2 = _interopRequireDefault(_reactVirtualizedSelect);

require("../css/chooser.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  Copyright (c) 2015 - present, The Regents of the University of California,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  through Lawrence Berkeley National Laboratory (subject to receipt
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  of any required approvals from the U.S. Dept. of Energy).
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  This source code is licensed under the BSD-style license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  LICENSE file in the root directory of this source tree.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

//import "react-select/dist/react-select.css";


/**
 * React Form control to select an item from a list.
 */
var Chooser = exports.Chooser = function (_React$Component) {
    _inherits(Chooser, _React$Component);

    function Chooser(props) {
        _classCallCheck(this, Chooser);

        var _this = _possibleConstructorReturn(this, (Chooser.__proto__ || Object.getPrototypeOf(Chooser)).call(this, props));

        _this.state = { isFocused: false, focusChooser: false };
        _this.handleChange = _this.handleChange.bind(_this);
        return _this;
    }

    _createClass(Chooser, [{
        key: "handleMouseEnter",
        value: function handleMouseEnter() {
            this.setState({ hover: true });
        }
    }, {
        key: "handleMouseLeave",
        value: function handleMouseLeave() {
            this.setState({ hover: false });
        }
    }, {
        key: "handleFocus",
        value: function handleFocus() {
            if (!this.state.isFocused) {
                this.setState({ isFocused: true, oldValue: this.props.value });
            }
        }
    }, {
        key: "handleDone",
        value: function handleDone() {
            if (this.props.onBlur) {
                this.props.onBlur(this.props.name);
            }
            this.setState({ isFocused: false, hover: false, oldValue: null });
        }
    }, {
        key: "handleCancel",
        value: function handleCancel() {
            if (this.props.onChange) {
                var v = this.state.oldValue;
                this.props.onChange(this.props.name, v);
            }
            this.props.onBlur(this.props.name);
            this.setState({ isFocused: false, hover: false, oldValue: null });
        }
    }, {
        key: "isEmpty",
        value: function isEmpty(value) {
            return _underscore2.default.isNull(value) || _underscore2.default.isUndefined(value) || value === "";
        }
    }, {
        key: "isMissing",
        value: function isMissing() {
            var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.value;

            return this.props.required && !this.props.disabled && this.isEmpty(value);
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            var missing = this.props.required && !this.props.disabled && (_underscore2.default.isNull(this.props.value) || _underscore2.default.isUndefined(this.props.value) || this.props.value === "");
            var missingCount = missing ? 1 : 0;

            if (this.props.onMissingCountChange) {
                this.props.onMissingCountChange(this.props.name, missingCount);
            }
        }
    }, {
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(nextProps) {
            if (nextProps.selected && this.props.edit !== nextProps.edit && nextProps.edit === true) {
                this.setState({ focusChooser: true });
            }
            if (this.props.value !== nextProps.value || !this.props.value && nextProps.value || this.props.value && !nextProps.value) {
                // The value might have been missing and is now set explicitly
                // with a prop
                var missing = this.props.required && !this.props.disabled && (_underscore2.default.isNull(nextProps.value) || _underscore2.default.isUndefined(nextProps.value) || nextProps.value === "");
                var missingCount = missing ? 1 : 0;

                if (this.props.onMissingCountChange) {
                    this.props.onMissingCountChange(this.props.name, missingCount);
                }
            }
        }
    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate() {
            if (this.state.focusChooser) {
                //this.chooser.focus();
                this.setState({ focusChooser: false });
            }
        }
    }, {
        key: "handleChange",
        value: function handleChange(v) {
            var _ref = v || {},
                value = _ref.value;

            var missing = this.props.required && this.isEmpty(v);

            // If the chosen id is a number, cast it to a number
            if (!this.isEmpty(v) && !_underscore2.default.isNaN(Number(v))) {
                value = +v;
            }

            // Callbacks
            if (this.props.onChange) {
                this.props.onChange(this.props.name, value);
            }
            if (this.props.onMissingCountChange) {
                this.props.onMissingCountChange(this.props.name, missing ? 1 : 0);
            }
        }
    }, {
        key: "handleEditItem",
        value: function handleEditItem() {
            this.props.onEditItem(this.props.name);
        }
    }, {
        key: "getOptionList",
        value: function getOptionList() {
            var _this2 = this;

            return this.props.choiceList.map(function (item) {
                var disabled = false;
                var isDisabled = item.has("disabled") && item.get("disabled") === true;
                if (_underscore2.default.contains(_this2.props.disableList, item.get("id")) || isDisabled) {
                    disabled = true;
                }
                return { value: item.get("id"), label: item.get("label"), disabled: disabled };
            }).toJS();
        }
    }, {
        key: "getFilteredOptionList",
        value: function getFilteredOptionList(input) {
            var items = this.props.choiceList;
            var filteredItems = input ? items.filter(function (item) {
                return item.label.toLowerCase().indexOf(("" + input).toLowerCase()) !== -1;
            }) : items;
            var result = [];
            filteredItems.forEach(function (item) {
                return result.push({
                    value: "" + item.get("id"),
                    label: item.get("label"),
                    disabled: item.has("disabled") ? item["disabled"] : false
                });
            });
            return result;
        }
    }, {
        key: "getOptions",
        value: function getOptions(input, cb) {
            var options = this.getFilteredOptionList(input);
            if (options) {
                cb(null, { options: options, complete: true });
            }
        }
    }, {
        key: "getCurrentChoice",
        value: function getCurrentChoice() {
            var _this3 = this;

            var choiceItem = this.props.choiceList.find(function (item) {
                return item.get("id") === _this3.props.value;
            });
            return choiceItem ? choiceItem.get("id") : undefined;
        }
    }, {
        key: "getCurrentChoiceLabel",
        value: function getCurrentChoiceLabel() {
            var _this4 = this;

            var choiceItem = this.props.choiceList.find(function (item) {
                return item.get("id") === _this4.props.value;
            });
            return choiceItem ? choiceItem.get("label") : "";
        }
    }, {
        key: "render",
        value: function render() {
            var _this5 = this;

            var choice = this.getCurrentChoice();
            var isMissing = this.isMissing(this.props.value);

            if (this.props.edit) {
                var className = "";
                var chooserStyle = { marginBottom: 10, width: "100%" };
                var clearable = this.props.allowSingleDeselect;
                var searchable = !this.props.disableSearch;

                var matchPos = this.props.searchContains ? "any" : "start";

                var ctl = void 0;
                if (searchable) {
                    var options = this.getFilteredOptionList(null);
                    var labelList = _underscore2.default.map(options, function (item) {
                        return item.label;
                    });
                    var key = labelList + "--" + choice;
                    ctl = _react2.default.createElement(_reactVirtualizedSelect2.default
                    /*ref={chooser => {
                        this.chooser = chooser;
                    }}*/
                    , { className: isMissing ? "is-missing" : "",
                        key: key,
                        value: choice,
                        options: options,
                        openOnFocus: true,
                        disabled: this.props.disabled,
                        searchable: true,
                        matchPos: matchPos,
                        placeholder: this.props.placeholder,
                        onChange: function onChange(v) {
                            return _this5.handleChange(v);
                        }
                    });
                } else {
                    var _options = this.getOptionList();
                    var _labelList = _underscore2.default.map(_options, function (item) {
                        return item.label;
                    });
                    var _key = _labelList + "--" + choice;
                    ctl = _react2.default.createElement(_reactVirtualizedSelect2.default, {
                        ref: function ref(chooser) {
                            _this5.chooser = chooser;
                        },
                        className: isMissing ? "is-missing" : "",
                        key: _key,
                        value: choice,
                        options: _options,
                        openOnFocus: true,
                        disabled: this.props.disabled,
                        searchable: false,
                        matchPos: matchPos,
                        placeholder: this.props.placeholder,
                        clearable: clearable,
                        onChange: function onChange(v) {
                            return _this5.handleChange(v);
                        }
                    });
                }
                return _react2.default.createElement(
                    _flexboxReact2.default,
                    { flexDirection: "row", style: { width: "100%" } },
                    _react2.default.createElement(
                        "div",
                        {
                            className: className,
                            style: chooserStyle,
                            onFocus: function onFocus(e) {
                                return _this5.handleFocus(e);
                            }
                        },
                        ctl
                    ),
                    this.props.selected ? _react2.default.createElement(
                        "span",
                        { style: { marginTop: 5 } },
                        _react2.default.createElement(
                            "span",
                            {
                                style: (0, _style.inlineDoneButtonStyle)(5),
                                onClick: function onClick() {
                                    return _this5.handleDone();
                                }
                            },
                            "DONE"
                        ),
                        _react2.default.createElement(
                            "span",
                            {
                                style: (0, _style.inlineCancelButtonStyle)(),
                                onClick: function onClick() {
                                    return _this5.handleCancel();
                                }
                            },
                            "CANCEL"
                        )
                    ) : _react2.default.createElement("div", null)
                );
            } else {
                var s = this.getCurrentChoiceLabel();
                var view = this.props.view || _renderers.textView;
                var style = (0, _style.inlineChooserStyle)(false, false, !!view);

                var text = _react2.default.createElement(
                    "span",
                    { style: { minHeight: 28 } },
                    view(s, choice)
                );
                var edit = (0, _actions.editAction)(this.state.hover && this.props.allowEdit, function () {
                    return _this5.handleEditItem();
                });
                return _react2.default.createElement(
                    "div",
                    {
                        style: style,
                        onMouseEnter: function onMouseEnter() {
                            return _this5.handleMouseEnter();
                        },
                        onMouseLeave: function onMouseLeave() {
                            return _this5.handleMouseLeave();
                        }
                    },
                    text,
                    edit
                );
            }
        }
    }]);

    return Chooser;
}(_react2.default.Component);

Chooser.propTypes = {
    /**
     * The identifier of the field being edited. References back into
     * the Form's Schema for additional properties of this field
     */
    field: _propTypes2.default.string.isRequired,

    /**
     * Pass in the available list of options as a Immutable.List of objects. Each
     * object contains a "id" and the user visible "label". For example:
     *
     * Immutable.fromJS([
     *     { id: 1, label: "Dog" },
     *     { id: 2, label: "Duck" },
     *     { id: 3, label: "Cat" }
     * ]);
     *
     */
    choiceList: _propTypes2.default.object.isRequired,

    /**
     * If the chooser should be shown as disabled
     */
    disabled: _propTypes2.default.bool,

    /**
     * If true the chooser becomes a simple pulldown menu
     * rather than allowing the user to type into it to search
     * though the entries
     */
    disableSearch: _propTypes2.default.bool,

    /**
     * Customize the horizontal size of the Chooser
     */
    width: _propTypes2.default.number,

    /**
     * Add a [x] icon to the chooser allowing the user to clear the selected value
     */
    allowSingleDeselect: _propTypes2.default.bool,

    /**
     * Can be "any" or "start", indicating how the search is matched within the items (anywhere, or starting with)
     */
    searchContains: _propTypes2.default.oneOf(["any", "start"])
};

Chooser.defaultProps = {
    disabled: false,
    disableSearch: false,
    searchContains: "any",
    allowSingleDeselect: false,
    width: 300
};

var ChooserGroup = exports.ChooserGroup = (0, _formGroup2.default)(Chooser, "Chooser");