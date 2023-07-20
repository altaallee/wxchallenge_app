import React from 'react';
import Loading from './Loading.js';
import Error from './Error_old.js';
import WxchallengeDropdownMenu from './WxchallengeDrowpdownMenu_old.js';
import WxchallengeCheckboxGroup from './WxchallengeCheckboxGroup_old.js';
import PlotlyPlot from './PlotlyPlot.js';
import WxchallengeToggleButtons from './WxchallengeToggleButtons_old.js';

class WxchallengeLite extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentLocation: "",
            modelVisibility: {
                "nbm3h": true,
                "nbm6h": false,
                "nbsmos": true,
                "nbemos": false,
                "namnest": true,
                "nam1h": true,
                "nam3h": false,
                "nammos": true,
                "gfs1h": true,
                "gfs3h": false,
                "gfsmos": true,
                "gefs": false,
                "geps": false,
                "hrrr": true,
                "rap": true,
                "wrfarw": true,
                "wrffv3": true,
                "metar": true,
                "nws": true,
            },
            maxRuns: 2,
            dataRequestMessage: false,
            dataRequestComplete: false,
            layout: {}
        }
        this.handleClickStationDropdown = this.handleClickStationDropdown.bind(this)
        this.handleClickRunsDropdown = this.handleClickRunsDropdown.bind(this)
        this.handleModelToggle = this.handleModelToggle.bind(this)
        this.toggleAllOn = this.toggleAllOn.bind(this)
        this.toggleAllOff = this.toggleAllOff.bind(this)
        this.traceLinesPush = this.traceLinesPush.bind(this)
        this.onRelayout = this.onRelayout.bind(this)
        this.loadData = this.loadData.bind(this)
    }

    locations = []
    tmp2m = {}
    wind10m = {}
    gustsfc = {}
    apcpsfc = {}

    handleClickStationDropdown(e) {
        this.setState({
            currentLocation: e.target.value
        })
    }

    handleClickRunsDropdown(e) {
        this.setState({
            maxRuns: e.target.value
        })
    }

    handleModelToggle(e) {
        this.setState({
            modelVisibility: {
                ...this.state.modelVisibility, [e.target.name]: e.target.checked
            }
        })
    }

    toggleAllOn() {
        let status = {};
        Object.keys(this.state.modelVisibility).forEach((key) => status[key] = true)
        this.setState({
            modelVisibility: status
        });
    }

    toggleAllOff() {
        let status = {};
        Object.keys(this.state.modelVisibility).forEach((key) => status[key] = false)
        this.setState({
            modelVisibility: status
        });
    }

    modelParameters = {
        nbm1h: { color: "#2ca02c", displayName: "NBM (1 hr)" },
        nbm3h: { color: "#2ca02c", displayName: "NBM (3 hr)" },
        nbm6h: { color: "#2ca02c", displayName: "NBM (6 hr)" },
        nbsmos: { color: "#2ca02c", displayName: "NBS MOS" },
        nbemos: { color: "#2ca02c", displayName: "NBE MOS" },
        namnest: { color: "#8c564b", displayName: "NAMNEST" },
        nam1h: { color: "#d62728", displayName: "NAM (1 hr)" },
        nam3h: { color: "#d62728", displayName: "NAM (3 hr)" },
        nammos: { color: "#7f7f7f", displayName: "NAM MOS" },
        gfs1h: { color: "#1f77b4", displayName: "GFS (1 hr)" },
        gfs3h: { color: "#1f77b4", displayName: "GFS (3 hr)" },
        gfsmos: { color: "#e377c2", displayName: "GFS MOS" },
        gefs: {color: "#393b79", displayName: "GEFS Mean" },
        geps: {color: "#637939", displayName: "GEPS Mean" },
        hrrr: { color: "#9467bd", displayName: "HRRR" },
        rap: { color: "#bcbd22", displayName: "RAP" },
        wrfarw: { color: "#ff7f0e", displayName: "WRF-ARW" },
        wrffv3: { color: "#8c6D31", displayName: "WRF-FV3" },
        nws: { color: "#17becf", displayName: "NWS" },
        metar: { color: "black", displayName: "Observations" }
    }

    modelInclusions = {
        "tmp2m": {
            "models": ["nbm1h", "nbm3h", "nbm6h", "nbsmos", "nbemos", "namnest",
                "nam1h", "nam3h", "nammos", "gfs1h", "gfs3h", "gfsmos", "gefs",
                "geps", "hrrr", "rap", "wrfarw", "wrffv3", "metar", "nws"],
            "title": "2-m Temperature",
            "ylabel": "Temperature [°F]"
        },
        "wind10m": {
            "models": ["nbm1h", "nbm3h", "nbm6h", "nbsmos", "nbemos", "namnest",
                "nam1h", "nam3h", "nammos", "gfs1h", "gfs3h", "gfsmos", "gefs",
                "geps", "hrrr", "rap", "wrfarw", "wrffv3", "metar", "nws"],
            "title": "10-m Wind and Gust",
            "ylabel": "Speed [kt]"
        },
        "gustsfc": {
            "models": ["nbm1h", "nbm3h", "nbm6h", "namnest", "nam1h", "nam3h",
                "gfs1h", "gfs3h", "hrrr", "rap", "wrfarw", "wrffv3", "metar"],
            "title": "10-m Gust",
            "ylabel": "Speed [kt]"
        },
        "apcpsfc": {
            "models": ["nbm1h", "nbm3h", "nbm6h", "nbsmos", "nbemos", "namnest",
                "nam1h", "nam3h", "gfs1h", "gfs3h", "gefs", "geps", "hrrr",
                "rap", "wrfarw", "wrffv3"],
            "title": "Total Accumulated Precipitation",
            "ylabel": "Precipitation [in]"
        },
    }

    traceLinesPush(x, y, modelName, date, run, i, color) {
        const linestyles = ['solid', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot',
            'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot']
        const widths = [2, 2, 1, 1, 0.5, 0.5, 0.25, 0.25, 0.25, 0.25, 0.25,
            0.25, 0.25, 0.25, 0.25, 0.25]
        const sizes = [6, 5, 4, 3, 2, 1, 0.5, 0.25, 0.25, 0.25, 0.25, 0.25,
            0.25, 0.25, 0.25, 0.25]
        var name = ""
        if (modelName === 'Observations') {
            name = 'Observations'
        } else {
            name = modelName + ' ' + date + ' ' + run + 'z'
        }

        return {
            x: x,
            y: y,
            name: name,
            type: 'scatter',
            mode: 'lines+markers',
            line: {
                dash: linestyles[i],
                width: widths[i]
            },
            marker: {
                color: color,
                size: sizes[i],
            }
        }
    }

    traceMarkersPush(x, y, modelName, date, run, i, color) {
        const sizes = [6, 5, 4, 3, 2.5, 2, 1.5, 1,
            0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
        var name = ""
        if (modelName === 'Observations') {
            name = 'Observations'
        } else {
            name = modelName + ' ' + date + ' ' + run + 'z'
        }

        return {
            x: x,
            y: y,
            name: name,
            type: 'scatter',
            mode: 'markers',
            marker: {
                size: sizes[i],
                symbol: 'diamond',
                color: color
            }
        }
    }

    traceCurrentDate() {
        const currentDate = new Date()
        const UTCNow = currentDate.getUTCFullYear() + "-" + (currentDate.getUTCMonth() + 1) + "-" + currentDate.getUTCDate() + " " + currentDate.getUTCHours() + ":" + String(currentDate.getUTCMinutes()).padStart(2, '0')
        return {
            x: [UTCNow, UTCNow],
            y: [0, 1],
            hoverinfo: 'skip',
            mode: 'lines',
            line: { 'color': 'black', 'width': 1 },
            showlegend: false,
            xaxis: 'x',
            yaxis: 'y2'
        }
    }

    traceFreezingLine() {
        return {
            x: [0, 1],
            y: [32, 32],
            hoverinfo: 'skip',
            mode: 'lines',
            line: { 'color': 'blue', 'dash': 'dot', 'width': 1 },
            showlegend: false,
            xaxis: 'x2',
            yaxis: 'y'
        }
    }

    traceForecastPeriod() {
        var traces = []
        for (let i = 0; i < 3; i++) {
            const currentDate = new Date()
            currentDate.setDate(currentDate.getDate() + i)
            const UTCDate = currentDate.getUTCFullYear() + "-" + (currentDate.getUTCMonth() + 1) + "-" + currentDate.getUTCDate() + " 6:00"
            traces.push({
                x: [UTCDate, UTCDate],
                y: [0, 1],
                hoverinfo: 'skip',
                mode: 'lines',
                line: { 'color': 'black', 'dash': 'dot', 'width': 1 },
                showlegend: false,
                xaxis: 'x',
                yaxis: 'y2'
            })
        }
        return traces
    }

    onRelayout(e) {
        this.setState({
            xrange: [e["xaxis.range[0]"], e["xaxis.range[1]"]]
        })
    }

    loadData() {
        let promisesData = []
        this.locations.forEach(location => {
            Object.keys(this.state.modelVisibility).forEach((modelName) => {
                promisesData.push(
                    new Promise((resolve, reject) => {
                        let xhr = new XMLHttpRequest()
                        xhr.open('GET', 'http://127.0.0.1:8001/wxchallenge/data?model=' + modelName + '&station=' + location)
                        xhr.responseType = 'json'
                        xhr.onreadystatechange = () => {
                            if (xhr.readyState === XMLHttpRequest.DONE) {
                                var status = xhr.status;
                                if (status >= 200 && status < 400 && xhr.response) {
                                    // The request has been completed successfully
                                    if (!(location in this.tmp2m)) {
                                        this.tmp2m[location] = {}
                                    }
                                    this.tmp2m[location][modelName] = xhr.response.map(
                                        (runData, i) =>
                                            this.traceLinesPush(runData.times, runData.tmp2m, this.modelParameters[modelName].displayName, runData.model_date, runData.run, i, this.modelParameters[modelName].color)
                                    )
                                    if (!(location in this.wind10m)) {
                                        this.wind10m[location] = {}
                                    }
                                    this.wind10m[location][modelName] = xhr.response.map(
                                        (runData, i) =>
                                            this.traceLinesPush(runData.times, runData.wind10m, this.modelParameters[modelName].displayName, runData.model_date, runData.run, i, this.modelParameters[modelName].color)
                                    )
                                    if (!(location in this.gustsfc)) {
                                        this.gustsfc[location] = {}
                                    }
                                    this.gustsfc[location][modelName] = xhr.response.map(
                                        (runData, i) =>
                                            this.traceMarkersPush(runData.times, runData.gustsfc, this.modelParameters[modelName].displayName, runData.model_date, runData.run, i, this.modelParameters[modelName].color)
                                    )
                                    if (!(location in this.apcpsfc)) {
                                        this.apcpsfc[location] = {}
                                    }
                                    this.apcpsfc[location][modelName] = xhr.response.map(
                                        (runData, i) =>
                                            this.traceLinesPush(runData.times, runData.apcpsfc, this.modelParameters[modelName].displayName, runData.model_date, runData.run, i, this.modelParameters[modelName].color)
                                    )

                                    resolve()
                                } else {
                                    // Oh no! There has been an error with the request!
                                    reject()
                                }
                            }
                        }
                        xhr.send()
                    })
                )
            })
        })

        Promise.all(promisesData).then(() => {
            this.setState({
                tmp2m: this.tmp2m,
                wind10m: this.wind10m,
                gustsfc: this.gustsfc,
                apcpsfc: this.apcpsfc,
                dataRequestComplete: true
            })
        }).catch(() => {
            this.setState({
                dataRequestMessage: "Falied to get data files"
            })
        })
    }

    componentDidMount() {
        let promise_config = new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest()
            xhr.open('GET', 'http://127.0.0.1:8001/wxchallenge/config')
            xhr.responseType = 'json'
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    var status = xhr.status;
                    if (status >= 200 && status < 400) {
                        // The request has been completed successfully
                        this.locations = xhr.response.id
                        resolve()
                    } else {
                        // Oh no! There has been an error with the request!
                        reject()
                    }
                }
            }
            xhr.send()
        })

        promise_config.then(() => {
            this.loadData()
            this.setState({
                currentLocation: this.locations[0]
            })
        }).catch(() => {
            this.setState({
                dataRequestMessage: "Falied to get config file"
            })
        })
    }

    render() {
        if (this.state.dataRequestComplete) {
            const plots = Object.keys(this.modelInclusions).map(
                (product) => {
                    if (product === "wind10m") {
                        return (
                            <PlotlyPlot
                                data={Object.keys(
                                    this.state.modelVisibility
                                ).filter(
                                    model => (this.state.modelVisibility[model] && this.modelInclusions[product].models.includes(model))
                                ).map(
                                    (modelName) => this.state[product][this.state.currentLocation][modelName].slice(0, this.state.maxRuns)
                                ).concat(
                                    Object.keys(
                                        this.state.modelVisibility
                                    ).filter(
                                        model => (this.state.modelVisibility[model] && this.modelInclusions["gustsfc"].models.includes(model))
                                    ).map(
                                        (modelName) => this.state["gustsfc"][this.state.currentLocation][modelName].slice(0, this.state.maxRuns)
                                    )
                                ).concat(
                                    this.traceCurrentDate()
                                ).concat(
                                    this.traceForecastPeriod()
                                ).flat()}
                                key={product}
                                title={this.modelInclusions[product].title}
                                xlabel={"Date"}
                                xrange={this.state.xrange}
                                ylabel={this.modelInclusions[product].ylabel}
                                onRelayout={this.onRelayout} />
                        )
                    } else if (product === "gustsfc") {
                        return (<></>)
                    } else if (product === "tmp2m") {
                        return (
                            <PlotlyPlot
                                data={Object.keys(
                                    this.state.modelVisibility
                                ).filter(
                                    model => (this.state.modelVisibility[model] && this.modelInclusions[product].models.includes(model))
                                ).map(
                                    (modelName) => this.state[product][this.state.currentLocation][modelName].slice(0, this.state.maxRuns)
                                ).concat(
                                    this.traceCurrentDate()
                                ).concat(
                                    this.traceFreezingLine()
                                ).concat(
                                    this.traceForecastPeriod()
                                ).flat()}
                                key={product}
                                title={this.modelInclusions[product].title}
                                xlabel={"Date"}
                                xrange={this.state.xrange}
                                ylabel={this.modelInclusions[product].ylabel}
                                onRelayout={this.onRelayout} />
                        )
                    } else {
                        return (
                            <PlotlyPlot
                                data={Object.keys(
                                    this.state.modelVisibility
                                ).filter(
                                    model => (this.state.modelVisibility[model] && this.modelInclusions[product].models.includes(model))
                                ).map(
                                    (modelName) => this.state[product][this.state.currentLocation][modelName].slice(0, this.state.maxRuns)
                                ).concat(
                                    this.traceCurrentDate()
                                ).concat(
                                    this.traceForecastPeriod()
                                ).flat()}
                                key={product}
                                title={this.modelInclusions[product].title}
                                xlabel={"Date"}
                                xrange={this.state.xrange}
                                ylabel={this.modelInclusions[product].ylabel}
                                onRelayout={this.onRelayout} />
                        )
                    }
                }
            )

            return (
                <div>
                    <div id="wxchallenge_dropdowns">
                        <WxchallengeDropdownMenu
                            locationTitle="Station"
                            locationValues={this.locations}
                            locationCurrentValue={this.state.currentLocation}
                            handleClickLocation={this.handleClickStationDropdown}
                            runTitle="Number of Runs"
                            runValues={[1, 2, 3, 4, 6, 8, 12, 16]}
                            runCurrentValue={this.state.maxRuns}
                            handleClickRun={this.handleClickRunsDropdown} />
                    </div>
                    <div id="model_toggle">
                        <WxchallengeToggleButtons
                            onTitle="Toggle All On"
                            onVariant="primary"
                            handleClickOn={this.toggleAllOn}
                            offTitle="Toggle All Off"
                            offVariant="danger"
                            handleClickOff={this.toggleAllOff} />
                        <WxchallengeCheckboxGroup
                            values={Object.keys(this.state.modelVisibility)}
                            alias={this.modelParameters}
                            checked={this.state.modelVisibility}
                            handleClick={this.handleModelToggle} />
                    </div>
                    <div id="plots">
                        {plots}
                    </div>
                </div>
            )
        } else if (this.state.dataRequestMessage) {
            return (
                <Error message={this.state.dataRequestMessage} />
            )
        } else {
            return (
                <Loading />
            )
        }
    }
}

export default WxchallengeLite;