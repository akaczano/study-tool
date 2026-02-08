import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Accordion, Spinner, Button, ListGroup, Stack, Row, Col } from 'react-bootstrap';
import { ChartGroup, Chart, fetchGroups, createChart, removeChart } from '../../api/charts';
import { BsPencil, BsTrash } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';



function ChartGroups(props: {language: string }) {

    console.log(props.language)
    const queryClient = useQueryClient();
    const query = useQuery({ queryKey: ["charts", props.language], queryFn: () => fetchGroups(props.language) })

    const create = useMutation({ mutationFn: createChart, onSuccess:() => {
        queryClient.invalidateQueries({ queryKey: ["charts"] })
    }});

    const remove = useMutation({ mutationFn: removeChart, onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["charts"]})
    }});


    const newChart = (groupId: number): Chart => {        
        return {
            description: "Untitled Chart",
            groupId,
            language: "GREEK"
        }
    }


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
                <Row>
                    <Col md={4}>                        
                        <Link to={`/charts/${chart.id}`}>{chart.description}</Link>                        
                    </Col>
                    <Col md={1}>
                        <Button variant="danger" size="sm" disabled={remove.isPending} onClick={() => remove.mutate(chart)}>
                            {remove.isPending ? <Spinner size="sm" /> : <BsTrash />}
                        </Button>       
                    </Col>
                </Row>         
            </ListGroup.Item>
        )
    }



    const displayGroup = (group: ChartGroup, i: number) => {
        return (
            <Accordion.Item eventKey={i.toString()}>
                <Accordion.Header>{group.description}</Accordion.Header>
                <Accordion.Body>
                    <Stack direction='vertical' gap={3}>
                        <ListGroup variant='flush'>
                                {group.charts.map(displayChart)}                            
                        </ListGroup>
                        <div>
                            <Button variant="success" onClick={() => { create.mutate(newChart(group.id)) }}>
                                New Chart
                            </Button>
                        </div>                        
                    </Stack>
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