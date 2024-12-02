import ListCancelOrders from '../components/ListCancelOrders'
import ListConfirmOrders from '../components/ListConfirmOrders/ListConfirmOrders'
import ListDoneOrders from '../components/ListDoneOrders/ListDoneOrders'
import ListPendingOrders from '../components/ListPendingOrders/ListPendingOrders'

// export const items = [
//   // { key: '1', label: 'Tất cả đơn hàng', children: <ListOrders /> },
//   { key: '2', label: 'Chờ xác nhận', children: <ListPendingOrders /> },
//   { key: '3', label: 'Đã xác nhận', children: <ListConfirmOrders /> },
//   { key: '4', label: 'Hoàn thành', children: <ListDoneOrders /> },
//   { key: '5', label: 'Đã hủy', children: <ListCancelOrders /> }
// ]

export const items = [
  // { key: '1', label: 'Tất cả đơn hàng', children: <ListOrders /> },
  { key: '2', label: 'Vé chưa xác nhận thanh toán', children: <ListPendingOrders /> },
  { key: '3', label: 'Vé đã thanh toán', children: <ListConfirmOrders /> },
  { key: '4', label: 'Vé thanh toán thất bại', children: <ListDoneOrders /> },
  { key: '5', label: 'Vé đã bị hủy', children: <ListCancelOrders /> }
]
