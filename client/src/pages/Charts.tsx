import React, { useState } from "react";
import {
    Container,
    Stack,
    Button
} from 'react-bootstrap';
import ChartGroups from "../components/charts/ChartGroups";
import GroupModal from "../components/charts/GroupModal";

function Charts() {

    const [groupModal, setGroupModal] = useState(false);
    

    return(
        <Container>
            <GroupModal show={groupModal} onHide={() => setGroupModal(false)}/>
            <h1>Charts</h1>
            <hr />
            <Stack gap={3}>
                <ChartGroups />
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