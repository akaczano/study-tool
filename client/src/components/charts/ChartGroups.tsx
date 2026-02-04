import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Accordion, AccordionBody, Spinner, Button, ListGroup } from 'react-bootstrap';
import { ChartGroup, Chart, fetchGroups } from '../../api/charts';
import { data } from 'react-router-dom';




function ChartGroups() {

    const queryClient = useQueryClient();
    const query = useQuery({ queryKey: ["charts"], queryFn: fetchGroups })

    if (query.isPending) {
        return (
            <>
                <h3>Loading</h3>
                <Spinner />
            </>
        )
    }
    else if (query.error) {
        return <p style={{color: "red"}}>{query.error.message}</p>
    }

    else if (query.data.length < 1) {
        return <p>No charts yet</p>
    }

    const displayChart = (chart: Chart) => {
        return (
            <ListGroup.Item>
                {chart.description}
            </ListGroup.Item>
        )
    }

    const displayGroup = (group: ChartGroup, i: number) => {
        return (
            <Accordion.Item eventKey={i.toString()}>
                <Accordion.Header>{group.description}</Accordion.Header>
                <Accordion.Body>
                    <ListGroup>
                        {group.charts.map(displayChart)}
                    </ListGroup>
                    <Button variant="success">New Chart</Button>
                </Accordion.Body>
            </Accordion.Item>
        )
    }

    return (
        <Accordion>
            {query.data.map(displayGroup)}
        </Accordion>
    )

}

export default ChartGroups;