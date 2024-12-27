'use client';

import React, { useState, useEffect } from 'react';
import BlogItems from './BlogItems';
import './Blogs.scss';
import { encodeQueryParams, getParameterQuery } from '@/utils/functions';
import { Pagination, message, Spin, Row, Col, Typography } from 'antd';
import BlogsApiService from '@/api-services/api/BlogsApiService';

const ListBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoaded, setisLoaded] = useState(false);

  const params = getParameterQuery();
  const page = params.page ? params.page : 1;
  const perPage = params.per_page ? params.per_page : 4;

  const [currentPage, setCurrentPage] = useState(page);
  const [numberPage, setNumberPage] = useState(perPage);
  const [total, setTotal] = useState();

  useEffect(() => {
    fetchBlogs(page, perPage);
  }, []);

  const onChangePage = (page, per_page) => {
    let newParams = {
      ...params,
      page,
      per_page,
    };
    window.history.replaceState(null, null, `${window.location.pathname}?${encodeQueryParams(newParams)}`);
    fetchBlogs(page, per_page);
  };

  const fetchBlogs = async (page, per_page) => {
    try {
      setisLoaded(true);
      let result = await BlogsApiService.getAllBlogs(page, per_page);
      setisLoaded(false);

      if (result && result.code == 0) {
        setBlogs(result.data);
        setTotal(result.total_app);
      }
    } catch (error) {
      message.error(error);
    }
  };

  return (
    <Spin spinning={isLoaded}>
      <div className="container">
        <div className="container-blogs">
          <Row style={{ marginBottom: '30px' }}>
            <Col span={24} className="text-center">
              <Typography.Title level={1} className="primary-color">
                Insights and Inspiration
              </Typography.Title>
            </Col>
            <Col span={24} className="text-center">
              <Typography.Text style={{ fontSize: '38px' }}>
                Get Ahead of Your Competition with Our Trending Statistics
              </Typography.Text>
            </Col>
          </Row>
          <Row gutter={[30, 30]}>
            {blogs.map((blog) => (
              <BlogItems key={blog.slug} blog={blog} fetchBlogs={fetchBlogs} />
            ))}
          </Row>
          {total > 0 ? (
            <div className="pagination">
              <Pagination
                pageSize={numberPage}
                current={currentPage}
                onChange={(page, pageSize) => {
                  setCurrentPage(page);
                  setNumberPage(pageSize);
                  onChangePage(page, pageSize);
                }}
                total={total}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} blogs`}
              />
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    </Spin>
  );
};

export default ListBlogs;
