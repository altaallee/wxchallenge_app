import React from 'react';
import Plot from 'react-plotly.js';

class PlotlyPlot extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            yrange: []
        }
        this.onRelayout = this.onRelayout.bind(this)
    }

    onRelayout(e) {
        if (e["xaxis.range[0]"]) {
            this.props.onRelayout(e)
        }
        if (e["yaxis.range[0]"]) {
            this.setState({
                yrange: [e["yaxis.range[0]"], e["yaxis.range[1]"]]
            })
        }
        if (e["xaxis.autorange"]) {
            this.props.onAutolayout()
            this.setState({
                yrange: undefined
            })
        }
    }

    render() {
        return (
            <Plot
                data={this.props.data}
                layout={{
                    title: this.props.title,
                    xaxis: {
                        title: this.props.xlabel,
                        range: this.props.xrange
                    },
                    xaxis2: {
                        anchor: 'y',
                        fixedrange: true,
                        overlaying: 'x',
                        range: [0, 1],
                        visible: false
                    },
                    yaxis: {
                        title: this.props.ylabel,
                        range: this.state.yrange
                    },
                    yaxis2: {
                        anchor: 'x',
                        fixedrange: true,
                        overlaying: 'y',
                        range: [0, 1],
                        visible: false
                    },
                    height: 600,
                    autosize: true
                }}
                onRelayout={this.onRelayout}
                config={{
                    responsive: true
                }}
                style={{
                    width: '100%'
                }}
                useResizeHandler />
        )
    }
}

export default PlotlyPlot;