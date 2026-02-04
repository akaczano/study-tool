import { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroup } from "../../api/charts";

function GroupModal(props: { show: boolean, onHide: () => void}) {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: createGroup, 
        onSuccess: () => { 
            queryClient.invalidateQueries({ queryKey: ["charts"] });
            onHide();
        }
    })

    const [desc, setDesc] = useState("");

    const { show, onHide } = props; 

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                Add Group
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" value={desc} onChange={e => setDesc(e.target.value)}/>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" disabled={mutation.isPending} onClick={() => mutation.mutate(desc)}>
                    { mutation.isPending ? <Spinner size="sm" /> : "Save"}
                </Button>
                <Button variant="secondary" onClick={onHide}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    )

}

export default GroupModal;