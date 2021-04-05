import React, { useEffect, useState } from 'react';
import * as blogApi from '../../Firebase/blog';
import CustomCard from '../../Component/Blog/CustomCard';
import './BlogListPage.scss';

const Blog = () => {
  const [blogList, setBlogList] = useState();


  const getBlogIdList = async () => {
    const result = await blogApi.getBlogList(process.env.REACT_APP_DEFAULT_BLOG_USER);
    setBlogList(result);
  };

  useEffect(() => {
    getBlogIdList();
  }, []);

  return (
    <div className="blog-container">
      <h1>Blog List</h1>
      {/* {blogList && blogList.map(blog => 
        <CustomCard key={blog.id} blog={blog}/>
      )} */}
      {blogList && blogList.map(blog => 
        <CustomCard key={blog.id} blog={blog}/>
      )}
    </div>
  );
};

export default Blog;