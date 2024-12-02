import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs'
import { Button as ButtonAntd, Input, InputRef, Popconfirm, Space, Tag, Tooltip, message } from 'antd'
import { IRoleUser, IVoucher } from '~/types'
import { RootState, useAppDispatch } from '~/store/store'
import { setOpenDrawer, setVoucher } from '~/store/slices'
import { useRef, useState } from 'react'

import { ColumnType } from 'antd/lib/table'
import { FilterConfirmProps } from 'antd/es/table/interface'
import Highlighter from 'react-highlight-words'
import { SearchOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { formatCurrency } from '~/utils'
import { useAppSelector } from '~/store/hooks'
import { useDeleteVoucherMutation } from '~/store/services'

// export const useRenderVoucher = (vouchers: IVoucher[]) => {
export const useRenderVoucher = () => {
  const dispatch = useAppDispatch()

  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)
  const [deleteVoucher] = useDeleteVoucherMutation()

  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)

  const handleSearch = (selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void, dataIndex: IVoucher) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(`${dataIndex}`)
  }

  const handleReset = (clearFilters: () => void) => {
    clearFilters()
    setSearchText('')
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteVoucher({ id }).then(() => {
        message.success('Xoá thành công!')
      })
    } catch (error) {
      message.error('Xoá thất bại!')
    }
  }

  const getColumnSearchProps = (dataIndex: any): ColumnType<any> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Tìm kiếm mã`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <ButtonAntd
            type='primary'
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
          >
            Search
          </ButtonAntd>
          <ButtonAntd onClick={() => clearFilters && handleReset(clearFilters)}>Reset</ButtonAntd>
          <ButtonAntd
            onClick={() => {
              close()
            }}
          >
            close
          </ButtonAntd>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      )
  })
  /* staff */
  const columnsStaff = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 50
    },
    {
      title: 'Mã giảm giá',
      dataIndex: 'code',
      key: 'code',
      width: '20%',
      render: (name: string) => <p className=''>{name}</p>,
      ...getColumnSearchProps('code')
    },

    {
      title: 'Phần trăm giảm giá ',
      dataIndex: 'discountAmount',
      key: 'discountAmount',
      width: '12%',
      render: (discount: number) => `${discount}` + ' %'
    },
    {
      title: 'Số lượng mã được phát hành',
      dataIndex: 'quantity',
      key: 'quantity',
      width: '15%',
      render: (quantity: string) => <p>{quantity} mã</p>
    },
    {
      title: 'Số lượng mã còn lại',
      dataIndex: 'remainingCount',
      key: 'remainingCount',
      width: '12%',
      render: (remainingCount: string) => <p>{remainingCount} mã</p>
    },
    {
      title: 'Thời gian',
      key: 'action',
      width: '15%',
      render: (_: boolean, data: IVoucher) => (
        <span>
          Từ: {dayjs(data.startDate).format('DD-MM-YYYY')} <br /> Đến: {dayjs(data.endDate).format('DD-MM-YYYY')}
        </span>
      )
    },
    {
      title: 'Mô tả ',
      dataIndex: 'description',
      key: 'description',
      width: '25%',
      render: (name: string) => <p className='uppercase'>{name}</p>,
      ...getColumnSearchProps('description')
    },
    /* {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      render: (status: string) => <p className='uppercase'>{status}</p>,
      ...getColumnSearchProps('status')
    } */
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status: string) => (
        <>
          <Tag color={status === 'EXPIRED' ? 'error' : 'green'} className=''>
            {status === 'EXPIRED' ? 'Hết hạng' : 'Đang hoạt động'}
          </Tag>
        </>
      )
    }
  ]

  /* admin */
  const columnsAdmin = [
    ...columnsStaff,

    {
      // title: <span className='block text-center'>Action</span>,
      key: 'action',
      width: 200,
      render: (_: any, voucher: IVoucher) => (
        <div className='flex items-center justify-center'>
          <Space size='middle'>
            <Tooltip title='Cập nhật voucher này'>
              <ButtonAntd
                size='large'
                className='bg-primary hover:!text-white flex items-center justify-center text-white'
                icon={<BsFillPencilFill />}
                onClick={() => {
                  dispatch(setVoucher(voucher))
                  dispatch(setOpenDrawer(true))
                }}
              />
            </Tooltip>
            {/* <Tooltip title='Xóa voucher này'>
              <Popconfirm
                title='Bạn có muốn xóa voucher này?'
                description='Bạn chắc chắn muốn xóa voucher này?'
                okButtonProps={{ style: { backgroundColor: '#3C50E0', color: '#fff' } }}
                okText='Có'
                cancelText='Không'
                onConfirm={() => handleDelete(voucher._id!)}
              >
                <ButtonAntd
                  size='large'
                  className='bg-meta-1 hover:!text-white flex items-center justify-center text-white'
                  icon={<BsFillTrashFill />}
                />
              </Popconfirm>
            </Tooltip> */}
          </Space>
        </div>
      )
    }
  ]
  // return user && user.role === IRoleUser.ADMIN ? columnsAdmin : columnsStaff/
  return columnsAdmin
}
