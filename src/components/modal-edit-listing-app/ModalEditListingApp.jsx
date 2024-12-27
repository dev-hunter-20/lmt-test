'use client';

import { Input, Modal, Upload, message } from 'antd';
import React, { useRef, useState } from 'react';
import InputCustom from '../ui/input-custom/InputCustom';
import CopyToClipboard from 'react-copy-to-clipboard';
import Image from 'next/image';
import { CheckCircleFilled } from '@ant-design/icons';
import DetailAppApiService from '@/api-services/api/DetaiAppApiService';
import './ModalEditListingApp.scss';
import Link from 'next/link';

const { TextArea } = Input;

const checkShow = (value1, value2) => {
  if (value1) {
    return value1.toLowerCase().includes(value2.toLowerCase());
  }
  return false;
};

const checkShowAlt = (array, value) => {
  if (array) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].alt && array[i].alt.toLowerCase().includes(value.toLowerCase())) {
        return true;
      }
    }
  }
  return false;
};

const checkShowKbTitle = (array, value) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i].title && array[i].title.toLowerCase().includes(value.toLowerCase())) {
      return true;
    }
  }
  return false;
};

const checkShowKbDesc = (array, value) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i].description && array[i].description.toLowerCase().includes(value.toLowerCase())) {
      return true;
    }
  }

  return false;
};
const checkShowPlanName = (array, value) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i].title && array[i].title.toLowerCase().includes(value.toLowerCase())) {
      return true;
    }
  }

  return false;
};
const checkShowPlanDetail = (array, value) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i].desc && array[i].desc.toLowerCase().includes(value.toLowerCase())) {
      return true;
    }
  }

  return false;
};

const dataKeywords = (keywordPosition, detail) => {
  const data = [];
  keywordPosition &&
    keywordPosition.map((item) => {
      if (item.show) {
        data.push({
          keyword: item.keyword,
          position: item,
          name: checkShow(detail.name, item.keyword),
          tagline: checkShow(detail.tagline, item.keyword),
          kbTitle: checkShowKbTitle(detail.features, item.keyword),
          kbDesc: checkShowKbDesc(detail.features, item.keyword),
          alt: checkShowAlt(detail.img, item.keyword),
          desc: checkShow(detail.description, item.keyword),
          planName: checkShowPlanName(detail.pricing_plan, item.keyword),
          planDetail: checkShowPlanDetail(detail.pricing_plan, item.keyword),
        });
      }
    });
  return data;
};

