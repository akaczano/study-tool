import { Container, Spinner, Form, Row, Col, Table, Button, Stack } from "react-bootstrap";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";

import { fetchChart, Chart } from "../../api/charts";

const MODE_VIEW = 0;
const MODE_EDIT = 1;
const MODE_QUIZ = 2;

type ChartData = {
    columnHeaders?: string[],
    rowHeaders?: string[],
    rows: string[][]
}

function EditChart() {
    const { chartId } = useParams();

    const query = useQuery({
        queryKey: ["chart", chartId],
        queryFn: () => fetchChart(parseInt(chartId?.toString() || ""))
    })

    const [edit, setEdit] = useState(false);

    const [input, setInput] = useState<Chart>({
        description: "",
        groupId: -1,
        language: ""  
    });


    const [data, setData] = useState<ChartData>({
        columnHeaders: [],
        rowHeaders: [],
        rows: [[""]]
    });

    const addRow = () => {
        setData({
            ...data,
            rows: [...data.rows, data.rows[0].map(_ => "")],
            rowHeaders: data.rowHeaders? [...data.rowHeaders, ""] : undefined
        })
    }

    const delRow = () => {
        setData({
            ...data,
            rows: data.rows.slice(0, -1)
        })
    }

    const addCol = () => {
        setData({
            ...data,
            rows: data.rows.map(r => [...r, ""]),
            columnHeaders: data.columnHeaders ? [...data.columnHeaders, ""] : undefined
        })
    }

    const delCol = () => {
        setData({
            ...data,
            rows: data.rows.map(r => r.slice(0, -1)),
            columnHeaders: data.columnHeaders ? data.columnHeaders.slice(0, -1) : undefined           
        })
    }

    const setColHeaders = (val: boolean) => {
        if (val && data.rows.length > 0) {
            setData({
                ...data,
                columnHeaders: data.rows[0].map(_ => "")
            })
        }
        else {
            setData({
                ...data,
                columnHeaders: undefined
            })
        }
    }

    const setRowHeaders = (val: boolean) => {
        if (val) {
            setData({
                ...data,
                rowHeaders: data.rows.map(_ => "")
            })
        }
        else {
            setData({
                ...data,
                rowHeaders: undefined
            })
        }
    }

    const renderCell = (chart:Chart, i: number, j: number, style={}) => {
        if (edit) {
            return (
                <Form.Control
                    type="text"
                    style={style} />
            )
        }
        else {
            return <span>{chart.data ? chart.data[i][j] : ""}</span>
        }
    }


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
                            return (
                                <th><Form.Control type="text" /></th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {cd.rows.map((r, idx) => {
                        return (                            
                            <tr>
                                {cd.rowHeaders ? (
                                    <th><Form.Control type="text" value={cd.rowHeaders[idx]} /></th> )
                                    : null}
                                {r.map(c => {
                                    return (
                                        <td><Form.Control type="text" /></td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        );
    }

    return (
        <Container style={{ marginTop: "15px"}}>
            <Row style={{ paddingTop: "1%", paddingBottom: "1%"}}>
                <Col md={2}>
                    <NavLink to="/charts">Back to groups</NavLink>
                </Col>
                <Col>
                    <Form.Check type="switch" label="Edit" checked={edit} onChange={e => setEdit(e.target.checked)} />
                </Col>
            </Row>
            <Row>
                <Form.Control
                    type="text"
                    style={{ fontSize: "35px"}}
                    value={input.description || query.data.description}
                    onChange={e => setInput({ ...input, description: e.target.value })} />
            </Row>
            <Row style={{ paddingTop: "5%"}}>
                {renderChart(data || existingData)}
            </Row>
            <Row>
                <Stack direction="horizontal" gap={3}>
                    <Button variant="primary" onClick={addRow}>Add Row</Button>
                    <Button variant="primary" onClick={addCol}>Add Column</Button>
                    <Button variant="danger" onClick={delRow}>- Row</Button>
                    <Button variant="danger" onClick={delCol}>- Col</Button>
                    <Form.Check label="Column Headers" onChange={e => setColHeaders(e.target.checked)} />
                    <Form.Check label="Row Headers" onChange={e => setRowHeaders(e.target.checked)} />
                </Stack>
            </Row>
        </Container>
    )
}

export default EditChart;