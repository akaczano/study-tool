import { Container, Spinner, Form, Row, Col, Table, Button, Stack } from "react-bootstrap";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { fetchChart, Chart } from "../../api/charts";

type ChartData = {
    columnHeaders: string[],
    rowHeaders: string[],
    rows: string[][]
}

function EditChart() {
    const { chartId } = useParams();

    const query = useQuery({
        queryKey: ["chart", chartId],
        queryFn: () => fetchChart(parseInt(chartId?.toString() || ""))
    })

    const [input, setInput] = useState<Chart>({
        description: "",
        groupId: -1,
        language: ""  
    });


    const [data, setData] = useState<ChartData>({
        columnHeaders: [],
        rowHeaders: [],
        rows: []
    });

    if (query.isPending) {
        return <Spinner />
    }
    else if (query.error) {
        return <p style={{ color: 'red'}}>{query.error.message}</p>
    }

    const existingData = JSON.parse(query.data.data);
    const renderChart = (cd: ChartData) => {
        if (!cd) {
            return (
                <Table style={{ fontSize: "24px" }}>
                    <tbody>
                        <p>Empty chart</p>
                    </tbody>
                </Table>
            )
        }
        return (
            <Table>
                <thead>
                    <tr>
                        {cd.columnHeaders?.map(ch => {
                            return <th>{ch}</th>;
                        })}
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </Table>
        );
    }

    return (
        <Container style={{ marginTop: "15px"}}>
            <Row>
                <Form.Control
                    type="text"
                    style={{ fontSize: "35px"}}
                    value={input.description || query.data.description}
                    onChange={e => setInput({ ...input, description: e.target.value })} />
            </Row>
            <Row>
                {renderChart(data || existingData)}
            </Row>
            <Row>
                <Stack direction="horizontal" gap={3}>
                    <Button variant="primary">Add Row</Button>
                    <Button variant="primary">Add Column</Button>
                    <Form.Check label="Column Headers" />
                    <Form.Check label="Row Headers" />
                </Stack>
            </Row>
        </Container>
    )
}

export default EditChart;