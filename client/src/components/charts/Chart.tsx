import { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Container, Row, Col, Spinner, Button, Table, Stack, Form } from "react-bootstrap";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; 

import { fetchChart, updateChart } from "../../api/charts";
import ChartContent from "./ChartContent";
import ChartFooter from "./ChartFooter";
import ChartTitle from "./ChartTitle";

const MODE_VIEW = 0;
const MODE_EDIT = 1;
const MODE_PRACTICE = 2;

type ChartData = {
    columnHeaders: boolean,
    rowHeaders: boolean,
    rows: string[][]
}

type StringInput = {
    dirty: boolean,
    input: string
}
type DataInput = {
    dirty: boolean,
    input: ChartData
}

export type ChartProps = {
    isPending: boolean,
    error: Error | null,
    mode: 0 | 1 | 2,
    language: string,
    description: string,
    chart: ChartData,
    descInput: StringInput,
    setDescInput: (i: StringInput) => void
    chartInput: DataInput,
    setChartInput: (i: DataInput) => void,
    quizInput: string[][] | null,
    setQuizInput: (i: string[][] | null) => void
}

const defaultChart = {
    columnHeaders: true,
    rowHeaders: false,
    rows: [
        ["", ""],
        ["", ""],
        ["", ""]
    ]
}


function Chart() {

    const { chartId } = useParams()

    const [mode, setMode] = useState<0 | 1 | 2>(MODE_VIEW);
    const [descInput, setDescInput] = useState({
        dirty: false,
        input: ""
    });
    const [dataInput, setDataInput] = useState({
        dirty: false,
        input: defaultChart
    });

    const [quizInput, setQuizInput] = useState<string[][] | null>(null);

    const queryClient = useQueryClient();
    const query = useQuery({
        queryKey: ["chart", chartId],
        queryFn: () => fetchChart(parseInt(chartId?.toString() || ""))
    })

    const mutation = useMutation({
        mutationFn: updateChart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["chart", chartId] });
            queryClient.invalidateQueries({ queryKey: ["charts"] });
            setDescInput({ dirty: false, input: ""});
            setDataInput({ dirty: false, input: defaultChart })
        }
    })

    const info: ChartProps = {
        isPending: query.isPending,
        error: query.error,
        mode: mode,
        language: query.data?.language || "GREEK",
        description: query.data?.description,
        chart: JSON.parse(query.data?.data || "null"),
        descInput: descInput,
        setDescInput: setDescInput,
        chartInput: dataInput,
        setChartInput: setDataInput,
        quizInput,
        setQuizInput
    }

    const saveChart = () => {
        const newChart = {
            id: query.data.id,
            groupId: query.data.groupId,
            language: query.data.language,
            description: descInput.dirty ? descInput.input : query.data.description,
            data: dataInput.dirty ? JSON.stringify(dataInput.input) : query.data.data
        }
        mutation.mutate(newChart);
    }

    return (
        <Container>
            <Row style={{ marginTop: "1%"}}>
                <Col md={2}>
                    <NavLink to="/charts">Back to groups</NavLink>
                </Col>
                <Col md={3}>                    
                    <Form.Check
                        type="radio"
                        inline 
                        label="View" 
                        checked={mode === MODE_VIEW} 
                        onChange={e => e.target.checked ? setMode(MODE_VIEW) : null } />
                    <Form.Check
                        type="radio"
                        inline 
                        label="Edit" 
                        checked={mode === MODE_EDIT} 
                        onChange={e => e.target.checked ? setMode(MODE_EDIT) : null } />
                    <Form.Check
                        type="radio"
                        inline 
                        label="Practice" 
                        checked={mode === MODE_PRACTICE} 
                        onChange={e => e.target.checked ? setMode(MODE_PRACTICE) : null } />
                </Col>
                <Col>
                    { mode === MODE_EDIT ? (
                        <div style={{ float: "right" }}>
                            <Button 
                                size="sm"
                                variant="primary" 
                                onClick={saveChart} 
                                disabled={mutation.isPending || (!descInput.dirty && !dataInput.dirty)}>
                                { mutation.isPending ? <Spinner size="sm" /> : "Save" }
                            </Button>
                        </div>                  
                    ) : null }  
                </Col>
            </Row>
            <Row style={{ marginBottom: "1%", marginTop: "1%" }}>
                <ChartTitle info={info} />
            </Row>
            <Row>
                <ChartContent info={info} />
            </Row>
            <Row>
                <ChartFooter info={info} />
            </Row>
        </Container>
    )

}

export default Chart;