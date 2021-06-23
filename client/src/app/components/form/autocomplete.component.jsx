import React        from 'react';
import deburr       from 'lodash/deburr';
import Downshift    from 'downshift';
import TextField    from '@material-ui/core/TextField';
import Paper        from '@material-ui/core/Paper';
import MenuItem     from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    container: {
        flexGrow: 1,
        position: 'relative',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
    },
    paper: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing(1),
        left: 0,
        right: 0,
    },
    divider: {
        height: theme.spacing(2),
    },
    noLabel: {
        marginTop: theme.spacing(3),
    },
});

class AutocompleteComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    renderInput = (inputProps) => {
        const {InputProps, classes, ref, ...other} = inputProps;
        return (
            <TextField
                InputProps={{
                    inputRef: ref,
                    classes: {
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    },
                    ...InputProps,
                }}
                {...other}
            />
        );
    }

    renderSuggestion = (suggestionProps) => {
        const {suggestion, index, itemProps, highlightedIndex, selectedItem} = suggestionProps;
        const isHighlighted = highlightedIndex === index;
        const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1;

        return (
            <MenuItem
                {...itemProps}
                key={suggestion.label}
                selected={isHighlighted}
                component="div"
                style={{
                    fontWeight: isSelected ? 500 : 400,
                }}
            >
                {suggestion.label}
            </MenuItem>
        );
    }

    getSuggestions = (suggestions, value, {showEmpty = true} = {}) => {
        const inputValue = deburr(value.trim()).toLowerCase();
        const inputLength = inputValue.length;
        let count = 0;
        return inputLength === 0 && !showEmpty
            ? []
            : suggestions.filter(suggestion => {
                const keep =
                    count < 5 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

                if (keep) {
                    count += 1;
                }

                return keep;
            });
    }

    render() {
        let popperNode;
        const { classes, placeholder, suggestions, initialSelectedItem, initialSelectedItemId} = this.props;
        return (
            <div className={classes.root}>
                <Downshift id="downshift-simple" initialSelectedItem={initialSelectedItem}>
                    {({
                          clearSelection,
                          getInputProps,
                          getItemProps,
                          getLabelProps,
                          getMenuProps,
                          highlightedIndex,
                          inputValue,
                          isOpen,
                          openMenu,
                          onChange,
                          onBlur
                      }) => {
                        const {onFocus, ...inputProps} = getInputProps({
                            placeholder: placeholder,
                            onFocus: openMenu,
                            onChange: event => {
                                if (event.target.value === '') {
                                    clearSelection();
                                    return;
                                }
                                console.log(event.target.value)
                            },
                            onBlur: event => {
                                console.log(initialSelectedItemId)
                            },
                        });

                        return (
                            <div className={classes.container}>
                                {this.renderInput({
                                    fullWidth: true,
                                    classes,
                                    InputLabelProps: getLabelProps({shrink: true}),
                                    InputProps: { onBlur, onChange, onFocus },
                                    inputProps,
                                })}

                                <div {...getMenuProps()}>
                                    {isOpen ? (
                                        <Paper className={classes.paper} square>
                                            {this.getSuggestions(suggestions, inputValue).map((suggestion, index) =>
                                                this.renderSuggestion({
                                                    suggestion,
                                                    index,
                                                    itemProps: getItemProps({item: suggestion.label}),
                                                    highlightedIndex,
                                                }),
                                            )}
                                        </Paper>
                                    ) : null}
                                </div>
                            </div>
                        );
                    }}
                </Downshift>
                <div className={classes.divider} />
            </div>
        );
    }
}

export default withStyles(styles)(AutocompleteComponent);
