import React, { useState } from "react";
import {
    Button,
    Container,
    ListGroup,
    Stack,
    Row,
    Col,
    Form,
    Spinner
} from 'react-bootstrap';
import {
    useQuery,
    useMutation,
    UseQueryResult,
    useQueryClient,
    QueryClient
} from "@tanstack/react-query";

import { GrFormPrevious, GrFormNext } from "react-icons/gr";

import { countTerms, fetchTerms, Term, TermFetchParams } from "../api/terms";
import TermItem from "../components/terms/TermItem";
import TermModal from "../components/terms/TermModal";
import { queryByTestId } from "@testing-library/dom";
import { count } from "console";
import TermFilter from "../components/terms/TermFilter";
import TagsModal from "../components/terms/TagsModal";

const PAGE_SIZE = 50;

const DEFAULT_TERM: Term = {
    term: "",
    definition: "",
    partOfSpeech: "NOUN",
    language: "GREEK",
    tags: []
}


function Terms() {
    const [settings, setSettings] = useState<TermFetchParams>({
        page: 0,
        count: PAGE_SIZE,
        searchField: "term",
        search: "",
        language: "GREEK",
        tag: [],
        sort: "term"
    })

    const queryClient = useQueryClient();
    const query = useQuery({ queryKey: ['terms', settings], queryFn: () => fetchTerms(settings) })

    const countQuery = useQuery({ queryKey: ['terms', 'count', {...settings, page: 0}], queryFn: () => countTerms(settings) })


    const [openTerm, setOpenTerm] = useState<Term | undefined>();
    const [tagsOpen, setTagsOpen] = useState(false);



    const add = () => setOpenTerm(DEFAULT_TERM)
    const edit = (t: Term) => setOpenTerm({ ...t })
    const onDelete = () => queryClient.invalidateQueries({ queryKey: ["terms"] })

    const content = () => {
        const { isPending, isError, data, error } = query;

        if (isPending) {
            return "Loading...";
        }
        else if (isError) {
            return "Error: " + error.message;
        }

        if (data.length < 1) {
            return "No terms yet";
        }


        return (
            <ListGroup>
                {data.map((t: Term) => {
                    return (
                        <TermItem term={t} onEdit={edit} onDelete={onDelete} />
                    )
                })}
            </ListGroup>

        );

    }


    const controls = () => {

        const renderPageLabel = () => {
            if (countQuery.isPending) {
                return <Spinner size="sm" />
            }
            else if (countQuery.error) {
                return <span style={{ color: 'red' }}>{countQuery.error.message}</span>
            }
            else {
                const startIndex = settings.page * PAGE_SIZE + 1;
                const remaining = countQuery.data - settings.page * PAGE_SIZE;
                const endIndex = Math.min(startIndex + remaining - 1, startIndex + PAGE_SIZE - 1)
                return (
                    <text>Showing {startIndex}-{endIndex} of {countQuery.data}</text>
                )
            }
        }

        return (
            <Stack direction="horizontal" gap={2}>
                <div>
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={settings.page === 0}
                        onClick={() => setSettings({ ...settings, page: settings.page - 1 })}>
                        <GrFormPrevious />
                    </Button>
                </div>
                <div>
                    {renderPageLabel()}
                </div>
                <div>
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={(settings.page + 1) * PAGE_SIZE >= countQuery.data}
                        onClick={() => setSettings({ ...settings, page: settings.page + 1 })}>
                        <GrFormNext />
                    </Button>
                </div>
                <div>
                    <Button variant="primary" onClick={add} disabled={query.isPending || !!query.error}>
                        Add Term
                    </Button>
                </div>
                <div style={{ float: 'right'}}>
                    <Button variant="info" onClick={() => setTagsOpen(true)}>
                        Manage Tags
                     </Button>
                </div>
            </Stack>
        )
    }


    return (
        <Container>
            <TermModal
                term={openTerm}
                update={t => setOpenTerm(t)}
                onSave={() => {
                    queryClient.invalidateQueries({ queryKey: ["terms"] })
                    setOpenTerm(undefined);
                }} />
            <TagsModal show={tagsOpen} onClose={() => setTagsOpen(false)} />
            <h1>Terms</h1>
            <Stack direction="vertical" gap={3}>

                <TermFilter params={settings} setParams={setSettings} />

                <div style={{ height: '72vh', overflowY: 'scroll' }}>
                    {content()}
                </div>
                {controls()}
            </Stack>
        </Container >
    );
}

export default Terms;
