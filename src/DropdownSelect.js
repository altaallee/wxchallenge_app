import React from 'react';
import Form from 'react-bootstrap/Form';

class DropdownSelect extends React.Component {
    constructor(props) {
        super(props)
        this.onClickDropdownItem = this.onClickDropdownItem.bind(this)
    }

    onClickDropdownItem(e) {
        this.props.onClickDropdownItem(e.target.value)
    }

    render() {
        const formItems = this.props.items.map((values) => {
            return (
                <option
                    value={values}
                    key={values} >
                    {values}
                </option>)
        })
        return (
            <div>
                <Form.Select
                    defaultValue={this.props.selected}
                    onChange={this.onClickDropdownItem}>
                    {formItems}
                </Form.Select>
            </div>
        )
    }
}

export default DropdownSelect;