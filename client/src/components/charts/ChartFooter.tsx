import { Button, Stack, Form } from "react-bootstrap";

import { ChartProps } from "./Chart";
import { data } from "react-router-dom";

function ChartFooter(props: { info: ChartProps}) {
    const { info } = props;

    if (info.isPending || info.error) return null;

    const chart = info.chartInput.dirty ? info.chartInput.input : info.chart
    
    if (!chart) return null;

    const rows = chart.rows;
    const rowCount = rows.length;
    const colCount = rows[0].length;

    const transformChart = (tf: (oldRows: string[][]) => string[][]) => {        
        const newRows = tf(rows);
        info.setChartInput({ dirty: true, input: { ...chart, rows: newRows } });
    }

    const addRow = (oldRows: string[][]) => {                
        if (oldRows.length < 1) return oldRows;
        return [
            ...oldRows,
            oldRows[0].map(_ => "")
        ]        
    }
    const addCol = (oldRows: string[][]) => {        
        return oldRows.map(r => [...r, ""]);        
    }

    const delRow = (oldRows: string[][]) => {
        return oldRows.slice(0, -1);
    }

    const delCol = (oldRows: string[][]) => {
        return oldRows.map(r => r.slice(0, -1));
    }
 
    if (info.mode === 1) {
        return (
            <Stack direction="horizontal" gap={3}>
                <Button variant="primary" onClick={() => transformChart(addRow)}>Add Row</Button>
                <Button variant="primary" onClick={() => transformChart(addCol)}>Add Column</Button>
                <Button variant="danger" onClick={() => transformChart(delRow)} disabled={ rowCount < 2 }>
                    - Row
                </Button>
                <Button variant="danger" onClick={() => transformChart(delCol)} disabled={ colCount < 2 }>
                    - Col
                </Button>
                <Form.Check 
                    label="Column Headers"
                    checked={chart.columnHeaders}
                    onChange={e => info.setChartInput({ dirty: true, input: { ...chart, columnHeaders: e.target.checked }})}/>
                <Form.Check
                    label="Row Headers"
                    checked={chart.rowHeaders}
                    onChange={e => info.setChartInput({ dirty: true, input: { ...chart, rowHeaders : e.target.checked }})}/>
            </Stack>
        )
    }
    return null;
}

export default ChartFooter;