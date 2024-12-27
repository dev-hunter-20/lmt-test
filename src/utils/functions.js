import { Tag, notification, Tooltip, Badge, Row, Dropdown, Space, Popover, Popconfirm, Button } from 'antd';
import {
  CalendarOutlined,
  CrownOutlined,
  BulbOutlined,
  AlertOutlined,
  BellOutlined,
  DownOutlined,
  DeleteFilled,
  WarningFilled,
} from '@ant-design/icons';
import { ETypeNotification, ERegex } from '../common/enums';
import Image from 'next/image';
import dayjs from 'dayjs';
import { colors } from './theme/colors';

const COLORS = [
  '#1890ff',
  '#ff4d4f',
  '#b37feb',
  '#faad14',
  '#329ac5',
  '#52c41a',
  '#ffa940',
  '#f56256',
  '#faad14',
  '#1890ff',
];

export const removeAccents = (str) => {
  let strConverted = str;
  if (strConverted) {
    strConverted = strConverted.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    strConverted = strConverted.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    strConverted = strConverted.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    strConverted = strConverted.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    strConverted = strConverted.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    strConverted = strConverted.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    strConverted = strConverted.replace(/đ/g, 'd');
    strConverted = strConverted.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
    strConverted = strConverted.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
    strConverted = strConverted.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
    strConverted = strConverted.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
    strConverted = strConverted.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
    strConverted = strConverted.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
    strConverted = strConverted.replace(/Đ/g, 'D');

    strConverted = strConverted.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '');
    strConverted = strConverted.replace(/\u02C6|\u0306|\u031B/g, '');
    // Remove extra spaces
    strConverted = strConverted.replace(/ + /g, ' ');
    strConverted = strConverted.trim();
    // Remove punctuations
    strConverted = strConverted.replace(
      /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
      ' ',
    );
    return strConverted;
  }

  return '';
};

export const showNotification = (type, description) => {
  const options = {
    message: '',
    description,
    className: 'Notification',
  };

  switch (type) {
    case ETypeNotification.SUCCESS:
      notification.success(options);
      break;
    case ETypeNotification.WARNING:
      notification.warning(options);
      break;
    case ETypeNotification.ERROR:
      notification.error(options);
      break;
    case ETypeNotification.INFO:
      notification.info(options);
      break;
    default:
      notification.open(options);
  }
};
export function getParameterQuery() {
  let parameter = {};
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    for (const param of params) {
      parameter[param[0]] = param[1];
    }
  }
  return parameter;
}
export const searchString = (target, searchValue) => {
  const searchKey = searchValue.toLowerCase();
  const searchTarget = target instanceof Array ? target.map((str) => str.toLowerCase()) : target.toLowerCase();
  const searchResult =
    searchTarget instanceof Array
      ? !!searchTarget.filter((str) => removeAccents(str).includes(removeAccents(searchKey))).length
      : removeAccents(searchTarget).includes(removeAccents(searchKey));
  return searchResult;
};

export const getTotalPage = (totalItem, pageSize) => {
  return Math.ceil(totalItem / pageSize);
};

export const scrollToTop = () => {
  window.scrollTo(0, 0);
};

