import { Form } from "react-bootstrap";
import {updateText as updateGreek, updateIdentity } from '../../lang/input';

type ChartCellProps = {
    language: string,
    header: boolean,
    mode: 0 | 1 | 2,
    value: string,
    updateValue: (s: string) => void,
    disabled?: boolean
}

function ChartCell(props: ChartCellProps){

    const { header, mode, value, updateValue, language, disabled } = props; 

    const termUpdateFunc = (language === "GREEK" && !header) ? updateGreek : updateIdentity;

    const handleChange = (e: any) => {
        termUpdateFunc(e, (s: string) => updateValue(s))
    }


    const getContent = () => {
        if (mode === 0) {
            return <span>{value}</span>
        }
        else {
            return (
                <Form.Control
                    type="text"
                    disabled={disabled}
                    style={{ fontWeight: header ? "bold" : "normal" }}
                    value={value}
                    onChange={handleChange} />
            )
        }
    }

    if (header) {
        return <th>{getContent()}</th>
    }
    else {
        return <td>{getContent()}</td>
    }
}
export default ChartCell;
