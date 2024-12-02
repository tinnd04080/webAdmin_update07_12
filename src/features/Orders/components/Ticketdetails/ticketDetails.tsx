import React, { useState } from 'react'
import { Modal, Button } from 'antd'
import { Link } from 'react-router-dom'

type TicketDetail = {
  TicketDetail: {
    startProvince?: string
    endProvince?: string
    boardingPoint?: string
    dropOffPoint?: string
    departureTime?: any
    arrivalTime?: any
    seatNumber?: string[]
    createdAt?: string
  }
}

const TicketDetails = ({ TicketDetail }: TicketDetail) => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  console.log('Thông tin nhận được:', TicketDetail)

  return (
    <>
      <Link to='#' onClick={showModal} style={{ color: '#D91656', fontWeight: '600' }}>
        Xem chi tiết
      </Link>

      <Modal
        title='Chi tiết vé'
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key='submit' type='primary' onClick={handleOk}>
            Đóng
          </Button>
        ]}
      >
        <p>
          Tuyến xe: {TicketDetail.startProvince} đến {TicketDetail.endProvince}
        </p>

        <p>Điểm xuất phát: {TicketDetail.boardingPoint}</p>
        <p>Điểm đến: {TicketDetail.dropOffPoint}</p>
        <p>Ghế đã chọn: {TicketDetail.seatNumber?.join(', ')}</p>
        <p>Thời gian khởi hành: {new Date(TicketDetail.departureTime).toLocaleString()}</p>
        <p>Thời gian đến: {new Date(TicketDetail.arrivalTime).toLocaleString()}</p>
        <p>Thời gian tạo vé: {new Date(TicketDetail.createdAt).toLocaleString()}</p>
      </Modal>
    </>
  )
}

export default TicketDetails