export const validationRules = {
  required: (message) => ({
    required: true,
    message: message || 'This field is required',
  }),
  minLength: (length = 2, message) => ({
    min: length,
    message: message || `Enter characters at least ${length}`,
  }),
  maxLength: (length = 10, message) => ({
    max: length,
    message: message || `Enter characters at most ${length}`,
  }),
  email: (message) => ({
    type: 'email',
    message: message || 'Invalid email',
  }),
  noSpecialKey: (message) => ({
    validator: (rule, value) => {
      if (!value || !ERegex.onlySpecialKey.test(value)) return Promise.resolve();
      return Promise.reject(message || 'Cannot enter special characters');
    },
  }),
  onlyAlphabetic: (message) => ({
    validator: (rule, value) => {
      if (!value || ERegex.alphabetic.test(removeAccents(value))) return Promise.resolve();
      return Promise.reject(message || 'This is a field where only alphabetic characters are entered');
    },
  }),
  onlyNumeric: (message) => ({
    validator: (rule, value) => {
      if (!value || ERegex.numeric.test(value)) return Promise.resolve();
      return Promise.reject(message || 'This is a field where only numeric characters are entered');
    },
  }),
  onlyAlphanumerial: (message) => ({
    validator: (rule, value) => {
      if (!value || ERegex.alphanumerial.test(removeAccents(value))) return Promise.resolve();
      return Promise.reject(message || 'This is a field where only alphanumeric characters are entered');
    },
  }),
  domain: (message) => ({
    validator: (rule, value) => {
      if (!value || ERegex.domain.test(value)) return Promise.resolve();
      return Promise.reject(message || 'Invalid domain');
    },
  }),
  url: (message) => ({
    validator: (rule, value) => {
      if (!value || ERegex.url.test(value)) return Promise.resolve();
      return Promise.reject(message || 'Invalid URL');
    },
  }),
  confirmPassword: (confirmPasswordValue, message) => ({
    validator: (rule, value) => {
      if (!value || value === confirmPasswordValue) return Promise.resolve();
      return Promise.reject(message || 'Confirm Password is not matched with Password');
    },
  }),
};

export const copyText = (text) => {
  const el = document.createElement('textarea');
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

export const renderSortByString = (field, direction) => {
  if (!direction || !field) return undefined;
  let newDirection = '';
  if (direction === 'ascend') newDirection = '1';
  if (direction === 'descend') newDirection = '0';
  return `${field}:${newDirection}`;
};

export const getQueryParam = (param) => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
  }
};

export const getTotalItems = (totalItem, pageSize, total) => {
  return (totalItem - 1) * pageSize + total;
};

export const encodeQueryParams = (obj) => {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  return str.join('&');
};

const checkStyleBadge = (badge) => {
  switch (badge) {
    case 'Built for your business':
      return {
        color: '#74c94f',
        icon: <CalendarOutlined />,
      };
    case 'Popular with businesses like yours':
      return {
        color: '#74c94f',
        icon: <CrownOutlined />,
      };
    case 'Speed tested: no impact to your online store':
      return {
        color: '#74c94f',
        icon: <BulbOutlined />,
      };
    default:
      return {
        color: '#74c94f',
        icon: <AlertOutlined />,
      };
  }
};

export const renderBadge = (hightlights) => {
  if (hightlights) {
    return hightlights.map((item, index) => {
      return (
        <Tag key={index} color={checkStyleBadge(item).color} icon={checkStyleBadge(item).icon} className="hightlights">
          {item}
        </Tag>
      );
    });
  }
};

