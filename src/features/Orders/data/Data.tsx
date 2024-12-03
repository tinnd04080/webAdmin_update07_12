import ListCancelOrders from '../components/ListCancelOrders'
import ListConfirmOrders from '../components/ListConfirmOrders/ListConfirmOrders'
import ListDoneOrders from '../components/ListDoneOrders/ListDoneOrders'
import ListPendingOrders from '../components/ListPendingOrders/ListPendingOrders'
import ListOrders from '../components/ListOrders/ListOrders'

// export const items = [
//   // { key: '1', label: 'Tất cả đơn hàng', children: <ListOrders /> },
//   { key: '2', label: 'Chờ xác nhận', children: <ListPendingOrders /> },
//   { key: '3', label: 'Đã xác nhận', children: <ListConfirmOrders /> },
//   { key: '4', label: 'Hoàn thành', children: <ListDoneOrders /> },
//   { key: '5', label: 'Đã hủy', children: <ListCancelOrders /> }
// ]

export const items = [
  // { key: '1', label: 'Tất cả đơn hàng', children: <ListOrders /> },
  /* { key: '1', label: 'Vé mới tạo', children: <ListPendingOrders /> }, */
  { key: '2', label: 'Vé chưa thanh toán', children: <ListPendingOrders /> },
  { key: '3', label: 'Vé đã thanh toán', children: <ListConfirmOrders /> },
  { key: '4', label: 'Vé đã bị hủy', children: <ListCancelOrders /> },
  { key: '5', label: 'Vé thanh toán thất bại', children: <ListDoneOrders /> }
]
