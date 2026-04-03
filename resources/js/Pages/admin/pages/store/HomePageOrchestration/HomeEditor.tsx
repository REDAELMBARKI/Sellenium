import { AdminLayout } from '@/admin/components/layout/AdminLayout'
import React from 'react'

function HomeEditor() {
  return (
    <div>HomeEditor</div>
  )
}

export default HomeEditor

HomeEditor.layout = (page : any) => <AdminLayout children={page} />  