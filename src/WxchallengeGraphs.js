import React from 'react';
import DropdownSelect from './DropdownSelect';
import Loading from './Loading';
import CheckboxList from './CheckboxList';
import PlotlyPlot from './PlotlyPlot';
import AlertMessage from './AlertMessage';
import ButtonItem from './ButtonItem';

class WxchallengeGraphs extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modelToggle: {
                "nbm3h": false,
                "nbm6h": false,
                "nbsmos": true,
                "nbemos": false,
                "namnest": true,
                "nam1h": true,
                "nam3h": true,
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
            maxRuns: 2
        }
        this.onClickStationDropdown = this.onClickStationDropdown.bind(this)
        this.onClickMaxRunsDropdown = this.onClickMaxRunsDropdown.bind(this)
        this.onClickModelCheckbox = this.onClickModelCheckbox.bind(this)
        this.toggleAllOn = this.toggleAllOn.bind(this)
        this.toggleAllOff = this.toggleAllOff.bind(this)
        this.onPlotlyRelayout = this.onPlotlyRelayout.bind(this)
        this.onPlotlyAutolayout = this.onPlotlyAutolayout.bind(this)
    }

    onClickStationDropdown(station) {
        this.setState({
            station: station
        })
    }

    onClickMaxRunsDropdown(maxRuns) {
        this.setState({
            maxRuns: maxRuns
        })
    }

    toggleAllOn() {
        let status = {};
        Object.keys(this.state.modelToggle).forEach((key) => status[key] = true)
        this.setState({
            modelToggle: status
        });
    }

    toggleAllOff() {
        let status = {};
        Object.keys(this.state.modelToggle).forEach((key) => status[key] = false)
        this.setState({
            modelToggle: status
        });
    }

    onClickModelCheckbox(e) {
        this.setState({
            modelToggle: {
                ...this.state.modelToggle, [e.target.value]: e.target.checked
            }
        })
    }

    onPlotlyRelayout(e) {
        this.setState({
            xrange: [e["xaxis.range[0]"], e["xaxis.range[1]"]]
        })
    }

    onPlotlyAutolayout() {
        this.setState({
            xrange: undefined
        })
    }

    traceLinesPush(x, y, modelName, date, run, i, color) {
        const linestyles = [
            'solid', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot',
            'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot']
        const widths = [
            2, 2, 1, 1, 0.5, 0.5, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
            0.25, 0.25, 0.25]
        const sizes = [
            6, 5, 4, 3, 2, 1, 0.5, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
            0.25, 0.25]
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
                size: sizes[i]
            }
        }
    }

    traceMarkersPush(x, y, modelName, date, run, i, color) {
        const sizes = [
            6, 5, 4, 3, 2.5, 2, 1.5, 1, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
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

    modelParameters = {
        nbm3h: { label: "NBM-3h", value: "nbm3h", color: "#2ca02c" },
        nbm6h: { label: "NBM-6h", value: "nbm6h", color: "#2ca02c" },
        nbsmos: { label: "NBS MOS", value: "nbsmos", color: "#2ca02c" },
        nbemos: { label: "NBE MOS", value: "nbemos", color: "#2ca02c" },
        namnest: { label: "NAM-NEST", value: "namnest", color: "#8c564b" },
        nam1h: { label: "NAM-1h", value: "nam1h", color: "#d62728" },
        nam3h: { label: "NAM-3h", value: "nam3h", color: "#d62728" },
        nammos: { label: "NAM MOS", value: "nammos", color: "#d62728" },
        gfs1h: { label: "GFS-1h", value: "gfs1h", color: "#1f77b4" },
        gfs3h: { label: "GFS-3h", value: "gfs3h", color: "#1f77b4" },
        gfsmos: { label: "GFS MOS", value: "gfsmos", color: "#e377c2" },
        gefs: { label: "GEFS", value: "gefs", color: "#393b79" },
        geps: { label: "GEPS", value: "geps", color: "#637939" },
        hrrr: { label: "HRRR", value: "hrrr", color: "#9467bd" },
        rap: { label: "RAP", value: "rap", color: "#bcbd22" },
        wrfarw: { label: "WRF-ARW", value: "wrfarw", color: "#ff7f0e" },
        wrffv3: { label: "WRF-FV3", value: "wrffv3", color: "#8c6D31" },
        metar: { label: "Observations", value: "metar", color: "black" },
        nws: { label: "NWS", value: "nws", color: "#17becf" },
    }

    modelVariables = {
        "tmp2m": {
            "models": [
                "nbm3h", "nbm6h", "nbsmos", "nbemos", "namnest", "nam1h",
                "nam3h", "nammos", "gfs1h", "gfs3h", "gfsmos", "gefs", "geps",
                "hrrr", "rap", "wrfarw", "wrffv3", "metar", "nws"],
            "title": "2-m Temperature",
            "ylabel": "Temperature [°F]"
        },
        "dpt2m": {
            "models": [
                "nbm3h", "nbm6h", "nbsmos", "nbemos", "namnest", "nam1h",
                "nam3h", "nammos", "gfs1h", "gfs3h", "gfsmos", "hrrr", "rap",
                "wrfarw", "wrffv3", "metar"
            ],
            "title": "2-m Dew Point",
            "ylabel": "Temperature [°F]"
        },
        "wind10m": {
            "models": [
                "nbm3h", "nbm6h", "nbsmos", "nbemos", "namnest", "nam1h",
                "nam3h", "nammos", "gfs1h", "gfs3h", "gfsmos", "gefs", "geps",
                "hrrr", "rap", "wrfarw", "wrffv3", "metar", "nws"],
            "title": "10-m Wind and Gust",
            "ylabel": "Speed [kt]"
        },
        "gustsfc": {
            "models": [
                "nbm3h", "nbm6h", "namnest", "nam1h", "nam3h", "gfs1h", "gfs3h",
                "hrrr", "rap", "wrfarw", "wrffv3", "metar"],
            "title": "10-m Gust",
            "ylabel": "Speed [kt]"
        },
        "winddir": {
            "models": [
                "nbm3h", "nbm6h", "nbsmos", "nbemos", "namnest", "nam1h",
                "nam3h", "nammos", "gfs1h", "gfs3h", "gfsmos", "gefs", "geps",
                "hrrr", "rap", "wrfarw", "wrffv3"],
            "title": "10-m Wind Direction",
            "ylabel": "Direction [degree]"
        },
        "tcdcclm": {
            "models": [
                "nbm3h", "nbm6h", "nbsmos", "nbemos", "namnest", "nam1h",
                "nam3h", "nammos", "gfs1h", "gfs3h", "gfsmos", "gefs", "geps",
                "hrrr", "rap", "wrfarw", "wrffv3"],
            "title": "Total Cloud Cover",
            "ylabel": "Coverage [%]"
        },
        "apcpsfc": {
            "models": [
                "nbm3h", "nbm6h", "nbsmos", "nbemos", "namnest", "nam1h",
                "nam3h", "gfs1h", "gfs3h", "gefs", "geps", "hrrr", "rap",
                "wrfarw", "wrffv3"],
            "title": "Total Accumulated Precipitation",
            "ylabel": "Precipitation [in]"
        },
    }

    stations = []
    tmp2m = {}
    dpt2m = {}
    wind10m = {}
    gustsfc = {}
    winddir = {}
    tcdcclm = {}
    apcpsfc = {}
    loadModelData() {
        let promisesModelData = []
        this.stations.forEach(station => {
            Object.keys(this.state.modelToggle).forEach((modelName) => {
                promisesModelData.push(
                    new Promise((resolve, reject) => {
                        let xhr = new XMLHttpRequest()
                        xhr.open('GET', 'http://127.0.0.1:8001/wxchallenge/data?model=' + modelName + '&station=' + station)
                        xhr.responseType = 'json'
                        xhr.onreadystatechange = () => {
                            if (xhr.readyState === XMLHttpRequest.DONE) {
                                var status = xhr.status;
                                if (status >= 200 && status < 400 && xhr.response) {
                                    if (!(station in this.tmp2m)) {
                                        this.tmp2m[station] = {}
                                    }
                                    this.tmp2m[station][modelName] = xhr.response.map(
                                        (runData, i) =>
                                            this.traceLinesPush(
                                                runData.times, runData.tmp2m,
                                                this.modelParameters[modelName].label,
                                                runData.model_date, runData.run,
                                                i,
                                                this.modelParameters[modelName].color)
                                    )
                                    if (!(station in this.dpt2m)) {
                                        this.dpt2m[station] = {}
                                    }
                                    this.dpt2m[station][modelName] = xhr.response.map(
                                        (runData, i) =>
                                            this.traceLinesPush(
                                                runData.times, runData.dpt2m,
                                                this.modelParameters[modelName].label,
                                                runData.model_date, runData.run,
                                                i,
                                                this.modelParameters[modelName].color)
                                    )
                                    if (!(station in this.wind10m)) {
                                        this.wind10m[station] = {}
                                    }
                                    this.wind10m[station][modelName] = xhr.response.map(
                                        (runData, i) =>
                                            this.traceLinesPush(
                                                runData.times, runData.wind10m,
                                                this.modelParameters[modelName].label,
                                                runData.model_date, runData.run,
                                                i,
                                                this.modelParameters[modelName].color)
                                    )
                                    if (!(station in this.gustsfc)) {
                                        this.gustsfc[station] = {}
                                    }
                                    this.gustsfc[station][modelName] = xhr.response.map(
                                        (runData, i) =>
                                            this.traceMarkersPush(
                                                runData.times, runData.gustsfc,
                                                this.modelParameters[modelName].label,
                                                runData.model_date, runData.run,
                                                i,
                                                this.modelParameters[modelName].color)
                                    )
                                    if (!(station in this.winddir)) {
                                        this.winddir[station] = {}
                                    }
                                    this.winddir[station][modelName] = xhr.response.map(
                                        (runData, i) =>
                                            this.traceMarkersPush(
                                                runData.times, runData.winddir,
                                                this.modelParameters[modelName].label,
                                                runData.model_date, runData.run,
                                                i,
                                                this.modelParameters[modelName].color)
                                    )
                                    if (!(station in this.tcdcclm)) {
                                        this.tcdcclm[station] = {}
                                    }
                                    this.tcdcclm[station][modelName] = xhr.response.map(
                                        (runData, i) =>
                                            this.traceMarkersPush(
                                                runData.times, runData.tcdcclm,
                                                this.modelParameters[modelName].label,
                                                runData.model_date, runData.run,
                                                i,
                                                this.modelParameters[modelName].color)
                                    )
                                    if (!(station in this.apcpsfc)) {
                                        this.apcpsfc[station] = {}
                                    }
                                    this.apcpsfc[station][modelName] = xhr.response.map(
                                        (runData, i) =>
                                            this.traceLinesPush(
                                                runData.times, runData.apcpsfc,
                                                this.modelParameters[modelName].label,
                                                runData.model_date, runData.run,
                                                i,
                                                this.modelParameters[modelName].color)
                                    )

                                    resolve()
                                } else {
                                    reject()
                                }
                            }
                        }
                        xhr.send()
                    })
                )
            })
        })

        Promise.all(promisesModelData).then(() => {
            this.setState({
                tmp2m: this.tmp2m,
                dpt2m: this.dpt2m,
                wind10m: this.wind10m,
                gustsfc: this.gustsfc,
                winddir: this.winddir,
                tcdcclm: this.tcdcclm,
                apcpsfc: this.apcpsfc,
                modelDataReadComplete: true
            })
        }).catch(() => {
            this.setState({
                modelDataReadFail: true
            })
        })
    }

    componentDidMount() {
        let configPromise = new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest()
            xhr.open("GET", "http://127.0.0.1:8001/wxchallenge/config")
            xhr.responseType = "json"
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    var status = xhr.status;
                    if (status >= 200 && status < 400) {
                        this.stations = xhr.response.id
                        this.setState({
                            currentStation: xhr.response.id[0],
                        })
                        resolve()
                    } else {
                        reject()
                    }
                }
            }
            xhr.send()
        })

        configPromise.then(() => {
            this.loadModelData()
        }).catch(() => {
            this.setState({
                configReadFail: true
            })
        })
    }

    render() {
        const models = [
            { label: "NBM-3h", value: "nbm3h", checked: this.state.modelToggle["nbm3h"] },
            { label: "NBM-6h", value: "nbm6h", checked: this.state.modelToggle["nbm6h"] },
            { label: "NBS MOS", value: "nbsmos", checked: this.state.modelToggle["nbsmos"] },
            { label: "NBE MOS", value: "nbemos", checked: this.state.modelToggle["nbemos"] },
            { label: "NAM-NEST", value: "namnest", checked: this.state.modelToggle["namnest"] },
            { label: "NAM-1h", value: "nam1h", checked: this.state.modelToggle["nam1h"] },
            { label: "NAM-3h", value: "nam3h", checked: this.state.modelToggle["nam3h"] },
            { label: "NAM MOS", value: "nammos", checked: this.state.modelToggle["nammos"] },
            { label: "GFS-1h", value: "gfs1h", checked: this.state.modelToggle["gfs1h"] },
            { label: "GFS-3h", value: "gfs3h", checked: this.state.modelToggle["gfs3h"] },
            { label: "GFS MOS", value: "gfsmos", checked: this.state.modelToggle["gfsmos"] },
            { label: "GEFS", value: "gefs", checked: this.state.modelToggle["gefs"] },
            { label: "GEPS", value: "geps", checked: this.state.modelToggle["geps"] },
            { label: "HRRR", value: "hrrr", checked: this.state.modelToggle["hrrr"] },
            { label: "RAP", value: "rap", checked: this.state.modelToggle["rap"] },
            { label: "WRF-ARW", value: "wrfarw", checked: this.state.modelToggle["wrfarw"] },
            { label: "WRF-FV3", value: "wrffv3", checked: this.state.modelToggle["wrffv3"] },
            { label: "Observations", value: "metar", checked: this.state.modelToggle["metar"] },
            { label: "NWS", value: "nws", checked: this.state.modelToggle["nws"] },
        ]

        if (this.state.modelDataReadComplete) {
            const plots = Object.keys(this.modelVariables).map(
                (product) => {
                    if (product === "wind10m") {
                        return (
                            <PlotlyPlot
                                data={Object.keys(
                                    this.state.modelToggle
                                ).filter(
                                    model => (this.state.modelToggle[model] && this.modelVariables[product].models.includes(model))
                                ).map(
                                    (modelName) => this.state[product][this.state.currentStation][modelName].slice(0, this.state.maxRuns)
                                ).concat(
                                    Object.keys(
                                        this.state.modelToggle
                                    ).filter(
                                        model => (this.state.modelToggle[model] && this.modelVariables["gustsfc"].models.includes(model))
                                    ).map(
                                        (modelName) => this.state["gustsfc"][this.state.currentStation][modelName].slice(0, this.state.maxRuns)
                                    )
                                ).concat(
                                    this.traceCurrentDate()
                                ).concat(
                                    this.traceForecastPeriod()
                                ).flat()}
                                key={product}
                                title={this.modelVariables[product].title}
                                xlabel={"Date"}
                                xrange={this.state.xrange}
                                ylabel={this.modelVariables[product].ylabel}
                                onRelayout={this.onPlotlyRelayout}
                                onAutolayout={this.onPlotlyAutolayout} />
                        )
                    } else if (product === "gustsfc") {
                        return (<></>)
                    } else if (product === "tmp2m") {
                        return (
                            <PlotlyPlot
                                data={
                                    Object.keys(
                                        this.state.modelToggle
                                    ).filter(
                                        model => (this.state.modelToggle[model] && this.modelVariables[product].models.includes(model))
                                    ).map(
                                        (modelName) => this.state[product][this.state.currentStation][modelName].slice(0, this.state.maxRuns)
                                    ).concat(
                                        this.traceCurrentDate()
                                    ).concat(
                                        this.traceFreezingLine()
                                    ).concat(
                                        this.traceForecastPeriod()
                                    ).flat()
                                }
                                key={product}
                                title={this.modelVariables[product].title}
                                xlabel={"Date"}
                                xrange={this.state.xrange}
                                ylabel={this.modelVariables[product].ylabel}
                                onRelayout={this.onPlotlyRelayout}
                                onAutolayout={this.onPlotlyAutolayout} />
                        )
                    } else {
                        return (
                            <PlotlyPlot
                                data={
                                    Object.keys(
                                        this.state.modelToggle
                                    ).filter(
                                        model => (this.state.modelToggle[model] && this.modelVariables[product].models.includes(model))
                                    ).map(
                                        (modelName) => this.state[product][this.state.currentStation][modelName].slice(0, this.state.maxRuns)
                                    ).concat(
                                        this.traceCurrentDate()
                                    ).concat(
                                        this.traceForecastPeriod()
                                    ).flat()
                                }
                                key={product}
                                title={this.modelVariables[product].title}
                                xlabel={"Date"}
                                xrange={this.state.xrange}
                                ylabel={this.modelVariables[product].ylabel}
                                onRelayout={this.onPlotlyRelayout}
                                onAutolayout={this.onPlotlyAutolayout} />
                        )
                    }
                }
            )
            return (
                <>
                    <div id="wxchallengeGraphsOptions">
                        <DropdownSelect
                            selected={this.state.station}
                            items={this.stations}
                            onClickDropdownItem={this.onClickStationDropdown} />
                        <DropdownSelect
                            selected={this.state.maxRuns}
                            items={[1, 2, 3, 4, 8, 16]}
                            onClickDropdownItem={this.onClickMaxRunsDropdown} />
                        <ButtonItem
                            name="All On"
                            onClickButtonItem={this.toggleAllOn} />
                        <ButtonItem
                            name="All Off"
                            onClickButtonItem={this.toggleAllOff} />
                        <CheckboxList
                            onClickCheckboxItem={this.onClickModelCheckbox}
                            items={models} />
                    </div>
                    {plots}
                </>
            )
        } else if (this.state.modelDataReadFail) {
            return (
                <AlertMessage message="Failed to get model data." />
            )
        } else if (this.state.configReadFail) {
            return (
                <AlertMessage message="Failed to get config file." />
            )
        } else {
            return (
                <Loading />
            )
        }

    }
}

export default WxchallengeGraphs;