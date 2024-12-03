import React, { useEffect, useState } from 'react';
import { Table, Card, Typography, Space } from 'antd';
import { CrownTwoTone } from '@ant-design/icons';

const { Title } = Typography;

interface UserStats {
  _id: string;
  bookingCount: number;
  name?: string;
  email?: string;
}

const TopUsers: React.FC = () => {
  const [data, setData] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTopUsers = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API}/tickets/user-top`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.error('Error fetching top users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopUsers();
  }, []);

  const columns = [
    {
      title: 'Xếp hạng',
      dataIndex: 'rank',
      key: 'rank',
      render: (_: any, __: any, index: number) => (
        <span>
          {index === 0 ? (
            <CrownTwoTone twoToneColor="#FFD700" style={{ fontSize: '16px' }} />
          ) : null}{' '}
          {index + 1}
        </span>
      ),
    },
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: UserStats) =>
        record.name ? text : `User ID: ${record._id}`,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => (email ? email : 'N/A'),
    },
    {
      title: 'Số lượng vé đã đặt',
      dataIndex: 'bookingCount',
      key: 'bookingCount',
    },
  ];

  return (
    <Card style={{ marginTop: 20 }} title={<Title level={4}>Top 5 Users</Title>}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={false}
        />
      </Space>
    </Card>
  );
};

export default TopUsers;
