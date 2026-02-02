import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTags, removeTag, Tag } from "../../api/terms";
import { Button, ListGroup, Modal, Spinner } from "react-bootstrap";
import { BsTrashFill } from "react-icons/bs";



function TagItem(props: { tag: Tag, onDelete: () => void }) {
    const { tag, onDelete } = props;
    const { description, _count } = tag;
    let count = _count?.terms
    if (count === undefined) {
        count = 10000;
    }

    const mutation = useMutation({
         mutationFn: () => removeTag(tag),
         onSuccess: onDelete
    })

    return (        
        <ListGroup.Item
            as="li"
            className="d-flex justify-content-between align-items-start"
        >
            <div className="ms-2 me-auto">
                <div className="fw-bold">{description}</div>
                {count} terms
            </div>
            <Button variant="danger" size="sm" disabled={count > 0} onClick={() => mutation.mutate()}>
                { mutation.isPending ? <Spinner size="sm"/> : <BsTrashFill /> }
            </Button>
        </ListGroup.Item>        
    )
}


function TagsModal(props: { show: boolean, onClose: () => void }) {

    const query = useQuery({ queryKey: ["tags", "with counts"], queryFn: () => fetchTags(true) });
    const client = useQueryClient();
    const refresh = () => client.invalidateQueries({ queryKey: ["tags"] });

    const content = () => {

        if (query.isPending) {
            return (
                <div>
                    <Spinner />
                    <h2>Loading...</h2>
                </div>
            )
        }
        else if (query.error) {
            return <p style={{ color: "red" }}>{query.error.message}</p>
        }

        return (
            <ListGroup>
                {query.data.map((t: Tag) => <TagItem tag={t} onDelete={refresh} />)}
            </ListGroup>
        );
    }


    return (
        <Modal show={props.show} onHide={props.onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Manage Tags</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {content()}
            </Modal.Body>
            <Modal.Footer>                  
                <Button variant="secondary" onClick={props.onClose}>Done</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default TagsModal;