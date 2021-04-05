import React, { useState, useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';
import * as blogApi from '../../Firebase/blog';
import parse from 'html-react-parser';
import { useParams } from 'react-router-dom';
import * as util from '../../util/util';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

const BlogPage = () => {
  const [blog, setBlog] = useState();
  const {id} = useParams();

  useEffect(() => {
    blogApi.getBlog(process.env.REACT_APP_DEFAULT_BLOG_USER, id)
      .then(doc => setBlog(doc));
  }, []);

  return (
    <>
      {blog && 
      <div style={{ margin: 'auto', width: '50%'}}>
        <h1>{blog.name}</h1>  
        <div style={{ padding: '5px'}}>
          <img style={{maxWidth: '100%', maxHeight: '100%'}} src={blog.mainImage} alt="Main Image"/>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <div>{blog.user}</div>
            <div style={{marginLeft: '10px'}}>{util.formatDate(blog.timestamp)}</div>
          </div>
          <FavoriteBorderIcon />
        </div>
        <div>{parse(blog.body)}</div> 
      </div>
      }
    </>
  );
};

export default BlogPage;