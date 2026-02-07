import { Container, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { fetchChart } from "../../api/charts";

function ViewChart() {
    const { chartId } = useParams();




    const query = useQuery({
        queryKey: ["chart", chartId],
        queryFn: () => fetchChart(parseInt(chartId?.toString() || ""))
    })

    if (query.isPending) {
        return <Spinner />
    }
    else if (query.error) {
        return <p style={{ color: 'red'}}>{query.error.message}</p>
    }

    return (
        <Container>

            <h1>{query.data.description}</h1>


        </Container>
    )
}
export default ViewChart;