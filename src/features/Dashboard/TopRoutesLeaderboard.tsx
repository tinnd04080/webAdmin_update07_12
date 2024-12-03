import React, { useState, useEffect } from 'react';
import { Card, Table, Spin, Typography } from 'antd';

interface RouteData {
  rank: number;
  routeName: string;
  tripCount: number;
}

const TopRoutesLeaderboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RouteData[]>([]);

  const fetchTopRoutes = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API}/trips/trip-top`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch top routes');
      }
      const result = await response.json();

      // Gắn số thứ tự (rank) vào từng item
      const rankedData = result.data.map((item: any, index: number) => ({
        rank: index + 1,
        ...item,
      }));

      setData(rankedData);
    } catch (error) {
      console.error('Error fetching top routes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopRoutes();
  }, []);

  const columns = [
    {
      title: 'Hạng',
      dataIndex: 'rank',
      key: 'rank',
      align: 'center' as const,
      render: (rank: number) => (
        <Typography.Text strong style={{ color: rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : rank === 3 ? '#CD7F32' : undefined }}>
          {rank}
        </Typography.Text>
      ),
    },
    {
      title: 'Tên tuyến',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: 'Số chuyến',
      dataIndex: 'tripCount',
      key: 'tripCount',
      align: 'right' as const,
      render: (tripCount: number) => `${tripCount.toLocaleString()} chuyến`,
    },
  ];

  return (
    <Card title="Top 10 tuyến xe có số chuyến nhiều nhất" style={{ marginBottom: 20 }}>
      {loading ? (
        <Spin tip="Đang tải dữ liệu..." />
      ) : (
        <Table
          dataSource={data}
          columns={columns}
          rowKey="rank"
          pagination={false}
          bordered
        />
      )}
    </Card>
  );
};

export default TopRoutesLeaderboard;
