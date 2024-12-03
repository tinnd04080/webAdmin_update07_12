import React, { useState } from 'react'
import { Modal, Button } from 'antd'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faEye } from '@fortawesome/free-solid-svg-icons'
import { faAnglesRight, faBus, faUser, faWallet } from '@fortawesome/free-solid-svg-icons'
import { formatCurrency } from '~/utils'
import './style.css' // Import CSS file

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
    paymentMethod?: string
    invoiceCode?: string
    customerPhone?: number
    customerName?: string
    note?: string
    totalPrice?: number
  }
}

const TicketDetails = ({ TicketDetail }: TicketDetail) => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  function formatDateTime(dateString: string): JSX.Element {
    const date = new Date(dateString)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()

    return (
      <>
        {hours}:{minutes} {day}/{month}/{year}
      </>
    )
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <>
      <Link to='#' className='view-detail-link' onClick={showModal}>
        <FontAwesomeIcon icon={faEye} size='2x' />
      </Link>

      <Modal
        title={<div className='modal-title'>Chi tiết vé</div>}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key='submit' type='primary' onClick={handleOk}>
            Đóng
          </Button>
        ]}
      >
        <div className='modal-wrapper'>
          <div className='modal-title'>
            <FontAwesomeIcon icon={faBus} /> Thông tin chuyến xe
          </div>
          <div className='info-group'>
            <p className='info-title'>Tuyến xe:</p>
            <p className='info-content'>
              {TicketDetail.startProvince} <FontAwesomeIcon icon={faAnglesRight} /> {TicketDetail.endProvince}
            </p>
          </div>
          <div className='info-group'>
            <p className='info-title'>Điểm xuất phát:</p>
            <p className='info-content'>{TicketDetail.boardingPoint}</p>
          </div>

          <div className='info-group'>
            <p className='info-title'>Điểm đến:</p>
            <p className='info-content'>{TicketDetail.dropOffPoint}</p>
          </div>

          <div className='info-group'>
            <p className='info-title'>Ghế đã chọn:</p>
            <p className='info-content'>{TicketDetail.seatNumber?.join(', ')}</p>
          </div>

          <div className='info-group'>
            <p className='info-title'>Thời gian khởi hành:</p>
            <p className='info-content'>{formatDateTime(TicketDetail.departureTime)}</p>
          </div>

          <div className='info-group'>
            <p className='info-title'>Thời gian dự kiến đến:</p>
            <p className='info-content'>{formatDateTime(TicketDetail.arrivalTime)}</p>
          </div>

          <div className='info-group'>
            <p className='info-title'>Thời điểm tạo vé:</p>
            <p className='info-content'>{formatDateTime(TicketDetail.createdAt)}</p>
          </div>

          <div className='modal-title'>
            <FontAwesomeIcon icon={faUser} /> Thông tin khách hàng
          </div>
          <div className='info-group'>
            <p className='info-title'>Tên khách hàng:</p>
            <p className='info-content'>{TicketDetail.customerName}</p>
          </div>
          <div className='info-group'>
            <p className='info-title'>Số điện thoại:</p>
            <p className='info-content'>{TicketDetail.customerPhone}</p>
          </div>
          <div className='info-group'>
            <p className='info-title'>Ghi chú:</p>
            <p className='info-content'>{TicketDetail.note ? TicketDetail.note : 'Không có'}</p>
          </div>
          <div className='modal-title'>
            <FontAwesomeIcon icon={faWallet} /> Thông tin thanh toán
          </div>
          <div className='info-group'>
            <p className='info-title'>Tổng tiền:</p>
            <p className='info-content'>{formatCurrency(TicketDetail.totalPrice)}</p>
          </div>
          <div className='info-group'>
            <p className='info-title'> Phương thức thanh toán:</p>
            <p className='info-content'>
              {TicketDetail.paymentMethod === 'ZALOPAY'
                ? 'Zalopay'
                : TicketDetail.paymentMethod === 'OFFLINEPAYMENT'
                  ? 'Thanh toán tại bến'
                  : TicketDetail.paymentMethod === 'PENDING'
                    ? 'Chờ xử lý'
                    : 'Chưa xác định'}
            </p>
          </div>

          <div className='info-group'>
            <p className='info-title'>Mã hóa đơn:</p>
            <p className='info-content'>{TicketDetail.invoiceCode ? TicketDetail.invoiceCode : 'Chưa có'}</p>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default TicketDetails
