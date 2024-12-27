'use client'

import React, { useRef, useEffect } from 'react';
import classNames from 'classnames';
import './WrapperLazyLoad.scss';
import Loading from '../loading/Loading';

const WrapperLazyLoad = ({
  children,
  loading,
  maxHeight,
  resetScrollToTop,
  resetScrollToBottom,
  onScroll,
  onEnd,
  onTop,
  onResetScrollSuccess,
}) => {
  const wrapperLazyLoadRef = useRef(null);

  const onScrollEnd = (e) => {
    onScroll?.(e);
    const element = e.currentTarget;
    const isScrollEndOfElment = Math.round(element.scrollTop + element.clientHeight) >= element.scrollHeight;

    if (element.scrollTop === 0) onTop?.();
    if (isScrollEndOfElment && !resetScrollToTop) onEnd?.();
  };

  useEffect(() => {
    if (resetScrollToTop && wrapperLazyLoadRef?.current) {
      wrapperLazyLoadRef?.current?.scrollTo(0, 0);
      onResetScrollSuccess?.();
    }
  }, [resetScrollToTop, onResetScrollSuccess]);

  useEffect(() => {
    if (resetScrollToBottom && wrapperLazyLoadRef?.current) {
      const domWrapperLazyLoad = wrapperLazyLoadRef?.current;
      if (domWrapperLazyLoad) {
        wrapperLazyLoadRef.current.scrollTop = wrapperLazyLoadRef.current.scrollHeight;
      }
      onResetScrollSuccess?.();
    }
  }, [resetScrollToBottom, onResetScrollSuccess]);

  return (
    <div ref={wrapperLazyLoadRef} onScroll={onScrollEnd} className="WrapperLazyLoad" style={{ maxHeight }}>
      {children}
      <div className={classNames('WrapperLazyLoad__loading', { show: loading })}>
        <Loading />
      </div>
    </div>
  );
};

export default WrapperLazyLoad;
