import React, { useState } from "react";
import {
    Container,
    Stack,
    Button,
    Row,
    Col,
    Form,
    Spinner
} from 'react-bootstrap';
import { useQuery } from "@tanstack/react-query";
import ChartGroups from "../components/charts/ChartGroups";
import GroupModal from "../components/charts/GroupModal";
import { fetchLanguages } from "../api/constants";

function Charts() {

    const [groupModal, setGroupModal] = useState(false);
    const [language, setLanguage] = useState("GREEK");

    const languageQuery = useQuery({ queryKey: ["languages"], queryFn: fetchLanguages })

    const getLangInput = () => {
        if (languageQuery.isPending) {
            return <div><Spinner size="sm" />Loading...</div>
        }
        else if (languageQuery.error) {
            return <span style={{ color: "red"}}>{languageQuery.error.message}</span>
        }
        else {
            return (
                <Form.Select value={language} onChange={e => setLanguage(e.target.value)}>
                    {languageQuery.data.map((l: string) => {
                        return (
                            <option key={`chart_lang_${l}`} value={l}>
                                {l}
                            </option>
                        )
                    })}
                </Form.Select>
            )
        }
    }

    return(
        <Container>
            <GroupModal show={groupModal} onHide={() => setGroupModal(false)}/>
            <Row style={{ marginTop: "1%"}}>
                <Col md={9}>
                    <h1>Charts</h1>
                </Col>
                <Col md={3}>
                    {getLangInput()}
                </Col>
            </Row>

            <hr />
            <Stack gap={3}>
                <ChartGroups language={language} />
                <Stack gap={2} direction="horizontal">
                    <Button variant="primary" onClick={() => setGroupModal(true)}>
                        + Group
                    </Button>                    
                </Stack>
            </Stack>
            



        </Container>
    );
}

export default Charts;