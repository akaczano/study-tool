import React from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import Creatable from 'react-select/creatable';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { filterCases } from '../../lang/languageUtil';
import { fetchTags, saveTerm, Term, Tag } from '../../api/terms';

import { fetchCases, fetchLanguages, fetchPOS } from '../../api/constants';
import {updateText as updateGreek, updateIdentity } from '../../lang/input';

function tagToOption(tag: Tag) {
    return { label: tag.description, value: tag.description };
}

function optionToTag(option: { label: string, value: string }) {
    return { description: option.value };
}

function TermModal(props: {term: Term | undefined, update: (term?: Term) => void , onSave: () => void }) {
    
    const queryClient = useQueryClient();

    const langQuery = useQuery({ queryKey: ["languages"], queryFn: fetchLanguages });
    const caseQuery = useQuery({ queryKey: ["cases"], queryFn: fetchCases});
    const posQuery = useQuery({ queryKey: ["pos"], queryFn: fetchPOS });
    const tagsQuery = useQuery({ queryKey: ["tags"], queryFn: () => fetchTags() });


    const mutation = useMutation({
        mutationFn: saveTerm,
        onSuccess: () => {
            props.onSave();
            queryClient.invalidateQueries({ queryKey: ["tags"]})
        }
    })

    if (!props.term) return null;
    const term: Term = props.term;    

    const termUpdateFunc = term.language === "GREEK" ? updateGreek : updateIdentity;

    const updateTerm = (e: any) => {
        termUpdateFunc(e, s => props.update({ ...term, term: s}))
    }

    const content = () => {
        if (langQuery.isPending || caseQuery.isPending || posQuery.isPending || tagsQuery.isPending) {
            return "Loading...";
        }        
        return (
            <Form>
                <Form.Group>
                    <Form.Label>Language</Form.Label>
                    <Form.Select                        
                        value={term.language || "GREEK"}
                        onChange={e => props.update({ ...term, language: e.target.value })}
                    >
                        {langQuery.data.map((l: string) => {
                            return (
                                <option key={`language_${l}`} value={l}>{l}</option>
                            )
                        })}
                    </Form.Select>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Term</Form.Label>
                    <Form.Control
                        type="text"
                        value={term.term}
                        onChange={updateTerm}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Definition</Form.Label>
                    <Form.Control 
                        type="text"
                        value={term.definition}
                        onChange={e => props.update({ ...term, definition: e.target.value })}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Required Case</Form.Label>
                    <Form.Select
                        value={term.requiredCase}
                        onChange={e => props.update({ ...term, requiredCase: e.target.value})}
                    >
                        <option value={undefined}>NONE</option>
                        {filterCases(caseQuery.data, term.language).map((c: string) => {
                            return (
                                <option key={`case_${c}`} value={c}>{c}</option>
                            )
                        })}
                    </Form.Select>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Part of Speech</Form.Label>
                    <Form.Select
                        value={term.partOfSpeech || posQuery.data[0]}
                        onChange={e => props.update({ ...term, partOfSpeech: e.target.value })}
                    >
                        {posQuery.data.map((pos: string) => {
                            return (
                                <option key={`pos_${pos}`} value={pos}>{pos}</option>
                            )
                        })}
                    </Form.Select>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Tags</Form.Label>
                    <Creatable isMulti={true}
                        options={tagsQuery.data.map((t: Tag) => ({ label: t.description, value: t.description }))}
                        value={term.tags.map(tagToOption)}
                        onChange={e => props.update({ ...term, tags: e.map(optionToTag)})}
                        />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Notes</Form.Label>
                    <Form.Control
                        as="textarea" 
                        value={term.notes}
                        onChange={e => props.update({ ...term, notes: e.target.value })}/>
                </Form.Group>
            </Form>
        )
    }

    
    return (
        <Modal show={!!props.term} size="lg" onHide={() => props.update()}>
            <Modal.Header closeButton>
                <Modal.Title>{term.id ? "Edit Term" : "Add Term"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {content()}
                <p style={{ color: "red" }}>{mutation.error?.message}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => mutation.mutate(term)} disabled={mutation.isPending}>
                    {mutation.isPending ? <Spinner size="sm" /> : "Save"}
                </Button>               
                <Button variant="secondary" onClick={() => props.update() } disabled={mutation.isPending}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default TermModal;