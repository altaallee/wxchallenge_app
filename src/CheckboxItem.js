import React from 'react';
import Form from 'react-bootstrap/Form';

class CheckboxItem extends React.Component {
    constructor(props) {
        super(props)
        this.onClickCheckboxItem = this.onClickCheckboxItem.bind(this)
    }

    onClickCheckboxItem(e) {
        this.props.onClickCheckboxItem(e)
    }

    render() {
        return (
            <Form.Check
                inline
                label={this.props.label}
                checked={this.props.checked}
                value={this.props.value}
                key={this.props.value}
                type="checkbox"
                onChange={this.onClickCheckboxItem} />
        )
    }
}

export default CheckboxItem;