import React from 'react'
import { FormGroup, Label, Input } from 'reactstrap';

const FileEditor = ({ title, content, onChange }) => (
	<FormGroup>
        <Label for="editor">{title}</Label>
        <Input type="textarea" name="text" id="editor" value={content} onChange={onChange}/>
     </FormGroup>
)

export default FileEditor