const getTitleChanges = (changes) => {
  return Object.keys(changes).map((item) => {
    const name = item.replaceAll('_', ' ');
    if (name == 'review count') {
      return 'Reviews';
    }
    return `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
  });
};

const contentChanges = (changes) => {
  return (
    <div className="list-change">
      <ul style={{ margin: 0, paddingLeft: '0px', listStyleType: 'none' }}>
        {getTitleChanges(changes).map((item, index) => (
          <li key={index} style={{ color: COLORS[index] }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const getNoti = (app, isDetailApp) => {
  if (app.changed && Object.keys(app.changed).length > 0 && !app.watched_changes) {
    const nbChanges = Object.keys(app.changed).length;
    return (
      <Tooltip title={contentChanges(app.changed)} color="#ffffff">
        <Badge count={nbChanges}>
          <BellOutlined
            style={{
              fontSize: '16px',
              marginLeft: isDetailApp ? '-5px' : '5px',
            }}
          />
        </Badge>
      </Tooltip>
    );
  }
};

export const getReviewChanges = (after, before) => {
  const changes = after - before;
  return `${changes > 0 ? '+' : ''}${changes} ${changes > 1 ? 'reviews' : 'review'}`;
};

export const footerButton = (children, skipAction) => {
  return (
    <Row justify="space-between">
      <div className="onboarding-skip" onClick={() => skipAction()}>
        Skip
      </div>
      {children ? <div>{children}</div> : <></>}
    </Row>
  );
};

export const renderSentiment = (type) => {
  switch (type) {
    case 'negative':
      return '&negative=true';
    case 'positive':
      return '&positive=true';
    case 'objective':
      return '&objective=true';
    case 'subjective':
      return '&subjective=true';
    default:
      return '';
  }
};

export const renderFilterDropdown = (options, title, value) => {
  return (
    <Dropdown overlay={options}>
      <Space>
        <div className="sort-container flex items-center">
          {title}:<div className="sort-value text-capitalize">{value}</div>
          <DownOutlined />
        </div>
      </Space>
    </Dropdown>
  );
};

const CANT_CONNECT_INTERNET = "Can't connect internet";
export function fetchWithTimeOut(promise, ms = 25000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(CANT_CONNECT_INTERNET));
    }, ms);
    promise.then(resolve, reject);
  });
}

export const openNotification = (isDeleted) => {
  notification.info({
    icon: isDeleted ? <DeleteFilled style={{ color: '#ff4d4f' }} /> : <WarningFilled style={{ color: '#faad14' }} />,
    duration: 3,
    message: <div className="noti-title">This app has been {isDeleted ? 'deleted' : 'delisted'}</div>,
    description:
      'This app is not currently available on the Shopify App Store. The data of the app will be not update on the Letsmetrix',
    placement: 'top',
  });
};

export const openNotificationWarning = () => {
  notification.warning({
    icon: <WarningFilled style={{ color: '#faad14' }} />,
    message: 'App already added',
    description: 'This app has already been added. Please choose another app to compare.',
    duration: 3,
    placement: 'topRight',
  });
};

export const mergedObject = (arr) => {
  return arr.reduce((result, currentObject) => {
    for (const key in currentObject) {
      if (currentObject.hasOwnProperty(key)) {
        result[key] = currentObject[key];
      }
    }
    return result;
  }, {});
};

export const dataKeywords = (keywordPosition) => {
  const data = [];
  keywordPosition &&
    keywordPosition.map((item, index) => {
      if (item.show) {
        data.push({
          key: index,
          keyword: item,
          uniquePageviews:
            item.ga_keyword && (item.ga_keyword.uniquePageviews || item.ga_keyword.uniquePageviews === 0)
              ? item.ga_keyword.uniquePageviews
              : ' ',
          uniqueEvents:
            item.ga_keyword && (item.ga_keyword.uniqueEvents || item.ga_keyword.uniqueEvents === 0)
              ? item.ga_keyword.uniqueEvents
              : ' ',
          conversion_rate:
            item.ga_keyword && item.ga_keyword.uniquePageviews
              ? parseFloat((item.ga_keyword.uniqueEvents * 100) / item.ga_keyword.uniquePageviews).toFixed(2) + '%'
              : ' ',
          avgTimeOnPage:
            item.ga_keyword && (item.ga_keyword.avgTimeOnPage || item.ga_keyword.avgTimeOnPage === 0)
              ? dayjs(item.ga_keyword.avgTimeOnPage * 1000).format('mm:ss')
              : ' ',
          bounceRate:
            item.ga_keyword && (item.ga_keyword.bounceRate || item.ga_keyword.bounceRate === 0)
              ? item.ga_keyword.bounceRate.toFixed(2) + '%'
              : ' ',
          avgPos:
            item.ga_keyword && (item.ga_keyword.avgPos || item.ga_keyword.avgPos === 0)
              ? item.ga_keyword.avgPos.toFixed(2)
              : ' ',
          rank: item,
          updateTime: item,
          action: item,
          priority: item.priority,
        });
      }
    });
  return data;
};

const renderImg = (src) => {
  return (
    <Image
      src={src}
      alt=""
      width={25}
      height={23}
      style={{
        borderRadius: '2px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
      }}
    />
  );
};

const renderBadgeIcon = (hasChanged, icon, changed) => {
  const nbChanges = Object.keys(changed).length;
  return hasChanged ? (
    <Badge count={nbChanges} className="badge-icon">
      {icon}
    </Badge>
  ) : (
    icon
  );
};

const renderTitleTab = (item) => {
  return (
    <>
      {item.name}
      {Object.keys(item.changed).length > 0 && item.changed.review_count && !item.watched_changes && (
        <span className="review-change">
          {getReviewChanges(item.changed.review_count.after, item.changed.review_count.before)}
        </span>
      )}
      {item.built_for_shopify && (
        <Tooltip title="Built for shopify">
          <Image
            src="/image/diamond.svg"
            alt="diamond"
            width={20}
            height={20}
            style={{ marginLeft: '7px', marginBottom: '3px' }}
          />
        </Tooltip>
      )}
      {getNoti(item, true)}
    </>
  );
};

export const renderTabTitle = (item, activeKey, activeState) => {
  return activeKey == 1 ? (
    <div className="tabs-compare">
      {item.data.detail.app_icon ? (
        renderImg(item.data.detail.app_icon)
      ) : (
        <Image
          src="/image/no-image.webp"
          width={25}
          height={23}
          style={{
            borderRadius: '2px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
          }}
          alt="No icon app"
        />
      )}{' '}
      {item.name}
    </div>
  ) : (
    <div className="tabs-compare">
      {renderBadgeIcon(
        Object.keys(item.changed).length > 0,
        <Popover content={<div style={{ color: 'black' }}>{renderTitleTab(item)}</div>}>
          {renderImg(item.app_icon)}
        </Popover>,
        item.changed ? item.changed : {},
      )}
      <div className={activeKey == activeState ? 'tab-visible' : 'tab-expand'}>{renderTitleTab(item)}</div>
    </div>
  );
};

export const renderButtonAddkey = (isOwner, action) => {
  if (!isOwner) {
    return (
      <Popconfirm
        title="To add keywords, you need to add the application to your app list."
        onConfirm={action}
        okText="Add now"
        cancelText="Cancel"
      >
        <Button type="primary">Add</Button>
      </Popconfirm>
    );
  }
  return (
    <div onClick={action} className="add-keyword">
      Add
    </div>
  );
};

export const renderDifficulty = (totalApps) => {
  const percent = (totalApps / 900) * 100;
  switch (true) {
    case percent <= 20:
      return {
        color: '#5cb85c',
        difficulty: 'Very easy',
      };
    case percent <= 40:
      return {
        color: '#8ec06c',
        difficulty: 'Easy',
      };
    case percent <= 60:
      return {
        color: '#f0ad4e',
        difficulty: 'Medium',
      };
    case percent <= 90:
      return {
        color: '#d9534f',
        difficulty: 'Hard',
      };
    default:
      return {
        color: '#c9302c',
        difficulty: 'Very hard',
      };
  }
};

export const scoreCalculate = (total) => {
  const score = Math.round((total / 900) * 100);
  if (score > 100) {
    return 100;
  }
  return score;
};

export const getDiffDay = (item) => {
  var startTime = dayjs(item.install_time);
  var endTime = dayjs(item.uninstall_time);
  var days = endTime.diff(startTime, 'days');
  var s = days + (days > 1 ? ' days' : ' day');
  var ms = endTime.diff(startTime);
  if (days < 0 || ms < 0) {
    return ' ';
  }
  if (days < 1) {
    var duration = dayjs.duration(ms);
    s = Math.floor(duration.asHours()) + dayjs.utc(ms).format(':mm:ss');
  }
  return s;
};

export const checkValueStyle = (value, type) => {
  const percent = value.percent;
  if (type === 'churn') {
    let style = {
      backgroundColor: '#dfcdd1',
      color: '#000',
    };
    if (percent > 90) {
      style.backgroundColor = '#97081c';
      style.color = '#fff';
    } else if (percent > 80) {
      style.backgroundColor = '#a5091c';
      style.color = '#fff';
    } else if (percent > 70) {
      style.backgroundColor = '#b1071e';
      style.color = '#fff';
    } else if (percent > 60) {
      style.backgroundColor = '#b9071c';
      style.color = '#fff';
    } else if (percent > 50) {
      style.backgroundColor = '#c1293b';
      style.color = '#fff';
    } else if (percent > 40) {
      style.backgroundColor = '#d17e8d';
      style.color = '#fff';
    } else if (percent > 30) {
      style.backgroundColor = '#d17e8d';
    } else if (percent > 20) {
      style.backgroundColor = '#d1939e';
    } else if (percent > 10) {
      style.backgroundColor = '#d9b4bb';
    } else if (percent > 0) {
      style.backgroundColor = '#dfcdd1';
    }

    return { ...style, cursor: percent > 0 && value.dateInstall !== 0 ? 'pointer' : 'initial' };
  } else {
    let style = {
      backgroundColor: '#aeefb3',
      color: '#fff',
    };
    if (percent > 90) {
      style.backgroundColor = '#11452e';
    } else if (percent > 80) {
      style.backgroundColor = '#185d3f';
    } else if (percent > 70) {
      style.backgroundColor = '#1f7951';
    } else if (percent > 60) {
      style.backgroundColor = '#1f7952';
    } else if (percent > 50) {
      style.backgroundColor = '#388564';
    } else if (percent > 40) {
      style.backgroundColor = '#4c9776';
    } else if (percent > 30) {
      style.backgroundColor = '#60a688';

      style.color = '#000';
    } else if (percent > 20) {
      style.backgroundColor = '#74af95';
      style.color = '#000';
    } else if (percent > 10) {
      style.backgroundColor = '#86bda5';
      style.color = '#000';
    } else if (percent > 0) {
      style.backgroundColor = '#9ecdb9';
      style.color = '#000';
    } else {
      style.backgroundColor = '#bfe0d2';
      style.color = '#000';
    }

    return { ...style, cursor: value.percent > 0 && value.dateInstall !== 0 ? 'pointer' : 'initial' };
  }
};

export const createData = (dataPosition) => {
  const labels = [];
  const allTypes = [];
  const datasets = [];
  const dateValue = {};
  const datapoints = {};
  dataPosition &&
    dataPosition.map((item) => {
      if (!labels.includes(item.date)) {
        labels.push(item.date);
      }
      if (!allTypes.includes(item.type)) {
        allTypes.push(item.type);
        datapoints[item.type] = [];
      }
      dateValue[item.date + '_' + item.type] = item.value;
    });
  labels.sort();
  labels.map((item) => {
    allTypes.forEach(function (val, key) {
      datapoints[val].push(dateValue.hasOwnProperty(item + '_' + val) ? dateValue[item + '_' + val] : NaN);
    });
  });
  allTypes.map((item, index) => {
    datasets.push({
      label: item,
      data: datapoints[item],
      borderColor: colors[index],
      backgroundColor: colors[index],
      fill: false,
      cubicInterpolationMode: 'monotone',
      tension: 0.4,
      borderWidth: 1.5,
      pointRadius: 2,
      pointHitRadius: 3,
    });
  });
  return {
    labels: labels,
    datasets: datasets,
  };
};

const convertDataFeatures = (data) => {
  let stringDataFeatures = '';
  if (data) {
    data.map((item) => {
      stringDataFeatures += item.description ? item.description + '\n' : '';
      stringDataFeatures += item.img ? item.img + '\n' : '';
      stringDataFeatures += item.title ? item.title + '\n\n' : '';
    });
  }
  return stringDataFeatures;
};

const convertDataImg = (data) => {
  let stringDataImg = '';
  if (data) {
    data.map((item) => {
      stringDataImg += item.alt ? item.alt + '\n' : '';
      stringDataImg += item.src ? item.src + '\n' : '';
    });
  }
  let dataReturn = { dataImg: data, changeLog: stringDataImg };
  return dataReturn;
};

const convertDataPricePlaning = (data) => {
  let stringDataPricePlaning = '';
  if (data) {
    data.map((item) => {
      stringDataPricePlaning += item.alt ? item.alt + '\n' : '';
      stringDataPricePlaning += item.desc ? item.desc + '\n' : '';
      stringDataPricePlaning += item.pricing ? item.pricing + '\n' : '';
      stringDataPricePlaning += item.title ? item.title + '\n\n' : '';
    });
  }
  return stringDataPricePlaning;
};

const convertDataHighlights = (data) => {
  let stringDataHighlights = '';
  if (data) {
    data.map((item) => {
      stringDataHighlights += item ? item + '\n' : '';
    });
  }
  return stringDataHighlights;
};

const convertDataIntegrations = (data) => {
  let stringDataIntegrations = '';
  if (data) {
    data.map((item) => {
      stringDataIntegrations += item ? item + '\n' : '';
    });
  }
  return stringDataIntegrations;
};

export const createDataIntegrationsEqual = (data) => {
  return {
    after: convertDataIntegrations(data.after),
    before: convertDataIntegrations(data.before),
  };
};

export const createDataHighlightsEqual = (data) => {
  return {
    after: convertDataHighlights(data.after),
    before: convertDataHighlights(data.before),
  };
};

export const createDataPricingPlaningEqual = (data) => {
  return {
    after: convertDataPricePlaning(data.after),
    before: convertDataPricePlaning(data.before),
  };
};

export const createDataImgEqual = (data) => {
  return {
    after: convertDataImg(data.after),
    before: convertDataImg(data.before),
  };
};

export const createDataFeaturesEqual = (data) => {
  return {
    after: convertDataFeatures(data.after),
    before: convertDataFeatures(data.before),
  };
};

export const convetDataChartChangeLog = (changeLog) => {
  const dataValue = [];
  changeLog.map((item) => {
    if (item.integrations) {
      dataValue.push({
        x: item.date,
        y: 1,
        data: createDataIntegrationsEqual(item.integrations),
        type: 'integrations',
      });
    }

    if (item.highlights) {
      dataValue.push({
        x: item.date,
        y: 2,
        data: createDataHighlightsEqual(item.highlights),
        type: 'highlights',
      });
    }

    if (item.app_icon) {
      dataValue.push({
        x: item.date,
        y: 3,
        data: item.app_icon,
        type: 'app_icon',
      });
    }

    if (item.video) {
      dataValue.push({
        x: item.date,
        y: 4,
        data: item.video,
        type: 'video',
      });
    }
    if (item.description) {
      dataValue.push({
        x: item.date,
        y: 5,
        data: item.description,
        type: 'description',
      });
    }
    if (item.pricing_plan) {
      dataValue.push({
        x: item.date,
        y: 6,
        data: createDataPricingPlaningEqual(item.pricing_plan),
        type: 'pricing_plan',
      });
    }
    if (item.pricing) {
      dataValue.push({
        x: item.date,
        y: 7,
        data: item.pricing,
        type: 'pricing',
      });
    }
    if (item.img) {
      dataValue.push({
        x: item.date,
        y: 8,
        data: createDataImgEqual(item.img),
        type: 'img',
      });
    }
    if (item.features) {
      dataValue.push({
        x: item.date,
        y: 9,
        data: createDataFeaturesEqual(item.features),
        type: 'features',
      });
    }
    if (item.tagline) {
      dataValue.push({
        x: item.date,
        y: 10,
        data: item.tagline,
        type: 'tagline',
      });
    }
    if (item.name) {
      dataValue.push({
        x: item.date,
        y: 11,
        data: item.name,
        type: 'name',
      });
    }
    if (item.built_for_shopify) {
      dataValue.push({
        x: item.date,
        y: 12,
        data: item.built_for_shopify,
        type: 'built_for_shopify',
      });
    }
  });

  const datasets = [
    {
      label: 'Change log',
      data: dataValue,
      fill: false,
      pointRadius: 3,
      backgroundColor: colors[0],
    },
  ];
  return {
    datasets,
  };
};

export const fetchData = async (url) => {
  const response = await fetch(url, { next: { revalidate: 60 } });
  if (!response.ok) {
    const errorResponse = await response.json().catch(() => ({}));
    throw new Error(errorResponse.message || 'Failed to fetch data');
  }

  return response.json();
};
