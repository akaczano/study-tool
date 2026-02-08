import { Button, Col, Row, Spinner, Stack, Table } from "react-bootstrap";
import { ChartProps } from "./Chart";
import ChartCell from "./ChartCell";

function ChartContent(props: { info: ChartProps}) {
    const { info } = props;    

    if (info.isPending) {
        return (
            <div>
                <Spinner /> 
                <h2>Loading</h2>
            </div>
        )
    }
    else if (info.error) {
        return (
            <p style={{ color: "red"}}>
                {info.error.message}
            </p>
        )
    }    
    else if (!info.chart && !info.chartInput.dirty) {
        return (            
            <Col style={{padding: "3%" }}>
                <p style={{ fontSize: "20px" }}>
                    This chart does not have any content yet.
                </p>
                <Button onClick={() => info.setChartInput({ ...info.chartInput, dirty: true })}>
                    Add Content
                </Button>
            </Col>
        )
    }
    else {

        const data = info.chartInput.dirty ? info.chartInput.input : info.chart;        
        const head = data.columnHeaders ? data.rows[0] : [];
        const body = data.columnHeaders ? data.rows.slice(1) : data.rows;

        const performUpdate = (i: number, j: number, s: string) => {
            info.setChartInput({
                dirty: true,
                input: {
                    ...data,
                    rows: data.rows.map((r, idx) => r.map((c, jdx) => (i === idx && j === jdx) ? s : c)),
                }
            })
        }

        return (
            <Table>
                <thead>
                    <tr>
                        {head.map((s, i) => {
                            return (
                                <ChartCell
                                    language={info.language}
                                    header mode={info.mode}
                                    value={s}
                                    disabled={data.rowHeaders && i === 0} 
                                    updateValue={s => performUpdate(0, i, s) } />
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {body.map((row, i) => {
                        return (
                            <tr>
                                {row.map((s, j) => {
                                    return (
                                        <ChartCell
                                            language={info.language}
                                            header={data.rowHeaders && j === 0}
                                            mode={info.mode}
                                            value={s}
                                            updateValue={s => performUpdate(i + (data.columnHeaders ? 1 : 0), j, s)} />
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        )
    }

}

export default ChartContent;