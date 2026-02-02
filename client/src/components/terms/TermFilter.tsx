import {
    Form, Row, Col,
    Spinner
} from 'react-bootstrap'
import { useQuery } from '@tanstack/react-query'
import Select from 'react-select';

import { Tag, TermFetchParams, fetchTags } from "../../api/terms";
import {updateText as updateGreek, updateIdentity } from '../../lang/input';
import {
    fetchLanguages,
    fetchCases,
    fetchPOS
} from '../../api/constants'

function TermFilter(props: { params: TermFetchParams, setParams: (p: TermFetchParams) => void}) {
    const {params, setParams} = props;
    const langQuery = useQuery({ queryKey: ["languages"], queryFn: fetchLanguages });
    const caseQuery = useQuery({ queryKey: ["cases"], queryFn: fetchCases});
    const posQuery = useQuery({ queryKey: ["pos"], queryFn: fetchPOS });
    const tagsQuery = useQuery({ queryKey: ["tags"], queryFn: () => fetchTags() });

    if (langQuery.isPending || caseQuery.isPending || posQuery.isPending || tagsQuery.isPending) {
        return <Spinner size="sm" />
    }

    const searchFunc = params.language === "GREEK" && params.searchField == "term" ? updateGreek : updateIdentity;

    const updateSearch = (e: any) => {
        searchFunc(e, s => setParams({ ...params, search: s, page: 0}))
    }

    const options = tagsQuery.data.map((t: Tag) => ({ label: t.description, value: t.description }))
    const selectedTags = params.tag.map((s: string) => ({ label: s, value: s}));
    const tagsChanged = (e: any) => {
        console.log(e)
        setParams({ ...params, tag: e.map((s: any) => s.value) });
    }

    return (
        <Form>
            <Row>
                <Form.Group as={Col} md={2}>
                    <Form.Label>Language</Form.Label>
                    <Form.Select value={params.language} onChange={e => setParams({...params, language: e.target.value })}>
                        {langQuery.data.map((l: string) => {
                            return <option key={`lang_filter_${l}`} value={l}>{l}</option>
                        })}
                    </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md={3}>
                    <Form.Label>Search</Form.Label>
                    <Form.Control
                        type="text"
                        value={params.search}
                        onChange={updateSearch}/>                    
                </Form.Group>
                <Form.Group as={Col} md={2}>
                    <Form.Label>Search In</Form.Label>
                    <Form.Select
                        value={params.searchField}
                        onChange={e => setParams({ ...params, searchField: e.target.value, page: 0})}
                    >
                        <option value="term">Term</option>
                        <option value="definition">Definition</option>
                        <option value="notes">Notes</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md={2}>
                    <Form.Label>Part of Speech</Form.Label>
                    <Form.Select value={params.pos} onChange={e => setParams({ ...params, pos: e.target.value, page: 0})}>
                        <option value={undefined}>All</option>
                        {posQuery.data.map((pos: string) => {
                            return (
                                <option key={`pos_filter_${pos}`} value={pos}>{pos}</option>
                            )
                        })}
                    </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md={3}>
                    <Form.Label>Tags</Form.Label>
                    <Select isMulti options={options} value={selectedTags} onChange={tagsChanged} />
                </Form.Group>
            </Row>
        </Form>
    )


} 

export default TermFilter;