import React, { useState, useEffect } from 'react';
import * as blogApi from '../../Firebase/blog';
import ReactMarkdown from 'react-markdown';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import * as util from '../../util/util';
import { useAuth } from '../../Provider/AuthProvider';
import { Button } from '@material-ui/core';
import './blog-page.scss';

const BlogPage = () => {
  const [blog, setBlog] = useState();
  const {id} = useParams();
  const history = useHistory();
  const { currentUser } = useAuth();
  const userId = currentUser ? currentUser.uid : null;

  useEffect(() => {
    blogApi.getBlog(process.env.REACT_APP_DEFAULT_BLOG_USER, id)
      .then(doc => setBlog(doc));
  }, []);

  const handleEdit = () => {
    history.push('/edit-blog-item', {
      item: blog
    });
  };

  return (
    <>
      {blog && 
      <div className="blog-page-wrapper">
        <div className="title" >{blog.name}</div>  
        <div className="main-image-wrapper">
          <img className="main-image" src={blog.mainImage} alt="Main Image"/>
        </div>
        <div className="content-info">
          <div className="date">Created: {util.formatDate(blog.created.seconds)}</div>
          <div className="date">Last Updated: {util.formatDate(blog.lastUpdated.seconds)}</div>
        </div>
        {userId === blog.user && 
          <div className="edit-button-wrapper">
            <Button variant="contained" onClick={handleEdit}>Edit</Button>
          </div>
        }
        <ReactMarkdown>{blog.description}</ReactMarkdown> 
      </div>
      }
    </>
  );
};

export default BlogPage;