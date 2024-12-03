import { Button, Col, DatePicker, Drawer, Form, Input, InputNumber, Row, Select, Space, message } from 'antd'
import { ICategory, IImage, IProduct, ISize, ITopping } from '~/types'
import { RootState, useAppDispatch } from '~/store/store'
import { setOpenDrawer, setProductId } from '~/store/slices'
import {
  useCreateProductMutation,
  useCreateTripsMutation,
  useEditProductMutation,
  useEditTripsMutation,
  useGetAllBusRouteQuery,
  useGetAllCategoryQuery,
  useGetAllProductsQuery,
  useGetAllSizeDefaultQuery,
  useGetAllToppingsQuery
} from '~/store/services'
import { useEffect, useState } from 'react'
import { Loading } from '~/components'
import { handleUploadImage } from '../..'
import { useAppSelector } from '~/store/hooks'
import moment from 'moment'
import dayjs from 'dayjs' // Import dayjs để xử lý ngày giờ
const { Option } = Select
const FormProduct = () => {
  const [form] = Form.useForm()
  const dispatch = useAppDispatch()
  const { openDrawer } = useAppSelector((state: RootState) => state.drawer)
  const { product } = useAppSelector((state: RootState) => state.products)
  const [infoPage, _] = useState({
    _page: 1,
    _limit: 10
  })
  const [productEdit, setProductEdit] = useState<IProduct | null>(null)
  const { productId } = useAppSelector((state) => state.products)
  const [createProduct, { isLoading: isCreateLoading }] = useCreateTripsMutation()
  const { productsList } = useAppSelector((state: RootState) => state.products)
  const [editProduct, { isLoading: isUpdating }] = useEditTripsMutation()
  const {
    data: dataProducts,
    isLoading: loadingProduct,
    isError: errorProudct
  } = useGetAllProductsQuery({
    _page: 1,
    _limit: 10,
    query: ''
  })
  const { data: dataBusRoute } = useGetAllBusRouteQuery({
    _page: 1,
    _limit: 10,
    query: ''
  })
  console.log(productEdit, 'productEdit')

  const handleSubmitForm = async (values: any) => {
    // Chuyển giá trị thời gian (departureTime và arrivalTime) sang định dạng ISO 8601
    if (values.departureTime) {
      values.departureTime = dayjs(values.departureTime).toISOString() // Chuyển departureTime sang ISO 8601
    }
    if (values.arrivalTime) {
      values.arrivalTime = dayjs(values.arrivalTime).toISOString() // Chuyển arrivalTime sang ISO 8601
    }

    // Nếu có productId và productEdit thì thực hiện cập nhật
    if (productId && productEdit) {
      const data = {
        ...values
      }
      try {
        const response = await editProduct({ id: productEdit._id, product: data }).unwrap()
        if (response.message === 'success') {
          message.success('Cập nhật thành công!')
        }
        dispatch(setOpenDrawer(false))
        dispatch(setProductId(null))
        form.resetFields() // Reset form sau khi gửi thành công
      } catch (error: any) {
        // Lấy thông báo lỗi từ backend
        const errorMessage = error.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau!'
        message.error(errorMessage)
      }
      return
    }

    // Nếu không có productId và productEdit, thì thực hiện tạo mới
    try {
      const response = await createProduct({ ...values }).unwrap()
      if (response.message === 'success' || response.message === 'succes') {
        message.success('Thêm Chuyến xe thành công!')
      }
      dispatch(setOpenDrawer(false))
      dispatch(setProductId(null))
      form.resetFields() // Reset form sau khi gửi thành công
    } catch (error: any) {
      // Lấy thông báo lỗi từ backend
      const errorMessage = error.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau!'
      message.error(errorMessage)
    }
  }
  useEffect(() => {
    if (productEdit) {
      form.setFieldsValue({
        route: productEdit.route?._id,
        bus: productEdit.bus?._id,
        status: productEdit?.status,
        departureTime: productEdit?.departureTime ? moment(productEdit.departureTime) : null,
        arrivalTime: productEdit?.arrivalTime ? moment(productEdit.arrivalTime) : null
      })
    }
  }, [
    form,
    productEdit,
    productsList.route,
    productsList.arrivalTime,
    productsList.departureTime,
    productsList.seatCapacity,
    productEdit?.status
  ])
  useEffect(() => {
    if (productId) {
      const product = productsList?.data?.find((product) => product._id === productId)

      if (product) setProductEdit(product)
    } else {
      setProductEdit(null)
    }
  }, [productId, productsList])
  return (
    <Drawer
      title={`${productId === null ? 'Thêm' : 'Cập nhật'} Xe`}
      placement='right'
      width={850}
      destroyOnClose
      onClose={() => {
        dispatch(setOpenDrawer(false))
        dispatch(setProductId(null))
      }}
      open={product ? false : openDrawer}
      extra={
        <Space>
          <label
            htmlFor='button-submit-form'
            onClick={() => {}}
            className='bg-primary py-2 px-4 flex justify-center items-center h-[44px] text-white rounded-lg cursor-pointer'
          >
            {!isCreateLoading && <p>{productId === null ? 'Thêm' : 'Cập nhật'} </p>}
            {isCreateLoading && (
              <div className='border-t-primary animate-spin w-6 h-6 border-2 border-t-2 border-white rounded-full'></div>
            )}
          </label>
        </Space>
      }
    >
      {(isCreateLoading || isUpdating) && <Loading overlay />}
      <Form layout='vertical' autoComplete='off' form={form} onFinish={handleSubmitForm}>
        <Row gutter={16}>
          <Col span={12}>
            {/* <Form.Item
              name='bus'
              label='Xe'
              rules={[{ required: productEdit ? false : true, message: 'Xe là bắt buộc' }]}
            > */}
            {/* <Select placeholder='Chọn Xe' size='large' allowClear>
                {dataProducts?.data?.map((size) => (
                  <Option value={size._id} key={size._id}>
                    <span className='text-sm capitalize'>
                      <span className='capitalize'>{size.licensePlate}</span>
                    </span>
                  </Option>
                ))}
              </Select> */}
            {/*  <Select placeholder='Chọn Xe' size='large' allowClear>
                {dataProducts?.data
                  ?.filter((size) => size.status === 'OPEN') // Lọc ra những xe có trạng thái OPEN
                  .map((size) => (
                    <Option value={size._id} key={size._id}>
                      <span className='text-sm capitalize'>
                        <span className='capitalize'>{size.licensePlate}</span>
                      </span>
                    </Option>
                  ))}
              </Select> */}
            {/* </Form.Item> */}
            <Form.Item
              name='bus'
              label='Xe'
              rules={[{ required: productEdit ? false : true, message: 'Xe là bắt buộc' }]}
            >
              <Select placeholder='Chọn Xe' size='large' allowClear>
                {dataProducts?.data
                  ?.filter((bus) => bus.status === 'OPEN') // Lọc các xe có trạng thái OPEN
                  .map((bus) => (
                    <Option value={bus._id} key={bus._id}>
                      <span className='text-sm capitalize'>
                        <span className='capitalize'>{bus.licensePlate}</span> - {/* Biển số xe */}
                        <span>Xe {bus.busTypeName}</span> - {/* Tên xe */}
                        <span>{bus.seatCapacity} ghế</span> {/* Số lượng ghế */}
                      </span>
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='route'
              label='Chuyến'
              rules={[{ required: productEdit ? false : true, message: 'Chuyến là bắt buộc' }]}
            >
              {/* <Select placeholder='Chọn Chuyến' size='large' allowClear>
                {dataBusRoute?.data?.map((size) => (
                  <Option value={size._id} key={size._id}>
                    <span className='text-sm capitalize'>
                      <span className='capitalize'>
                        {size.startProvince} - {size.endProvince}
                      </span>
                    </span>
                  </Option>
                ))}
              </Select> */}
              <Select placeholder='Chọn Chuyến' size='large' allowClear>
                {dataBusRoute?.data
                  ?.filter((size) => size.status === 'OPEN') // Lọc ra những chuyến có trạng thái OPEN
                  .map((size) => (
                    <Option value={size._id} key={size._id}>
                      <span className='text-sm capitalize'>
                        <span className='capitalize'>
                          {size.startProvince} - {size.endProvince}
                        </span>
                      </span>
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='departureTime'
              label='Giờ khởi hành'
              rules={[{ required: true, message: 'Giờ khởi hành là bắt buộc' }]}
            >
              <DatePicker
                showTime
                format='YYYY-MM-DD HH:mm:ss'
                className='w-full'
                disabledDate={(current) => {
                  // Disable dates before today
                  return current && current.isBefore(dayjs().startOf('day'), 'day')
                }}
                // Disable times for today
                disabledTime={(current) => {
                  if (current && current.isSame(dayjs(), 'day')) {
                    const now = dayjs()
                    return {
                      disabledHours: () => Array.from({ length: 24 }, (_, i) => i).filter((hour) => hour < now.hour()),
                      disabledMinutes: (hour) =>
                        hour === now.hour()
                          ? Array.from({ length: 60 }, (_, i) => i).filter((minute) => minute < now.minute())
                          : [],
                      disabledSeconds: (hour, minute) =>
                        hour === now.hour() && minute === now.minute()
                          ? Array.from({ length: 60 }, (_, i) => i).filter((second) => second < now.second())
                          : []
                    }
                  }
                  return {} // Không vô hiệu hóa thời gian khi không phải ngày hôm nay
                }}
                onChange={(value) => {
                  // Khi người dùng chọn thời gian, chuyển nó thành ISO 8601
                  const isoDate = value ? value.toISOString() : '' // Chuyển về ISO 8601
                  console.log('Giờ đến (ISO 8601):', isoDate)
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='arrivalTime' label='Giờ đến' rules={[{ required: true, message: 'Giờ đến là bắt buộc' }]}>
              <DatePicker
                showTime
                format='YYYY-MM-DD HH:mm:ss'
                className='w-full'
                disabledDate={(current) => {
                  // Disable dates before today
                  return current && current.isBefore(dayjs().startOf('day'), 'day')
                }}
                // Disable times for today
                disabledTime={(current) => {
                  if (current && current.isSame(dayjs(), 'day')) {
                    const now = dayjs()
                    return {
                      disabledHours: () => Array.from({ length: 24 }, (_, i) => i).filter((hour) => hour < now.hour()),
                      disabledMinutes: (hour) =>
                        hour === now.hour()
                          ? Array.from({ length: 60 }, (_, i) => i).filter((minute) => minute < now.minute())
                          : [],
                      disabledSeconds: (hour, minute) =>
                        hour === now.hour() && minute === now.minute()
                          ? Array.from({ length: 60 }, (_, i) => i).filter((second) => second < now.second())
                          : []
                    }
                  }
                  return {} // Không vô hiệu hóa thời gian khi không phải ngày hôm nay
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='status'
              label='Trạng thái hoạt động'
              rules={[{ required: true, message: 'Trạng thái hoạt động Không được bỏ trống!' }]}
            >
              <Select placeholder='Vui lòng chọn trạng thái'>
                <Select.Option value={'OPEN'}>Hoạt động</Select.Option>
                <Select.Option value={'CLOSED'}>Ngừng hoạt động</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <input type='submit' id='button-submit-form' value={'gửi'} className='hidden' />
      </Form>
    </Drawer>
  )
}
export default FormProduct
