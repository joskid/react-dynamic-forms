/**
 *  Copyright (c) 2015 - present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import Flexbox from "@g07cha/flexbox-react";
import _ from "lodash";
import React, { FunctionComponent } from "react";
import Form from "react-bootstrap/Form";
import { validate } from "revalidator";
import { formGroup, FormGroupProps } from "../../hoc/group";
// Styling
import "../../style/textedit.css";
import { editAction } from "../../util/actions";
import { textView } from "../../util/renderers";
import {
    colors,
    inlineCancelButtonStyle,
    inlineDoneButtonStyle,
    inlineStyle
} from "../../util/style";
import { FieldValue } from "../Form";

interface ValidationError {
    validationError: boolean;
    validationErrorMessage: string | null;
}

export interface TextEditProps {
    /**
     * Required on all Controls
     */
    field: string;

    /**
     * Customize the horizontal size of the Chooser
     */
    width?: number;

    /**
     * The TextEdit type, such as "password"
     */
    type?: string;

    /**
     * Rules to apply
     */
    rules?: any;

    /**
     * Optional view component to render when the field
     * isn't being editted.
     */
    view?: (value: FieldValue) => React.ReactElement<any>;
}

interface TextEditControlState {
    value: FieldValue;
    oldValue: FieldValue;
    isFocused: boolean;
    touched: boolean;
    selectText: boolean;
    hover: boolean;
}

// Props passed into the Chooser are the above Props combined with what is
// passed into the Group that wraps this.

export type TextEditControlProps = TextEditProps & FormGroupProps;

/**
 * This is the control code implemented here which wraps the bootstrap Input widget
 */
class TextEditControl extends React.Component<TextEditControlProps, TextEditControlState> {
    textInput: any;

    state = {
        value: null,
        oldValue: null,
        isFocused: false,
        touched: false,
        selectText: false,
        hover: false
    };

    static getDerivedStateFromProps(props: TextEditControlProps, state: TextEditControlState) {
        // Any time the current user changes,
        // Reset any parts of state that are tied to that user.
        // In this simple example, that's just the email.
        if (props.value !== state.value) {
            return {
                value: props.value
            };
        }
        return null;
    }

    constructor(props: TextEditControlProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
    }

    handleMouseEnter() {
        this.setState({ hover: true });
    }

    handleMouseLeave() {
        this.setState({ hover: false });
    }

    handleEditItem() {
        if (this.props.onEditItem) {
            this.props.onEditItem(this.props.name);
        }
    }

    isEmpty(value: FieldValue) {
        return _.isNull(value) || _.isUndefined(value) || value === "";
    }

    isMissing(value: FieldValue) {
        return this.props.required && !this.props.disabled && this.isEmpty(value);
    }

    getError(value: FieldValue) {
        const { name = "value", validation } = this.props;
        const result: ValidationError = {
            validationError: false,
            validationErrorMessage: null
        };

        // If the user has a field blank then that is never an error. Likewise if the field
        // is disabled then that is never an error.
        if (this.isEmpty(value) || this.props.disabled) {
            return result;
        }

        // Validate the value with Revalidator, given the rules in this.props.rules
        let obj = {};
        obj[name] = value;

        let properties = {};
        properties[name] = validation;

        const rules = validation ? { properties } : null;
        if (obj && rules) {
            const validation = validate(obj, rules, { cast: true });
            const str = name || "Value";

            let msg;
            if (!validation.valid) {
                msg = `${str} ${validation.errors[0].message}`;
                result.validationError = true;
                result.validationErrorMessage = msg;
            }
        }
        return result;
    }

    componentWillReceiveProps(nextProps: TextEditControlProps) {
        if (nextProps.selected && this.props.edit !== nextProps.edit && nextProps.edit === true) {
            this.setState({ selectText: true });
        }
        if (this.state.value !== nextProps.value && !this.state.isFocused) {
            this.setState({ value: nextProps.value });

            const missing = this.isMissing(nextProps.value);
            const { validationError: error } = this.getError(nextProps.value);

            // Broadcast error and missing states up to the parent
            if (this.props.onErrorCountChange) {
                this.props.onErrorCountChange(this.props.name, error ? 1 : 0);
            }
            if (this.props.onMissingCountChange) {
                this.props.onMissingCountChange(this.props.name, missing ? 1 : 0);
            }
        }
    }

