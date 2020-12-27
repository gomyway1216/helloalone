import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import {Editor, EditorState, RichUtils, getDefaultKeyBinding, convertFromRaw, convertToRaw} from 'draft-js';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import * as blogApi from '../Firebase/blog';
import { Button, TextField } from '@material-ui/core';
import parse from 'html-react-parser';

const CreateBlog = ({ history }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const modules = {
    toolbar: [
      [{ 'font': [] }],
      [{ 'header': [1, 2,3,4,5, false] }],
      ['bold', 'italic', 'underline'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ]
  };

  const onSave = () => {
    const value = {
      title: title,
      body: body
    };
    blogApi.addBlog(value)
      .then(() => {
        setTitle('');
        setBody('');
      })
      .catch(err => console.log(err));
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const formats = [
    'font',
    'size',
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'align',
    'color', 'background', 'image', 'video'
  ];

  return (
    <div>
      <h1>Create blog</h1>
      <TextField id="standard-basic" label="Title" value={title} onChange={handleTitleChange}/>
      <ReactQuill theme="snow"
        modules={modules} formats={formats} 
        value={body} onChange={setBody}/>
      <div>
        <Button variant="contained" color="primary" onClick={onSave}>Save</Button>
        <Button variant="contained" onClick={() => history.push('/')}>Close</Button>
      </div>
      {/* <div dangerouslySetInnerHTML={{__html: body}}></div> */}
      {parse(body)}
    </div>
  );
};

export default CreateBlog;

CreateBlog.propTypes = {
  history: PropTypes.object
};