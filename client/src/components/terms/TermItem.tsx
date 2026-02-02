import React, { useState } from "react";
import { 
    Badge,
    Button,
    ListGroup,
    Stack,
    Spinner
} from "react-bootstrap";
import { IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io";
import { BsPencil, BsTrash } from "react-icons/bs";
import { useMutation } from "@tanstack/react-query";
import { Term, Tag, removeTerm} from "../../api/terms";


type TermItemProps = {
    term: Term,
    onEdit: (term: Term) => void,
    onDelete: () => void
}

function TermItem(props: TermItemProps) {

    const mutation = useMutation({
        mutationFn: removeTerm,
        onSuccess: () => {
            props.onDelete()
        }
    })
    const [isExpanded, setExpanded] = useState(false);

    const getArrowIcon = () => {
        if (isExpanded) {
            return <IoMdArrowDropdown />
        }
        else {
            return <IoMdArrowDropright />
        }
    }

    const extraContent = () => {
        if (!isExpanded) return null;
        
        return (
            <>
                <p>                
                    <span style={{ fontStyle: "italic" }}>{props.term.partOfSpeech.toLowerCase()}</span>
                    <span style={{ marginLeft: '15px'}}>
                        {props.term.requiredCase ? "with the " + props.term.requiredCase : null}
                    </span>
                </p>
                <p>
                    {props.term.notes}
                </p>
            </>
        )
    }

    const tags = () => {
        return (
            <div>
                {
                    props.term.tags.map((t: Tag) => {
                        return (
                            <Badge bg="primary" style={{ margin: '3px'}}>
                                {t.description}
                            </Badge>
                        )
                    })
                }
            </div>
        )
    }
    
    return (
        <ListGroup.Item  className="d-flex justify-content-between align-items-start">
            <div className="ms-2 me-auto">
            <div className="fw-bold" style={{fontSize: '20px', cursor: 'pointer'}} onClick={() => setExpanded(!isExpanded) }>                 
                 { getArrowIcon() } {props.term.term}
            </div>
                <p>
                    {props.term.definition}        
                </p>                
                {extraContent()}                
            </div>
            <div className="me-auto">
                {tags()}
            </div>
            <div>
                <Stack direction="horizontal" gap={2}>
                    <Button variant="secondary" onClick={() => props.onEdit(props.term)} disabled={mutation.isPending}  >
                        <BsPencil />
                    </Button>
                    <Button variant="danger" onClick={() => mutation.mutate(props.term)} disabled={mutation.isPending}>
                        { mutation.isPending ? <Spinner size="sm" /> : <BsTrash /> }
                    </Button>
                </Stack>
            </div>    
        </ListGroup.Item>
    );
}

export default TermItem
