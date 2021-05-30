import React, { useEffect, useState } from 'react';
import * as blogApi from '../../Firebase/blog';
import CustomCard from '../../Component/Blog/CustomCard';
import { Backdrop, CircularProgress } from '@material-ui/core';
import './blog-list-page.scss';

const Blog = () => {
  const [loading, setLoading] = useState(false);
  const [blogList, setBlogList] = useState();

  const getBlogIdList = async () => {
    setLoading(true);
    const result = await blogApi.getBlogList();
    setBlogList(result);
    setLoading(false);
  };

  useEffect(() => {
    getBlogIdList();
  }, []);

  if(loading) {
    return (
      <Backdrop open={loading} >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <div className="blog-container">
      <div className="title">Blog List</div>
      {blogList && blogList.map(item => 
        <CustomCard key={item.id} item={item}/>
      )}
    </div>
  );
};

export default Blog;