import { Breadcrumb, Button, PlusIcon } from '~/components'
import { RootState, useAppDispatch } from '~/store/store'
import { IRoleUser } from '~/types'

import { Tabs } from 'antd'
import { useAppSelector } from '~/store/hooks'
import { setOpenDrawer } from '~/store/slices'
import VoucherAdd from './component/FormVoucher/FormVoucher'
import { items } from './data'

const VoucherFeature = () => {
  const dispatch = useAppDispatch()
  const { openDrawer } = useAppSelector((state) => state.drawer)

  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)

  return (
    <div>
      <Breadcrumb pageName='Mã giảm giá'>
        {/* Chỉ hiển thị nút "Thêm" khi người dùng có role là ADMIN */}
        {user && user.role === 'ADMIN' && (
          <Button icon={<PlusIcon />} onClick={() => dispatch(setOpenDrawer(true))}>
            Thêm
          </Button>
        )}
      </Breadcrumb>
      <Tabs defaultActiveKey='1' items={items}></Tabs>
      <VoucherAdd open={openDrawer} />
    </div>
  )
}

export default VoucherFeature
