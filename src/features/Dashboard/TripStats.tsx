import React, { useState, useEffect } from 'react';
import { Card, Radio, Space, Typography, DatePicker, Spin } from 'antd';
import { Column } from '@ant-design/plots';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface TripStatsProps {
  title: string;
  apiEndpoint: string;
}

const TripStats: React.FC<TripStatsProps> = ({ title, apiEndpoint }) => {
  const [viewType, setViewType] = useState<'day' | 'month' | 'year'>('day');
  const [range, setRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([dayjs().subtract(1, 'months'), dayjs()]);
  const [data, setData] = useState([]);
  const [totalTrips, setTotalTrips] = useState(0);

  const fetchTripData = async (type: 'day' | 'month' | 'year', startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) => {
    try {
      const accessToken = localStorage.getItem('token');
      const response = await fetch(
        `${apiEndpoint}?type=${type}&startDate=${startDate.format('YYYY-MM-DD')}&endDate=${endDate.format('YYYY-MM-DD')}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();

      setData(result.data);
      setTotalTrips(result.data.reduce((sum: number, item: { trips: number }) => sum + item.tripCount, 0));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchTripData(viewType, range[0], range[1]);
  }, [viewType, range]);

  const disabledDate = (current: dayjs.Dayjs | null) => {
    if (!current) return false;
    const minDate = dayjs().subtract(10, 'years').startOf('day');
    const maxDate = dayjs().endOf('day');
    return current.isBefore(minDate) || current.isAfter(maxDate);
  };

  const handleRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null]) => {
    if (dates[0] && dates[1]) {
      let updatedRange: [dayjs.Dayjs, dayjs.Dayjs] = [dates[0]!, dates[1]!];
      if (viewType === 'month') {
        updatedRange = [dates[0]!.startOf('month'), dates[1]!.endOf('month')];
      } else if (viewType === 'year') {
        updatedRange = [dates[0]!.startOf('year'), dates[1]!.endOf('year')];
      }
      setRange(updatedRange);
    }
  };

  const config = {
    data,
    xField: 'label',
    yField: 'tripCount',
    columnWidthRatio: 0.8,
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    color: '#1890ff'
  };

  return (
    <Card title={title} style={{ marginBottom: 20 }}>
      <Space direction='vertical' style={{ width: '100%' }}>
        <Space>
          <Radio.Group value={viewType} onChange={(e) => setViewType(e.target.value)}>
            <Radio.Button value='day'>Ngày</Radio.Button>
            <Radio.Button value='month'>Tháng</Radio.Button>
            <Radio.Button value='year'>Năm</Radio.Button>
          </Radio.Group>
          <RangePicker
            picker={viewType}
            value={[range[0], range[1]]}
            onChange={handleRangeChange}
            allowClear={false}
            disabledDate={disabledDate}
            format={viewType === 'day' ? 'YYYY-MM-DD' : viewType === 'month' ? 'YYYY-MM' : 'YYYY'}
          />
        </Space>
        <Typography.Text>
          Tổng số chuyến: <Typography.Text strong>{totalTrips.toLocaleString()}</Typography.Text>
        </Typography.Text>
        <Column {...config} style={{ marginTop: 20 }} />
      </Space>
    </Card>
  );
};

export default TripStats;