export default function ModalEditListingApp(props) {
  const keywordAdd = useRef('');
  const [detail, setDetail] = useState(props.data.detail);
  const [dataKeywordsShow, setDataKeywordsShow] = useState(
    props.data ? dataKeywords(props.data.keyword_pos, detail) : [],
  );
  const [copyText, setCopyText] = useState({
    name: {
      copied: false,
    },
    tagline: {
      copied: false,
    },
    kbTitle: detail.features.map((item) => {
      return {
        copied: false,
      };
    }),
    kbDescription: detail.features.map((item) => {
      return {
        copied: false,
      };
    }),
    altImg: detail.img.map((item) => {
      return {
        copied: false,
      };
    }),
    description: {
      copied: false,
    },
    planTitle: detail.pricing_plan.map((item) => {
      return {
        copied: false,
      };
    }),
    planDesc: detail.pricing_plan.map((item) => {
      return {
        copied: false,
      };
    }),
  });

  const handleOk = () => {
    props.disableModal();
  };

  const handleCancel = () => {
    props.disableModal();
  };

  const columnsKeyword = [
    {
      title: 'Keywords',
      dataIndex: 'keyword',
      render: (item, record) => {
        return (
          <>
            <Link prefetch={false} href={`/key/${record.position.keyword_slug}`} target="__blank">
              {item}
            </Link>
          </>
        );
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (item) => (
        <>
          <div className="show-icon">
            {item ? (
              <span>
                <CheckCircleFilled />
              </span>
            ) : (
              ''
            )}
          </div>
        </>
      ),
    },
    {
      title: 'Tagline',
      dataIndex: 'tagline',
      render: (item) => (
        <>
          <div className="show-icon">
            {item ? (
              <span>
                <CheckCircleFilled />
              </span>
            ) : (
              ''
            )}
          </div>
        </>
      ),
    },
    {
      title: 'KBT',
      dataIndex: 'kbTitle',
      render: (item) => (
        <>
          <div className="show-icon">
            {item ? (
              <span>
                <CheckCircleFilled />
              </span>
            ) : (
              ''
            )}
          </div>
        </>
      ),
    },
    {
      title: 'KBD',
      dataIndex: 'kbDesc',
      render: (item) => (
        <>
          <div className="show-icon">
            {item ? (
              <span>
                <CheckCircleFilled />
              </span>
            ) : (
              ''
            )}
          </div>
        </>
      ),
    },
    {
      title: 'Desc',
      dataIndex: 'desc',
      render: (item) => (
        <>
          <div className="show-icon">
            {item ? (
              <span>
                <CheckCircleFilled />
              </span>
            ) : (
              ''
            )}
          </div>
        </>
      ),
    },
    {
      title: 'SCA',
      dataIndex: 'alt',
      render: (item) => (
        <>
          <div className="show-icon">
            {item ? (
              <span>
                <CheckCircleFilled />
              </span>
            ) : (
              ''
            )}
          </div>
        </>
      ),
    },
    {
      title: 'PN',
      dataIndex: 'planName',
      render: (item) => (
        <>
          <div className="show-icon">
            {item ? (
              <span>
                <CheckCircleFilled />
              </span>
            ) : (
              ''
            )}
          </div>
        </>
      ),
    },
    {
      title: 'PD',
      dataIndex: 'planDetail',
      render: (item) => (
        <>
          <div className="show-icon">
            {item ? (
              <span>
                <CheckCircleFilled />
              </span>
            ) : (
              ''
            )}
          </div>
        </>
      ),
    },
  ];

  const saveKeyword = async () => {
    const keyword = keywordAdd.current.state.value;
    const result = await DetailAppApiService.createKeyword(keyword, props.data.app_id);
    if (result.code === 0) {
      const objectData = {
        keyword: keyword,
        position: {},
        name: checkShow(detail.name, keyword),
        tagline: checkShow(detail.tagline, keyword),
        kbTitle: checkShowKbTitle(detail.features, keyword),
        kbDesc: checkShowKbDesc(detail.features, keyword),
        alt: checkShowAlt(detail.img, keyword),
        desc: checkShow(detail.description, keyword),
        planName: checkShowPlanName(detail.pricing_plan, keyword),
        planDetail: checkShowPlanDetail(detail.pricing_plan, keyword),
      };
      const data = [...dataKeywordsShow];
      data.push(objectData);
      setDataKeywordsShow(data);
      keywordAdd.current.state.value = '';
      message.success('Add keyword success');
    } else {
      message.error('Add keyword error');
    }
  };

  const dataShowNew = (detail) => {
    const dataShowNew = [];
    dataKeywordsShow &&
      dataKeywordsShow.map((item) => {
        dataShowNew.push({
          keyword: item.keyword,
          position: item,
          name: checkShow(detail.name, item.keyword),
          tagline: checkShow(detail.tagline, item.keyword),
          kbTitle: checkShowKbTitle(detail.features, item.keyword),
          kbDesc: checkShowKbDesc(detail.features, item.keyword),
          alt: checkShowAlt(detail.img, item.keyword),
          desc: checkShow(detail.description, item.keyword),
          planName: checkShowPlanName(detail.pricing_plan, item.keyword),
          planDetail: checkShowPlanDetail(detail.pricing_plan, item.keyword),
        });
      });
    return dataShowNew;
  };

  const onChangeAppName = (value) => {
    const data = {};
    Object.assign(data, detail);
    data.name = value;
    setDetail(data);
    setDataKeywordsShow(dataShowNew(data));
  };
  const onChangeTagline = (value) => {
    const data = {};
    Object.assign(data, detail);
    data.tagline = value;
    setDetail(data);
    setDataKeywordsShow(dataShowNew(data));
  };
  const onChangeMetatitle = (value) => {
    const data = {};
    Object.assign(data, detail);
    data.metatitle = value;
    setDetail(data);
    setDataKeywordsShow(dataShowNew(data));
  };
  const onChangeMetadesc = (value) => {
    const data = {};
    Object.assign(data, detail);
    data.metadesc = value;
    setDetail(data);
    setDataKeywordsShow(dataShowNew(data));
  };

  const changeDescription = (e) => {
    const data = {};
    Object.assign(data, detail);
    data.description = e.target.value;
    setDetail(data);
    setDataKeywordsShow(dataShowNew(data));
  };

  const onChangeAltImage = (index) => (value) => {
    const data = {};
    Object.assign(data, detail);
    data.img[index].alt = value;
    setDetail(data);
    setDataKeywordsShow(dataShowNew(detail));
  };

  const onChangePlanName = (index) => (value) => {
    const data = {};
    Object.assign(data, detail);
    data.pricing_plan[index].title = value;
    setDetail(data);
    setDataKeywordsShow(dataShowNew(detail));
  };

  const changeFeatureList = (index) => (e) => {
    const data = {};
    Object.assign(data, detail);
    data.pricing_plan[index].desc = e.target.value;
    setDetail(data);
    setDataKeywordsShow(dataShowNew(detail));
  };

  const onCopyText = () => {
    const copyTextNew = {};
    Object.assign(copyTextNew, copyText);
    copyTextNew.name.copied = true;
    setCopyText(copyTextNew);
    message.success('Copy App Name success!');
  };

  const onCopyTagline = () => {
    const copyTextNew = {};
    Object.assign(copyTextNew, copyText);
    copyTextNew.tagline.copied = true;
    setCopyText(copyTextNew);
    message.success('Copy Tagline success!');
  };

  const onCopyMetatitle = () => {
    message.success('Copy Metatitle success!');
    const copyTextNew = {};
    Object.assign(copyTextNew, copyText);
    copyTextNew.metatitle.copied = true;
    setCopyText(copyTextNew);
  };

  const onCopyMetadesc = () => {
    message.success('Copy Metadesc success!');
    const copyTextNew = {};
    Object.assign(copyTextNew, copyText);
    copyTextNew.metadesc.copied = true;
    setCopyText(copyTextNew);
  };

  const onCopyTextPlanTitle = (key) => () => {
    const copyTextNew = {};
    Object.assign(copyTextNew, copyText);
    copyTextNew.planTitle[key].copied = true;
    setCopyText(copyTextNew);
    message.success('Copy Plan Title success!');
  };

  const copyTextPlanNameDetail = (key) => () => {
    const copyTextNew = {};
    Object.assign(copyTextNew, copyText);
    copyTextNew.planDesc[key].copied = true;
    setCopyText(copyTextNew);
    message.success('Copy Features list success!');
  };

  const onCopyTextAlt = (key) => () => {
    const copyTextNew = {};
    Object.assign(copyTextNew, copyText);
    copyTextNew.altImg[key].copied = true;
    setCopyText(copyTextNew);
    message.success('Copy Alt success!');
  };

  const copyTextDescription = () => {
    message.success('Copy Description success!');
    const copyTextNew = {};
    Object.assign(copyTextNew, copyText);
    copyTextNew.description.copied = true;
    setCopyText(copyTextNew);
  };

  const trimDescription = (desc) => {
    return desc
      .split('\n')
      .map((str) => str.trim())
      .filter((str) => str)
      .join('\n');
  };

  return (
    <Modal
      width={'40%'}
      title="Edit Listing App"
      visible={true}
      footer={null}
      onOk={handleOk}
      onCancel={handleCancel}
      style={{ top: 10 }}
    >
      <div className="popup-edit-listing-app">
        <div className="edit-listing-app">
          <div className="edit-app-name">
            <div className="app-name-edit">
              <div className="label">App name</div>
              <div className="input-text">
                <div className="input-name">
                  <InputCustom
                    changeInput={onChangeAppName}
                    value={detail ? detail.name : ''}
                    placeholder="input"
                    maxLength={30}
                  />
                </div>
                <div className="copy-name">
                  <CopyToClipboard onCopy={onCopyText} text={detail.name}>
                    <button>Copy</button>
                  </CopyToClipboard>
                </div>
              </div>
            </div>
            <div className="tagline">
              <div className="label">Tagline</div>
              <div className="input-text">
                <div className="input-name">
                  <InputCustom
                    changeInput={onChangeTagline}
                    value={detail ? detail.tagline : ''}
                    placeholder="input"
                    maxLength={62}
                  />
                </div>
                <div className="copy-name">
                  <CopyToClipboard onCopy={onCopyTagline} text={detail.tagline}>
                    <button>Copy</button>
                  </CopyToClipboard>
                </div>
              </div>
            </div>
            <div className="metatitle">
              <div className="label">Title tag</div>
              <div className="input-text">
                <div className="input-name">
                  <InputCustom
                    changeInput={onChangeMetatitle}
                    value={detail ? detail.metatitle : ''}
                    placeholder="input"
                    maxLength={60}
                  />
                </div>
                <div className="copy-name">
                  <CopyToClipboard onCopy={onCopyMetatitle} text={detail.metatitle}>
                    <button>Copy</button>
                  </CopyToClipboard>
                </div>
              </div>
            </div>
            <div className="metadesc">
              <div className="label">Meta description</div>
              <div className="input-text">
                <div className="input-name">
                  <InputCustom
                    changeInput={onChangeMetadesc}
                    value={detail ? `${detail.name} - ${detail.metadesc}` : ''}
                    placeholder="input"
                    maxLength={160}
                  />
                </div>
                <div className="copy-name">
                  <CopyToClipboard onCopy={onCopyMetadesc} text={detail.metadesc}>
                    <button>Copy</button>
                  </CopyToClipboard>
                </div>
              </div>
            </div>
          </div>
          <div className="edit-screen-shot">
            {detail &&
              detail.img.map((item, key) => {
                return (
                  <div key={key}>
                    <div className="label">SCREENSHOT {key + 1}</div>
                    <div className="content-screen-shot">
                      <div className="upload-img">
                        <Upload
                          name="avatar"
                          listType="picture-card"
                          className="avatar-uploader"
                          showUploadList={false}
                          disabled
                        >
                          <Image src={item.src} alt="img" width={100} height={100} />
                        </Upload>
                      </div>
                      <div className="text-content">
                        <div className="label-text-content">Image alt text (image description)</div>
                        <div className="input-text">
                          <div className="input-name">
                            <InputCustom
                              changeInput={onChangeAltImage(key)}
                              value={item.alt}
                              placeholder="input"
                              maxLength={62}
                            />
                          </div>
                          <div className="copy-name">
                            <CopyToClipboard onCopy={onCopyTextAlt(key)} text={item.alt}>
                              <button>Copy</button>
                            </CopyToClipboard>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="edit-description">
            <div className="text-copy-label">
              <div className="title">Description</div>
              <div className="copy-clipboard">
                <CopyToClipboard onCopy={copyTextDescription} text={detail.description}>
                  <button>Copy</button>
                </CopyToClipboard>
              </div>
            </div>
            <div className="textarea-description">
              <TextArea
                onChange={changeDescription}
                value={detail.description}
                showCount
                maxLength={2800}
                autoSize={{ minRows: 5 }}
              />
            </div>
          </div>
          {detail &&
            detail.pricing_plan.map((item, key) => {
              return (
                <div className="edit-plan-detail" key={key}>
                  <div className="title">Plan Details</div>
                  <div key={key}>
                    <div className="edit-plan-name">
                      <div className="label">Plan name</div>
                      <div className="input-text">
                        <div className="input-name">
                          <InputCustom
                            changeInput={onChangePlanName(key)}
                            value={item.title}
                            placeholder="Basic plane"
                            maxLength={18}
                          />
                        </div>
                        <div className="copy-name">
                          <CopyToClipboard onCopy={onCopyTextPlanTitle(key)} text={item.title}>
                            <button>Copy</button>
                          </CopyToClipboard>
                        </div>
                      </div>
                    </div>
                    <div className="edit-feature-list">
                      <div className="text-copy-label">
                        <div className="label">Features list (one item per line, no hyphens or symbols)</div>
                        <div className="copy-clipboard">
                          <CopyToClipboard onCopy={copyTextPlanNameDetail(key)} text={item.desc}>
                            <button>Copy</button>
                          </CopyToClipboard>
                        </div>
                      </div>
                      <div className="textarea-features-list">
                        <div className="textarea-input">
                          <TextArea
                            onChange={changeFeatureList(key)}
                            value={trimDescription(item.desc ? item.desc : '')}
                            showCount
                            maxLength={140}
                            autoSize={{ minRows: 5 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </Modal>
  );
}
