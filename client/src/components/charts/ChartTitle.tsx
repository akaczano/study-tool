import { Form } from "react-bootstrap";

import { ChartProps } from "./Chart";

function ChartTitle(props: {  info: ChartProps }) {
    const { info } = props;

    if (info.isPending || info.error) {
        return null;
    }
    else if (info.mode === 0 || info.mode === 2) {
        // Not Editing
        return <h1>{info.description}</h1>
    }
    else {
        const value = info.descInput.dirty ? info.descInput.input : info.description;
        const change = (e: any) => {
            info.setDescInput({
                dirty: true,
                input: e.target.value
            })
        }

        return (
            <Form.Control
                type="text"
                style={{ fontSize: "35px" }}
                value={value}
                onChange={change} />
        )
    }

}
export default ChartTitle;