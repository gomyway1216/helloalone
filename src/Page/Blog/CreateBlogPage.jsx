import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import * as blogApi from '../../Firebase/blog';
import { Button, TextField } from '@material-ui/core';
import parse from 'html-react-parser';
import { useAuth } from '../../Provider/AuthProvider';

const CreateBlog = ({ history }) => {
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [file, setFile] = useState();
  const { currentUser } = useAuth();
  const userId = currentUser.uid;

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

  const onSave = async () => {
    if(!name || !body || !file) {
      console.log('please provide the values');
      return;
    }
    const downloadURL = await blogApi.getStorageRef(file);
    const value = {
      user: userId,
      name: name,
      body: body,
      mainImage: downloadURL
    };
    blogApi.addBlog(userId, value)
      .then(() => {
        window.location.reload();
      })
      .catch(err => console.log(err));
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const onFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
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
      <div>
        <div style={{ fontSize: 'x-large' }}>Please upload the main image</div>
        <input
          accept="image/*"
          id="contained-button-file"
          multiple
          type="file"
          onChange={onFileChange}
        />
        <label htmlFor="contained-button-file">
          <Button variant="contained" component="span">
          Upload
          </Button>
        </label>
      </div>
      <TextField id="standard-basic" label="Name" value={name} onChange={handleNameChange}/>
      <ReactQuill theme="snow"
        modules={modules} formats={formats} 
        value={body} onChange={setBody}/>
      <div style={{display: 'flex', justifyContent: 'flex-end'}}>
        <Button variant="contained" onClick={() => history.push('/')}>Close</Button>
        <Button variant="contained" color="primary" onClick={onSave}>Save</Button>     
      </div>
      <div>
        <div style={{ fontSize: 'x-large' }}>Preview</div>
        {parse(body)}
      </div>
    </div>
  );
};

export default CreateBlog;

CreateBlog.propTypes = {
  history: PropTypes.object
};