    componentDidMount() {
        const missing = this.isMissing(this.props.value);
        const { validationError } = this.getError(this.props.value);

        // Initial error and missing states are fed up to the parent
        if (this.props.onErrorCountChange) {
            this.props.onErrorCountChange(this.props.name, validationError ? 1 : 0);
        }

        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(this.props.name, missing ? 1 : 0);
        }
    }

    componentDidUpdate() {
        if (this.state.selectText) {
            this.textInput.focus();
            this.textInput.select();
            this.setState({ selectText: false });
        }
    }

    handleChange(e: React.FormEvent<any>): void {
        const name = this.props.name;
        const value: string = (e.target as HTMLInputElement).value;

        this.setState({ value }, () => {
            const missing = this.props.required && this.isEmpty(value);
            const { validationError } = this.getError(value);
            let cast: FieldValue = value;

            // Callbacks
            if (this.props.onErrorCountChange) {
                this.props.onErrorCountChange(name, validationError ? 1 : 0);
            }

            if (this.props.onMissingCountChange) {
                this.props.onMissingCountChange(name, missing ? 1 : 0);
            }

            if (this.props.onChange) {
                if (_.has(this.props.rules, "type")) {
                    switch (this.props.rules.type) {
                        case "integer":
                            cast = value === "" ? null : parseInt(value, 10);
                            break;
                        case "number":
                            cast = value === "" ? null : parseFloat(value);
                            break;
                        //pass
                        default:
                    }
                }
                this.props.onChange(name, cast);
            }
        });
    }

    handleFocus(): void {
        if (!this.state.isFocused) {
            this.setState({ isFocused: true, oldValue: this.props.value });
        }
    }

    handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>): void {
        if (e.key === "Enter") {
            if (!e.shiftKey) {
                this.handleDone();
            }
        }
        if (e.keyCode === 27 /* ESC */) {
            this.handleCancel();
        }
    }

    handleDone() {
        if (this.props.onBlur) {
            this.props.onBlur(this.props.name);
        }
        this.setState({ isFocused: false, hover: false, oldValue: null });
    }

    handleCancel() {
        if (this.props.onChange) {
            const v = this.state.oldValue;
            let cast: FieldValue = v;
            if (_.has(this.props.rules, "type")) {
                // If we have a rule for the value to be either an interger or a number
                // then we parse the string to either an Int or Float and set the onChange
                // value to that
                if (_.isString(v)) {
                    switch (this.props.rules.type) {
                        case "integer":
                            cast = v === "" ? null : parseInt(v, 10);
                            break;
                        case "number":
                            cast = v === "" ? null : parseFloat(v);
                            break;
                        //pass
                        default:
                    }
                }
            }
            this.props.onChange(this.props.name, cast);
        }
        this.props.onBlur?.(this.props.name);
        this.setState({ isFocused: false, hover: false, oldValue: null });
    }

    render() {
        // Control state
        const isMissing = this.isMissing(this.props.value);
        const { validationError, validationErrorMessage } = this.getError(this.props.value);
        const value = this.state.value ? `${this.state.value}` : "";

        if (this.props.edit) {
            // Error style/message
            let className = "";
            const msg = validationError && this.state.touched ? validationErrorMessage : "";
            let helpClassName = "help-block";
            if (validationError && this.state.touched) {
                helpClassName += " has-error";
                className = "has-error";
            }

            // Warning style
            const style = isMissing ? { background: colors.MISSING_COLOR_BG } : {};
            const type = this.props.type || "text";

            const canCommit = !isMissing && !validationError;

            return (
                <Flexbox flexDirection="row" style={{ width: "100%" }}>
                    <div className={className} style={{ width: "100%" }}>
                        <Form.Control
                            value={value}
                            size="sm"
                            ref={(input: any) => {
                                this.textInput = input;
                            }}
                            style={style}
                            type={type}
                            disabled={this.props.disabled}
                            placeholder={this.props.placeholder}
                            onChange={this.handleChange}
                            onFocus={this.handleFocus}
                            onKeyUp={this.handleKeyPress}
                        />
                        <div className={helpClassName}>{msg}</div>
                    </div>
                    {this.props.selected ? (
                        <span style={{ marginTop: 3 }}>
                            {canCommit ? (
                                <span
                                    style={inlineDoneButtonStyle(5, true)}
                                    onClick={() => this.handleDone()}
                                >
                                    DONE
                                </span>
                            ) : (
                                <span style={inlineDoneButtonStyle(5, false)}>DONE</span>
                            )}

                            <span
                                style={inlineCancelButtonStyle()}
                                onClick={() => this.handleCancel()}
                            >
                                CANCEL
                            </span>
                        </span>
                    ) : (
                        <div />
                    )}
                </Flexbox>
            );
        } else {
            const view = this.props.view || textView;
            const text = isMissing ? (
                <span />
            ) : (
                <span style={{ minHeight: 28 }}>{view(value)}</span>
            );
            const edit = editAction(this.state.hover && this.props.allowEdit, () =>
                this.handleEditItem()
            );
            const style = inlineStyle(validationError, isMissing ? isMissing : false);
            return (
                <div
                    style={style}
                    key={`key-${isMissing}-${validationError}`}
                    onMouseEnter={() => this.handleMouseEnter()}
                    onMouseLeave={() => this.handleMouseLeave()}
                >
                    {text}
                    {edit}
                </div>
            );
        }
    }
}

/**
 * A `TextEditGroup` is a `TextEditControl` wrapped by the `formGroup()` HOC. This is the
 * component which can be rendered by the Form when the user adds a `TextEdit` to their `Form`.
 */
export const TextEditGroup = formGroup<TextEditProps>(TextEditControl);

/**
 * A control which allows the user to type into a single line input control
 */
export const TextEdit: FunctionComponent<TextEditProps> = () => <></>;