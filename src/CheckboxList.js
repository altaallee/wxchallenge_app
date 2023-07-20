import React from 'react';
import Form from 'react-bootstrap/Form';
import CheckboxItem from './CheckboxItem';

class CheckboxList extends React.Component {
    render() {
        const checkboxes = this.props.items.map((values) => {
            return (
                <CheckboxItem
                    checked={values.checked}
                    onClickCheckboxItem={this.props.onClickCheckboxItem}
                    label={values.label}
                    value={values.value}
                    key={values.value} />
            )
        })
        return (
            <Form>
                <div key={'inline-checkbox'} className="mb-3">
                    {checkboxes}
                </div>
            </Form>
        )
    }
}

export default CheckboxList;