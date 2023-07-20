import React from 'react';
import Button from 'react-bootstrap/Button';

class ButtonItem extends React.Component {
    constructor(props) {
        super(props)
        this.onClickButtonItem = this.onClickButtonItem.bind(this)
    }

    onClickButtonItem() {
        this.props.onClickButtonItem(this.props.value)
    }

    render() {
        return (
            <Button
                variant="primary"
                onClick={this.onClickButtonItem}>
                {this.props.name}
            </Button>
        )
    }
}

export default ButtonItem;